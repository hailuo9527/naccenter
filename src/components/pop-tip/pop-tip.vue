<template>
  <!--<Poptip word-wrap width="200" trigger="hover" :content="content">
    <Icon style="font-weight: bold;" size="14" color="" type="ios-help-circle-outline" />
  </Poptip>-->
  <Tooltip :content="content" placement="top" max-width="200" theme="light" >
    <Icon class="handle" size="14"  type="ios-help-circle-outline" />
  </Tooltip>
</template>
<script>
  export default {
    name: 'popTip',
    props: {
      content: {
        type: String,
        default: ''
      }
    }
  }
</script>
<style lang="less" scoped>
  .handle{
    font-weight: bold;
    cursor: pointer;
    transition: all .3s;
    &:hover{
      color: #00e9bc;
    }
  }
</style>
