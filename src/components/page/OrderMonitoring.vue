<template>
    <div class="container">
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
                <span>订单信息</span>
                <el-input
                    v-model="sourceInfoInput"
                    clearable
                    style="width:200px; margin-left:20px;"
                    :disabled="isMon"
                ></el-input>
            </div>
            <el-button @click="monBtn" :type="isMon ? 'primary' : ''">{{monTxt}}</el-button>
            <el-button style="width:80px;margin-left:20px;" :disabled="isMon" @click="getData">查 找</el-button>
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
                <el-table-column width="70">
                    <template scope="scope">{{scope.$index + addIndex}}</template>
                </el-table-column>
                <el-table-column prop="ocd" label="订单编号" width="130"></el-table-column>
                <el-table-column prop="st" label="订单状态" width="130" :formatter="stateFormat"></el-table-column>
                <el-table-column prop="zct" label="起运地" width="180"></el-table-column>
                <el-table-column prop="xct" label="目的地" width="180"></el-table-column>
                <el-table-column prop="on" label="货物名称" width="150"></el-table-column>
                <el-table-column prop="dw" label="重量(吨)" width="150"></el-table-column>
                <el-table-column prop="dv" label="体积(方)" width="150"></el-table-column>
                <el-table-column prop="dis" label="距离(公里)" width="120">
                    <template slot-scope="scope">
                        <span>{{Math.round(scope.row.dis)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="qyf" label="期望运费(元)" width="120">
                    <template slot-scope="scope">
                        <span style="color:red;">{{scope.row.qyf}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="zdy" label="装货日期" width="160"></el-table-column>
                <el-table-column prop="ctm" label="创建时间" width="180"></el-table-column>
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
</template>

<script>
import request from '../../utils/request.js';
export default {
    data() {
        return {
            addIndex: 1,
            num: 5,
            sourceInfoInput: '',
            tableData: [],
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
        let isMoning = this.$store.state.orderTimeout;
        if (isMoning) {
            this.monTxt = '正在监控';
            this.isMon = true;
            this.interval = isMoning;
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 170;
        });
    },
    components: {},
    methods: {
        // 订单监控
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
                st: 0,
                ss: this.sourceInfoInput,
                cid: '',
                mid: '',
                opid: '',
                dsid: '',
                pg: this.currentPage,
                sz: this.pageSize
            };
            let hd = {
                pi: 30005,
                si: this.loginData.si,
                sq: 9
            };
            let resData = await request('/30005', hd, bd);
            if(resData.hd.rid >= 0){
                let data = JSON.parse(resData.bd);
                this.totalNumber = data.pg.tn;
                this.tableData = data.olst;
            }else{
                this.$message({
                    type: 'error',
                    message: resData.hd.rmsg
                })
            }
            // this.$axios
            //     .post('/30005', {
            //         hd: {
            //             pi: 30005,
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
            // console.log(this.num * 1000);
        },
        cellBg({ row, column, rowIndex, columnIndex }) {
            if (columnIndex == 6 || columnIndex == 9 || columnIndex == 8 || columnIndex == 7) {
                return 'text-align:right;';
            } else {
                return 'text-align:center;';
            }
        },
        headClass() {
            return 'background:#ff0000;color:#606266;text-align:center;';
        },
        monBtn() {
            this.isMon = !this.isMon;
            if (this.isMon) {
                this.monTxt = '正在监控';
                this.monitoring();
            } else {
                this.monTxt = '开启监控';
                clearInterval(this.interval);
                this.$store.commit('setOrderMonitoring', null);
            }
        },
        monitoring() {
            this.interval = setInterval(() => {
                this.getData();
            }, this.num * 1000);
            this.$store.commit('setOrderMonitoring', this.interval);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.addIndex = (this.currentPage - 1) * this.pageSize + 1;
            this.getData();
            // console.log(`当前页: ${val}`);
        },
        stateFormat(row) {
            if (row.st == 0) {
                return '全部';
            }
            if (row.st == 1) {
                return '待接单';
            }
            if (row.st == 2) {
                return '待派车';
            }
            if (row.st == 3) {
                return '已派车';
            }
            if (row.st == 4) {
                return '已撤单';
            }
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
            width: 300px;
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
}
</style>
