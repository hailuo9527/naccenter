<template>
  <Form :model="addWhiteForm"  ref="loginForm" @keydown.enter.native="handleSubmit">
    <FormItem label="mac地址" prop="mac">
      <Input v-model.trim="addWhiteForm.macAdress" placeholder="请输入mac地址"></Input>
    </FormItem>
    <FormItem label="ip地址" prop="ip">
      <Input v-model.trim="addWhiteForm.ipAdress" placeholder="请输入ip地址"></Input>
    </FormItem>
    <FormItem label="导入表格">
      <Upload :action="baseUrl" :before-upload="handleBeforeUpload" accept=".xls, .xlsx">
        <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">上传文件</Button>
      </Upload>
      <Row>
        <div class="ivu-upload-list-file" v-if="file !== null">
          <Icon type="ios-stats"></Icon>
          {{ file.name }}
          <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove" @click.native="handleRemove()"></Icon>
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
</template>
