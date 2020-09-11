<template>
    <div>
        <div class="container" v-if="isShowCt">
            <div class="top">
                <div class="frequency">
                    <span>监控频率（秒）</span>
                    <el-input-number
                        v-model="num"
                        controls-position="right"
                        @change="handleChange"
                        :min="5"
                        :max="10"
                        :disabled="isMon"
                    ></el-input-number>
                </div>
                <div class="sourceInfo">
                    <span>运单信息</span>
                    <el-input
                        v-model="sourceInfoInput"
                        clearable
                        style="width:130px; margin-left:20px; margin-right:20px;"
                        :disabled="isMon"
                    ></el-input>
                    <span>运单状态</span>
                    <el-select
                        v-model="wbValue"
                        placeholder="全部"
                        style="width:130px; margin:0 0 0px 20px;"
                        :disabled="isMon"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                    <span style="margin-left: 20px;">轨迹偏移</span>
                    <el-select
                        v-model="offsetValue"
                        placeholder="全部"
                        style="width:130px; margin:0 0 0px 20px;"
                        :disabled="isMon"
                    >
                        <el-option
                            v-for="item in offsetOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
                <el-button @click="monBtn" :type="isMon ? 'primary' : ''">{{monTxt}}</el-button>
                <el-button
                    style="width:80px;margin-left:20px;"
                    :disabled="isMon"
                    @click="getData"
                >查 找</el-button>
            </div>
            <div class="contentData">
                <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    :height="tableHeight"
                    :fit="true"
                    :header-cell-style="headClass"
                    :cell-style="cellBg"
                >
                    <el-table-column width="80">
                        <template scope="scope">{{scope.$index + addIndex}}</template>
                    </el-table-column>
                    <el-table-column prop="wcd" label="运单编号" width="120"></el-table-column>
                    <!-- <el-table-column prop="ocd" label="关联订单" width="120"></el-table-column> -->
                    <el-table-column prop="st" label="运单状态" width="120" :formatter="stateFormat"></el-table-column>
                    <el-table-column label="GPS信号" width="100">
                        <template slot-scope="scope">
                            <img :src="scope.row.nst ? gpsNormal : gpsabNormal" alt width="25px" height="25px" />
                        </template>
                    </el-table-column>
                    <el-table-column label="卸货倒计时" width="110">
                        <template slot-scope="scope">
                            <span :style="scope.row.st == 4 ? 'color:#fff;' : 'color:#000;'">{{waitingTime(scope.row)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="轨迹偏移" width="110">
                        <template slot-scope="scope">
                            <span :class="scope.row.nst ? 'toIcon' : 'offToIcon'"></span>{{scope.row.nst ? '正常' : '异常'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="zct" label="起运地" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="xct" label="目的地" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="on" label="货物名称" width="120"></el-table-column>
                    <!-- <el-table-column prop="dw" label="重量(吨)" width="100"></el-table-column>
                    <el-table-column prop="dv" label="体积(方)" width="100"></el-table-column>-->
                    <el-table-column prop="dis" label="距离(公里)" width="100">
                        <template slot-scope="scope">
                            <span>{{Math.round(scope.row.dis)}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="dch" label="服务费(元)" width="100">
                        <template slot-scope="scope">
                            <span style="color:red;">{{scope.row.dch}}</span>
                        </template>
                    </el-table-column>-->
                    <el-table-column prop="yf" label="运费(元)" width="100">
                        <template slot-scope="scope">
                            <span style="color:red;">{{scope.row.yf}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cne" label="司机名称" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cph" label="司机电话" width="130"></el-table-column>
                    <el-table-column prop="cn" label="车牌号" width="100"></el-table-column>
                    <el-table-column prop="bne" label="负责客服" width="100"></el-table-column>
                    <el-table-column prop="dne" label="负责调度" width="100"></el-table-column>
                    <el-table-column prop="qzte" label="计划装货时间" width="180"></el-table-column>
                    <el-table-column prop="qxte" label="计划卸货时间" width="180"></el-table-column>
                    <!-- <el-table-column prop="ctm" label="创建时间" width="180"></el-table-column> -->
                    <el-table-column fixed="right" label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button @click="smsClick(scope.row)" type="text" size="small">短信提醒</el-button>
                            <el-button @click="handleClick(scope.row)" type="text" size="small">运输轨迹</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="page">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="15"
                    layout="total,  prev, pager, next, jumper"
                    :total="totalNumber"
                ></el-pagination>
            </div>
        </div>
        <track-transportation
            v-if="isShowTt"
            ref="tTransportation"
            @goback="goback"
            :getWayData="waybillData"
            :getLoginData="loginData"
        ></track-transportation>
        <sms-notification ref="sms" :getWayData="smsData"></sms-notification>
        <!-- <sms-notification ref="sms"></sms-notification> -->
    </div>
</template>

<script>
import request from '../../utils/request.js';
import trackTransportation from './trackTransportation.vue';
import smsNotification from './SMSnotification.vue';
export default {
    data() {
        return {
            smsData:{},
            gpsNormal: require('../../../src/assets/img/normal.png'),
            gpsabNormal: require('../../../src/assets/img/abnormal.png'),
            addIndex: 1,
            waybillData: {},
            isShowTt: false,
            isShowCt: true,
            num: 5,
            sourceInfoInput: '',
            tableData: [],
            wbValue: '4',
            options: [
                {
                    value: '0',
                    label: '全部'
                },
                {
                    value: '2',
                    label: '待签约'
                },
                {
                    value: '4',
                    label: '待收货'
                },
                {
                    value: '6',
                    label: '待关闭'
                },
                {
                    value: '7',
                    label: '已完成'
                },
                {
                    value: '8',
                    label: '已撤单'
                },
                {
                    value: '9',
                    label: '撤单待审核'
                }
            ],
            offsetValue: '1',
            offsetOptions: [
                {
                    value: '',
                    label: '全部'
                },
                {
                    value: '1',
                    label: '正常'
                },
                {
                    value: '0',
                    label: '异常'
                }
            ],
            loginData: {},
            monTxt: '开启监控',
            isMon: false,
            interval: null,
            tableHeight: 600,
            currentPage: 1,
            totalNumber: 0,
            pageSize: 15
        };
    },
    created() {
        this.getData();
        let isMoning = this.$store.state.waybillTimeout;
        if (isMoning) {
            this.monTxt = '正在监控';
            this.isMon = true;
            this.interval = isMoning;
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 160;
        });
    },
    components: {
        trackTransportation,
        smsNotification
    },
    methods: {
        //运单监控
        async getData() {
            // if (this.sourceInfoInput.trim()) {
            //     if (this.sourceInfoInput.length < 2) {
            //         this.$alert('货源信息输入过短，最小长度为两个字符', '提示', {
            //             confirmButtonText: '确定',
            //             callback: () => {}
            //         });
            //         return;
            //     }
            // }
            this.loginData = this.$store.state.loginData;
            var bd = {
                tid: this.loginData.tid,
                st: this.wbValue * 1 || 4,
                ocd: '',
                ss: this.sourceInfoInput,
                cid: '',
                mid: '',
                opid: '',
                dsid: '',
                drid: '',
                nst: this.offsetValue,
                pg: this.currentPage,
                sz: this.pageSize
            };
            let hd = {
                pi: 30017,
                si: this.loginData.si,
                sq: 9
            };
            let resData = await request('/30017', hd, bd);
            if (resData.hd.rid >= 0) {
                let data = JSON.parse(resData.bd);
                this.totalNumber = data.pg.tn;
                this.tableData = data.olst;
            } else {
                this.$message({
                    type: 'error',
                    message: resData.hd.rmsg
                });
            }
            // this.$axios
            //     .post('/30017', {
            //         hd: {
            //             pi: 30017,
            //             si: this.loginData.si,
            //             sq: 9
            //         },
            //         bd: bd
            //     })
            //     .then(res => {
            //         let data = JSON.parse(res.data.bd);
            //         this.totalNumber = data.pg.tn;
            //         this.tableData = data.olst;
            //         // console.log(data.olst);
            //     });
        },
        handleChange(value) {
            // console.log(value);
        },
        waitingTime(row) {
            if (row.st != 4 || !row.qxte) {
                return '--';
            }
            var stime = row.qxte;
            var dateBegin = new Date(stime.replace(/-/g, '/'));
            var dateEnd = new Date();
            var dateDiff = dateBegin.getTime() - dateEnd.getTime(); //时间差的毫秒数
            // var isInteger = true;
            // if(dateDiff < 0){
            //     isInteger = false;
            //     dateDiff = Math.abs(dateDiff);
            // }
            var hours = Math.floor(dateDiff / (3600 * 1000));

            // var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
            // var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
            // var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
            // var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
            // var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
            // return `${dayDiff <= 0 ? 0 : dayDiff}天 ${hours <= 0 ? 0 : hours}小时 ${minutes <= 0 ? 0 : minutes}分钟`;
            // return isInteger ?  `${dayDiff <= 0 ? 0 : dayDiff}天 ${hours <= 0 ? 0 : hours}小时 ${minutes <= 0 ? 0 : minutes}分钟` : `- ${dayDiff <= 0 ? 0 : dayDiff}天 ${hours <= 0 ? 0 : hours}小时 ${minutes <= 0 ? 0 : minutes}分钟`;
            // return isInteger ? `${hours}小时` : `- ${hours}小时`;
            return `${hours}小时`;
        },
        changeBg(row) {
            if (row.st != 4 || !row.qxte) {
                return 1;
            }
            var stime = row.qxte;
            var dateBegin = new Date(stime.replace(/-/g, '/'));
            var dateEnd = new Date();
            var dateDiff = dateBegin.getTime() - dateEnd.getTime(); //时间差的毫秒数
            return dateDiff < 0 ? 2 : 3;
        },
        cellBg({ row, column, rowIndex, columnIndex }) {
            if (columnIndex == 4) {
                let state = this.changeBg(row);
                switch (state) {
                    case 1:
                        return 'text-align:center;';
                    case 2:
                        return 'background:rgb(165,42,42);text-align:center;';
                    case 3:
                        return 'background:rgb(0,100,0);text-align:center;';
                    default:
                        break;
                }
                // console.log(state);
                // if (state == 1) {
                //     return 'text-align:center;';
                // } else if (state) {
                //     return 'background:rgb(165,42,42);text-align:center;';
                // } else if (!state) {
                //     return 'background:rgb(0,100,0);text-align:center;';
                // }
            }
            if (columnIndex == 10 || columnIndex == 9) {
                return 'text-align:right;';
            } else {
                return 'text-align:center;';
            }
            // return 'text-align:center;';
        },
        headClass() {
            return 'background:#ff0000;color:#606266;text-align:center;';
        },
        stateFormat(row) {
            let _val = row.st;
            this.options.forEach((ele) => {
                for (const key in ele) {
                    if (key == 'value') {
                        if (ele[key] == _val) {
                            _val = ele.label;
                            return;
                        }
                    }
                }
                return;
            });
            return _val;
        },
        monBtn() {
            this.isMon = !this.isMon;
            if (this.isMon) {
                this.monTxt = '正在监控';
                this.monitoring();
            } else {
                this.monTxt = '开启监控';
                clearInterval(this.interval);
                this.$store.commit('setWaybillMonitoring', null);
            }
        },
        monitoring() {
            this.interval = setInterval(() => {
                this.getData();
            }, this.num * 1000);
            this.$store.commit('setWaybillMonitoring', this.interval);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.addIndex = (this.currentPage - 1) * this.pageSize + 1;
            this.getData();
            // console.log(`当前页: ${val}`);
        },
        handleClick(row) {
            this.waybillData = row;
            this.isShowTt = true;
            this.isShowCt = false;
            // console.log(this.isShowTt);
        },
        smsClick(row) {
            this.smsData = row;
            this.$refs.sms.open();
        },
        goback() {
            this.isShowTt = false;
            this.isShowCt = true;
            this.getData();
        }
    }
};
</script>
<style>
.table {
    width: 100%;
    font-size: 14px;
}
/* .btn-prev:before {
    content: '上一页';
}
.btn-next:before {
    content: '下一页';
}
.el-icon-arrow-left,
.el-icon-arrow-right {
    display: none !important;
} */
</style>
<style scoped lang="scss">
.container {
    .top {
        .frequency {
            height: 50px;
            display: inline-block;
            line-height: 50px;
        }
        .sourceInfo {
            display: inline-block;
            height: 50px;
            // width: 300px;
            line-height: 50px;
            margin-left: 30px;
            margin-right: 30px;
        }
    }
    .contentData {
        margin-top: 25px;
    }
    .page {
        margin-top: 20px;
        height: 32px;
        text-align: right;
        /deep/ .el-pagination {
            /deep/ .btn-prev:before {
                content: '上一页';
            }
            /deep/ .btn-next:before {
                content: '下一页';
            }
            /deep/ .el-icon-arrow-left,
            .el-icon-arrow-right {
                display: none !important;
            }
        }
    }
    .toIcon{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #50CF99;
        margin: 0 5px;
        // vertical-align: middle;
    }
    .offToIcon{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #FF3347;
        margin: 0 5px;
        // vertical-align: middle;
    }
}
</style>
