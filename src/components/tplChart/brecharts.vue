<template>
    <div class="rPolyline">
        <div class id="rplStatistics" :style="'width:95%;top: 1rem;left: 2.5%;height:'+btm_h+'px;'"></div>
    </div>
</template>

<script>
var echarts = require('echarts');
import request from '../../utils/request.js';
export default {
    data() {
        return {
			btm_h: 210,
            waybillArray: []
        };
    },
	props:{
		bottomH: Number,
	},
    created(){
		this.btm_h = this.bottomH;
        this.getData();
    },
    components: {},
    methods:{
        async getData(){
			let date = new Date();
			let y_val = date.getFullYear();
			let m_val = date.getMonth()+1;
			let bte = '';
			let ete = '';
			if(m_val==12){
				bte = y_val+'-01';
				ete = y_val+'-12';
			}else{
				bte = (y_val-1)+'-'+(m_val<10?'0'+(m_val+1):(m_val+1));
				ete = y_val+'-'+(m_val<10?'0'+m_val:m_val);
			}
			console.log(bte);
			console.log(ete);
            let loginData = this.$store.state.loginData;
            let hd = {
                pi: 32004,
                si: loginData.si,
                sq: 9
            };
            let bd = {
                tid: loginData.tid,
                bt: 1101,
                ct: 3,
                bte: bte,
                ete: ete
            };
            let resData = await request('/32004', hd, bd);
            if (resData.hd.rid >= 0) {
                let bd = JSON.parse(resData.bd);
                this.waybillArray = bd.olst;
                // console.log(bd.olst);
            } else {
                this.$message({
                    type: 'error',
                    message: resData.hd.rmsg
                });
            }
        },
        init(){
            var polylineChart = echarts.init(document.getElementById('rplStatistics'));
            var data = [];
            var date = [];
            this.waybillArray.forEach(item => {
				let amt = item.amt/10000;
				amt = amt.toFixed(2); 
				//Math.round(item.amt/10000,2);
                data.push(amt)
                date.push(item.dt)
            });
			
            // console.log(data,date);
            var option = {
                title: {
                    text: '成交额（万元）',
                    textStyle: {
                        fontSize: 13,
                        fontWeight: 'normal',
                        color: '#fff'
                    },
                    x: 'left'
                },
                backgroundColor: '#ffffff00',
                tooltip: {},
                grid: {
                    top: '20%',
                    left: '1%',
                    right: '1%',
                    bottom: '2%',
                    containLabel: true
                },
                legend: {
                    itemGap: 50,
                    data: [''],
                    textStyle: {
                        color: '#f9f9f9',
                        borderColor: '#fff'
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        axisLine: { //坐标轴轴线相关设置。数学上的x轴
                            show: true,
                            lineStyle: {
                                color: '#f9f9f9'
                            },
                        },
                        axisLabel: { //坐标轴刻度标签的相关设置
                            textStyle: {
                                color: '#d1e6eb',
                                margin: 15,
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        data: date
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: 0,
                        // max: 140,
                        splitNumber: 7,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#0a3256'
                            }
                        },
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            margin: 20,
                            textStyle: {
                                color: '#d1e6eb'
                            }
                        },
                        axisTick: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'bar',
                        smooth: true, //是否平滑曲线显示
                        // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
                        showAllSymbol: true,
                        symbol: 'emptyCircle',
                        symbolSize: 6,
                        lineStyle: {
                            normal: {
                                // color: '#28ffb3' // 线条颜色
                                color: '#327BFA' // 线条颜色
                            },
                            borderColor: '#f0f'
                        },
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#04B9FF'
                            }
                        },
                        tooltip: {
                            show: false
                        },
                        areaStyle: {
                            //区域填充样式
                            normal: {
                                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                                color: new echarts.graphic.LinearGradient(0,0,0,1,
                                    [
                                        {
                                            offset: 0,
                                            // color: 'rgba(0,154,120,1)'
                                            color: 'rgba(61,126,235,1)'
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(0,0,0, 0)'
                                        }
                                    ],
                                    false
                                ),
                                shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
                                shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                            }
                        },
                        data: data
                    }
                ]
            };
            polylineChart.setOption(option);
        }
    },
    watch: {
        waybillArray() {
            this.$nextTick(() => {
                if (this.waybillArray.length) {
                    this.init();
                }
            });
        }
    },
    mounted() {
        if (this.waybillArray.length) {
            this.init();
        }
    }
};
</script>

<style scoped lang="scss">
</style>
