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
            <svg-icon icon-class="component" /> 输入型组件</div>
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
            <svg-icon icon-class="component" /> 选择型组件</div>
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
        </div>
      </el-scrollbar>
    </div>

    <div class="center-board">
      <div class="action-bar">
        <el-button icon="el-icon-video-play" type="text" @click="generate">运行</el-button>
        <el-button icon="el-icon-download" type="text" @click="exportFile">导出vue文件</el-button>
        <el-button class="copy-btn-main" icon="el-icon-document-copy" type="text">复制代码</el-button>
        <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">清空</el-button>
      </div>
      <el-scrollbar class="center-scrollbar">
        <el-row class="center-board-row" :gutter="formConf.gutter">
          <el-form :size="formConf.size" :label-position="formConf.labelPosition"
            :disabled="formConf.disabled" :label-width="formConf.labelWidth+'px'">
            <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
              <el-col :span="element.span" v-for="(element, index) in drawingList" :key="element.renderKey"
                class="drawing-item" :class="activeId==element.formId?'activeFromItem':''"
                @click.native="activeFormItem(element.formId)">
                <el-form-item :label-width="element.labelWidth?element.labelWidth +'px':null"
                  :label="element.label" :required="element.required">
                  <render :conf="element" @input="$set(element, 'defaultValue', $event)" />
                </el-form-item>
                <span class="drawing-item-copy" title="复制" @click.stop="drawingItemCopy(element)">
                  <i class="el-icon-copy-document" />
                </span>
                <span class="drawing-item-delete" title="删除" @click.stop="drawingItemDelete(index)">
                  <i class="el-icon-delete" />
                </span>
              </el-col>
            </draggable>
            <div class="empty-info" v-show="!drawingList.length">从左侧拖入或点选组件进行表单设计</div>
          </el-form>
        </el-row>
      </el-scrollbar>
    </div>

    <right-panel :activeData="activeData" :formConf="formConf" :show-field="!!drawingList.length">
    </right-panel>

    <form-drawer :visible.sync="drawerVisible" :formData="formData" size="100%" />
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
  formConf
} from "@/components/generator/config"
import { saveAs } from "file-saver"
import { exportDefault, beautifierConf, isNumberStr } from "@/utils/index"
import beautifier from "beautifier"
import { makeUpHtml, vueTemplate, vueScript, cssStyle } from "@/components/generator/html"
import { makeUpJs } from "@/components/generator/js"
import { makeUpCss } from "@/components/generator/css"
import drawingDefalut from "@/components/generator/drawingDefalut"
import ClipboardJS from "clipboard"
import logo from "@/assets/logo.png"

var emptyActiveData = { style: {}, autosize: {} }
var oldActiveId

export default {
  components: {
    draggable,
    render,
    FormDrawer,
    RightPanel
  },
  watch: {
    "activeData.label"(val, oldVal) {
      if (!this.activeData.tag || oldActiveId !== this.activeId) return
      this.activeData.placeholder =
        this.activeData.placeholder.replace(oldVal, "") + val
    },
    activeId: {
      handler(val) {
        oldActiveId = val
      },
      immediate: true
    }
  },
  computed: {
    activeData() {
      return (
        this.drawingList.find(item => item.formId == this.activeId) ||
        emptyActiveData
      )
    }
  },
  mounted() {
    new ClipboardJS(".copy-btn-main", {
      text: trigger => {
        if (this.drawingList.length === 0) {
          this.$message({
            showClose: true,
            message: "未选择任何组件",
            type: "warning"
          })
          return ""
        }
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
  data() {
    return {
      logo: logo,
      idGlobal: 100,
      formConf: formConf,
      inputComponents: inputComponents,
      selectComponents: selectComponents,
      labelWidth: 100,
      drawingList: drawingDefalut,
      drawingData: {},
      activeId: drawingDefalut[0].formId,
      drawerVisible: false,
      formData: {}
    }
  },
  methods: {
    activeFormItem: function(formId) {
      this.activeId = formId
    },
    onEnd(obj) {
      if (obj.from !== obj.to) this.activeId = this.idGlobal
    },
    addComponent(item) {
      var clone = this.cloneComponent(item)
      this.drawingList.push(clone)
      this.activeId = this.idGlobal
    },
    cloneComponent(origin) {
      this.idGlobal = this.idGlobal + 1
      var clone = JSON.parse(JSON.stringify(origin))
      delete clone.tagIcon
      let obj = Object.assign(clone, {
        formId: this.idGlobal,
        vModel: "field" + this.idGlobal,
        renderKey: +new Date(), // 改变renderKey后可以实现强制更新组件
        span: formConf.span
      })
      clone.placeholder !== undefined &&
        (obj.placeholder = clone.placeholder + clone.label)
      return obj
    },
    AssembleFromData() {
      this.formData = Object.assign(
        {
          fields: JSON.parse(JSON.stringify(this.drawingList))
        },
        this.formConf
      )
    },
    generate() {
      if (this.drawingList.length === 0) {
        this.$message({
          showClose: true,
          message: "未选择任何组件",
          type: "warning"
        })
        return
      }
      this.AssembleFromData()
      this.drawerVisible = true
    },
    empty() {
      this.$confirm("确定要清空所有组件吗？", "提示", { type: "warning" }).then(
        () => {
          this.drawingList = []
        }
      )
    },
    drawingItemCopy(item) {
      var clone = JSON.parse(JSON.stringify(item))
      clone.formId = ++this.idGlobal
      clone.vModel = "field" + this.idGlobal
      this.drawingList.push(clone)
      this.activeFormItem(clone.formId)
    },
    drawingItemDelete(index) {
      this.drawingList.splice(index, 1)
      this.$nextTick(() => {
        var len = this.drawingList.length
        if (len) {
          this.activeFormItem(this.drawingList[len - 1].formId)
        }
      })
    },
    generateCode() {
      this.AssembleFromData()
      let script =vueScript(makeUpJs(this.formData))
      let html = vueTemplate(makeUpHtml(this.formData))
      let css = cssStyle(makeUpCss(this.formData))
      return beautifier.html(html + script + css, beautifierConf.html)
    },
    exportFile() {
      if (this.drawingList.length === 0) {
        this.$message({
          showClose: true,
          message: "未选择任何组件",
          type: "warning"
        })
        return
      }
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
@import "@/styles/homeScoped";
</style>
