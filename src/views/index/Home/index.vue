<template>
	<div class="container">
		<!--组件面板-->
		<div class="left-board">
			<div class="logo-wrapper">
				<div class="logo">
					<img :src="logo" alt="logo"> Form Generator
					<a class="github" href="https://github.com/JacBian/form-generator" target="_blank">
						<img src="https://github.githubassets.com/pinned-octocat.svg" alt>
					</a>
				</div>
			</div>
			<!--组件列表-->
			<el-scrollbar class="left-scrollbar">
				<div class="components-list">
					<div v-for="(item, listIndex) in leftComponents" :key="listIndex">
						<div class="components-title">
							<svg-icon icon-class="component"/>
							{{ item.title }}
						</div>
						<draggable
								class="components-draggable"
								:list="item.list"
								:group="{ name: 'componentsGroup', pull: 'clone', put: false }"
								:clone="cloneComponent"
								draggable=".components-item"
								:sort="false"
								@end="onEnd"
						>
							<div
									v-for="(element, index) in item.list"
									:key="index"
									class="components-item"
									@click="addComponent(element)"
							>
								<div class="components-body">
									<svg-icon :icon-class="element.__config__.tagIcon"/>
									{{ element.__config__.label }}
								</div>
							</div>
						</draggable>
					</div>
				</div>
			</el-scrollbar>
		</div>
		<!--预览（拖拽）面板-->
		<div class="center-board">
			<div class="action-bar">
				<el-tabs v-model="activeName" @tab-click="handleTabClick">
					<el-tab-pane label="设计器" name="first">
						<el-scrollbar class="center-scrollbar">
							<el-row class="center-board-row">
								<div class="render-container">
									<draggable class="drawing-board" :list="drawingList" :animation="340"
									           group="componentsGroup">
										<render-item
												v-for="(item, index) in drawingList"
												:key="item.renderKey"
												:drawing-list="drawingList"
												:current-item="item"
												:index="index"
												:active-id="activeId"
												@activeItem="activeFormItem"
												@copyItem="drawingItemCopy"
												@deleteItem="drawingItemDelete"
										/>
									</draggable>
									<div v-show="!drawingList.length" class="empty-info">
										从左侧拖入或点选组件进行表单设计
									</div>
								</div>
							</el-row>
						</el-scrollbar>
					</el-tab-pane>
					<el-tab-pane label="代码" name="second">
						<code-pane
								v-if="activeName === 'second'"
								:form-data="formData"
								:generate-conf="generateConf"
						/>
					</el-tab-pane>
					<el-tab-pane label="预览" name="third">
						<preview-pane
								v-if="activeName === 'third'"
								:form-data="formData"
								:generate-conf="generateConf"
						/>
					</el-tab-pane>
				</el-tabs>
				<div class="btns-tools">
					<!--					<el-button icon="el-icon-video-play" type="text" @click="run">-->
					<!--						运行-->
					<!--					</el-button>-->
					<el-button icon="el-icon-view" type="text" @click="showJson">
						查看json
					</el-button>
					<el-button icon="el-icon-download" type="text" @click="download">
						导出vue文件
					</el-button>
					<el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">
						复制代码
					</el-button>
					<el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">
						清空
					</el-button>
				</div>
			</div>
		</div>
		<!--属性面板-->
		<right-panel
				:active-data="activeData"
				:show-field="!!drawingList.length"
				@tag-change="tagChange"
				@fetch-data="fetchData"
		/>
		<!--json抽屉-->
		<json-drawer
				size="60%"
				:visible.sync="jsonDrawerVisible"
				:json-str="JSON.stringify(formData)"
				@refresh="refreshJson"
		/>
		<!--生成类型-->
		<code-type-dialog
				:visible.sync="dialogVisible"
				title="选择生成类型"
				:show-file-name="showFileName"
				@confirm="generate"
		/>
		<input id="copyNode" type="hidden">
	</div>
</template>

<script>
	/* eslint-disable*/
	//组件
	import draggable from 'vuedraggable'
	import CodePane from "./CodePane";
	import FormDrawer from '../FormDrawer.vue'
	import JsonDrawer from '../JsonDrawer'
	import RightPanel from '../RightPanel'
	import CodeTypeDialog from '../CodeTypeDialog'
	import RenderItem from '../RenderItem'
	//函数防抖
	import {debounce} from 'throttle-debounce'
	//保存文件
	import {saveAs} from 'file-saver'
	//剪切板
	import ClipboardJS from 'clipboard'
	/*
	** 引入配置
	** 输入组件、选择组件、布局组件
	 */
	import {
		inputComponents, selectComponents, layoutComponents
	} from '@/components/generator/config'
	/*
	** 引入函数
	** js美化配置、首字母大写、深拷贝
	 */
	import {
		beautifierConf, titleCase, deepClone
	} from '@/utils/index'
	/*
	** 引入函数
	** 生成html代码、包裹template标签、包裹script标签、包裹style标签
	 */
	import {
		makeUpHtml, vueTemplate, vueScript, cssStyle
	} from '@/components/generator/html'
	//生成js代码
	import {makeUpJs} from '@/components/generator/js'
	//生成css代码
	import {makeUpCss} from '@/components/generator/css'
	//默认渲染配置
	import drawingDefalut from '@/components/generator/drawingDefalut'
	import logo from '@/assets/logo.png'
	/*
	** 引入函数
	** 获取渲染列表、保存渲染列表、获取DOM ID、更新DOM ID、获取表单配置
	 */
	import {
		getDrawingList, saveDrawingList, getIdGlobal, saveIdGlobal
	} from '@/utils/db'
	//美化代码
	import loadBeautifier from '@/utils/loadBeautifier'
	import PreviewPane from "./PreviewPane";

	let beautifier
	const emptyActiveData = {style: {}, autosize: {}}
	//上一个活跃组件
	let oldActiveId
	//活跃的组件
	let tempActiveData
	//渲染数据列表
	const drawingListInDB = getDrawingList()
	//全局的DOM ID
	const idGlobal = getIdGlobal()

	export default {
		components: {
			PreviewPane,
			CodePane,
			draggable,//拖拽容器
			FormDrawer,//表单抽屉
			JsonDrawer,//json配置抽屉
			RightPanel,//属性面板
			CodeTypeDialog,//代码生成类型弹窗
			RenderItem//组件渲染
		},
		data() {
			return {
				logo,
				activeName: 'first',
				idGlobal,//全局ID，自增
				formConf: {},
				inputComponents,
				selectComponents,
				layoutComponents,
				labelWidth: 100,
				drawingList: drawingDefalut,
				drawingData: {},
				activeId: drawingDefalut[0].formId,
				drawerVisible: false,
				formData: {},
				dialogVisible: false,
				jsonDrawerVisible: false,
				isIframeLoaded: false,
				generateConf: null,
				showFileName: false,
				activeData: drawingDefalut[0],
				saveDrawingListDebounce: debounce(340, saveDrawingList),
				saveIdGlobalDebounce: debounce(340, saveIdGlobal),
				leftComponents: [
					{
						title: '输入型组件',
						list: inputComponents
					},
					{
						title: '选择型组件',
						list: selectComponents
					},
					{
						title: '布局型组件',
						list: layoutComponents
					}
				]
			}
		},
		computed: {},
		watch: {
			// eslint-disable-next-line func-names
			'activeData.__config__.label': function (val, oldVal) {
				if (
					this.activeData.placeholder === undefined
					|| !this.activeData.__config__.tag
					|| oldActiveId !== this.activeId
				) {
					return
				}
				this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val
			},
			activeId: {
				handler(val) {
					oldActiveId = val
				},
				immediate: true
			},
			drawingList: {
				handler(val) {
					this.saveDrawingListDebounce(val)
					if (val.length === 0) this.idGlobal = 100
				},
				deep: true
			},
			idGlobal: {
				handler(val) {
					this.saveIdGlobalDebounce(val)
				},
				immediate: true
			}
		},
		mounted() {
			//设置当前描绘数据为缓存或者默认的
			if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
				this.drawingList = drawingListInDB
			} else {
				this.drawingList = drawingDefalut
			}
			//设置激活的item组件
			this.activeFormItem(this.drawingList[0])
			//如果缓存了表单配置，更新
			// if (formConfInDB) {
			// 	this.formConf = formConfInDB
			// }
			loadBeautifier(btf => {
				beautifier = btf
			})
			const clipboard = new ClipboardJS('#copyNode', {
				text: trigger => {
					const codeStr = this.generateCode()
					this.$notify({
						title: '成功',
						message: '代码已复制到剪切板，可粘贴。',
						type: 'success'
					})
					return codeStr
				}
			})
			clipboard.on('error', e => {
				this.$message.error('代码复制失败')
			})
			this.AssembleFormData();
		},
		methods: {
			/**
			 * 根据组件配置的dataConsumer，动态追加属性和值到配置对象上
			 * @param obj 组件的配置对象
			 * @param strKeys 组件dataConsumer字段自定义的绑定key
			 * @param val 自定义key对应的值
			 */
			setObjectValueByStringKeys(obj, strKeys, val) {
				const arr = strKeys.split('.')
				arr.reduce((pre, item, i) => {
					if (arr.length === i + 1) {
						pre[item] = val
					} else if (Object.prototype.toString.call(pre[item]) !== '[Object Object]') {
						pre[item] = {}
					}
					return pre[item]
				}, obj)
			},
			/**
			 *  动态获取的数据后绑定到组件配置上，并且重新渲染组件
			 * @param component 组件的配置对象
			 * @param respData 远端返回数据
			 */
			setRespData(component, respData) {
				const {dataPath, renderKey, dataConsumer} = component.__config__
				if (!dataPath || !dataConsumer) return
				const data = dataPath.split('.').reduce((pre, item) => pre[item], respData)
				this.setObjectValueByStringKeys(component, dataConsumer, data)
				const i = this.drawingList.findIndex(item => item.__config__.renderKey === renderKey)
				if (i > -1) this.$set(this.drawingList, i, component)
			},
			/**
			 * 动态组件拉取配置
			 * 目前只有级联和表格，组件配置的dataType为dynamic
			 * @param component 组件的配置对象
			 */
			fetchData(component) {
				const {dataType, method, url} = component.__config__
				if (dataType === 'dynamic' && method && url) {
					this.setLoading(component, true)
					this.$axios({
						method,
						url
					}).then(resp => {
						this.setLoading(component, false)
						this.setRespData(component, resp.data)
					})
				}
			},
			/**
			 * 控制loading状态
			 * @param component 组件的配置对象
			 * @param val 布尔值
			 */
			setLoading(component, val) {
				const {directives} = component
				if (Array.isArray(directives)) {
					const t = directives.find(d => d.name === 'loading')
					if (t) t.value = val
				}
			},
			/**
			 * 更新激活的组件和ID
			 * @param currentItem 当前激活的组件配置
			 */
			activeFormItem(currentItem) {
				this.activeData = currentItem
				this.activeId = currentItem.__config__.formId
			},
			/**
			 * 拖拽完成后，如果来源不等于去向容器
			 * 拉取组件动态数据
			 * 更新激活组件和id为页面缓存的组件
			 * 拖拽会触发cloneComponent，将clone的插入目标容器
			 * @param obj
			 */
			onEnd(obj) {
				if (obj.from !== obj.to) {
					this.fetchData(tempActiveData)
					this.activeData = tempActiveData
					this.activeId = this.idGlobal
				}
			},
			/**
			 * 新增一个组件到描绘列表
			 * @param item 组件的配置对象
			 */
			addComponent(item) {
				const clone = this.cloneComponent(item)
				this.fetchData(clone)
				this.drawingList.push(clone)
				this.activeFormItem(clone)
			},
			/**
			 * 克隆一份组件配置，
			 * 分配组件ID和renderKey
			 * 并缓存到全局的tempActiveData
			 * @param origin 组件的配置对象
			 * @returns {*} 返回tempActiveData
			 */
			cloneComponent(origin) {
				const clone = deepClone(origin)
				const config = clone.__config__
				config.span = this.formConf.span // 生成代码时，会根据span做精简判断
				this.createIdAndKey(clone)
				clone.placeholder !== undefined && (clone.placeholder += config.label)
				tempActiveData = clone
				return tempActiveData
			},
			/**
			 *  添加组件的formId和renderKey配置
			 *  layout为col的添加__vModel__，row添加componentName
			 * @param item 组件的配置对象
			 * @returns {*}
			 */
			createIdAndKey(item) {
				const config = item.__config__
				config.formId = ++this.idGlobal
				config.renderKey = `${config.formId}${+new Date()}` // 改变renderKey后可以实现强制更新组件
				if (config.layout === 'colFormItem') {
					item.__vModel__ = `field${this.idGlobal}`
				} else if (config.layout === 'formLayout') {
					config.componentName = `${config.label}${this.idGlobal}`
					!Array.isArray(config.children) && (config.children = [])
				} else if (config.layout === 'rowFormItem') {
					config.componentName = `row${this.idGlobal}`
					!Array.isArray(config.children) && (config.children = [])
					delete config.label // rowFormItem无需配置label属性
				}
				if (Array.isArray(config.children)) {
					config.children = config.children.map(childItem => this.createIdAndKey(childItem))
				}
				return item
			},
			/**
			 * 组装formData数据
			 * @constructor
			 */
			AssembleFormData() {
				this.formData = {
					fields: deepClone(this.drawingList),
					...this.formConf
				}
			},
			/**
			 * 根据动作和生成类型执行（页面|弹窗）操作
			 * @param data
			 */
			generate(data) {
				const func = this[`exec${titleCase(this.operationType)}`]
				this.generateConf = data
				func && func(data)
			},
			/**
			 * 运行动作
			 * @param data
			 */
			execRun(data) {
				this.AssembleFormData();
				this.drawerVisible = true;
			},
			/**
			 * 导出动作
			 * @param data
			 */
			execDownload(data) {
				const codeStr = this.generateCode()
				const blob = new Blob([codeStr], {type: 'text/plain;charset=utf-8'})
				saveAs(blob, data.fileName)
			},
			/**
			 * 复制代码动作
			 * @param data
			 */
			execCopy(data) {
				document.getElementById('copyNode').click()
			},
			/**
			 * 清空
			 */
			empty() {
				this.$confirm('确定要清空所有组件吗？', '提示', {type: 'warning'}).then(
					() => {
						this.drawingList = []
						this.idGlobal = 100
					}
				)
			},
			/**
			 * 描绘复制组件
			 * @param item
			 * @param list
			 */
			drawingItemCopy(item, list) {
				let clone = deepClone(item)
				clone = this.createIdAndKey(clone)
				list.push(clone)
				this.activeFormItem(clone)
			},
			/**
			 * 描绘删除组件
			 * @param index
			 * @param list
			 */
			drawingItemDelete(index, list) {
				list.splice(index, 1)
				this.$nextTick(() => {
					const len = this.drawingList.length
					if (len) {
						this.activeFormItem(this.drawingList[len - 1])
					}
				})
			},
			/**
			 * 生成代码*****
			 * @returns {*}
			 */
			generateCode() {
				const {type} = this.generateConf
				this.AssembleFormData()
				const script = vueScript(makeUpJs(this.formData, type))
				const html = vueTemplate(makeUpHtml(this.formData, type))
				const css = cssStyle(makeUpCss(this.formData))
				return beautifier.html(html + script + css, beautifierConf.html)
			},
			/**
			 * 查看json
			 */
			showJson() {
				this.AssembleFormData()
				this.jsonDrawerVisible = true
			},
			/**
			 * 导出
			 */
			download() {
				this.dialogVisible = true
				this.showFileName = true
				this.operationType = 'download'
			},
			/**
			 * 运行
			 */
			run() {
				this.dialogVisible = true
				this.showFileName = false
				this.operationType = 'run'
			},
			/**
			 * 复制代码
			 */
			copy() {
				this.dialogVisible = true
				this.showFileName = false
				this.operationType = 'copy'
			},
			/**
			 * 组件属性变更
			 * @param newTag
			 */
			tagChange(newTag) {
				newTag = this.cloneComponent(newTag)
				const config = newTag.__config__
				newTag.__vModel__ = this.activeData.__vModel__
				config.formId = this.activeId
				config.span = this.activeData.__config__.span
				this.activeData.__config__.tag = config.tag
				this.activeData.__config__.tagIcon = config.tagIcon
				this.activeData.__config__.document = config.document
				if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
					config.defaultValue = this.activeData.__config__.defaultValue
				}
				Object.keys(newTag).forEach(key => {
					if (this.activeData[key] !== undefined) {
						newTag[key] = this.activeData[key]
					}
				})
				this.activeData = newTag
				this.updateDrawingList(newTag, this.drawingList)
			},
			/**
			 * 配置修改更新描绘列表
			 * @param newTag
			 * @param list
			 */
			updateDrawingList(newTag, list) {
				const index = list.findIndex(item => item.__config__.formId === this.activeId)
				if (index > -1) {
					list.splice(index, 1, newTag)
				} else {
					list.forEach(item => {
						if (Array.isArray(item.__config__.children)) this.updateDrawingList(newTag, item.__config__.children)
					})
				}
			},
			/**
			 * 刷新组件Json配置
			 * @param data
			 */
			refreshJson(data) {
				this.drawingList = deepClone(data.fields)
				delete data.fields
				this.formConf = data
			},
			handleTabClick(tab, event) {
				if (tab.name === 'second') {
					this.execRun();
				} else if (this.drawerVisible) {
					this.drawerVisible = false;
				}
			},
		}
	}
</script>


<style lang='scss'>
	@import '@/styles/home';
</style>
