<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <!-- <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>-->
        <div class="collapse-btn">
            <img src="../../assets/img/footer-logo.png" alt />
        </div>
        <div class="line"></div>
        <div class="logo">交易中心风控系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <!-- <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>-->
                <!-- 消息中心 -->
                <!-- <div class="btn-bell">
                    <el-tooltip
                        effect="dark"
                        :content="message?`有${message}条未读消息`:`消息中心`"
                        placement="bottom"
                    >
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div>-->
                <!-- 用户头像 -->
                <!-- <div class="user-avator">
                    <img src="../../assets/img/img.jpg" />
                </div>-->

                <!-- 用户名下拉菜单 -->
                <!-- <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>-->

                <a href="javascript:;" class="goods" @click="exit" style="color:#fff;">
                    <div class="deliverGoods">
                        <i class="el-icon-switch-button"></i>
                        退出
                    </div>
                </a>

                <!-- 用户头像 -->
                <div class="user-avator">
                    <img :src="picUrl"  />
                </div>
                <div class="user-name">{{username}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import bus from '../common/bus';
export default {
    data() {
        return {
			picUrl: require('../../assets/img/dispatch-icon.png'),
            collapse: false,
            fullscreen: false,
            username: 'admin',
            message: 2
        };
    },
    created() {
        this.username = this.$store.state.loginData.name;
    },
    computed: {
        // username() {
        //     let username = localStorage.getItem('ms_username');
        //     return username ? username : this.name;
        // }
    },
    methods: {
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
                // localStorage.removeItem('vuex');
                // var exp = new Date();
                // exp.setTime(exp.getTime() - 1);
                // document.cookie = `login=${
                //     document.cookie.match(new RegExp('(^| )' + 'login' + '=([^;]*)(;|$)'))[2]
                // };expires=${exp.toGMTString()}`;
                // this.$router.push('/login');
            }
        },
        exit() {
            this.$confirm('是否退出登录', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    localStorage.removeItem('vuex');
                    var exp = new Date();
                    exp.setTime(exp.getTime() - 1);
                    document.cookie = `login=${
                        document.cookie.match(new RegExp('(^| )' + 'login' + '=([^;]*)(;|$)'))[2]
                    };expires=${exp.toGMTString()}`;
                    this.$router.push('/login');
                })
                .catch(() => {});
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        }
    },
    mounted() {
        if (document.body.clientWidth < 1500) {
            // this.collapseChage();
        }
    }
};
</script>
<style lang="scss" scoped>
.el-dropdown-menu {
    /deep/ .el-dropdown-menu__item--divided {
        border: none;
    }
}
</style>
<style scoped lang="scss">
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.collapse-btn {
    float: left;
    padding: 0 30px;
    cursor: pointer;
    line-height: 70px;
    // border-right: 1px solid #ccc;
    // margin-right: 15px;
    img {
        margin-top: 13.5px;
        width: 150px;
        height: 40px;
    }
}
.line {
    position: absolute;
    border-right: 5px solid #ffffff;
    left: 210px;
    top: 21.5px;
    height: 40%;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
    margin-left: 20px;
}
.header-right {
    float: right;
    padding-right: 50px;
    .goods {
        display: block;
        padding: 5px;
        box-sizing: border-box;
        .deliverGoods:hover {
            color: #409eff;
        }
    }
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
    .deliverGoods {
        margin-right: 20px;
        font-size: 16px;
        position: relative;
        a {
            color: #fff;
        }
    }
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
    font-size: 16px;
}
// .user-avator {
//     // margin-left: 20px;
// }
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
