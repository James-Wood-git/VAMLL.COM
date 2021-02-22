<?php
    //引入数据库连接文件
    include "connect.php";
    //j将后端获取的用户名和密码去数据库进行匹配
    if(isset($_POST['user'] ) && isset( $_POST['pass'])){//如果用户名和密码都存在
        //存在就获取然后对数据库进行匹配
        $user = $_POST['user'];//获取用户名
        $pass = sha1($_POST['pass']);//获取密码并加密后进行匹配
        //匹配数据库
        $result = $conn->query("SELECT * FROM registry WHERE phone ='$user' and password ='$pass'" );

        //如果result 存在，就返回true ,证明输入的用户名和密码是正确的，反之亦然
        if($result->fetch_assoc()){
            echo 'true';
        }else{
            echo 'false';
        };
    };
?>