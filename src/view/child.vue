<template>
  <div>
    <div>子组件:</div>
    <div>{{inputname}}</div>
    <div>{{test}}</div>
    <button @click="clickChild">触发</button>
  </div>
</template>
<script>
  export default {
    // 接受父组件的值
    props:{
      inputname: {
        type: String,
        required: true
      },
      test: {
        type: Number,
        required: true
      }
    },
    data(){
        return{
            childValue: '我是子组件的数据'
        }
    },
    methods: {
        clickChild(){
            this.$emit('clickChild')
        }
    }
  }
</script>