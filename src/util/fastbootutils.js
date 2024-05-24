const {execSync} = require('child_process');
const iconv = require("iconv-lite");
const path = require("path");
let fbUrl = path.resolve("\./public\\platform-tools\\fastboot");

class FastbootCommands {
    constructor(serial = null) {
        this.serial = serial;
    }

    async runFbCmd(command, args = []) {
        const cmd = fbUrl + `${this.serial ? ` -s ${this.serial}` : ''} ${command} ${args.join(' ')}`;
        try {
            // console.log('result'+cmd);
            const result = await execSync(cmd);
            return iconv.decode(result, 'cp936') 
            // return result
        } catch (error) {
            console.error('执行fastboot命令时出错:', error);
            return null; // 或者抛出错误，取决于您如何处理错误情况  
        }
    }
    // 获取Fastboot连接的设备列表
    async getFbDeviceList() {
        try {
            const devicesOutput = await this.runFbCmd('devices', []);
            // console.log('dev'+devicesOutput);
            const lines = devicesOutput.split('\n');
            const phonelist = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                // console.log('line'+line);
                if (line && !line.includes("offline")) {
                    // 假设每行输出格式为 "设备ID\t状态"  
                    const parts = line.split('\t');
                    if (parts.length > 0) {
                        phonelist.push(parts[0]); // 提取设备ID  
                    }
                } else if (line.includes("offline")) {
                    return "offline"; // 发现offline状态，则返回  
                }
            }

            if (phonelist.length === 0) {
                phonelist.push('暂无设备链接'); // 如果没有设备，添加提示信息  
            }
            return phonelist;
        } catch (error) {
            console.error('Error occurred while getting device list:', error);
            return []; // 如果出现错误，返回空数组或抛出错误  
        }
    }
    //获取手机所有信息
    async listPhoneInformation() {  
        const list = []
        //获取代号 product
        const product = await this.GetProduct()
        list.push(product)
        //获取序列号 serialno
        const serialno = await this.GetSerialno()
        list.push(serialno)
        //获取槽位 current-slot
        try {  
            const slot = await this.GetSlot();  
            list.push(slot);  
        } catch (error) {  
            list.push('权限不足'); // 如果失败，将错误信息添加到列表中  
        }  
        //获取解锁状态 unlocked
        const unlocked = await this.GetUnlocked()
        list.push(unlocked)
        //获取boot大小 partition-size:boot
        try {  
            const boot = await this.GetSizeboot();  
            list.push(boot);  
        } catch (error) {  
            list.push('权限不足'); // 如果失败，将错误信息添加到列表中  
        }  
        //获取init_boot partition-size:init_boot
        try {  
            const initboot = await this.GetSizeinitboot();  
            list.push(initboot);  
        } catch (error) {  
            list.push('权限不足'); // 如果失败，将错误信息添加到列表中  
        }  

        console.log('list' + list);
        return list
    }
    //通用办法 要求：传进是Fastboot函数，可传多个
    async FbTool(args = []) {
        // console.log('util'+ args);
        const brand = await this.runFbCmd(args);
        // console.log('brand' + brand);
        return brand;
    }

    async GetProduct(){//获取代号 product
        try {  
            const devicesOutput = await this.runFbCmd('getvar', ['product']);  
            // console.log('66666'+devicesOutput);
            const lines = devicesOutput.split('\n');  
            for (let i = 0; i < lines.length; i++) {  
                const line = lines[i].trim();  
                if (line) {  
                    // 假设每行输出格式为 "设备ID\t状态"  
                    const parts = line.split('\t');  
                    if (parts.length > 1) {  
                        // 检查状态是否表示设备在线  
                        if (!parts[1].includes("offline")) {  
                            // 提取product的值  
                            console.log('00000000');
                            const productMatch = parts[0].match(/^product:\s*(.*)$/);  
                            console.log(line)
                            console.log(productMatch)
                            if (productMatch) {  
                                return productMatch[1]; // 返回匹配到的product值  
                            }  
                        }  
                    } 
                }  
            }
            // 如果没有找到在线设备，返回null或适当的信息  
            return null; // 或者返回 '没有找到在线设备' 等信息  
        } catch (error) {  
            console.error('获取设备列表时发生错误:', error);  
            return null; // 如果出现错误，返回null或抛出错误  
        }  
    }

    async GetSerialno() {  //获取序列号 serialno
        try {  
            const serialnoOutput = await this.runFbCmd('getvar', ['serialno']);  
            const line = serialnoOutput.trim(); // 去除字符串两端的空白字符  
            if (line) {  
                // 假设每行输出格式为 "serialno: 值"  
                const parts = line.split(':'); // 使用冒号来分割字符串  
                if (parts.length > 1) {  
                    // 去除值两端的空白字符并返回
                    console.log('serialno:'+parts[1].trim());  
                    return parts[1].trim();  
                }  
            }  
            // 如果没有找到serialno的值，返回null或适当的信息  
            return null; // 或者返回 '没有找到serialno的值' 等信息  
        } catch (error) {  
            console.error('获取serialno时发生错误:', error);  
            return null; // 如果出现错误，返回null或抛出错误  
        }  
    }

    async GetSlot(){//获取槽位 current-slot
        try {  
            const devicesOutput = await this.runFbCmd('getvar', ['current-slot']);  
            const lines = devicesOutput.split('\n');  
            for (let i = 0; i < lines.length; i++) {  
                const line = lines[i].trim();  
                if (line) {  
                    // 假设每行输出格式为 "设备ID\t状态"  
                    const parts = line.split('\t');  
                    if (parts.length > 1 && !parts[1].includes("offline")) {  
                        // 返回第一个在线设备的ID  
                        return parts[0];  
                    }  
                }  
            }
            // 如果没有找到在线设备，返回null或适当的信息  
            return null; // 或者返回 '没有找到在线设备' 等信息  
        } catch (error) {  
            console.error('获取设备列表时发生错误:', error);  
            return null; // 如果出现错误，返回null或抛出错误  
        } 
    }

    async GetUnlocked(){//获取解锁状态 unlocked
        try {  
            const devicesOutput = await this.runFbCmd('getvar', ['unlocked']);  
            const lines = devicesOutput.split('\n');  
            for (let i = 0; i < lines.length; i++) {  
                const line = lines[i].trim();  
                if (line) {  
                    // 假设每行输出格式为 "设备ID\t状态"  
                    const parts = line.split('\t');  
                    if (parts.length > 1 && !parts[1].includes("offline")) {  
                        // 返回第一个在线设备的ID  
                        return parts[0];  
                    }  
                }  
            }
            // 如果没有找到在线设备，返回null或适当的信息  
            return null; // 或者返回 '没有找到在线设备' 等信息  
        } catch (error) {  
            console.error('获取设备列表时发生错误:', error);  
            return null; // 如果出现错误，返回null或抛出错误  
        } 
    }

    async GetSizeboot(){//获取boot大小 partition-size:boot
        try {  
            const devicesOutput = await this.runFbCmd('getvar', ['artition-size:boot']);  
            const lines = devicesOutput.split('\n');  
            for (let i = 0; i < lines.length; i++) {  
                const line = lines[i].trim();  
                if (line) {  
                    // 假设每行输出格式为 "设备ID\t状态"  
                    const parts = line.split('\t');  
                    if (parts.length > 1 && !parts[1].includes("offline")) {  
                        // 返回第一个在线设备的ID  
                        return parts[0];  
                    }  
                }  
            }
            // 如果没有找到在线设备，返回null或适当的信息  
            return null; // 或者返回 '没有找到在线设备' 等信息  
        } catch (error) {  
            console.error('获取设备列表时发生错误:', error);  
            return null; // 如果出现错误，返回null或抛出错误  
        } 
    }

    async GetSizeinitboot(){//获取init_boot partition-size:init_boot
        try {  
            const devicesOutput = await this.runFbCmd('getvar', ['partition-size:init_boot']);  
            const lines = devicesOutput.split('\n');  
            for (let i = 0; i < lines.length; i++) {  
                const line = lines[i].trim();  
                if (line) {  
                    // 假设每行输出格式为 "设备ID\t状态"  
                    const parts = line.split('\t');  
                    if (parts.length > 1 && !parts[1].includes("offline")) {  
                        // 返回第一个在线设备的ID  
                        return parts[0];  
                    }  
                }  
            }
            // 如果没有找到在线设备，返回null或适当的信息  
            return null; // 或者返回 '没有找到在线设备' 等信息  
        } catch (error) {  
            console.error('获取设备列表时发生错误:', error);  
            return null; // 如果出现错误，返回null或抛出错误  
        } 
    }
}

module.exports = FastbootCommands;