<script setup>
	import {ref,onMounted,watch} from "vue";
	const PhoneList = ref([])
	const FormationList = ref([])
	const FBPhoneList = ref()
	watch(FBPhoneList,(newValue , oldValue) => {
        // console.log('界面'+newValue);
        $app.GetID(newValue)
        //渲染手机信息
		listformation()
    })
	onMounted(Initialize)

	//Fastboot列表渲染到界面
	async function Initialize(arge) {
		if (PhoneList.value != '暂无设备链接') {
			if (arge) {
				FBPhoneList.value = null
			}
			PhoneList.value = await $FB.getFbDeviceList()
		}
	}

	async function listformation() {
		FormationList.value = await $FB.FBListPhoneInformation()
	}

	function FbTool(args = []) {
		if (PhoneList.value != '暂无设备链接') {
			$FB.FbTool(args)
		}
	}
</script>

<template>
	<div class="body">
		<div class="row_top">
			<div class="column_left">
				<p class="Test">设备信息：</p>
				<div class="row_body">
					<div class="row_top">
						<div class="Phone-Test">
							<p>手机代号：{{ FormationList[0] }}</p>
							<p>手机槽位：{{ FormationList[2] }}</p>
							<p>序列号：{{ FormationList[1] }}</p>
						</div>
						<div class="Phone-Test">
							<p>解锁状态：{{ FormationList[3] }}</p>
							<p>Boot分区大小：{{ FormationList[4] }}</p>
							<p>init_Boot分区大小：{{ FormationList[5] }}</p>
						</div>
					</div>
				</div>
				<div class="cmdresult">
					<h4>驱动返回信息：</h4>
					<div class="result">

					</div>
				</div>
			</div>

			<div class="column_right">
				<span class="Test">Fastboot快速重启</span>
				<div class="column_body">
					<div class="key">
						<button @click="FbTool(['reboot'])">重启(Reboot)</button>
						<button @click="FbTool(['reboot','-p'])">关机(Poweroff)</button>
						<button @click="FbTool(['reboot','bootloader'])">线刷模式(Fastboot)</button>
					</div>
					<div class="key">
						<button @click="FbTool(['reboot','revoery'])">恢复模式(Recovery)</button>
						<button @click="FbTool(['reboot','fastboot'])">深度线刷(Fastbootd)</button>
						<button @click="FbTool(['reboot','edl'])">9008端口(EDL)</button>
					</div>
				</div>
			</div>
		</div>

		<div class="Row_bottom">
			<p class="Test2">Fastboot功能区</p>
			<div class="Row_Column">
				<div class="Row_Column_Left">
					<button @click="FbTool(['oem','unlock'])">解除手机OEM锁</button>
				</div>
				<div class="Row_Column_center">
					<button @click="FbTool(['oem','lock'])">上锁手机OEM锁</button>
				</div>
				<div class="Row_Column_center">
					<button @click="FbTool(['手机A/B','fastboot'])">手机A/B分区转换</button>
				</div>
			</div>
			<div class="jindutiao">
			</div>
			<div class="Row_bottom_right">
				<p class="Test2">设备列表</p>
				<div class="PhoneList">
					<select name="phoneList" class="PList" v-model="FBPhoneList">
						<option v-for="(item, index) in PhoneList">
							{{ item }}
						</option>
					</select>
					<button @click="Initialize(null)">刷新设备列表</button>
				</div>
			</div>


		</div>
	</div>
</template>

<style scoped>
	.jindutiao {
		position: relative;
		top: 60px;
		left: 10px;
		bottom: 10%;
		background-color: black;
		width: 530px;
		height: 30px;
		overflow: hidden;
		border-radius: 30px;
	}

	.result {
		border-radius: 5px;
		width: 500px;
		height: 150px;
		overflow: hidden;
		background-color: #507C87;
		box-shadow: 4px 4px 4px #dedede;
	}

	.cmdresult {
		border-radius: 5px;
		margin-top: 10px;
		margin-bottom: 20px;
		width: 500px;
		height: 170px;
		overflow: hidden;
		background-color: #FFFFFF;
		box-shadow: 4px 4px 4px #dedede;
	}

	.cmdresult h4 {
		margin: 4px 0px 5px 7px;
	}

	option span {
		display: none;
	}

	body {
		overflow: hidden;
		/* position: absolute; */
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
		top: -70px;
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
		margin: 10px 0px 40px 5px;
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
		height: 120px;
		margin: -20px 0px 0px 0px;
		background-color: #ffffff;
		border-radius: 10px;
		box-shadow: 4px 4px 4px #dedede;
	}

	/* 设备信息布局 */
	.Phone-Test {
		width: 90%;
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
		width: 530px;
		/* height: 120px; */
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
		width: 170px;
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