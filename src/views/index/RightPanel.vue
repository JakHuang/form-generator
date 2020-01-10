<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="组件属性" name="field" />
      <el-tab-pane label="表单属性" name="form" />
    </el-tabs>
    <div class="field-box">
      <span class="document-link" target="_blank" @click="openLink(documentLink)" title="查看组件文档">
        <i class="el-icon-link"></i>
      </span>
      <el-scrollbar class="right-scrollbar">
        <!-- 组件属性 -->
        <el-form v-show="currentTab==='field' && showField" size="small" label-width="90px">
          <el-form-item label="字段名">
            <el-input v-model="activeData.vModel" placeholder="请输入字段名（v-model）" />
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="activeData.label" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="占位提示" v-if="activeData.placeholder!==undefined">
            <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
          </el-form-item>
          <el-form-item label="开始占位" v-if="activeData['start-placeholder']!==undefined">
            <el-input v-model="activeData['start-placeholder']" placeholder="请输入占位提示" />
          </el-form-item>
          <el-form-item label="结束占位" v-if="activeData['end-placeholder']!==undefined">
            <el-input v-model="activeData['end-placeholder']" placeholder="请输入占位提示" />
          </el-form-item>
          <el-form-item label="表单栅格">
            <el-slider :max='24' :min="1" v-model="activeData.span" @change="spanChange" :marks="{12:12}"/>
          </el-form-item>
          <el-form-item label="标签宽度">
            <el-input type="number" v-model.number="activeData.labelWidth" placeholder="请输入标签宽度" />
          </el-form-item>
          <el-form-item label="组件宽度" v-if="activeData.style&&activeData.style.width!==undefined">
            <el-input v-model="activeData.style.width" placeholder="请输入组件宽度" clearable/>
          </el-form-item>
          <el-form-item label="默认值">
            <el-input :value="activeData.defaultValue" @input="setDefaultValue" placeholder="请输入默认值" />
          </el-form-item>
          <el-form-item label="至少应选" v-if="activeData.tag==='el-checkbox-group'">
            <el-input-number :value="activeData.min" @input="$set(activeData, 'min', $event?$event:undefined)"
              :min="0" placeholder="至少应选" />
          </el-form-item>
          <el-form-item label="最多可选" v-if="activeData.tag==='el-checkbox-group'">
            <el-input-number :value="activeData.max" @input="$set(activeData, 'max', $event?$event:undefined)"
              :min="0" placeholder="最多可选" />
          </el-form-item>
          <el-form-item label="前缀" v-if="activeData.prepend!==undefined">
            <el-input v-model="activeData.prepend" placeholder="请输入前缀" />
          </el-form-item>
          <el-form-item label="后缀" v-if="activeData.append!==undefined">
            <el-input v-model="activeData.append" placeholder="请输入后缀" />
          </el-form-item>
          <el-form-item label="前图标" v-if="activeData['prefix-icon']!==undefined">
            <el-input v-model="activeData['prefix-icon']" placeholder="请输入前图标名称">
              <el-button icon="el-icon-thumb" @click="openIconsDialog('prefix-icon')" slot="append">选择</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="后图标" v-if="activeData['suffix-icon']!==undefined">
            <el-input v-model="activeData['suffix-icon']" placeholder="请输入后图标名称">
              <el-button icon="el-icon-thumb" @click="openIconsDialog('suffix-icon')" slot="append">选择</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="选项分隔符" v-if="activeData.tag==='el-cascader'">
            <el-input v-model="activeData.separator" placeholder="请输入选项分隔符" />
          </el-form-item>
          <el-form-item label="最小行数" v-if="activeData.autosize!==undefined">
            <el-input-number v-model="activeData.autosize.minRows" :min="1" placeholder="最小行数" />
          </el-form-item>
          <el-form-item label="最大行数" v-if="activeData.autosize!==undefined">
            <el-input-number v-model="activeData.autosize.maxRows" :min="1" placeholder="最大行数" />
          </el-form-item>
          <el-form-item label="最小值" v-if="activeData.min!==undefined">
            <el-input-number v-model="activeData.min" placeholder="最小值" />
          </el-form-item>
          <el-form-item label="最大值" v-if="activeData.max!==undefined">
            <el-input-number v-model="activeData.max" placeholder="最大值" />
          </el-form-item>
          <el-form-item label="步长" v-if="activeData.step!==undefined">
            <el-input-number v-model="activeData.step" placeholder="步数" />
          </el-form-item>
          <el-form-item label="精度" v-if="activeData.tag==='el-input-number'">
            <el-input-number v-model="activeData.precision" :min='0' placeholder="精度" />
          </el-form-item>
          <el-form-item label="按钮位置" v-if="activeData.tag==='el-input-number'">
            <el-radio-group v-model="activeData['controls-position']">
              <el-radio-button label="">默认</el-radio-button>
              <el-radio-button label="right">右侧</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="最多输入" v-if="activeData.maxlength!==undefined">
            <el-input v-model="activeData.maxlength" placeholder="请输入字符长度">
              <template slot="append">个字符</template>
            </el-input>
          </el-form-item>
          <el-form-item label="开启提示" v-if="activeData['active-text']!==undefined">
            <el-input v-model="activeData['active-text']" placeholder="请输入开启提示" />
          </el-form-item>
          <el-form-item label="关闭提示" v-if="activeData['inactive-text']!==undefined">
            <el-input v-model="activeData['inactive-text']" placeholder="请输入关闭提示" />
          </el-form-item>
          <el-form-item label="开启值" v-if="activeData['active-value']!==undefined">
            <el-input :value="activeData['active-value']" @input="setSwitchValue($event, 'active-value')"
              placeholder="请输入开启值" />
          </el-form-item>
          <el-form-item label="关闭值" v-if="activeData['inactive-value']!==undefined">
            <el-input :value="activeData['inactive-value']" @input="setSwitchValue($event, 'inactive-value')"
              placeholder="请输入关闭值" />
          </el-form-item>
          <el-form-item label="时间类型" v-if="activeData.type!==undefined&&'el-date-picker'===activeData.tag">
            <el-select v-model="activeData.type" placeholder="请选择时间类型" :style="{width: '100%'}" @change="dateTypeChange">
              <el-option v-for="(item, index) in dateOptions" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件字段名" v-if="activeData.name!==undefined">
            <el-input v-model="activeData.name" placeholder="请输入上传文件字段名" />
          </el-form-item>
          <el-form-item label="文件类型" v-if="activeData.accept!==undefined">
            <el-select v-model="activeData.accept" placeholder="请选择文件类型" :style="{width: '100%'}" clearable>
              <el-option label="图片" value="image/*"></el-option>
              <el-option label="视频" value="video/*"></el-option>
              <el-option label="音频" value="audio/*"></el-option>
              <el-option label="excel" value=".xls,.xlsx"></el-option>
              <el-option label="word" value=".doc,.docx"></el-option>
              <el-option label="pdf" value=".pdf"></el-option>
              <el-option label="txt" value=".txt"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件大小" v-if="activeData.fileSize!==undefined">
            <el-input v-model.number="activeData.fileSize" placeholder="请输入文件大小">
              <el-select slot="append" v-model="activeData.sizeUnit" :style="{width: '66px'}">
                <el-option label="KB" value="KB"></el-option>
                <el-option label="MB" value="MB"></el-option>
                <el-option label="GB" value="GB"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="上传地址" v-if="activeData.action!==undefined">
            <el-input v-model="activeData.action" placeholder="请输入上传地址" clearable/>
          </el-form-item>
          <el-form-item label="列表类型" v-if="activeData['list-type']!==undefined">
            <el-radio-group v-model="activeData['list-type']" size="small">
              <el-radio-button label="text">text</el-radio-button>
              <el-radio-button label="picture">picture</el-radio-button>
              <el-radio-button label="picture-card">picture-card</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="按钮文字" v-if="activeData.buttonText!==undefined" v-show="'picture-card'!==activeData['list-type']">
            <el-input v-model="activeData.buttonText" placeholder="请输入按钮文字" />
          </el-form-item>
          <el-form-item label="分隔符" v-if="activeData['range-separator']!==undefined">
            <el-input v-model="activeData['range-separator']" placeholder="请输入分隔符" />
          </el-form-item>
          <el-form-item label="时间段" v-if="activeData['picker-options']!==undefined">
            <el-input v-model="activeData['picker-options'].selectableRange" placeholder="请输入时间段" />
          </el-form-item>
          <el-form-item label="时间格式" v-if="activeData.format!==undefined">
            <el-input :value="activeData.format" @input="setTimeValue($event)" placeholder="请输入时间格式" />
          </el-form-item>
          <template v-if="['el-checkbox-group','el-radio-group','el-select'].indexOf(activeData.tag) > -1">
            <el-divider>选项</el-divider>
            <draggable :list="activeData.options" :animation="340" group="selectItem" handle=".option-drag">
              <div class="select-item" v-for="(item, index) in activeData.options" :key="index">
                <div class="select-line-icon option-drag"><i class="el-icon-s-operation" /></div>
                <el-input placeholder="选项名" size="small" v-model="item.label" />
                <el-input placeholder="选项值" size="small" :value="item.value"
                  @input="setOptionValue(item, $event)" />
                <div class="close-btn select-line-icon" @click="activeData.options.splice(index, 1)">
                  <i class="el-icon-remove-outline" />
                </div>
              </div>
            </draggable>
            <div style="margin-left: 20px;">
              <el-button style="padding-bottom: 0" icon='el-icon-circle-plus-outline' type="text"
                @click="addSelectItem">添加选项</el-button>
            </div>
            <el-divider></el-divider>
          </template>

          <template v-if="['el-cascader'].indexOf(activeData.tag) > -1">
            <el-divider>选项</el-divider>
            <el-form-item label="数据类型">
              <el-radio-group v-model="activeData.dataType" size="small">
                <el-radio-button label="dynamic">动态数据</el-radio-button>
                <el-radio-button label="static">静态数据</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <template v-if="activeData.dataType==='dynamic'">
              <el-form-item label="标签键名">
                <el-input v-model="activeData.labelKey" placeholder="请输入标签键名" />
              </el-form-item>
              <el-form-item label="值键名">
                <el-input v-model="activeData.valueKey" placeholder="请输入值键名" />
              </el-form-item>
              <el-form-item label="子级键名">
                <el-input v-model="activeData.childrenKey" placeholder="请输入子级键名" />
              </el-form-item>
            </template>

            <el-tree v-if="activeData.dataType==='static'" draggable :data="activeData.options" node-key="id"
              :expand-on-click-node="false" :render-content="renderContent">
            </el-tree>
            <div style="margin-left: 20px" v-if="activeData.dataType==='static'">
              <el-button style="padding-bottom: 0" icon='el-icon-circle-plus-outline' type="text"
                @click="addTreeItem">添加父级</el-button>
            </div>
            <el-divider></el-divider>
          </template>

          <el-form-item label="选项样式" v-if="activeData.optionType!==undefined">
            <el-radio-group v-model="activeData.optionType">
              <el-radio-button label="default">默认</el-radio-button>
              <el-radio-button label="button">按钮</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开启颜色" v-if="activeData['active-color']!==undefined">
            <el-color-picker v-model="activeData['active-color']"></el-color-picker>
          </el-form-item>
          <el-form-item label="关闭颜色" v-if="activeData['inactive-color']!==undefined">
            <el-color-picker v-model="activeData['inactive-color']"></el-color-picker>
          </el-form-item>

          <el-form-item label="允许半选" v-if="activeData['allow-half']!==undefined">
            <el-switch v-model="activeData['allow-half']"/>
          </el-form-item>
          <el-form-item label="辅助文字" v-if="activeData['show-text']!==undefined">
            <el-switch v-model="activeData['show-text']" @change="rateTextChange"/>
          </el-form-item>
          <el-form-item label="显示分数" v-if="activeData['show-score']!==undefined">
            <el-switch v-model="activeData['show-score']" @change="rateScoreChange"/>
          </el-form-item>
          <el-form-item label="显示间断点" v-if="activeData['show-stops']!==undefined">
            <el-switch v-model="activeData['show-stops']"/>
          </el-form-item>
          <el-form-item label="范围选择" v-if="activeData.range!==undefined">
            <el-switch v-model="activeData.range" @change="rangeChange"/>
          </el-form-item>
          <el-form-item label="是否带边框"
            v-if="activeData.border!==undefined && activeData.optionType==='default'">
            <el-switch v-model="activeData.border" />
          </el-form-item>
          <el-form-item label="颜色格式" v-if="activeData.tag==='el-color-picker'">
            <el-select v-model="activeData['color-format']" placeholder="请选择颜色格式" :style="{width: '100%'}" @change="colorFormatChange">
              <el-option v-for="(item, index) in colorFormatOptions" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选项尺寸"
            v-if="activeData.size!==undefined &&
            (activeData.optionType==='button' || activeData.border || activeData.tag==='el-color-picker')">
            <el-radio-group v-model="activeData.size">
              <el-radio-button label="medium">中等</el-radio-button>
              <el-radio-button label="small">较小</el-radio-button>
              <el-radio-button label="mini">迷你</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="输入统计" v-if="activeData['show-word-limit']!==undefined">
            <el-switch v-model="activeData['show-word-limit']" />
          </el-form-item>
          <el-form-item label="严格步数" v-if="activeData.tag==='el-input-number'">
            <el-switch v-model="activeData['step-strictly']" />
          </el-form-item>
          <el-form-item label="是否多选" v-if="activeData.tag==='el-cascader'">
            <el-switch v-model="activeData.props.props.multiple" />
          </el-form-item>
          <el-form-item label="展示全路径" v-if="activeData.tag==='el-cascader'">
            <el-switch v-model="activeData['show-all-levels']" />
          </el-form-item>
          <el-form-item label="可否筛选" v-if="activeData.tag==='el-cascader'">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <el-form-item label="能否清空" v-if="activeData.clearable!==undefined">
            <el-switch v-model="activeData.clearable" />
          </el-form-item>
          <el-form-item label="显示提示" v-if="activeData.showTip!==undefined">
            <el-switch v-model="activeData.showTip" />
          </el-form-item>
          <el-form-item label="多选文件" v-if="activeData.multiple!==undefined">
            <el-switch v-model="activeData.multiple" />
          </el-form-item>
          <el-form-item label="自动上传" v-if="activeData['auto-upload']!==undefined">
            <el-switch v-model="activeData['auto-upload']" />
          </el-form-item>
          <el-form-item label="是否只读" v-if="activeData.readonly!==undefined">
            <el-switch v-model="activeData.readonly" />
          </el-form-item>
          <el-form-item label="是否禁用" v-if="activeData.disabled!==undefined">
            <el-switch v-model="activeData.disabled" />
          </el-form-item>
          <el-form-item label="是否可搜索" v-if="activeData.tag==='el-select'">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <el-form-item label="是否多选" v-if="activeData.tag==='el-select'">
            <el-switch v-model="activeData.multiple" @change="multipleChange" />
          </el-form-item>
          <el-form-item label="是否必填" v-if="activeData.required!==undefined">
            <el-switch v-model="activeData.required" />
          </el-form-item>

          <el-divider>正则校验</el-divider>
          <div class="reg-item" v-for="(item, index) in activeData.regList" :key="index">
            <span class="close-btn" @click="activeData.regList.splice(index, 1)"><i
                class="el-icon-close" /></span>
            <el-form-item label="表达式">
              <el-input placeholder="请输入正则" v-model="item.pattern" />
            </el-form-item>
            <el-form-item label="错误提示" style="margin-bottom:0">
              <el-input v-model="item.message" placeholder="请输入错误提示" />
            </el-form-item>
          </div>
          <div style="margin-left: 20px">
            <el-button icon='el-icon-circle-plus-outline' type="text" @click="addReg">添加规则</el-button>
          </div>
        </el-form>
        <!-- 表单属性 -->
        <el-form v-show="currentTab==='form'" size="small" label-width="90px">
          <el-form-item label="表单名">
            <el-input v-model="formConf.formRef" placeholder="请输入表单名（ref）" />
          </el-form-item>
          <el-form-item label="表单模型">
            <el-input v-model="formConf.formModel" placeholder="请输入数据模型" />
          </el-form-item>
          <el-form-item label="校验模型">
            <el-input v-model="formConf.formRules" placeholder="请输入校验模型" />
          </el-form-item>
          <el-form-item label="表单尺寸">
            <el-radio-group v-model="formConf.size">
              <el-radio-button label="medium">中等</el-radio-button>
              <el-radio-button label="small">较小</el-radio-button>
              <el-radio-button label="mini">迷你</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签对齐">
            <el-radio-group v-model="formConf.labelPosition">
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="right">右对齐</el-radio-button>
              <el-radio-button label="top">顶部对齐</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签宽度">
            <el-input-number v-model="formConf.labelWidth" placeholder="标签宽度" />
          </el-form-item>
          <el-form-item label="分栏间隔">
            <el-input-number v-model="formConf.gutter" :min="0" placeholder="分栏间隔" />
          </el-form-item>
          <el-form-item label="禁用表单">
            <el-switch v-model="formConf.disabled" />
          </el-form-item>
          <el-form-item label="表单按钮">
            <el-switch v-model="formConf.formBtns" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

    <treeNode-dialog :visible.sync="dialogVisible" title="添加选项" @commit="addNode" />
    <icons-dialog :visible.sync="iconsVisible" @select="setIcon" :current="activeData[currentIconModel]"/>
  </div>
</template>

<script>
import TreeNodeDialog from "@/views/index/TreeNodeDialog"
import { isNumberStr } from "@/utils/index"
import { isArray } from "util"
import { mixins } from '@/utils/mixins'
import IconsDialog from "./IconsDialog"

let dateTimeFormat = {
  date: 'yyyy-MM-dd',
  week: 'yyyy 第 WW 周',
  month: 'yyyy-MM',
  year: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss'
}

export default {
  components: {
    TreeNodeDialog,
    IconsDialog
  },
  mixins: [mixins],
  props: ["showField", "activeData", "formConf"],
  data() {
    return {
      currentTab: "field",
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null,
      dateTypeOptions: [{
        "label": "日(date)",
        "value": "date"
      }, {
        "label": "周(week)",
        "value": "week"
      }, {
        "label": "月(month)",
        "value": "month"
      }, {
        "label": "年(year)",
        "value": "year"
      }, {
        "label": "日期时间(datetime)",
        "value": "datetime"
      }],
      dateRangeTypeOptions: [{
        "label": "日期范围(daterange)",
        "value": "daterange"
      }, {
        "label": "月范围(monthrange)",
        "value": "monthrange"
      }, {
        "label": "日期时间范围(datetimerange)",
        "value": "datetimerange"
      }],
      colorFormatOptions: [{
        label: 'hex',
        value: 'hex'
      },{
        label: 'rgb',
        value: 'rgb'
      },{
        label: 'rgba',
        value: 'rgba'
      },{
        label: 'hsv',
        value: 'hsv'
      },{
        label: 'hsl',
        value: "hsl"
      }]
    }
  },
  computed: {
    documentLink() {
      return this.activeData.document || 'https://element.eleme.cn/#/zh-CN/component/installation'
    },
    dateOptions() {
      if(this.activeData.type !== undefined && 'el-date-picker' === this.activeData.tag) {
        if(this.activeData['start-placeholder'] === undefined)
          return this.dateTypeOptions
        return this.dateRangeTypeOptions
      }
      return []
    }
  },
  methods: {
    addReg() {
      this.activeData.regList.push({
        pattern: "",
        message: ""
      })
    },
    addSelectItem() {
      this.activeData.options.push({
        label: "",
        value: ""
      })
    },
    addTreeItem() {
      ++this.idGlobal
      this.dialogVisible = true
      this.currentNode = this.activeData.options
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-operation">
            <i on-click={() => this.append(data)} class="el-icon-plus" title="添加"></i>
            <i on-click={() => this.remove(node, data)} class="el-icon-delete" title="删除"></i>
          </span>
        </div>
      )
    },
    append(data) {
      if (!data.children) {
        this.$set(data, "children", [])
      }
      this.dialogVisible = true
      this.currentNode = data.children
    },
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    addNode(data) {
      this.currentNode.push(data)
    },
    setOptionValue(item, val) {
      item.value = isNumberStr(val) ? +val : val
    },
    setDefaultValue(str) {
      if (isArray(this.activeData.defaultValue)) {
        // 数组
        this.$set(
          this.activeData,
          "defaultValue",
          str.split(",").map(val => {
            return isNumberStr(val) ? +val : val
          })
        )
      } else if (["true", "false"].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData, "defaultValue", JSON.parse(str))
      } else {
        // 字符串和数字
        this.$set(
          this.activeData,
          "defaultValue",
          isNumberStr(str) ? +str : str
        )
      }
    },
    setSwitchValue(val, name) {
      if (["true", "false"].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val))
      } else {
        this.$set(this.activeData, name, isNumberStr(val) ? +val : val)
      }
    },
    setTimeValue(val, type) {
      let valueFormat = type === 'week' ? dateTimeFormat.date : val
      this.$set(this.activeData, 'defaultValue', null)
      this.$set(this.activeData, 'value-format', valueFormat)
      this.$set(this.activeData, 'format', val)
    },
    spanChange(val) {
      this.formConf.span = val
    },
    multipleChange(val) {
      this.$set(this.activeData, "defaultValue", val ? [] : "")
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val)
    },
    rangeChange(val) {
      this.$set(this.activeData, "defaultValue", val ?
        [this.activeData.min, this.activeData.max] : this.activeData.min)
    },
    rateTextChange(val) {
      if(val) this.activeData['show-score'] = false
    },
    rateScoreChange(val) {
      if(val) this.activeData['show-text'] = false
    },
    colorFormatChange(val) {
      this.activeData.defaultValue = null
      this.activeData['show-alpha'] = val.indexOf('a') > -1
      this.activeData.renderKey = +new Date() // 更新renderKey,重新渲染该组件
    },
    openIconsDialog(model) {
      this.iconsVisible = true
      this.currentIconModel = model
    },
    setIcon(val) {
      this.activeData[this.currentIconModel] = val
    }
  }
}
</script>

<style lang="scss" scoped>
.right-board {
  width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;
  .field-box {
    position: relative;
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .el-scrollbar {
    height: 100%;
  }
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .el-date-editor{
    width: 227px;
  }
  ::v-deep .el-icon-time{
    display: none;
  }
}
.document-link{
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
</style>
