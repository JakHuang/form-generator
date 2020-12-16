<template>
	<div style="height:100%">
		<el-row style="height:100%;overflow:auto">
			<iframe
					v-show="isIframeLoaded"
					ref="previewPage"
					class="result-wrapper"
					frameborder="0"
					src="preview.html"
					@load="iframeLoad"
			/>
			<div v-show="!isIframeLoaded" v-loading="true" class="result-wrapper"/>
		</el-row>
	</div>
</template>
<script>
	import {parse} from '@babel/parser'
	import {
		makeUpHtml, vueTemplate, vueScript, cssStyle
	} from '@/components/generator/html'
	import {makeUpJs} from '@/components/generator/js'
	import {makeUpCss} from '@/components/generator/css'
	import {exportDefault, beautifierConf} from '@/utils/index'
	import loadMonaco from '@/utils/loadMonaco'
	import loadBeautifier from '@/utils/loadBeautifier'

	const editorObj = {
		html: null,
		js: null,
		css: null
	}
	const mode = {
		html: 'html',
		js: 'javascript',
		css: 'css'
	}
	let beautifier
	let monaco

	export default {
		props: ['formData'],
		data() {
			return {
				htmlCode: '',
				jsCode: '',
				cssCode: '',
				isIframeLoaded: false,
				isInitcode: false, // 保证open后两个异步只执行一次runcode
				isRefreshCode: false, // 每次打开都需要重新刷新代码
				monaco: null
			}
		},
		mounted() {
			this.onOpen();
		},
		methods: {
			onOpen() {
				this.htmlCode = makeUpHtml(this.formData, 'file')
				this.jsCode = makeUpJs(this.formData, 'file')
				this.cssCode = makeUpCss(this.formData)

				loadBeautifier(btf => {
					beautifier = btf
					this.htmlCode = beautifier.html(this.htmlCode, beautifierConf.html)
					this.jsCode = beautifier.js(this.jsCode, beautifierConf.js)
					this.cssCode = beautifier.css(this.cssCode, beautifierConf.html)
				})
			},
			iframeLoad() {
				if (!this.isInitcode) {
					this.isIframeLoaded = true
					this.isRefreshCode && (this.isInitcode = true) && this.runCode()
				}
			},
			setEditorValue(id, type, codeStr) {
				editorObj[type] = monaco.editor.create(document.getElementById(id), {
					value: codeStr,
					theme: 'vs-dark',
					language: mode[type],
					automaticLayout: true
				})
			},
			runCode() {
				const jsCodeStr = this.jsCode;
				try {
					const ast = parse(jsCodeStr, {sourceType: 'module'})
					const astBody = ast.program.body
					if (astBody.length > 1) {
						this.$confirm(
							'js格式不能识别，仅支持修改export default的对象内容',
							'提示',
							{
								type: 'warning'
							}
						)
						return
					}
					if (astBody[0].type === 'ExportDefaultDeclaration') {
						const postData = {
							type: 'refreshFrame',
							data: {
								generateConf: this.generateConf,
								html: this.htmlCode,
								js: jsCodeStr.replace(exportDefault, ''),
								css: this.cssCode,
							}
						}

						this.$refs.previewPage.contentWindow.postMessage(
							postData,
							location.origin
						)
					} else {
						this.$message.error('请使用export default')
					}
				} catch (err) {
					this.$message.error(`js错误：${err}`)
					console.error(err)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/styles/mixin.scss';

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

	.setting {
		position: absolute;
		right: 15px;
		top: 3px;
		color: #a9f122;
		font-size: 18px;
		cursor: pointer;
		z-index: 1;
	}

	.right-preview {
		height: 100%;

		.result-wrapper {
			height: calc(100vh - 33px);
			width: 100%;
			overflow: auto;
			padding: 12px;
			box-sizing: border-box;
		}
	}

	@include action-bar;
	::v-deep .el-drawer__header {
		display: none;
	}
</style>
