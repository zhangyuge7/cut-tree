import {
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
} from '../src/tree-utils.js';

import listData from '../src/static/listData.json' assert {type: 'json'};
import treesData from '../src/static/treesData.json' assert {type: 'json'};

const config = { id: 'id', parentId: 'pid', children: 'children' }

let start = new Date().getTime()

// listToTree 测试
const tree = listToTree(listData, config)
console.assert(JSON.stringify(tree) === JSON.stringify(treesData), 'listToTree 测试未通过');

// forEach 测试
let arr = []
forEach(treesData, config, (item, i, l) => {
    arr.push(`${item.label} ${i} ${l}`)
})
console.assert(JSON.stringify(arr) === '["1 0 1","1-2 1 2","1-2-1 2 3","1-1 3 2","2 4 1","2-1 5 2","2-2 6 2","3 7 1","3-1 8 2","3-1-2 9 3","3-1-1 10 3","4 11 1","4-1 12 2","4-1-1 13 3","4-2 14 2"]', 'forEach 测试未通过');

// foreach 测试
arr = []
foreach(treesData, config, (item, i, l, parent, root) => {
    arr.push(`${item.label} ${i} ${l} ${parent ? parent.label : null} ${root.label}`)
})
console.assert(JSON.stringify(arr) === '["1 0 1 null 1","1-2 1 2 1 1","1-2-1 2 3 1-2 1","1-1 3 2 1 1","2 4 1 null 2","2-1 5 2 2 2","2-2 6 2 2 2","3 7 1 null 3","3-1 8 2 3 3","3-1-2 9 3 3-1 3","3-1-1 10 3 3-1 3","4 11 1 null 4","4-1 12 2 4 4","4-1-1 13 3 4-1 4","4-2 14 2 4 4"]', 'foreach 测试未通过');

// treeToList 测试
console.assert(treeToList(treesData, config).length === listData.length, 'treeToList 测试未通过')

// filter 测试
console.assert(JSON.stringify(filter(treesData, config, item => item.label.indexOf('2-2') > -1)) === '[{"label":"2","id":2,"pid":null,"children":[{"label":"2-2","id":15,"pid":2}]}]', 'filter 测试未通过')
console.assert(JSON.stringify(filter(treesData, config, item => true)) === JSON.stringify(treesData), 'filter 测试未通过')
console.assert(filter(treesData, config, item => false).length === 0, 'filter 测试未通过')

// find 测试
console.assert(find(treesData, config, node => node.label.indexOf('2') > -1).label === '1-2', 'find 测试未通过')


// findAll 测试
console.assert(findAll(treesData, config, node => node.label.indexOf('2') > -1).length === 7, 'findAll 测试未通过')


// getRootById 测试
console.assert(getRootById(treesData, config, 13).id === 3, 'getRootById 测试未通过')

// getParentById 测试
forEach(treesData, config, node => {
    const parentNode = getParentById(treesData, config, node.id)
    if (node.pid === null) {
        console.assert(parentNode === null, 'getParentById 测试未通过')
    } else {
        console.assert(parentNode.id === node.pid, 'getParentById 测试未通过')
    }
})

// getAncestorsById 测试
const ancestors = getAncestorsById(treesData, config, 13)
console.assert(JSON.stringify(ancestors) === '[{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-1","id":13,"pid":5}]}]},{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-1","id":13,"pid":5}]},{"label":"3-1-1","id":13,"pid":5}]', 'getAncestorsById 测试未通过');

// getLeafs 测试
const leafs = getLeafs(treesData, config)
console.assert(leafs.length === 8, 'getLeafs 测试未通过')



// insertNode 测试
insertNode(treesData, { id: 'id', children: 'children' }, { label: '2-3', id: 16 }, 2)
insertNode(treesData, { id: 'id', parentId: 'pid', children: 'children' }, { label: '2-2-1', id: 17, pid: 15 })
console.assert(JSON.stringify(treesData) === '[{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9}]},{"label":"1-1","id":10,"pid":1}]},{"label":"2","id":2,"pid":null,"children":[{"label":"2-1","id":6,"pid":2},{"label":"2-2","id":15,"pid":2,"children":[{"label":"2-2-1","id":17,"pid":15}]},{"label":"2-3","id":16}]},{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-2","id":12,"pid":5},{"label":"3-1-1","id":13,"pid":5}]}]},{"label":"4","id":4,"pid":null,"children":[{"label":"4-1","id":8,"pid":4,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"4-2","id":14,"pid":4}]}]', 'insertNode 测试未通过');

// updateNode 测试
updateNode(treesData, config, { label: '12-12-11', id: 17, pid: 15 })
console.assert(JSON.stringify(treesData) === '[{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9}]},{"label":"1-1","id":10,"pid":1}]},{"label":"2","id":2,"pid":null,"children":[{"label":"2-1","id":6,"pid":2},{"label":"2-2","id":15,"pid":2,"children":[{"label":"12-12-11","id":17,"pid":15}]},{"label":"2-3","id":16}]},{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-2","id":12,"pid":5},{"label":"3-1-1","id":13,"pid":5}]}]},{"label":"4","id":4,"pid":null,"children":[{"label":"4-1","id":8,"pid":4,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"4-2","id":14,"pid":4}]}]', 'updateNode 测试未通过');


// removeNode 测试
removeNode(treesData, config, 10)
console.assert(JSON.stringify(treesData) === '[{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9}]}]},{"label":"2","id":2,"pid":null,"children":[{"label":"2-1","id":6,"pid":2},{"label":"2-2","id":15,"pid":2,"children":[{"label":"12-12-11","id":17,"pid":15}]},{"label":"2-3","id":16}]},{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-2","id":12,"pid":5},{"label":"3-1-1","id":13,"pid":5}]}]},{"label":"4","id":4,"pid":null,"children":[{"label":"4-1","id":8,"pid":4,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"4-2","id":14,"pid":4}]}]', 'removeNode 测试未通过');

// updateNode 测试二
updateNode(treesData, config, { label: '12-13-11', id: 17, pid: 11 })
console.assert(JSON.stringify(treesData) === '[{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9,"children":[{"label":"12-13-11","id":17,"pid":11}]}]}]},{"label":"2","id":2,"pid":null,"children":[{"label":"2-1","id":6,"pid":2},{"label":"2-2","id":15,"pid":2,"children":[]},{"label":"2-3","id":16}]},{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-2","id":12,"pid":5},{"label":"3-1-1","id":13,"pid":5}]}]},{"label":"4","id":4,"pid":null,"children":[{"label":"4-1","id":8,"pid":4,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"4-2","id":14,"pid":4}]}]', 'update 测试二未通过');

// saveNode 测试
saveNode(treesData, config, { label: '123', id: 123 })
saveNode(treesData, config, { label: '4-1', id: 8, pid: 2 })
console.assert(JSON.stringify(treesData) === '[{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9,"children":[{"label":"12-13-11","id":17,"pid":11}]}]}]},{"label":"2","id":2,"pid":null,"children":[{"label":"2-1","id":6,"pid":2},{"label":"2-2","id":15,"pid":2,"children":[]},{"label":"2-3","id":16},{"label":"4-1","id":8,"pid":2,"children":[{"label":"4-1-1","id":7,"pid":8}]}]},{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-2","id":12,"pid":5},{"label":"3-1-1","id":13,"pid":5}]}]},{"label":"4","id":4,"pid":null,"children":[{"label":"4-2","id":14,"pid":4}]},{"label":"123","id":123}]', 'saveNode 测试不通过');

// sort 测试
sort(treesData,config,(a,b)=>{
    return b.id - a.id
})
console.assert(JSON.stringify(treesData)==='[{"label":"123","id":123},{"label":"4","id":4,"pid":null,"children":[{"label":"4-2","id":14,"pid":4}]},{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-1","id":13,"pid":5},{"label":"3-1-2","id":12,"pid":5}]}]},{"label":"2","id":2,"pid":null,"children":[{"label":"2-3","id":16},{"label":"2-2","id":15,"pid":2,"children":[]},{"label":"4-1","id":8,"pid":2,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"2-1","id":6,"pid":2}]},{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9,"children":[{"label":"12-13-11","id":17,"pid":11}]}]}]}]','sort 测试不通过');

// forEach 倒序遍历测试
let arr1 = []
forEach(treesData, config, (item, i, l) => {
    arr1.push(`${item.label} ${i} ${l}`)
},{rever:true})
console.assert(JSON.stringify(arr1) === '["123 0 1","4-2 1 2","4 2 1","3-1-1 3 3","3-1-2 4 3","3-1 5 2","3 6 1","2-3 7 2","2-2 8 2","4-1-1 9 3","4-1 10 2","2-1 11 2","2 12 1","12-13-11 13 4","1-2-1 14 3","1-2 15 2","1 16 1"]','forEach 倒序遍历测试');

// foreach 倒序遍历测试
arr1 = []
foreach(treesData, config, (item, i, l, parent, root) => {
    arr1.push(`${item.label} ${i} ${l} ${parent ? parent.label : null} ${root.label}`)
},{rever:true})
console.assert(JSON.stringify(arr1)==='["123 0 1 null 123","4-2 1 2 4 4","4 2 1 null 4","3-1-1 3 3 3-1 3","3-1-2 4 3 3-1 3","3-1 5 2 3 3","3 6 1 null 3","2-3 7 2 2 2","2-2 8 2 2 2","4-1-1 9 3 4-1 2","4-1 10 2 2 2","2-1 11 2 2 2","2 12 1 null 2","12-13-11 13 4 1-2-1 1","1-2-1 14 3 1-2 1","1-2 15 2 1 1","1 16 1 null 1"]','foreach 倒序遍历测试未通过');


// getAncestors 获取祖籍测试
const result = getAncestors(treesData,config)
console.assert(JSON.stringify(result)==='{"1":[{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9,"children":[{"label":"12-13-11","id":17,"pid":11}]}]}]}],"2":[{"label":"2","id":2,"pid":null,"children":[{"label":"2-3","id":16},{"label":"2-2","id":15,"pid":2,"children":[]},{"label":"4-1","id":8,"pid":2,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"2-1","id":6,"pid":2}]}],"3":[{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-1","id":13,"pid":5},{"label":"3-1-2","id":12,"pid":5}]}]}],"4":[{"label":"4","id":4,"pid":null,"children":[{"label":"4-2","id":14,"pid":4}]}],"5":[{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-1","id":13,"pid":5},{"label":"3-1-2","id":12,"pid":5}]}]},{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-1","id":13,"pid":5},{"label":"3-1-2","id":12,"pid":5}]}],"6":[{"label":"2","id":2,"pid":null,"children":[{"label":"2-3","id":16},{"label":"2-2","id":15,"pid":2,"children":[]},{"label":"4-1","id":8,"pid":2,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"2-1","id":6,"pid":2}]},{"label":"2-1","id":6,"pid":2}],"7":[{"label":"2","id":2,"pid":null,"children":[{"label":"2-3","id":16},{"label":"2-2","id":15,"pid":2,"children":[]},{"label":"4-1","id":8,"pid":2,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"2-1","id":6,"pid":2}]},{"label":"4-1","id":8,"pid":2,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"4-1-1","id":7,"pid":8}],"8":[{"label":"2","id":2,"pid":null,"children":[{"label":"2-3","id":16},{"label":"2-2","id":15,"pid":2,"children":[]},{"label":"4-1","id":8,"pid":2,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"2-1","id":6,"pid":2}]},{"label":"4-1","id":8,"pid":2,"children":[{"label":"4-1-1","id":7,"pid":8}]}],"9":[{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9,"children":[{"label":"12-13-11","id":17,"pid":11}]}]}]},{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9,"children":[{"label":"12-13-11","id":17,"pid":11}]}]}],"11":[{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9,"children":[{"label":"12-13-11","id":17,"pid":11}]}]}]},{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9,"children":[{"label":"12-13-11","id":17,"pid":11}]}]},{"label":"1-2-1","id":11,"pid":9,"children":[{"label":"12-13-11","id":17,"pid":11}]}],"12":[{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-1","id":13,"pid":5},{"label":"3-1-2","id":12,"pid":5}]}]},{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-1","id":13,"pid":5},{"label":"3-1-2","id":12,"pid":5}]},{"label":"3-1-2","id":12,"pid":5}],"13":[{"label":"3","id":3,"pid":null,"children":[{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-1","id":13,"pid":5},{"label":"3-1-2","id":12,"pid":5}]}]},{"label":"3-1","id":5,"pid":3,"children":[{"label":"3-1-1","id":13,"pid":5},{"label":"3-1-2","id":12,"pid":5}]},{"label":"3-1-1","id":13,"pid":5}],"14":[{"label":"4","id":4,"pid":null,"children":[{"label":"4-2","id":14,"pid":4}]},{"label":"4-2","id":14,"pid":4}],"15":[{"label":"2","id":2,"pid":null,"children":[{"label":"2-3","id":16},{"label":"2-2","id":15,"pid":2,"children":[]},{"label":"4-1","id":8,"pid":2,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"2-1","id":6,"pid":2}]},{"label":"2-2","id":15,"pid":2,"children":[]}],"16":[{"label":"2","id":2,"pid":null,"children":[{"label":"2-3","id":16},{"label":"2-2","id":15,"pid":2,"children":[]},{"label":"4-1","id":8,"pid":2,"children":[{"label":"4-1-1","id":7,"pid":8}]},{"label":"2-1","id":6,"pid":2}]},{"label":"2-3","id":16}],"17":[{"label":"1","id":1,"pid":null,"children":[{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9,"children":[{"label":"12-13-11","id":17,"pid":11}]}]}]},{"label":"1-2","id":9,"pid":1,"children":[{"label":"1-2-1","id":11,"pid":9,"children":[{"label":"12-13-11","id":17,"pid":11}]}]},{"label":"1-2-1","id":11,"pid":9,"children":[{"label":"12-13-11","id":17,"pid":11}]},{"label":"12-13-11","id":17,"pid":11}],"123":[{"label":"123","id":123}]}','getAncestors 获取祖籍测试');

console.log('测试耗时:', `${new Date().getTime() - start} 毫秒`);