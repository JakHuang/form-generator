<template>
	<div style="height:100%;text-align:initial">
		<el-row style="height:100%;overflow:auto">
			<el-tabs v-model="activeTab" type="card" class="editor-tabs">
				<el-tab-pane name="html">
                <span slot="label">
                  <i v-if="activeTab==='html'" class="el-icon-edit"/>
                  <i v-else class="el-icon-document"/>
                  template
                </span>
				</el-tab-pane>
				<el-tab-pane name="js">
                <span slot="label">
                  <i v-if="activeTab==='js'" class="el-icon-edit"/>
                  <i v-else class="el-icon-document"/>
                  script
                </span>
				</el-tab-pane>
				<el-tab-pane name="css">
                <span slot="label">
                  <i v-if="activeTab==='css'" class="el-icon-edit"/>
                  <i v-else class="el-icon-document"/>
                  css
                </span>
				</el-tab-pane>
			</el-tabs>
			<div v-show="activeTab==='html'" id="editorHtml" class="tab-editor"/>
			<div v-show="activeTab==='js'" id="editorJs" class="tab-editor"/>
			<div v-show="activeTab==='css'" id="editorCss" class="tab-editor"/>
		</el-row>
	</div>
</template>
<script>
	import {makeUpHtml} from '@/components/generator/html'
	import {makeUpJs} from '@/components/generator/js'
	import {makeUpCss} from '@/components/generator/css'
	import {beautifierConf} from '@/utils/index'
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
				activeTab: 'html',
				htmlCode: '',
				jsCode: '',
				cssCode: '',
				scripts: [],
				links: [],
			}
		},
		mounted() {
			window.addEventListener('keydown', this.preventDefaultSave);
			this.onOpen();
		},
		beforeDestroy() {
			window.removeEventListener('keydown', this.preventDefaultSave)
		},
		methods: {
			preventDefaultSave(e) {
				if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
					e.preventDefault()
				}
			},
			onOpen() {
				this.htmlCode = makeUpHtml(this.formData, 'file')
				this.jsCode = makeUpJs(this.formData, 'file')
				this.cssCode = makeUpCss(this.formData)

				loadBeautifier(btf => {
					beautifier = btf
					this.htmlCode = beautifier.html(this.htmlCode, beautifierConf.html)
					this.jsCode = beautifier.js(this.jsCode, beautifierConf.js)
					this.cssCode = beautifier.css(this.cssCode, beautifierConf.html)

					loadMonaco(val => {
						monaco = val
						this.setEditorValue('editorHtml', 'html', this.htmlCode)
						this.setEditorValue('editorJs', 'js', this.jsCode)
						this.setEditorValue('editorCss', 'css', this.cssCode)
					})
				})
			},
			setEditorValue(id, type, codeStr) {
				editorObj[type] = monaco.editor.create(document.getElementById(id), {
					value: codeStr,
					theme: 'vs-dark',
					language: mode[type],
					automaticLayout: true
				})
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
