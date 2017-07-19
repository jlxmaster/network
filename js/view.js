// 页面渲染函数

// 生成视图
function view(data, id){
	// 生成导航栏
	viewTree(data,id);
	viewNavs(data, id)
	return viewFiles(data, id)
}

// 生成左侧菜单
function viewTree(data, id){
	var html = createTreeHtml(data,id);
	listTree.innerHTML = html;
	return data
}

// 生成文件路径导航
function viewNavs(data,id){
	var parents = getParentsById(data,id);
	
	var html = createNavsHtml(parents,id);
	filesNavs.innerHTML = html;
	return data
}


// 生成数据里的所有文件
function viewFiles(data,id){
	var filesData = getChildrenById(data,id);
	var html = createFilesHtml(filesData,id);
	filesList.innerHTML = html;
	return filesData
}

//生成移动文件结构
function createMoveListMenuHtml(data, id){
  var html = createTreeHtml(data, id);
  var moveListMenu = document.querySelector('.move-list-menu');
  moveListMenu.innerHTML = html;
}
