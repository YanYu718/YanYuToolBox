const {app,BrowserWindow,ipcMain} = require('electron')
const path = require('path')
const fs = require('fs');
const AdbCommands = require('./src/util/adbutils');
const FastbootCommands = require('./src/util/fastbootutils');
const RootUtil = require('./src/util/RootUtil');
const adbCommandsInstance = new AdbCommands();
const FastbootCommandsInstance = new FastbootCommands();
const RootUtilInstance = new RootUtil();
app.disableHardwareAcceleration();

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        frame: false,
        transparent: true,
        show: false,
        resizable: false,
        maximizable: false,
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            nodeIntegration: true,
        }
    })

    win.loadURL('http://localhost:5173/')
    // win.loadFile(path.join(__dirname, './dist/index.html'))

    win.on('ready-to-show', () => {
        win.show()
    })
    // win.webContents.openDevTools()
    ipcMain.on('window-close', () => {
        win.close()
    })
    ipcMain.on('log', (event, text) => {
        console.log(text)
    })
}
        
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

//传手机Id
ipcMain.on('GetPhoneId', (event, newSerial) => {  
    try{
        // console.log('main:',newSerial);
        adbCommandsInstance.serial =  newSerial;  
        FastbootCommandsInstance.serial =  newSerial;  
        RootUtilInstance.serial =  newSerial;  
    }catch(error){

    }
    
});  

//通用办法 要求：传进第一个参数 一般默认shell 后面是Adb函数，可传多个
ipcMain.on('AdbTool', async (every,args) => {
    try {
        // console.log(args);
        // await 
        await adbCommandsInstance.AdbTool(args);
    } catch (error) {
        console.error('命令执行时发生错误', error);
    }
})

ipcMain.handle('AdbgetPhoneId',async (every,args) =>{
    try{
        // console.log('main:'+args);
        await adbCommandsInstance(args)
    }catch{
        // console.error('传输Id时发生错误', error);
    }
})

//获取安卓设备列表 
ipcMain.handle('listAndroidDevices', async () => {
    try {
        const list = await adbCommandsInstance.getDeviceList()
        // console.log('main'+list);
        return list
    } catch (error) {
        console.log('检测设备时发生错误', error);
    }
})

//获取ADB手机所有信息
ipcMain.handle('ListPhoneInformation', async () => {
    try {
        const Information = await adbCommandsInstance.listPhoneInformation()
        // console.log('main'+Information);
        return Information
    } catch (error) {
        console.log('检测设备时发生错误', error);
    }
})

//安装应用
ipcMain.handle('installApk', async (every,args) => {
    try {
        const Information = await adbCommandsInstance.installApk(args)
        // console.log('main'+Information);
        return Information
    } catch (error) {
        console.log('安装应用时发生错误', error);
    }
})

//卸载应用
ipcMain.handle('uninstall', async (every,args) => {
    try {
        const Information = await adbCommandsInstance.uninstall(args)
        // console.log('main'+Information);
        return Information
    } catch (error) {
        console.log('卸载应用时发生错误', error);
    }
})

//通用办法 要求：传进是Fastboot函数，可传多个
ipcMain.on('FbTool', async (every,args) => {
    try {
        // console.log(args);
        await FastbootCommandsInstance.FbTool(args);
    } catch (error) {
        console.error('命令执行时发生错误', error);
    }
})

//获取FB设备列表 
ipcMain.handle('listFastbootDevices', async () => {
    try {
        const list = await FastbootCommandsInstance.getFbDeviceList()
        // console.log('main'+list);
        return list
    } catch (error) {
        console.log('检测设备时发生错误', error);
    }
})

//获取Fb手机所有信息
ipcMain.handle('listFastbootInformation', async () => {
    try {
        const list = await FastbootCommandsInstance.listPhoneInformation()
        // console.log('main'+list);
        return list
    } catch (error) {
        console.log('检测设备时发生错误', error);
    }
})

//Root获取手机信息
ipcMain.handle('RootInformation', async () => {
    try {
        const RootInformation = await RootUtilInstance.RootInformation();
        // console.log('main:'+RootInformation);
        return RootInformation
    } catch (error) {
        console.error('命令执行时发生错误', error);
    }
})

//Root获取手机列表
ipcMain.handle('RootDeviceList',async (every,args) =>{
    try {
        const list = await RootUtilInstance.getDeviceList()
        // console.log('main'+list);
        return list
    } catch (error) {
        console.log('检测设备时发生错误', error);
    }
})

//全自动Root