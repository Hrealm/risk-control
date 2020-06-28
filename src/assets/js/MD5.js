import CryptoJS from 'crypto-js'
const AES_PARA = "JJL2@ys5xs0^99N!"; //密钥参数





export default {

    md5(str, times) {
        for (let i = 0; i < times; i++) {
            str = CryptoJS.MD5(str).toString();
        }
        return str;
    }

}