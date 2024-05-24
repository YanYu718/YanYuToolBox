<script setup>
    import {onMounted , ref, watch} from 'vue';

    const input  =  ref('')//软件安装
    function Input(event) {
        const file = event.target.files[0];
        if (file) {
            input.value = event.target.files[0].path;
        }
    }
    async function InstallApp(){
        await $adb.installApk(input.value)
    }

    const unload =  ref('')//软件卸载
    async function uninstallApp(){
        await $adb.uninstall(unload.value)
    }


    const  dpi0 = ref('')//屏幕 dpi 默认0参数  竖
    const  dpi1 = ref('')//屏幕 dpi 默认1参数  横

    const flash = ref('')
    function Flash(event) {
        const file = event.target.files[0];
        if (file) {
            flash.value = event.target.files[0];
        }
    }

    const erase = ref('')//擦除分区

    const PhoneId = ref([])
    
</script>

<template>
    <div>
        <div class="Feature">

            <div class="install">
                <label for="install" class="title">手机软件安装：</label>
                <input type="file" id="install" @change="Input" accept=".apk">
                <button class="funbtn"  @click="InstallApp">开始</button>
            </div>

            <div class="unload">
                <label for="unload" class="title">手机软件卸载：</label>
                <input type="text" id="unload" v-model="unload" placeholder="请输入要卸载的软件包名">
                <button class="funbtn" @click="uninstallApp">开始</button>
            </div>

            <div class="dpi">
                <label for="dpi" class="title">屏幕DPI调整：</label>
                <input type="number" id="dpi" v-model="dpi0">x<input type="number" id="dpi" v-model="dpi1">
                <button class="funbtn">开始</button>
            </div>

            <div class="flash">
                <label for="flash" class="title">手机分区烧录：</label>
                <input type="file" id="flash" @change="Flash">
                <button class="funbtn">开始</button>
            </div>

            <div class="erase">
                <label for="erase" class="title">手机分区擦除：</label>
                <input type="text" id="erase" v-model="erase" placeholder="请输入要擦除的分区名称">
                <button class="funbtn">开始</button>
            </div>

            <div>
                <label for="phoneList" style="font-weight: bold;">设备列表：</label>
                <select name="phoneList" class="PList" v-model="PhoneId" >
                    <option v-for="(phone) in PhoneList" >
                        {{ phone }}
                    </option>
                </select>
                <button @click="Initialize">刷新设备列表</button>
            </div>
            
        </div>
    </div>
</template>

<style scoped>

    .title {
        font-size: 30px;
        font-weight: bold;
        margin-right: 50px;
    }

    .Feature {
        position: absolute;
        top: 110px;
        left: 220px;
        background-color: bisque;
        width: 755px;
        height: 400px;
    }
    .Feature div{
        margin-bottom: 45px;
    }
</style>