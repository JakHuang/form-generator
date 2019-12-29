<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
export default {
  mounted() {
    // 取消开始的loading动画
    var preLoader = document.querySelector('#pre-loader')
    preLoader.style.display = 'none'
  }
}
</script>