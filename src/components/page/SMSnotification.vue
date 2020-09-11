<template>
    <div class="smsContainer">
        <el-dialog
            title="短信提醒"
            :visible.sync="dialogVisible"
            width="628px"
            class="smsNotice"
            :close-on-click-modal="false"
        >
            <div class="baseInfo">
                <div class="title">
                    <div class="leftNav1">
                        <div class="title-left"></div>
                        <div class="text">基本信息</div>
                    </div>
                </div>
                <div class="waybillInfo">
                    <div class="listInfo">
                        <p>
                            <span>运单编号：</span>
                            {{waybillData.wcd}}
                        </p>
                        <p>
                            <span>货物名称：</span>
                            {{waybillData.on}}
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
                            <span style="text-indent: 0em;">司机名称：</span>
                            {{waybillData.cne}}
                        </p>
                        <p>
                            <span style="text-indent: 0em;">司机电话：</span>
                            {{waybillData.cph}}
                        </p>
                    </div>
                    <div class="listInfo">
                        <p>
                            <span style="text-indent: 0em;">装货时间：</span>
                            {{waybillData.qzte}}
                        </p>
                        <p>
                            <span style="text-indent: 0em;">卸货时间：</span>
                            {{waybillData.qxte}}
                        </p>
                    </div>
                </div>
            </div>
            <div class="sendSMS">
                <div class="title">
                    <div class="leftNav1">
                        <div class="title-left"></div>
                        <div class="text">提醒信息</div>
                    </div>
                </div>
                <el-radio-group class="smsType" v-model="radio" @change="typeChange">
                    <el-radio label="1">休息提醒</el-radio>
                    <el-radio label="2">轨迹异常</el-radio>
                </el-radio-group>
                <el-input type="textarea" v-model="smsCon" maxlength="30" :rows="5" show-word-limit></el-input>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">发 送</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import request from '../../utils/request.js';
export default {
    props: ['getWayData'],
    data() {
        return {
            dialogVisible: false,
            waybillData: this.getWayData,
            radio: '1',
            smsCon: '您已长时间驾驶，请注意休息！'
        };
    },
    watch: {
        getWayData: {
            handler(newValue, oldValue) {
                this.waybillData = newValue;
            },
            deep: true
        }
    },
    components: {},
    methods: {
        open() {
            this.dialogVisible = true;
        },
        typeChange() {
            if (this.radio == 1) {
                this.smsCon = '您已长时间驾驶，请注意休息！';
            } else {
                this.smsCon = '您的定位异常，请注意开启GPS定位！';
            }
            // console.log(this.radio);
        },
        async saveEdit() {
            this.dialogVisible = false;
            let loginData = this.$store.state.loginData;
            let hd = {
                pi: 20046,
                si: loginData.si,
                sq: 9
            };
            let bd = {
                tid: loginData.tid,
                bid: this.waybillData.wid,
                bte: 3,
                ct: this.smsCon
            };
            let resData = await request('20046', hd, bd);
            if (resData.hd.rid >= 0) {
                this.$message({
                    type: 'success',
                    message: '发送成功',
                    duration: 900
                });
            } else {
                this.$message({
                    type: 'error',
                    message: resData.hd.rmsg
                });
            }
        }
    }
};
</script>

<style scoped lang="scss">
.smsContainer {
    .smsNotice {
        // position: relative;
        /deep/ .el-dialog {
            height: 700px;
        }
        /deep/ .el-dialog__body {
            padding: 25px 20px;
        }
        /deep/ .el-dialog__header {
            padding: 6px 10px;
            background: #409eff;
            .el-dialog__title {
                color: #fff;
                font-size: 14px;
            }
            .el-dialog__headerbtn .el-dialog__close {
                color: #fff;
            }
            .el-dialog__headerbtn {
                top: 10px;
            }
        }
        .title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 5px;
            border-bottom: 1px solid #ccc;
            margin-bottom: 10px;
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
                    font-size: 17px;
                }
            }
        }
        .baseInfo {
            .waybillInfo {
                // padding: 20px;
                padding: 10px 13px 20px;
                .listInfo {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    p {
                        width: 50%;
                        display: flex;
                        line-height: 35px;
                        color: #000;
                        font-size: 16px;
                        // text-indent: 1em;
                        span {
                            color: #bcb8b8;
                        }
                    }
                }
            }
        }
        .sendSMS {
            margin-top: 20px;
            .smsType {
                margin: 10px 0 20px;
                // font-size: 16px;
            }
            /deep/ .el-textarea__inner {
                resize: none;
            }
        }
        /deep/ .el-dialog__footer {
            padding: 10px 20px;
            background-color: #f8f8f8;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
    }
}
</style>