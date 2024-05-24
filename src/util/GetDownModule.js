//使用前先npm install puppeteer
 
let daihao = 'houji'; 

axios.get('https://xiaomirom.com/series/')  
  .then(response => {  
    // 找到包含'china'和'daihao'的行  
    let html = response.data; // 获取响应体（HTML内容）  
      
    let regex = new RegExp(`china.*${daihao}-([^\\s=]+)=[^\\s"]+([^\\s"]+)`, 'gi');  
    let matches = html.match(regex);  
      
    if (matches && matches.length > 0) {  
        let keyValuePair = matches[0].split('=');  
        if (keyValuePair.length > 1) {  
            let value = keyValuePair[1].trim().split('"')[0]; // 去除引号
            console.log('value:', value); // 输出DH的值  
            // 将value赋值 
        }  
    } else {  
        console.log('No matches found.');  
    }  
  })  
  .catch(error => {  
    console.error('Error fetching data:', error);  
  });



//获取下载直链
(
  async () => {
    try {
      const browser = await puppeteer.launch({
        headless: true
      }); // 设置为headless: false以打开浏览器窗口  
      const page = await browser.newPage();

      await page.goto('https://xiaomirom.com/download/xiaomi-14-houji-stable-OS1.0.36.0.UNCCNXM/#china-recovery');

      // 等待特定的元素出现在页面上  
      await page.waitForSelector('.btn.btn-warning');
      // 查找元素并提取onclick中的URL  
      const button = await page.$('.btn.btn-warning');
      const onclickAttr = await page.evaluate(el => el.getAttribute('onclick'), button);



      // 解析onclick属性中的URL  
      const urlRegex = /window\.open\('([^']+)'/;
      const match = onclickAttr.match(urlRegex);
      if (match && match[1]) {
        const downloadUrl = match[1];
        console.log(downloadUrl); // 输出提取到的URL  
      } else {
        console.error('无法从onclick属性中提取URL');
      }

      await browser.close();
    } catch (error) {
      console.error('发生错误:', error);
    }
  }
)


let dd = 'weekly'; // 默认设置为weekly    
// 定义一个函数来执行ADB命令并检查输出  
function checkADBProperty(property, callback) {  
    exec(`adb shell getprop ${property} | findstr CNXM`, (error, stdout, stderr) => {  
        if (error) {  
            console.error(`Error executing command for ${property}: ${error}`);  
            return callback(false); // 命令执行错误，返回false  
        }  
        if (stdout.includes('CNXM')) {  
            return callback(true); // 找到CNXM，返回true  
        }  
        return callback(false); // 没有找到CNXM，返回false  
    });  
}  
  
// 异步检查多个ADB属性  
Promise.all([  
    new Promise((resolve) => checkADBProperty('persist.sys.grant_version', resolve)),  
    new Promise((resolve) => checkADBProperty('ro.build.version.incremental', resolve)),  
    new Promise((resolve) => checkADBProperty('ro.system.build.version.incremental', resolve))  
])  
.then((results) => {  
    // 如果有任何一个结果为true，则设置dd为stable  
    if (results.some(result => result)) {  
        dd = 'stable';  
    }  
    console.log(`dd is set to: ${dd}`);  
})  
.catch((error) => {  
    console.error('An error occurred:', error);  
});
