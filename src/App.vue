<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navigator from './components/Navigator.vue'
import Icon from './components/Icon.vue'

const router = useRouter()

const pages = reactive([
  {
    name: '设备信息 | 功能',
    icon: 'pencil',
    path: '/information'
  },
  {
    name: '引导信息 | 功能',
    icon: 'console',
    path: '/magisk'
  },
  {
    name: 'Magisk | Root',
    icon: 'cmd',
    path: '/bat'
  },
  {
    name: '软件安装 | 卸载',
    icon: 'phonetool',
    path: '/phonetool'
  },
  {
    name: '关于',
    icon: 'info',
    path: '/about'
  }
])

const defaultIndex = 0

const changePage = (pageIndex) => {
  router.push(pages[pageIndex].path)
}

const closeWindow = () => {
  $app.close()
}

</script>

<template>
  <div class="container">
    <div class="side-panel">
      <h1 class="app-title">烟雨工具箱</h1>
      <Navigator class="navigator" :pages="pages" :defaultIndex="defaultIndex" @selected="changePage"></Navigator>
    </div>
    <div class="status-bar">
        <Icon class="box" name="geren" color="black"></Icon>
        <span>烟雨工具箱-致力于打造免费高效高性能玩机工具</span>
        <Icon class="close-button" name="close" color="black" selectedColor="red" @click="closeWindow"></Icon>
    </div>
    <div class="content-panel">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>

.status-bar span{
  line-height: 50px;
  font-size: 20px;
  color: #507c87;
  font-weight: 600;
  text-decoration: none;
}

.box{
  width: 23px;
  height: 23px;
  margin-left: 18px;
  margin-right: 10px;
  margin-top: 15px;
  float: left;
}

.container {
  display: inline;
  background-color: #F5F5F5;
}

.side-panel {
  float: left;
  height: 100%;
  width: 200px;
  color: white;
  background-color: #507c87;
  -webkit-app-region: no-drag;
  /* 不允许用户进行窗口拖动 */
}

.app-title {
  height: 49px;
  margin-top: 40px;
  font-size: 27px;
  text-align: center;
  color: whitesmoke;
}
.navigator {
  -webkit-app-region: no-drag;
  cursor: pointer; 
  /* 禁止拖动 */
}

.content-panel {
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  height: 100%;
  width: calc(100% - 200px);

  background-color: #f9f9f9;
  overflow: auto;
}

.status-bar {
  float: right;
  margin-top: 0px;
  margin-left: 0px;
  margin-right: 0px;
  height: 45px;
  width: calc(100% - 200px);
  background-color: #f9f9f9;
  display: block;

  -webkit-app-region: drag;
}
.close-button {
  width: 23px;
  height: 23px;
  margin-right: 13px;
  margin-top: 15px;
  float: right;
  cursor: pointer; 
  -webkit-app-region: no-drag;
}
</style>