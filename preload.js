const {
  contextBridge,
  ipcRenderer
} = require('electron');

//！！！！！！！通用方法 不要动！！！！！！！
contextBridge.exposeInMainWorld('$app', {
  //关闭窗口命令
  close() {
    ipcRenderer.send('window-close')
  },
  // 在不用devtool时从渲染层输出调试信息到控制台
  log(text) {
    ipcRenderer.send('log', text)
  },
  GetID(newSerial) {
    // console.log('渲染进程：'+newSerial);
    ipcRenderer.send('GetPhoneId', newSerial);
  }
})

//ADB调用方法
contextBridge.exposeInMainWorld('$adb', {

  //获取手机列表，这个东西终于通了
  async getDeviceList() {
    try {
      const data = await ipcRenderer.invoke('listAndroidDevices');
      // console.log('perload'+data)
      return data
    } catch (error) {
      console.error('检测设备时发生错误', error);
    }
  },

  //安装应用
  async installApk(args = []) {
    try {
      await ipcRenderer.invoke('installApk', args);

    } catch (error) {
      console.error('检测设备时发生错误', error);
    }
  },

  //卸载应用
  async uninstall(args = []) {
    try {
      await ipcRenderer.invoke('uninstall', args);

    } catch (error) {
      console.error('检测设备时发生错误', error);
    }
  },

  //获取手机所有信息
  async ListPhoneInformation() {
    try {
      const Information = await ipcRenderer.invoke('ListPhoneInformation')
      // console.log('渲染进程成功' + Information);
      return Information
    } catch (error) {
      console.error(`设备信息接收时发生错误`, error);
    }
  },

  //通用命令执行方法 默认adb后带shell 如原生命令不带shell 请调用非shell方法
  async adbTool(args = []) {
    try {
      await ipcRenderer.send('AdbTool', args)
      // console.log('perload'+ args);
    } catch (error) {
      console.error(`命令发送时发生错误`, error);
    }
  },
})

//Fastboot调用方法
contextBridge.exposeInMainWorld('$FB', {
    //通用命令执行方法
    async FbTool(args = []) {
      try {
        await ipcRenderer.send('FbTool', args)
        // console.log('perload'+ args);
      } catch (error) {
        console.error(`命令发送时发生错误`, error);
      }
    },
    //获取Fastboot手机列表
    async getFbDeviceList() {
      try {
        const data = await ipcRenderer.invoke('listFastbootDevices');
        // console.log('perload'+data)
        return data
      } catch (error) {
        console.error('检测设备时发生错误', error);
      }
    },

    //获取Fb手机所有信息
    async FBListPhoneInformation() {
      try {
        const Information = await ipcRenderer.invoke('listFastbootInformation')
        // console.log('渲染进程成功' + Information);
        return Information
      } catch (error) {
        console.error(`设备信息接收时发生错误`, error);
      }
    },
  }),

  // Root调用方法
  contextBridge.exposeInMainWorld('$Root', {

    //获取手机列表，这个东西终于通了
    async getDeviceList() {
      try {
        const data = await ipcRenderer.invoke('RootDeviceList');
        // console.log('perload'+data)
        return data
      } catch (error) {
        console.error('检测设备时发生错误', error);
      }
    },

    //获取手机所有信息
    async RootInformation() {
      try {
        const Information = await ipcRenderer.invoke('RootInformation')
        // console.log('渲染进程：' + Information);
        return Information
        } catch (error) {
        console.error(`设备信息接收时发生错误`, error);
      }
    },
  })