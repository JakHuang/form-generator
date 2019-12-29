<template>
  <div>
    <el-drawer v-bind="$attrs" v-on="$listeners" @opened="onOpen" @close="onClose">
      <div style="height:100%">
        <el-row style="height:100%;overflow:auto">
          <el-col :md="24" :lg="12" class="left-editor">
            <el-tabs v-model="activeTab" type="card" class="editor-tabs">
              <el-tab-pane name="html">
                <span slot="label">
                  <i class="el-icon-edit" v-if="activeTab==='html'"></i>
                  <i class="el-icon-document" v-else></i>
                  template
                </span>
              </el-tab-pane>
              <el-tab-pane name="js">
                <span slot="label">
                  <i class="el-icon-edit" v-if="activeTab==='js'"></i>
                  <i class="el-icon-document" v-else></i>
                  script
                </span>
              </el-tab-pane>
              <el-tab-pane name="css">
                <span slot="label">
                  <i class="el-icon-edit" v-if="activeTab==='css'"></i>
                  <i class="el-icon-document" v-else></i>
                  CSS
                </span>
              </el-tab-pane>
            </el-tabs>
            <div id="editorHtml" class="tab-editor" v-show="activeTab==='html'" />
            <div id="editorJs" class="tab-editor" v-show="activeTab==='js'" />
            <div id="editorCss" class="tab-editor" v-show="activeTab==='css'" />
          </el-col>
          <el-col :md="24" :lg="12" class="right-preview">
            <div class="action-bar">
              <span class="bar-btn" @click="runCode">
                <i class="el-icon-refresh"></i>
                刷新
              </span>
              <span class="bar-btn" @click="exportFile">
                <i class="el-icon-download"></i>
                导出vue文件
              </span>
              <span ref="copyBtn" class="bar-btn copy-btn">
                <i class="el-icon-document-copy"></i>
                复制代码
              </span>
              <span class="bar-btn delete-btn" @click="$emit('update:visible', false)">
                <i class="el-icon-circle-close"></i>
                关闭
              </span>
            </div>
            <iframe ref='previewPage' class="result-wrapper" frameborder="0" @load="iframeLoad"
              src="preview.html"></iframe>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import monaco from "monaco"
import { makeUpHtml, vueTemplate, vueScript, cssStyle } from "@/components/generator/html"
import { makeUpJs } from "@/components/generator/js"
import { makeUpCss } from "@/components/generator/css"
import { exportDefault, beautifierConf, titleCase } from "@/utils/index"
import { parse } from "@babel/parser"
import beautifier from "beautifier"
import ClipboardJS from "clipboard"
import { saveAs } from "file-saver"

var editorObj = {
    html: null,
    js: null,
    css: null
  },
  mode = {
    html: "html",
    js: "javascript",
    css: "css"
  },
  isIframeLoaded = false

export default {
  components: {},
  props: ["formData"],
  data() {
    return {
      activeTab: "html",
      htmlCode: "",
      jsCode: "",
      cssCode: "",
      codeFrame: ""
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    new ClipboardJS(".copy-btn", {
      text: trigger => {
        var codeStr = this.generateCode()
        this.$notify({
          title: "成功",
          message: "代码已复制到剪切板，可粘贴。",
          type: "success"
        })
        return codeStr
      }
    })
  },
  methods: {
    onOpen() {
      setTimeout(() => {
        this.htmlCode = makeUpHtml(this.formData)
        this.htmlCode = beautifier.html(this.htmlCode, beautifierConf.html)
        this.jsCode = makeUpJs(this.formData)
        this.jsCode = beautifier.js(this.jsCode, beautifierConf.js)
        this.cssCode = makeUpCss(this.formData)
        this.cssCode = beautifier.css(this.cssCode, beautifierConf.html)

        this.setEditorValue("editorHtml", "html", this.htmlCode)
        this.setEditorValue("editorJs", "js", this.jsCode)
        this.setEditorValue("editorCss", "css", this.cssCode)
        isIframeLoaded && this.runCode()
      })
    },
    onClose() {},
    iframeLoad() {
      isIframeLoaded = true
      this.jsCode && this.runCode()
    },
    setEditorValue(id, type, codeStr) {
      if (editorObj[type]) {
        editorObj[type].setValue(codeStr)
      } else {
        editorObj[type] = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: "vs-dark",
          language: mode[type],
          automaticLayout: true
        })
      }
    },
    runCode() {
      let jsCodeStr = editorObj.js.getValue()
      try {
        const ast = parse(jsCodeStr, { sourceType: "module" })
        const astBody = ast.program.body
        if (astBody.length > 1) {
          this.$confirm(
            "js格式不能识别，仅支持修改export default的对象内容",
            "提示",
            {
              type: "warning"
            }
          )
          return
        }
        if (astBody[0].type === "ExportDefaultDeclaration") {
          let postData = {
            type: "refreshFrame",
            data: {
              html: editorObj.html.getValue(),
              js: jsCodeStr.replace(exportDefault, ""),
              css: editorObj.css.getValue()
            }
          }
          this.$refs.previewPage.contentWindow.postMessage(
            postData,
            location.origin
          )
        } else {
          this.$message.error("请使用export default")
        }
      } catch (err) {
        this.$message.error("js错误：" + err + "")
        console.error(err)
      }
    },
    generateCode() {
      let html = vueTemplate(editorObj.html.getValue())
      let script = vueScript(editorObj.js.getValue())
      let css = cssStyle(editorObj.css.getValue())
      return beautifier.html(html + script + css, beautifierConf.html)
    },
    exportFile() {
      this.$prompt("文件名:", "导出文件", {
        inputValue: `${+new Date()}.vue`,
        closeOnClickModal: false,
        inputPlaceholder: "请输入文件名"
      }).then(({ value }) => {
        if (!value) value = `${+new Date()}.vue`
        var codeStr = this.generateCode(),
          blob = new Blob([codeStr], { type: "text/plain;charset=utf-8" })
        saveAs(blob, value)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-editor {
  position: absolute;
  top: 33px;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 14px;
}
.left-editor {
  position: relative;
  height: 100%;
  background: #1e1e1e;
  overflow: hidden;
}
.right-preview {
  height: 100%;
  .action-bar {
    height: 33px;
    background: #f2fafb;
    padding: 0 15px;
    box-sizing: border-box;
  }
  .result-wrapper {
    height: calc(100vh - 33px);
    width: 100%;
    overflow: auto;
    padding: 12px;
    box-sizing: border-box;
  }
  .bar-btn {
    display: inline-block;
    padding: 0 6px;
    line-height: 32px;
    color: #8285f5;
    cursor: pointer;
    font-size: 14px;
    user-select: none;
    & i {
      font-size: 20px;
    }
    &:hover {
      color: #4348d4;
    }
  }
  .bar-btn + .bar-btn {
    margin-left: 8px;
  }
  .delete-btn {
    color: #f56c6c;
    &:hover {
      color: #ea0b30;
    }
  }
}
</style>
<style lang="scss">
.el-drawer__header {
  display: none;
}
.ace_scrollbar-h {
  display: none;
}
</style>
