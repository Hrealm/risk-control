<template>
    <div class="mapCon">
        <div class="title">
            <div class="_wrap freight">
                <p class="txt">总运费金额</p>
                <p class="totalTxt">{{totalAmount}} 万元</p>
            </div>
            <div class="_wrap weight">
                <p class="txt">总货运重量</p>
                <p class="totalTxt">{{totalWeight}} 万吨</p>
            </div>
        </div>
        <div class id="mapStatistics" style="width:100%; height:560px;left: -2%;top: 2.5rem;"></div>
    </div>
</template>

<script>
import request from '../../utils/request.js';
import china from 'echarts/map/json/china.json';
var echarts = require('echarts');
export default {
    props:["getFreight","getWeight"],
    data() {
        return {
            totalAmount:this.getFreight,
            totalWeight:this.getWeight,
            mapObj: []

        };
    },
    created(){
        this.getData();
    },
    watch:{
        getFreight:{
            handler(newValue,oldValue){
                this.totalAmount = newValue;
            },
            deep: true
        },
        getWeight:{
            handler(newValue,oldValue){
                this.totalWeight = newValue;
            },
            deep: true
        },
        mapObj(){
            this.$nextTick(()=>{
                if (this.mapObj.length) {
                    this.init();
                }
            })
        }
    },
    components: {},
    methods:{
        async getData(){
			let date = new Date();
			let y_val = date.getFullYear();
            let loginData = this.$store.state.loginData;
            // console.log(loginData);
            let hd = {
                pi: 32005,
                si: loginData.si,
                sq: 9
            };
            let bd = {
                tid: loginData.tid,
                bt: 101,
                ct: 6,
                dt: y_val
            };
            let resData = await request('/32005', hd, bd);
            if (resData.hd.rid >= 0) {
                let bd = JSON.parse(resData.bd);
                this.mapObj = bd.olst;
                // console.log(this.mapObj);
            } else {
                this.$message({
                    type: 'error',
                    message: resData.hd.rmsg
                });
            }
        },
        init(){
            this.$nextTick(()=>{
                var MapChart = echarts.init(document.getElementById('mapStatistics'));

                // var uploadedDataURL = '/asset/get/s/data-1528971808162-BkOXf61WX.json';
                //geoCoordMap把所有可能出现的城市加到数组里面
                var geoCoordMap = {
                    // 杭州: [119.5313, 29.8773],
                    // 苏州: [118.8062, 31.9208],
                    // 上海: [121.4648, 31.2891],
                    // 天津: [117.4219, 39.4189],
                    // 深圳: [114.072026, 22.552194],
                    // 成都: [103.9526, 30.7617],
                    // 郑州: [113.4668, 34.6234],
                    // 宁波: [121.640618, 29.86206],
                    '合肥': [117.29, 32.0581],
                    '重庆': [108.384366, 30.439702],
                    '广州': [113.12244, 23.009505],
                    '大连': [123.1238, 42.1216],
                    '青岛': [117.1582, 36.8701],
                    '北京': [116.4551, 40.2539],
                    '义乌': [120.067209, 29.346921],
                    '东莞': [113.764742, 23.02039],
                    '长沙': [113.0823, 28.2568],
                    '贵阳': [106.6992, 26.7682],
                    // 珠海: [113.556111, 22.250876],
                    // 威海: [122.109148, 37.516889],
                    // 泉州: [118.58, 24.93],
                    // 赤峰: [118.87, 42.28],
                    // 厦门: [118.1, 24.46],
                    // 福州: [119.3, 26.08],
                    // 抚顺: [123.97, 41.97],
                    // 汕头: [116.69, 23.39],
                    // 宁波: [121.56, 29.86],
                    // 海口: [110.35, 20.02],
                    // 岳阳: [113.09, 29.37],
                    // 武汉: [114.31, 30.52],
                    // 义乌: [120.06, 29.32],
                    // 唐山: [118.02, 39.63],
                    // 石家庄: [114.48, 38.03],
                    // 哈尔滨: [126.63, 45.75],
                    // 兰州: [103.73, 36.03],
                    // 贵阳: [106.71, 26.57],
                    // 呼和浩特: [111.65, 40.82],
                    // 南昌: [115.89, 28.68],
                    // 佛山: [113.11, 23.05],
                    // 汕头: [116.69, 23.39],
                    // 烟台: [121.39, 37.52],
                    // 威海: [122.1, 37.5]
                };

                var d3 = {
                    // 杭州: 311,
                    // 苏州: 174,
                    // 上海: 308,
                    // 天津: 192,
                    // 深圳: 304,
                    // 郑州: 194,
                    // 成都: 179,
                    // 宁波: 191,
                    '合肥': 130,
                    '重庆': 189,
                    '广州': 345,
                    '大连': 139,
                    '青岛': 182,
                    '北京': 336,
                    '义乌': 136,
                    '东莞': 159,
                    '长沙': 151,
                    '贵阳': 81,
                    // 珠海: 96,
                    // 威海: 80,
                    // 南昌: 112,
                    // 西安: 163,
                    // 南京: 155,
                    // 海口: 59,
                    // 厦门: 170,
                    // 沈阳: 102,
                    // 无锡: 110,
                    // 呼和浩特: 54,
                    // 长春: 76,
                    // 哈尔滨: 113,
                    // 武汉: 187,
                    // 南宁: 104,
                    // 昆明: 100,
                    // 兰州: 48,
                    // 唐山: 48,
                    // 石家庄: 110,
                    // 太原: 80,
                    // 赤峰: 8,
                    // 抚顺: 7,
                    // 珲春: 19,
                    // 绥芬河: 16,
                    // 徐州: 63,
                    // 南通: 78,
                    // 温州: 111,
                    // 绍兴: 88,
                    // 芜湖: 29,
                    // 福州: 189,
                    // 泉州: 148,
                    // 赣州: 31,
                    // 济南: 161,
                    // 烟台: 85,
                    // 洛阳: 49,
                    // 黄石: 10,
                    // 岳阳: 15,
                    // 汕头: 74,
                    // 佛山: 153,
                    // 泸州: 10,
                    // 海东: 0,
                    // 银川: 34
                };

                // console.log(geoCoordMap);

                // this.mapObj.forEach(item => {
                //     for (const key in geoCoordMap) {
                //         geoCoordMap[key]
                //         console.log(key);
                //     }
                //     console.log(item);
                // });




                var colors = [
                    ['#1DE9B6', '#F46E36', '#04B9FF', '#5DBD32', '#FFC809', '#FB95D5', '#BDA29A', '#6E7074', '#546570', '#C4CCD3'],
                    [
                        '#37A2DA',
                        '#67E0E3',
                        '#32C5E9',
                        '#9FE6B8',
                        '#FFDB5C',
                        '#FF9F7F',
                        '#FB7293',
                        '#E062AE',
                        '#E690D1',
                        '#E7BCF3',
                        '#9D96F5',
                        '#8378EA',
                        '#8378EA'
                    ],
                    ['#DD6B66', '#759AA0', '#E69D87', '#8DC1A9', '#EA7E53', '#EEDD78', '#73A373', '#73B9BC', '#7289AB', '#91CA8C', '#F49F42']
                ];
                var colorIndex = 0;

                var year = ['2015'];
                var mapData = [];
                /*柱子Y名称*/
                var categoryData = [];
                var barData = [];

                /** 原数据处理
                 * 
                 *  
                 * for (var key in geoCoordMap) {
                        mapData.push({
                            year: '2015',
                            name: key,
                            value: d3[key]
                        });
                    }

                    mapData.sort((a, b) => {
                        return a.value - b.value;
                    });
                    for (let i = 0; i < mapData.length; i++) {
                        barData.push(mapData[i].value);
                        categoryData.push(mapData[i].name);
                    }
                 * 
                 * 
                 */


                var mapRes = [];
                
                this.mapObj.forEach(item => {
                    mapData.push({
                        name: item.cne,
                        value: item.amt
                    });
                    categoryData.push(item.cne);
                    barData.push(item.amt);
                    mapRes.push({
                        name: item.cne,
                        // value: `${item.cne2},${item.amt > 20000 ? item.amt/50 : item.amt > 10000 ? item.amt/22 : item.amt > 450 ? item.amt/2.1 : item.amt > 300 ? item.amt/1.5 : item.amt}`.split(',').map(Number)
                        value: `${item.cne2},${item.amt/60 < 50 ? 50 : item.amt/60}`.split(',').map(Number)
                    })
                });
                categoryData = categoryData.slice(0,10);
                barData = barData.slice(0,10);
                categoryData.reverse();
                barData.reverse();
                console.log(this.mapObj);
                console.log(mapData,categoryData,barData);
                console.log(mapRes);
                // console.log(mapData
                //                     .sort(function (a, b) {
                //                         return b.value - a.value;
                //                     })
                //                     .slice(0, 20));

                echarts.registerMap('china', china);
                // 地图中闪点
                var convertData = function (data) {
                    var res = [];
                    for (var i = 0; i < data.length; i++) {
                        var geoCoord = geoCoordMap[data[i].name];
                        if (geoCoord) {
                            res.push({
                                name: data[i].name,
                                value: geoCoord.concat(data[i].value)
                            });
                        }
                    }
                    return res;
                };

                // console.log(convertData(mapData
                //                     .sort(function (a, b) {
                //                         return b.value - a.value;
                //                     })
                //                     .slice(0, 20)));
                var optionXyMap01 = {
                    timeline: {
                        // data: year,
                        axisType: 'category',
                        autoPlay: false,
                        playInterval: 3000,
                        left: '10%',
                        right: '10%',
                        bottom: '-30%',
                        width: '0%',
                        label: {
                            // normal: {
                            //     textStyle: {
                            //         color: '#ddd'
                            //     }
                            // },
                            // emphasis: {
                            //     textStyle: {
                            //         color: '#fff'
                            //     }
                            // }
                        },
                        symbolSize: 0,
                        lineStyle: {
                            color: '#ffffff00'
                        },
                        checkpointStyle: {
                            borderColor: '#ffffff00',
                            borderWidth: 0
                        },
                        controlStyle: {
                            showNextBtn: false,
                            showPrevBtn: false,
                            normal: {
                                color: '#ffffff00',
                                borderColor: '#ffffff00'
                            },
                            emphasis: {
                                color: '#ffffff00',
                                borderColor: '#ffffff00'
                            }
                        }
                    },
                    baseOption: {
                        animation: true,
                        animationDuration: 1000,
                        animationEasing: 'cubicInOut',
                        animationDurationUpdate: 1000,
                        animationEasingUpdate: 'cubicInOut',
                        grid: {
                            right: '-3%',
                            top: '15%',
                            bottom: '20%',
                            width: '20%'
                        },
                        tooltip: {
                            trigger: 'axis', // hover触发器
                            axisPointer: {
                                // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                                shadowStyle: {
                                    color: 'rgba(150,150,150,0.1)' //hover颜色
                                }
                            }
                        },
                        geo: {
                            show: true,
                            map: 'china',
                            roam: true,
                            zoom: 1,
                            center: [113.83531246, 34.0267395887],
                            label: {
                                emphasis: {
                                    show: false
                                }
                            },
                            itemStyle: {
                                normal: {
                                    borderColor: 'rgba(147, 235, 248, 1)',
                                    borderWidth: 1,
                                    areaColor: {
                                        type: 'radial',
                                        x: 0.5,
                                        y: 0.5,
                                        r: 0.8,
                                        colorStops: [
                                            {
                                                offset: 0,
                                                color: 'rgba(147, 235, 248, 0)' // 0% 处的颜色
                                            },
                                            {
                                                offset: 1,
                                                color: 'rgba(147, 235, 248, .2)' // 100% 处的颜色
                                            }
                                        ],
                                        globalCoord: false // 缺省为 false
                                    },
                                    shadowColor: 'rgba(128, 217, 248, 1)',
                                    // shadowColor: 'rgba(255, 255, 255, 1)',
                                    shadowOffsetX: -2,
                                    shadowOffsetY: 2,
                                    shadowBlur: 10
                                },
                                emphasis: {
                                    areaColor: '#389BB7',
                                    borderWidth: 0
                                }
                            }
                        }
                    },
                    options: []
                };

                optionXyMap01.options.push({
                    backgroundColor: '#ffffff00',
                    title: [
                        {
                            text: '',
                            left: '25%',
                            top: '7%',
                            textStyle: {
                                color: '#fff',
                                fontSize: 25
                            }
                        },
                        {
                            id: 'statistic',
                            text: '',
                            left: '75%',
                            top: '2%',
                            textStyle: {
                                color: '#fff',
                                fontSize: 25
                            }
                        }
                    ],
                    xAxis: {
                        type: 'value',
                        scale: true,
                        position: 'top',
                        min: 0,
                        boundaryGap: false,
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            margin: 2,
                            textStyle: {
                                color: '#aaa'
                            }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        //  name: 'TOP 20',
                        nameGap: 16,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#ddd'
                            }
                        },
                        axisTick: {
                            show: false,
                            lineStyle: {
                                color: '#ddd'
                            }
                        },
                        axisLabel: {
                            interval: 0,
                            textStyle: {
                                color: '#ddd'
                            }
                        },
                        data: categoryData
                    },

                    series: [
                        //地图
                        {
                            type: 'map',
                            map: 'china',
                            geoIndex: 0,
                            aspectScale: 0.75, //长宽比
                            showLegendSymbol: false, // 存在legend时显示
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            },
                            roam: true,
                            itemStyle: {
                                normal: {
                                    areaColor: '#031525',
                                    borderColor: '#FFFFFF'
                                },
                                emphasis: {
                                    areaColor: '#2B91B7'
                                }
                            },
                            animation: false,
                            data: mapData
                        },
                        //地图中闪烁的点
                        {
                            //  name: 'Top 5',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            // data: convertData(
                            //     mapData
                            //         .sort(function (a, b) {
                            //             return b.value - a.value;
                            //         })
                            //         .slice(0, 20)
                            // ),
                            data: mapRes,
                            symbolSize: function (val) {
                                return val[2] / 10;
                            },
                            showEffectOn: 'render',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            hoverAnimation: true,
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: colors[colorIndex][2],
                                    shadowBlur: 10,
                                    shadowColor: colors[colorIndex][2]
                                }
                            },
                            zlevel: 1
                        },
                        //柱状图
                        {
                            zlevel: 1.6,
                            type: 'bar',
							// grid: {
							// 	left: '3%',
							// },
                            // symbol: 'none',
                            itemStyle: {
                                normal: {
                                    color: colors[colorIndex][2]
                                }
                            },
                            data: barData
                        }
                    ]
                });

                MapChart.setOption(optionXyMap01);
                // console.log(categoryData,barData);
            })
        }
    },
    mounted() {
        if (this.mapObj.length) {
            this.init();
        }
    }
};
</script>

<style scoped lang="scss">
.mapCon {
    position: relative;
    width: 100%;
    overflow: hidden;
    .title{
        position: relative;
        ._wrap{
            position: absolute;
            top: 25px;
            left: 20px;
            width: 180px;
            height: 70px;
            display: flex;
			z-index: 1100;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #fff;
            background-color: rgb(23,34,64);
            .txt{
                font-size: 12px;
            }
            .totalTxt{
                font-size: 18px;
                color: #47D8EC;
            }
        }
        .weight{
            left: 210px;
        }
    }
}
</style>
