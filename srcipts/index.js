/**
 * @description 根据权限对页面进行初始化,初始化权限和用户名
 */
(function() {
    $.ajax({
        url: 'http://'+ window.ip +':8080/qginfosystem/user/getinfo',
        type: 'post',
        crossDomain: true,
    　　xhrFields: {
    　　 withCredentials: true
    　　},
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        success: function(responseObj) {
            window.name = responseObj.name;
            window.privilege = responseObj.privilege;
            if (window.privilege == 2) {
                $('#auditing-user').css('display', 'block');
                $('#import-export').css('display', 'block');
            } else {
                $('#auditing-user').css('display', 'none');
                $('#import-export').css('display', 'none');
            }
            if (window.name) {
                $('#user-name')[0].innerText = name;
            } else {
                $('#user-name')[0].innerText = '用户名';
            }
            // 预处理详细页面的按钮
            informationDetailPre();
        },
        error: function() {
            // 请求失败时要干什么
            showMessage('请求失败');
        }
    });

})();

/**
 * 初始化右操作面板功能
 */
var flag = true;
function showPartRight() {
    var showPanelButton = document.getElementById('show-panel-button'),
        text = showPanelButton.getElementsByTagName('span')[0],
        partRight = document.getElementsByClassName('part-right')[0],
        panel = document.getElementsByClassName('panel');
    
    // 为按钮绑定一次事件就够了
    if (flag === true) {
        EventUtil.addHandler(showPanelButton, 'click', fn);
        flag = null;
    } 

    function fn() {    
        if (ClassUtil.hasClass(partRight, 'part-right-animation')) {
            ClassUtil.removeClass(partRight, 'part-right-animation');
            text.innerHTML = '筛选条件';
        } else {
            ClassUtil.addClass(partRight, 'part-right-animation');
            text.innerHTML = '收起';
        }
    }

    var partLeft = document.getElementsByClassName('part-left-main')[0],
        thisPart =  partLeft.getElementsByClassName('show')[0],
        index;
        
    if (typeof(thisPart) === 'undefined') {
        // 展示初始化的页面
        
    } else {
        index = thisPart.getAttribute('data-index');
        // 只有两种页面需要展示右边栏
        if ( index == 1 || index == 0 ) {
            ClassUtil.addClass(partRight, 'show');
            ClassUtil.removeClass(panel[0], 'show');
            ClassUtil.removeClass(panel[1], 'show');
            ClassUtil.addClass(panel[index], 'show');    
        } 
    }
}
/**
 * 关闭右边面板
 *
 */
function closePartRight() {
    var showPanelButton = document.getElementById('show-panel-button'),
        text = showPanelButton.getElementsByTagName('span')[0],
        partRight = document.getElementsByClassName('part-right')[0];

    ClassUtil.removeClass(partRight, 'part-right-animation');
    ClassUtil.removeClass(partRight, 'show');
    text.innerHTML = '筛选条件';
}

/**
 * 点击顶部导航栏
 */
var firstMenu = document.getElementsByClassName('first-menu')[0];

(function() {
    var headerLi = document.getElementsByClassName('header-ul')[0].getElementsByTagName('li');

        for (let i = 0; i < headerLi.length; i++) {
            EventUtil.addHandler(headerLi[i], 'click', headerLicallback);
        }

        function headerLicallback(e) {
            var content = e.target.innerHTML,
                thisIndex = e.currentTarget.getAttribute('data-index');
                list = firstMenu.getElementsByTagName('li');

            // 判断已经是否存在这个list项
            for(let i = 0, index; i < list.length; i++) {
                index = list[i].getAttribute('data-index');
                if (index === thisIndex) {
                    switchPartContainer(thisIndex);
                    return;
                }
            } 

            // 创建一个菜单栏
            createLi(content);
            // 初始化请求放在这儿
            if (thisIndex == 0) {
                initprizeContainer();
            } 
            if (thisIndex == 3) {
                getAutidingListRequest();
            }
            // 切换不同的面板
            switchPartContainer(thisIndex);
        }
})();

/**
 * 根据内容创建一个列表顶
 * @param {string} content 标题栏的内容
 */
function createLi(content) {
    
    var thisContent = firstMenu.getElementsByTagName('a');

    if (typeof(thisContent) != 'undefined') {
        for (let i = 0; i < thisContent.length; i++) {
            if (content == thisContent[i].innerHTML) {
                if (thisContent[i].innerHTML == '奖项详情' || thisContent[i].innerHTML == '搜索结果' || thisContent[i].innerHTML == '成员详情' ) {
                return;
                }
            }
        }
    }

    var docFragment = document.createDocumentFragment(),
        li = document.createElement('li'),
        a = document.createElement('a'),
        button = document.createElement('button'),
        text = document.createTextNode(content);
        

    a.setAttribute('href', 'javascript:');
    button.setAttribute('class', 'close-button');
    a.appendChild(text);
    li.appendChild(a);
    li.appendChild(button);

    

    switch (content) {
        case '所获奖项': {
            li.setAttribute('data-index', 0);
            break;
        } case '成员信息': {
            li.setAttribute('data-index', 1);
            break;
        } case '导入导出': {
            li.setAttribute('data-index', 2);
            break;
        } case '审核用户': {
            li.setAttribute('data-index', 3);
            break;
        } case '搜索结果': {
            li.setAttribute('data-index', 4);
            break;
        } case '奖项详情': {
            li.setAttribute('data-index', 5);
            break;
        } case '成员详情': {
            li.setAttribute('data-index', 6);
        }
    }

    docFragment.appendChild(li);
    firstMenu.appendChild(docFragment);
    EventUtil.addHandler(button, 'click', closePartCallback);
    EventUtil.addHandler(li, 'click',Licallback);
} 
// 

/**
 * 点击某个li的时的callback函数
 * @param {Event} e 
 */
function Licallback(e) {
    e.stopPropagation();
    
    var index = e.currentTarget.getAttribute('data-index');

    switchPartContainer(index);
}

/**
 * 关闭某个菜单
 * @param {Event} e 
 */
function closePartCallback(e) {
    // 阻止冒泡
    e.stopPropagation();

    var thisLi = e.target.parentNode,
        lastLi = thisLi.previousSibling,
        nextLi = thisLi.nextSibling,
        thisPart = document.getElementsByClassName('show')[0],
        thisIndex = thisLi.getAttribute('data-index'),
        partLeft = document.getElementsByClassName('part-left-main')[0];
        // 

    // 关闭当前的part

    ClassUtil.removeClass(thisPart, 'show');

    // 判断前面是否还有菜单
    if (lastLi != null) {
        lastIndex = lastLi.getAttribute('data-index');
        switchPartContainer(lastIndex);
    }

    // 判断后面是否还是有菜单
    if (nextLi != null) {
        nextIndex = nextLi.getAttribute('data-index');
        switchPartContainer(nextIndex);
    }

    // 解除事件绑定
    EventUtil.removeHandler(e.target, 'click', closePartCallback);

    EventUtil.removeHandler(thisLi, 'click', Licallback);
    // 删除这个list
    firstMenu.removeChild(e.target.parentNode);
}
/**
 * 切换所有的面板函数
 * 通过添加或者删除一个类show来实现
 * @param {int} index 
 * 0 代表 奖项
 * 1 代表 成员信息
 * 2 代表 导入导出功能
 * >3 代表详细的奖项操作页面或成员操作页面
 */
function switchPartContainer(index) { 
    var everyPart = document.getElementsByClassName('part'),
        li = firstMenu.getElementsByTagName('li'),
        thisIndex;
        
    for (let i = 0; i < everyPart.length; i++) {
        ClassUtil.removeClass(everyPart[i], 'show');
        thisIndex = everyPart[i].getAttribute('data-index');
        if (thisIndex == index) {
            // 切换到这个容器
            ClassUtil.addClass(everyPart[i], 'show');
        }
    }
    
    for (let i = 0; i < li.length; i++) {

        thisIndex = li[i].getAttribute('data-index');

        ClassUtil.removeClass(li[i], 'first-menu-li-acitve');

        if (thisIndex == index) {
            ClassUtil.addClass(li[i], 'first-menu-li-acitve');
        }
    }
    //关闭上次打开的操作面板
    closePartRight();

    //打开新的操作面板
    showPartRight();
}
   
// 用于记录每一条奖项的索引
// 如果是多次调用初始化，会将其重置为0
var prizeIndex = 0;

/**
 * 初始化奖项容器
 */
function initprizeContainer() {
    var prizeUl = document.getElementsByClassName('prize-container')[0].getElementsByTagName('ul')[0];
        data = {
            page: 0, 
            awardTime: "",
            awardLevel: "",
            rank: ""
        };

    //请求粗略信息URL
    window.prizeURL = 'http://' + ip + ':8080/qginfosystem/awardinfo/queryawardinfo';
    
    AjaxUtil.post(prizeURL, data, 'json', 'application/json', successCallback, errorCallback);
    
    function successCallback(r) {
        if (r.status === '1') {
            console.log(r);
            var num = r.awardInfoList.length;
            // 清空ul
            prizeUl.innerHTML = '';

            // 每次初始化都要置为0
            prizeIndex = 0;

            // 初始化的时候已经请求过一次了,所以page加一
            queryPrizeData.page++;

            //根据返回的数量创建奖项列表
            createPrize(num, r.awardInfoList);

            // 监听每一个奖项
            li = prizeUl.getElementsByTagName('li');

            $(prizeUl).on('click', 'li', function(e) {
                if ($(event.target).parents('li')) {
                    var ID = $(event.target).parents('li')[0].getAttribute('data-id');
                    viewPrizeDetail(ID);
                }
                
            });
        }
    }
    function errorCallback() {
        showMessage("网络状况好像不太好~");
    }
}

// 用于记录请求数据
var queryPrizeData = {
    page: 0,
    awardTime:"",
    awardLevel:"",
    rank:""
};

// 查询状态常量
var queryflag;
/**
 * 根据条件翻页请求
 */
function queryMorePrize() {

    AjaxUtil.post(prizeURL, queryPrizeData, 'json', 'application/json', successCallback, errorCallback);
      
    function successCallback(r) {
        if (r.status === '1') {
            console.log(r);
            var num = r.awardInfoList.length;
            createPrize(num, r.awardInfoList);
            queryPrizeData.page++;
            queryflag = true;
            console.log(queryPrizeData);
        } else if (r.status === '10') {
            queryflag = false;
            var morePrizeButtonContainer = document.getElementsByClassName('more-prize-button-container')[0],
            morePrizeButton = document.getElementById('more-prize-button'),
            text = morePrizeButtonContainer.getElementsByTagName('span')[0];
            text.innerHTML = '没有更多结果了';
            ClassUtil.addClass(morePrizeButton, 'hide');
        }
    }
    function errorCallback() {
        showMessage("网络状态似乎不太好");
    }  
}

/**
 * 懒加载奖项翻页
 */
(function() {
    var morePrizeButtonContainer = document.getElementsByClassName('more-prize-button-container')[0],
        morePrizeButton = document.getElementById('more-prize-button'),
        text = morePrizeButtonContainer.getElementsByTagName('span')[0];

    EventUtil.addHandler(morePrizeButton, 'click', function() {
        
        text.innerHTML = '加载中...';
        ClassUtil.addClass(morePrizeButton, 'hide');
        
        // 请求更多数据
        queryMorePrize();
    
        setTimeout(()=>{
            if (queryflag === false) {
                text.innerHTML = '没有更多结果了';
            } else if (queryflag === true) {
                text.innerHTML = '';
                ClassUtil.removeClass(morePrizeButton, 'hide');
            }
        }, 1000);
    });
})();

/**
 * 根据数量创建奖项模板
 * @param {int} num 
 */
function createPrize(num, data) {
    var prizeContainer = document.getElementsByClassName('prize-container')[0],
        prizeUl = prizeContainer.getElementsByTagName('ul')[0],
        prizeModel = `
                        <a href="javascript:">
                            <div class="prize-img-container">
                                <img src="" class="prize-img">
                            </div>
                            <div class="prize-info-container">
                                <h1 class="prize-name"></h1>
                                <p class="prize-time-container"><span class="prize-time"></span></p>
                                <p><span class="prize-people"></span></p>                                
                            </div>
                        </a>
                    `,
        docFragment = document.createDocumentFragment();
    
    for (let i = 0; i < num; i++) {
        newNode = document.createElement('li');
        newNode.innerHTML = prizeModel;
        docFragment.appendChild(newNode);
    } 

    prizeUl.appendChild(docFragment);

    // 填充奖项的信息
    (function addPrize(data) {
        var prizeLi = prizeUl.getElementsByTagName('li'),
            prizeImg = prizeUl.getElementsByClassName('prize-img'),
            prizeName = prizeUl.getElementsByClassName('prize-name'),
            prizeTime = prizeUl.getElementsByClassName('prize-time'),
            prizePeople = prizeUl.getElementsByClassName('prize-people'),
            imgURL;

        for (let i = prizeIndex, j = 0; i <  prizeIndex + num; i++, j++) {
            imgURL = 'http://' + ip + ':8080/qginfosystem/img/' + data[j].url;
            prizeLi[i].setAttribute('data-id', data[j].awardId);
            prizeImg[i].setAttribute('src', imgURL);
            prizeName[i].innerHTML = data[j].awardName;
            prizeTime[i].innerHTML = data[j].awardTime;
            prizePeople[i].innerHTML = data[j].joinStudent;
        }
    })(data);

    // 记录上一次请求创建的奖项数量的位置
    prizeIndex += num;
}
var PartUtil = function() {
    
    this.createPartHeader = function() {
        var docFragment = document.createDocumentFragment(),
        li = document.createElement('li'),
        a = document.createElement('a'),
        button = document.createElement('button'),
        text = document.createTextNode(content);

        a.setAttribute('href', 'javascript:');
        button.setAttribute('class', 'close-button');
        a.appendChild(text);
        li.appendChild(a);
        li.appendChild(button);

        switch (content) {
            case '所获奖项': {
                li.setAttribute('data-index', 0);
                break;
            } case '成员信息': {
                li.setAttribute('data-index', 1);
                break;
            } case '导入导出': {
                li.setAttribute('data-index', 2);
                break;
            } case '审核页面': {
                li.setAttribute('data-index', 3);
                break;
            } case '搜索结果': {
                li.setAttribute('data-index', 4);
                break;
            } default: {
                // 详细容器
                li.setAttribute('data-index', 5);
            }
        }
        docFragment.appendChild(li);
        firstMenu.appendChild(docFragment);
        EventUtil.addHandler(button, 'click', closePartCallback);
        EventUtil.addHandler(li, 'click',Licallback);
    },
    /**
     * 点击某个li的时的callback函数
     * @param {Event} e 
     */
    this.Licallback = function(e) {
        e.stopPropagation();
        
        var index = e.currentTarget.getAttribute('data-index');

        this.switchPart(index);
    },
    /**
     * 关闭某个菜单
     * @param {Event} e 
     */
    this.closePartCallback = function(e) {
        // 阻止冒泡
        e.stopPropagation();
    
        var thisLi = e.target.parentNode,
            lastLi = thisLi.previousSibling,
            nextLi = thisLi.nextSibling,
            thisPart = document.getElementsByClassName('show')[0],
            thisIndex = thisLi.getAttribute('data-index'),
            partLeft = document.getElementsByClassName('part-left-main')[0];
            // 
    
        // 关闭当前的part
    
        ClassUtil.removeClass(thisPart, 'show');
    
        // 判断前面是否还有菜单
        if (lastLi != null) {
            lastIndex = lastLi.getAttribute('data-index');
            this.switchPart(lastIndex);
        }
    
        // 判断后面是否还是有菜单
        if (nextLi != null) {
            nextIndex = nextLi.getAttribute('data-index');
            this.switchPart(nextIndex);
        }
    
        // // 如果是详细类的容器，那么关闭的时候要把它移除
        // if (thisIndex >= 3) {
        //     partLeft.removeChild(thisPart);
        // }
    
        // 解除事件绑定
        EventUtil.removeHandler(e.target, 'click', this.closePartCallback);
    
        EventUtil.removeHandler(thisLi, 'click', this.Licallback);
        // 删除这个list
        firstMenu.removeChild(e.target.parentNode);
        detailIndex--;
    },
    this.switchPart = function() {
        var everyPart = document.getElementsByClassName('part'),
        li = firstMenu.getElementsByTagName('li'),
        thisIndex;
        
        for (let i = 0; i < everyPart.length; i++) {
            ClassUtil.removeClass(everyPart[i], 'show');
            thisIndex = everyPart[i].getAttribute('data-index');
            if (thisIndex == index) {
                // 切换到这个容器
                ClassUtil.addClass(everyPart[i], 'show');
            }
        }
        
        for (let i = 0; i < li.length; i++) {

            thisIndex = li[i].getAttribute('data-index');

            ClassUtil.removeClass(li[i], 'first-menu-li-acitve');

            if (thisIndex == index) {
                ClassUtil.addClass(li[i], 'first-menu-li-acitve');
            }
        }
        //关闭上次打开的操作面板
        this.closePartRight();

        //打开新的操作面板
        this.showPartRight();
    },
    this.closePartRight = function() {
        var showPanelButton = document.getElementById('show-panel-button'),
        text = showPanelButton.getElementsByTagName('span')[0],
        partRight = document.getElementsByClassName('part-right')[0];

        ClassUtil.removeClass(partRight, 'part-right-animation');
        ClassUtil.removeClass(partRight, 'show');
        text.innerHTML = '筛选条件';
    },

    this.flag = true,

    this.showPartRight = function() {
        var showPanelButton = document.getElementById('show-panel-button'),
            text = showPanelButton.getElementsByTagName('span')[0],
            partRight = document.getElementsByClassName('part-right')[0],
            panel = document.getElementsByClassName('panel');
    
        // 为按钮绑定一次事件就够了
        if (flag === true) {
            EventUtil.addHandler(showPanelButton, 'click', fn);
            flag = null;
        } 

        function fn() {    
            if (ClassUtil.hasClass(partRight, 'part-right-animation')) {
                ClassUtil.removeClass(partRight, 'part-right-animation');
                text.innerHTML = '筛选条件';
            } else {
                ClassUtil.addClass(partRight, 'part-right-animation');
                text.innerHTML = '收起';
            }
        }

        var partLeft = document.getElementsByClassName('part-left-main')[0],
            thisPart =  partLeft.getElementsByClassName('show')[0],
            index;
        
        if (typeof(thisPart) === 'undefined') {
            // 展示初始化的页面
            
        } else {
            index = thisPart.getAttribute('data-index');
            // 只有两种页面需要展示右边栏
            if ( index == 1 || index == 0 ) {
                ClassUtil.addClass(partRight, 'show');
                ClassUtil.removeClass(panel[0], 'show');
                ClassUtil.removeClass(panel[1], 'show');
                ClassUtil.addClass(panel[index], 'show');    
            } 
        }
    }
};

/**
 * 奖项的详细页面
 */

function viewPrizeDetail(ID) {
    var prizeDetailContainer = document.getElementsByClassName('prize-detail-container')[0];
        model = ` 
                 <div class="prize-detail-container-left">
                <div class="prize-detail-img-container">
                    <img src="" id="prize-detail-img">
                </div>
                <div class="introduction-container">
                    <textarea id="introduction" cols="30" rows="10" readonly></textarea>
                </div>
            </div>
            <div class="prize-detail-container-right">
                <ul>
                    <li>
                        <label for="">奖项名称</label>
                        <div class="prize-input-container">
                            <input type="text" class="prize-detail-input" readonly>
                        </div>
                    </li>
                    <li>
                        <label for="">奖项编号</label>
                        <div class="prize-input-container">
                            <input type="text" class="prize-detail-input" readonly>
                        </div>
                    </li>
                    <li>
                        <label for="">获奖时间</label>
                        <div class="prize-input-container">
                            <input type="text" class="prize-detail-input" readonly>
                        </div>
                    </li>
                    <li>
                        <label for="">获奖项目</label>
                        <div class="prize-input-container">
                            <input type="text" class="prize-detail-input" readonly>
                        </div>
                    </li>
                    <li>
                        <label for="">获奖部门</label>
                        <div class="prize-input-container">
                            <input type="text" class="prize-detail-input" readonly>
                        </div>
                    </li>
                    <li>
                        <label for="">获奖级别</label>
                        <div class="prize-input-container" style="margin-right: 10px;">
                            <input type="text" style="width: 213px;" class="prize-detail-input" readonly>
                        </div>
                        <label for="">获奖等级</label>
                        <div class="prize-input-container" >
                            <input type="text" style="width: 213px;" class="prize-detail-input" readonly>
                        </div>
                    </li>
                    <li>
                        <label for="">指导老师</label>
                        <div class="prize-input-container">
                            <input type="text" class="prize-detail-input" readonly>
                        </div>
                    </li>
                    <li>
                        <label for="">参赛学生</label>
                        <div class="prize-input-container">
                            <input type="text" class="prize-detail-input" readonly>
                        </div>
                    </li>
                </ul>
                <div class="prize-button-container">
                    <button>修改</button>
                    <button>删除</button>
                </div>
            </div>
        `;
    var prizeInfoURL = 'http://' + ip + ':8080/qginfosystem/awardinfo/getawardinfo';
    
    prizeDetailContainer.innerHTML = model;

    AjaxUtil.post(prizeInfoURL, {awardId: ID}, 'json', 'application/json', successCallback, errorCallback);
    
    function successCallback(r) {
        if (r.status === '1') {
            var prizeDetailImg = document.getElementById('prize-detail-img'),
                introduction = document.getElementById('introduction'),
                prizeDetail = document.getElementsByClassName('prize-detail-input');
                imgURL = 'http://' + ip +':8080/qginfosystem/img/' + r.awardInfo.url;

            //填充信息
            prizeDetailImg.setAttribute('src', imgURL);
            introduction.innerHTML = r.awardInfo.awardDescription;
            prizeDetail[0].value = r.awardInfo.awardName;
            prizeDetail[1].value = r.awardInfo.awardId;
            prizeDetail[2].value = r.awardInfo.awardTime;
            prizeDetail[3].value = r.awardInfo.awardProject;
            prizeDetail[4].value = r.awardInfo.department;
            prizeDetail[5].value = r.awardInfo.awardLevel;
            prizeDetail[6].value = r.awardInfo.rank;
            prizeDetail[7].value = r.awardInfo.leadTeacher;
            prizeDetail[8].value = r.awardInfo.joinStudent;

            // createLi(r.awardInfo.awardName);
            createLi('奖项详情');

            switchPartContainer(5);
        }
    }
    function errorCallback() {
        showMessage('网络似乎不太好哦~');
    }   
}


/**
 * 下拉框插件
 */
(function() {
    var selectPlugin = document.getElementsByClassName('select-plugin'),
        selectButton = document.getElementsByClassName('prize-select-button'),
        commitButton = document.getElementById('commit-search-prize-button');

    for (let i = 0; i < selectButton.length; i++) {
        EventUtil.addHandler(selectButton[i], 'click', callback);
    }

    function callback(e) {
        e.stopPropagation();
        var thisPlugin = e.target.parentNode;
            li = thisPlugin.getElementsByTagName('li');
            option = thisPlugin.getElementsByTagName('span')[0];

        
        // 防止重复打开下拉项
        for (let i = 0; i < selectPlugin.length; i++) {
            if (selectPlugin[i] != thisPlugin) {
                if (ClassUtil.hasClass(selectPlugin[i], 'show-option-container')) {
                    closeOption(selectPlugin[i]);
                }
            }
        }

        ClassUtil.toggleClass(thisPlugin, 'show-option-container');

        $(li).on('click', function() {
            option.innerHTML = this.innerHTML;
            closeOption(thisPlugin);
        });
    }

    // 关闭下拉栏
    function closeOption(obj) {
        ClassUtil.removeClass(obj, 'show-option-container');
    }

    // 给日历下拉框添加年份
    (function addDateOptions() {
        var dataOptions = document.getElementById('date-options'),
        thisYear = new Date().getFullYear(),
        docFragment = document.createDocumentFragment(),
        li, text;

        for (let i = 2007; i <= thisYear; i++) {
            li = document.createElement('li');
            text = document.createTextNode(i);
            li.appendChild(text);
            docFragment.appendChild(li);
        }

        dataOptions.appendChild(docFragment);
    })();

    EventUtil.addHandler(commitButton, 'click', queryPrizeByOptions);

    // 发送请求
    function queryPrizeByOptions() {
        var prizeUl = document.getElementsByClassName('prize-container')[0].getElementsByTagName('ul')[0];
            optionsSpan = document.getElementsByClassName('option'),
            options = new Array();

        for (let i = 0; i < optionsSpan.length; i++) {
            if (optionsSpan[i].innerHTML === '所有') {
                options[i] = '';
            } else {
                options[i] = optionsSpan[i].innerHTML;
            }
        }

        queryPrizeData.page = 0;
        queryPrizeData.awardTime =  options[0];
        queryPrizeData.awardLevel = options[1];
        queryPrizeData.rank = options[2];
        console.log(queryPrizeData);
        // 把容器重置为空
        prizeUl.innerHTML = '';
        debugger
        // 索引重置为0
        prizeIndex = 0;

        //重置懒加载按钮
        var morePrizeButtonContainer = document.getElementsByClassName('more-prize-button-container')[0],
        morePrizeButton = document.getElementById('more-prize-button'),
        text = morePrizeButtonContainer.getElementsByTagName('span')[0];
        text.innerHTML = '';
        ClassUtil.removeClass(morePrizeButton, 'hide');

        //根据条件查询
        queryMorePrize();
    }
})();

/**
 * @version 1.1
 * @description 打开查看成员信息时候显示多个成员信息的列表的函数.筛选功能填完整后，将这个筛选的结果放在整个区域类名为member-information-list-container的div中。
 * 然后加载更多则会在这个类的group和grade属性进行获取。
 */
function informationListContainer() {
    // 初始化页数
    var page;

    /**
     * @description 对页面进行初始化并第一次发送请求,测试用
     */
    (function() {
        console.log()
        page = 0;
        $('.member-information-list-container')[0].innerHTML = '';
        var grade = $('.member-information-list-container').attr('grade'),
            group = $('.member-information-list-container').attr('group');
        if (grade == '全部') {
            grade = '';
        }
        if (group == '全部') {
            group = '';
        }
        informationListRequest(group, grade);
    })();

    /**
     * @description 对列表区进行添加元素
     * @param {JSON Object} jsonObj 传回的json对象
     */
    function informationListRenew(jsonObj) {
        var container = $('.member-information-list-container')[0],
            i,
            userinfoArr = jsonObj.userInfoList;
        for (i = 0; i < userinfoArr.length; i++) {
            container.innerHTML += '<li userinfoid=' + userinfoArr[i].userInfoId + '>'
                                + '<img src="http://'+ window.ip +':8080/qginfosystem/userImg/'+ userinfoArr[i].url +'?='+ Math.random() + '">'  
                                + '<div>'
                                + '<span>'+ userinfoArr[i].name +'</span>'
                                + '<span>' + userinfoArr[i].grade + userinfoArr[i].group + '</span>'
                                + '</div>'
                                + '</li>'
        }
    }

    /**
     * @description 加载更多的函数
     * @param {object} event 事件对象
     */
    function loadMoreListen(event) {
        var grade = $('.member-information-list-container').attr('grade'),
            group = $('.member-information-list-container').attr('group');
        if (grade == '全部') {
            grade = '';
        }
        if (group == '全部') {
            group = '';
        }
        if (event.type == 'click') {
            // 第一次进行加载更多的时候，对点击事件进行移除
            EventUtil.removeHandler($('.menber-container .turn-page-button')[0], 'click', loadMoreListen);
            $('.menber-container .turn-page-button')[0].innerText = '向下滚动加载更多...';
            informationListRequest(group, grade);
        } else {
            if ($('.part-left').scrollTop() + $('.part-left')[0].clientHeight - 59 >= parseInt($('.member-information-list-container').css('height')) && 
                ((event.wheelDelta && event.wheelDelta < 0) || (event.detail && event.detail < 0))) {
                // 移除鼠标监听事件，避免同一时间多次请求
                // EventUtil.removeHandler($('.part-left')[0], 'mousewheel', loadMoreListen);
                $('.part-left')[0].onmousewheel = null;
                informationListRequest(group, grade);
            }
        }
        
    }
    $('.menber-container .turn-page-button')[0].onclick = loadMoreListen;
    // EventUtil.addHandler($('.menber-container .turn-page-button')[0], 'click', loadMoreListen);


    /**
     * @description 成员列表展示的请求函数
     * @param {String} group 组别
     * @param {String} grade 年级
     * @param {String} page 页数
     */
    function informationListRequest(group, grade) {
        var jsonObj = {};

        jsonObj.grade = grade;
        jsonObj.group = group;
        jsonObj.page = page;

        $.ajax({
            url: 'http://'+ window.ip +':8080/qginfosystem/userinfo/queryuserinfo',
            type: 'post',
            data: JSON.stringify(jsonObj),
            dataType: 'json',
            processData: false,
            contentType: 'application/json',
            success: function(responseObj) {
                
                switch(responseObj.status) {
                    case '1': {
                        // 请求完毕后统一加一页
                        informationListRenew(responseObj);
                        if (page != 0) {
                            // EventUtil.addHandler($('.part-left')[0], 'mousewheel', loadMoreListen);  // 加载完毕后重新添加点击事件，防止一次请求多次，请求时候立刻移除鼠标事件。
                            $('.part-left')[0].onmousewheel = loadMoreListen;
                        }
                        page++;
                        break;
                    }

                    case '2': {
                        
                        break;
                    }

                    case '10': {
                        $('.menber-container .turn-page-button')[0].innerText = '已经到底了...';
                        $('.menber-container .turn-page-button').css('background-color', '#C1C1C1');
                        $('.menber-container .turn-page-button').css('color', '#424242')
                        break;
                    }
                }
                
            },
            error: function() {
                // 请求失败时要干什么
                showMessage('请求失败');
            }
        });
    }
}

/**
 * @description 对成员列表添加事件监听，在页面渲染完毕后添加事件监听，一直到程序结束,这个区域的事件监听无论这个区域加载多少个子项，都能够进行，只需要调用一次。
 */
(function() {

    function filterClickListen(event) {
        switch(event.target) {
            case $('.info-button-container>span')[0]:
            case $('.info-button-layer>span')[0]:
            case $('.info-button-container .info-button-layer')[0]: {
                // 筛选后按确定按钮的时候执行
                $('.member-information-list-container').attr('grade', $('.grade-condition-container .swtich-select-container>span')[0].innerText);
                $('.member-information-list-container').attr('group', $('.major-condition-container .swtich-select-container>span')[0].innerText);
                $('.member-information-list-container')[0].innerHTML = '';
                informationListContainer();
                break;
            }
        }
    }
    // 筛选框的事件监听
    EventUtil.addHandler($('.info-list-panel')[0], 'click', filterClickListen);

    /**
     * @description 对下拉列表的展示
     * @param {object} target 传入的节点
     */
    function infoListAnimate(target) {
        event.stopPropagation();
        if (ClassUtil.hasClass(target, 'info-list-animate') == false) {
            $(target).css('display', 'block');
            setTimeout(function() {
                ClassUtil.addClass(target, 'info-list-animate')
            }, 10);
        }
    }
    // 展示下拉表的事件监听
    EventUtil.addHandler($('.grade-condition-container .swtich-select-container')[0], 'click', function() {
        var i = 0; 
        // 对组别的下拉栏进行隐藏
        inforListHidden($('.group-select-list'));
        // 对下拉列表已经选择的进行初始化
        for (i = 0; i < $('.grade-select-list ul li').length; i++) {
            // 循环将之前具有这个类名去除掉
            ClassUtil.removeClass($('.grade-select-list ul li')[i], 'info-list-active');
            if ($('.grade-select-list ul li')[i].innerText == $('.grade-select-list ul').attr('choice-text')) {
                // 循环到已经上次选择相同时候，进行添加类标注出来
                ClassUtil.addClass($('.grade-select-list ul li')[i], 'info-list-active')
            }
        }
        infoListAnimate($('.grade-select-list')[0]);
    });
    EventUtil.addHandler($('.major-condition-container .swtich-select-container')[0], 'click', function() {
        var i = 0; 
        // 对年级的下拉栏进行隐藏
        inforListHidden($('.grade-select-list'));
        // 对下拉列表已经选择的进行初始化
        for (i = 0; i < $('.group-select-list ul li').length; i++) {
            ClassUtil.removeClass($('.group-select-list ul li')[i], 'info-list-active')
            if ($('.group-select-list ul li')[i].innerText == $('.group-select-list ul').attr('choice-text')) {
                ClassUtil.addClass($('.group-select-list ul li')[i], 'info-list-active')
            }
        }
        infoListAnimate($('.group-select-list')[0]);
    });

    /**
     * @description 下拉列表的隐藏
     */
    function inforListHidden($targetList) {
            ClassUtil.removeClass($targetList[0], 'info-list-animate');
            setTimeout(function() {
                $targetList.css('display', 'none');
            }, 300);
    }

    /**
     * 
     * @param {object} event 对下拉列表的点击事件监听
     */
    function downListClickListen(event) {
        // 阻止事件冒泡
        event.stopPropagation();
        // 选择的内容
        var text = event.target.innerText;
        if ($(event.target).parents('div:eq(0)').hasClass('grade-select-list') == true) {
            $('.grade-condition-container .swtich-select-container>span')[0].innerText = text;
            inforListHidden($('.grade-select-list'));
        }
        if ($(event.target).parents('div:eq(0)').hasClass('group-select-list') == true) {
            $('.major-condition-container .swtich-select-container>span')[0].innerText = text;
            inforListHidden($('.group-select-list'));
        }
        // 赋值这个属性，下次会显示上次已经选择的属性
        $(event.target).parents('ul:eq(0)').attr('choice-text', text)
        console.log($(event.target).parents('ul:eq(0)')[0])
    }
    // 添加事件监听
    for (i = 0; i < 2; i++) {
        EventUtil.addHandler($('.info-select-list')[i], 'click', downListClickListen);
    }

    /**
     * @description 遮罩层的动画
     * @param {String} eventType 遮罩层的事件名称
     */
    function filterButtonMousemoveListen(event) {
        // 执行遮罩层动画
        if (event.type == 'mouseover' && ClassUtil.hasClass($('.info-button-layer')[0], 'info-button-layer-animate') == false) {
            ClassUtil.addClass($('.info-button-layer')[0], 'info-button-layer-animate');
        }

        // 取消遮罩层动画
        if (event.type == 'mouseleave' && ClassUtil.hasClass($('.info-button-layer')[0], 'info-button-layer-animate') == true) {
            ClassUtil.removeClass($('.info-button-layer')[0], 'info-button-layer-animate');
        }
    }
    // 添加事件监听
    $('.info-button-layer')[0].onmouseover = filterButtonMousemoveListen;
    $('.info-button-layer')[0].onmouseleave = filterButtonMousemoveListen
    $('.info-button-container>span')[0].onmouseover = filterButtonMousemoveListen;
    $('.info-button-container>span')[0].onmouseleave = filterButtonMousemoveListen;

    /**
     * @description 鼠标移动事件进行显示或者隐藏组员的组别
     */
    function showInformationGroup(eventType) {
        // 当鼠标在这个列表的上方的时候，显示组别
        if (eventType == 'mouseover') {
            if (ClassUtil.hasClass($(this).children('div')[0], 'show-member-group') == false) {
                ClassUtil.addClass($(this).children('div')[0], 'show-member-group')
            }
        } else {
            // 当鼠标在这个列表的某一项上方离开的时候，隐藏组别
            if (ClassUtil.hasClass($(this).children('div')[0], 'show-member-group') == true) {
                ClassUtil.removeClass($(this).children('div')[0], 'show-member-group')
            }
        }
        
    }

    /**
     * @description 鼠标移动到列表或者鼠标离开列表时候的监听事件函数
     * @param {object} event 鼠标监听事件对象
     */
    function infoListConMousemoveListen(event) {
        // 当鼠标事件为在这个块上边的时候
        if (event.type == 'mouseover') { 
            if (event.target.tagName == 'LI') {
                showInformationGroup.call(event.target, event.type);
            } else if (typeof $(event.target).parents('li')[0] != 'undefined'
                      && $(event.target).parents('li')[0].tagName == 'LI') {
                showInformationGroup.call($(event.target).parents('li')[0], event.type);
            }
        }

        // 当鼠标事件为离开的时候
        if (event.type == 'mouseout') {
            if (event.target.tagName == 'LI') {
                showInformationGroup.call(event.target, event.type);
            } else if (typeof $(event.target).parents('li')[0] != 'undefined' 
                      && $(event.target).parents('li')[0].tagName == 'LI') {
                showInformationGroup.call($(event.target).parents('li')[0], event.type);
            }
        }
    }

    /**
     * @description 对个人信息查看表的监听
     * @param {object} event 事件监听对象
     */
    function informationListClickListen(event) {
        var containerTag = null;
        if (event.target.tagName == 'LI') {
            containerTag = event.target;
            informationDetailRequest(containerTag.getAttribute('userinfoid'));  // 根据
        } else if ($(event.target).parents('li')[0]) {
            containerTag = $(event.target).parents('li')[0];
            // if 
            informationDetailRequest(containerTag.getAttribute('userinfoid'));
        }
        
    }
    EventUtil.addHandler($('.member-information-list-container')[0], 'click', informationListClickListen);
    EventUtil.addHandler($('.member-information-list-container')[0], 'mouseover', infoListConMousemoveListen);
    EventUtil.addHandler($('.member-information-list-container')[0], 'mouseout', infoListConMousemoveListen);
    // 隐藏下拉框
    EventUtil.addHandler(document, 'click', function() {
        var i;
        for (i = 0; i < 2; i++) {
            inforListHidden($('.info-select-list:eq('+ i +')'));
        }
    });
    // 切换为查看成员粗略信息的时候的事件监听
    EventUtil.addHandler($('.header-ul li')[1], 'click', function() {
        // 先初始化筛选部分
        $('.member-information-list-container').attr('group', '全部');
        $('.member-information-list-container').attr('grade', '全部');
        $('.grade-condition-container .swtich-select-container span')[0].innerText = '全部';
        $('.major-condition-container .swtich-select-container span')[0].innerText = '全部';
        $('.grade-select-list ul').attr('choice-text', '全部');
        $('.group-select-list ul').attr('choice-text', '全部');
        informationListContainer();
    });
})();

/**
 * @description 查看成员的具体信息的请求函数
 */
function informationDetailRequest(userInfoId) {
    var jsonObj = {};

    jsonObj.userInfoId = userInfoId;

    $.ajax({
        url: 'http://'+ window.ip +':8080/qginfosystem/userinfo/getuserinfo',
        type: 'post',
        data: JSON.stringify(jsonObj),
        dataType: 'json',
        processData: false,
        contentType: 'application/json',
        success: function(responseObj) {
            switch(responseObj.status) {
                case '1': {
                    // 更新详细页面
                    infoDetailPageRenew(responseObj);

                    // 进行页面的跳转
                    createLi('成员详情');
                    switchPartContainer(6);

                    break;
                }

                case '9': {
                    
                    break;
                }
            }
            
        },
        error: function() {
            // 请求失败时要干什么
            showMessage('请求失败');
        }
    });
}




(function() {
    var chartType = '';
    /**
     * @description 按钮的遮罩层动画
     * @param {DOM Object} target 目标节点标签对象
     */
    function loadOptionAnimate(target, event) {
        // 添加遮罩层动画
        if ($(target).hasClass('load-button-active') == false && event.type == 'mouseover') {
            $(target).addClass('load-button-active')
        }
        // 移除遮罩层动画
        if ($(target).hasClass('load-button-active') == true && event.type == 'mouseout') {
            $(target).removeClass('load-button-active');
        }
    }
    EventUtil.addHandler($('.load-button-container')[0], 'mouseover', function(event) {
        // 兼容性
        var event = event || window.event;

        if ($(event.target).parents('li')[0]) {
            // 当目标对象并不是父亲节点时候
            loadOptionAnimate($(event.target).parents('li')[0].getElementsByClassName('load-button-layer')[0], event);
        }
        if (event.target.tagName == 'LI'){
            // 当目标对象是父亲容器的时候
            loadOptionAnimate(event.target.getElementsByClassName('load-button-layer')[0], event);
        }
    });
    EventUtil.addHandler($('.load-button-container')[0], 'mouseout', function(event) {
        // 兼容性
        var event = event || window.event;

        if ($(event.target).parents('li')[0]) {
            // 当目标对象并不是父亲节点时候
            loadOptionAnimate($(event.target).parents('li')[0].getElementsByClassName('load-button-layer')[0], event);
        }
        if (event.target.tagName == 'LI'){
            // 当目标对象是父亲容器的时候
            loadOptionAnimate(event.target.getElementsByClassName('load-button-layer')[0], event);
        }
    });

    var files = null;

    /**
     * @description 读取excel表格的函数
     * @param {String} chartType 读取奖项或者
     */
    function excelReader(chartType) {
        $('#upload-button')[0].onchange = function() {
            var fileReader = new FileReader();
            files = this.files;
            fileReader.onload = function (e) {
                var data = e.target.result,
                    workbook = XLSX.read(data, {type: 'binary'}),
                    // 仅仅读取这个文件的第一张sheet表
                    readArr = XLSX.utils.sheet_to_formulae(workbook.Sheets[workbook.SheetNames[0]]);
                    preViewFiles(chartType, readArr);
            }
            // 以二进制方式打开文件
            fileReader.readAsBinaryString(files[0]);
        }

        /**
         * @description 对上传的文件进行
         * @param {String} chartType excel表的类型，info或者prize
         * @param {Array} readArr 读取内容的数组
         */
        function preViewFiles(chartType, readArr) {
            var i,
                checkSpace = null,
                k,
                text,
                col = 0,
                row = 0,
                lines,
                headArr = null,
                testHeadArr = [];

                // 初始化内容
                // $('.file-preview-head')[0].innerHTML = '';
                $('.file-preview-value')[0].innerHTML = '';

            // 检测表头，需要全部正确
            if (chartType == 'info') {
                headArr = ['成员名字', '成员组别', '所属学院', '年级', '联系电话', '籍贯', 'QQ账号', '常用邮箱', '简介'];
                for (i = 0; i < readArr.length; i++) {
                    if (parseInt(readArr[i].split("='")[0].slice(1)) == 1) {
                        testHeadArr.push(readArr[i].split('=\'')[1]);
                    }
                }
                if (testHeadArr.length != headArr.length || testHeadArr.toString() != headArr.toString()) {
                    showMessage('请输入正确的表头')
                    files = null;
                    return;
                }

            } else {
                headArr = ['奖项名称', '获奖时间', '奖项级别', '奖项等级', '授奖部门', '指导老师', '参赛学生', '奖项简介', '获奖项目'];
                for (i = 0; i < readArr.length; i++) {
                    if (parseInt(readArr[i].split("='")[0].slice(1)) == 1) {
                        testHeadArr.push(readArr[i].split('=\'')[1]);
                    }
                }
                if (testHeadArr.length != headArr.length || testHeadArr.toString() != headArr.toString()) {
                    showMessage('请输入正确的表头')
                    files = null;
                    return;
                }
            }
            // 添加内容
            // 添加新的一列，来进行添加
            // 先添加第一列标题头
            for (i = 1; i <= parseInt(readArr[readArr.length - 1].split("='")[0].slice(1) - 1); i++) {   // 先添加每一列，然后后续再进行添加
                $('.file-preview-value')[0].innerHTML += '<li><ul><li>'+ i +'</li></ul></li>';
            }
            for (i = 0; i < readArr.length; i++) {  // i为数组的下标，要遍历整个数组
                if (checkSpace != null) {
                    row = parseInt(readArr[i].split('=\'')[0].slice(1)) - parseInt(checkSpace.slice(1));
                    col = parseInt(readArr[i].split('=\'')[0].slice(0, 1).charCodeAt(0)) - parseInt(checkSpace.charCodeAt(0));
                    col = col < 0 ? -col : col;
                }
                
                if (!((row == 1 && col == headArr.length - 1) || (row == 0 && col == 1) || row == 0 && col == 0)) {  // 注意有个非符号，当两个不是相邻的时候  
                    if (row == 0) {
                        for (k = 0; k < col - 1; k++) {
                            $('.file-preview-value li ul')[parseInt(checkSpace.slice(1)) - 2].innerHTML +='<li><li>';
                            $('.file-preview-value li ul:eq('+ (parseInt(checkSpace.slice(1)) - 2) +')').children('li').last().remove();
                        }
                    } else {
                        // 把所有整一行为空的填满
                        for (k = parseInt(checkSpace.slice(1)) - 1; k < parseInt(readArr[i].split('=\'')[0].slice(1) - 2); k++) {
                            for (lines = 0; lines < headArr.length; lines++) {
                                $('.file-preview-value li ul')[k].innerHTML +='<li><li>';
                                $('.file-preview-value li ul:eq('+ k +')').children('li').last().remove();
                            }
                        }
                        for (k = 0; k < parseInt(readArr[i].split('=\'')[0].slice(0, 1).charCodeAt(0)) - 'A'.charCodeAt(0); k++) {
                            // console.log(checkSpace.slice(1));
                            $('.file-preview-value li ul')[parseInt(readArr[i].split('=\'')[0].slice(1)) - 2].innerHTML +='<li><li>';
                            $('.file-preview-value li ul:eq('+ (readArr[i].split('=\'')[0].slice(1) - 2) +')').children('li').last().remove();
                        }
                    }
                }
                // text为某一项的内容，这样的循环为了避免内容有'=''时候被截断了
                text = '';
                for (k = 1; k < readArr[i].split('=\'').length; k++) {
                    text += readArr[i].split('\'')[k];
                }
                if (parseInt(readArr[i].split("='")[0].slice(1)) != 1) {  // 去除头一行
                    $('.file-preview-value li ul')[parseInt(readArr[i].split("='")[0].slice(1)) - 2].innerHTML += '<li>' + text + '</li>';  // 对应编号行下面添加内容,这个是竖着来赋值的
                    checkSpace = readArr[i].split('=\'')[0];
                }
            }

        }
    }

    /**
     * @description 对加载页面进行事件监听
     * @param {object} event 事件监听对象
     */
    function loadPageClickListen(event) {
        var i;

        switch(event.target) {
            // 对左边栏进行事件监听
            case $('.load-button-container li>span')[0]:
            case $('.load-button-container .load-button-layer>span')[0]:
            case $('.load-button-container .load-button-layer')[0]: {
                // 转为加载奖项
                for (i = 0; i < 4; i++) {
                    if ($('.load-button-container .load-button-layer:eq('+ i +')').hasClass('load-button-choiced') == true) {
                        $('.load-button-container .load-button-layer:eq('+ i +')').removeClass('load-button-choiced')
                    }
                }
                $('.file-preview-value')[0].innerHTML = '';
                $('.file-preview-head')[0].innerHTML = '';
                headArr = ['奖项名称', '获奖时间', '奖项级别', '奖项等级', '授奖部门', '指导老师', '参赛学生', '奖项简介', '获奖项目'];
                $('.file-preview-head')[0].innerHTML += '<li>序号</li>';
                for (i = 0; i < headArr.length; i++) {
                    $('.file-preview-head')[0].innerHTML +='<li>'+ headArr[i] +'</li>';
                }


                // ClassUtil.addClass($('.load-button-container .load-button-layer')[0], 'load-button-choiced');
                $('.load-button-container .load-button-layer:eq(0)').addClass('load-button-choiced')
                files = null;
                chartType = 'prize'; // 这个是在点击上传时候判断是否有选择上传的excel表格类型
                excelReader('prize');
                break;
            }

            case $('.load-button-container li>span')[1]:
            case $('.load-button-container .load-button-layer>span')[1]:
            case $('.load-button-container .load-button-layer')[1]: {
                // 转为上传信息的表格
                for (i = 0; i < 4; i++) {
                    if ($('.load-button-container .load-button-layer:eq('+ i +')').hasClass('load-button-choiced') == true) {
                        $('.load-button-container .load-button-layer:eq('+ i +')').removeClass('load-button-choiced')
                    }
                }
                $('.file-preview-value')[0].innerHTML = '';
                $('.file-preview-head')[0].innerHTML = '';
                $('.load-button-container .load-button-layer:eq(1)').addClass('load-button-choiced');
                headArr = ['成员名字', '成员组别', '所属学院', '年级', '联系电话', '籍贯', 'QQ账号', '常用邮箱', '简介'];
                $('.file-preview-head')[0].innerHTML += '<li>序号</li>';
                for (i = 0; i < headArr.length; i++) {
                    $('.file-preview-head')[0].innerHTML +='<li>'+ headArr[i] +'</li>';
                }

                files = null;
                chartType = 'info'; // 这个是在点击上传时候判断是否有选择上传的excel表格类型
                excelReader('info');
                break;
            }

            case $('.load-button-container li>span')[2]:
            case $('.load-button-container .load-button-layer>span')[2]:
            case $('.load-button-container .load-button-layer')[2]: {
                // 请求导出奖项表格
                // ClassUtil.addClass($('.load-button-container .load-button-layer')[2], 'load-button-choiced');
                exportPrizeRequest();
                break;
            }

            case $('.load-button-container li>span')[3]:
            case $('.load-button-container .load-button-layer>span')[3]:
            case $('.load-button-container .load-button-layer')[3]: {
                // 请求导出信息excel表格
                // ClassUtil.addClass($('.load-button-container .load-button-layer')[3], 'load-button-choiced');
                exportInfoRequest();
                break;
            }

            // 以下为提交表单时候的事件监听
            case $('#upload-submit')[0]: {
                // 提交文件上传
                if (chartType == '') {
                    showMessage('请选择上传的列表的格式');
                    return;
                }

                if (files == null) {
                    // 未选择上传文件
                    showMessage('请选择文件上传');
                    return;
                }
                if (chartType == 'info') {
                    showConfirm('确定上传此信息文件？', uploadInfoRequest.bind(null, files));
                    // uploadInfoRequest(files);
                } else if (chartType == 'prize') {
                    showConfirm('确定上传此信息文件？', uploadPrizeRequest.bind(null, files));
                    // uploadPrizeRequest(files);
                }
                
                return;
            }

            case $('#cancel-submit')[0]: {
                // 取消文件上传
                // if (files == null) {
                //     // 未选择上传文件
                //     console.log('请选择文件上传');
                //     return;
                // }
                files == null;
                $('.file-preview-head')[0].innerHTML = '';
                $('.file-preview-value')[0].innerHTML = '';
                return;
            }
        }
    }
    /* 导入导出文件的事件监听 */
    EventUtil.addHandler($('.upload-download-container')[0], 'click', loadPageClickListen);

    /**
     * @description 上传文件的接口，这个是对奖项的导入
     * @param {File} file 文件对象的引用
     */
    function uploadPrizeRequest(file) {
        var form = new FormData();
        // form.append("name", );
        form.append("file", file[0]);
        $.ajax({
            url: 'http://'+ window.ip +':8080/qginfosystem/awardinfo/import',
            type: 'post',
            data: form,
            // dataType: 'form/data',
            processData: false,
    	    contentType: false,
            success: function(responseObj) {
                switch(responseObj.status) {
                    case '1': {
                        // 上传成功
                        break;
                    }
                }
                
            },
            error: function() {
                // 请求失败时要干什么
                
            }
        });
    }

    /**
     * @description 上传文件的接口,这个是对成员信息的导入
     * @param {File} file 文件对象的引用
     */
    function uploadInfoRequest(file) {
        var form = new FormData();
        console.log(file)
        form.append("file", file[0]);
        $.ajax({
            url: 'http://'+ window.ip +':8080/qginfosystem/userinfo/import',
            type: 'post',
            data: form,
            dataType: 'json',
            processData: false,
    	    contentType: false,
            success: function(responseObj) {
                switch(responseObj.status) {
                    case '1': {
                        // 上传成功
                        showMessage('上传成功');
                        break;
                    }
                }
                
            },
            error: function() {
                // 请求失败时要干什么
                showMessage('请求失败');
            }
        });
    }

    /**
     * @description 奖项文件的导出
     */
    function exportPrizeRequest() {
        window.location.href = 'http://'+ window.ip +':8080/qginfosystem/awardinfo/export';
    }

    /**
     * @description 成员信息的导出
     */
    function exportInfoRequest() {
        window.location.href = 'http://'+ window.ip +':8080/qginfosystem/userinfo/export';
    }
})();

/**
 * @description 搜索结果页面
 */
(function() {
    var page = 0;

    /**
     * @description 模糊搜索的函数
     */
    function searchRequest() {
        var jsonObj = {},
            url = 'http://'+ window.ip +':8080/qginfosystem/user/queryinfo';
        jsonObj.name = $('#search-input')[0].value;
        jsonObj.page = page;
    
        createLi('搜索结果');
        switchPartContainer(4);

        AjaxUtil.post(url, jsonObj, 'json', 'application/json', successCallback, errorCallback);
        function successCallback(responseObj) {
            switch(responseObj.status) {
                case '1': {
                    // 搜索成功执行
                    if (responseObj.userInfoList.length != 0) { // 创建信息列表
                        informationListRenew(responseObj);
                    }
                    if (responseObj.awardInfoList.length != 0) {  // 创建奖项列表
                        prizeListRenew(responseObj.awardInfoList.length, responseObj.awardInfoList);
                    }
                    if (page != 0) {
                        $('.part-left')[0].onmousewheel = searchLoadMore;
                    }
                    page++;
                    break;
                }

                case '10': {
                    $('.search-container .turn-page-button')[0].innerText = '已经到底了...';
                    $('.search-container .turn-page-button').css('background-color', '#C1C1C1');
                    $('.search-container .turn-page-button').css('color', '#424242')
                    break;
                }
            }
        }   
        function errorCallback() {
            // 请求失败时要干什么
            showMessage('请求失败');
        }
    }

    /**
     * @description 对列表区进行添加元素
     * @param {JSON Object} jsonObj 传回的json对象
     */
    function informationListRenew(jsonObj) {
        var container = $('.search-info-list')[0],
            i,
            userinfoArr = jsonObj.userInfoList;
        for (i = 0; i < userinfoArr.length; i++) {
            container.innerHTML += '<li userinfoid=' + userinfoArr[i].userInfoId + '>'
                                + '<img src="http://'+ window.ip +':8080/qginfosystem/userImg/'+ userinfoArr[i].url +'?='+ Math.random() +'">'  
                                + '<div>'
                                + '<span>'+ userinfoArr[i].name +'</span>'
                                + '<span>' + userinfoArr[i].grade + userinfoArr[i].group + '</span>'
                                + '</div>'
                                + '</li>'
        }
    }

    /**
     * @description 添加奖项列表的数据
     * @param {Number} num 返回的数量
     * @param {*} data 数组
     */
    function prizeListRenew(num, data) {
        var prizeContainer = $('.search-prize-list')[0],
            prizeUl = prizeContainer.getElementsByTagName('ul')[0];
        prizeModel = `
                        <a href="javascript:">
                            <div class="prize-img-container">
                                <img src="" class="prize-img">
                            </div>
                            <div class="prize-info-container">
                                <h1 class="prize-name"></h1>
                                <p class="prize-time-container"><span class="prize-time"></span></p>
                                <p><span class="prize-people"></span></p>                                
                            </div>
                        </a>
                    `,
    docFragment = document.createDocumentFragment();
    console.log(num)
    for (let i = 0; i < num; i++) {

        newNode = document.createElement('li');
        newNode.innerHTML = prizeModel;

        docFragment.appendChild(newNode);
    } 
    prizeUl.appendChild(docFragment);

    (function addPrize(data) {
        var prizeLi = prizeUl.getElementsByTagName('li'),
            prizeImg = prizeUl.getElementsByClassName('prize-img'),
            prizeName = prizeUl.getElementsByClassName('prize-name'),
            prizeTime = prizeUl.getElementsByClassName('prize-time'),
            prizePeople = prizeUl.getElementsByClassName('prize-people'),
            imgURL;

        for (let i = 0, j = 0; i < num; i++, j++) {
            imgURL = 'http://' + ip + ':8080/qginfosystem/img/' + data[j].url;
            prizeLi[i].setAttribute('data-id', data[j].awardId);
            prizeImg[i].setAttribute('src', imgURL);
            prizeName[i].innerHTML = data[j].awardName;
            prizeTime[i].innerHTML = data[j].awardTime;
            prizePeople[i].innerHTML = data[j].joinStudent;

        }

    })(data);
    }

    /**
     * @description 对搜索页面的点击事件进行监听
     * @param {object} event 搜索页面的事件点击
     */
    function searchPageClickListen(event) {
        // 以下是跳转到其他页面的
        var containerTag = null;
        // 当这个点击的目标是成员列表的时候
        if ($(event.target).parents('.search-info-list')[0]) {  // 当这个点击目标是用户信息列表的时候
            var containerTag = null;
            if (event.target.tagName == 'LI') {
                containerTag = event.target;
                informationDetailRequest(containerTag.getAttribute('userinfoid'));  // 根据
            } else if ($(event.target).parents('li')[0]) {
                containerTag = $(event.target).parents('li')[0];
                // if 
                informationDetailRequest(containerTag.getAttribute('userinfoid'));
            }
        } 
        if ($(event.target).parents('.search-prize-list')[0]) {  // 当这个事件目标是奖项列表的时候
            var containerTag = null;
            // 需要添加，这个是跳转到奖项列表的函数
        }

    }

    /**
     * @description 对点击加载更多，第一次点击时候相当于开启开关，然后下次只能通过鼠标滚动来添加事件.建议用DOM0级事件，因为part-left的事件会同时与其它事件触发
     * @param {object}}} event 添加事件监听
     */
    function searchLoadMore(event) {
        if (event.type == 'click') {
            // 第一次进行加载更多的时候，对点击事件进行移除
            EventUtil.removeHandler($('.search-container .turn-page-button')[0], 'click', searchLoadMore);
            $('.search-container .turn-page-button')[0].innerText = '向下滚动加载更多...';
            searchRequest()
        } else {
            if ($('.part-left').scrollTop() + $('.part-left')[0].clientHeight >= parseInt($('.search-container').css('height')) && 
                ((event.wheelDelta && event.wheelDelta < 0) || (event.detail && event.detail < 0))) {
                // 移除鼠标监听事件，避免同一时间多次请求
                // EventUtil.removeHandler($('.part-left')[0], 'mousewheel', searchLoadMore);
                $('.part-left')[0].onmousewheel = null;
                searchRequest();
            }
        }
    }
    $('.search-container .turn-page-button')[0].onclick = searchLoadMore;  // 添加事件监听

    /**
     * 搜索事件产生后，更新搜索结果区并显示更多
     */
    function searchRenew(event) {
        // 初始化样式
        if (event.type == 'click' || (event.type == 'keyup' && event.keyCode == 13)) {
            page = 0;  // 初始化页面为0;
            $('.menber-container .turn-page-button')[0].innerText = '点击加载更多...';
            $('.menber-container .turn-page-button').css('background-color', '#3d90f5');
            $('.menber-container .turn-page-button').css('color', '#ffffff');
            $('.search-info-list')[0].innerHTML = '';
            $('.search-prize-list ul')[0].innerHTML = '';
            searchRequest();
        }

    }

    EventUtil.addHandler($('#search-button img')[0], 'click', searchRenew)
    EventUtil.addHandler($('.search-container')[0], 'click', searchPageClickListen);
    EventUtil.addHandler($('#search-input')[0], 'keyup', searchRenew);
})();

/**
 * @description 审核页面
 */
(function() {
    /**
     * @description 审核页面的点击事件监听函数
     * @param {object} event 事件对象
     */
    function auditingPageClickListen(event) {
        var i,
            resultArr = [];
        switch(event.target) {
            case $('#auditing-all-permit')[0]: {
                // 通过
                for (i = 0; i < $('.auditing-check-box').length; i++) {
                    if ($('.auditing-check-box')[i].checked == true) {
                        resultArr.push({
                            userName: $('.auditing-check-box:eq('+ i +')').parents('li')[0].getAttribute('userName')
                        })
                    }
                }
                if (resultArr.length == 0) {
                    showMessage('请选择要审核的用户');
                    return;
                }
                showConfirm('确定通过所选账户？', auditingRequest.bind(null, 1, resultArr));
                // auditingRequest(1, resultArr);
                break;
            }

            case $('#auditing-all-reject')[0]: {
                // 不通过
                for (i = 0; i < $('.auditing-check-box').length; i++) {
                    if ($('.auditing-check-box')[i].checked == true) {
                        resultArr.push({
                            userName: $('.auditing-check-box:eq('+ i +')').parents('li')[0].getAttribute('userName')
                        })
                    }
                }
                if (resultArr.length == 0) {
                    showMessage('请选择要审核的用户');
                    return;
                }
                showConfirm('确定不通过所选账户？', auditingRequest.bind(null, 0, resultArr));
                // auditingRequest(0, resultArr);
                break;
            }

            case $('#auditing-all-reset')[0]: {
                // 重置
                for (i = 0; i < $('.auditing-check-box').length; i++) {
                    if ($('.auditing-check-box')[i].checked == true) {
                        $('.auditing-check-box')[i].checked = false;
                    }
                }
                break;
            }
        }
    }
    EventUtil.addHandler($('.auditing-container')[0], 'click', auditingPageClickListen);

    /**
     * @description 审核请求的函数
     * @param {Number} permitOrnot 允许通过或者不通过 1 为通过 0 为不通过
     */
    function auditingRequest(permitOrnot, choiceArray) {
        var jsonObj = {};

        jsonObj.passOrNot = permitOrnot;
        jsonObj.userList = choiceArray;
        $.ajax({
            url: 'http://'+ window.ip +':8080/qginfosystem/user/review',
            type: 'post',
            data: JSON.stringify(jsonObj),
            dataType: 'json',
            processData: false,
            crossDomain: true,
        　　xhrFields: {
        　　 withCredentials: true
        　　},
            contentType: 'application/json',
            success: function(responseObj) {
                switch(responseObj.status) {
                    case '1': {
                        // 处理结果
                        // 重新发送请求
                        getAutidingListRequest();
                        break;
                    }
    
                    case '2': {
                        
                        break;
                    }
    
                    case '7': {
                        
                        break;
                    }
    
                    case '11': {
                        showMessage('当前账户没有管理员权限');
                        break;
                    }
                }
                
            },
            error: function() {
                // 请求失败时要干什么
                showMessage('请求失败');
            }
        });
    }


    // getAutidingListRequest();
})();

/**
 * 请求拿到审核列表
 */
function getAutidingListRequest() {
    var i,
        jsonObj = {};
    
    jsonObj.userName = '';

    $.ajax({
        url: 'http://'+ window.ip +':8080/qginfosystem/user/listuser',
        type: 'post',
        data: JSON.stringify(jsonObj),
        crossDomain: true,
    　　xhrFields: {
    　　 withCredentials: true
    　　},
        dataType: 'json',
        processData: false,
        contentType: 'application/json',
        success: function(responseObj) {
            switch(responseObj.status) {
                case '1': {
                    // 处理结果
                    $('.auditing-container .auditing-choice-container>ul')[0].innerHTML = '';
                    if (responseObj.userList.length != 0) {  // 对列表进行更新
                        
                        $('.auditing-container .auditing-choice-container>span')[0].innerText = '未激活用户列表';
                        for (i = 0; i < responseObj.userList.length; i++) {
                            $('.auditing-container .auditing-choice-container>ul')[0].innerHTML += '<li userName='+ responseObj.userList[i].userName +'>'
                                                                                                +  '<input type="checkbox" class="auditing-check-box">'
                                                                                                +  '<span>选择</span>'
                                                                                                +  '<span class="auditing-userName">账号： <b>'+ responseObj.userList[i].userName +'</b></span>'
                                                                                                +  '<span class="auditing-name">真实姓名：<b>'+ responseObj.userList[i].name +'</b></span>'
                                                                                                +  '</li>';
                        }
                    } else {
                        $('.auditing-container .auditing-choice-container>span')[0].innerText = '没有未激活用户';
                    }
                    break;
                }

                case '10': {
                    if (responseObj.userList.length == 0) {
                        $('.auditing-container .auditing-choice-container>span')[0].innerText = '没有未激活的用户';
                    }
                    break;
                }

                case '11': {
                    showMessage('当前账户没有管理员权限');
                    break;
                }
            }
            
        },
        error: function() {
            // 请求失败时要干什么
            showMessage('请求失败');
        }
    });
}

/**
 * @description 更新用户头像
 * @param {file} file 文件对象
 * @param {String} userInfo 用户的账号
 */
function setHeadPicRequest(file, userInfo) {
    var form = new FormData();
    form.append('picture', file);
    form.append('userInfoId', userInfo);
    console.log(userInfo);
    $.ajax({
        url: 'http://'+ window.ip +':8080/qginfosystem/userinfo/modifypicture',
        type: 'post',
        data: form,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(responseObj) {
            switch(responseObj.status) {
                case '1': {
                    // 上传成功
                    showMessage('上传成功');
                    break;
                }

                case '9': {
                    showMessage('图片格式应为png/jpg');
                    break;
                }
            }
            
        },
        error: function() {
            // 请求失败时要干什么
            showMessage('请求失败');
        }
    });
}

/**
 * @description 对个人信息详细页面进行初始化
 * @param {object} jsonObj 
 */
function infoDetailPageRenew(jsonObj) {
    var $inputs = $('.info-container-right li input'),
        userInfoObj = jsonObj.userInfo;

    $inputs[0].value = userInfoObj.name;
    $inputs[1].value = userInfoObj.group;
    $inputs[2].value = userInfoObj.college;
    $inputs[3].value = userInfoObj.grade;
    $inputs[4].value = userInfoObj.tel;
    $inputs[5].value = userInfoObj.birthplace;
    $inputs[6].value = userInfoObj.qq;
    $inputs[7].value = userInfoObj.email;
    $('#info-introduction')[0].value = userInfoObj.description;
    $('.head-img-container>img').attr('src', 'http://'+ window.ip +':8080/qginfosystem/userImg/' + userInfoObj.url + '?='+ Math.random());
    $('.info-container').attr('userinfo', userInfoObj.userInfoId);
}

/**
 * @description 对用户详情页进行页面的监听及初始化
 */
(function() {
    var upload = $('#upload-headPic')[0],
        files = null,
        $image = $('.head-img-container>img');
    

    
    function infoDetailPageClickListen(event) {
        switch(event.target) {
            case $('.info-detail-button-container button')[0] : {
                // 上传图片

                break;
            }

            case $('.info-detail-button-container button')[1]: {
                // 确定上传
                var userInfo = $('.info-container').attr('userinfo');
                setHeadPicRequest(files, userInfo);
                break;
            }
        }
    }

    EventUtil.addHandler($('.info-container')[0], 'click', infoDetailPageClickListen);

    upload.onchange = function() {
        files = this.files[0];
        if (files.size > 5 * 1024 * 1024) {
            alert("文件过大，请选择比较小的文件上传");
            return false;
        }
        fileRead = new FileReader();
        fileRead.readAsDataURL(files);
        fileRead.onload = function() {
            $image.attr('src', this.result);
        }
    }
})();
function informationDetailPre() {
    console.log()
    if (window.privilege == 1) {
        for (i = 0; i < $('.info-container-right li').length; i++) {
            $('.info-container-right li input:eq('+ i +')').attr('disabled', true);
        }
        $('.info-detail-button-container').css('display', 'none');
        $('#info-introduction').attr('disabled', true);
        $('.info-introduction-container').css('background-color', '#EBEBE4');
    } else {
        for (i = 0; i < $('.info-container-right li').length; i++) {
            $('.info-container-right li input:eq('+ i +')').attr('disabled', true);
        }
        $('#info-introduction').attr('disabled', true);
        $('.info-introduction-container').css('background-color', '#EBEBE4');
    }
}