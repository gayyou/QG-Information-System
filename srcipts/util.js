window.ip = '192.168.1.105';
window.baseUrl = '';

/**
 * 这是一个兼容性的监听事件。只需要直接用这个对象的方法就行。惰性加载函数，所以控制台输出只能是当前浏览器支持的监听事件
 * @event
 * @function EventUtil.addHandler 全局的添加事件的方法。
 * @function EventUtil.removeHandler 全局的删除事件的方法。
 * @param {Object} element 添加事件的对象
 * @param {String} type 事件类型
 * @param {Function} handler 事件监听函数
 */
var EventUtil = {
    
    addHandler: (function () {
        if (window.addEventListener) {
            return function () {
                arguments[0].addEventListener(arguments[1], arguments[2], false);
            };
        } else if (window.attachEvent) {
            return function () {
                arguments[0].attachEvent("on" + arguments[1], arguments[2]);
            };
        } else {
            return function () {
                arguments[0]["on" + arguments[1]] = arguments[2];
            };
        }
    })(),

    removeHandler: (function() {
        if (window.addEventListener) {
            return function () {
                arguments[0].removeEventListener(arguments[1], arguments[2]);
            };
        } else if (window.attachEvent) {
            return function () {
                arguments[0].detachEvent("on" + arguments[1], arguments[2]);
            };
        } else {
            return function () {
                arguments[0]["on" + arguments[1]] = null;
            };
        }
    })()
}; 

/**
 * @description 限制输入框的最大输入字数
 * @param {inputDom} inputDom 输入框节点
 * @param {Number} length 限制的长度
 */
function limitLength(inputDom, length) {
    return (inputDom.value.length > length ? inputDom.value.slice(0, length) : inputDom.value);
}


/**
 * 查找元素节点函数
 * @param {*} node 
 */
function findElementNode(node) {
    var nodeArray = new Array();
    for (var i = 0; i < node.length; i++) {
        if (node[i].nodeType == 1) {
            nodeArray.push(node[i]);
        }
    }
    return nodeArray;
}

/**
 * 通用的css的类函数
 */
var ClassUtil = {

    hasClass: function(elements, cName) {
        return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
    },

    addClass: function(elements, cName) {
        if (!ClassUtil.hasClass(elements, cName)) {
            elements.className += " " + cName;
        }
    },

    removeClass: function(elements, cName) {
        if (ClassUtil.hasClass(elements, cName)) {
            elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), "");
        }
    },

    toggleClass: function(elements, cName) {
        if (ClassUtil.hasClass(elements, cName)) {
            ClassUtil.removeClass(elements, cName);
        } else {
            ClassUtil.addClass(elements, cName);
        }
    }
};


/**
 * 函数节流，提高体验
 */
function throttle(method, context) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function() {
        method.call(context);
    }, 100);
}

/**
 * 惰性加载动画函数
 * @author czf
 * @param {Function} fun 
 * @param {int} time 
 */
var requestAnimation = function (fun, time) {
    if (window.requestAnimationFrame) {
        return requestAnimationFrame(fun);
    } else {
        return setTimeout(fun, time);
    }
};


/**
 * 得到当前时间
 */
function getNowTime() {
    var time = new Date(),
        year,
        month,
        day;

    year = (time.getFullYear()).toString();
    month = (time.getMonth() + 1).toString();
    day = (time.getDate()).toString();
    return (year + '-' + month + '-' + day);
}

/**
 * 弹出提示层
 * DATE 20180803
 * @author czf
 * @param {string} text 要显示的提示信息
 * @param {function} commiitCallback 点击确认的时候执行的函数
 */
function showPop(text, commitCallback) {
    var popContainer = document.getElementsByClassName('pop-container')[0],
        popContent = document.getElementsByClassName('pop-content')[0];
        realLength = arguments.length;

    popContent.innerHTML = text;
    addClass(popContainer, 'active-pop');

    var popButton = document.getElementsByClassName('pop-button');

    EventUtil.addHandler(popButton[0], 'click', function() {
        removeClass(popContainer, 'active-pop');
    });
    
    EventUtil.addHandler(popButton[1], 'click', function() {
        removeClass(popContainer, 'active-pop');
        if (realLength > 1) {
            commitCallback();
        } 
    });
}
/**
 * 
 * @param {Function} fun 函数
 * @param {context}} context 执行环境
 */
function bind(fun, context) {
    return function() {
        return fun.apply(context, arguments); //arguments指向的是匿名函数的参数
    };
}

/**
 * cookie工具类
 * chrome 不支持本地调试cookie
 */
var cookieUtil = {

    get: function(name) {
        var cookieName = encodeURIComponent(name) + '=',
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null;
        
        if (cookieStart > -1) {
            var cookieEnd = document.cookie.indexOf(';', cookieName);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length; //如果没有找到，说明这个是cookie的最后一个字符串
            }
            
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));    
        }
        return cookieValue; 
    },

    set: function(name, value, expires, path, domain, secure) {
        //必须项
        var cookieText = encodeURIComponent(name) + '=' +
                         encodeURIComponent(value);
        //可选项
        if (expires instanceof Date) {
            cookieText += '; expires=' + expires.toGMTString();
        } 
        if (path) {
            cookieText += '; path=' + path;
        }
        if (domain) {
            cookieText += '; domain=' + domain;
        }
        if (secure) {
            cookieText += '; secure';
        }
        document.cookie = cookieText;
    },
    //用于删除cookie
    unset: function(name, path, domain, secure) {
        this.set(name, '', new Date(0), path, domain, secure);
    }

};

function ajax() {
    $.ajax({
        url: 'http://'+ window.ip +':8080/qginfosystem/user/register',
        type: 'post',
        data: JSON.stringify(jsonObj),
        dataType: 'json',
        
        processData: false,
        contentType: 'application/json',
        success: function(responseObj) {
            switch(responseObj.status) {
                case '1': {
                    showMessage('注册成功');
                    break;
                }

                case '2': {
                    showMessage('该账户已经被注册了');
                    break;
                }

                case '7': {
                    showMessage('服务器发生内部错误');
                    break;
                }

                case '9': {
                    showMessage('发送数据格式错误');
                    break;
                }
            }
            
        },
        error: function() {
            // 请求失败时要干什么
            showMessage('请求失败')
        }
    });
}

/**
 * 封装异步方法
 */
var AjaxUtil = {
    post: function (url, data, dataType, contentType, successCallback, errorCallback) {
        $.ajax({
            url: url,
            type: 'post',
            data: JSON.stringify(data),
            dataType: dataType,
            processData: false,
            contentType: contentType,
            success: successCallback,
            error: errorCallback
        });
    },

    get: function(url, data, dataType, contentType, successCallback, errorCallback) {
        $.ajax({
            url: url,
            type: 'get',
            data: JSON.stringify(data),
            dataType: dataType,
            processData: false,
            contentType: contentType,
            success: successCallback(),
            error: errorCallback()
        });
    }
};

/**
 * 打印函数
 * @param {*} obj 
 */
function print(obj) {
    console.log(obj);
}

/**
 * @description 浮出层提示，仅仅只有提示，并不是确定框
 * @param {String} text 提示内容
 */
function showMessage(text) {
    $('.float-tips-layer span')[0].innerText = text;
    $('.float-tips-layer').css('display', 'block');
    setTimeout(function() {
        if (ClassUtil.hasClass($('.float-tips-layer>div')[0], 'fadeIn') == false) {
            ClassUtil.addClass($('.float-tips-layer>div')[0], 'fadeIn');
        }
    }, 10);
    /**
     * @description 关闭浮出层
     */
    function closeLayer() {
        EventUtil.removeHandler($('.float-tips-layer button')[0], 'click', closeLayer);
        if (ClassUtil.hasClass($('.float-tips-layer>div')[0], 'fadeIn') == true) {
            ClassUtil.removeClass($('.float-tips-layer>div')[0], 'fadeIn');
        }
        setTimeout(function() {
            $('.float-tips-layer').css('display', 'none');
        }, 200);
    }
    EventUtil.addHandler($('.float-tips-layer button')[0], 'click', closeLayer);
}

/**
 * @description 确定点击函数
 * @param {string} text 提示内容
 * @param {Function} callback 回调函数
 */
function showConfirm(text, callback){
    $('.float-confirm-layer span')[0].innerText = text;
    $('.float-confirm-layer').css('display', 'block');
    setTimeout(function() {
        if (ClassUtil.hasClass($('.float-confirm-layer>div')[0], 'fadeIn') == false) {
            ClassUtil.addClass($('.float-confirm-layer>div')[0], 'fadeIn');
        }
    }, 10);
    /**
     * @description 关闭浮出层
     */
    function closeLayer(event) {
        EventUtil.removeHandler($('.float-confirm-layer button')[0], 'click', closeLayer);
        EventUtil.removeHandler($('.float-confirm-layer button')[1], 'click', closeLayer);
        if (ClassUtil.hasClass($('.float-confirm-layer>div')[0], 'fadeIn') == true) {
            ClassUtil.removeClass($('.float-confirm-layer>div')[0], 'fadeIn');
        }
        setTimeout(function() {
            $('.float-confirm-layer').css('display', 'none');
        }, 200);
        if ($(event.target).attr('choice') == 'confirm') {
            callback();
        }
    }
    EventUtil.addHandler($('.float-confirm-layer button')[0], 'click', closeLayer);
    EventUtil.addHandler($('.float-confirm-layer button')[1], 'click', closeLayer);
}