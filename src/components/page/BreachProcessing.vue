<template>
    <div class="container">
        <div class="top">
            <div class="sourceInfo">
                <span>运单信息</span>
                <el-input
                    v-model="sourceInfoInput"
                    clearable
                    style="width:200px; margin-left:20px; margin-right:0px;"
                ></el-input>
            </div>
            <el-button style="width:80px;margin-left:20px;" @click="getData">查 找</el-button>
            <el-button style="width:80px;margin-left:20px;" @click="passBtn">审核通过</el-button>
            <!-- <div class="audit">
                <el-button type="success" style="margin-top:20px;">审核通过</el-button>
            </div>-->
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
                highlight-current-row
                @current-change="rowCurrentChange"
            >
                <el-table-column width="80">
                    <template scope="scope">{{scope.$index + addIndex}}</template>
                </el-table-column>
                <el-table-column prop="wcd" label="运单编号" width="120"></el-table-column>
                <el-table-column prop="ocd" label="关联订单" width="120"></el-table-column>
                <el-table-column prop="st" label="运单状态" width="120" :formatter="stateFormat"></el-table-column>
                <el-table-column prop="zct" label="起运地" width="180"></el-table-column>
                <el-table-column prop="xct" label="目的地" width="180"></el-table-column>
                <el-table-column prop="on" label="货物名称" width="120"></el-table-column>
                <el-table-column prop="dw" label="重量(吨)" width="100"></el-table-column>
                <el-table-column prop="dv" label="体积(方)" width="100"></el-table-column>
                <el-table-column prop="dis" label="距离(公里)" width="100">
                    <template slot-scope="scope">
                        <span>{{Math.round(scope.row.dis)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="dch" label="服务费(元)" width="100">
                    <template slot-scope="scope">
                        <span style="color:red;">{{scope.row.dch}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="yf" label="运费(元)" width="100">
                    <template slot-scope="scope">
                        <span style="color:red;">{{scope.row.yf}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="cne" label="司机名称" width="100"></el-table-column>
                <el-table-column prop="cph" label="司机电话" width="130"></el-table-column>
                <el-table-column prop="cn" label="车牌号" width="100"></el-table-column>
                <el-table-column prop="bne" label="负责客服" width="100"></el-table-column>
                <el-table-column prop="dne" label="负责调度" width="100"></el-table-column>
                <el-table-column prop="ctm" label="创建时间" width="160"></el-table-column>
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
            sourceInfoInput: '',
            tableData: [],
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
                    label: '运输中'
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
            currentRow: null,
            tableHeight: 600,
            currentPage: 1,
            totalNumber: 0,
            pageSize: 15
        };
    },
    created() {
        this.getData();
    },
    mounted() {
        this.$nextTick(() => {
            this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 160;
        });
    },
    components: {},
    methods: {
        //违约处理
        async getData() {
            // if (this.sourceInfoInput.trim()) {
            //     if (this.sourceInfoInput.length < 2) {
            //         this.$alert('运单信息输入过短，最小长度为两个字符', '提示', {
            //             confirmButtonText: '确定',
            //             callback: () => {}
            //         });
            //         return;
            //     }
            // }
            this.loginData = this.$store.state.loginData;
            var bd = {
                tid: this.loginData.tid,
                st: 9,
                ocd: '',
                ss: this.sourceInfoInput,
                cid: '',
                mid: '',
                opid: '',
                dsid: '',
                drid: '',
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
            //         // if (res.data.hd.rid >= 0) {
            //         let data = JSON.parse(res.data.bd);
            //         this.totalNumber = data.pg.tn;
            //         this.tableData = data.olst;
            //         // } else {
            //         //     console.log(res.data);
            //         //     // this.$alert('请选择需要操作的运单！', '提示', {
            //         //     //     confirmButtonText: res.data.,
            //         //     //     callback: function() {}
            //         //     // });
            //         // }
            //         // console.log(data);
            //     });
        },
        handleChange(value) {
            // console.log(value);
        },
        cellBg({ row, column, rowIndex, columnIndex }) {
            if (columnIndex == 11 || columnIndex == 10 || columnIndex == 9 || columnIndex == 8 || columnIndex == 7) {
                return 'text-align:right;';
            } else {
                return 'text-align:center;';
            }
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
        //选中
        rowCurrentChange(val) {
            this.currentRow = val;
        },
        async passBtn() {
            // console.log(this.currentRow);

            if (!this.currentRow) {
                this.$alert('请选择需要操作的运单！', '提示', {
                    confirmButtonText: '确定',
                    callback: function () {}
                });
                return;
            }
            var bd = {
                tid: this.loginData.tid,
                wid: this.currentRow.wid,
                plt: 2,
                dc: ''
            };
            let hd = {
                pi: 20016,
                si: this.loginData.si,
                sq: 9
            };
            let resData = await request('/20016', hd, bd);
            if (resData.hd.rid >= 0) {
                this.$message({
                    message: '审核通过',
                    type: 'success'
                });
                this.getData();
            } else {
                this.$alert(res.data.hd.rmsg, '提示', {
                    confirmButtonText: '确定',
                    callback: function () {}
                });
            }
            // this.$axios
            //     .post('/20016', {
            //         hd: {
            //             pi: 20016,
            //             si: this.loginData.si,
            //             sq: 9
            //         },
            //         bd: bd
            //     })
            //     .then(res => {
            //         if (res.data.hd.rid >= 0) {
            //             this.$message({
            //                 message: '审核通过',
            //                 type: 'success'
            //             });
            //             this.getData();
            //         } else {
            //             this.$alert(res.data.hd.rmsg, '提示', {
            //                 confirmButtonText: '确定',
            //                 callback: function() {}
            //             });
            //             // this.$message({
            //             //     message: res.data.hd.rmsg,
            //             //     type: 'warning'
            //             // });
            //         }
            //     });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.addIndex = (this.currentPage - 1) * this.pageSize + 1;
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
.el-table__body tr.current-row > td {
    background-color: #d8e5f4;
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
        .sourceInfo {
            display: inline-block;
            height: 50px;
            // width: 300px;
            line-height: 50px;
            margin-right: 10px;
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
