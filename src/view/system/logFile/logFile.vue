<template>
  <div class="mainContent">
    <Form :label-width="80" class="formContent" label-position="left" ref="formValidate" :model="formContent" :rules="formRules">
      <FormItem label="nbCode" class="formItem" prop="nbCode" >
        <Input style="width: 200px" v-model.trim="formContent.nbCode"></Input>
      </FormItem>
      <FormItem label="userName" class="formItem" prop="userName" >
        <Input style="width: 200px" v-model.trim="formContent.userName"></Input>
      </FormItem>
      <div class="selectItem">
        <span class="common">subMoudle</span>
        <Select style="width:200px" v-model="formContent.submoudle">
          <Option v-for="item in options" :value="item" :key="item" >{{ item }}</Option>
        </Select>
      </div>
      <div class="datePickerItem">
      <span class="common">开始日期</span>
      <DatePicker type="datetime" placeholder="Select date" style="width: 150px" class="datePicker" v-model="formContent.startTime"></DatePicker>
      <span class="common">结束日期</span>
      <DatePicker type="datetime" placeholder="Select date" style="width: 150px" class="datePicker" v-model="formContent.endTime"></DatePicker>
      </div>
      <Button type="primary" style="width: 100px; height: 36px" @click="selTsystemLog">查询</Button>
    </Form>
    <Tabs value="tab1" name="main-tab">
      <TabPane label="日志列表" name="tab1" tab="main-tab">
        <Table border :columns="tableColumns" :data="tableList" max-height="500"></Table>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { selLogSubMoudle, selTsystemLog } from "../../../api/logSearch";
export default {
  data() {
    const nbCodeRules = (rule, value, callback) => {
      if(!value) callback()
      let reg = /^\w{16}$/
      if(!reg.test(value)){
          this.formContent.nbCode = ''
          callback(new Error("请输入正确的nbCode"))
      }
      callback()
    }
    return {
      tableColumns: [
        {
          type: "index",
          align: "center"
        },
        {
          title: "用户名",
          key: 'userName'
        },
        {
          title: "机器码",
          key: 'nbCode'
        },
        {
          title: "一级模块",
          key: 'moudle'
        },
        {
          title: "二级模块",
          key: 'submoudle'
        },
        {
          title: "功能",
          key: 'func'
        },
        {
          title: "日期",
          key: 'logTime'
        },
        {
          title: "详明",
          key: 'comments',
          ellipsis: true
        }
      ],
      formRules: {
        nbCode: [
          {validator: nbCodeRules, trigger: 'blur'}
        ]
      },
      tableList: [],
      options: [],
      formContent: {
        nbCode: '',
        userName: '',
        submoudle: '全部',
        startTime: '',
        endTime: '',
      }
    };
  },
  methods: {
    //获取选择器内容
    async selLogSubMoudle () {
      let res = await selLogSubMoudle()
//      console.log(res)
      if(res.data.code == 'success'){
        this.options = res.data.result
      };
    },
    //获取查询的日志
    async selTsystemLog () {
      if(this.formContent.startTime > this.formContent.endTime) {
        return this.formContent.startTime = '',
          this.formContent.endTime = '',
          this.$Message.error('结束日期不能小于开始日期')
      }
      let res = await selTsystemLog(this.formContent)
      console.log(res)
      if(res.data.code == 'success'){
        this.tableList = res.data.result
      }
    }
  },
  mounted() {
    this.selLogSubMoudle()
  }
};
</script>

<style scoped lang="less">
@import "logFile";
</style>
