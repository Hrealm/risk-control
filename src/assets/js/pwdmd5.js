import CryptoJS from 'crypto-js'
const AES_PARA = "JJL2@ys5xs0^99N!"; //密钥参数




// 加密方法
function pwdmd5(pwd) {
    var key_hash = CryptoJS.MD5(pwd); // "pwd" 代表明文密码
    // 两次md5加密
    var key = CryptoJS.enc.Utf8.parse(key_hash);
    var key_hash2 = CryptoJS.MD5(key);
    // 三次md5加密
    var key2 = CryptoJS.enc.Utf8.parse(key_hash2);
    var key_hash3 = CryptoJS.MD5(key2);
    return key_hash3 + "";
}






// 解密方法
// function Decrypt(word){
//     var iv2  = CryptoJS.enc.Utf8.parse(AES_PARA);
// }
export default pwdmd5;