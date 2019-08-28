<template>
  <div class="aside-wrap">
    <Input suffix="ios-search" placeholder="输入nb机器名称搜索" v-model="searchText" clearable @on-clear="clear" @on-change="change(searchText)" @keyup.enter.native="search(searchText)"/>
    <div style="display: flex; justify-content: center">
      <div class="add-list" @click="addNbModel = true">
        <!--      <span>添加</span>-->
        <Icon type="md-add" color="#fff" :size="25"/>
      </div>
    </div>

    <div class="aside-list">
      <!--<Collapse v-model="activeGroup" v-if="asideList.length">
        <Panel v-for="(item, index) in asideList" :key="index" :name="item.groupName" style="font-size: 14px;color: #333;">
          {{item.groupName === 'default' ? '未分组':''}}
          <div slot="content">
            <div class="aside-item" :class="i.nbCode === activeNb.nbCode  ? 'active' : ''" v-for="(i,index) in item.nbInfoList"
                 @click="changeActive(index,i)"
                 >
              <div class="title">
                <Icon type="md-power" size="20" color="#ccc" v-if="!i.onLineStatus"/>
                <Icon type="md-power" size="20" color="#00e9bc" title="点击重启" @click="changeStatus(i.nbCode,2)" v-if="i.onLineStatus"/>
                {{i.nbName}}
              </div>
              <div class="info">{{i.nbCode}}</div>
              <Icon type="ios-close-circle" title="删除此项" class="delete" size="18" color="#555" @click="removeNb(i.nbCode)"/>
            </div>
          </div>
        </Panel>
      </Collapse>-->
      <div class="aside-item" :class="i.nbCode === activeNb.nbCode  ? 'active' : ''" v-for="(i,index) in asideList"
           @click="changeActive(index,i)">
        <div class="title">
          <!--  <span class="online" v-if="item.onLineStatus"></span>
            <span class="offline" v-if="!item.onLineStatus"></span>-->
          <Icon type="md-power" size="20" color="#ccc" v-if="!i.onLineStatus"/>
          <Icon type="md-power" size="20" color="#00e9bc" title="点击重启" @click="changeStatus(i.nbCode,2)" v-if="i.onLineStatus"/>
          {{i.nbName}}
        </div>
        <div class="info">{{i.nbCode}}</div>
        <Icon type="ios-close-circle" title="删除此项" class="delete" size="18" color="#555" @click="removeNb(i.nbCode)"/>
      </div>
      <div style="text-align: center" v-if="asideList.length === 0">暂无数据</div>
    </div>

    <Modal v-model="addNbModel" width="360">
      <p slot="header" style="color:#333;text-align:center">
        <span>添加机器</span>
      </p>
      <div style="text-align:center">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="left">
          <FormItem label="机器序列号" prop="nbCode">
            <Input v-model="formValidate.nbCode" placeholder="请输入机器序列号"></Input>
          </FormItem>
          <FormItem label="自定义名称" prop="nbName">
            <Input v-model="formValidate.nbName" placeholder="请输入自定义名称"></Input>
          </FormItem>

        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long :loading="modal_loading" @click="handleSubmit('formValidate')">确认添加</Button>
      </div>
    </Modal>
    <Modal v-model="applyModel" width="360">
      <p slot="header" style="color:#333;text-align:center">
        <span>填写申请信息</span>
      </p>
      <div style="text-align:center">
        <Form ref="applyForm" :model="applyForm" :rules="applyRules" label-position="left">
          <FormItem label="机器序列号" prop="nbCode">
            <Input v-model="applyForm.nbCode" placeholder="请输入机器序列号"></Input>
          </FormItem>
          <FormItem label="申请理由" >
            <Input v-model="applyForm.applyReason" type="textarea" placeholder="请输入申请理由"></Input>
          </FormItem>

        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long :loading="modal_loading" @click="checkApplyForm('applyForm')">申请</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
import { addNb, findNb, delNb } from '../../../../api/config'
import { userApplyBind } from '../../../../api/userBind'
import { uptHostManageReload } from '../../../../api/chart'
import { mapMutations, mapState, mapActions } from 'vuex'
export default {
  name: 'MyAside',
  data () {
    return {
      timer: '',
      isActive: 0,
      addNbModel: false, // 添加nb 弹窗
      modal_loading: false,
      formValidate: {
        nbName: '',
        nbCode: ''
      },
      ruleValidate: {
        nbCode: [
          { required: true, message: 'nbCode不能为空', trigger: 'blur' }
        ],
        nbName: [
          { required: true, message: 'nbName不能为空', trigger: 'blur' }
        ]
      },
      searchText: '',
      applyModel: false,
      applyForm: {
        nbCode: '',
        applyReason: ''
      },
      applyRules: {
        nbCode: [
          { required: true, message: 'nbCode不能为空', trigger: 'blur' }
        ],
      },
      activeGroup: ''
    }
  },
  computed: {
    ...mapState({
      activeNb: state => state.app.activeNb,
      asideList: state => state.app.asideList
    })
  },
  methods: {
    ...mapMutations([
      'setAsideList',
      'setActiveNb'
    ]),
    ...mapActions([
      'getAsideList'
    ]),
    clear () {
      this.getAllNbList(true)
    },
    changeActive (index, item) {
      this.isActive = index || 0
      this.setActiveNb(item)
      this.$router.push({ path: this.$route.path, query: { nbCode: this.activeNb.nbCode } })
    },
    getAllNbList (refresh) {
      this.getAsideList(refresh)
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addNb(this.formValidate.nbCode, this.formValidate.nbName)
        } else {
          // this.$Message.error('Fail!')
        }
      })
    },
    checkApplyForm (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.applyModel = false
          userApplyBind({ nbCode: this.applyForm.nbCode, applyReason: this.applyForm.applyReason }).then((res) => {
            this.applyModel = false
            if (res.data.code === 'success') {
              this.$Message.success('申请成功')
              this.applyForm = {}
            } else {
              this.$Message.error(res.data.result)
            }
          })
        } else {
          // this.$Message.error('Fail!')
        }
      })
    },
    async addNb (nbCode, nbName) {
      this.modal_loading = true
      let res = await addNb({ nbCode: nbCode, nbName: nbName })
      console.log(res)
      this.modal_loading = false
      if (res.data.code === 'success') {
        this.addNbModel = false
        this.$Message.success('添加成功')
        this.formValidate = {
          nbName: '',
          nbCode: ''
        }
        this.getAllNbList()
      } else if (res.data.code === 4001) {
        this.addNbModel = false
        this.$Modal.confirm({
          title: '提示',
          content: `<p>${res.data.result}</p>`,
          onOk: () => {
            this.applyModel = true
          },
        })
      } else {
        this.$Message.error(res.data.result)
        this.addNbModel = false
      }
    },
    async removeNb (nbCode) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要删除这条Nb吗？</p>',
        loading: true,
        onOk: async () => {
          let res = await delNb(nbCode)
          if (res.data.code === 'success') {
            this.$Modal.remove()
            this.$Message.info('删除成功')
            this.getAllNbList(true)
            console.log(this.asideList)
            this.$router.push({ path: this.$route.path, query: { nbCode: this.asideList[0].nbCode } })
          } else {
            this.$Modal.remove()
            this.$Message.error(res.data.result)
          }
        }
      })
    },
    async search (nbName) {
     // console.log(nbName)
      let res = await findNb(nbName)
    //  console.log(res)
      if (res.data.code === 'success' && res.data.result.length) {
        // 分组
       /*
        let arr = []
       if (!res.data.result.groupId) {
          arr = [{
            groupName: 'default',
            nbInfoList: res.data.result
          }]
        }
          arr.push(res.data.result)
          this.setAsideList(arr)
        */
        // 不分组

        let arr = []
        res.data.result.map((item, index) => {
          arr.push(...item.nbInfoList)
        })
        this.setAsideList(arr)
        this.changeActive(null, arr[0])

        console.log(this.asideList)
      } else {
        this.$Message.error('没有找到，请检查输入的nbCode是否正确')
      }
    },
    /* 重启nb */
    async changeStatus (nbCode) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要重启这个Nb吗？</p>',
        loading: true,
        onOk: async () => {
          let res = await uptHostManageReload({ nbCode: nbCode })
          //console.log(res)
          if (res.data.code === 'success') {
            this.$Modal.remove()
            this.$Message.info('重启成功')
          } else {
            this.$Modal.remove()
            this.$Message.error(res.data.result)
          }
        }
      })
    }
  },
  mounted () {
    this.getAllNbList(true)
    //this.activeGroup = this.asideList[0].groupName
    this.timer = setInterval(() => {
      this.getAllNbList()
    }, 1000 * 60)
  },
  beforeDestroy () {
    this.getAllNbList(true)
  },
  destroyed () {
    clearInterval(this.timer) // 清除定时器
    this.timer = null
  }
}
</script>
<style lang="less" scoped>
  @import "aside";
</style>
