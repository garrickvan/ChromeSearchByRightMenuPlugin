function setRightClickMenus(){
    chrome.contextMenus.removeAll();
    let itemJson = localStorage.getItem("right_click_data");
    items = JSON.parse(itemJson);
    if(items instanceof Array){   
        let setMenu = new setOneMenu();
        for (let i = 0; i < items.length; i++) {
            if(items[i].title != '' && items[i].url != ''){
                let target = items[i];
                setMenu.contextMenu(target);
                chrome.contextMenus.create({
                    type: "separator",
                    contexts: ["all"],
                });
            }
        }
    }
}

function setOneMenu(){
    this.contextMenu = function(target){
        chrome.contextMenus.create({
            title: target.title,
            contexts: ["all"] ,
            onclick: function(eventTarget, parms){
                gourl = target.url;
                if(eventTarget.selectionText) {
                    gourl = gourl.replace(/_SEARCH_CONTEXT_/ig, eventTarget.selectionText);
                }
                chrome.tabs.create({
                    url: gourl
                }, function (event) {
                });
            }
        });
    }
}

function initByDefault() {
    let itemJson = localStorage.getItem("right_click_data");
    let items = JSON.parse(itemJson);
    if (!Array.isArray(items)) {
        items = [];
    }
    if (items.length <= 0) {
        let defaultItems = [{
            title: "百度",
            url: "https://www.baidu.com/s?ie=utf-8&wd=_SEARCH_CONTEXT_"
        }, {
            title: "谷歌",
            url: "https://www.google.com/search?ie=UTF-8&q=_SEARCH_CONTEXT_"
        }, {
            title: "必应",
            url: "https://www.bing.com/search?q=_SEARCH_CONTEXT_&search=&form=QBLHCN"
        }, {
            title: "淘宝找货",
            url: "http://s.taobao.com/search?q=_SEARCH_CONTEXT_"
        }, {
            title: "京东找货",
            url: "https://search.jd.com/Search?keyword=_SEARCH_CONTEXT_"
        }, {
            title: "B站看看",
            url: "https://search.bilibili.com/all?keyword=_SEARCH_CONTEXT_"
        }, {
            title: "油管看看",
            url: "https://www.youtube.com/results?search_query=_SEARCH_CONTEXT_"
        }, {
            title: "知乎看看",
            url: "https://www.zhihu.com/search?type=content&q=_SEARCH_CONTEXT_"
        }];
        localStorage.setItem("right_click_data", JSON.stringify(defaultItems));
    }
}

chrome.browserAction.onClicked.addListener(function(b) {
    chrome.runtime.openOptionsPage();
})

initByDefault();
setRightClickMenus();