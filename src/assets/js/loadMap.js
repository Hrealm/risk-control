export function MP(key) {
    return new Promise(function (resolve, reject) {
      window.init = function () {
        resolve(AMap)
      };
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "//webapi.amap.com/maps?v=1.4.6&key="+key+"&callback=init";
      script.onerror = reject;
      document.head.appendChild(script);
    })
  }