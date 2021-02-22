//1.引入jquery模块
import { } from 'https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js';

//引入首页js模块
import { } from '../script/index_module.js';

//2.在详情页面获取商品的sid - 列表传入一个sid到详情页。
let $sid = location.search.substring(1).split('=')[1];

// 如果sid不存在，默认sid为1
if (!$sid) {
    $sid = 1;
}

const $spic = $('#smallPicBox'); //当前商品盒子
const $smallpic = $('#smallPic'); //当前商品图片
const $bpic = $('#bigPic'); //放大盒子里面的图片
const $loadtitle = $('#pro-name'); //标题loadpcp
const $loadpcp = $('#pro-price'); //价格
const $list = $('#pro-gallerys'); //存放小图
const $sf = $('#moveBox');//放大镜移动小块
const $bf = $('#bigPicBox');//放大图片的盒子
const $probox = $('.product');
let $liwidth = 0; //li的宽度
let $lilenth = 0; //所有li的个数


//2.将当前的sid传给后端，后端返回sid对应的数据给前端。
$.ajax({
    url: 'http://10.31.165.42/VMALL.COM/php/getsid.php',
    data: {
        datasid: $sid
    },
    dataType: 'json'
}).done(function (data) {
    console.log(data); //获取sid对应的数据,找到对应的元素，将值赋给元素。
    $smallpic.attr('src', data.picurl);
    $bpic.attr('src', data.picurl)
    $loadtitle.html(data.title);
    $loadpcp.html('¥' + data.price);

    //渲染放大镜下面的小图
    let $picarr = data.piclisturl.split(','); //数组
    let $strHtml = '';
    $.each($picarr, function (index, value) {
        $strHtml += ` 
                <li>
                    <a>
                        <img src="${value}"/>
                    </a>    
                </li>
            `;
        $list.html($strHtml);
    });

    //这里可以任意的获取渲染的数据。
    $lilenth = $('#pro-gallerys li').length; //存储li的个数 12
    /* 给第一个默认小图添加边框 */
    $('#pro-gallerys li').eq(0).addClass('current');

    $liwidth = $('#pro-gallerys li').eq(0).outerWidth(true); //存储一个li的宽度

});

//3.放大镜效果。
//3.1.鼠标移入当前商品，显示moveBox和放大图片的盒子
$spic.hover(function () {
    $sf.css('display', 'block');
    $bf.css('display', 'block');
    //3.2.计算moveBox的尺寸和比例
    $sf.width($spic.outerWidth() * $bf.outerWidth() / $bpic.outerWidth());
    $sf.height($spic.outerHeight() * $bf.outerHeight() / $bpic.outerHeight());
    let $bili = $bpic.outerWidth() / $spic.outerWidth(); //比例
    //3.3.鼠标在当前商品盒子里面移动，moveBox跟随鼠标
    $spic.on('mousemove', function (ev) {
        //获取moveBox的边界值
        let $leftvalue = ev.pageX - $probox.offset().left - $sf.outerWidth() / 2;
        let $topvalue = ev.pageY - $probox.offset().top - $sf.outerHeight() / 2;
        //限定边界 让moveBox在特定的范围移动
        if ($leftvalue < 0) {
            $leftvalue = 0;
        } else if ($leftvalue >= $spic.outerWidth() - $sf.outerWidth()) {
            $leftvalue = $spic.outerWidth() - $sf.outerWidth();
        }

        if ($topvalue < 0) {
            $topvalue = 0;
        } else if ($topvalue >= $spic.outerHeight() - $sf.outerHeight()) {
            $topvalue = $spic.outerHeight() - $sf.outerHeight();
        }
        //设定moveBox的位移
        $sf.css({
            left: $leftvalue,
            top: $topvalue
        });
        //设定放大图片的位移（负值）
        $bpic.css({
            left: -$bili * $leftvalue,
            top: -$bili * $topvalue
        });
    });
}, function () {
    $sf.css('display', 'none');
    $bf.css('display', 'none');
});

//3.4.鼠标划入列表小图，切换大图显示的图片。
//无法获取渲染的元素，渲染的过程是异步的ajax，只能采用事件委托。
const $listul = $('#pro-gallerys');
$listul.on('mouseover', 'li', function () { //注意委托的元素就是内部的元素，设置的时候可以忽略
    // console.log($(this)); //委托的元素
    //获取委托元素li里面的img下面的src的路径。
    let $url = $(this).find('img').attr('src');
    //对应的赋值
    $smallpic.attr('src', $url);
    $bpic.attr('src', $url);

    //给划入的li添加边框 其余的去除边框
    $(this).addClass('current').siblings().removeClass('current');
});

//3.5.通过小图两侧的按钮，切换小图。
//每点击一次箭头，图片移动一张。
let $num = 5; //这里的8是固有的值。表示显示的张数。
/* 右箭头事件 */
$('.product-gallery-forward').on('click', function () {
    if ($lilenth > $num) {
        $num++;
    }
    $listul.animate({
        left: -$liwidth * ($num - 5)
    }, 100);
});
//左箭头事件
$('.product-gallery-back').on('click', function () {
    if ($num > 5) {
        $num--;
    }
    $listul.animate({
        left: -$liwidth * ($num - 5)
    }, 100);
});

//4.购物车
//利用本地存储或者cookie技术 - 跨页面操作。
//由详情页进行存储，购物车列表页进行渲染。
//详情页存储的过程
//第一步：存储多个商品的数据(sid编号,数量)
//利用数组或者对象都可以存储多个商品的信息。
//let arrsid = [3,5,7,11];//存储的商品编号
//let arrnum = [12,36,1,56];//存储商品的数量
//第二步：商品是第一次购买直接渲染列表，如果是多次购买，累加数量。
//提前获取本地存储里面的商品编号和商品数量，如果编号存储，说明此商品不是第一次购买，否则就是第一次购买。


//商品编号和数量的数组。
let $arrsid = []; //存储的商品编号,以及获取本地存储的商品编号
let $arrnum = []; //存储商品的数量,以及获取本地存储的商品数量

//提前获取本地存储里面的商品编号,提前考虑本地存储的key值(localsid:本地存储的商品编号，localnum:本地存储商品的数量)
//这里的重点是本地存储key值的提前约定。
//封装函数获取本地存储，进行商品是第一次还是多次判断。
function getLocalStorage() {
    if (localStorage.getItem('localsid') && localStorage.getItem('localnum')) { //商品已经存储过
        $arrsid = localStorage.getItem('localsid').split(','); //将获取的编号转换成数组，方便后面判断是否存在当前编号。
        $arrnum = localStorage.getItem('localnum').split(',');
    } else {
        $arrsid = [];
        $arrnum = [];
    }
}

/* 商品数量+-事件*/
const $proNumAdd = $('#pro-quantity-plus');
const $proNumMin = $('#pro-quantity-minus');
const $proNum = $('#pro-quantity');
$proNumAdd.on('click', function () {
    let $pnum = $proNum.val();
    $pnum++;
    if ($pnum > 10) {
        $pnum = 10;
        $proNumAdd.addClass('disabled');
        alert("商品一次限购10件！");
    }
    $proNum.val($pnum);
    $proNumMin.removeClass('disabled');
});
$proNumMin.on('click', function () {
    let $pnum = $proNum.val();
    $pnum--;
    if ($pnum <= 1) {
        $pnum = 1;
        $proNumMin.addClass('disabled');
        $proNumAdd.removeClass('disabled');
    }
    $proNum.val($pnum);

});
//商品数量键盘输入事件（只能输入数字）
$proNum.on('input', function () {
    //alert(1);
    let $reg = /^\d+$/; //行首行尾匹配一个或者多个数字
    if (!$reg.test($(this).val())) { //如果不满足条件，值为1
        $(this).val(1);
    }
    if ($(this).val() > 10) {
        alert("商品一次限购10件！");
        $(this).val(10);
    }
});


//开始存储商品的编号和数量
const $addCart = $('.product-button01'); //存储商品的按钮
const $count = $('#pro-quantity');
$addCart.on('click', function () {
    //alert(1);
    //判断是第一次存储，还是多次存储。
    getLocalStorage()
    if ($arrsid.includes($sid)) { //存在,不是第一次添加，改变数量
        let $index = $arrsid.indexOf($sid); //sid在数组中的位置，sid的位置和数量是匹配的。通过sid的位置找数量的位置
        $arrnum[$index] = parseInt($arrnum[$index]) + parseInt($count.val()); //重新赋值
        localStorage.setItem('localnum', $arrnum); //重新添加到本地存储，覆盖前面的值
    } else { //不存在,第一次添加
        $arrsid.push($sid); //将sid添加到存储sid的数组中。
        localStorage.setItem('localsid', $arrsid); //添加到本地存储中。
        $arrnum.push($count.val()); //将数量添加到存储数量的数组中。
        localStorage.setItem('localnum', $arrnum); //添加到本地存储中。
    }
    alert('商品添加到购物车成功！');
});

