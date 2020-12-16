

function attrBuilder(el) {
	return {
		tag: el.__config__.tag,
		vModel: `v-model="${el.__vModel__}"`,
		clearable: el.clearable ? 'clearable' : '',
		placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : '',
		width: el.style && el.style.width ? ':style="{width: \'100%\'}"' : '',
		disabled: el.disabled ? ':disabled=\'true\'' : ''
	}
}


// el-buttin 子级
function buildElButtonChild(scheme) {
	const children = []
	const slot = scheme.__slot__ || {}
	if (slot.default) {
		children.push(slot.default)
	}
	return children.join('\n')
}

// el-input 子级
function buildElInputChild(scheme) {
	const children = []
	const slot = scheme.__slot__
	if (slot && slot.prepend) {
		children.push(`<template slot="prepend">${slot.prepend}</template>`)
	}
	if (slot && slot.append) {
		children.push(`<template slot="append">${slot.append}</template>`)
	}
	return children.join('\n')
}

// el-select 子级
function buildElSelectChild(scheme) {
	const children = []
	const slot = scheme.__slot__
	if (slot && slot.options && slot.options.length) {
		children.push(`<el-option v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>`)
	}
	return children.join('\n')
}

// el-radio-group 子级
function buildElRadioGroupChild(scheme) {
	const children = []
	const slot = scheme.__slot__
	const config = scheme.__config__
	if (slot && slot.options && slot.options.length) {
		const tag = config.optionType === 'button' ? 'el-radio-button' : 'el-radio'
		const border = config.border ? 'border' : ''
		children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`)
	}
	return children.join('\n')
}

// el-checkbox-group 子级
function buildElCheckboxGroupChild(scheme) {
	const children = []
	const slot = scheme.__slot__
	const config = scheme.__config__
	if (slot && slot.options && slot.options.length) {
		const tag = config.optionType === 'button' ? 'el-checkbox-button' : 'el-checkbox'
		const border = config.border ? 'border' : ''
		children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`)
	}
	return children.join('\n')
}

// el-upload 子级
function buildElUploadChild(scheme) {
	const list = []
	const config = scheme.__config__
	if (scheme['list-type'] === 'picture-card') list.push('<i class="el-icon-plus"></i>')
	else list.push(`<el-button size="small" type="primary" icon="el-icon-upload">${config.buttonText}</el-button>`)
	if (config.showTip) list.push(`<div slot="tip" class="el-upload__tip">只能上传不超过 ${config.fileSize}${config.sizeUnit} 的${scheme.accept}文件</div>`)
	return list.join('\n')
}

export default {
	'el-button': el => {
		const {
			tag, disabled
		} = attrBuilder(el)
		const type = el.type ? `type="${el.type}"` : ''
		const icon = el.icon ? `icon="${el.icon}"` : ''
		const round = el.round ? 'round' : ''
		const size = el.size ? `size="${el.size}"` : ''
		const plain = el.plain ? 'plain' : ''
		const circle = el.circle ? 'circle' : ''
		let child = buildElButtonChild(el)

		if (child) child = `\n${child}\n` // 换行
		return `<${tag} ${type} ${icon} ${round} ${size} ${plain} ${disabled} ${circle}>${child}</${tag}>`
	},
	'el-input': el => {
		const {
			tag, disabled, vModel, clearable, placeholder, width
		} = attrBuilder(el)
		const maxlength = el.maxlength ? `:maxlength="${el.maxlength}"` : ''
		const showWordLimit = el['show-word-limit'] ? 'show-word-limit' : ''
		const readonly = el.readonly ? 'readonly' : ''
		const prefixIcon = el['prefix-icon'] ? `prefix-icon='${el['prefix-icon']}'` : ''
		const suffixIcon = el['suffix-icon'] ? `suffix-icon='${el['suffix-icon']}'` : ''
		const showPassword = el['show-password'] ? 'show-password' : ''
		const type = el.type ? `type="${el.type}"` : ''
		const autosize = el.autosize && el.autosize.minRows
			? `:autosize="{minRows: ${el.autosize.minRows}, maxRows: ${el.autosize.maxRows}}"`
			: ''
		let child = buildElInputChild(el)

		if (child) child = `\n${child}\n` // 换行
		return `<${tag} ${vModel} ${type} ${placeholder} ${maxlength} ${showWordLimit} ${readonly} ${disabled} ${clearable} ${prefixIcon} ${suffixIcon} ${showPassword} ${autosize} ${width}>${child}</${tag}>`
	},
	'el-input-number': el => {
		const {
			tag, disabled, vModel, placeholder
		} = attrBuilder(el)
		const controlsPosition = el['controls-position'] ? `controls-position=${el['controls-position']}` : ''
		const min = el.min ? `:min='${el.min}'` : ''
		const max = el.max ? `:max='${el.max}'` : ''
		const step = el.step ? `:step='${el.step}'` : ''
		const stepStrictly = el['step-strictly'] ? 'step-strictly' : ''
		const precision = el.precision ? `:precision='${el.precision}'` : ''

		return `<${tag} ${vModel} ${placeholder} ${step} ${stepStrictly} ${precision} ${controlsPosition} ${min} ${max} ${disabled}></${tag}>`
	},
	'el-select': el => {
		const {
			tag, disabled, vModel, clearable, placeholder, width
		} = attrBuilder(el)
		const filterable = el.filterable ? 'filterable' : ''
		const multiple = el.multiple ? 'multiple' : ''
		let child = buildElSelectChild(el)

		if (child) child = `\n${child}\n` // 换行
		return `<${tag} ${vModel} ${placeholder} ${disabled} ${multiple} ${filterable} ${clearable} ${width}>${child}</${tag}>`
	},
	'el-radio-group': el => {
		const { tag, disabled, vModel } = attrBuilder(el)
		const size = `size="${el.size}"`
		let child = buildElRadioGroupChild(el)

		if (child) child = `\n${child}\n` // 换行
		return `<${tag} ${vModel} ${size} ${disabled}>${child}</${tag}>`
	},
	'el-checkbox-group': el => {
		const { tag, disabled, vModel } = attrBuilder(el)
		const size = `size="${el.size}"`
		const min = el.min ? `:min="${el.min}"` : ''
		const max = el.max ? `:max="${el.max}"` : ''
		let child = buildElCheckboxGroupChild(el)

		if (child) child = `\n${child}\n` // 换行
		return `<${tag} ${vModel} ${min} ${max} ${size} ${disabled}>${child}</${tag}>`
	},
	'el-switch': el => {
		const { tag, disabled, vModel } = attrBuilder(el)
		const activeText = el['active-text'] ? `active-text="${el['active-text']}"` : ''
		const inactiveText = el['inactive-text'] ? `inactive-text="${el['inactive-text']}"` : ''
		const activeColor = el['active-color'] ? `active-color="${el['active-color']}"` : ''
		const inactiveColor = el['inactive-color'] ? `inactive-color="${el['inactive-color']}"` : ''
		const activeValue = el['active-value'] !== true ? `:active-value='${JSON.stringify(el['active-value'])}'` : ''
		const inactiveValue = el['inactive-value'] !== false ? `:inactive-value='${JSON.stringify(el['inactive-value'])}'` : ''

		return `<${tag} ${vModel} ${activeText} ${inactiveText} ${activeColor} ${inactiveColor} ${activeValue} ${inactiveValue} ${disabled}></${tag}>`
	},
	'el-cascader': el => {
		const {
			tag, disabled, vModel, clearable, placeholder, width
		} = attrBuilder(el)
		const options = el.options ? `:options="${el.__vModel__}Options"` : ''
		const props = el.props ? `:props="${el.__vModel__}Props"` : ''
		const showAllLevels = el['show-all-levels'] ? '' : ':show-all-levels="false"'
		const filterable = el.filterable ? 'filterable' : ''
		const separator = el.separator === '/' ? '' : `separator="${el.separator}"`

		return `<${tag} ${vModel} ${options} ${props} ${width} ${showAllLevels} ${placeholder} ${separator} ${filterable} ${clearable} ${disabled}></${tag}>`
	},
	'el-slider': el => {
		const { tag, disabled, vModel } = attrBuilder(el)
		const min = el.min ? `:min='${el.min}'` : ''
		const max = el.max ? `:max='${el.max}'` : ''
		const step = el.step ? `:step='${el.step}'` : ''
		const range = el.range ? 'range' : ''
		const showStops = el['show-stops'] ? `:show-stops="${el['show-stops']}"` : ''

		return `<${tag} ${min} ${max} ${step} ${vModel} ${range} ${showStops} ${disabled}></${tag}>`
	},
	'el-time-picker': el => {
		const {
			tag, disabled, vModel, clearable, placeholder, width
		} = attrBuilder(el)
		const startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : ''
		const endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : ''
		const rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : ''
		const isRange = el['is-range'] ? 'is-range' : ''
		const format = el.format ? `format="${el.format}"` : ''
		const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
		const pickerOptions = el['picker-options'] ? `:picker-options='${JSON.stringify(el['picker-options'])}'` : ''

		return `<${tag} ${vModel} ${isRange} ${format} ${valueFormat} ${pickerOptions} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${disabled}></${tag}>`
	},
	'el-date-picker': el => {
		const {
			tag, disabled, vModel, clearable, placeholder, width
		} = attrBuilder(el)
		const startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : ''
		const endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : ''
		const rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : ''
		const format = el.format ? `format="${el.format}"` : ''
		const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
		const type = el.type === 'date' ? '' : `type="${el.type}"`
		const readonly = el.readonly ? 'readonly' : ''

		return `<${tag} ${type} ${vModel} ${format} ${valueFormat} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${readonly} ${disabled}></${tag}>`
	},
	'el-rate': el => {
		const { tag, disabled, vModel } = attrBuilder(el)
		const max = el.max ? `:max='${el.max}'` : ''
		const allowHalf = el['allow-half'] ? 'allow-half' : ''
		const showText = el['show-text'] ? 'show-text' : ''
		const showScore = el['show-score'] ? 'show-score' : ''

		return `<${tag} ${vModel} ${max} ${allowHalf} ${showText} ${showScore} ${disabled}></${tag}>`
	},
	'el-color-picker': el => {
		const { tag, disabled, vModel } = attrBuilder(el)
		const size = `size="${el.size}"`
		const showAlpha = el['show-alpha'] ? 'show-alpha' : ''
		const colorFormat = el['color-format'] ? `color-format="${el['color-format']}"` : ''

		return `<${tag} ${vModel} ${size} ${showAlpha} ${colorFormat} ${disabled}></${tag}>`
	},
	'el-upload': el => {
		const { tag } = el.__config__
		const disabled = el.disabled ? ':disabled=\'true\'' : ''
		const action = el.action ? `:action="${el.__vModel__}Action"` : ''
		const multiple = el.multiple ? 'multiple' : ''
		const listType = el['list-type'] !== 'text' ? `list-type="${el['list-type']}"` : ''
		const accept = el.accept ? `accept="${el.accept}"` : ''
		const name = el.name !== 'file' ? `name="${el.name}"` : ''
		const autoUpload = el['auto-upload'] === false ? ':auto-upload="false"' : ''
		const beforeUpload = `:before-upload="${el.__vModel__}BeforeUpload"`
		const fileList = `:file-list="${el.__vModel__}fileList"`
		const ref = `ref="${el.__vModel__}"`
		let child = buildElUploadChild(el)

		if (child) child = `\n${child}\n` // 换行
		return `<${tag} ${ref} ${fileList} ${action} ${autoUpload} ${multiple} ${beforeUpload} ${listType} ${accept} ${name} ${disabled}>${child}</${tag}>`
	},
	tinymce: el => {
		const { tag, vModel, placeholder } = attrBuilder(el)
		const height = el.height ? `:height="${el.height}"` : ''
		const branding = el.branding ? `:branding="${el.branding}"` : ''
		return `<${tag} ${vModel} ${placeholder} ${height} ${branding}></${tag}>`
	}
}
