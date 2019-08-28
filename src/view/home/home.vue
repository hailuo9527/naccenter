<template>
  <div class="home">
      <div class="content">
        <div class="content-item">
          <div class="title">
            NacBOX在线
          </div>
          <div class="body">
            <div class="progress-num">{{nbPercent}}%</div>
            <Progress :percent="nbPercent" :stroke-width="5" hide-info stroke-color="#fff"/>
          </div>
        </div>
        <div class="content-item">
          <div class="title">
            在线主机
          </div>
          <div class="body">
            <div class="chart-head">
              <span> <i></i>在线 {{online.currentCount}}</span>
              <span> <i></i>全部 {{online.sumCount}}</span>
            </div>
            <div class="chart">
              <!--<i-circle :percent="onlinePercent" stroke-color="#00e9bc" :size="150">
                <span class="demo-Circle-inner" style="font-size:24px">{{onlinePercent}}%</span>
              </i-circle>-->
              <div class="round-1">
                <div class="round-2" :style="{width: onlinePercent + '%', height:onlinePercent + '%' }"></div>
              </div>
          </div>
          </div>
        </div>
        <div class="content-item">
          <div class="title">
            白名单
          </div>
          <div class="body">
            <div class="progress-num">{{whiteList}} <span></span></div>
          </div>
        </div>
        <div class="content-item">
          <div class="title">
            活跃主机
          </div>
          <div class="body">
            <div class="chart-head">
              <span> <i></i>活跃 {{activeHost.active}}</span>
              <span> <i></i>在线 {{activeHost.live}}</span>
            </div>
            <div class="chart">
           <!--   <chart-pie style="height: 150px;width: 150px;" :value="pieData" text="活跃主机"></chart-pie>-->
              <i-circle :percent="activePercent" stroke-color="#00e9bc" :size="150">
                <span class="demo-Circle-inner" style="font-size:24px">{{activePercent}}%</span>
              </i-circle>
            </div>
          </div>
        </div>
        <div class="content-item">
          <div class="title">
            忽略名单
          </div>
          <div class="body">
            <div class="progress-num">{{ignoreList}} <span></span></div>
          </div>
        </div>
        <div class="content-item">
          <div class="title">
            警报
          </div>
          <div class="body">
            <div class="progress-num" v-if="!warning.length">0</div>
            <div v-if="warning.length">
              <div id="warningChart"  style="width: 200px;height: 200px;" ></div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import { getActiveHostCount, getOnLineTotal, getRosterSum, getBlockHostCount } from '../../api/home'
import { getCurrentCount } from '../../api/chart'
import { mapActions } from 'vuex'
import echarts from 'echarts'
require('echarts/lib/chart/pie')
// 引入提示框和图例组件
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/legendScroll')

export default {
  name: 'home',
  components: {
  },
  data () {
    return {
      nbLive: {}, // nb在线
      activeHost: {}, // 活跃主机
      online: {}, // 在线
      whiteList: {}, // 白名单
      ignoreList: {}, // 忽略名单
      timer: null,
      warning: [
        {
          name: '123',
          value: 123
        }
      ],
      pieData: [
        { value: 335, name: '活跃' },
        { value: 310, name: '在线' },
      ]
    }
  },
  computed: {
    nbPercent () {
      return Math.round(this.nbLive.totalOnline / this.nbLive.totalNB * 10000) / 100.00
    },
    onlinePercent () {
      return (Math.round(this.online.currentCount / this.online.sumCount * 10000) / 100 > 100) ? 100 : Math.round(this.online.currentCount / this.online.sumCount * 10000) / 100
    },
    activePercent () {
      return Math.round(this.activeHost.active / this.activeHost.live * 10000) / 100.00
    }
  },
  methods: {
    ...mapActions([
      'getAsideList'
    ]),
    /* 活跃 */
    async getActiveHostCount () {
      let res = await getActiveHostCount()
      if (res.data.code === 'success') {
        this.activeHost = res.data.result
        this.pieData = [
          { value: this.activeHost.live, name: '活跃' + this.activeHost.live },
          { value: this.activeHost.active, name: '不活跃' + this.activeHost.active },
        ]
      }
    },
    async getOnLineTotal () {
      let res = await getOnLineTotal()
      if (res.data.code === 'success') {
        this.nbLive = res.data.result
      }
    },
    async getRosterSum (rosterType) {
      let res = await getRosterSum(rosterType)
      if (rosterType === 4 && res.data.code === 'success') {
        this.whiteList = res.data.result
      } else if (rosterType === 5 && res.data.code === 'success') {
        this.ignoreList = res.data.result
      }
    },
    async getCurrentCount () {
      let res = await getCurrentCount()
      if (res.data.code === 'success') {
        this.online = res.data.result
      }
    },
    /* 获取入侵主机 /报警 */
    async getBlockHostCount () {
      let res = await getBlockHostCount()
      if (res.data.code === 'success') {
        this.warning = res.data.result ? res.data.result : []
        this.pieChart()
      }
    },
    funhandle () {
      this.getActiveHostCount()
      this.getOnLineTotal()
      this.getRosterSum(4)
      this.getRosterSum(5)
      this.getCurrentCount()
      this.getBlockHostCount()

    },
    // 饼图
    pieChart () {
      let myChart = echarts.init(document.getElementById('warningChart'))
      let option = {
        title: {
          text: '', // 标题文本
          left: 30,
          top:10,
          textStyle:{
            fontSize:16,
            fontWeight:400
          }
        },
        tooltip : {
          trigger: 'item',
          // formatter: "{a} <br/> " + this.tooltipFormatter + ":{c} ({d}%)"
          formatter: '{b}' + ':{c} ({d}%)'
        },
        series : [
          {
            name: '标题',  // 提示框标题
            type: 'pie',
            radius : '70%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [...this.warning],
            labelLine: {
              show: false
            },
            label: {
              normal: {
                show: false
              }
            }
          }
        ],
        color: ['#4ea5ff', '#7fe3ae', '#52e5d0', '#c079e9', '#ff42a1', '#ffcaca', '#cafff5', '#f97e78']

      }
      myChart.setOption(option)
    }

  },
  mounted () {
    this.funhandle()
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      this.timer = setInterval(() => {
        this.funhandle()
      }, 1000 * 60)
    }
    this.getAsideList(true)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
<style lang="less" scoped>
  @import './home.less';
</style>
