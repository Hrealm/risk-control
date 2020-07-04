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
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="ocd" label="订单编号" width="130"></el-table-column>
                <el-table-column prop="st" label="订单状态" width="130"></el-table-column>
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
export default {
    data() {
        return {
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
        getData() {
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
            this.$axios
                .post('/30005', {
                    hd: {
                        pi: 30005,
                        si: this.loginData.si,
                        sq: 9
                    },
                    bd: bd
                })
                .then(res => {
                    let data = JSON.parse(res.data.bd);
                    this.totalNumber = data.pg.tn;
                    this.tableData = data.olst;
                    // console.log(data.olst);
                });
        },
        handleChange(value) {
            // console.log(this.num * 1000);
        },
        cellBg({ row, column, rowIndex, columnIndex }) {
            return 'text-align:center;';
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
            this.getData();
            // console.log(`当前页: ${val}`);
        }
    }
};
</script>
<style>
.table {
    width: 100%;
    font-size: 14px;
}
.btn-prev:before {
    content: '上一页';
}
.btn-next:before {
    content: '下一页';
}
.el-icon-arrow-left,
.el-icon-arrow-right {
    display: none !important;
}
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
    }
}
</style>
