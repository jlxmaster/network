/*
  微云的操作数据的工具方法
*/
 
// 获取到当前 id 的数据
function getItemById(data,id){
  var current = null;

  for (var i = 0; i < data.length; i++) {
// 首先遍历第一层的数据 若是找到了那么直接返回出去
    if(data[i].id === id){
      current = data[i];
      break;
    }
// 上面条件不成立了，判断一下变量是否是空的并且循环的数据有子集  那么就 递归一下
    if (!current && data[i].children) {
      current = getItemById(data[i].children,id);
      // 若是找到了那就跳出循环，不然递归就是死循环
      if (current) {
        break
      }
    }
  }
  return current
}

// 根据 id 获取到当前id下的所有子集
function getChildrenById(data,id){
  var current = getItemById(data,id);
  return current.children
}

//根据id获取本身及所有的子集
function getAllChild(data,id){
  // 判断id是否传入
  if (typeof id === 'undefined') return;
  var arr = [];
  // 获取到当前id的 数据
  var current = getItemById(data,id);

  arr.push(current);

  var currentChild = current.children;

  if (current.children.length) {
    for (var i = 0; i < currentChild.length; i++) {
      if(currentChild[i].children){
        arr = arr.concat(getAllChild(data,currentChild[i].id))
      }
    }
  }
  return arr
}

// 根据 id 获取到 本身以及所有的祖先节点
function getParentsById(data,id){
  var parents = [];
  var current = getItemById(data,id);
// 判断当前数据的 id 是否存在
  if (current) {
    parents.push(current);
    parents = parents.concat(getParentsById(data,current.pId));
  }
  return parents
}

// 判断名字是否可用
function nameCanUse(data,name){
  for (var i = 0; i < data.length; i++) {
    if(data[i].name === name){
      return false;
    }
  }
  return true
}

// 重命名替换数据
function replaceSameNameData(data, replaceData){
  for (var i = 0; i < data.length; i++) {
    if(data[i].name === replaceData.name){
      replaceData.pId = data[i].pId;
      replaceData.checked = false;
      data[i] = replaceData;
      data[i].name = data[i].name + '新';
      break
    }
  }
}

// 获取根节点
function getRoot(data){
  for (var i = 0; i < data.length; i++) {
    if(data[i].type === 'root'){
      return data[i]
    }
  }
}

// 设置并且返回最大的 id
function maxId(data){
    return getRoot(data).maxId = getRoot(data).maxId + 1
}

// 判断是否全选
function isCheckedAll(data){
  for (var i = 0; i < data.length; i++) {
    if(!data[i].checked){
      return false
    }
  }
  return true
}

// 获取到被选中的数据
function isCheckedFile(data){
  var arr = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].checked) {
      arr.push(data[i])
    }
  }
  return arr
}

// 根据数据查找对应的节点
function getChildNode(parentNode,id){
  var children = parentNode.children;
  for (var i = 0; i < children.length; i++) {
    if(getDataSetId(children[i]) === id){
      return children[i]
    }
  }
  return null
}

// 获取到元素身上 dataset 里面的 id 并转化为数字类型
function getDataSetId(obj){
  return obj.dataset.id * 1
}

// 碰撞检测函数
function duang(current, target){
  var currentRect = current.getBoundingClientRect();
  var targetRect = target.getBoundingClientRect();
  var currentLeft = currentRect.left,
      currentTop = currentRect.top,
      currentRight = currentRect.right,
      currentBottom = currentRect.bottom;
  var targetLeft = targetRect.left,
      targetTop = targetRect.top,
      targetRight = targetRect.right,
      targetBottom = targetRect.bottom;
  return currentRight > targetLeft && currentBottom > targetTop && currentLeft < targetRight && currentTop < targetBottom;
};

// 获取到元素的绝对位置
function getRect(obj, type){
  var rect = obj.getBoundingClientRect();
  switch(type){
    case 'left':
      return rect.left;
    break;
    case 'top':
      return rect.top;
    break;
    case 'right':
      return rect.right;
    break;
    case 'bottom':
      return rect.bottom;
    break;
  }
};

