<template>
    <el-form style="width: 290px;">
        <el-form-item style="height: 40px;margin-bottom: 20px;">
            <el-input class="input" maxlength="8" placeholder="请输入验证码" v-model="verification"></el-input>
            <div class="divIdentifyingCode" @click="getIdentifyingCode(true)">
                <img
                    id="imgIdentifyingCode"
                    style="height:32px; width: 100px; cursor: pointer;"
                    alt="点击更换"
                    title="点击更换"
                    :src="codeImg"
                />
            </div>
        </el-form-item>
    </el-form>
</template>
 
<script>
export default {
    data() {
        return {
            codeImg: '',
            param: {
                verification:""
            },
            rules: {
                verification: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.getCode();
    },
    methods: {
        getIdentifyingCode: function(bRefresh) {
            this.getCode();
        },
        getCode() {
            let requestPath = this.$store.state.Login.url+'/10003';
            this.$axios
                .post(requestPath, {
                    hd: {
                        pi: 10003,
                        sq: 8
                    }
                })
                .then(res => {
                    this.codeImg = `data:image/jpg;base64,${JSON.parse(res.data.bd).img}`;
                    this.codeID = JSON.parse(res.data.bd).id;
                    console.log(codeImg);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
};
</script>
 
<style>
.divIdentifyingCode {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 5;
    width: 102px; /*设置图片显示的宽*/
    height: 30px; /*图片显示的高*/
    background: #e2e2e2;
    margin: 0;
}
</style>