<?php
    // 通过include函数或者require函数加载数据库连接的文件。
    include "../php/connect.php";

   // isset():判断括号里面的值是否存在。
// 1.用户名重名检测
    if(isset($_POST['checkphone'])){
        $checkPhone = $_POST['checkphone'];
        $result = $conn->query("SELECT * FROM registry WHERE phone='$checkPhone'");

        //$result->fetch_assoc():逐条获取$result里面每一条记录,返回值是一个数组。
        if($result->fetch_assoc()){
            echo 'true';
        }else{
            echo 'false';
        }
    };

    // 2.将前端传入的值放入数据库
    // $_POST['submit']:获取提交注册按钮的值
    if(isset($_POST['submit'])){//存在，说明前端已经点击过提交按钮
        //获取手机号 密码 确认密码
        $phone = $_POST['username'];
        $password = sha1($_POST['password']);
        $repass = sha1($_POST['check_pwd']);

        //将获取到的表单数据写入对应的数据库
        $conn->query("INSERT registry VALUES(null,'$phone','$password','$repass')");
         

        //后端跳转到登录页面
        header('location:http://10.31.165.42/VMALL.COM/src/login.html');
    }
?>