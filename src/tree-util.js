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

export function useTreeUtil(config = { id: 'id', parentId: 'parentId', children: 'children' }) {
    const idField = config.id
    const pidField = config.parentId
    const childrenField = config.children

    /**
     * 列表转树
     * @param {Object[]} list 列表数据
     * @returns{Object[]} 树结构数据列表
     */
    function listToTree(list) {
        if (!list?.length) {
            return list
        }
        // 查找所有根节点的父级值
        const idList = new Set(list.map(item => String(item[idField])))
        const rootParentValueList = new Set(list.map(item => String(item[pidField])).filter(item => !idList.has(item)))
        const ts = []
        rootParentValueList.forEach(rootParentValue =>
            ts.push(...list2Tree(list, config, rootParentValue))
        );
        return ts
    }
    /**
     * 遍历所有节点
     * @param {Object[]} trees 树结构数据列表
     * @param {Function} callback 回调函数 回调参数 (node 节点对象, index 节点索引, lv 层级)
     * @param {Object} setting 扩展设置。setting.rever: Boolean（从叶子节点开始遍历）
     */
    function forEach(trees, callback, setting) {
        let i = 0, l = 1
        function _forEach(_trees) {
            _trees.forEach(item => {
                !setting?.rever && callback(item, i++, l)
                if (item[childrenField]?.length) {
                    l++
                    _forEach(item[childrenField])
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
     * @param {Function} callback 回调函数 回调参数 (node 节点对象, index 节点索引, lv 层级, parent 父级节点, root 根节点)
     * @param {Object} setting 扩展设置。setting.rever: Boolean（true->从叶子节点开始遍历）
     */
    function foreach(trees, callback, setting) {
        let breakFlag, i = 0, l = 1
        function _foreach(node, parent, root) {
            if (breakFlag === 0) return
            if (!setting?.rever)
                breakFlag = callback(node, i++, l, parent, root)
            if (node[childrenField]?.length) {
                l++
                for (let index = 0; index < node[childrenField].length; index++) {
                    _foreach(node[childrenField][index], node, root)
                }
                l--
            }
            if (setting?.rever)
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
     * @returns{Object[]} 数据列表
     */
    function treeToList(trees) {
        if (!trees?.length) {
            return trees
        }
        const list = []
        forEach(trees, item => {
            list.push(item)
        })
        return list
    }

    /**
     * 过滤节点
     * @param {Object[]} trees 树结构数据列表
     * @param {Function} callback 回调函数 参数为节点对象，需要返回布尔类型
     * @returns {Object[]} 满足条件的节点（包含祖先，保持树状结构，与UI树组件的过滤效果相同），没有则返回空数组
     */
    function filter(trees, callback) {
        function _filterTree(node) {
            const nodeChildren = node[childrenField]
            if (callback(node)) {
                const result = { ...node }
                result[childrenField] = nodeChildren?.length ? nodeChildren.map(child => _filterTree(child)).filter(Boolean) : nodeChildren
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
                result[childrenField] = filteredChildren
                return result
            }

            return null
        }

        return trees.map(root => _filterTree(root)).filter(Boolean)
    }

    /**
     * 查找首个满足条件的节点
     * @param {Object[]} trees 树结构数据列表
     * @param {Function} callback 回调函数 参数为节点对象，需要返回布尔类型
     * @returns {Object} 首个满足条件的节点对象，没有则返回 null
     */
    function find(trees, callback) {
        let node = null
        foreach(trees, item => {
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
     * @param {Function} callback 回调函数 参数为节点对象，需要返回布尔类型
     * @returns {Object[]} 所有满足条件的节点，没有则返回空数组
     */
    function findAll(trees, callback) {
        const nodes = []
        forEach(trees, item => {
            if (callback(item)) {
                nodes.push(item)
            }
        })
        return nodes
    }

    /**
     * 根据 ID 查询其节点的根节点
     * @param {Object[]} trees 树结构数据列表
     * @param {*} idValue id值
     * @returns{Object} id对应节点的根节点，没有则返回 null
     */
    function getRootById(trees, idValue) {
        let rootNode = null
        foreach(trees, (node, i, l, parent, root) => {
            if (node[idField] === idValue) {
                rootNode = root
                return 0
            }
        })
        return rootNode
    }


    /**
     * 根据 ID 查询其节点的父级节点
     * @param {Object[]} trees 树结构数据列表
     * @param {*} idValue id值
     * @returns {Object} id对应节点的父节点，没有则返回 null
     */
    function getParentById(trees, idValue) {
        function _parent(_trees, parent) {
            for (let index = 0; index < _trees.length; index++) {
                const node = _trees[index];
                if (node[idField] === idValue) return parent
                if (node[childrenField]?.length) {
                    const parentNode = _parent(node[childrenField], node)
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
     * @param {*} idValue id值
     * @returns 节点列表
     */
    function getAncestorsById(trees, idValue) {
        const filters = filter(trees, node => node[idField] === idValue)
        if (!filters?.length) return []
        if (filters.length !== 1) {
            console.warn('tree-util --> getAncestorsById warn message: The id may not be unique')
        }
        return treeToList(filters)
    }

    /**
     * 查找所有叶子节点，所有 children 字段为空或空数组的节点都为叶子节点
     * @param {Object[]} trees 树结构数据列表
     * @returns {Object[]} 叶子节点列表
     */
    function getLeafs(trees) {
        const leafs = []
        forEach(trees, node => {
            if (!node[childrenField]?.length) {
                leafs.push(node)
            }
        })
        return leafs
    }

    /**
     * 插入新的节点
     * @param {Object[]} trees 树结构数据列表
     * @param {Object} node 需要插入的节点
     * @param {?*} targetNodeId 插入目标节点的id(可选)
     */
    function insertNode(trees, node, targetNodeId = node[pidField]) {
        const targetNode = find(trees, item => item[idField] === targetNodeId)
        if (targetNode) {
            if (targetNode[childrenField]) {
                targetNode[childrenField].push(node)
            } else {
                targetNode[childrenField] = [node]
            }
        } else {
            trees.push(node)
        }
    }

    /**
     * 修改节点信息
     * @param {Object[]} trees 树结构数据列表
     * @param {Object} node 需要修改的节点
     */
    function updateNode(trees, node) {
        const targetNode = find(trees, item => item[idField] === node[idField])
        if (!targetNode) {
            console.warn('tree-utils --> updateNode warn message: Target node not found')
            return
        }
        if (pidField && targetNode[pidField] !== node[pidField]) {
            removeNode(trees, targetNode[idField])
            Object.keys(node).forEach(key => {
                targetNode[key] = node[key]
            })
            insertNode(trees, targetNode)
        } else {
            Object.keys(node).forEach(key => {
                targetNode[key] = node[key]
            })
        }
    }

    /**
     * 保存节点(根据节点id判断，有则修改，没有则插入)
     * @param {Object[]} trees 树结构数据列表
     * @param {Object} node 需要插入/修改的节点
     */
    function saveNode(trees, node) {
        const targetNode = find(trees, item => item[idField] === node[idField])
        if (targetNode) {
            updateNode(trees, node)
        } else {
            insertNode(trees, node)
        }
    }

    /**
     * 移除节点
     * @param {Object[]} trees 树结构数据列表
     * @param {*} targetNodeId 需要删除的节点的 id
     */
    function removeNode(trees, targetNodeId) {
        let childrenNodes
        if (trees.find(node => node[idField] === targetNodeId)) {
            childrenNodes = trees
        } else {
            const parentNode = getParentById(trees, targetNodeId)
            if (parentNode) {
                childrenNodes = parentNode[childrenField]
            }
        }
        if (childrenNodes?.length) {
            let targetIndex
            for (let index = 0; index < childrenNodes.length; index++) {
                if (childrenNodes[index][idField] === targetNodeId) {
                    targetIndex = index
                    break
                }
            }
            childrenNodes.splice(targetIndex, 1)
        }
    }

    /**
     * 排序
     * @param {Object[]} trees 树结构数据列表
     * @param {Function} callback 回调函数。参数为(节点对象1,节点对象2)，需要数字类型
     */
    function sort(trees, callback) {
        function _sort(_trees) {
            _trees.forEach(node => {
                if (node[childrenField]?.length) {
                    _sort(node[childrenField])
                } else {
                    return
                }
                node[childrenField].sort(callback)
            })
        }
        _sort(trees)
        trees.sort(callback)
    }

    /**
     * 获取全部节点祖籍
     * @param {*[]} trees 树结构数据列表
     * @returns [{id: [root, ..., parent2, parent1, node]}]
     */
    function getAncestors(trees) {
        const result = {}
        foreach(trees, (route, i, l, parent) => {
            if (parent) {
                result[route[idField]] = [...result[parent[idField]], route]
            } else {
                result[route[idField]] = [route]
            }
        })
        return result
    }

    return {
        listToTree,
        forEach,
        foreach,
        treeToList,
        filter,
        find,
        findAll,
        getRootById,
        getParentById,
        getAncestorsById,
        getLeafs,
        insertNode,
        updateNode,
        removeNode,
        saveNode,
        sort,
        getAncestors
    }

}

