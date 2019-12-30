<template>
  <div class="mainContent">
    <Form
      :label-width="80"
      class="formContent"
      label-position="left"
      ref="formValidate"
      :model="formContent"
      :rules="formRules"
    >
      <FormItem label="机器码" class="formItem" prop="nbCode">
        <Input style="width: 200px" v-model.trim="formContent.nbCode"></Input>
      </FormItem>
      <FormItem label="用户名" class="formItem" prop="userName">
        <Input style="width: 200px" v-model.trim="formContent.userName"></Input>
      </FormItem>
      <div class="selectItem">
        <span class="common">二级模块</span>
        <Select style="width:200px" v-model="formContent.submoudle">
          <Option value>全部</Option>
          <Option v-for="item in options" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </div>
      <div class="datePickerItem">
        <span class="common">开始日期</span>
        <DatePicker
          type="datetime"
          :options="disabledstartTime"
          placeholder="Select date"
          style="width: 200px; margin-left: 10px"
          class="datePicker"
          v-model="formContent.startTime"
        ></DatePicker>
        <span class="common text">结束日期</span>
        <DatePicker
          type="datetime"
          :options="disabledendTime"
          placeholder="Select date"
          style="width: 200px; margin-left: 14px"
          class="datePicker"
          v-model="formContent.endTime"
        ></DatePicker>
      </div>
      <div class="button">
        <Button type="primary" style="width: 100px; height: 36px" @click="selTsystemLog">查询</Button>
      </div>
    </Form>
    <Tabs value="tab1" name="main-tab">
      <TabPane label="日志列表" name="tab1" tab="main-tab">
        <Scroll :on-reach-bottom="handleReachBottom">
          <div class="hiddenscroll">
            <Table border :columns="tableColumns" :data="tableList" max-height="1000"></Table>
          </div>
        </Scroll>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { selLogSubMoudle, selTsystemLog } from "../../../api/logSearch";
export default {
  data() {
    // 输入nbCode正则判定
    const nbCodeRules = (rule, value, callback) => {
      if (!value) callback();
      let reg = /^\w{16}$/;
      if (!reg.test(value)) {
        this.formContent.nbCode = "";
        callback(new Error("请输入正确的nbCode"));
      }
      callback();
    };
    return {
      tableColumns: [
        {
          type: "index",
          align: "center"
        },
        {
          title: "用户名",
          key: "userName"
        },
        {
          title: "机器码",
          key: "nbCode"
        },
        {
          title: "一级模块",
          key: "moudle"
        },
        {
          title: "二级模块",
          key: "submoudle"
        },
        {
          title: "功能",
          key: "func"
        },
        {
          title: "日期",
          key: "logTime"
        },
        {
          title: "详明",
          key: "comments",
          ellipsis: true,
          render: (h, params) => {
            // console.log(params.row.comments);
            let texts = params.row.comments;
            if (texts !== null) {
              if (texts.length > 10) {
                texts = texts.slice(0, 7) + "......";
              }
            }
            // 鼠标放在内容上弹出完整内容-----"Tooltip"
            return h("div", [
              h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    transfer: true
                  }
                },
                [
                  texts,
                  h(
                    "span",
                    {
                      slot: "content",
                      style: {
                        whiteSpace: "normal"
                      }
                    },
                    params.row.comments
                  )
                ]
              )
            ]);
          }
        }
      ],
      formRules: {
        nbCode: [{ validator: nbCodeRules, trigger: "blur" }]
      },
      tableList: [],
      options: [],
      formContent: {
        nbCode: "",
        userName: "",
        submoudle: "",
        startTime: "",
        endTime: "",
        pageNo: "",
        pageSize: 20
      },
      onReachBottom: false,
      // 结束时间限定
      disabledendTime: {
        disabledDate: date => {
          let currtime = new Date();
          let startTime = new Date(this.formContent.startTime.valueOf());
          if (this.formContent.startTime == "") {
            return date.valueOf() > currtime;
          } else {
            return (
              (date && date.valueOf() < startTime) ||
              (date && date.valueOf() > currtime)
            );
          }
        }
      },
      // 开始时间限定
      disabledstartTime: {
        disabledDate: date => {
          let currtime = new Date();
          let endTime = this.formContent.endTime
            ? new Date(this.formContent.endTime).valueOf()
            : "";
          if (this.formContent.endTime == "") {
            return date.valueOf() > currtime;
          } else {
            return date.valueOf() > endTime;
          }
        }
      }
    };
  },
  methods: {
    // 格林威治时间转普通格式
    GMTToStr(time) {
      let date = new Date(time);
      let Str =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
      return Str;
    },
    // 获取选择器内容
    async selLogSubMoudle() {
      let res = await selLogSubMoudle();
      if (res.data.code == "success") {
        this.options = res.data.result;
      }
    },
    // 获取查询的日志
    async selTsystemLog() {
      if (this.formContent.startTime == "" && this.formContent.endTime == "") {
        this.formContent.pageNo = 1;
        this.onReachBottom = false;
        let res = await selTsystemLog(this.formContent);
        if (res.data.code === "success") {
          // console.log(res.data.result)
          this.tableList = res.data.result.data;
          if (res.data.result.data.length < this.formContent.pageSize) {
            this.onReachBottom = true;
          }
        }
      } else if (
        this.formContent.startTime == "" &&
        this.formContent.endTime !== ""
      ) {
        this.formContent.endTime = this.GMTToStr(this.formContent.endTime);
        this.formContent.pageNo = 1;
        this.onReachBottom = false;
        let res = await selTsystemLog(this.formContent);
        if (res.data.code === "success") {
          this.tableList = res.data.result.data;
          if (res.data.result.data.length < this.formContent.pageSize) {
            this.onReachBottom = true;
          }
        }
      } else if (
        this.formContent.endTime == "" &&
        this.formContent.startTime !== ""
      ) {
        this.formContent.startTime = this.GMTToStr(this.formContent.startTime);
        this.formContent.pageNo = 1;
        this.onReachBottom = false;
        let res = await selTsystemLog(this.formContent);
        if (res.data.code === "success") {
          this.tableList = res.data.result.data;
          if (res.data.result.data.length < this.formContent.pageSize) {
            this.onReachBottom = true;
          }
        }
      } else {
        this.formContent.startTime = this.GMTToStr(this.formContent.startTime);
        this.formContent.endTime = this.GMTToStr(this.formContent.endTime);
        this.formContent.pageNo = 1;
        this.onReachBottom = false;
        let res = await selTsystemLog(this.formContent);
        if (res.data.code === "success") {
          this.tableList = res.data.result.data;
          if (res.data.result.data.length < this.formContent.pageSize) {
            this.onReachBottom = true;
          }
        }
      }
    },
    // 下拉拉取数据
    async reachBottomGetData() {
      if (this.formContent.startTime == "" && this.formContent.endTime == "") {
        let res = await selTsystemLog(this.formContent);
        if (res.data.code === "success") {
          for (let i = 0; i < res.data.result.data.length; i++) {
            this.tableList.push(res.data.result.data[i]);
          }
          if (res.data.result.data.length < this.formContent.pageSize) {
            this.onReachBottom = true;
          }
        }
      } else if (
        this.formContent.startTime == "" &&
        this.formContent.endTime !== ""
      ) {
        this.formContent.endTime = this.GMTToStr(this.formContent.endTime);
        let res = await selTsystemLog(this.formContent);
        if (res.data.code === "success") {
          for (let i = 0; i < res.data.result.data.length; i++) {
            this.tableList.push(res.data.result.data[i]);
          }
          if (res.data.result.data.length < this.formContent.pageSize) {
            this.onReachBottom = true;
          }
        }
      } else if (
        this.formContent.endTime == "" &&
        this.formContent.startTime !== ""
      ) {
        this.formContent.startTime = this.GMTToStr(this.formContent.startTime);
        let res = await selTsystemLog(this.formContent);
        if (res.data.code === "success") {
          for (let i = 0; i < res.data.result.data.length; i++) {
            this.tableList.push(res.data.result.data[i]);
          }
          if (res.data.result.data.length < this.formContent.pageSize) {
            this.onReachBottom = true;
          }
        }
      } else {
        this.formContent.startTime = this.GMTToStr(this.formContent.startTime);
        this.formContent.endTime = this.GMTToStr(this.formContent.endTime);
        let res = await selTsystemLog(this.formContent);
        if (res.data.code === "success") {
          for (let i = 0; i < res.data.result.data.length; i++) {
            this.tableList.push(res.data.result.data[i]);
          }
          if (res.data.result.data.length < this.formContent.pageSize) {
            this.onReachBottom = true;
          }
        }
      }
    },
    // 下拉监听
    handleReachBottom() {
      return new Promise(resolve => {
        if (this.onReachBottom) {
          this.$Message.info("已经到底了");
        } else {
          this.formContent.pageNo += 1;
          this.reachBottomGetData();
        }
        resolve();
      });
    }
  },
  mounted() {
    this.selLogSubMoudle();
  }
};
</script>

<style scoped lang="less">
@import "logFile";
</style>
