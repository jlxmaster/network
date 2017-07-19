// 加载文件数据

// 引入数据

var data = user_data.files;
// 获取本地存储的数据
// var data = JSON.parse(localStorage.getItem("data"))

// var data = user_data.files;
var menudata = user_data.fileRightMenu;

// 获取元素
// // 树状菜单的父级
var listTree = document.querySelector('.weiyun-list-tree');

// 头部
var topNav = document.querySelector('.nav-header');

// 面包屑导航容器
var filesNavs = document.querySelector('.paths-child');

// 文件夹容器
var filesList = document.querySelector('.files');

// 全选按钮
var fileCheckboxAll = document.querySelector('.checked');

// 功能图标容器
var showIcons = document.querySelector('.showIco')

// 添加按钮
var addBtn = document.querySelector('.addbtn');

// 删除按钮
var deleteFiles = document.querySelector('.load');

// 功能图标
var showIco = document.querySelector('.style');

// 底部容器
var bottom = document.querySelector('.content-body');

// 新建按钮
var createNewFolderBtn = document.querySelector('.new');

// 重命名按钮
var renameFiles = document.querySelector('.net');

// 移动按钮
var moveListBtn = document.querySelector('.floders')

// 初始页文件为全部文件
var current = 0;

// 用来缓存当前层级的所有子数据，提高查找的效率
var currentData = null;

// 用来关联全选功能，新建功能的变量
var isNameing = false;

// 右键菜单和画框的控制
var isRightMenu = false;

// 初始化页面结构
currentData = view(data,current);

// 面包削导航栏点击
filesNavs.addEventListener('click',function (e){
	// 获取到点击元素
	var target = e.target;
	// 若是点击的元素节点名字和SPAN 相同，那么获取到它的id
	if (target.nodeName.toUpperCase() === 'SPAN') {
		var id = getDataSetId(target);
		if (current === id) return ;
		currentData = view(data,current = id);
	}
});

// 左侧菜单点击事件
listTree.addEventListener('click', function (e){
	var target = e.target;
	if (target.nodeName.toUpperCase() === 'H2' || target.classList.contains('add')) {
		var id = getDataSetId(target);
		if (current === id) return;
		initChecked();
		currentData = view(data,current = id)
	}
})

// 双击文件夹列表
filesList.addEventListener('dblclick',function (e){
	var target = e.target;
	// 双击className包含folder或者folder-img的元素
	if (target.classList.contains('folder') || target.classList.contains('folder-img')) {
		var id = getDataSetId(target);
		if (fileCheckboxAll.checked) {
			initChecked();
			
		}
		console.log(fileCheckboxAll.checked)
		currentData = view(data,current = id);
	}
});

// 点击文件
filesList.addEventListener('click',function (e){
	var target = e.target;
	// 点击名字处重命名
	if (target.classList.contains('folder-name')) {
		initChecked();
		rename(target,getDataSetId(target))
	};
	// 选中文件
	if(target.classList.contains('folder-box')){
		// initChecked();
		checkedItem(target.parentNode);
	}
	removeRightMenu();
	isRightMenu = false;
	fileCheckboxAll.checked = false
});

// 重命名函数
function rename(ele,id){
	isNameing = true;
	// 获取到点击name的下个兄弟节点（就是文本框）
	var nextSibling = ele.nextElementSibling;
	// 让点击的名字隐藏
	ele.classList.remove('active');
	// 让文本框显示
	nextSibling.classList.add('active');
	// 并且让文本框显示时的值就是隐藏的名字
	nextSibling.value = ele.title;
	// 文本框聚焦
	nextSibling.select();
	// 文本框失去焦点事件
	nextSibling.onblur = function (){
		// 存储一下去掉前后空格的value
		var val = this.value.trim(); 
		// 若是空的，或者还是原先的名字
		if (val === '' || val === ele.title) {
			nextSibling.classList.remove('active');
			ele.classList.add('active');
			alertMessage('取消重命名！','fail');
			isNameing = false;
		}else{
			// 若是名字可用
			if(nameCanUse(currentData,val)){
				var currentItem = getItemById(currentData,id);
				currentItem.name = val;
				ele.title = ele.innerHTML = val;
				nextSibling.classList.remove('active');
				ele.classList.add('active');
				isNameing = false;
				alertMessage('重命名成功!','succ');
				// 更新到本地数据中去
				// localStorage.setItem("data", JSON.stringify(user));
			}else{
				alertMessage('该命名已存在!','fail');
				this.select()
			}
		}
	}
	window.onkeydown = function (e){
		if (e.keyCode === 13) {
			nextSibling.blur()
		}
	}
};

// 选中文件函数
function checkedItem(obj,selected){
	// 默认是没被选中
	var checked = false;
	// 文件夹选中或取消样式
	obj.classList.toggle('active');
	// 存储每个选中或取消的状态
	var checked = obj.classList.contains('active');
	// 若是第二个参数穿传了并且选中了
	if (selected && obj.classList.contains('active')) {
		obj.classList.add('active');
		checked = true;
	}
	// 获取到当前文件夹下的所有文件
	var targetData = getItemById(currentData,getDataSetId(obj));
	// 让当前文件夹下的所有文件都是选中的状态
	targetData.checked = checked;
	// 判断是否全选
	if(isCheckedAll(currentData)){
		fileCheckboxAll.classList.add('active');
	}else{
		fileCheckboxAll.classList.remove('active')
	}
};

// 全选
fileCheckboxAll.onclick = function (){
	removeRightMenu();
	// 若正在重命名那么就直接不执行该事件
	if (isNameing) return;
	this.classList.toggle('active');
	// 遍历当前文件夹下的所有文件
	for (var i = 0; i < currentData.length; i++) {
		if (this.classList.contains('active')) {
			currentData[i].checked = true;
			filesList.children[i].classList.add('active')
		}else{
			currentData[i].checked = false;
			filesList.children[i].classList.remove('active')
		}
	}
};

// 取消全选
function initChecked(){
	fileCheckboxAll.classList.remove('active');
	for (var i = 0; i < currentData.length; i++) {
		currentData[i].checked = false;
		filesList.children[i].classList.remove('active')
	}
};

// 鼠标移入‘添加’按钮
showIcons.onmouseover = function (){
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].classList.contains('addbtn')) {
			bottom.style.zIndex = -1;
			showIco.style.transform = 'scale(1)';
		}
	}
};

// 鼠标移出
showIcons.onmouseout = function (){
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].classList.contains('addbtn')) {
			bottom.style.zIndex = 0;
			showIco.style.transform = 'scale(0)';
		}
	}
};

// 点击重命名按钮
renameFiles.onclick = function (){
	removeRightMenu();
	var checkedItems = isCheckedFile(currentData);
	// 判断有无选中否则不执行该事件
	if (!checkedItems.length) {
		alertMessage('请选择文件','fail');
		return
	};
	if (checkedItems.length > 1) {
		alertMessage('只能选择一个文件！','fail');
		return
	};
	if (checkedItems.length === 1) {
		initChecked();
		showIco.style.transform = 'scale(0)';
		var renameChild = getChildNode(filesList,checkedItems[0].id);
		var showName = renameChild.querySelector('.folder-name');
		rename(showName,getDataSetId(showName))
	}
};

// 点击新建按钮
createNewFolderBtn.onclick = function (){
	if (isNameing) return;
	showIco.style.transform = 'scale(0)';
	createFolder_();
}

// 新建文件方法
function createFolder_(){
	removeRightMenu();
	isNameing = true ;
	initChecked();
	// 创建文件夹节点
	var newFolderNode = createFileNode();
	// 放到当前文件区域所有文件节点的前面
	filesList.insertBefore(newFolderNode,filesList.firstElementChild);
	// 对其做重命名操作
	renameFile(newFolderNode,data)
}

// 新建文件夹时命名的功能
function renameFile(fileNode,data){
	// fileNode.style.zIndex = 100;
	var showName = fileNode.querySelector('.folder-name');
	
	var renameInput = fileNode.querySelector('.changeName');

	showName.classList.remove('active');

	renameInput.classList.add('active');

	renameInput.focus();
	renameInput.onblur = function (){
		var val = this.value.trim();
		if (val === '') {
			fileNode.parentNode.removeChild(fileNode);
			isNameing = false;
			alertMessage('取消创建文件！','fail')
		}else{
		// 先判断该名字是否重复
			if(nameCanUse(currentData,val)){
				var fileData = {
					name:val,
					id:maxId(data),
					pId:current,
					type:'folder',
					checked:false,
					children:[]
				};
				currentData.unshift(fileData);
				currentData = view(data,current);
				isNameing = false;
				alertMessage('新建成功！','succ');
				// localStorage.setItem("data",JSON.stringify(data))
			}else{
				alertMessage('名字已存在！','fail');
				this.select();
			}
		}
	};

	// 回车键
	window.onkeydown = function (e){
		if(e.keyCode === 13 && renameInput.value !== ''){
			console.log(1)
			renameInput.blur();
		}
	}
}

// 删除功能
deleteFiles.onclick = function () {
	removeRightMenu();
	showIco.style.transfrom = 'scale(0)';
	// 存储一下当前选中的
	var checked = isCheckedFile(currentData);
	// 选中的个数来判断当前有没有选中文件夹
	if(checked.length){
		var isDelete = confirm('确定要删除吗？');
		if(!isDelete) return;
		deleteCheckedFile(currentData);
		currentData = view(data,current);
		initChecked();
		alertMessage('删除成功！','succ');
		console.log(data)
		// localStorage.setItem("data",JSON.stringify(data))
	}else{
		alertMessage('请选择需要删除的内容！','fail')
	}
};

// 删除选择文件夹功能函数
function deleteCheckedFile(data){
	for(var i = 0; i<data.length; i++){
		if(data[i].checked){
			data.splice(i,1);
			i--;
		}
	}
	return data
}


// 鼠标画框
filesList.onmousedown = function (e){
	// 事件函数中e.buttons  1指鼠标左键  2指鼠标右键
	if (e.buttons !== 1) return;
	if (isNameing) return;
	if (isRightMenu) return;
	e.preventDefault();

	var target = e.target;
	if (!target.classList.contains('files')){
		return
	} ;
	initChecked();

	var div = document.createElement('div');
	div.className = 'frame';
	this.appendChild(div);

// 获取到鼠标点下去的坐标点
	var startX = e.pageX, startY = e.pageY ;

// 鼠标移动
	filesList.onmousemove = function (e) {
		var currentX = e.pageX, currentY = e.pageY;
// console.log(currentX - getRect(this, 'left'))

		var L = Math.min(currentX - getRect(this, 'left'), startX - getRect(this, 'left'));
    var T = Math.min(currentY - getRect(this, 'top'), startY - getRect(this, 'top'));
    var W = Math.abs(currentX - startX);
    var H = Math.abs(currentY - startY);

		selectDuang(div);

		div.style.left = L + 'px';
		div.style.top = T + 'px';
		div.style.width = W + 'px';
		div.style.height = H + 'px';
	}

	document.onmouseup = () => {
		document.onmouseup = this.onmousemove = null;
		this.removeChild(div);
	}	
}

// 碰撞检测函数
function selectDuang(obj){
	var checked = false;
	for (var i = 0; i < filesList.children.length; i++) {
		var currentCheckedData = getItemById(currentData,getDataSetId(filesList.children[i]));
		if (duang(obj,filesList.children[i]) && filesList.children[i] !== obj) {
			filesList.children[i].classList.add('active');
			currentCheckedData.checked = true;
			if (isCheckedAll(currentData)) {
				fileCheckboxAll.checked = true;
			}else{
				fileCheckboxAll.checked = false
			}
		}else {
			if (filesList.children[i].classList.contains('active')) {
					filesList.children[i].classList.remove('active');
					currentCheckedData.checked = false;
			}
		}
	}
}


// 鼠标右键菜单
filesList.oncontextmenu = function (e){
	removeRightMenu();
	isRightMenu = true;
	e.preventDefault();
	var L = e.pageX - getRect(filesList,'left'),
			T = e.pageY - getRect(filesList, 'top');

	var target = e.target;

	var checkedItems = isCheckedFile(currentData);

	if (target.classList.contains('files')) {
		var rightMenuNode = createRightMenu(menudata,id)
	}
	if (target.classList.contains('folder') || target.classList.contains('folder-img') || target.classList.contains('folder-name')) {
		var id = getDataSetId(target);
		var itemData = getItemById(currentData,id);
		if (checkedItems.indexOf(itemData) == -1) {
			initChecked();
		}
		var itemNode = getChildNode(this,id);
		checkedItem(itemNode,true);
		var rightMenuNode = createRightMenu(menudata,id, true);
	}
	rightMenuNode.style.left = L + 'px';
	rightMenuNode.style.top = T + 'px';
	this.appendChild(rightMenuNode)
}

function removeRightMenu(){
	if(isRightMenu && filesList.lastElementChild && filesList.lastElementChild.classList.contains('fileRightMenu')){
		filesList.removeChild(filesList.lastElementChild)
	}
}




// 移动文件夹
var moveListWrap = document.querySelector('.move-list-wrap')

moveListBtn.onclick = function (){
  removeRightMenu();
  // 获取选中的数据
  var isCheckedItems = isCheckedFile(currentData);
  // 如果层级只有一个文件夹
  if((currentData.length <= 1 && getParentsById(data, current).length < 2) || (current === 0 && currentData.length === isCheckedItems.length)){
    alertMessage('没有可移动到的目标目录！', 'fail');
    return;
  }
  // 如果没有选中的数据
  if(!isCheckedItems.length){
    alertMessage('请选择要移动的内容！', 'fail');
    return;
  }
  // 创建可以移动的列表
  console.log(createMoveListMenuHtml(data, current))
  createMoveListMenuHtml(data, current)
  // 让移动遮罩层显示出来
  moveListWrap.classList.add('active');
  moveItemsFn(data);
};

function moveItemsFn(data){
  // 获取当前弹出的头部
  var moveListHeader = moveListWrap.querySelector('.move-list-header');
  // 关闭x按钮
  var closeMoveList = moveListWrap.querySelector('.move-list-header span');
  // 树状菜单
  var moveListMenu = moveListWrap.querySelector('.move-list-menu');
  // 确定
  var moveSure = moveListWrap.querySelector('.move-list-wrap .sure');
  // 取消
  var moveCancel = moveListWrap.querySelector('.move-list-wrap .cancel');
  
  // 当前要移动到的目录，一开始默认显示当前这一层
  var currentMove = current;
  
  // 拖拽弹窗
  dragElement(moveListHeader, moveListHeader.parentNode, true);
  
  // 点击对应菜单，切换对应class
  moveListMenu.onclick = function (e){
    var target = e.target;
    if(target.nodeName === 'H2' || target.classList.contains('add')){
      currentMove = getDataSetId(target);
      createMoveListMenuHtml(data, currentMove);
    }
  };
  // 确定按钮
  moveSure.onclick = function (){
    // 如果要移动的目标目录的id和当前的相等那么证明要移动到
    // 的是当前这一层目录
    if(current === currentMove){
      alertMessage('不能移动到同一级目录!', 'fail');
      return;
    }
    // 找到要移动到的目标目录的所有的子数据
    var targetMoveData = getChildrenById(data, currentMove);
    // 关闭弹窗
    moveListWrap.classList.remove('active');
    
    moveItemsData(targetMoveData, currentMove);
    
    if(currentData.length === 0){
      initChecked();
    }
    currentData = view(data, current);
    alertMessage('移动完成!', 'succ');
    clearEvent();
  };
  // 取消按钮和关闭窗口
  moveCancel.onclick = closeMoveList.onclick = function (){
    moveListWrap.classList.remove('active');
    clearEvent();
  };
  // 清除事件，释放内存
  function clearEvent(){
    moveListMenu.onclick = moveSure.onclick = null;
    moveCancel.onclick = closeMoveList.onclick = null;
    moveListHeader.onmousedown = null;
  }
}

// 移动数据
function moveItemsData(moveTargetData, targetId){
  for(var i=0; i<currentData.length; i++){
    if(currentData[i].checked){
      if(!nameCanUse(moveTargetData, currentData[i].name)){
        let repeatMessage = confirm('有相同名字文件是否覆盖?');
        if(repeatMessage){
          // 把当前这一层级相同的名字的数据替换掉
          replaceSameNameData(moveTargetData, currentData[i]);
          // console.log(currentData);
          currentData.splice(i, 1);
          // console.log(currentData);
          i--;
          continue;
        }
        let confirmMessage = confirm('是否保留两者?');
        if(!confirmMessage) continue;
        currentData[i].name = currentData[i].name + '(副本)';
      }
      // 修改自身的pId为目标目录的id
      currentData[i].pId = targetId;
      currentData[i].checked = false;
      moveTargetData.push(currentData.splice(i, 1)[0]);
      i--;
    }
  }
}
/*
 * 用来拖拽物体的函数
 * @param  {ele} eleDown   鼠标按下的元素
 * @param  {ele} eleMove   鼠标移动要拖拽的元素
 * @return undefined             
 */
function dragElement(eleDown, eleMove, scope){
  eleDown.onmousedown = function (e){
    e.preventDefault();
    var dx = e.pageX - getRect(eleMove, 'left');
    var dy = e.pageY - getRect(eleMove, 'top');
    document.onmousemove = function (e){
      var L = e.pageX - dx - getRect(eleMove.offsetParent, 'left');
      var T = e.pageY - dy - getRect(eleMove.offsetParent, 'top');
      if(scope){
        L = L <= 0 ? 0 : L;
        T = T <= 0 ? 0 : T;
        L = L >= eleMove.offsetParent.clientWidth - eleMove.offsetWidth ? eleMove.offsetParent.clientWidth - eleMove.offsetWidth : L;
        T = T >= eleMove.offsetParent.clientHeight - eleMove.offsetHeight ? eleMove.offsetParent.clientHeight - eleMove.offsetHeight : T;
      }
      eleMove.style.left = L + 'px';
      eleMove.style.top = T + 'px';
    };
    document.onmouseup = function (){
      this.onmouseup = this.onmousemove = null;
    }
  };
}

// 文件搜索事件
topNav.addEventListener('click',function (e){
	var targetList = e.target.classList
	if (targetList.contains('searchBtn')) {
		search()
	}
})



// 提示框
function alertMessage(val, type){
	var tip = document.querySelector('.tip');
	tip.innerHTML = val;
	tip.classList.add(type);
	setTimeout(() => {
		tip.classList.remove(type)
	},1200)
}


// 文件搜索
function search(){
  // 先获取到文本框
  var searchText = document.querySelector('.search'),
      pathsChild = document.querySelector('.paths-child'),
      val = searchText.value.toLowerCase(),
      arrSearch = new Array(),
      regSearch = new RegExp([searchText.value], 'gi'),
      allData = getAllChild(data,0);

// 判断输入是否为空
  if (val.trim() === '') {
    alertMessage('请输入文件名！','fail')
    return
  };
// 根文件不需要再搜索，所以从索引 1 开始
  for (var i = 1; i < allData.length; i++) {
  	if (val === allData[i].name.toLowerCase()) {
  		arrSearch.push(allData[i]);
  		filesList.innerHTML = createFilesHtml(arrSearch)
  	}
  }
}	


