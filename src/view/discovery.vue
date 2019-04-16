<template>
    <div id="discovery" style="text-align:center;font-size:20px;color:#0000FF;margin-top:20px;font-weight:bold;">
        父组件:<input type="text" v-model="name">
        <!-- 引入子组件 -->
        <child :inputname="name" :test="test" @clickChild="alert"></child>
    </div>
</template>

<script>
import child from'./child'
export default {
    components: {
      child
    },
    data () {
      return {
        name: 'i am inputName',
        test: 3
      }
    },
    methods: {
       alert(){
           alert(1)
       }
    }
}
</script>
