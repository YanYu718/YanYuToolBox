<script setup>
  import {ref,onMounted,watch} from "vue";
  const PhoneList = ref([])
  const FormationList = ref([])
  const PhoneId = ref()

  watch(PhoneId, (newValue, oldValue) => {
    console.log('界面' + newValue);
    $app.GetID(newValue)
    //渲染手机信息
    listformation()
  })

  //获取手机所有信息
  async function listformation() {
    FormationList.value = await $adb.ListPhoneInformation()
    // console.log(FormationList.value);
  }

  //手机列表渲染到界面
  async function Initialize() {
    PhoneList.value = await $adb.getDeviceList()
  }

  function AdbTool(args = []) {
    $adb.adbTool(args)
  }
  
  onMounted(Initialize)
</script>

<template>
  <div class="body">
    <div class="row_top">
      <div class="column_left">
        <p class="Test">设备信息：{{ FormationList[0] }}</p>
        <div class="row_body">
          <div class="row_top">
            <div class="Phone-Test">
              <p>品牌：{{ FormationList[2] }}</p>
              <p>型号：{{ FormationList[1] }}</p>
              <p>代号：{{ FormationList[4] }}</p>
              <p>系统：{{ FormationList[5] }}</p>
              <p>序列号：{{ FormationList[6] }}</p>
            </div>
            <div class="Phone-Test">
              <p>CPU架构：{{ FormationList[7] }}</p>
              <p>架构：{{ FormationList[8] }}</p>
              <p>显示密度：{{ FormationList[9] }}</p>
            </div>
          </div>
          <div class="row_bottom">
            <div class="Phone-TestL">
              <p>平台：{{ FormationList[11] }}</p>
              <p>UI版本：{{ FormationList[12] }}</p>
              <p>内核版本：{{ FormationList[13] }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="column_right">
        <span class="Test">按键模拟</span>
        <div class="column_body">
          <div class="key">
            <button @click="AdbTool(['input','keyevent','KEYCODE_BACK'])">返回</button>
            <button @click="AdbTool(['input','keyevent','KEYCODE_HOME'])">主页</button>
            <button @click="AdbTool(['input','keyevent','KEYCODE_APP_SWITCH'])">多任务</button>
            <button @click="AdbTool(['input','keyevent','KEYCODE_POWER'])">锁屏</button>

          </div>
          <div class="key">
            <button @click="AdbTool(['input','keyevent','24'])">音量+</button>
            <button @click="AdbTool(['input','keyevent','25'])">音量-</button>
            <button @click="AdbTool(['input','keyevent','164'])">静音</button>
            <button @click="AdbTool(['screencap','/sdcard/sc.png'])">截屏</button>
          </div>
        </div>
      </div>
    </div>

    <div class="Row_bottom">
      <p class="Test2">Adb模式快速重启</p>
      <div class="Row_Column">
        <div class="Row_Column_Left">
          <button @click="AdbTool(['reboot'])">重启(Reboot)</button>
          <button @click="AdbTool(['poweroff'])">关机(Poweroff)</button>
        </div>
        <div class="Row_Column_center">
          <button @click="AdbTool(['reboot','bootloader'])">线刷模式(Fastboot)</button>
          <button @click="AdbTool(['reboot','recovery'])">恢复模式(Recovery)</button>
        </div>
        <div class="Row_Column_center">
          <button @click="AdbTool(['reboot','recovery'])">下载模式(Download)</button>
          <button @click="AdbTool(['reboot','edl'])">9008端口(EDL)</button>
        </div>
      </div>
      <div class="Row_bottom_right">
        <p class="Test2">设备列表</p>
        <div class="PhoneList">
          <select name="phoneList" class="PList" v-model="PhoneId">
            <option v-for="(phone, index) in PhoneList">
              {{ phone }}
            </option>
          </select>
          <button @click="Initialize">刷新设备列表</button>
        </div>
      </div>
    </div>


  </div>
</template>
<!-- {{ FormationList[3] }} -->
<!-- {{ FormationList[10] }} -->
<style scoped>
  /* 有一说一 这css我也改不明白了 */
  option span {
    display: none;
  }

  body {
    overflow: hidden;
    -webkit-app-region: no-drag;
  }

  option {
    height: 10px;
    font-size: 20px;
    padding-top: 3px;
    font-weight: bold;
  }

  .PhoneList button {
    margin: 20px 0px 0px 20px;
    height: 40px;
    width: 200px;
    background-color: #507c87;
    border-radius: 10px;
    color: #ffffff;
    font-size: 17px;
    border: none;
    font-family: '微软雅黑';
    box-shadow: 4px 4px 4px #dedede;
  }

  button:hover,
  select {
    cursor: pointer;
  }

  .PList {
    width: 225px;
    height: 40px;
    font-size: 20px;
    font-weight: bold;
    margin: -10px 0px 0px 5px;
    background-color: #d5c4c45e;
    border-radius: 10px;
    border: none;
    text-align: center;
  }

  .Row_bottom_right {
    /* background-color: #507c87; */
    width: 230px;
    height: 160px;
    left: 560px;
    top: -40px;
    position: relative;
  }

  .Test2 {
    margin-top: -30px;
    margin-left: 20px;
    font-size: 30px;
    font-weight: 900;
  }

  /* 大标题 */
  .Test {
    margin-top: -3px;
    margin-left: 10px;
    font-size: 30px;
    font-weight: 900;
  }

  /* 竖向排列按钮 */
  .key button {
    width: 125px;
    height: 50px;
    margin: 10px 0px 20px 5px;
    background-color: #507c87;
    border-radius: 10px;
    color: #ffffff;
    font-size: 20px;
    border: none;
    box-shadow: 4px 4px 4px #dedede;
  }

  /* 竖向排列 */
  .column_body {
    width: 270px;
    height: 350px;
    margin-left: 10px;
    /* background-color: #507C87; */
    float: left;
    display: flex;
    justify-content: flex-start;
  }

  /* 竖向排列按钮布局 */
  .key {
    display: flex;
    flex-direction: column;
    width: 135px;
    height: 300px;
    margin-top: 10px;
    margin-right: 10px;
    /* background-color: #507C87;  */
  }

  /* 横向排列 */
  .row_body {
    display: flex;
    flex-direction: column;
    width: 500px;
    height: 300px;
    margin: -20px 0px 0px 0px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 4px 4px 4px #dedede;
  }

  /* 设备信息布局 */
  .Phone-Test {
    width: 100%;
    float: left;
    margin: 10px 0px -5px 10px;
  }

  .Phone-TestL {
    width: 100%;
    float: left;
    margin: 10px 0px -5px 10px;
  }

  .Phone-TestL p {
    margin-top: 0px;
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: bold;
    font-family: 微软雅黑;
  }

  /* 设备信息内置字体布局 */
  .Phone-Test p {
    height: 20px;
    margin-top: 0px;
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: bold;
    font-family: 微软雅黑;
  }

  .Row_Column {
    width: 500px;
    height: 220px;
    margin: -20px 20px 0px 10px;
    display: flex;
    justify-content: flex-start;
    /* background-color: #507c87; */
    position: absolute;
  }

  .Row_Column_Left button {
    width: 150px;
  }

  .Row_Column_center button {
    width: 180px;
  }

  .Row_Column button {
    margin: 10px 0px 10px 10px;
    height: 40px;
    background-color: #507c87;
    border-radius: 10px;
    color: #ffffff;
    font-size: 17px;
    border: none;
    font-family: '微软雅黑';
    box-shadow: 4px 4px 4px #dedede;
  }

  .row_top {
    margin-left: 10px;
    display: flex;
    justify-content: flex-start;
  }

  .row_bottom {
    margin-left: 10px;
  }
</style>