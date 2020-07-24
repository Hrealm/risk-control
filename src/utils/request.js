import axios from 'axios';
import encryptUtil from '../assets/js/encryptUtil.js'
import store from '../store/index.js'

async function request(url, hd, bd) {
    let loginData = store.state.loginData;
    let bdStr = JSON.stringify(bd);
    let sk = encryptUtil.decrypt(loginData.ct, store.state.key).split('|')[0];
    if (loginData.em) bd = encryptUtil.encrypt(bdStr, sk);

    // async-await 语法
    let res = await axios.post(url, { hd: hd, bd: bd });
    if (loginData.em) res.data.bd = encryptUtil.decrypt(res.data.bd, sk);
    return res.data;

    // promise 语法
    // return new Promise((resolve, reject) => {
    //     axios.post(url, { hd: hd, bd: bd }).then(res => {
    //         if (loginData.em) res.data.bd = encryptUtil.decrypt(res.data.bd, sk);
    //         resolve(res.data)
    //     }).catch(e => { reject(e) })
    // })

}

export default request;
