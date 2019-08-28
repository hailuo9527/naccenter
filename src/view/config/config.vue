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
                <label for="" class="my-label">btime:</label>
                <input type="text" class="my-input" @input="handleInput('btime',defaultConfig.btime)"
                       v-model.trim="defaultConfig.btime" placeholder="请输入正整数，单位秒">
              </div>
            </Col>
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">ctime:</label>
                <input type="text" class="my-input" @input="handleInput('ctime',defaultConfig.ctime)"
                       v-model.trim="defaultConfig.ctime" placeholder="请输入正整数，单位秒">
              </div>
            </Col>

          </Row>
          <Row :gutter="30">
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">ltime:</label>
                <input type="text" class="my-input" @input="handleInput('ltime',defaultConfig.ltime)"
                       v-model.trim="defaultConfig.ltime" placeholder="请输入正整数，单位秒">
              </div>
            </Col>
          </Row>
          <Row :gutter="30">
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">学习模式:</label>
                <i-switch v-model="defaultConfig.learning"/>
              </div>
            </Col>
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">单向模式:</label>
                <i-switch v-model="defaultConfig.single"/>
              </div>
            </Col>
          </Row>
          <Row :gutter="30">
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">访客模式:</label>
                <i-switch v-model="defaultConfig.visitor"/>
              </div>
            </Col>
          </Row>
          <Row :gutter="30" v-if="defaultConfig.visitor">
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">访问次数:</label>
                <input type="text" class="my-input" @input="handleInput('visitCount',defaultConfig.visitCount)"
                       v-model.trim="defaultConfig.visitCount" placeholder="请输入正整数，单位次">
              </div>
            </Col>
            <Col span="16" :xl="12">
              <div class="form-item">
                <label for="" class="my-label">访问时间:</label>
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
      <div class="nav-content2" v-show="activeNav === 2">
        <Row class="list-head" type="flex" justify="space-between" align="top">
          <Col span="6"><h3>白名单列表:</h3></Col>
          <!--<Col span="6">
            <Input suffix="ios-search" placeholder="Enter text" />
          </Col>-->
        </Row>
        <Row class="table-container">
          <Table :columns="white" :data="whiteList" :loading="loading" height="300" stripe
                 size="small">
            <template slot-scope="{ row }" slot="macAddress">
              <span style="font-size: 12px;color: #666"><span style="color: #00e9bc;">{{ row.macAddress }}</span></span>
            </template>
            <template slot-scope="{ row }" slot="ipAddress">
              <span style="font-size: 12px;color: #666"><span style="color: #00e9bc;">{{ row.ipAddress }}</span></span>
            </template>
            <template slot-scope="{ row }" slot="hostName">
              <span style="font-size: 12px;color: #666"><span style="color: #00e9bc;">{{ row.hostName || 'unknow' }}</span></span>
            </template>
            <template slot-scope="{ row, index }" slot="userName">
                <span style="font-size: 12px;color: #666; display: flex;align-items: center">
                  <span style="color: #00e9bc;">{{ row.userName || '未命名' }}</span>
                  <Icon style="cursor: pointer" type="ios-create-outline" size="16" @click="changeName(row.id)"/>
                </span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Icon type="ios-trash" size="24" color="#00e9bc" @click="removeList(row.id, index)"/>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="space-between" class="opera">
          <Col>
          </Col>
          <Col class="btn-group">
            <span @click="addWhiteModel = true">添加</span>
            <span @click="removeAll" v-if="whiteList.length>0">清空列表</span>
          </Col>
        </Row>
        <Modal v-model="addWhiteModel" width="360">
          <p slot="header" style="color:#333;text-align:center">
            <span>添加白名单</span>
          </p>
          <div style="text-align:center">
            <Form :model="addWhiteForm"  label-position="left" ref="whiteFormValidate" :rules="whiteFormRules">
              <FormItem label="mac地址" prop="macAdress">
                <Input v-model.trim="addWhiteForm.macAdress" placeholder="请输入mac地址"></Input>
              </FormItem>
              <FormItem label="ip地址" prop="ipAdress">
                <Input v-model.trim="addWhiteForm.ipAdress" placeholder="请输入ip地址"></Input>
              </FormItem>
              <FormItem label="别名">
                <Input v-model.trim="addWhiteForm.userName" placeholder="可以输入自定义别名"></Input>
              </FormItem>
              <FormItem label="导入表格" >
                <Upload :action="baseUrl" :before-upload="handleBeforeUpload" accept=".xls, .xlsx">
                  <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">上传文件
                  </Button>
                </Upload>
                <a :href="$config.baseUrl.pro+'/'+download.name" target="_blank" :download="download.name">
                  <Icon type="ios-cloud-download-outline" />
                  下载模板
                </a>
                <Row>
                  <div class="ivu-upload-list-file" v-if="file !== null">
                    <Icon type="ios-stats"></Icon>
                    {{ file.name }}
                    <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove"
                          @click.native="handleRemove()"></Icon>
                  </div>
                </Row>
                <Row>
                  <transition name="fade">
                    <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
                      <div v-if="progressPercent == 100">
                        <Icon type="ios-checkmark-circle"></Icon>
                        <span>成功</span>
                      </div>
                    </Progress>
                  </transition>
                </Row>
              </FormItem>

            </Form>
          </div>
          <div slot="footer">
            <Button type="info" size="large" long :loading="addWhiteLoading" @click="handleSubmit('whiteFormValidate')">确认添加</Button>
          </div>
        </Modal>
      </div>
      <!--忽略名单-->
      <div class="nav-content2" v-show="activeNav === 3">
        <Row class="list-head" type="flex" justify="space-between" align="top">
          <Col span="6"><h3>忽略名单列表:</h3></Col>
          <!-- <Col span="6">
             <Input suffix="ios-search" placeholder="Enter text" />
           </Col>-->
        </Row>
        <Row class="table-container">
          <Table :columns="ignore" height="300" :data="ignoreList" :loading="loading" stripe
                 size="small">
            <template slot-scope="{ row }" slot="mac">
              <span style="font-size: 12px;color: #666">MAC地址：<span style="color: #00e9bc;">{{ row.macAddress }}</span></span>
            </template>
            <!--<template slot-scope="{ row }" slot="ip">
              <span style="font-size: 12px;color: #666">IP地址：<span style="color: #00e9bc;">{{ row.ipAddress }}</span></span>
            </template>-->
            <template slot-scope="{ row }" slot="hostName">
              <span style="font-size: 12px;color: #666">主机名：<span style="color: #00e9bc;">{{ row.hostName || 'unknow' }}</span></span>
            </template>
            <template slot-scope="{ row }" slot="userName">
              <span style="font-size: 12px;color: #666; display: flex;align-items: center">别名：
                <span style="color: #00e9bc;" contenteditable="true">{{ row.userName || '未命名' }}</span>
                <Icon style="cursor: pointer" type="ios-create-outline" size="16" @click="changeName(row.id)"/>
              </span>

            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Icon type="ios-trash" size="24" color="#00e9bc" @click="removeList(row.id, index)"/>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="space-between" class="opera">
          <Col>

          </Col>
          <Col class="btn-group">
            <span @click="addIgnoreModel = true">添加</span>
            <span @click="removeAll" v-if="ignoreList.length>0">清空列表</span>
          </Col>
        </Row>
        <Modal v-model="addIgnoreModel" width="360">
          <p slot="header" style="color:#333;text-align:center">
            <span>添加忽略名单</span>
          </p>
          <div style="text-align:center">
            <Form :model="addIgnoreForm" label-position="left" ref="ignoreFormRules" :rules="ignoreFormRules">
              <FormItem label="mac地址" prop="macAdress">
                <Input v-model.trim="addIgnoreForm.macAdress" placeholder="请输入mac地址"></Input>
              </FormItem>
            <!--  <FormItem label="ip地址" prop="ipAdress">
                <Input v-model.trim="addIgnoreForm.ipAdress" placeholder="请输入ip地址"></Input>
              </FormItem>-->
              <FormItem label="别名">
                <Input v-model.trim="addIgnoreForm.userName" placeholder="可以输入自定义别名"></Input>
              </FormItem>
              <FormItem label="导入表格">
                <Upload :action="baseUrl" :before-upload="handleBeforeUpload" accept=".xls, .xlsx">
                  <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">上传文件
                  </Button>

                </Upload>
                <a :href="$config.baseUrl.pro+'/'+download.name" target="_blank" :download="download.name">
                  <Icon type="ios-cloud-download-outline" />
                  下载模板
                </a>
                <Row>
                  <div class="ivu-upload-list-file" v-if="file !== null">
                    <Icon type="ios-stats"></Icon>
                    {{ file.name }}
                    <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove"
                          @click.native="handleRemove()"></Icon>
                  </div>
                </Row>
                <Row>
                  <transition name="fade">
                    <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
                      <div v-if="progressPercent === 100">
                        <Icon type="ios-checkmark-circle"></Icon>
                        <span>成功</span>
                      </div>
                    </Progress>
                  </transition>
                </Row>
              </FormItem>

            </Form>
          </div>
          <div slot="footer">
            <Button type="info" size="large" long :loading="addIgnoreLoading" @click="handleSubmit('ignoreFormRules')">确认添加</Button>
          </div>
        </Modal>
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
    </div>

    <!--修改别名-->
    <Modal v-model="editName" width="360">
      <p slot="header" style="color:#333;text-align:center">
        <span>修改别名</span>
      </p>
      <div style="text-align:center">
        <Form :model="editNameForm"  label-position="left">
          <FormItem label="别名">
            <Input v-model.trim="editNameForm.userName" placeholder="可以输入自定义别名"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long  @click="updNameListById">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import {
  getNbConfig,
  changeNbConfig,
  updateNetWork,
  getNameList,
  deleteNbList,
  deleteNbLists,
  addIp,
  updNameListById
} from '../../api/nbConfig'
import { getMasterInfo, uptBlockRoster } from '../../api/chart'
import { uploadFile } from '../../api/upload'
export default {
  name: 'config',
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
    const macAddressRules = (rule, value, callback) => {
      if (value) {
        let reg = /^[a-fA-F0-9]{2}([:-][a-fA-F0-9]{2}){5}$/
        if (!reg.test(value)) {
          callback(new Error('请检查MAC地址格式！'))
        } else {
          callback()
        }
      }
      if (!this.file && !value) {
        callback(new Error('请填写MAC地址或者导入excel表格批量处理！'))
      }
      else if (this.file && !value) {
        callback()
      }
    }
    const ipAddress = (rule, value, callback) => {
      if (value) {
        let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        if (!reg.test(value)) {
          callback(new Error('请检查IP地址格式！'))
        } else {
          callback()
        }
      }
      if (!this.file && !value) {
        callback(new Error('请填写MAC地址或者导入excel表格批量处理！'))
      }
      else if (this.file && !value) {
        callback()
      }
    }
    return {
      editName: false,
      editNameForm: {
      },
      download:{
       // url: 'http://app.wingbro.com:8070/名单导入模板.xls',
        name: '名单导入模板.xls'
      },
      baseUrl: '',
      activeNav: 0,
      navList: [
        '模式参数',
        '网络配置',
        '白名单',
        '忽略名单',
        '入侵名单'
      ],
      loading: false,
      white: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: 'Mac地址',
          slot: 'macAddress',
          // width: 350
        },
        {
          title: 'Ip地址',
          slot: 'ipAddress'
        },
        {
          title: '主机名',
          slot: 'hostName'
        },
        {
          title: '别名',
          slot: 'userName'
        },
        {
          title: 'Action',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      whiteList: [],
      ignore: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: 'Mac地址',
          slot: 'mac',
         // width: 350
        },
        {
          title: '主机名',
          slot: 'hostName'
        },
        {
          title: '别名',
          slot: 'userName'
        },
        {
          title: 'Action',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      ignoreList: [],
      defaultConfig: {
        btime: '',
        ctime: '',
        ltime: '',
        learning: false,
        single: false,
        visitor: true,
        visitCount: '',
        visitDuration: ''
      },
      addWhiteModel: false,
      addWhiteLoading: false,
      addWhiteForm: {
        macAdress: '',
        ipAdress: '',
        userName: '',
      },
      whiteFormRules: {
        macAdress: [
          { validator: macAddressRules, trigger: 'blur' }
        ],
        ipAdress: [
          { validator: ipAddress, trigger: 'blur' }
        ]
      },
      addIgnoreLoading: false,
      addIgnoreModel: false,
      addIgnoreForm: {
        macAdress: '',
        userName: ''
        /*ipAdress: ''*/
      },
      ignoreFormRules: {
        macAdress: [
          { validator: macAddressRules, trigger: 'blur' }
        ],
       /* ipAdress: [
          { validator: ipAddress, trigger: 'blur' }
        ]*/
      },
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      file: null,
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
          title: 'Mac地址',
          slot: 'mac',
          //width: 350
        },
        {
          title: 'Ip地址',
          slot: 'ip'
        },

        {
          title: 'Action',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      blockList: []
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
    },

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
          this.getNameList(4)
          break
        case 3:
          this.getNameList(5)
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
        this.defaultConfig.visitor = data.single !== 'off'
      }
    },
    /* 保存模式设置 */
    async save (arr) {
      console.log(arr)
      let args = Object.assign({}, arr)
      args.learning = arr.learning ? 'on' : 'off'
      args.single = arr.single ? 'on' : 'off'
      args.visitor = arr.visitor ? 'on' : 'off'
      args.nbCode = this.activeNb.nbCode
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
    /* 获取名单 */
    async getNameList (type) {
      this.loading = true
      let res = await getNameList({ nbCode: this.activeNb.nbCode, type: type })
      this.loading = false
      if (res.data.code === 'success') {
        if (type === 4) {
          this.whiteList = res.data.result || []
        } else if (type === 5) {
          this.ignoreList = res.data.result || []
        }
      }
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
            //console.log(res)
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
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addIp()
        } else {
          //this.$Message.error('请输入名单信息或者上传文件!')
        }
      })
    },
    // 修改别名
    async updNameListById () {
      let res = await updNameListById({...this.editNameForm})
      let type = this.activeNav + 2
      if (res.data.code === 'success') {
        this.$Message.success('修改成功！')
        this.getNameList(type)
        this.editName = false
      } else {
        this.$Message.error(res.data.result)
      }
    },
    changeName (id) {
      this.editName = true
      this.editNameForm.id = id
      this.editNameForm.userName = ''
    },
    async upload (type) {
      if (!this.file) return
      let fileFormData = new FormData()
      fileFormData.append('file', this.file)
      let res = await uploadFile({ file: fileFormData, nbCode: this.activeNb.nbCode })
      if (type === 4) {
        this.addWhiteModel = false
      } else {
        this.addIgnoreModel = false
      }
      if (res.data.code === 'success') {
        this.$Message.success('上传成功！')
        this.getNameList(type)
      } else {
        this.$Message.error('上传失败！')
      }
    },
    /* 添加名单 */
    async addIp () {
      let type = ''
      /* 白名单 */
      if (this.activeNav === 2) {
        type = 4
        if (this.addWhiteForm.ipAdress === '' && this.addWhiteForm.macAdress === '') {
          this.upload(type)
          return
        }

        this.addWhiteLoading = true
        let json = {
          nbCode: this.activeNb.nbCode,
          type: type,
          ipAddress: this.addWhiteForm.ipAdress,
          macAddress: this.addWhiteForm.macAdress,
          userName: this.addWhiteForm.userName
        }
        let res = await addIp(json)
        this.addWhiteLoading = false
        this.addWhiteModel = false
        if (res.data.code === 'success') {
          this.$Message.success('添加成功')
          this.getNameList(4)
        } else {
          this.$Message.error(res.data.result)
        }
        this.upload(type)
      }
      /* 忽略名单 */
      else if (this.activeNav === 3) {
        type = 5
        if (this.addIgnoreForm.ipAdress === '' && this.addIgnoreForm.macAdress === '') {
          this.upload(type)
          this.addIgnoreModel = false
          return
        }
        this.addIgnoreLoading = true
        let json = {
          nbCode: this.activeNb.nbCode,
          type: type,
          ipAddress: this.addIgnoreForm.ipAdress,
          macAddress: this.addIgnoreForm.macAdress,
          userName: this.addIgnoreForm.userName
        }
        let res = await addIp(json)
        this.addIgnoreModel = false
        this.addIgnoreLoading = false
        if (res.data.code === 'success') {
          this.$Message.success('添加成功')
          this.getNameList(5)
        } else {
          this.$Message.error(res.data.result)
        }
        this.upload(type)
      }
    },
    /* 删除列表 */
    removeList (id, index) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要删除这条列表吗？</p>',
        loading: true,
        onOk: async () => {
          let res = await deleteNbList({ id: id })
          if (res.data.code === 'success') {
            this.$Modal.remove()
            this.$Message.info(res.data.result)
            if (this.activeNav === 2) {
              this.whiteList.splice(index, 1)
            } else if (this.activeNav === 3) {
              this.ignoreList.splice(index, 1)
            }
          } else {
            this.$Modal.remove()
            this.$Message.error(res.data.result)
          }
        }
      })
    },
    /* 清空列表 */
    removeAll () {
      let type = this.activeNav === 2 ? 4 : 5
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定清空当前列表吗？</p>',
        loading: true,
        onOk: async () => {
          let res = await deleteNbLists({ nbCode: this.activeNb.nbCode, type: type })
          if (res.data.code === 'success') {
            this.$Modal.remove()
            this.$Message.info('删除成功')
            if (this.activeNav === 2) {
              this.whiteList = []
            } else if (this.activeNav === 3) {
              this.ignoreList = []
            }
          } else {
            this.$Modal.remove()
            this.$Message.error('删除失败')
          }
        }
      })
    },
    initUpload () {
      this.file = null
      this.showProgress = false
      this.loadingProgress = 0
    },
    handleUploadFile () {
      this.initUpload()
    },

    handleRemove () {
      this.initUpload()
      this.$Message.info('上传的文件已删除！')
    },
    handleBeforeUpload (file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'xlsx' || fileExt === 'xls') {
        this.readFile(file)
        this.file = file
      } else {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
        })
      }
      return false
    },
    // 读取文件
    readFile (file) {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadstart = e => {
        this.uploadLoading = true
        this.showProgress = true
      }
      reader.onprogress = e => {
        this.progressPercent = Math.round(e.loaded / e.total * 100)
      }
      reader.onerror = e => {
        this.$Message.error('文件读取出错')
      }
      reader.onload = e => {
        this.$Message.info('文件读取成功')
        const data = e.target.result
        // const { header, results } = excel.read(data, 'array')
        this.uploadLoading = false
        this.showRemoveFile = true
      }
    },
    /**/
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
