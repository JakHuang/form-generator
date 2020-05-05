## 简介
Element UI表单设计及代码生成器，可将生成的代码直接运行在基于Element的vue项目中；也可导出JSON表单，使用配套的解析器将JSON解析成真实的表单。 
- [github pages地址](https://jakhuang.github.io/form-generator)
- [gitee pages地址 较快](https://mrhj.gitee.io/form-generator)
- [github仓库](https://github.com/JakHuang/form-generator)
- [码云仓库](https://gitee.com/mrhj/form-generator)
- [配套vscode插件](https://github.com/JakHuang/form-generator-plugin)
- [配套JSON解析器](https://github.com/JakHuang/form-generator/blob/dev/src/components/parser/example/Index.vue)

![image](https://ae01.alicdn.com/kf/U51bfb661aba945b48a4c71774421d414C.gif)

## 特点
- 可视化设计表单
- 一键生成原生的vue单页表单代码，100%拓展性
- 在线编辑器修改生成的代码，并实时预览
- 表单栅格化布局
- 支持表单校验
- 快速查阅Element UI官方文档
- 配套vscode插件
- 配套JSON解析器

## JSON解析器
将保存在数据库中的JSON表单，解析成真实的表单  
[查看在线示例](https://mrhj.gitee.io/form-generator/#/parser) 
```
// 安装
npm i form-gen-parser
```
[更多信息](https://github.com/JakHuang/form-generator/tree/dev/src/components/parser/README.md) 

## vscode插件
帮助使用element UI的开发者完成基本的表单代码搭建任务，减少重复的劳动。  
vscode-plugin分支配套插件为：[form-generator-plugin](https://github.com/JakHuang/form-generator-plugin)；  
使用插件可右键打开设计器，直接将代码保存到工程中。  
安装插件请在vscode中搜索：
>jakHuang   
或  
Form Generator Plugin


## 文档
- [el-dialog的封装与调用](https://github.com/JakHuang/form-generator/wiki/el-dialog%E7%9A%84%E5%B0%81%E8%A3%85%E4%B8%8E%E8%B0%83%E7%94%A8)
- [项目主要结构分析](https://github.com/JakHuang/form-generator/wiki/%E9%A1%B9%E7%9B%AE%E4%B8%BB%E8%A6%81%E7%BB%93%E6%9E%84%E5%88%86%E6%9E%90)
- [【常见问题】如何以npm的方式集成monaco编辑器](https://github.com/JakHuang/monaco-vue-demo)
- 系列教程：
[《表单设计器 · 开发教程》](https://github.com/JakHuang/form-generator/issues/30)
[《表单解析器 · 开发教程》](https://github.com/JakHuang/form-generator/issues/32)
[《vue代码生成器 · 开发教程》](https://github.com/JakHuang/form-generator/issues/31)
[《vue代码预览器 · 开发教程》](https://github.com/JakHuang/form-generator/issues/33)

## 运行
- 确保已经安装node.js 10+
- 首次下载项目后，安装项目依赖：
```
yarn
```
或
```
npm install
```
- 本地开发
```
npm run dev
```
- 构建
```
npm run build
```

## 交流
- QQ群 976154366

## 开发计划
详见 [**迭代计划**](https://github.com/JakHuang/form-generator/projects/2)  
欢迎提交PR

## PR鸣谢
- [IWANABETHATGUY](https://github.com/IWANABETHATGUY)

## 捐赠
#### 如果您觉得本项目对您有帮助，可以请作者喝一杯咖啡, 让开源走的更远，感谢支持。  
#### 也请您在捐赠后，加下qq群：976154366，私聊群主留个赞助链接。
<img src="https://ae01.alicdn.com/kf/H50d81220a202490f961878f42ed1a636i.jpg">

## 开源协议
[MIT](https://opensource.org/licenses/MIT)
