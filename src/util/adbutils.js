const {execSync} = require('child_process');
const iconv = require("iconv-lite");
const path = require("path");
let adbUrl = path.resolve("\./public\\platform-tools\\adb");

class AdbCommands {

    constructor(serial = null) {
        this.serial = serial;
    }


    Information = [{
            name: 'Machine',
            code: ['getprop', ['ro.product.marketname']]
        }, //设备信息
        {
            name: 'Model',
            code: ['getprop', ['ro.product.model']]
        }, //手机型号
        {
            name: 'Brand',
            code: ['getprop', ['ro.product.manufacturer']]
        }, //品牌
        {
            name: 'Time',
            code: ['getprop', ['ro.product.model']]
        }, //开机时间
        {
            name: 'designation',
            code: ['getprop', ['ro.product.name']]
        }, //代号
        {
            name: 'system',
            code: ['getprop', ['ro.build.version.release']]
        }, //系统
        {
            name: 'Motherboard',
            code: ['getprop', ['ro.serialno']]
        }, //主板id
        {
            name: 'processing',
            code: ['getprop', ['ro.soc.manufacturer']]
        }, //cpu
        {
            name: 'Resolution',
            code: ['getprop', ['ro.system.product.cpu.abilist64']]
        }, //分辨率
        {
            name: 'density',
            code: ['getprop', ['ro.sf.lcd_density']]
        }, //密度
        {
            name: 'battery',
            code: ['getprop', ['wm', 'density']]
        }, //电池
        {
            name: 'platform',
            code: ['getprop', ['ro.gfx.driver.1']]
        }, //平台
        {
            name: 'SystemVersion',
            code: ['getprop', ['ro.mi.os.version.incremental']]
        }, //UI版本
        {
            name: 'Kernel',
            code: ['uname', ['-r']]
        }, //内核版本
    ]

    // 执行adb相关指令
    runCmd(command, args = []) {
        const cmd = adbUrl + `${this.serial ? ` -s ${this.serial}` : ''} ${command} ${args.join(' ')}`;
        try {
            const result = execSync(cmd);
            return iconv.decode(result, 'cp936')
        } catch (error) {
            // console.error(`执行命令失败:`, error)
            // return null; // 重新抛出错误
        }
    }

    //获取手机所有信息
    async listPhoneInformation() {
        try {
            const input = this.Information
            const devices = [];
            for (let i = 0; i < this.Information.length; i++) {
                const array = await [`${input[i].code[0]}`, `${input[i].code[1]}`]
                const output = this.runCmd('shell', array)
                if (!output) {
                    break;
                }
                output.replace(/\r\n$/, '');
                // console.log('util' + output);
                devices.push(output)
            }
            // console.log(devices);
            return devices;
        } catch (error) {
            console.log('获取设备列表时发生错误:', error);
            return [];
        }
    }

    //通用办法 要求：传进第一个参数 默认shell 后面是Adb函数，可传多个
    async AdbTool(args = []) {
        // console.log('util'+ args);
        const brand = await this.runCmd('shell', args);
        // console.log('brand' + brand);
        return brand;
    }

    // 获取adb连接的设备列表
    async getDeviceList() {
        const devices = await this.runCmd('devices');
        let line = devices
        line = line.split('\n');
        var res = new Array();
        var phonelist = []
        if (line.length > 0) {
            for (var i = 1; i < line.length; i++) {
                if (line[i]) {
                    var temp = line[i].replace(/(^\s*)|(\s*$)/g, "");
                    if (temp) {

                        if (line[i].split('\t')[1].indexOf("offline") != -1) {
                            return "offline"
                        }
                        res[i - 1] = line[i].split('\t')[0];
                        phonelist.push(res[i - 1])
                    }
                }
            }
            if (phonelist.length <= 0) {
                phonelist.push('暂无设备链接')
            }

        }
        return phonelist
    }

    // 安装apk文件
    async installApk(packageName) {
        try {
            await this.runCmd('install', [packageName]);
            return true;
        } catch (error) {
            return false;
        }
    }
    // 卸载应用程序
    async uninstall(packageName) {
        try {
            await this.runCmd('uninstall', [packageName]);
            return true;
        } catch (error) {
            return false;
        }
    }
    
    // 打开应用程序
    async openApp(packageName, activityName) {
        return this.runCmd('shell', ['am', 'start', '-n', `${packageName}/${activityName}`]);
    }
    // 关闭应用程序
    async closeApp(packageName) {
        return this.runCmd('shell', ['am', 'force-stop', packageName]);
    }
}

module.exports = AdbCommands;