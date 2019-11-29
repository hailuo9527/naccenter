<template>
  <div class="mainContent">
    <Form :label-width="80" class="formContent" label-position="left" ref="formValidate">
      <FormItem label="nbCode" class="formItem" prop="nbCode" >
        <Input style="width: 200px" v-model="nbCode"></Input>
      </FormItem>
      <FormItem label="userName" class="formItem" prop="userName" >
        <Input style="width: 200px" v-model="userName"></Input>
      </FormItem>
      <div class="selectItem">
        <span class="common">subMoudle</span>
        <Select style="width:200px" v-model="submoudle">
          <Option v-for="item in options" :value="item" :key="item" >{{ item }}</Option>
        </Select>
      </div>
      <div class="datePickerItem">
      <span class="common">开始日期</span>
      <DatePicker type="date" placeholder="Select date" style="width: 150px" class="datePicker" v-model="startTimeday"></DatePicker>
      <TimePicker type="time" placeholder="Select time" style="width: 150px" v-model="startTimehour"></TimePicker>
      <span class="common">结束日期</span>
      <DatePicker type="date" placeholder="Select date" style="width: 150px" class="datePicker" v-model="endTimeday"></DatePicker>
      <TimePicker type="time" placeholder="Select time" style="width: 150px" v-model="endTimehour"></TimePicker>
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
    return {
      startTimeday: '',
      startTimehour: 'hh-mm-ss',
      endTimeday:'',
      endTimehour: 'hh-mm-ss',
      nbCode: '',
      userName: '',
      submoudle: '全部',
      startTime: {
        startTimeday: '',
        startTimehour: ''
      },
      endTime: {
        endTimeday: '',
        endTimehour: ''
      },
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
      tableList: [],
      options: [],
      formContent: {
        // nbCode: this.nbCode,
        // userName: this.userName,
        // submoudle: this.submoudle,
        // startTime: this.startTime,
        // endTime: this.endTime
      }
    };
  },
  methods: {
    //获取选择器内容
    async selLogSubMoudle () {
      let res = await selLogSubMoudle()
      console.log(res)
      if(res.data.code == 'success'){
        this.options = res.data.result
      };
    },
    //获取查询的日志
    async selTsystemLog () {
      this.startTime.startTimeday = this.startTimeday
      this.startTimehour.startTimehour = this.startTimehour
      this.endTime.endTimeday = this.endTimeday
      this.endTime.endTimehour = this.endTimehour
      this.formContent.nbCode = this.nbCode
      this.formContent.userName = this.userName
      this.formContent.submoudle = this.submoudle
      this.formContent.startTime = this.startTime
      this.formContent.endTime = this.endTime
      console.log(this.formContent)
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