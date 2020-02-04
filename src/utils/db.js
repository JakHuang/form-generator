const DRAWING_ITEMS = 'drawingItems'
const DRAWING_ID = 'idGlobal'
const TREE_NODE_ID = 'treeNodeId'
const FORM_CONF = 'formConf'

export function getDrawingList() {
  const str = localStorage.getItem(DRAWING_ITEMS)
  if (str) return JSON.parse(str)
  return null
}

export function saveDrawingList(list) {
  localStorage.setItem(DRAWING_ITEMS, JSON.stringify(list))
}

export function getIdGlobal() {
  const str = localStorage.getItem(DRAWING_ID)
  if (str) return parseInt(str, 10)
  return 100
}

export function saveIdGlobal(id) {
  localStorage.setItem(DRAWING_ID, `${id}`)
}

export function getTreeNodeId() {
  const str = localStorage.getItem(TREE_NODE_ID)
  if (str) return parseInt(str, 10)
  return 100
}

export function saveTreeNodeId(id) {
  localStorage.setItem(TREE_NODE_ID, `${id}`)
}

export function getFormConf() {
  const str = localStorage.getItem(FORM_CONF)
  if (str) return JSON.parse(str)
  return null
}

export function saveFormConf(obj) {
  localStorage.setItem(FORM_CONF, JSON.stringify(obj))
}
