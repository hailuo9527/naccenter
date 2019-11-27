<template>
  <div class="view-content">
    <div class="title">
      {{activeNb.nbName}} <span>{{activeNb.nbCode}}</span>
    </div>
    <div class="nav-box">
      <div class="nav-bar">
        <div class="nav-item" v-for="(item,index) in navList" :class="activeNav === index ? 'active' : ''"
             @click="changeNav(index)">{{item}}
        </div>
      </div>
      <!--模式参数-->
      <div class="nav-content" v-show="activeNav === 0">
        <div class="form-group">
          <Row :gutter="30">
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">
                  btime
                  <pop-tip content="阻挡入侵时间(单位：秒)，发现终端入侵（不在名单配置中）最小的阻拦时间。系统默认30秒"/>
                 :
                </label>
                <input type="text" class="my-input" @input="handleInput('btime',defaultConfig.btime)"
                       v-model.trim="defaultConfig.btime" placeholder="请输入正整数，单位秒">
              </div>
            </Col>
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">ctime <pop-tip content="NacBox分析网络流量、以发现非法入侵的间隔时间（单位：秒），系统默认10秒"/> :</label>
                <input type="text" class="my-input" @input="handleInput('ctime',defaultConfig.ctime)"
                       v-model.trim="defaultConfig.ctime" placeholder="请输入正整数，单位秒">
              </div>
            </Col>

          </Row>
          <Row :gutter="30">
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">ltime <pop-tip content="学习模式开启时长（单位：秒），系统默认3600秒"/> :</label>
                <input type="text" class="my-input" @input="handleInput('ltime',defaultConfig.ltime)"
                       v-model.trim="defaultConfig.ltime" placeholder="请输入正整数，单位秒">
              </div>
            </Col>
          </Row>
          <Row :gutter="30">
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">学习模式 <pop-tip content="当学习模式开启时，NacBox认为所有接入到该网络的终端都是合法的，学习模式结束后生成白名单由NacCenter进行管理"/> :</label>
                <i-switch v-model="defaultConfig.learning"/>
              </div>
            </Col>
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">单向模式 <pop-tip content="开启时为单向阻拦"/> :</label>
                <i-switch v-model="defaultConfig.single"/>
              </div>
            </Col>
          </Row>
          <Row :gutter="30">
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">访客模式 <pop-tip content="是否允许访客通过微信扫码接入网络"/> :</label>
                <i-switch v-model="defaultConfig.visitor"/>
              </div>
            </Col>
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">访客范围 <pop-tip content="允许访客访问的网络范围"/> :</label>
                <Select v-model="defaultConfig.viRight" >
                  <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>
              </div>
            </Col>
          </Row>
          <Row :gutter="30" v-if="defaultConfig.visitor">
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">访问次数 <pop-tip content="每天同一个访客的访问次数，系统默认为3次（当访客模式关闭时，无此项配置）"/> :</label>
                <input type="text" class="my-input" @input="handleInput('visitCount',defaultConfig.visitCount)"
                       v-model.trim="defaultConfig.visitCount" placeholder="请输入正整数，单位次">
              </div>
            </Col>
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">访问时间 <pop-tip content="每次访客使用网络的时长（分钟），系统默认为180分钟（当访客模式关闭时，无此项配置）"/> :</label>
                <input type="text" class="my-input" @input="handleInput('visitDuration',defaultConfig.visitDuration)"
                       v-model.trim="defaultConfig.visitDuration" placeholder="请输入正整数，单位时间">
              </div>
            </Col>

          </Row>
        </div>
        <div class="save"><span @click="save(defaultConfig)">保存</span></div>
      </div>
      <!--网络配置-->
      <div class="nav-content" v-show="activeNav === 1">
        <div class="form-group">
          <Form ref="netConfigForm" :model="netConfig" :rules="netConfigRules" :label-width="130" label-position="left">
            <Row :gutter="30">
              <Col span="12">
                <FormItem label="IP地址：" prop="ipaddress">
                  <Input type="text" v-model.trim="netConfig.ipaddress" placeholder="请输入IP地址"></Input>
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="网关：" prop="gateway">
                  <Input type="text" v-model.trim="netConfig.gateway" placeholder="请输入网关数据"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="30">
              <Col :span="12">
                <FormItem label="IP子网：" prop="ipsubnet">
                  <Input type="text" v-model.trim="netConfig.ipsubnet" placeholder="请输入IP子网"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="DNS地址：" prop="dnsser">
                  <Input type="text" v-model.trim="netConfig.dnsser" placeholder="请输入DNS服务地址"></Input>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div class="save"><span @click="saveNetInfoHandle">保存</span></div>
      </div>
      <!--白名单-->
      <div class="nav-content2" v-if="activeNav === 2">
        <white-list :nb-code="activeNb.nbCode"></white-list>
      </div>
      <!--忽略名单-->
      <div class="nav-content2" v-if="activeNav === 3">
        <ignore-list :nb-code="activeNb.nbCode"></ignore-list>
      </div>
      <!--入侵名单-->
      <div class="nav-content2" v-show="activeNav === 4">
        <Row class="list-head" type="flex" justify="space-between" align="top">
          <Col span="6"><h3>入侵名单列表:</h3></Col>
          <!-- <Col span="6">
             <Input suffix="ios-search" placeholder="Enter text" />
           </Col>-->
        </Row>
        <Row class="table-container">
          <Table :columns="block" height="300" :data="blockList" :loading="loading"  stripe
                 size="small">
            <template slot-scope="{ row }" slot="mac">
              <span style="font-size: 12px;color: #666"><span style="color: #00e9bc;">{{ row.macAddress }}</span></span>
            </template>
            <template slot-scope="{ row }" slot="ip">
              <span style="font-size: 12px;color: #666"><span style="color: #00e9bc;">{{ row.ipAddress }}</span></span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Icon type="md-add-circle" size="24" style="cursor: pointer" color="#00e9bc" @click="changeBlockToWhite(row)"/>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="space-between" class="opera">
          <Col>

          </Col>
          <Col class="btn-group">
            <span v-if="blockList.length" @click="uptBlockRoster">全部添加</span>
          </Col>
        </Row>
      </div>
      <!--DHCP配置-->
      <div class="nav-content2" v-if="activeNav === 5">
        <ip-config :nb-code="activeNb.nbCode"></ip-config>
      </div>
      <!--ip回收-->
      <div class="nav-content2" v-if="activeNav === 6">
        <ip-recovery :nb-code="activeNb.nbCode"></ip-recovery>
        <!--<ip-param :nb-code="activeNb.nbCode"></ip-param>-->
      </div>
    </div>

  </div>
</template>
<script>
import { mapState } from 'vuex'
import {
  getNbConfig,
  changeNbConfig,
  updateNetWork,
  addIp
} from '../../api/nbConfig'
import { getMasterInfo, uptBlockRoster } from '../../api/chart'
// import { uploadFile } from '../../api/upload'
import ipConfig from '../ip-manage/component/ipConfig.vue'
import ipRecovery from '../ip-manage/component/ipRecovery.vue'
import whiteList from './component/whiteList'
import ignoreList from './component/ignoreList'
import PopTip from '@/components/pop-tip'
export default {
  name: 'config',
  components: {
    ipConfig, ipRecovery, whiteList, ignoreList, PopTip
  },
  data () {
    const ipaddressRules = (rule, value, callback) => {
      if (!value) callback()
      let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      if (!reg.test(value)) {
        callback(new Error('请检查IP地址格式！'))
      }
      callback()
    }
    const dnsserRules = (rule, value, callback) => {
      if (!value) callback()
      let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      if (!reg.test(value)) {
        callback(new Error('请检查DNS地址格式！'))
      }
      callback()
    }
    const ipsubnetRules = (rule, value, callback) => {
      if (!value) callback()
      let reg = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/
      if (!reg.test(value)) {
        callback(new Error('请检查子网掩码格式！'))
      }
      callback()
    }
    const gatewayRules = (rule, value, callback) => {
      if (!value) callback()
      let reg = /^192\.168(\.(\d|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))){2}$/
      if (!reg.test(value)) {
        callback(new Error('请检查网关格式！'))
      }
      callback()
    }
    return {
      activeNav: 0,
      navList: [
        '模式参数',
        '网络配置',
        '白名单',
        '忽略名单',
        '入侵名单',
        'DHCP配置',
        /*'IP回收'*/
      ],
      loading: false,

      defaultConfig: {
        btime: '',
        ctime: '',
        ltime: '',
        learning: false,
        single: false,
        visitor: true,
        visitCount: '',
        visitDuration: '',
        viRight: 'ALL'
      },

      netConfig: {
        ipaddress: '',
        dnsser: '',
        ipsubnet: '',
        gateway: ''
      },
      netConfigRules: {
        ipaddress: [
          { validator: ipaddressRules, trigger: 'blur' }
        ],
        dnsser: [
          { validator: dnsserRules, trigger: 'blur' }
        ],
        ipsubnet: [
          { validator: ipsubnetRules, trigger: 'blur' }
        ],
        gateway: [
          { validator: gatewayRules, trigger: 'blur' }
        ]
      },
      block: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: 'MAC地址',
          slot: 'mac'
          // width: 350
        },
        {
          title: 'IP地址',
          slot: 'ip'
        },

        {
          title: 'Action',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      blockList: [],
      options: [
        {
          name: '全部', value: 'ALL'
        },

        {
          name: '局域网', value: 'LAN'
        },

        {
          name: '互联网', value: 'Internet'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      activeNb: state => state.app.activeNb
    })
  },
  watch: {
    activeNb: {
      handler (newVal, old) {
        this.$Loading.start()
        this.getDefaultConfig(this.activeNb.nbCode)
        this.$Loading.finish()
      },
      deep: true
      // immediate: true
    },
    $route: {
      handler (val, oldVal) {
        this.activeNav = 0
      },
      // 深度观察监听
      deep: true
    }

  },
  methods: {
    /* 切换tab */
    changeNav (index) {
      this.activeNav = index
      switch (index) {
        case 1:
          this.getNetInfo()
          break
        case 2:
          /* this.getNameList(4)
          this.getAllNameListAuto() */
          break
        case 3:
          // this.getNameList(5)
          break
        case 4:
          this.getMasterInfo()
          break
      }
    },
    /* 获取模式参数 */
    async getDefaultConfig (nbCode) {
      let res = await getNbConfig({ nbCode: nbCode })
      console.log(res)
      if (res.data.code === 'success') {
        let data = res.data.result[0]
        this.defaultConfig = Object.assign(this.defaultConfig, data)
        this.defaultConfig.learning = data.learning !== 'off'
        this.defaultConfig.single = data.single !== 'off'
        this.defaultConfig.visitor = data.visitor !== 'off'
      }
      console.log(this.defaultConfig)
    },
    /* 保存模式设置 */
    async save (arr) {
      console.log(arr)
      let args = Object.assign({}, arr)
      args.learning = arr.learning ? 'on' : 'off'
      args.single = arr.single ? 'on' : 'off'
      args.visitor = arr.visitor ? 'on' : 'off'
      args.nbCode = this.activeNb.nbCode
      args.viRight = arr.viRight
      let res = await changeNbConfig({ ...args })
      if (res.data.code === 'success') {
        this.$Message.success('保存成功')
      } else {
        this.$Message.error(res.data.result)
      }
    },
    /* 获取网络配置 */
    async getNetInfo () {
      let res = await getNbConfig({ nbCode: this.activeNb.nbCode })
      if (res.data.code === 'success') {
        this.netConfig = {
          ipaddress: res.data.result[0].ipaddress,
          dnsser: res.data.result[0].dnsser,
          ipsubnet: res.data.result[0].ipsubnet,
          gateway: res.data.result[0].gateway
        }
      }
    },
    /* 存储网络配置 */
    async saveNetInfo () {
      let json = {
        nbCode: this.activeNb.nbCode,
        ipaddress: this.netConfig.ipaddress,
        dnsser: this.netConfig.dnsser,
        ipsubnet: this.netConfig.ipsubnet,
        gateway: this.netConfig.gateway
      }
      let res = await updateNetWork(json)
      if (res.data.code === 'success') {
        this.$Message.success('保存成功')
        this.getNetInfo()
      } else {
        this.$Message.error(`保存失败${res.data.result}`)
      }
    },
    saveNetInfoHandle () {
      this.$refs['netConfigForm'].validate((valid) => {
        if (valid) {
          this.saveNetInfo()
        } else {
          this.$Message.error('请检查输入格式是否正确!')
        }
      })
    },

    // 入侵名单
    async getMasterInfo () {
      this.loading = true
      let res = await getMasterInfo({ nbCode: this.activeNb.nbCode, type: 3 })
      this.loading = false
      // console.log(res)
      if (res.data.code === 'success') {
        this.blockList = res.data.result || []
      }
    },
    // 添加入侵名单到白名单
    changeBlockToWhite (data) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要将这条入侵名单添加到白名单吗？</p>',
        loading: true,
        onOk: () => {
          let json = {
            nbCode: this.activeNb.nbCode,
            type: 4,
            macAddress: data.macAddress,
            ipAddress: data.ipAddress
          }
          addIp(json).then((res) => {
            this.$Modal.remove()
            if (res.data.code === 'success') {
              this.$Message.success('操作成功！')
            } else {
              this.$Message.error(res.data.result)
            }
          }).catch(err => {
            this.$Modal.remove()
            this.$Message.error(err)
          })
        }
      })
    },
    // 一键添加全部入侵名单到白名单
    uptBlockRoster () {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要将所有入侵名单添加到白名单吗？</p>',
        loading: true,
        onOk: () => {
          uptBlockRoster({ nbCode: this.activeNb.nbCode }).then(res => {
            // console.log(res)
            this.$Modal.remove()
            if (res.data.code === 'success') {
              this.$Message.success('操作成功！')
            } else {
              this.$Message.error(res.data.result)
            }
          }).catch(err => {
            this.$Message.error(err)
            this.$Modal.remove()
          })
        }
      })
    },
    handleInput (e, val) {
      this.defaultConfig[e] = val.replace(/[^0-9]+/g, '')
    }

  },
  mounted () {
    this.getDefaultConfig(this.activeNb.nbCode)
  }
}
</script>
<style lang="less" scoped>
  @import "config";
</style>
