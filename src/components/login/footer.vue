<template>
    <div class="foot">
        <div class="clearFix wrap">
            <div class="footer-left fl">
                <div class="com-logoInfo clearFix">
                    <h1 class="logo fl"></h1>
                </div>
                <p class="com-info">全国24小时服务调度</p>
                <p class="com-info">一站式安全无忧运输</p>
                <p class="com-info">大数据决策分析赋能</p>
                <p class="com-hotline">
                    招商热线：
                    <span>400-666-7056</span> 转 2
                </p>
            </div>
            <div class="footer-right clearFix fr">
                <div class="footer-zxfd fl">
                    <h3>中象福达</h3>
                    <p>产品介绍</p>
                    <p>
                        <a href="http://www.gdzxjy.net.cn/ms-book.html" target="_blank">在线咨询</a>
                    </p>
                    <p>招商加盟</p>
                </div>
                <div class="footer-about fl">
                    <h3>关于我们</h3>
                    <p>关于我们</p>
                    <p>加入我们</p>
                </div>
                <div class="footer-contact fr">
                    <h3>联系我们</h3>
                    <p>公司电话：020-39922019</p>
                    <p>公司邮箱：service@gdzxjy.com.cn</p>
                    <p>总部地址：广州市番禺区东环街番禺大道北537号番山创业中心</p>
                </div>
            </div>
        </div>
        <div class="down-div">
            <p>
                Copyright©2019-2022广东中象集运科技有限公司All rights reserved.
                <a
                    target="_blank"
                    href="http://www.beian.miit.gov.cn"
                >粤ICP备19052867号-3</a>
            </p>
        </div>
    </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.foot {
    width: 100%;
    background-color: #020429;
    display: flex;
    flex-direction: column;
    height: 265px;
    .wrap {
        margin: 0 auto;
        padding: 20px 0;
        display: flex;
        .footer-left {
            color: #fff;
            margin-right: 90px;
            .com-logoInfo {
                height: 50px;
                margin-bottom: 15px;
                .logo {
                    width: 180px;
                    height: 50px;
                    background: url('../../assets/img/footer-logo.png') no-repeat;
                    background-size: 100%;
                }
            }
            .com-logoInfo:hover .QRcode {
                width: 100px;
                height: 100px;
                opacity: 0;
                transition: all 0.4s;
            }
            .com-logoInfo:hover .bigQRcode {
                width: 100px;
                height: 100px;
                opacity: 1;
                transition: all 0.4s;
                transition-timing-function: cubic-bezier(0, 0.2, 0.8, 1);
            }
            .com-info {
                color: #fff;
                font-size: 14px;
                line-height: 22px;
            }
            .com-hotline {
                margin-top: 10px;
                span {
                    color: #fac01b;
                    font-weight: 300;
                }
            }
        }
        .footer-right {
          
            display: flex;
            color: #fff;
            h3 {
                font-weight: normal;
                margin-bottom: 10px;
            }
            p {
                font-size: 14px;
                line-height: 26px;
                color: #f3f3f3;
                a {
                    color: #f3f3f3;
                }
                a:hover {
                    color: #fac01b;
                }
            }
            // .footer-zxfd{
            // 	// h3
            // }
            .footer-about {
                margin-left: 150px;
            }
            .footer-contact {
                margin-left: 100px;
            }
        }
    }

    .down-div {
        width: 100%;
        text-align: center;
        color: #9a9a9a;
        font-size: 14px;
        a {
            color: #9a9a9a;
        }
        a:hover {
            color: #fac01b;
        }
    }
}
</style>