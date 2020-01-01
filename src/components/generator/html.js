var confGlobal
import { trigger } from "./config"

export function dialogWrapper(str) {
  return `<el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">
    ${str}
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handelConfirm">确定</el-button>
    </div>
  </el-dialog>`
}

export function vueTemplate(str) {
  return `<template>
    <div>
      ${str}
    </div>
  </template>`
}

export function vueScript(str) {
  return `<script>
    ${str}
  </script>`
}

export function cssStyle(cssStr){
  return `<style>
    ${cssStr}
  </style>`
}

function buildFormTemplate (conf, child, type) {
  var labelPosition = ""
  if(conf.labelPosition !== 'right') {
    labelPosition = `label-position="${conf.labelPosition}"`
  }
  let disabled = conf.disabled ? `:disabled="${conf.disabled}"` : ''
  var str =
`<el-row :gutter="${conf.gutter}">
  <el-form ref="${conf.formRef}" :model="${conf.formModel}" :rules="${conf.formRules}" size="${conf.size}" ${disabled} label-width="${conf.labelWidth}px" ${labelPosition}>
    ${child}
    ${buildFromBtns(conf, type)}
  </el-form>
</el-row>`
  return str
}

function buildFromBtns(conf, type) {
  var str = ''
  if(conf.formBtns && 'file' === type) {
    str =
      `<el-col :span="24">
        <el-form-item size="large">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-col>`
  }
  return str
}

function buildFormItemTemplate (element, child) {
  var labelWidth = ""
  if(element.labelWidth && element.labelWidth != confGlobal.labelWidth) {
    labelWidth = `label-width="${element.labelWidth}px"`
  }
  let required = !trigger[element.tag] && element.required ? `required` : '',
    str =
`<el-col :span="${element.span}">
  <el-form-item ${labelWidth} label="${element.label}" prop="${element.vModel}" ${required}>
    ${child}
  </el-form-item>
</el-col>`
  return str
}

var tags = {
  'el-input': function (el) {
    var {disabled, vModel, clearable, placeholder, width} = attrBuilder(el),
      maxlength = el.maxlength ? `:maxlength="${el.maxlength}"` : '',
      showWordLimit = el['show-word-limit'] ? `show-word-limit` : '',
      readonly = el.readonly ? `readonly` : '',
      prefixIcon = el['prefix-icon'] ? `prefix-icon='${el['prefix-icon']}'` : '',
      suffixIcon = el['suffix-icon'] ? `suffix-icon='${el['suffix-icon']}'` : '',
      showPassword = el['show-password'] ? `show-password` : '',
      type = el.type ? `type="${el.type}"` : '',
      autosize = el.autosize && el.autosize.minRows ? `:autosize="{minRows: ${el.autosize.minRows}, maxRows: ${el.autosize.maxRows}}"` : '',
      child = buildElInputChild(el)

    if(child) child = '\n' + child + '\n' // 换行
    return `<${el.tag} ${vModel} ${type} ${placeholder} ${maxlength} ${showWordLimit} ${readonly} ${disabled} ${clearable} ${prefixIcon} ${suffixIcon} ${showPassword} ${autosize} ${width}>${child}</${el.tag}>`
  },
  'el-input-number': function (el) {
    var {disabled, vModel, placeholder} = attrBuilder(el),
      controlsPosition = el['controls-position'] ? `controls-position=${el['controls-position']}` : '',
      min = el['min'] ? `:min='${el['min']}'` : '',
      max = el['max'] ? `:max='${el['max']}'` : '',
      step = el.step ? `:step='${el.step}'` : '',
      stepStrictly = el['step-strictly'] ? `step-strictly` : '',
      precision = el.precision ? `:precision='${el.precision}'` : ''

    return `<${el.tag} ${vModel} ${placeholder} ${step} ${stepStrictly} ${precision} ${controlsPosition} ${min} ${max} ${disabled}></${el.tag}>`
  },
  'el-select': function(el) {
    var {disabled, vModel, clearable, placeholder, width} = attrBuilder(el),
      filterable = el.filterable ? `filterable` : '',
      multiple = el.multiple ? `multiple` : '',
      child = buildElSelectChild(el)

    if(child) child = '\n' + child + '\n' // 换行
    return `<${el.tag} ${vModel} ${placeholder} ${disabled} ${multiple} ${filterable} ${clearable} ${width}>${child}</${el.tag}>`
  },
  'el-radio-group': function(el) {
    var {disabled, vModel} = attrBuilder(el),
      size = `size="${el.size}"`,
      child = buildElRadioGroupChild(el)

    if(child) child = '\n' + child + '\n' // 换行
    return `<${el.tag} ${vModel} ${size} ${disabled}>${child}</${el.tag}>`
  },
  'el-checkbox-group': function(el) {
    var {disabled, vModel} = attrBuilder(el),
      size = `size="${el.size}"`,
      min = el.min ? `:min="${el.min}"` : '',
      max = el.max ? `:max="${el.max}"` : '',
      child = buildElCheckboxGroupChild(el)

    if(child) child = '\n' + child + '\n' // 换行
    return `<${el.tag} ${vModel} ${min} ${max} ${size} ${disabled}>${child}</${el.tag}>`
  },
  'el-switch': function(el) {
    var {disabled, vModel} = attrBuilder(el),
      activeText = el['active-text'] ? `active-text="${el['active-text']}"` : '',
      inactiveText = el['inactive-text'] ? `inactive-text="${el['inactive-text']}"` : '',
      activeColor = el['active-color'] ? `active-color="${el['active-color']}"` : '',
      inactiveColor = el['inactive-color'] ? `inactive-color="${el['inactive-color']}"` : '',
      activeValue = el['active-value'] !== true ? `:active-value='${JSON.stringify(el['active-value'])}'` : '',
      inactiveValue = el['inactive-value'] !== false ? `:inactive-value='${JSON.stringify(el['inactive-value'])}'` : ''

    return `<${el.tag} ${vModel} ${activeText} ${inactiveText} ${activeColor} ${inactiveColor} ${activeValue} ${inactiveValue} ${disabled}></${el.tag}>`
  },
  'el-cascader': function(el) {
    var {disabled, vModel, clearable, placeholder, width} = attrBuilder(el),
      options = el.options ? `:options="${el.vModel}Options"` : '',
      props = el.props ? `:props="${el.vModel}Props"` : '',
      showAllLevels = el['show-all-levels'] ? '' : `:show-all-levels="false"`,
      filterable = el.filterable ? `filterable` : '',
      separator = el.separator === '/' ? '' : `separator="${el.separator}"`

    return `<${el.tag} ${vModel} ${options} ${props} ${width} ${showAllLevels} ${placeholder} ${separator} ${filterable} ${clearable} ${disabled}></${el.tag}>`
  },
  'el-slider': function(el) {
    var {disabled, vModel} = attrBuilder(el),
      min = el['min'] ? `:min='${el['min']}'` : '',
      max = el['max'] ? `:max='${el['max']}'` : '',
      step = el.step ? `:step='${el.step}'` : '',
      range = el.range ? 'range' : '',
      showStops = el['show-stops'] ? `:show-stops="${el['show-stops']}"` : ''

    return `<${el.tag} ${min} ${max} ${step} ${vModel} ${range} ${showStops} ${disabled}></${el.tag}>`
  },
  'el-time-picker': function(el) {
    var {disabled, vModel, clearable, placeholder, width} = attrBuilder(el),
    startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : '',
    endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : '',
    rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : '',
    isRange = el['is-range'] ? 'is-range' : '',
    format = el['format'] ? `format="${el['format']}"` : '',
    valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : '',
    pickerOptions = el['picker-options'] ? `:picker-options='${JSON.stringify(el['picker-options'])}'` : ''

    return `<${el.tag} ${vModel} ${isRange} ${format} ${valueFormat} ${pickerOptions} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${disabled}></${el.tag}>`
  },
  'el-date-picker': function(el) {
    var {disabled, vModel, clearable, placeholder, width} = attrBuilder(el),
      startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : '',
      endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : '',
      rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : '',
      format = el['format'] ? `format="${el['format']}"` : '',
      valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : '',
      type = el.type === 'date' ? '' : `type="${el.type}"`,
      readonly = el.readonly? 'readonly' : ''

    return `<${el.tag} ${type} ${vModel} ${format} ${valueFormat} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${readonly} ${disabled}></${el.tag}>`
  },
  'el-rate': function(el) {
    var {disabled, vModel} = attrBuilder(el),
      max = el['max'] ? `:max='${el['max']}'` : '',
      allowHalf = el['allow-half'] ? `allow-half` : '',
      showText = el['show-text'] ? `show-text` : '',
      showScore = el['show-score'] ? `show-score` : ''

    return `<${el.tag} ${vModel} ${allowHalf} ${showText} ${showScore} ${disabled}></${el.tag}>`
  },
  'el-color-picker': function(el) {
    var {disabled, vModel} = attrBuilder(el),
      size = `size="${el.size}"`,
      showAlpha = el['show-alpha'] ? 'show-alpha' : '',
      colorFormat = el['color-format'] ? `color-format="${el['color-format']}"` : ''

    return `<${el.tag} ${vModel} ${size} ${showAlpha} ${colorFormat} ${disabled}></${el.tag}>`
  },
  'el-upload': function(el) {
    var disabled = el.disabled ? `:disabled='true'` : '',
      action = el.action ? `:action="${el.vModel}Action"` : '',
      multiple = el.multiple ? 'multiple' : '',
      listType = el['list-type']!=='text' ? `list-type="${el['list-type']}"` : '',
      accept = el.accept ? `accept="${el.accept}"` : '',
      name = el.name!=='file' ? `name="${el.name}"` : '',
      autoUpload = el['auto-upload'] === false ? ':auto-upload="false"' : '',
      beforeUpload = `:before-upload="beforeUpload"`,
      fileList = `:file-list="${el.vModel}fileList"`,
      ref = `ref="${el.vModel}"`,
      child = buildElUploadChild(el)

    if(child) child = '\n' + child + '\n' // 换行
    return `<${el.tag} ${ref} ${fileList} ${action} ${autoUpload} ${multiple} ${beforeUpload} ${listType} ${accept} ${name} ${disabled}>${child}</${el.tag}>`
  }
}

function attrBuilder(el) {
  return {
    vModel: `v-model="${confGlobal.formModel}.${el.vModel}"`,
    clearable: el.clearable ? `clearable` : '',
    placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : '',
    width: el.style && el.style.width ? `:style="{width: '100%'}"` : '',
    disabled : el.disabled ? `:disabled='true'` : ''
  }
}

// el-input innerHTML
function buildElInputChild(conf) {
  var children = []
  if(conf.prepend) {
    children.push(`<template slot="prepend">${conf.prepend}</template>`)
  }
  if(conf.append) {
    children.push(`<template slot="append">${conf.append}</template>`)
  }
  return children.join('\n')
}

function buildElSelectChild(conf) {
  var children = []
  if(conf.options && conf.options.length) {
    children.push(`<el-option v-for="(item, index) in ${conf.vModel}Options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>`)
  }
  return children.join('\n')
}

function buildElRadioGroupChild(conf) {
  var children = []
  if(conf.options && conf.options.length) {
    let tag = conf.optionType === 'button' ? 'el-radio-button' : 'el-radio',
      border = conf.border ? 'border' : ''
    children.push(`<${tag} v-for="(item, index) in ${conf.vModel}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`)
  }
  return children.join('\n')
}

function buildElCheckboxGroupChild(conf) {
  var children = []
  if(conf.options && conf.options.length) {
    let tag = conf.optionType === 'button' ? 'el-checkbox-button' : 'el-checkbox',
      border = conf.border ? 'border' : ''
    children.push(`<${tag} v-for="(item, index) in ${conf.vModel}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`)
  }
  return children.join('\n')
}

function buildElUploadChild(conf) {
  var list = []
  if(conf['list-type'] === 'picture-card')
    list.push(`<i class="el-icon-plus"></i>`)
  else
    list.push(`<el-button size="small" type="primary" icon="el-icon-upload">${conf.buttonText}</el-button>`)
  if(conf.showTip)
    list.push(`<div slot="tip" class="el-upload__tip">只能上传不超过 ${conf.fileSize}${conf.sizeUnit} 的${conf.accept}文件</div>`)
  return list.join('\n')
}

export function makeUpHtml (conf, type) {
  var htmlList = []
  confGlobal = conf
  conf.fields.forEach(el => {
    if(!tags[el.tag]) return
    let tagDom = tags[el.tag](el)
    htmlList.push(buildFormItemTemplate(el, tagDom))
  })
  let htmlStr = htmlList.join('\n')

  let temp = buildFormTemplate(conf, htmlStr, type)
  if(type=== 'dialog') {
    temp = dialogWrapper(temp)
  }
  confGlobal = null
  return temp
}
