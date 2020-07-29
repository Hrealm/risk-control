<template>
    <div class="goods" style="background:#fff;">
        <div class="left">
            <div class="nav1">
                <div class="title">
                    <div class="leftNav1">
                        <div class="title-left"></div>
                        <div class="text">运单信息</div>
                    </div>
                    <el-button type="primary" @click="cancel" class="titleBtn">返回</el-button>
                </div>
                <div class="center">
                    <div class="waybillInfo">
                        <div class="listInfo">
                            <p>
                                <span>货物名称：</span>
                                {{waybillData.on}}
                            </p>
                            <p>
                                <span>运单编号：</span>
                                {{waybillData.wcd}}
                            </p>
                        </div>
                        <div class="listInfo">
                            <p>
                                <span style="text-indent: 1em;">起运地：</span>
                                {{waybillData.zct}}
                            </p>
                            <p>
                                <span style="text-indent: 1em;">目的地：</span>
                                {{waybillData.xct}}
                            </p>
                        </div>
                        <div class="listInfo">
                            <p>
                                <span style="text-indent: 2em;">重量：</span>
                                {{waybillData.dw}} 吨
                            </p>
                            <p>
                                <span style="text-indent: 2em;">体积：</span>
                                {{waybillData.dv}} 方
                            </p>
                        </div>
                        <div class="listInfo">
                            <p>
                                <span style="text-indent: 0em;">司机名称：</span>
                                {{waybillData.cne}}
                            </p>
                            <p>
                                <span style="text-indent: 0em;">司机电话：</span>
                                {{waybillData.cph}}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="nav2">
                <div class="title">
                    <div class="title-left"></div>
                    <div class="text">运输路径</div>
                </div>
                <div class="center">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="速度优先" name="first" v-loading="isFirst">
                            <div class="map">
                                <iframe
                                    :src="src"
                                    frameborder="0"
                                    width="100%"
                                    height="100%"
                                    scrolling="no"
                                ></iframe>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="费用优先" name="second" v-loading="isFirst">
                            <div class="map">
                                <iframe
                                    :src="src"
                                    frameborder="0"
                                    width="100%"
                                    height="100%"
                                    scrolling="no"
                                ></iframe>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="距离优先" name="third" v-loading="isFirst">
                            <div class="map">
                                <iframe
                                    :src="src"
                                    frameborder="0"
                                    width="100%"
                                    height="100%"
                                    scrolling="no"
                                ></iframe>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="nav1">
                <div class="title">
                    <div class="n1_Left">
                        <div class="title-left"></div>
                        <div class="text">司机定位</div>
                    </div>
                    <el-button type="primary" class="titleBtn" @click="refresh" :disabled="isClick">获取</el-button>
                </div>
                <div class="center">
                    <div class="table">
                        <el-table
                            :data="tableData"
                            border
                            ref="multipleTable"
                            :fit="true"
                            :height="tableHeight"
                            :header-cell-style="headClass"
                            style="font-size: 14px;"
                        >
                            <el-table-column prop="ctm" label="日期" width="230" align="center"></el-table-column>
                            <el-table-column prop="add" label="地址" width align="center"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <div class="nav2">
                <div class="title">
                    <div class="n2_Right">
                        <div class="title-left"></div>
                        <div class="text">实时轨迹</div>
                    </div>
                    <el-button type="primary" class="titleBtn" @click="synchronize" :disabled="isSync">同步</el-button>
                </div>
                <div class="center">
                    <div class="realTimeMap" v-loading="isReal">
                        <iframe
                            :src="srcReal"
                            frameborder="0"
                            width="100%"
                            height="100%"
                            scrolling="no"
                        ></iframe>
                    </div>
                </div>
            </div>
            <!-- <div class="but">
                <el-button type="primary" style="width:120px" @click="cancel">返回</el-button>
            </div>-->
        </div>
    </div>
</template>
<script>
import request from '../../utils/request.js';
export default {
    props: ['getWayData', 'getLoginData'],
    data() {
        return {
            isClick: false,
            isFirst: false,
            isReal: false,
            isSync: false,
            customerData: [],
            waybillData: this.getWayData,
            loginData: this.getLoginData,
            location: {},
            tableData: [],
            tableHeight: 160,
            activeName: 'first',
            src: '',
            srcReal: ''
        };
    },
    created() {
        this.isFirst = true;
        this.isReal = true;
        setTimeout(() => {
            this.isFirst = false;
            this.isReal = false;
        }, 2000);
        this.getData();
    },
    methods: {
        async getData() {
            let bd = {
                tid: this.loginData.tid,
                wid: this.waybillData.wid
            };
            let hd = {
                pi: 30078,
                si: this.loginData.si,
                sq: 9
            };
            let resData = await request('/30078', hd, bd);
            if (resData.hd.rid >= 0) {
                this.location = JSON.parse(resData.bd);
                this.tableData = this.location.olst;
                this.src = `./_map.html?plan=1&zlng=${this.location.zlng}&zlat=${this.location.zlat}&xlng=${this.location.xlng}&xlat=${this.location.xlat}`;
                let center = '';
                let add = '';
                let list = this.tableData;
                if (list.length) {
                    center = [list[list.length - 1].log, list[list.length - 1].lat];
                    let addArr = list[list.length - 1].add.split(' ');
                    // console.log(addArr);
                    add = addArr[0];
                }
                this.srcReal = `./map.html?start=${this.location.zlng},${this.location.zlat}&end=${this.location.xlng},${this.location.xlat}&center=${center}&add=${add}`;
            } else {
                this.$message({
                    type: 'error',
                    message: resData.hd.rmsg
                });
            }

            // this.$axios
            //     .post('/30078', {
            //         hd: {
            //             pi: 30078,
            //             si: this.loginData.si,
            //             sq: 9
            //         },
            //         bd: {
            //             tid: this.loginData.tid,
            //             wid: this.waybillData.wid
            //         }
            //     })
            //     .then(res => {
            //         this.location = JSON.parse(res.data.bd);
            //         this.tableData = this.location.olst;
            //         this.src = `./_map.html?plan=1&zlng=${this.location.zlng}&zlat=${this.location.zlat}&xlng=${this.location.xlng}&xlat=${this.location.xlat}`;
            //         this.srcReal = `./map.html?tid=${this.loginData.tid}&wid=${this.waybillData.wid}&si=${this.loginData.si}`;
            //         // console.log(this.location);
            //     });
        },
        cancel() {
            this.$emit('goback');
        },
        handleClick(tab, event) {
            if (tab.index == 0) {
                this.isFirst = true;
                setTimeout(() => {
                    this.isFirst = false;
                }, 2500);
                this.src = `./_map.html?plan=1&zlng=${this.location.zlng}&zlat=${this.location.zlat}&xlng=${this.location.xlng}&xlat=${this.location.xlat}`;
            } else if (tab.index == 1) {
                this.isFirst = true;
                setTimeout(() => {
                    this.isFirst = false;
                }, 2500);
                this.src = `./_map.html?plan=2&zlng=${this.location.zlng}&zlat=${this.location.zlat}&xlng=${this.location.xlng}&xlat=${this.location.xlat}`;
            } else if (tab.index == 2) {
                this.isFirst = true;
                setTimeout(() => {
                    this.isFirst = false;
                }, 2500);
                this.src = `./_map.html?plan=3&zlng=${this.location.zlng}&zlat=${this.location.zlat}&xlng=${this.location.xlng}&xlat=${this.location.xlat}`;
            }
        },
        headClass() {
            return 'background:#ff0000;color:#606266;text-align:center;';
        },
        async refresh() {
            this.isClick = true;
            let hd = {
                pi: 43002,
                si: this.loginData.si,
                sq: 9
            };
            let bd = {
                tid: this.loginData.tid,
                wid: this.waybillData.wid,
                cn: this.waybillData.cn
            };
            let resData = await request('/43002', hd, bd);
            if (resData.hd.rid >= 0) {
                this.isClick = false;
                this.getData();
            } else {
                this.isClick = false;
                this.$message({
                    type: 'error',
                    message: resData.hd.rmsg,
                    duration:900
                });
            }

            // this.$axios
            //     .post('/43002', {
            //         hd: {
            //             pi: 43002,
            //             si: this.loginData.si,
            //             sq: 9
            //         },
            //         bd: {
            //             tid: this.loginData.tid,
            //             wid: this.waybillData.wid,
            //             cn: this.waybillData.cn
            //         }
            //     })
            //     .then(res => {
            //         if (res.data.hd.rid >= 0) {
            //             this.getData();
            //         } else {
            //             this.open2(res.data.hd.rmsg);
            //         }
            //         // console.log(res.data.hd.rid);
            //     });
        },
        synchronize(){
            this.isReal = true;
            this.isSync = true;
            setTimeout(() => {
                this.isReal = false;
                this.isSync = false;
            }, 2000);
        },
        open1(text) {
            this.$message({
                showClose: true,
                message: text,
                type: 'success',
                duration: 900
            });
        },
        open2(text) {
            this.$message({
                showClose: true,
                message: text,
                type: 'error',
                duration: 900
            });
        }
    },
    components: {}
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
.table /deep/.cell {
    line-height: 14px !important;
}
/deep/textarea {
    resize: none !important;
    height: 150px !important;
    width: 545px;
}
/deep/.is-checked {
    background: #409eff;
}
.goods {
    // display: flex;
    display: -webkit-box;
    width: 100%;
    height: 100%;
    background-color: #fff;
    .left {
        width: 700px;
        display: flex;
        flex-direction: column;
        padding-right: 40px;
    }
    .right {
        width: 700px;
        display: flex;
        flex-direction: column;
        padding-left: 40px;
    }
}
.goods {
    padding: 20px;
    .left {
        .nav1 {
            .title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-bottom: 10px;
                border-bottom: 1px solid #ccc;
                .leftNav1 {
                    display: flex;
                    align-items: center;
                    .title-left {
                        width: 5px;
                        height: 18px;
                        background: #409eff;
                        margin-right: 10px;
                    }
                    .text {
                        font-size: 18px;
                    }
                }
                .titleBtn {
                    width: 80px;
                    padding: 4px;
                    font-size: 14px;
                }
            }
            .center {
                .waybillInfo {
                    padding: 20px;
                    .listInfo {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        p {
                            width: 50%;
                            display: flex;
                            line-height: 35px;
                            // text-indent: 1em;
                            span {
                                color: #bcb8b8;
                            }
                        }
                    }
                }
            }
        }
        .nav2 {
            margin-top: 20px;
            .title {
                display: flex;
                align-items: center;
                padding-bottom: 10px;
                border-bottom: 1px solid #ccc;
                .title-left {
                    width: 5px;
                    height: 18px;
                    background: #409eff;
                    margin-right: 10px;
                }
                .text {
                    font-size: 18px;
                }
            }
            .center {
                // padding: 15px;
                /deep/ .el-tabs {
                    position: relative;
                }
                /deep/ .el-tabs__header {
                    position: absolute;
                    top: -41px;
                    right: 0;
                }
                /deep/ .el-tabs__nav-wrap::after {
                    background-color: #fff;
                }
                .map {
                    width: 100%;
                    height: 520px;
                    margin-top: 30px;
                }
            }
        }
    }
    .right {
        .nav1 {
            .title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-bottom: 10px;
                border-bottom: 1px solid #ccc;
                .n1_Left {
                    display: flex;
                    align-items: center;
                    .title-left {
                        width: 5px;
                        height: 18px;
                        background: #409eff;
                        margin-right: 10px;
                    }
                    .text {
                        font-size: 18px;
                    }
                }
                .titleBtn {
                    width: 80px;
                    padding: 4px;
                    font-size: 14px;
                }
            }
            .center {
                .table {
                    margin-top: 20px;
                }
            }
        }
        .nav2 {
            margin-top: 20px;
            .title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-bottom: 10px;
                border-bottom: 1px solid #ccc;
                .n2_Right {
                    display: flex;
                    align-items: center;
                    .title-left {
                        width: 5px;
                        height: 18px;
                        background: #409eff;
                        margin-right: 10px;
                    }
                    .text {
                        font-size: 18px;
                    }
                }
                .titleBtn {
                    width: 80px;
                    padding: 4px;
                    font-size: 14px;
                }
            }
            .realTimeMap {
                margin-top: 30px;
                width: 100%;
                height: 520px;
            }
        }
    }
}
</style>