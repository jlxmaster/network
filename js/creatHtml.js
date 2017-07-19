/*
  通过数据来创建视图
*/

// 根据总共的数据来生成树状菜单
function createTreeHtml(data, id){
  var str = `<ul>`;
  for(var i=0; i<data.length; i++){
    if(data[i].checked) continue;
    str += `<li class="clear">
              <h2 class="${data[i].id === id ? 'active' : ''}" data-id="${data[i].id}">
                <i class="add ${data[i].id === id ? 'active' : ''}" data-id="${data[i].id}"></i>
                ${data[i].name}
              </h2>`;
    // 判断当前数据是否有子数据
    str += data[i].children ? createTreeHtml(data[i].children, id) : '';
    str += `</li>`;
  }
  str += `</ul>`;
  return str;
}
 
// 创建面包屑导航
function createNavsHtml(data,id){
  let str = ``;
  for (let i = data.length - 1; i >= 0 ; i--) {
    str += `<span data-id="${data[i].id}">
    		${data[i].name}
    		</span>`
    if (i) str += `>`;
  }
  return str
}

// 创建文件夹结构
function createFilesHtml(data,id){
	var str = ``;
	for (var i = 0; i < data.length; i++) {
		str += `<div class="folder" data-id="${data[i].id}">
	              <span class="folder-img" data-id="${data[i].id}"></span>
	              <span class="folder-box" data-id="${data[i].id}"></span>
	              <span class="folder-name active" data-id="${data[i].id}" title="${data[i].name}">
	              	${data[i].name}
	              </span>
	              <input type="text" class="changeName" data-id="${data[i].id}"/>
	            </div>`
	}
	return str
}

// 新建单个文件夹节点
function createFileNode(){
	// 创建文件夹最外层
	var folder = document.createElement('div');
	folder.className = 'folder';

	// 创建选中框
	var folderBox = document.createElement('span');
	folderBox.className = 'folder-box';

	// 创建文件图标
	var folderImg = document.createElement('span');
	folderImg.className = 'folder-img';

	// 创建文件的名字
	var folderName = document.createElement('span');
	folderName.className = 'folder-name active';
	folderName.innerHTML = folderName.title = '';

	// 文本框
	var text = document.createElement('input');
	text.className = 'changeName';
	text.type = "text";

	folder.appendChild(folderBox);
	folder.appendChild(folderImg);
	folder.appendChild(folderName);
	folder.appendChild(text)

	return folder
}

// 创建右键菜单
function createRightMenu(data, id, isFile){
  var fileRightMenu = document.createElement('div');
  fileRightMenu.className = 'fileRightMenu';
  for(var i=0; i<data.length; i++){
    var item = document.createElement('a');
    item.href = 'javascript:;';
    if(typeof data[i].name === 'function'){
      item.innerHTML = data[i].name(isFile);
      item.onclick = data[i].click.bind(null, id, isFile);
    }else{
      if(typeof data[i].click === 'function'){
        item.onclick = data[i].click.bind(null, id);
      }
    }
    if(data[i].name === 0){
      item.className = 'botbor';
    }
    if(typeof data[i].name === 'string'){
      item.innerHTML = data[i].name;
    }
    fileRightMenu.appendChild(item);
  }
  return fileRightMenu;
}