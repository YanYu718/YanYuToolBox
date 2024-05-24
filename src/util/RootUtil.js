// const axios = require('axios');
// const puppeteer = require('puppeteer');
const iconv = require("iconv-lite");
const path = require("path");
const {
    execSync
} = require('child_process');
let adbUrl = path.resolve("\./public\\platform-tools\\adb");

class RootUtil {

    constructor(serial = null) {
        this.serial = serial;
    }


    PhoneTextList = [{
            code: ['getprop', ['ro.product.marketname']] //设备名称
        },
        {
            code: ['getprop', ['ro.product.locale']] //设备版别
        },
        {
            code: ['getprop', ['ro.product.name']] //设备代号
        },
        {
            code: ['getprop', ['ro.build.version.release']] //安卓版本
        },
        {
            code: ['getprop', ['ro.mi.os.version.incremental']] //系统版本
        },
        {
            code: ['getprop', ['ro.serialno']] //sn码
        }
    ]

    // 执行adb相关指令
    RootTool(command, args = []) {
        const cmd = adbUrl + `${this.serial ? ` -s ${this.serial}` : ''} ${command} ${args.join(' ')}`;
        console.log(cmd);
        try {
            // console.log('cmd:',cmd);
            const result = execSync(cmd);
            return iconv.decode(result, 'cp936')
        } catch (error) {
            // console.error(`执行命令失败:`, error)
            // return null; // 重新抛出错误，以便调用者可以处理它
        }
    }

    //获取手机必要信息-信息列表
    async RootInformation() {
        try {
            const input = this.PhoneTextList
            const devices = [];
            for (let i = 0; i < this.PhoneTextList.length; i++) {
                const array = await [`${input[i].code[0]}`, `${input[i].code[1]}`]
                const output = this.RootTool('shell', array)
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

    // 获取adb连接的设备列表
    async getDeviceList() {
        const devices = await this.RootTool('devices');
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

}

module.exports = RootUtil