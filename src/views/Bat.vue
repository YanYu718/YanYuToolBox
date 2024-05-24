<script setup>
    import {onMounted , ref, watch} from 'vue';
    const phoneText = ref([]) //设备信息
    const PhoneList = ref([]) //设备列表
    const PhoneId = ref()

    watch(PhoneId,(newValue , oldValue) => {
        console.log('界面'+newValue);
        $app.GetID(newValue)
        //渲染手机信息
        RootInformation()
    })

    async function RootInformation() {
        phoneText.value = await $Root.RootInformation()
    }

    //手机列表渲染到界面
    async function Initialize() {
        //获取手机列表
        PhoneList.value = await $Root.getDeviceList()
        
    }

    //储存面具路径
    const magiskurl = ref('')
    function DiyMagisk(event) {
        const file = event.target.files[0];
        if (file) {
            magiskurl.value = event.target.files[0];
        }
    }

    //储存Boot路径
    const booturl = ref()
    function DiyBoot(event) {
        const file = event.target.files[0]; // 获取用户选择的文件  
        if (file) {
            booturl.value = file; // 将文件赋值给响应式引用  
        }
    }

    //进度条功能定义
    const Progresswidth = ref(0)

    //获取到的信息提交储存
    const RomUrl = ref('') //用户输入的Rom链接

    onMounted(Initialize)
</script>

<template>
    <div class="body">
        <!-- 设备信息 -->
        <div class="PhoneText">
            <p class="H1">
                <h2>设备信息</h2>
            </p>
            <p class="ValueText">
                <span class="Text">设备名称：</span>
                {{ phoneText[0] }}
            </p>
            <p class="ValueText">
                <span class="Text">设备行级：</span>
                {{ phoneText[1] }}
            </p>
            <p class="ValueText">
                <span class="Text">设备代号：</span>
                {{ phoneText[2] }}
            </p>
            <p class="ValueText">
                <span class="Text">安卓版本：</span>
                {{ phoneText[3] }}
            </p>
            <p class="ValueText">
                <span class="Text">系统版本：</span><br>
                {{ phoneText[4] }}
            </p>
            <p class="ValueText">
                <span class="Text">设备编号：</span><br>
                {{ phoneText[5] }} </p>
        </div>

        <!-- 设备返回信息 -->
        <div class="Returnedvalue">
            <span class="adbvalue">设备返回值<br></span>
        </div>

        <!-- 功能区 -->
        <div class="FunctionArea">
            <!-- 面具包固定选择 -->
            <div class="radio">
                <input type="radio" id="magisk" name="radio" :value="'magisk'" @change="">
                <label for="magisk">Magisk 25.2</label>

                <input type="radio" id="Alpha" name="radio" :value="'alpha'" @change="">
                <label for="Alpha">Alpha 32.1</label>

                <input type="radio" id="Dsu" name="radio" :value="'dsu'" @change="">
                <label for="Dsu">Dsu 38.2</label>
            </div>

            <!-- Rom下载链接自定义 -->
            <div class="FunctionRow">
                <label for="romUrlInput" style="font-weight: bold;">下载直链：</label>
                <input type="url" id="romUrlInput" name="RomUrl" v-model="RomUrl" placeholder="请输入当前版本卡刷包直链"
                    class="RomUrlInput">
            </div>

            <!-- 自定义面具 -->
            <div class="FunctionRow">
                <label for="diyMagiskInput" style="font-weight: bold;">选择面具：</label>
                <input type="file" id="diyMagiskInput" name="DiyMagisk" @change="DiyMagisk" accept=".apk, .zip"
                    class="RomUrlInput">
            </div>

            <!-- 自定义Boot -->
            <div class="FunctionRow">
                <label for="diyBootInput" style="font-weight: bold;">选择BOOT：</label>
                <input type="file" id="diyMagiskInput" name="diyBootInput" @change="DiyBoot" accept=".img"
                    class="RomUrlInput">
            </div>

            <!-- 功能按钮 -->
            <div class="FunctionRow" style="margin-top: 25px;">
                <label for="phoneList" style="font-weight: bold;">设备列表：</label>
                <select name="phoneList" class="PList" v-model="PhoneId" >
                    <!-- <option disabled value="">请选择</option>  -->
                    <option v-for="(phone, index) in PhoneList" >
                        {{ phone }}
                    </option>
                </select>
                <button @click="Initialize">刷新设备列表</button>
            </div>

            <!-- 俩按钮 -->
            <div class="FunctionRow">
                <button class="openbtn">开始Root</button>
                <button class="openbtn">恢复原Boot</button>
            </div>
        </div>

        <!-- 进度条 -->
        <div class="Progress">
            <div class="ProgresValue" :style="{ width: Progresswidth + 'px' }"></div>
        </div>

    </div>
</template>

<style scoped>
    .adbvalue {
        display: block;
        margin: 10px 0px 10px 10px;
    }

    .openbtn {
        margin-top: 5px;
        margin-right: 25px;
        width: 200px;
        height: 50px;
        font-size: 25px;
        background-color: #507c87;
        border-radius: 10px;
        color: #ffffff;
        border: none;
        font-family: '微软雅黑';
        box-shadow: 4px 4px 4px #dedede;
        cursor: pointer;
    }

    .FunctionRow select {
        width: 150px;
        margin-right: 30px;
    }

    .FunctionRow {
        width: 465px;
        margin: 10px 0px 0px 20px;
    }

    .RomUrlInput {
        margin: 10px 0px 0px 5px;
        width: 325px;
        height: 20px;
        font-size: auto;
    }

    .radio label {
        font-size: 20px;
        font-weight: bold;
        margin: 10px 0px 0px 10px;
    }

    .radio {
        width: 465px;
        height: 30px;
        margin: 10px 0px 0px 20px;
        /* background-color: #507C87; */
    }

    .ProgresValue {
        position: relative;
        height: 30px;
        background-color: #403E41;
        border-radius: 10px;
        transition: width 2.0s;
        color: white;
        line-height: 30px;
    }

    .Progress {
        position: absolute;
        width: 750px;
        height: 30px;
        background-color: #507C87;
        border-radius: 10px;
        top: 563px;
        left: 225px;
        overflow: hidden;
    }

    .FunctionArea {
        overflow: hidden;
        position: absolute;
        background-color: #FFFFFF;
        border-radius: 5px;
        box-shadow: 4px 4px 4px #dedede;
        width: 465px;
        height: 300px;
        top: 250px;
        left: 520px;
    }

    .Returnedvalue {
        overflow: hidden;
        position: relative;
        background-color: #FFFFFF;
        border-radius: 5px;
        box-shadow: 4px 4px 4px #dedede;
        top: 25px;
        left: 320px;
        width: 465px;
        height: 155px;
    }

    .PhoneText {
        position: absolute;
        width: 300px;
        height: 480px;
        background-color: #FFFFFF;
        margin-top: 25px;
        border-radius: 0px 5px 5px 0px;
        box-shadow: 4px 4px 4px #dedede;
        overflow: hidden;
    }

    .Text {
        /* margin-left: 10px; */
        font-weight: bold;
        font-size: 20px;
        font-weight: '微软雅黑';
    }

    .ValueText {
        margin-left: 10px;
        font-size: 20px;
        font-weight: '微软雅黑';
        margin-top: 30px;
        overflow: hidden;
    }

    h2 {
        margin: -10px 0px 10px 10px;
    }
</style>