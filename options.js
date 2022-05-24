let loadedMenuIDs = [];

function addItem() {
    let saveMenus = localStorage.getItem("right_click_data");
    let items = JSON.parse(saveMenus);
    createItem('新菜单', '', '', '*://*/*');
    checkItems(loadedMenuIDs);
}

function listMenuItems() {
    let saveMenus = localStorage.getItem("right_click_data");
    let items = JSON.parse(saveMenus);
    checkItems(items);
    if (items instanceof Array) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].title != '' && items[i].url != '') {
                createItem('菜单' + (i + 1), items[i].title, items[i].url);
            } else {
                checkItems([]);
            }
        }
    }
}

function saveItem() {
    let items = [];
    let error = 0;
    for (let i = 0; i < loadedMenuIDs.length; i++) {
        let item = {};
        let title = document.getElementById('title' + loadedMenuIDs[i]);
        let url = document.getElementById('url' + loadedMenuIDs[i]);
        if (!checkerror(title, 'title') && !checkerror(url, 'url')) {
            item.title = title.value;
            item.url = url.value;
            items.push(item);
        } else {
            error = 1;
        }
    }
    if (error == 0) {
        checkItems(loadedMenuIDs);
        localStorage.setItem("right_click_data", JSON.stringify(items));
        let bg = chrome.extension.getBackgroundPage();
        bg.setRightClickMenus();
        saveStatus();
    }
}

function checkItems(items) {
    let ui = document.getElementById("noItmes");
    if (items instanceof Array && items.length) {
        ui.style.display = 'none';
    } else {
        ui.style.display = 'block';
    }
}

function checkerror(inputObj, type) {
    let hasError = false;
    if (inputObj.value == '') {
        hasError = true;
    } else {
        let regular = /_SEARCH_CONTEXT_/;
        if (type == 'url' && !regular.test(inputObj.value)) {
            hasError = true;
        }
    }
    hasError ? inputObj.classList.add("error") : inputObj.classList.remove("error");
    return hasError;
}

function removeItemByID(arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}

function getUniqueDomID() {
    let isUnique = true;
    let newId = "" + new Date().getTime();
    do {
        isUnique = loadedMenuIDs.indexOf(newId) === -1;
        if (!isUnique) {
            newId = "" + new Date().getTime();
        }
    } while (!isUnique);
    return newId;
}

let searchInputPlaceholder = "含有_SEARCH_CONTEXT_搜索占位符的地址";
function createItem(title, menuName, menuUrl) {
    let menuID = getUniqueDomID();
    let savedItems = document.getElementById("savedItems");
    let div = document.createElement('div');
    let delBtn = document.createElement('button');
    delBtn.setAttribute('menuID', menuID);
    delBtn.className = "delBtn";
    delBtn.innerHTML = '删除';
    div.innerHTML = '<div class="label-row"><label class="title">' + title + '</label></div>' +
      '<div class="label-row"><label for="options-title">菜单名称</label>：<input placeholder="输入右键的菜单名称" value="' + menuName + '" id="title' + menuID + '" type="text" id="options-title"></div>' +
      '<div class="label-row"><label for="options-url">搜索地址</label>：<input placeholder=' + searchInputPlaceholder +
      ' value="' + menuUrl + '" id="url' + menuID + '" type="text" id="options-url" class="inputFullWidth"></div>';
    div.className = "section";
    div.id = "section" + menuID;
    div.appendChild(delBtn);
    savedItems.appendChild(div);
    delBtn.onclick = function() {
        this.parentNode.parentNode.removeChild(this.parentNode);
        removeItemByID(loadedMenuIDs, this.getAttribute('menuID'));
        checkItems(loadedMenuIDs);
    }
    loadedMenuIDs.push(menuID);
}

function saveStatus() {
    let status = document.getElementById('opStuatus');
    status.style.display="block";
    setTimeout(function() {
        status.style.display="none";
    }, 1000);
}

function initItem() {
    let bg = chrome.extension.getBackgroundPage();
    bg.initByDefault();
    bg.setRightClickMenus();
    location.reload();
}

document.getElementById('addItem').addEventListener('click', addItem);
document.getElementById('saveItemBtn').addEventListener('click', saveItem);
document.getElementById('initItem').addEventListener('click', initItem);
document.addEventListener('DOMContentLoaded', listMenuItems);