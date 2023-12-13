import { useTreeUtil } from '../src/tree-util.js';
import listData from '../src/static/listData.json' assert {type: 'json'};
import treesData from '../src/static/treesData.json' assert {type: 'json'};

const {
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
    sort
} = useTreeUtil({ id: 'id', parentId: 'pid', children: 'children' })

let start = new Date().getTime()
// listToTree 测试
const tree = listToTree(listData)
console.assert(JSON.stringify(tree) === JSON.stringify(treesData), 'listToTree 测试未通过');

// forEach 测试
let arr = []
forEach(treesData, (item, i, l) => {
    arr.push(`${item.label} ${i} ${l}`)
})
console.assert(JSON.stringify(arr) === '["1 0 1","1-2 1 2","1-2-1 2 3","1-1 3 2","2 4 1","2-1 5 2","2-2 6 2","3 7 1","3-1 8 2","3-1-2 9 3","3-1-1 10 3","4 11 1","4-1 12 2","4-1-1 13 3","4-2 14 2"]', 'forEach 测试未通过');

// foreach 测试
arr = []
foreach(treesData, (item, i, l, parent, root) => {
    arr.push(`${item.label} ${i} ${l} ${parent ? parent.label : null} ${root.label}`)
})
console.assert(JSON.stringify(arr) === '["1 0 1 null 1","1-2 1 2 1 1","1-2-1 2 3 1-2 1","1-1 3 2 1 1","2 4 1 null 2","2-1 5 2 2 2","2-2 6 2 2 2","3 7 1 null 3","3-1 8 2 3 3","3-1-2 9 3 3-1 3","3-1-1 10 3 3-1 3","4 11 1 null 4","4-1 12 2 4 4","4-1-1 13 3 4-1 4","4-2 14 2 4 4"]', 'foreach 测试未通过');

// treeToList 测试
console.assert(treeToList(treesData).length === listData.length, 'treeToList 测试未通过')

// filter 测试
console.assert(JSON.stringify(filter(treesData, item => item.label.indexOf('2-2') > -1)) === '[{"label":"2","id":2,"pid":null,"children":[{"label":"2-2","id":15,"pid":2}]}]', 'filter 测试未通过')
console.assert(JSON.stringify(filter(treesData, item => true)) === JSON.stringify(treesData), 'filter 测试未通过')
console.assert(filter(treesData, item => false).length === 0, 'filter 测试未通过')

// find 测试
console.assert(find(treesData, node => node.label.indexOf('2') > -1).label === '1-2', 'find 测试未通过')


// findAll 测试
console.assert(findAll(treesData, node => node.label.indexOf('2') > -1).length === 7, 'findAll 测试未通过')


// getRootById 测试
console.assert(getRootById(treesData, 13).id === 3, 'getRootById 测试未通过')

// getParentById 测试
forEach(treesData, node => {
    const parentNode = getParentById(treesData, node.id)
    if (node.pid === null) {
        console.assert(parentNode === null, 'getParentById 测试未通过')
    } else {
        console.assert(parentNode.id === node.pid, 'getParentById 测试未通过')
    }
})

// getAncestorsById 测试
const ancestors = getAncestorsById(treesData, 13)
console.assert(JSON.stringify(ancestors) === '[{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-1","id":13,"pid":5}]}]},{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-1","id":13,"pid":5}]},{"label":"3-1-1","id":13,"pid":5}]', 'getAncestorsById 测试未通过');

// getLeafs 测试
const leafs = getLeafs(treesData)
console.assert(leafs.length === 8, 'getLeafs 结果不正确')

// insertNode 测试
insertNode(treesData, { label: '2-3', id: 16 }, 2)
insertNode(treesData, { label: '2-2-1', id: 17, pid: 15 })
console.assert(JSON.stringify(treesData) === '[{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9}]},{"label":"1-1","id":10,"pid":1}]},{"label":"2","id":2,"pid":null,"children":[{"label":"2-1","id":6,"pid":2},{"label":"2-2","id":15,"pid":2,"children":[{"label":"2-2-1","id":17,"pid":15}]},{"label":"2-3","id":16}]},{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-2","id":12,"pid":5},{"label":"3-1-1","id":13,"pid":5}]}]},{"label":"4","id":4,"pid":null,"children":[{"label":"4-1","id":8,"pid":4,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"4-2","id":14,"pid":4}]}]', 'insertNode 测试未通过');


// updateNode 测试
updateNode(treesData, { label: '12-12-11', id: 17, pid: 15 })
console.assert(JSON.stringify(treesData) === '[{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9}]},{"label":"1-1","id":10,"pid":1}]},{"label":"2","id":2,"pid":null,"children":[{"label":"2-1","id":6,"pid":2},{"label":"2-2","id":15,"pid":2,"children":[{"label":"12-12-11","id":17,"pid":15}]},{"label":"2-3","id":16}]},{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-2","id":12,"pid":5},{"label":"3-1-1","id":13,"pid":5}]}]},{"label":"4","id":4,"pid":null,"children":[{"label":"4-1","id":8,"pid":4,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"4-2","id":14,"pid":4}]}]', 'updateNode 测试未通过');

// removeNode 测试
removeNode(treesData, 10)
console.assert(JSON.stringify(treesData) === '[{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9}]}]},{"label":"2","id":2,"pid":null,"children":[{"label":"2-1","id":6,"pid":2},{"label":"2-2","id":15,"pid":2,"children":[{"label":"12-12-11","id":17,"pid":15}]},{"label":"2-3","id":16}]},{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-2","id":12,"pid":5},{"label":"3-1-1","id":13,"pid":5}]}]},{"label":"4","id":4,"pid":null,"children":[{"label":"4-1","id":8,"pid":4,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"4-2","id":14,"pid":4}]}]', 'removeNode 测试未通过');

// updateNode 测试二
updateNode(treesData, { label: '12-13-11', id: 17, pid: 11 })
console.assert(JSON.stringify(treesData) === '[{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9,"children":[{"label":"12-13-11","id":17,"pid":11}]}]}]},{"label":"2","id":2,"pid":null,"children":[{"label":"2-1","id":6,"pid":2},{"label":"2-2","id":15,"pid":2,"children":[]},{"label":"2-3","id":16}]},{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-2","id":12,"pid":5},{"label":"3-1-1","id":13,"pid":5}]}]},{"label":"4","id":4,"pid":null,"children":[{"label":"4-1","id":8,"pid":4,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"4-2","id":14,"pid":4}]}]', 'update 测试二未通过');

// saveNode 测试
saveNode(treesData, { label: '123', id: 123 })
saveNode(treesData, { label: '4-1', id: 8, pid: 2 })
console.assert(JSON.stringify(treesData) === '[{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9,"children":[{"label":"12-13-11","id":17,"pid":11}]}]}]},{"label":"2","id":2,"pid":null,"children":[{"label":"2-1","id":6,"pid":2},{"label":"2-2","id":15,"pid":2,"children":[]},{"label":"2-3","id":16},{"label":"4-1","id":8,"pid":2,"children":[{"label":"4-1-1","id":7,"pid":8}]}]},{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-2","id":12,"pid":5},{"label":"3-1-1","id":13,"pid":5}]}]},{"label":"4","id":4,"pid":null,"children":[{"label":"4-2","id":14,"pid":4}]},{"label":"123","id":123}]', 'saveNode 测试不通过');

// sort 测试
sort(treesData,(a,b)=>{
    return b.id - a.id
})
console.assert(JSON.stringify(treesData)==='[{"label":"123","id":123},{"label":"4","id":4,"pid":null,"children":[{"label":"4-2","id":14,"pid":4}]},{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-1","id":13,"pid":5},{"label":"3-1-2","id":12,"pid":5}]}]},{"label":"2","id":2,"pid":null,"children":[{"label":"2-3","id":16},{"label":"2-2","id":15,"pid":2,"children":[]},{"label":"4-1","id":8,"pid":2,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"2-1","id":6,"pid":2}]},{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9,"children":[{"label":"12-13-11","id":17,"pid":11}]}]}]}]','sort 测试不通过');


console.log('测试耗时:', `${new Date().getTime() - start} 毫秒`);
