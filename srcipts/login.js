/**
 * @description 对表单输入去掉中文字和中文字符
 * @param {Dom object} inputDom dom节点对象
 */
function inputFilter(inputDom) {
    var filterPattern = new RegExp('^[\\u4E00-\\u9FA5|￥……！·《》&*（）——|【】‘；：”“’。，、？~!@#$%^&\\s*\\(\\)\\{\\}\\[\\]\"\'|\\\\:;<,>.?\\/`\\-\\=\\_\\+]$'),
        i,
        str = '';

    for (i = 0; i < inputDom.value.length; i++) { 
        str = str + inputDom.value.substr(i, 1).replace(filterPattern, ''); 
    } 
    inputDom.value = str;
}

/**
 * @description 检测是否全为数字
 * @param {Dom Object} inputDom DOM对象
 */
function checkAllUserName(inputDom) {
    var filterPattern = new RegExp('^(?!\\d+$)(?![a-zA-Z]+$)[a-zA-Z\\d]+$');
    if (filterPattern.test(inputDom.value) == false) {
        return false;
    }
    return true;
}

/**
 * @description 对登陆界面表单输入进行监听
 * @param {object} event 事件监听对象
 */
function loginModeInputListen(event) {
    switch(event.target) {
        case $('#login-userName')[0]: {
            // 输入账号的输入时候的事件监听
            inputFilter(event.target);
            event.target.value =  limitLength(event.target, 13);
            hiddenTips($('.login-userName-tip')[0]);
            break;
        }

        case $('#login-password')[0]: {
            // 登陆输入密码时候的监听
            event.target.value =  limitLength(event.target, 13);
            hiddenTips($('.login-password-tip')[0]);
            break;
        }
    }
}
EventUtil.addHandler($('.login-container')[0], 'input', loginModeInputListen);

/**
 * @description 对注册页面进行输入的事件监听
 * @param {object} event 事件监听对象
 */
function registerModeInputListen(event) {
    switch(event.target) {
        case $('#register-userName')[0]: {
            // 对注册账号的输入进行监听
            event.target.value =  limitLength(event.target, 13);
            inputFilter(event.target);
            if (event.target.value.length < 6) {
                // 进行提示
                showTips($('.register-userName-tip')[0], '6-13位英文或数字');
            } else {
                // 判断是否全为数字
                if (checkAllUserName(event.target) == false) {
                    showTips($('.register-userName-tip')[0], '请输入数字和英文字母');
                } else {
                    hiddenTips($('.register-userName-tip')[0]);
                }
            }
            break;
        }

        case $('#register-name')[0]: {
            // 对注册的真实姓名进行监听
            event.target.value =  limitLength(event.target, 15);
            if (event.target.value.length < 2) {
                // 进行提示
                showTips($('.register-name-tip')[0], '名字大于1位');
            } else {
                // 消除提示
                hiddenTips($('.register-name-tip')[0]);
            }
            break;
        }

        case $('#register-password')[0]: {
            // 对注册账号时候输入密码进行监听
            event.target.value =  limitLength(event.target, 13);
            if (event.target.value.length < 6) {
                // 进行提示
                showTips($('.register-password-tip')[0], '密码为6-13位');
            } else {
                // 消除提示
                hiddenTips($('.register-password-tip')[0]);
            }
            break;
        }
    }
}
EventUtil.addHandler($('.register-container')[0], 'input', registerModeInputListen);

/**
 * @description 对页面的点击事件进行监听
 * @param {object} event 时间对象
 */
function pageClickListen(event) {
    var i;
    switch(event.target) {
        case $('.login-container button')[0]: {
            // 登陆按钮点击事件监听
            if (loginSubmitCheck() == false) {
                // 不符合表单的时候并不会进行提交表单
                return;
            }
            loginRequest();
            break;
        }

        case $('.register-container button')[0]: {
            // 注册按钮点击事件监听
            // 不符合的时候并不进行请求。
            if(registerSubmitCheck() == false) {
                return;
            }
            registerRequest();
            break;
        }

        case $('#login-mode span')[0]:
        case $('#login-mode span')[1]: {
            // 隐藏注册输入框的提示
            for (i = 2; i < 5; i++) {
                hiddenTips($('.tips')[i]);
            }
            // 切换为登录模式
            if (ClassUtil.hasClass($('.login-input-container')[0], 'input-container-unrotated') == false) {
                ClassUtil.removeClass($('.login-container')[0], 'mode-container-rotated');
                ClassUtil.addClass($('.login-container')[0], 'mode-container-unrotated');
                ClassUtil.removeClass($('.login-input-container')[0], 'input-container-rotated');
                ClassUtil.addClass($('.login-input-container')[0], 'input-container-unrotated');

                ClassUtil.removeClass($('.register-container')[0], 'mode-container-unrotated');
                ClassUtil.addClass($('.register-container')[0], 'mode-container-rotated');
                ClassUtil.removeClass($('.register-input-container')[0], 'input-container-unrotated');
                ClassUtil.addClass($('.register-input-container')[0], 'input-container-rotated');

                EventUtil.removeHandler(document, 'click', pageClickListen);
                setTimeout(function() {
                    EventUtil.addHandler(document, 'click', pageClickListen);
                }, 750)
            }
            
            break;
        }

        case $('#register-mode span')[0]:
        case $('#register-mode span')[1]: {
            // 隐藏登录的提示
            for (i = 0; i < 2; i++) {
                hiddenTips($('.tips')[i]);
            }
            // 切换为注册模式
            if (ClassUtil.hasClass($('.register-input-container')[0], 'input-container-unrotated') == false) {
                ClassUtil.removeClass($('.register-container')[0], 'mode-container-rotated');
                ClassUtil.addClass($('.register-container')[0], 'mode-container-unrotated');
                ClassUtil.removeClass($('.register-input-container')[0], 'input-container-rotated');
                ClassUtil.addClass($('.register-input-container')[0], 'input-container-unrotated');

                ClassUtil.removeClass($('.login-container')[0], 'mode-container-unrotated');
                ClassUtil.addClass($('.login-container')[0], 'mode-container-rotated');
                ClassUtil.removeClass($('.login-input-container')[0], 'input-container-unrotated');
                ClassUtil.addClass($('.login-input-container')[0], 'input-container-rotated');

                EventUtil.removeHandler(document, 'click', pageClickListen);
                setTimeout(function() {
                    EventUtil.addHandler(document, 'click', pageClickListen);
                }, 750)
            }
            break;
        }
    }
    
}
EventUtil.addHandler(document, 'click', pageClickListen);

/**
 * @description 注册表单提交时候先进行检测是否符合
 */
function registerSubmitCheck() {
    // 对注册账号进行再次检验
    if ($('#register-userName')[0].value.length == 0) {
        showTips($('.register-userName-tip')[0], '请输入账号');
        $('#register-userName')[0].focus();
        return false;
    } else if ($('#register-userName')[0].value.length < 6) {
        showTips($('.register-userName-tip')[0], '账号不低于6位');
        $('#register-userName')[0].focus();
        return false;
    } else if (checkAllUserName($('#register-userName')[0]) == false) {
        showTips($('.register-userName-tip')[0], '请输入数字和英文字母');
        $('#register-userName')[0].focus();
        return false;
    }

    // 对用户姓名进行检验
    if ($('#register-name')[0].value.length == 0) {
        // 进行提示
        showTips($('.register-name-tip')[0], '请输入真实姓名');
        $('#register-name')[0].focus();
        return false;
    }

    // 对输入的密码进行检验
    if ($('#register-password')[0].value.length == 0) {
        showTips($('.register-password-tip')[0], '请输入密码');
        $('#register-password')[0].focus();
        return false;
    } else if ($('#register-password')[0].value.length < 6) {
        showTips($('.register-password-tip')[0], '密码为6-13位');
        $('#register-password')[0].focus();
        return false;
    }
    return true;
}

/**
 * @description 对登陆的表单进行提交
 */
function loginSubmitCheck() {
    switch(true) {
        case ($('#login-userName')[0].value.length == 0): {
            // 当没有输入账号的时候
            showTips($('.login-userName-tip')[0], '请输入账号');
            $('#login-userName')[0].focus();
            return false;
        }

        case ($('#login-password')[0].value.length == 0): {
            // 当没有输入密码的时候
            showTips($('.login-password-tip')[0], '请输入密码');
            $('#login-password')[0].focus();
            return false;
        }
    }
    return true;
}



/**
 * @description 切换注册或者登录时候控制下拉栏的动画
 * @param {object} event 事件监听对象
 */
function downListMouseOverAnimate(event) {
    /* 添加类名，执行动画 */
    if (event.type == 'mouseover' && ClassUtil.hasClass($(this).parents('.switch-layer')[0], 'switch-container-animate') == false) {
        ClassUtil.addClass($(this).parents('.switch-layer')[0], 'switch-container-animate')
    } 
    /* 移除类名，取消动画 */
    if (event.type == 'mouseleave' && ClassUtil.hasClass($(this).parents('.switch-layer')[0], 'switch-container-animate') == true){
        ClassUtil.removeClass($(this).parents('.switch-layer')[0], 'switch-container-animate')
    }

}

/* 下拉栏的事件监听 */
$('#login-mode')[0].onmouseover = downListMouseOverAnimate.bind($('#login-mode span')[0]);
$('#login-mode')[0].onmouseleave = downListMouseOverAnimate.bind($('#login-mode span')[0])

$('#register-mode')[0].onmouseover = downListMouseOverAnimate.bind($('#register-mode span')[0])
$('#register-mode')[0].onmouseleave = downListMouseOverAnimate.bind($('#register-mode span')[0])

/**
 * @description 注册发送请求
 */
function registerRequest() {
    var jsonObj = {};

    jsonObj.userName = $('#register-userName')[0].value;
    jsonObj.password = $('#register-password')[0].value;
    jsonObj.name = $('#register-name')[0].value;

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
 * @description 登录发送请求
 */
function loginRequest() {
    var jsonObj = {},
        message;

    jsonObj.userName = $('#login-userName')[0].value;
    jsonObj.password = $('#login-password')[0].value;

    $.ajax({
        url: 'http://'+ window.ip +':8080/qginfosystem/user/login',
        type: 'post',
        data: JSON.stringify(jsonObj),
        dataType: 'json',
        crossDomain: true,
    　　xhrFields: {
    　　 withCredentials: true
    　　},
        processData: false,
        contentType: 'application/json',
        success: function(responseObj) {
            switch(responseObj.status) {
                case '1': {
                    showMessage('登陆成功');
                    // message = encodeURIComponent('userName=' + responseObj.name) + '&' + encodeURI('userPrivilege=' + responseObj.privilege);
                    // encodeURIMessage = encodeURIComponent(message);
                    // url = window.baseUrl + 'index.html?' + encodeURIMessage;
                    window.location.href = 'index.html?';
                    break;
                }

                case '3': {
                    showMessage('该账号未激活');
                    break;
                }

                case '4': {
                    showMessage('该账号不存在');
                    break;
                }

                case '5': {
                    showMessage('密码错误');
                    break;
                }

                case '7': {
                    showMessage('服务器内部错误');
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
 * @description 输入框提示
 * @param {object} tipTarget 目标节点对象
 * @param {String} text 提示的内容
 */
function showTips(tipTarget, text) {
    /* 当没有在显示的时候才进行添加类名 */
    if (ClassUtil.hasClass(tipTarget, 'tips-active') == false) {
        ClassUtil.addClass(tipTarget, 'tips-active');
    }
    tipTarget.getElementsByTagName('div')[0].innerText = text;
}

/**
 * @description 隐藏输入框的提示
 * @param {Dom object} tipTarget 目标节点对象
 */
function hiddenTips(tipTarget) {
    if (ClassUtil.hasClass(tipTarget, 'tips-active') == true) {
        ClassUtil.removeClass(tipTarget, 'tips-active');
    }
}