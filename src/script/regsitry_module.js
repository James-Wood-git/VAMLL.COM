// my_js

// 操作过程：
// 引入或者加载jquey模块
import { } from "https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js";

const $username = $('#username');
const $pass = $("#password");
const $checkPass = $('#check_pwd');

const $phoneInput = $('#phoneInputDiv_box');
const $passDiv = $('#pwdDiv')
const $checkDiv = $('#checkPwd');
const $errMsg = $('.err-msg');
const $form = $('form');
const $errIcon = $('i');
let $userflag = false;
let $passflag = false;
let $repassflag = false;

//验证手机号
$username.on('focus', function () {
    $phoneInput.addClass('hwid-input-container-focus').removeClass('hwid-input-container-normal');
})
$username.on('blur', function () {
    let $this_value = $(this).val();
    let $reg = /^1[35789]\d{9}$/;
    if ($this_value === '') {
        $phoneInput.addClass('hwid-input-container-error');
        $errMsg.eq(1).html('手机号不能为空');
        $errIcon.eq(1).addClass('ic-tips');
        $userflag = false;
    } else if ($reg.test($this_value)) {
        $phoneInput.removeClass('hwid-input-container-focus').removeClass('hwid-input-container-error').addClass('hwid-input-container-normal');
        $errMsg.eq(1).html('');
        $errIcon.eq(1).removeClass('ic-tips');
        $userflag = true;
    } else {
        $errMsg.eq(1).html('手机号不正确');
        $errIcon.eq(1).addClass('ic-tips');
        $userflag = false;
    }

    $.ajax({
        type: 'post',
        url: 'http://10.31.165.42/VMALL.COM/php/v_reg.php',
        data: {
            checkphone: $username.val()
        }
    }).done(function (data) {
        console.log(data);
        if (data === 'true') {
            $phoneInput.addClass('hwid-input-container-error');
            $errMsg.eq(1).html('该手机号已被注册');
            $errIcon.eq(1).addClass('ic-tips');
            $userflag = false;
        }
    });
});

//验证密码
$pass.on('focus', function () {
    $passDiv.addClass('hwid-input-container-focus').removeClass('hwid-input-container-normal');
});
$pass.on('blur', function () {
    let $v_len = $(this).val().length;
    if ($(this).val() === '') {
        $passDiv.addClass('hwid-input-container-error').removeClass('hwid-input-container-normal');
        $errMsg.eq(2).html('密码不能为空');
        $errIcon.eq(2).addClass('ic-tips');
        $passflag = false;
    } else if ($v_len >= 8 && $v_len <= 20) {
        //检测类型
        let $reg1 = /\d+/; //数字
        let $reg2 = /[a-zA-Z]+/; //字母
        let $reg3 = /[\W\_]+/; //特殊字符
        let $reg5 = /(\w)*(\w)\2{2}(\w)*/g;//连续3个重复字符

        let $count = 0;//定义密码类型数量
        if ($reg1.test($(this).val())) {
            $count++;
        }
        if ($reg2.test($(this).val())) {
            $count++;
        }
        if ($reg3.test($(this).val())) {
            $count++;
        }
        //判断
        switch ($count) {
            case 1:
                $errMsg.eq(2).html('至少包含字母和数字，不能包含空格');
                $errIcon.eq(2).addClass('ic-tips');
                $passflag = false;
                break;
            case 2:
                if ($reg5.test($(this).val())) {
                    $errMsg.eq(2).html('连续相同的字符不得超过 3 个');
                    $errIcon.eq(2).addClass('ic-tips');
                    $passflag = false;
                } else {
                    $errMsg.eq(2).html('');
                    $errIcon.eq(2).removeClass('ic-tips');
                    $passDiv.removeClass('hwid-input-container-error').addClass('hwid-input-container-normal').removeClass('hwid-input-container-focus');
                    $passflag = true;
                }
                break;
        }

    } else {
        $passDiv.addClass('hwid-input-container-error').removeClass('hwid-input-container-normal');
        $errMsg.eq(2).html('至少包含8个字符');
        $errIcon.eq(2).addClass('ic-tips');
        $passflag = false;
    }
});

//确认密码
$checkPass.on('focus', function () {
    $checkDiv.addClass('hwid-input-container-focus').removeClass('hwid-input-container-normal');
});
$checkPass.on('blur', function () {
    console.log($pass.val());
    let $v_len = $(this).val().length;
    if ($(this).val() === '') {
        $checkDiv.addClass('hwid-input-container-error').removeClass('hwid-input-container-normal');
        $errMsg.eq(3).html('确认密码不能为空');
        $errIcon.eq(3).addClass('ic-tips');
        $repassflag = false;
    } else if ($(this).val() !== $pass.val()) {
        $errMsg.eq(3).html('密码与确认密码不一致');
        $errIcon.eq(3).addClass('ic-tips');
        $repassflag = false;
    } else {
        $checkDiv.removeClass('hwid-input-container-error').addClass('hwid-input-container-normal').removeClass('hwid-input-container-focus');
        $errMsg.eq(3).html('');
        $errIcon.eq(3).removeClass('ic-tips');
        $repassflag = true;
    }
});

//阻止浏览器的submit跳转，如果用户名不能通过，不允许提交注册。
//如果注册成功跳转到登录页面 
$form.on('submit', function () {
    if (!$userflag || !$passflag || !$repassflag) {
        return false;
    }
});

