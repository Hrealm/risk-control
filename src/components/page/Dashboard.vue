<template>
    <div class="pageClass">
        <div class="pageTop">
            <div  class="pageLtop">
                <div class="userInfo">
                    <div class="user-info">
                        <img :src="picUrl" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{userInfo.name}}</div>
                            <div>{{LogingType==3?'调度员':'管理员'}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：<span>{{userInfo.llt}}</span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：<span>{{userInfo.lli}}</span>
                    </div>
                </div>
				<!--  -->
				<div class="marketBox">
					<!-- <div class="marketTitle">市场行情</div> -->
					<div class="tableBox">
						<el-table
							:data="tableData"
							empty-text="暂无订单"
							:cell-style="cellStyle"
							:header-cell-style="{background:'#ffffff !important',padding:'4px 0px','text-align':'center'}"
							:header-row-style="{'color':'#000','font-weight':'bold',}"
							style="width: 100%;">
							<el-table-column 
								v-for="(item,index) in tableTitleData" 
								:prop="item.prop" 
								:show-overflow-tooltip="true" 
								:label="item.label"
							>
							</el-table-column>
						</el-table>
					</div>
				</div>
            </div>
            <div class="pageRtop">
                <el-row :gutter="20" class="mgb20 pageRtopBox">
                    <div class="mgbList" v-for="(item,index) in operatData">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
								<div class="pageRtopIcon" :style="{background:item.color}">
									<img :src="require('../../assets/img/index-icon'+(index+1)+'.png')" class="pageRtopImg" alt />
								</div>
                                <!-- <i class="el-icon-lx-people grid-con-icon"></i> -->
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{item._val}}</div>
                                    <div>{{item.title}}</div>
                                </div>
                            </div>
                        </el-card>
                    </div>
                   <!-- <div class="mgbList">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">321</div>
                                    <div>系统消息</div>
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <div class="mgbList">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000</div>
                                    <div>数量</div>
                                </div>
                            </div>
                        </el-card>
                    </div> -->
                </el-row>
                <el-card shadow="hover" :body-style="{padding:'20px 0px'}">
					<div class="canvas-wrapper" v-for="(item,index) in ringList">
						<div class="ringTitle">新增{{item.title}}&nbsp;&nbsp;&nbsp;&nbsp;<em>{{item.new}}</em></div>
						<div class="ringBox">
							<div class="ringBoxGraphics">
								<div class="ringBoxMain">
									<div class="ringBoxMainT">{{item.total}}</div>
									<div class="ringBoxMainB">在途{{item.title}}量</div>
								</div>
								<schart ref="ring" class="schart" style="height: 200px;" :canvasId="'ring'+index" :options="item.options"></schart>
							</div>
						</div>
						<div class="ringDataBox">
							<div class="ringBoxList" v-for="(items,indexs) in item.list">
								<div class="ringBoxListMian">
									<div class="ringBoxListIcon" :style="{background:items.color}"></div>
									<div class="ringBoxListText">{{items.name}}</div>
									<div class="ringBoxListPer">{{items.preVal}}%</div>
								</div>
							</div>
						</div>
					</div>
                </el-card>
            </div>
        </div>
        <el-row :gutter="20" style="padding: 10px;padding-top: 0px;">
			<el-col :span="12">
				<el-card shadow="hover" :body-style="{padding:'10px 8px'}">
					<div class="barTitle">
						<span>新增订单接单统计</span>
						<div class="barTag">
							<div class="barTagList" @click="ordrerBarTag(0)" :class="orderTagIndex==0?'barTagAr':''">近30天</div>
							<div class="barTagList" @click="ordrerBarTag(1)" :class="orderTagIndex==1?'barTagAr':''">近14天</div>
							<div class="barTagList" @click="ordrerBarTag(2)" :class="orderTagIndex==2?'barTagAr':''">近7天</div>
						</div>
					</div>
					<schart ref="bar" class="schart" style="height: 180px;" canvasId="bar" :options="orderStatisticsOptions"></schart>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover" :body-style="{padding:'10px 8px'}">
					<div class="barTitle">
						<span>新增运单接单统计</span>
						<div class="barTag">
							<div class="barTagList" @click="billBarTag(0)" :class="billTagIndex==0?'barTagAr':''">近30天</div>
							<div class="barTagList" @click="billBarTag(1)" :class="billTagIndex==1?'barTagAr':''">近14天</div>
							<div class="barTagList" @click="billBarTag(2)" :class="billTagIndex==2?'barTagAr':''">近7天</div>
						</div>
					</div>
					<schart ref="bar" class="schart" style="height: 180px;" canvasId="bar1" :options="billStatisticsOptions"></schart>
				</el-card>
			</el-col>
        </el-row>
    </div>
</template>

<script>
// 佛祖保佑没有bug
import Schart from 'vue-schart';
import bus from '../common/bus';
import request from '../../utils/request.js';
export default {
    name: 'dashboard',
    data() {
        return {
			name: localStorage.getItem('ms_username'),
			operatData:[],//顶部运营数据
			orderTagIndex: 2,//订单选择下标
			billTagIndex: 2,//订单选择下标
			picUrl: require('../../assets/img/dispatch-icon.png'),//头像图片路径
			tableTitleData:[
				{
					label: '起运地',
					prop: 'startAddr',
				},
				{
					label: '目的地',
					prop: 'endAddr',
				},
				{
					label: '货物名称',
					prop: 'goodsInfo',
				},
				{
					label: '重量(吨)',
					prop: 'weight',
				},
				{
					label: '价格',
					prop: 'price',
				}
			],
			tableData: [],
            orderStatisticsOptions: {
				type: 'bar',
				legend:{
					display: false,
				},
				topPadding: 10,
				leftPadding: 10,
				rightPadding: 10,
				bottomPadding: 30,
				xRorate: 25,
				labels: ['11', '22', '33', '44', '55','66','77'],
				datasets: [
					{
						data: [234, 278, 270, 190, 230,234, 278],
						fillColor: '#2d8cf0',
					},
				]
            },
            billStatisticsOptions: {
				type: 'bar',
				legend:{
					display: false,
				},
				topPadding: 10,
				leftPadding: 10,
				rightPadding: 10,
				bottomPadding: 30,
				xRorate: 25,
				labels: ['11', '22', '33', '44', '55','66','77'],
				datasets: [
					{
						data: [234, 278, 270, 190, 230,234, 278],
						fillColor: '#f25e43',
					},
				]
            },
			//
			ringOptions:{
				type: 'ring',
				showValue: false,
				legend: {
					display: false,
					position: 'bottom',
					bottom: 20
				},
				radius: 100,
				innerRadius: 75,
				bgColor: '#ffffff',
				colorList:[],
				labels: [],
				datasets: [{
					data: []
				}]
			},
			ringOptionsd:{
				type: 'ring',
				showValue: false,
				legend: {
					display: false,
					position: 'bottom',
					bottom: 20
				},
				radius: 100,
				innerRadius: 75,
				bgColor: '#ffffff',
				colorList:[],
				labels: [],
				datasets: [{
					data: []
				}]
			},
			loginData: {},//登录的全部信息
			LogingType: '',//登录用户类型
			userInfo: {},//用户信息
			userInfoKey: '',
			ringList: [],//环形图数据
			// billData: '',//环形运单数据
			// orderData: '',//环形订单数据
			colorList:['#7ecf51','#f25e43','#e3935d'],
			// colorList:['#2d8cf0','#7ecf51','#eecb5f','#f25e43','#e3935d',‘#000000’],
			endDate: '',//当前日期
			orderStrDate: '',//
			orderArrNum: 7,//
			billStrDate: '',//
			billArrNum: 7,//
        };
    },
    components: {
        Schart
    },
    computed: {
        role() {
			// console.log(this.name);
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },
    created() {
		//把登录信息赋值到当前变量 si tid
		this.loginData = this.$store.state.loginData;
		this.LogingType = this.loginData.LogingType;
		this.userInfoKey = this.loginData.key;
		// console.log(this.loginData);
		this.userInfo = this.loginData;
		//取前一天的日期
		this.endDate = this.getTime(1);
		//默认取前七天的日期
		this.orderStrDate = this.getTime(7);
		//默认取前七天的日期
		this.billStrDate = this.getTime(7);
		this.marketsList();
		this.getTodayData();
		//初始化时获取统计数据
		this.orderStatistics(0);
		this.orderStatistics(1);
		// this.timer();
    },
	destroyed() {
		clearInterval(this.timer);
	},
    methods: {
		//定时器 定时请求
		timer(){
			return setInterval(()=>{
				this.marketsList()
			},10000)
		},
		//表格样式处理
		cellStyle({ row, column, rowIndex, columnIndex }) {
			// console.log(rowIndex);//行
			// console.log(columnIndex);//列
			if (columnIndex == 4) {
				return {padding:'2px 0px',color:'#f15252',"text-align":'center'}
			}else{
				return {padding:'2px 0px',"text-align":'center'}
			}
		},
		//切换
		billBarTag(index){
			let num = 7;
			if(this.billTagIndex==index){
				return;
			}
			this.billTagIndex = index;
			if( index==0 ){
				num = 30;
			}else if( index==1 ){
				num = 14;
			}
			this.billArrNum = num;
			this.billStrDate = this.getTime(num);
			this.orderStatistics(1);
		},
		//切换
		ordrerBarTag(index){
			let num = 7;
			if(this.orderTagIndex==index){
				return;
			}
			this.orderTagIndex = index;
			if( index==0 ){
				num = 30;
			}else if( index==1 ){
				num = 14;
			}
			this.orderArrNum = num;
			this.orderStrDate = this.getTime(num);
			this.orderStatistics(0);
		},
		//取近七天数据 日期往前推
		getTime(num) { 
			let date1 = new Date();
			//今天时间
			let time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate()
			// console.log(time1);
			let date2 = new Date(date1);
			date2.setDate(date1.getDate() - num);
			let date_m = date2.getMonth() + 1;
			let date_d = date2.getDate();
			 //num是正数表示之后的时间，num负数表示之前的时间，0表示今天
			let time2 = date2.getFullYear() + "-" + (date_m>9?date_m:'0'+date_m) + "-" + (date_d>9?date_d:'0'+date_d) ; 
			// console.log(time2);
			return time2;
		},
		//获取订单统计数据
		async orderStatistics(type){
			let typeVal = type?type:0;
			let loginData = this.loginData;
			let num = type==0? this.orderArrNum : this.billArrNum;
			let hd = {
				pi: 32004,
				sq: 8,
				si: this.userInfo.si,
			};
			let bd = {
				bt: (typeVal==0? 1201 : 1301 ),//1201 订单数据 1301 运单数据
				tid: this.userInfo.tid,
				ct: 1,//
				bte: (typeVal==0? this.orderStrDate : this.billStrDate ),// 0是订单时间 1是运单时间
				ete: this.endDate,//
			};
			// return;
            let resData = await request('/32004', hd, bd);
			let data = '';
			if (resData.hd.rid >= 0) {
			    data = JSON.parse(resData.bd);
			}else{
				this.$message({
				    type: 'error',
				    message: resData.hd.rmsg
				});
				return false;
			}
			console.log(data);
			let labelArr = [];
			let dataArr = [];
			if(data.olst.length>0){
				data.olst.forEach((item,index)=>{
					let tody_ = item.dt;
					tody_ = tody_.substring(5,11);
					labelArr.push(tody_);
					dataArr.push(item.amt);
				});
			}else{
				for(let i=num; i>0; i--){
					let tody_ = this.getTime(i);
					tody_ = tody_.substring(5,11);
					labelArr.push(tody_);
					dataArr.push(0);
				}
			}
			
			if( type==0 ){
				this.orderStatisticsOptions.labels = labelArr;
				this.orderStatisticsOptions.datasets[0].data = dataArr;
			}else{
				this.billStatisticsOptions.labels = labelArr;
				this.billStatisticsOptions.datasets[0].data = dataArr;
			}
        },
		//查询市场列表
		async marketsList(){
			let loginData = this.loginData;
			let hd = {
				pi: 30041,
				sq: 8,
				si: this.userInfo.si,
			};
			let bd = {
				tid: this.userInfo.tid,
				pg: 1,//分页
				sz: 7,//每页条数
			};
            let resData = await request('/30041', hd, bd);
			let data = '';
			if (resData.hd.rid >= 0) {
			    data = JSON.parse(resData.bd);
			}else{
				this.$message({
				    type: 'error',
				    message: resData.hd.rmsg
				});
				return false;
			}
			// let data = '';
			// if (this.userInfo.em == 0) {
			// 	data = JSON.parse(res.data.bd);
			// }else if(this.userInfo.em == 1) {
			// 	let decryptData = encryptUtil.decrypt(res.data.bd, this.userInfoKey);
			// 	data = JSON.parse(decryptData);
			// }
			let list = [];
			
			//car_types car_long
			data.olst.forEach((item,index)=>{
				let _item = {
					startAddr: item.zct,
					endAddr: item.xct,
					goodsInfo: item.on,
					weight: item.dw,
					price: item.qt,
				}
				list.push(_item);
			});
			this.tableData = list;
		},
		//获取今日交易数据
		async getTodayData(){
			let loginData = this.loginData;
			let hd = {
				pi: 32001,
				sq: 8,
				si: this.userInfo.si,
			};
			let bd = {
				tid: this.userInfo.tid,
			};
			let resData = await request('/32001', hd, bd);
			let data = '';
			if (resData.hd.rid >= 0) {
			    data = JSON.parse(resData.bd);
			}else{
				this.$message({
				    type: 'error',
				    message: resData.hd.rmsg
				});
				return false;
			}
			console.log(data);
			let ringList = [];
			let orderTotal = data.holdOrder + data.tradeOrder + data.cancelOrder;
			//订单数据
			let orderData = {
				title:'订单',
				new: data.newOrder,
				today: data.todayOrder,
				trade: data.tradeOrder,
				cancel: data.cancelOrder,
				hold: data.holdOrder,
				total: orderTotal,
				data:[ data.holdOrder , data.tradeOrder , data.cancelOrder],
				list:[],
			};
			let ringOptions = this.ringOptions;
			let orderforData = this.ringForProcess(orderData.data, orderTotal, ringOptions);
			orderData.list = orderforData.list;
			orderData.options = orderforData.options;
			//运单数据
			let billTotal = data.holdBill + data.tradeBill + data.cancelBill;
			let billData = {
				title:'运单',
				today: data.todayBill,
				new: data.newBill,
				trade: data.tradeBill,
				cancel: data.cancelBill,
				hold: data.holdBill,
				total: billTotal,
				data:[ data.holdBill , data.tradeBill , data.cancelBill],
				list:[],
			};
			let ringOptionsd = this.ringOptionsd; 
			let billforData = this.ringForProcess(billData.data, billTotal, ringOptionsd);
			billData.list = billforData.list;
			billData.options = billforData.options;
			
			this.orderData = orderData;
			this.billData = billData;
			ringList.push(orderData);
			ringList.push(billData);
			console.log(ringList);
			this.ringList = ringList;
			
			let operatData = [];
			//右顶部数据处理
			for(let i=0; i<3; i++){
				let title = '运营商数量';
				let _val = data.totalMember? data.totalMember : 0 ;
				let color = '#7ecf51';
				if( i==1 ){
					title = '货主数量';
					_val = data.totalCustom? data.totalCustom : 0;
					color = '#2d8cf0';
				}else if( i==2 ){
					title = '司机数量';
					_val = data.totalDriver? data.totalDriver : 0;
					color = '#f25e43';
				}
				operatData.push({
					title:title,
					_val:_val,
					color:color,
				})
			}
			this.operatData = operatData;
			
		},
		//处理多次使用的
		ringForProcess(data,total,ringOptions){
			let list = [];
			let label = [];
			let options = ringOptions;
			data.forEach((item,index)=>{
				let nameString = '('+item+'单)';
				let nameTitle = '持有';
				if( index==1 ){
					nameTitle = '完成';
				}else if( index==2 ){
					nameTitle = '撤销';
				}
				let preVal =  Math.floor(item/total * 1000) / 10;
				if(item==0){
					preVal = 0;
				}
				
				let orderObj = {
					name: nameTitle+nameString,
					value: item,
					color:  this.colorList[index],
					preVal: preVal,
				}
				label.push(nameTitle+nameString);
				list.push(orderObj);
			});
			options.labels = label;
			options.datasets[0].data = total!=0?data:[1,1,1];
			options.colorList = this.colorList;
			return {list:list, options:options};
		},
		//
        // handleListener() {
        //     bus.$on('collapse', this.handleBus);
        //     // 调用renderChart方法对图表进行重新渲染
        //     window.addEventListener('resize', this.renderChart);
        // },
        // handleBus(msg) {
        //     setTimeout(() => {
        //         this.renderChart();
        //     }, 200);
        // },
        // renderChart() {
        //     this.$refs.bar.renderChart();
        //     this.$refs.line.renderChart();
        // }
    }
};
</script>


<style scoped>
	.el-row {
		margin-bottom: 20px;
	}

	.grid-content {
		display: flex;
		align-items: center;
		height: 100px;
	}

	.grid-cont-right {
		flex: 1;
		text-align: center;
		font-size: 14px;
		color: #999;
	}

	.grid-num {
		font-size: 30px;
		font-weight: bold;
	}

	.grid-con-icon {
		font-size: 50px;
		width: 100px;
		height: 100px;
		text-align: center;
		line-height: 100px;
		color: #fff;
	}

	.grid-con-1 .grid-con-icon {
		background: rgb(45, 140, 240);
	}

	.grid-con-1 .grid-num {
		color: rgb(45, 140, 240);
	}

	.grid-con-2 .grid-con-icon {
		background: rgb(100, 213, 114);
	}

	.grid-con-2 .grid-num {
		color: rgb(45, 140, 240);
	}

	.grid-con-3 .grid-con-icon {
		background: rgb(242, 94, 67);
	}

	.grid-con-3 .grid-num {
		color: rgb(242, 94, 67);
	}

	.user-info {
		display: flex;
		align-items: center;
		padding-bottom: 20px;
		border-bottom: 2px solid #ccc;
		margin-bottom: 20px;
	}

	.user-avator {
		width: 120px;
		height: 120px;
		border-radius: 50%;
	}

	.user-info-cont {
		padding-left: 50px;
		flex: 1;
		font-size: 14px;
		color: #999;
	}

	.user-info-cont div:first-child {
		font-size: 30px;
		color: #222;
	}

	.user-info-list {
		font-size: 14px;
		color: #999;
		line-height: 25px;
	}

	.user-info-list span {
		margin-left: 10px;
	}

	.mgb20 {
		margin-bottom: 10px;
	}

	.todo-item {
		font-size: 14px;
	}

	.todo-item-del {
		text-decoration: line-through;
		color: #999;
	}

	.schart {
		width: 100%;
		height: 300px;
	}

/* 2020-07-27 */
	.pageClass{
		background-color: #F2F2F2;
	}
	.marketBox{
		background: #FFFFFF;
		height: 248px;
		/* padding-bottom: 10px; */
		padding-top: 10px;
		border-radius: 6px;
	}
	.marketTitle{
		padding: 10px 15px;
		border-bottom: 1px solid #bcbcbc;
		color: #bcbcbc;
		margin-bottom: 20px;
	}
	.pageTop{
		min-width: 1043px;
		display: flex;
		margin-bottom: 20px;
		padding-top: 10px;
	}
	.pageLtop{
		width: 420px;
		margin-left: 10px;
	}
	.pageRtop{
		margin-left: 10px;
		width: calc( 100% - 450px );
	}
	.tableBox{
		padding: 0px 10px;
	}
	.pageRtopBox{
		display: flex;
		padding-left: 10px;
	}
	.mgbList{
		width: calc( 33.33% - 10px);
		margin-right: 10px;
	}
	.userInfo{
		padding: 10px;
		margin-bottom: 10px;
		background: #FFFFFF;
	}
	/* 右顶部 */
	.pageRtopIcon{
		width: 100px;
		height: 100px;
	}
	.pageRtopImg{
		width: 50px;
		height: 50px;
		display: block;
		margin: 25px auto;
	}
	/* 新增订单环形图 */
	.canvas-wrapper{
		width: 50%;
		display: inline-block;
	}
	.ringTitle{
		text-align: center;
		font-size: 12px;
		color: #b3b3b3;
		text-align: -moz-center !important;
		vertical-align: middle;
		margin-bottom: 30px;
	}
	.ringTitle>em{
		font-size: 32px;
		font-weight: bold;
		vertical-align: middle;
		color: #666666;
	}
	
	.ringBox{
		width: 200px;
		height: 200px;
		margin: 0px auto;
	}
	.ringBoxGraphics{
		width: 100%;
		position: relative;
	}
	.ringBoxMain{
		width: 140px;
		position: absolute;
		left: 30px;
		top: 68px;
		z-index: 100;
		text-align: center;
	}
	.ringBoxMainT{
		font-size: 42px;
		color: #666666;
		font-weight: bold;
	}
	.ringBoxMainB{
		font-size: 18px;
		color: #989898;
	}
	.ringDataBox{
		width: 280px;
		margin: 0px auto;
		margin-top: 10px;
	}
	.ringBoxList{
		width: 50%;
		display: inline-block;
		margin-top: 15px;
	}
	.ringBoxList:first-child{
		width: 80%;
	}
	.ringBoxListMian{
		display: flex;
		color: #333333;
		font-size: 12px;
		line-height: 20px;
		font-weight: bold;
	}
	.ringBoxListIcon{
		width: 10px;
		height: 10px;
		border-radius: 100%;
		margin-right: 4px;
		margin-top: 5px;
	}
	.ringBoxListPer{
		margin-left: 8px;
	}
	
	.barTitle{
		height: 50px;
		text-align: center;
		position: relative;
	}
	.barTitle>span{
		font-size: 14px;
		color: #989898;
	}
	.barTag{
		position: absolute;
		right: 0px;
		top: 0px;
		z-index: 10;
		height: 26px;
		border-radius: 26px;
		border: 1px solid #CCCCCC;
		display: flex;
	}
	.barTagList{
		width: 50px;
		height: 26px;
		line-height: 26px;
		font-size: 10px;
		color: #666666;
		text-align: center;
		border-radius: 26px;
		cursor: pointer;
	}
	.barTagAr{
		background: #edf3ff;
		color: #6297ea;
	}
</style>
