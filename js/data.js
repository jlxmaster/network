var user_data = {
  files: [
    {
      name: '全部文件',
      id: 0,
      maxId: 13,
      type: 'root',
      children: [
        {
          name: 'web前端',
          id: 1,
          pId: 0,
          type: 'folder',
          checked: false,
          children: [
            {
              name: 'CSS',
              id: 5,
              pId: 1,
              type: 'folder',
              checked: false,
              children: []
            },
            {
              name: 'HTML',
              id: 6,
              pId: 1,
              type: 'folder',
              checked: false,
              children: []
            }
          ]
        },
        {
          name: 'JS',
          id: 2,
          pId: 0,
          type: 'folder',
          checked: false,
          children: [
            {
              name: 'JS入门',
              id: 7,
              pId: 2,
              type: 'folder',
              checked: false,
              children: []
            }
          ]
        },
        {
          name: '框架',
          id: 3,
          pId: 0,
          type: 'folder',
          checked: false,
          children: [
            {
              name: 'Vue',
              id: 8,
              pId: 3,
              type: 'folder',
              checked: false,
              children: []
            },
            {
              name: 'React',
              id: 9,
              pId: 3,
              type: 'folder',
              checked: false,
              children: []
            }
          ]
        }
      ]
    }
  ],
  fileRightMenu: [
    {
      name: function (isFile){
        return isFile ? '打开' : '新建';
      },
      click: function (id, isFile){
        if(isFile){
          initChecked();
          currentData = view(data, current = id);
        }else{
          createNewFolderBtn.onclick();
        }
      }
    },
    {
      name: 0
    },
    {
      name: '移动到',
      click: function (id){
        moveListBtn.onclick();
      }
    },
    {
      name: '重命名',
      click: function (id){
        initChecked();
        var itemNode = getChildNode(filesList, id);
        checkedItem(itemNode, true);
        renameFiles.onclick();
      }
    },
    {
      name: 0
    },
    {
      name: '删除',
      click: function (id){
        deleteFiles.onclick();
      }
    },
    {
      name: '属性',
      click: function (id){
        // initChecked();
        // var itemNode = getChildNode(filesList, id);
        // console.log(itemNode);
        // if(itemNode){
        //   checkedItem(itemNode, true);
        // }
        var data = getItemById(currentData, id);
        data ? alertMessage(`当前文件类型：${data.type}`, 'succ') : alertMessage(`当前文件类型：目录`, 'succ');
        removeRightMenu();
      }
    }
  ]
};