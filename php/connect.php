<?php
    //设置中文编码
    header('content-type:text/html;charset=utf-8');

    //1. 定义几个数据库连接的常量
    define('HOST','localhost');//主机名
    define('USERNAME','root');//用户名
    define('PASSWORD','root');//密码
    define('DATANAME','2012');//数据库名

     //@符号用来做容错处理，让错误不显示(慎用)
    $conn = @new mysqli(HOST,USERNAME,PASSWORD,DATANAME);//连接成功无提示

    //2. 自定义数据库连接错误信息
    if($conn->connect_error){
        die('数据库连接错误'.$conn->conncet_error);
    }


    //3. 设置字符编码
    $conn->query('SET NAMES UTF8');