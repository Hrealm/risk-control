import CryptoJS from 'crypto-js'
const AES_PARA = "JJL2@ys5xs0^99N!"; //密钥参数






// api解密
function decryptAPIAESUTIL(sessionKey, md) {
    var iv2 = CryptoJS.enc.Utf8.parse(AES_PARA);
    var decryptmsg = CryptoJS.AES.decrypt(md, sessionKey, {
        iv: iv2,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Iso10126  
    });

    console.log(CryptoJS.enc.Utf8.stringify(decryptmsg).toString())
    return CryptoJS.enc.Utf8.stringify(decryptmsg).toString();
}






export default decryptAPIAESUTIL;