<template>
  <div>
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
          <Icon type="ios-trash" size="24" style="cursor: pointer" color="#00e9bc" @click="removeList(row.id, index)"/>
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
import {
  getNameList,
  deleteNbList,
  deleteNbLists,
  addIp,
  updNameListById
} from '../../../api/nbConfig'
import { uploadFile } from '../../../api/upload'
export default {
  name: 'ignoreList',
  data () {
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
      } else if (this.file && !value) {
        callback()
      }
    }
    return {
      baseUrl: '',
      download: {
        // url: 'http://app.wingbro.com:8070/名单导入模板.xls',
        name: '名单导入模板.xls'
      },
      loading: false,
      ignore: [
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
      addIgnoreLoading: false,
      addIgnoreModel: false,
      addIgnoreForm: {
        macAdress: '',
        userName: ''
        /* ipAdress: '' */
      },
      ignoreFormRules: {
        macAdress: [
          { validator: macAddressRules, trigger: 'blur' }
        ]
        /* ipAdress: [
            { validator: ipAddress, trigger: 'blur' }
          ] */
      },
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      file: null,
      editName: false,
      editNameForm: {
      }
    }
  },
  props: {
    nbCode: {
      type: String,
      default: ''
    }
  },
  methods: {
    async upload (type) {
      if (!this.file) return
      let fileFormData = new FormData()
      fileFormData.append('file', this.file)
      let res = await uploadFile({ file: fileFormData, nbCode: this.nbCode })
      if (type === 4) {
        this.addWhiteModel = false
      } else {
        this.addIgnoreModel = false
      }
      if (res.data.code === 'success') {
        this.$Message.success('上传成功！')
        this.getNameList(type)
        this.initUpload()
      } else {
        this.$Message.error('上传失败！')
      }
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
    /* 获取名单 */
    async getNameList (type) {
      this.loading = true
      let res = await getNameList({ nbCode: this.nbCode, type: type })
      this.loading = false
      if (res.data.code === 'success') {
        this.ignoreList = res.data.result || []
      }
    },
    /* 添加名单 */
    async addIp () {
      let type = ''
      /* 忽略名单 */
      type = 5
      if (this.addIgnoreForm.macAdress === '') {
        this.upload(type)
        this.addIgnoreModel = false
        return
      }
      this.addIgnoreLoading = true
      let json = {
        nbCode: this.nbCode,
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
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addIp()
        } else {
          // this.$Message.error('请输入名单信息或者上传文件!')
        }
      })
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
            this.getNameList(5)
          } else {
            this.$Modal.remove()
            this.$Message.error(res.data.result)
          }
        }
      })
    },
    /* 清空列表 */
    removeAll () {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定清空当前列表吗？</p>',
        loading: true,
        onOk: async () => {
          let res = await deleteNbLists({ nbCode: this.nbCode, type: 5 })
          if (res.data.code === 'success') {
            this.$Modal.remove()
            this.$Message.info('删除成功')
            this.getNameList(5)
          } else {
            this.$Modal.remove()
            this.$Message.error(res.data.result)
          }
        }
      })
    },
    // 修改别名
    async updNameListById () {
      let res = await updNameListById({ ...this.editNameForm })
      if (res.data.code === 'success') {
        this.$Message.success('修改成功！')
        this.getNameList(5)
        this.editName = false
      } else {
        this.$Message.error(res.data.result)
      }
    },
    changeName (id) {
      this.editName = true
      this.editNameForm.id = id
      this.editNameForm.userName = ''
    }
  },
  mounted () {
    this.getNameList(5)
  }
}
</script>
<style scoped lang="less">
  @import "../config";
</style>
