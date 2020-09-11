<template>
    <div class="goods" style="background:#fff;">
        <div class="left">
            <div class="nav1">
                <div class="title">
                    <div class="title-left"></div>
                    <div class="text">运单信息</div>
                </div>
                <div class="center">
                    
                    
                </div>
            </div>
            <div class="nav2">
                <div class="title">
                    <div class="title-left"></div>
                    <div class="text">推荐路径</div>
                </div>
                <div class="center">
                    
                </div>
            </div>
            
        </div>
        <div class="right">
            <div class="nav1">
                <div class="title">
                    <div class="title-left"></div>
                    <div class="text">实时轨迹</div>
                </div>
                <div class="center">
                    
                </div>
            </div>
            <div class="nav2">
                <div class="title">
                    <div class="title-left"></div>
                    <div class="text">其他</div>
                </div>
                <div class="center">
                    
                </div>
            </div>
            <div class="but">
                <el-button type="primary" style="width:120px" @click="cancel">返回</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            customerData: [],
        };
    },
    created() {
        // this.loginData = this.$store.state.Login.CustomerData;
        // this.orderData = this.$store.state.Order.orderData;
        // this.newsData = this.$store.state.Order.newsData;
        // this.form3.search = this.orderData.fhr + ' ' + this.orderData.fhrp;
        // this.form1.start = this.newsData.zct;
        // this.form1.end = this.newsData.xct;
        // this.form1.dis = this.newsData.dis;
        // this.form2.goodsName = this.newsData.on;
        // this.form2.price = this.orderData.qyf;
        // if (this.orderData.dw.indexOf('-') == -1) {
        //     this.form2.weight1 = this.orderData.dw;
        // } else {
        //     let dwArr = this.orderData.dw.split('-');
        //     this.form2.weight1 = dwArr[0];
        //     this.form2.weight2 = dwArr[1];
        // }
        // if (this.orderData.dv.indexOf('-') == -1) {
        //     this.form2.volume1 = this.orderData.dv;
        // } else {
        //     let dvArr = this.orderData.dv.split('-');
        //     this.form2.volume1 = dvArr[0];
        //     this.form2.volume2 = dvArr[1];
        // }
        // this.form2.datatime = this.orderData.zdy;
        // this.form2.time = this.orderData.zte;

        // this.form3.transportType = this.orderData.te;
        // this.form3.pretendType = this.orderData.zxte;
        // this.form3.ct = this.orderData.ct.split(',');
        // this.form3.cl = this.orderData.cl.split(',');
        // this.otherList = this.orderData.odc.split(',');
        // this.form2.textarea = this.orderData.dc;

        // console.log(this.orderData);
        // console.log(this.newsData);
        // // this.search();
        // this.startProvinceChange();
    },
    methods: {
        
        

        cancel() {
            this.$emit('goback');
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
<style lang="scss">
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
    width: 80px;
}
.el-radio-button:first-child .el-radio-button__inner {
    border-left: none !important;
    border-radius: 4px 0 0 4px;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
}
.el-radio-button {
    // border-left: none;
    border-left: 1px solid #ccc;
}

.el-radio-button__inner {
    width: 80px;
    // border: none !important;
    border-radius: 0px !important;
}

.el-checkbox-button__inner {
    width: 80px;
    // border: none !important;
    border-radius: 0px !important;
    border-left: 1px solid #ccc;
}
</style>
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
    display: flex;
    width: 100%;
    height: 100%;
    .left {
        width: 700px;
        display: flex;
        flex-direction: column;
        padding-right: 40px;
        .nav1,
        .nav2,
        .nav3 {
            height: 30%;
            width: 100%;

            padding-top: 20px;
            padding-left: 10px;

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
                // position: relative;
                .form {
                    margin-top: 22px;
                    position: relative;
                    .dis {
                        position: absolute;
                        left: 600px;
                        top: 50%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        .text {
                            font-size: 20px;
                            text-align: center;
                        }
                        .num {
                            font-size: 20px;
                            text-align: center;
                        }
                    }
                    .row {
                        display: flex;
                        position: relative;
                        .el-form-item {
                            margin-bottom: 18px;
                        }
                        .tipe {
                            position: absolute;
                            top: 10px;
                            color: #f56c6c;
                        }
                    }
                }
                .table {
                    /deep/.el-table__body-wrapper {
                        height: 200px;
                        overflow: scroll;
                        overflow-x: hidden;
                    }
                    // /deep/.el-table__body-wrapper::-webkit-scrollbar {
                    //     display: none;
                    // }
                }
            }
        }
        .nav1 {
            height: 152px;
        }
        .nav2 {
            height: 230px;
            width: 100%;
            // background: rgba($color: red, $alpha: 0.4);
            padding-top: 20px;
            padding-left: 10px;
        }
        .nav3 {
            height: 30%;
            width: 100%;
            // background: rgba($color: red, $alpha: 0.4);
            padding-top: 20px;
            padding-left: 10px;
        }
    }
    .right {
        width: 700px;
        display: flex;
        flex-direction: column;
        padding-left: 40px;
        .nav1,
        .nav2 {
            height: 40%;
            width: 100%;
            padding-top: 20px;
            padding-left: 10px;
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
                // position: relative;
                display: flex;
                flex-direction: column;
                .form {
                    margin-top: 22px;
                    position: relative;
                    height: 52px;
                    .dis {
                        position: absolute;
                        left: 600px;
                        top: 40%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        .text {
                            font-size: 20px;
                            text-align: center;
                        }
                        .num {
                            font-size: 20px;
                            text-align: center;
                        }
                    }
                    .row {
                        display: flex;
                        .el-form-item {
                            margin-bottom: 18px;
                        }
                    }
                }
                // .table {
                //     flex: 1;
                //     /deep/.el-table__body-wrapper {
                //         height: 400px;
                //         overflow: scroll;
                //     }
                //     /deep/.el-table__body-wrapper::-webkit-scrollbar {
                //         display: none;
                //     }
                // }
            }
        }
        .nav1 {
            height: 381px;
        }
        .nav2 {
            height: 352px;
            width: 100%;
            .search {
                margin-top: 20px;
            }
        }
        .but {
            text-align: center;
        }
    }
}
</style>