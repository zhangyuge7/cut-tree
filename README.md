# 快速开始

```shell
npm install cut-tree
```

方式一：

```javascript
import { listToTree } from 'cut-tree'

const listData = [
    {"label":"1","id":1,"pid":null},
    {"label":"2","id":2,"pid":null},
    {"label":"3","id":3,"pid":null},
    {"label":"4","id":4,"pid":null},
    {"label":"3-1","id":5,"pid":3},
    {"label":"2-1","id":6,"pid":2},
    {"label":"4-1-1","id":7,"pid":8},
    {"label":"4-1","id":8,"pid":4},
    {"label":"1-2","id":9,"pid":1},
    {"label":"1-1","id":10,"pid":1},
    {"label":"1-2-1","id":11,"pid":9},
    {"label":"3-1-2","id":12,"pid":5},
    {"label":"3-1-1","id":13,"pid":5},
    {"label":"4-2","id":14,"pid":4},
    {"label":"2-2","id":15,"pid":2}
]

const config = { id: 'id', parentId: 'pid', children: 'children' }

const trees = listToTree(listData, config)

```

方式二：

```javascript
import useTreeUtil from 'cut-tree'

const config = { id: 'id', parentId: 'pid', children: 'children' }

const { listToTree } = useTreeUtil(config)

const trees = listToTree(listData)
```



说明：方式一与方式二所有函数同步，实现方式也一样。如果使用频繁建议使用方式二，可以省略每次传入配置参数。



# 构建类

## 列表转树

listToTree(list: Array,config: Object): Array

参数：

    list    列表数据。必须符合构建树结构的规则（有 id 与 parentId 的关联关系）
    
    config  映射配置。树结构三要素的字段映射关系，映射配置。示例 {id: 'id',parentId: 'parentId',children: 'children'}。

返回值：

    树结构数据列表

## 树转列表

treeToList(trees: Array,config: Object): Array

参数：

    trees   树结构数据列表。
    
    config  映射配置。示例 {children: 'children'}。

返回值：

    数据列表



# 遍历类

## 遍历所有节点

forEach(trees: Array,config: Object,callback: Function,setting?: Object): void

参数：

    trees   树结构数据列表。
    
    config  映射配置。示例 {children: 'children'}。
    
    callback    回调函数。回调参数 (node 节点对象, index 节点索引, lv 层级)。

    setting 扩展设置。setting.rever: Boolean（true->从叶子节点开始遍历）

返回值：

    无

## 遍历所有节点(增强版)

foreach(trees: Array,config: Object,callback: Function): void

参数：

    trees 树结构数据列表
    
    config 配置 示例：{children: 'children'}
    
    callback 回调函数 回调参数 (node 节点对象, index 节点索引, lv 层级, parent 父级节点, root 根节点)

    setting 扩展设置。setting.rever: Boolean（true->从叶子节点开始遍历）

返回值：

    无

说明：

    回调函数中 return 0 可停止遍历




# 查询类

## 过滤节点

filter(trees: Array,config: Object,callback: Function): Array

参数：

    trees   树结构数据列表。
    
    config  映射配置。示例 {children: 'children'}。
    
    callback    回调函数。回调参数 (node 节点对象)。需要返回布尔类型。

返回值：

    满足条件的节点，没有则返回空数组。

说明：

    通过回调函数返回的布尔类型判断节点是否满足条件，true 满足；false 不满足。
    
    返回的数据保持树状结构，满足条件的节点及其祖先，与树UI组件的过滤效果一样。


## 查找首个满足条件的节点

find(trees: Array,config: Object,callback: Function): Object

参数：

    trees   树结构数据列表。
    
    config  映射配置。示例 {children: 'children'}。
    
    callback    回调函数。回调参数 (node 节点对象)。需要返回布尔类型。

返回值：

    首个满足条件的节点对象，没有则返回 null


## 查找所有满足条件的节点

findAll(trees: Array,config: Object,callback: Function): Array

参数：

    trees   树结构数据列表。
    
    config  映射配置。示例 {children: 'children'}。
    
    callback    回调函数。回调参数 (node 节点对象)。需要返回布尔类型。

返回值：

    所有满足条件的节点，没有则返回空数组


## 根据 ID 查询其节点的根节点

getRootById(trees: Array, config: Object, idValue: any): Object

参数：

    trees 树结构数据列表
    
    config 配置 示例：{id: 'id', children: 'children'} 
    
    idValue id值

返回值：

    id对应节点的父节点，没有则返回 null


## 根据 ID 查询其节点的祖籍节点列表（包含自身节点）

getAncestorsById(trees: Array, config: Object, idValue: any): Array

参数：

    trees 树结构数据列表
    
    config 配置 示例：{id: 'id', children: 'children'} 
    
    idValue id值

返回值：

    节点列表

## 获取全部节点祖籍
getAncestors(trees: Array,config: Object): Object

参数：

    trees 树结构数据列表
    
    config 配置 示例：{id: 'id', children: 'children'} 

返回值：

    [{id: [root, ..., parent2, parent1, node]}, ...]


## 查找所有叶子节点

getLeafs(trees: Array, config: Object): Array

参数：

    trees 树结构数据列表
    
    config 配置 示例：{children: 'children'} 

返回值：

    叶子节点列表

说明：

    所有 children 字段为空或空数组的节点都为叶子节点




# 操作类

## 插入节点

insertNode(trees: Array,config: Object,node: Object,targetNodeId: any): void

参数：

    trees 树结构数据列表
    
    config 配置 示例：{id: 'id',children: 'children'[,parentId:'parentId']} 
    
    node 需要插入的节点
    
    [targetNodeId 插入目标节点的id]

返回值：

    无

说明：

    targetNodeId 与 config.parentId 必传其一，targetNodeId 优先级比 node[config.parentId] 更高。



## 修改节点

updateNode(trees: Array,config: Object,node: Object): void

参数：

    trees 树结构数据列表
    
    config 配置 示例：{id: 'id',children: 'children'[, parentId: 'parentId']}
    
    node 需要修改的节点

返回值：

    无

说明：

    根据 node 的id查找到对应的节点，然后将node的所有属性赋值给对应的节点。
    
    节点位置会随 parentId 变更。


## 保存节点(根据节点id判断，有则修改，没有则插入)

saveNode(trees: Array,config: Object,node: Object): void

参数：

    trees 树结构数据列表
    
    config 配置 示例：{id: 'id',children: 'children'[, parentId: 'parentId']}
    
    node 需要插入/修改的节点

返回值：

    无


## 移除节点
removeNode(trees: Array,config: Object,targetNodeId: any): void

参数：

    trees 树结构数据列表
    
    config 配置 示例：{id: 'id',children: 'children'} 
    
    targetNodeId 需要删除的节点的 id

返回值：

    无


## 排序
sort(trees: Array,config: Object,callback: Function): void

参数：

    trees 树结构数据列表
    
    config 配置 示例：{children: 'children'} 
    
    callback 回调函数。参数为(节点对象1,节点对象2)，需要数字类型，底层使用数组的 sort 函数。

返回值：

    无

说明：

    如果非必要，建议列表转树前排序。


# 版本说明

## 1.0.0：
    新增获取所有节点祖籍函数
    遍历函数 (forEach, foreach) 新增扩展设置参数，支持从叶子节点开始遍历
    getAncestors不存在问题修复