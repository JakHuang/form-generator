<template>
  <div class="container">
    <div class="left-board">
      <div class="logo-wrapper">
        <div class="logo">
          <img :src="logo" alt="logo" /> Form Generator
          <a class="github" href="https://github.com/JakHuang/form-generator" target="_blank">
            <img src="https://github.githubassets.com/pinned-octocat.svg" alt=""/>
          </a>
        </div>
      </div>
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div class="components-title">
            <svg-icon icon-class="component" /> 输入型组件
          </div>
          <draggable class="components-draggable" :list="inputComponents"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }" :clone="cloneComponent"
            draggable=".components-item" :sort="false" @end="onEnd">
            <div class="components-item" v-for="(element, index) in inputComponents" :key="index"
              @click="addComponent(element)">
              <div class="components-body">
                <svg-icon :icon-class="element.tagIcon" />
                {{ element.label }}
              </div>
            </div>
          </draggable>
          <div class="components-title">
            <svg-icon icon-class="component" /> 选择型组件
          </div>
          <draggable class="components-draggable" :list="selectComponents"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }" :clone="cloneComponent"
            draggable=".components-item" :sort="false" @end="onEnd">
            <div class="components-item" v-for="(element, index) in selectComponents" :key="index"
              @click="addComponent(element)">
              <div class="components-body">
                <svg-icon :icon-class="element.tagIcon" />
                {{ element.label }}
              </div>
            </div>
          </draggable>
          <div class="components-title">
            <svg-icon icon-class="component" /> 布局型组件
          </div>
          <draggable class="components-draggable" :list="layoutComponents"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }" :clone="cloneComponent"
            draggable=".components-item" :sort="false" @end="onEnd">
            <div class="components-item" v-for="(element, index) in layoutComponents" :key="index"
              @click="addComponent(element)">
              <div class="components-body">
                <svg-icon :icon-class="element.tagIcon" />
                {{ element.label }}
              </div>
            </div>
          </draggable>
        </div>
      </el-scrollbar>
    </div>

    <div class="center-board">
      <div class="action-bar">
        <el-button icon="el-icon-video-play" type="text" @click="run">运行</el-button>
        <el-button icon="el-icon-download" type="text" @click="download">导出vue文件</el-button>
        <el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">复制代码</el-button>
        <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">清空</el-button>
      </div>
      <el-scrollbar class="center-scrollbar">
        <el-row class="center-board-row" :gutter="formConf.gutter">
          <el-form :size="formConf.size" :label-position="formConf.labelPosition"
            :disabled="formConf.disabled" :label-width="formConf.labelWidth+'px'">
            <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
              <draggable-item v-for="(element, index) in drawingList" :key="element.renderKey"
                :drawingList="drawingList" :element="element" :index="index" :activeId="activeId"
                @activeItem="activeFormItem" @copyItem="drawingItemCopy" @deleteItem="drawingItemDelete"/>
            </draggable>
            <div class="empty-info" v-show="!drawingList.length">从左侧拖入或点选组件进行表单设计</div>
          </el-form>
        </el-row>
      </el-scrollbar>
    </div>

    <right-panel :activeData="activeData" :formConf="formConf" :show-field="!!drawingList.length">
    </right-panel>

    <form-drawer :visible.sync="drawerVisible" :formData="formData" size="100%" :generateConf="generateConf"/>
    <code-type-dialog :visible.sync="dialogVisible" title="选择生成类型" @confirm="generate" :showFileName="showFileName"/>
    <input type="hidden" id="copyNode">
  </div>
</template>

<script>
import draggable from "vuedraggable"
import render from "@/components/render"
import FormDrawer from "./FormDrawer"
import RightPanel from "./RightPanel"
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  formConf
} from "@/components/generator/config"
import { saveAs } from "file-saver"
import { exportDefault, beautifierConf, isNumberStr, titleCase } from "@/utils/index"
import beautifier from "beautifier"
import { makeUpHtml, vueTemplate, vueScript, cssStyle } from "@/components/generator/html"
import { makeUpJs } from "@/components/generator/js"
import { makeUpCss } from "@/components/generator/css"
import drawingDefalut from "@/components/generator/drawingDefalut"
import ClipboardJS from "clipboard"
import logo from "@/assets/logo.png"
import CodeTypeDialog from "./CodeTypeDialog"
import DraggableItem from "./DraggableItem"

var emptyActiveData = { style: {}, autosize: {} }
var oldActiveId, tempActiveData

export default {
  components: {
    draggable,
    render,
    FormDrawer,
    RightPanel,
    CodeTypeDialog,
    DraggableItem
  },
  watch: {
    "activeData.label"(val, oldVal) {
      if (this.activeData.placeholder === undefined || !this.activeData.tag || oldActiveId !== this.activeId) return
      this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, "") + val
    },
    activeId: {
      handler(val) {
        oldActiveId = val
      },
      immediate: true
    }
  },
  computed: {
  },
  mounted() {
    let clipboard = new ClipboardJS('#copyNode', {
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
    clipboard.on('error', function(e) {
      this.$message.error('代码复制失败')
    })
  },
  data() {
    return {
      logo: logo,
      idGlobal: 100,
      formConf: formConf,
      inputComponents: inputComponents,
      selectComponents: selectComponents,
      layoutComponents: layoutComponents,
      labelWidth: 100,
      drawingList: drawingDefalut,
      drawingData: {},
      activeId: drawingDefalut[0].formId,
      drawerVisible: false,
      formData: {},
      dialogVisible: false,
      generateConf: null,
      showFileName: false,
      activeData: drawingDefalut[0]
    }
  },
  methods: {
    activeFormItem(element) {
      this.activeData = element
      this.activeId = element.formId
    },
    onEnd(obj, a) {
      if (obj.from !== obj.to) {
        this.activeData = tempActiveData
        this.activeId = this.idGlobal
      }
    },
    addComponent(item) {
      var clone = this.cloneComponent(item)
      this.drawingList.push(clone)
      this.activeFormItem(clone)
    },
    cloneComponent(origin) {
      var clone = JSON.parse(JSON.stringify(origin))
      clone.formId = ++this.idGlobal
      clone.span = formConf.span
      clone.renderKey = +new Date(), // 改变renderKey后可以实现强制更新组件
      delete clone.tagIcon
      if(!clone.layout) clone.layout = 'colFormItem'
      if('colFormItem' === clone.layout) {
        clone.vModel = `field${this.idGlobal}`
        clone.placeholder !== undefined && (clone.placeholder = clone.placeholder + clone.label)
        tempActiveData = clone
      } else if('rowFormItem' === clone.layout) {
        delete clone.label
        clone.componentName = `row${this.idGlobal}`
        clone.gutter = this.formConf.gutter
        tempActiveData = clone
      }
      return tempActiveData
    },
    AssembleFromData() {
      this.formData = Object.assign(
        {
          fields: JSON.parse(JSON.stringify(this.drawingList))
        },
        this.formConf
      )
    },
    generate(data) {
      let func = this['exec' + titleCase(this.operationType)]
      this.generateConf = data
      func && func(data)
    },
    execRun(data) {
      this.AssembleFromData()
      this.drawerVisible = true
    },
    execDownload(data) {
      let codeStr = this.generateCode(),
        blob = new Blob([codeStr], { type: "text/plain;charset=utf-8" })
      saveAs(blob, data.fileName)
    },
    execCopy(data) {
      document.getElementById('copyNode').click()
    },
    empty() {
      this.$confirm("确定要清空所有组件吗？", "提示", { type: "warning" }).then(
        () => {
          this.drawingList = []
        }
      )
    },
    drawingItemCopy(item, parent) {
      var clone = JSON.parse(JSON.stringify(item))
      clone = this.createIdAndKey(clone)
      parent.push(clone)
      this.activeFormItem(clone)
    },
    createIdAndKey(item) {
      item.formId = ++this.idGlobal
      item.renderKey = +new Date()
      if('colFormItem' === item.layout) {
        item.vModel = `field${this.idGlobal}`
      } else if('rowFormItem' === item.layout) {
        item.componentName = `row${this.idGlobal}`
      }
      if(Array.isArray(item.children)) {
        item.children = item.children.map(childItem => {
          return this.createIdAndKey(childItem)
        })
      }
      return item
    },
    drawingItemDelete(index, parent) {
      parent.splice(index, 1)
      this.$nextTick(() => {
        var len = this.drawingList.length
        if (len) {
          this.activeFormItem(this.drawingList[len - 1])
        }
      })
    },
    generateCode() {
      let { type } = this.generateConf
      this.AssembleFromData()
      let script =vueScript(makeUpJs(this.formData, type))
      let html = vueTemplate(makeUpHtml(this.formData, type))
      let css = cssStyle(makeUpCss(this.formData))
      return beautifier.html(html + script + css, beautifierConf.html)
    },
    download() {
      this.dialogVisible = true
      this.showFileName = true
      this.operationType = 'download'
    },
    run() {
      this.dialogVisible = true
      this.showFileName = false
      this.operationType = 'run'
    },
    copy() {
      this.dialogVisible = true
      this.showFileName = false
      this.operationType = 'copy'
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/home";
</style>
