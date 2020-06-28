import CryptoJS from 'crypto-js'
const AES_PARA = "JJL2@ys5xs0^99N!"; //密钥参数


// 加密方法
function AESUTILNormal(pwd) {
    var iv2 = CryptoJS.enc.Utf8.parse(AES_PARA);
    var encrypted = CryptoJS.AES.encrypt(pwd, iv2, {
        iv: iv2,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Iso10126
    });
    return encrypted + "";
}


export default AESUTILNormal;