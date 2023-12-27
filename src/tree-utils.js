function insertSonList2ChildAttribute(item, parentIdAndObjListMap, config) {
    const { id, children } = config
    const tempObjList = parentIdAndObjListMap[String(item[id])];
    if (tempObjList) {
        if (!item[children]) {
            item[children] = []
        }
        item[children].push(...tempObjList)
        tempObjList.forEach(tempObj => insertSonList2ChildAttribute(tempObj, parentIdAndObjListMap, config))
    }
}

function list2Tree(list, config, rootParentValue) {
    const { id, parentId } = config
    const resultList = []
    const parentIdAndObjListMap = {}
    list.forEach(item => {
        if (item && (item[id] || item[id] === 0)) {
            if (rootParentValue === String(item[parentId])) {
                resultList.push(item);
            } else {
                if (!parentIdAndObjListMap[String(item[parentId])]) {
                    parentIdAndObjListMap[String(item[parentId])] = []
                }
                const tempList = parentIdAndObjListMap[String(item[parentId])]
                tempList.push(item);
            }
        }
    })

    resultList.forEach(item => insertSonList2ChildAttribute(item, parentIdAndObjListMap, config));
    return resultList;
}

/**
 * 列表转树
 * @param {Object[]} list 列表数据
 * @param {Object?} config 配置 {id:'id',parentId: 'parentId',children: 'children'}
 * @returns{Object[]} 树结构数据列表
 */
export function listToTree(list, config = { id: 'id', parentId: 'parentId', children: 'children' }) {
    if (!list?.length) {
        return list
    }
    const { id, parentId } = config
    // 查找所有根节点的父级值
    const idList = new Set(list.map(item => String(item[id])))
    const rootParentValueList = new Set(list.map(item => String(item[parentId])).filter(item => !idList.has(item)))
    const ts = []
    rootParentValueList.forEach(rootParentValue =>
        ts.push(...list2Tree(list, config, rootParentValue))
    );
    return ts
}

/**
 * 遍历所有节点
 * @param {Object[]} trees 树结构数据列表
 * @param {Object} config 配置 示例：{children: 'children'}
 * @param {Function} callback 回调函数 回调参数 (node 节点对象, index 节点索引, lv 层级)
 * @param {Object} setting 扩展设置。setting.rever: Boolean（从叶子节点开始遍历）
 */
export function forEach(trees, config, callback,setting) {
    const { children } = config
    let i = 0, l = 1
    function _forEach(_trees) {
        _trees.forEach(item => {
            !setting?.rever && callback(item, i++, l)
            if (item[children]?.length) {
                l++
                _forEach(item[children])
                l--
            }
            setting?.rever && callback(item, i++, l)
        })
    }
    _forEach(trees)
}

/**
 * 功能更强的遍历。return 0 可中断遍历
 * @param {Object[]} trees 树结构数据列表
 * @param {Object} config 配置 示例：{children: 'children'}
 * @param {Function} callback 回调函数 回调参数 (node 节点对象, index 节点索引, lv 层级, parent 父级节点, root 根节点)
 * @param {Object} setting 扩展设置。setting.rever: Boolean（true->从叶子节点开始遍历）
 */
export function foreach(trees, config, callback,setting) {
    const { children } = config
    let breakFlag, i = 0, l = 1

    function _foreach(node, parent, root) {
        if (breakFlag === 0) return
        if(!setting?.rever)
            breakFlag = callback(node, i++, l, parent, root)
        if (node[children]?.length) {
            l++
            for (let index = 0; index < node[children].length; index++) {
                _foreach(node[children][index], node, root)
            }
            l--
        }
        if(setting?.rever)
            breakFlag = callback(node, i++, l, parent, root)
    }

    for (let index = 0; index < trees.length; index++) {
        if (breakFlag === 0) return
        _foreach(trees[index], null, trees[index])
    }
}

/**
 * 树转列表
 * @param {Object[]} trees 树结构数据列表
 * @param {Object} config 配置 示例：{children: 'children'}
 * @returns{Object[]} 数据列表
 */
export function treeToList(trees, config = { children: 'children' }) {
    if (!trees?.length) {
        return trees
    }
    const list = []
    forEach(trees, config, item => {
        list.push(item)
    })
    return list
}


/**
 * 过滤节点
 * @param {Object[]} trees 树结构数据列表
 * @param {Object} config 配置 示例：{children: 'children'}
 * @param {Function} callback 回调函数 参数为节点对象，需要返回布尔类型
 * @returns {Object[]} 满足条件的节点（包含祖先，保持树状结构，与UI树组件的过滤效果相同），没有则返回空数组
 */
export function filter(trees, config, callback) {
    const { children } = config

    function _filterTree(node) {
        const nodeChildren = node[children]
        if (callback(node)) {
            const result = { ...node }
            result[children] = nodeChildren?.length ? nodeChildren.map(child => _filterTree(child)).filter(Boolean) : nodeChildren
            return result
        }

        let filteredChildren = []
        if (nodeChildren?.length) {
            filteredChildren = nodeChildren
                .map(child => _filterTree(child))
                .filter(Boolean)
        }

        if (filteredChildren.length) {
            const result = { ...node }
            result[children] = filteredChildren
            return result
        }

        return null
    }

    return trees.map(root => _filterTree(root)).filter(Boolean)
}
/**
 * 查找首个满足条件的节点
 * @param {Object[]} trees 树结构数据列表
 * @param {Object} config 配置 示例：{children: 'children'}
 * @param {Function} callback 回调函数 参数为节点对象，需要返回布尔类型
 * @returns {Object} 首个满足条件的节点对象，没有则返回 null
 */
export function find(trees, config, callback) {
    let node = null
    foreach(trees, config, item => {
        if (callback(item)) {
            node = item
            return 0
        }
    })
    return node
}

/**
 * 查找所有满足条件的节点
 * @param {Object[]} trees 树结构数据列表
 * @param {Object} config 配置 示例：{children: 'children'}
 * @param {Function} callback 回调函数 参数为节点对象，需要返回布尔类型
 * @returns {Object[]} 所有满足条件的节点，没有则返回空数组
 */
export function findAll(trees, config, callback) {
    const nodes = []
    forEach(trees, config, item => {
        if (callback(item)) {
            nodes.push(item)
        }
    })
    return nodes
}

/**
 * 根据 ID 查询其节点的根节点
 * @param {Object[]} trees 树结构数据列表
 * @param {Object} config 配置 示例：{id: 'id', children: 'children'} 
 * @param {*} idValue id值
 * @returns{Object} id对应节点的根节点，没有则返回 null
 */
export function getRootById(trees, config, idValue) {
    let rootNode = null
    foreach(trees, config, (node, i, l, parent, root) => {
        if (node[config.id] === idValue) {
            rootNode = root
            return 0
        }
    })
    return rootNode
}

/**
 * 根据 ID 查询其节点的父级节点
 * @param {Object[]} trees 树结构数据列表
 * @param {Object} config 配置 示例：{id: 'id', children: 'children'} 
 * @param {*} idValue id值
 * @returns {Object} id对应节点的父节点，没有则返回 null
 */
export function getParentById(trees, config, idValue) {
    const { id, children } = config
    function _parent(_trees, parent) {
        for (let index = 0; index < _trees.length; index++) {
            const node = _trees[index];
            if (node[id] === idValue) return parent
            if (node[children]?.length) {
                const parentNode = _parent(node[children], node)
                if (parentNode) return parentNode
            }
        }
        return null
    }
    return _parent(trees, null)
}

/**
 * 根据 ID 查询其节点的祖籍节点列表（包含自身节点）
 * @param {Object[]} trees 树结构数据列表
 * @param {Object} config 配置 示例：{id: 'id', children: 'children'} 
 * @param {*} idValue id值
 * @returns 节点列表
 */
export function getAncestorsById(trees, config, idValue) {
    const filters = filter(trees, config, node => node[config.id] === idValue)
    if (!filters?.length) return []
    if (filters.length !== 1) {
        console.warn('tree-utils --> getAncestorsById warn message: The id may not be unique')
    }
    return treeToList(filters, config)
}

/**
 * 查找所有叶子节点，所有 children 字段为空或空数组的节点都为叶子节点
 * @param {Object[]} trees 树结构数据列表
 * @param {Object} config 配置 示例：{children: 'children'} 
 * @returns {Object[]} 叶子节点列表
 */
export function getLeafs(trees, config) {
    const { children } = config
    const leafs = []
    forEach(trees, config, node => {
        if (!node[children]?.length) {
            leafs.push(node)
        }
    })
    return leafs
}

/**
 * 插入新的节点
 * @param {Object[]} trees 树结构数据列表
 * @param {Object} config 配置 示例：{id: 'id',children: 'children'[,parentId:'parentId']}
 * @param {Object} node 需要插入的节点
 * @param {?*} targetNodeId 插入到目标节点的id（可选）
 */
export function insertNode(trees, config, node, targetNodeId = node[config.parentId]) {
    const targetNode = find(trees, config, item => item[config.id] === targetNodeId)
    if (targetNode) {
        if (targetNode[config.children]) {
            targetNode[config.children].push(node)
        } else {
            targetNode[config.children] = [node]
        }
    } else {
        trees.push(node)
    }
}

/**
 * 修改节点信息
 * @param {Object[]} trees 树结构数据列表
 * @param {Object} config 配置 示例：{id: 'id',children: 'children'[, parentId: 'parentId']}
 * @param {Object} node 需要修改的节点
 */
export function updateNode(trees, config, node) {
    const targetNode = find(trees, config, item => item[config.id] === node[config.id])
    if (!targetNode) {
        console.warn('tree-utils --> updateNode warn message: Target node not found')
        return
    }
    if (config.parentId && targetNode[config.parentId] !== node[config.parentId]) {
        removeNode(trees, config, targetNode[config.id])
        Object.keys(node).forEach(key => {
            targetNode[key] = node[key]
        })
        insertNode(trees, config, targetNode)
    } else {
        Object.keys(node).forEach(key => {
            targetNode[key] = node[key]
        })
    }
}

/**
 * 保存节点(根据节点id判断，有则修改，没有则插入)
 * @param {Object[]} trees 树结构数据列表
 * @param {Object} config 配置 示例：{id: 'id',children: 'children'[, parentId: 'parentId']}
 * @param {Object} node 需要插入/修改的节点
 */
export function saveNode(trees, config, node) {
    const targetNode = find(trees, config, item => item[config.id] === node[config.id])
    if (targetNode) {
        updateNode(trees, config, node)
    } else {
        insertNode(trees, config, node)
    }
}

/**
 * 移除节点
 * @param {Object[]} trees 树结构数据列表
 * @param {Object} config 配置 示例：{id: 'id',children: 'children'}
 * @param {*} targetNodeId 需要删除的节点的 id
 */
export function removeNode(trees, config, targetNodeId) {
    let childrenNodes
    if (trees.find(node => node[config.id] === targetNodeId)) {
        childrenNodes = trees
    } else {
        const parentNode = getParentById(trees, config, targetNodeId)
        if (parentNode) {
            childrenNodes = parentNode[config.children]
        }
    }
    if (childrenNodes?.length) {
        let targetIndex
        for (let index = 0; index < childrenNodes.length; index++) {
            if (childrenNodes[index][config.id] === targetNodeId) {
                targetIndex = index
                break
            }
        }
        childrenNodes.splice(targetIndex, 1)
    }
}

/**
 * 排序（如果非必要，建议列表转树前排序）
 * @param {Object[]} trees 树结构数据列表
 * @param {Object} config 配置 示例：{children: 'children'}
 * @param {Function} callback 回调函数。参数为(节点对象1,节点对象2)，需要数字类型
 */
export function sort(trees,config,callback){
    function _sort(_trees){
        _trees.forEach(node=>{
            if(node[config.children]?.length){
                _sort(node[config.children])
            }else{
                return
            }
            node[config.children].sort(callback)
        })
    }
    _sort(trees)
    trees.sort(callback)
}

/**
 * 获取全部节点祖籍
 * @param {*[]} trees 树结构数据列表
 * @param {*} config 配置 示例：{id:'id', children: 'children'}
 * @returns {Object} [{id: [root, ..., parent2, parent1, node]}]
 */
export function getAncestors(trees,config){
    const result = {}
    foreach(trees,config,(route,i,l,parent)=>{
        if(parent){
            result[route[config.id]] = [...result[parent[config.id]],route]
        }else{
            result[route[config.id]] = [route]
        }
    })
    return result
}
