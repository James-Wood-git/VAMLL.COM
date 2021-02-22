// 引入或者加载jquey模块
import { } from "https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js";

// 点击登录按钮，将用户名和密码传输给后端
const $loginBtn = $('#hwid-loginBtn');
const $username = $('#username');
const $password = $('#password');
const $errMsg = $('.err-msg');
const $errIcon = $('i');

$username.on('blur', function () {
    let $reg = /^1[35789]\d{9}$/;
    //判断帐号格式
    if ($(this).val() === '') {
        $errMsg.html('帐号不能为空');
        $errIcon.addClass('ic-tips');
    } else if ($reg.test($(this).val())) {
        $errMsg.html('');
        $errIcon.removeClass('ic-tips');
    } else {
        $errMsg.html('帐号格式不正确');
        $errIcon.addClass('ic-tips');
    }
})

$password.on('blur', function () {
    if ($(this).val() === '') {
        $errMsg.html('请输入密码');
        $errIcon.addClass('ic-tips');
    } else {
        $errMsg.html('');
        $errIcon.removeClass('ic-tips');
    }
})

$loginBtn.on('click', function () {

    $.ajax({
        type: 'post',
        url: 'http://10.31.165.42/VMALL.COM/php/v_login.php',
        data: {
            user: $username.val(),
            pass: $password.val()
        }
    }).done(function (data) { //data:后端返回的值
        if (data === 'true') { //登录成功:跳转首页，同时首页应该出现用户名等信息(本地存储)。
            window.localStorage.setItem('loginName', $username.val());
            $errMsg.html('');
            $errIcon.removeClass('ic-tips');
            location.href = 'index.html';
        } else { //登录失败
            $errMsg.html('帐号或密码错误');
            $errIcon.addClass('ic-tips');
            $password.val(''); //清空密码
        }
    })
});