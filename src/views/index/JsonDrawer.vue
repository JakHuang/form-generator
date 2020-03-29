<template>
  <div>
    <el-drawer v-bind="$attrs" v-on="$listeners" @opened="onOpen" @close="onClose">
      <div class="action-bar" :style="{'text-align': 'left'}">
        <span ref="copyBtn" class="bar-btn copy-json-btn">
          <i class="el-icon-document-copy" />
          复制JSON
        </span>
        <span class="bar-btn delete-btn" @click="$emit('update:visible', false)">
          <i class="el-icon-circle-close" />
          关闭
        </span>
      </div>
      <div id="editorJson" :style="{height: '100%'}" />
    </el-drawer>
  </div>
</template>

<script>
import monaco from 'monaco'
import beautifier from 'beautifier'
import { beautifierConf } from '@/utils/index'
import ClipboardJS from 'clipboard'

export default {
  components: {},
  props: {
    jsonStr: {
      type: String,
      required: true,
      beautifier: null,
      jsonEditor: null
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const clipboard = new ClipboardJS('.copy-json-btn', {
      text: trigger => {
        this.$notify({
          title: '成功',
          message: '代码已复制到剪切板，可粘贴。',
          type: 'success'
        })
        return this.beautifierJson
      }
    })
    clipboard.on('error', e => {
      this.$message.error('代码复制失败')
    })
  },
  methods: {
    onOpen() {
      this.beautifierJson = beautifier.js(this.jsonStr, beautifierConf.js)
      this.setEditorValue('editorJson', this.beautifierJson)
    },
    onClose() {},
    setEditorValue(id, codeStr) {
      if (this.jsonEditor) {
        this.jsonEditor.setValue(codeStr)
      } else {
        this.jsonEditor = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: 'vs-dark',
          language: 'json',
          automaticLayout: true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

::v-deep .el-drawer__header {
  display: none;
}
@include action-bar;
</style>
