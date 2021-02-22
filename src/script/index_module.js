//1.引入jquery模块
import { } from 'https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js';

//引入懒加载模块
import { } from "./jquery.lazyload.js";

/* 最顶部banner点击关闭 */
$('.button-top-banner-close').on('click', function () {
    $('.top-banner-img').addClass('hide');
});

/* 首页手表部分数据渲染 */
//将获取的页面传递给后端

$.ajax({
    url: 'http://10.31.165.42/VMALL.COM/php/v_getIndexData.php',
    dataType: 'json'
}).done(function (data) {
    console.log(data);
    let $strhtml = '';
    $.each(data, function (index, value) {
        $strhtml += `
                <li class="grid-items">
                    <a class="thumb" href="#">
                        <div class="grid-info">
                            <p class="grid-img">
                                <img class='lazy' data-original="${value.picture}" alt="">
                            </p>
                        </div>
                        <div class="grid-title">${value.title}</div>
                        <p class="grid-desc">${value.details}</p>
                        <p class="grid-price">¥${value.price}</p>
                    </a>
                </li>
                `;
    });
    $('.grid-list01').append($strhtml);

    //添加懒加载
    $('img.lazy').lazyload({
        effect: "fadeIn"
    });
});

//添加懒加载
$('img.lazy').lazyload({
    effect: "fadeIn"
});



/* 轮播部分 */
const $circle = $('.circle span');
const $imgList = $('#slider-ul li');
const $sliderPrevBtn = $('.button-slider-prev');
const $sliderNextBtn = $('.button-slider-next');
let $index = 0;//用来存放index
let $autoTimer = null;

/* 轮播部分-小圆点 */
$circle.on('mouseover', function () {
    $index = $(this).index();
    tabSwitch();
});

/* 轮播图片切换函数 */
function tabSwitch() {
    /* 圆点 */
    $circle.eq($index).addClass('active').siblings().removeClass('active');
    /* 轮播图 */
    $imgList.eq($index).stop(true).animate({
        opacity: 1
    }).siblings('#slider-ul li').stop(true).animate({
        opacity: 0
    });
}

/* 点击左右箭头切换图片 */
//左箭头（index--）
$sliderPrevBtn.on('click', function () {
    $index--;
    if ($index < 0) {
        $index = $imgList.length - 1;
    }
    tabSwitch();
});

//右箭头（index++）
$sliderNextBtn.on('click', function () {
    $index++;
    if ($index > $imgList.length - 1) {
        $index = 0;
    }
    tabSwitch();
});

//自动轮播
//定时器设定一定的时间，自动点击右键
$autoTimer = setInterval(function () {
    $sliderNextBtn.click();
}, 3000);

//鼠标移入banner停止自动轮播，移出开启自动轮播
//这里注意不能如果用mouseover 事件，必须写mouseout事件来开启定时器 
//hover 方法可以使用链式调用， mouseover 不可以
$('.ec-slider .layout').hover(function () {
    clearInterval($autoTimer);
}, function () {
    $autoTimer = setInterval(function () {
        $sliderNextBtn.click();
    }, 3000);
});

/* 二级菜单部分 */
//1.获取元素
const $category = $('.category-list');
const $categoryList = $('.category-list li');
const $products = $('.products');
const $contentlist = $('.item');

//对应的菜单添加鼠标移入移出的事件。
$categoryList.hover(function () {
    $products.show();
    //内容的切换
    $contentlist.eq($(this).index()).show().siblings('.item').hide();
    $category.css({
        "border-top-right-radius": "0",
        "border-bottom-right-radius": "0"
    });
}, function () {
    $products.hide();
    $category.css({
        "border-top-right-radius": "10px",
        "border-bottom-right-radius": "10px"
    });
});

$products.hover(function () {
    $products.show();
    $category.css({
        "border-top-right-radius": "0",
        "border-bottom-right-radius": "0"
    });
}, function () {
    $products.hide();
    $category.css({
        "border-top-right-radius": "10px",
        "border-bottom-right-radius": "10px"
    });
});

/* 精品推荐左右按钮事件 */
//获取元素
const $gridList = $('#gridList');
const $gridPrevBtn = $('#gridPrevBtn');
const $gridNextBtn = $('#gridNextBtn');
$gridNextBtn.on('click', function () {
    //console.log($gridList);
    $gridList.css({
        "left": "-1210px"
    });
    $(this).addClass('disabled');
    $gridPrevBtn.removeClass('disabled');
});
$gridPrevBtn.on('click', function () {
    $gridList.css({
        "left": "0"
    });
    $(this).addClass('disabled');
    $gridNextBtn.removeClass('disabled');
});

/* 中间banner小轮播 */
//获取元素
const $ecSliderBtn = $('.ec-slider-nav span');
const $ecSliderImg = $('.ec-slider-item');
let $ecAutoTimer = null;
let $_index = 0;

$ecSliderBtn.hover(function () {
    $(this).addClass('current').siblings().removeClass('current');
    $ecSliderImg.eq($(this).index()).stop(true).animate({
        opacity: 1
    }).siblings().stop(true).animate({
        opacity: 0
    });
});
/* 轮播图片切换函数 */
function autoTab() {
    /* 圆点 */
    $_index++;
    if ($_index > $ecSliderBtn.length - 1) {
        $_index = 0;
    }
    $ecSliderBtn.eq($_index).addClass('current').siblings().removeClass('current');
    /* 轮播图 */
    $ecSliderImg.eq($_index).stop(true).animate({
        opacity: 1
    }).siblings().stop(true).animate({
        opacity: 0
    });
}

//自动轮播
$ecAutoTimer = setInterval(function () {
    autoTab();
}, 3000);

$ecSliderImg.hover(function () {
    clearInterval($ecAutoTimer);
}, function () {
    $ecAutoTimer = setInterval(function () {
        autoTab();
    }, 3000);
});

//判断是否已经登录 改变首页头部内容
$(function () {
    //获取未登录
    const $unlogin = $('.unlogin_status');
    //获取登录
    const $logined = $('.logined');
    //退出登录（清除本地存储）
    const $exLogin = $('.ex-login');

    const $shopCartCount = $('.shopCart-count');
    //同步首页购物车数量
    //获取本地存储商品总数量
    let $shopAll = window.localStorage.getItem('localnum');
    let $numArr = Object.values($shopAll.split(','));
    console.log(typeof $numArr);
    let $resultShopNum = 0;

    console.log($numArr);
    $.each($numArr, function (index, value) {
        $resultShopNum = parseInt($resultShopNum) + parseInt(value);
    });
    console.log($resultShopNum);
    console.log($numArr.length);
    if (isNaN($resultShopNum)) {
        $shopCartCount.html('0');
    } else {
        $shopCartCount.html($resultShopNum);
    }


    /* 同步首页登录用户名 */
    let $loginedName = window.localStorage.getItem('loginName');
    console.log($loginedName);
    if ($loginedName !== "") {
        $unlogin.addClass('hide');
        $logined.removeClass('hide');
        $('.login-username').html($loginedName);
    }
    if ($loginedName == null) {
        $unlogin.removeClass('hide');
        $logined.addClass('hide');
        $shopCartCount.html('0');
    }

    //点击退出 退出登录
    $exLogin.on('click', function () {
        // alert(1);
        window.localStorage.removeItem('loginName');
    });
});

/* 楼层/回顶 */
//1.楼梯的显示与隐藏 - onscroll事件。
let $backTop = $('.hungBar-top');
let $louti = $('.event-float-layout'); //隐藏的楼梯
let $louceng = $('.layout-floors'); //楼层(内容)
let $loutinav = $('.hover-list li'); //8个楼梯
function scroll() {
    let $top = $(window).scrollTop();
    //f返回顶部显示隐藏
    if ($top >= 1000) {
        $backTop.show();
    } else {
        $backTop.hide();
    }
    //楼梯显示隐藏
    if ($top >= 2100) {
        $louti.addClass('tool-fixed');
    } else {
        $louti.removeClass('tool-fixed');
    }
    //4.通过滚动条的改变，给对应的楼hover梯添加激活状态(active)
    //核心：滚动条的top和楼层的top值 (如果楼层的top值>滚动条的top值，给楼层对应的楼梯添加一个激活状态)
    //获取9个楼层的top值。
    $louceng.each(function (index, element) {
        let $loucengtop = $(element).offset().top + 250; //每一个楼层的top值。
        if ($loucengtop >= $top) {
            $loutinav.removeClass('hover'); //清除所有的楼梯上面的active。
            $loutinav.eq(index).addClass('hover'); //当前对应的楼梯显示
            return false; //保证都是满足条件的第一个添加active.
        }
    });
    //讲屏幕滚动距离显示在title上方便查看
    //$('title').html($top);
}
scroll();

$(window).on('scroll', function () {
    scroll();
});

//2.点击楼梯切换到对应的楼层(运动)hover
//任意的获取每一个楼层的top值。
//点击楼梯，将楼梯对应的楼层的top值给滚动条的top值。
$loutinav.on('click', function () {
    $(window).off('scroll'); //取消滚轮事件。
    $(this).addClass('hover').siblings('li').removeClass('hover');
    let $top = $louceng.eq($(this).index()).offset().top;
    //赋值给滚动条
    $('html').animate({
        scrollTop: $top
    }, function () { //点击运动结束，开启滚轮事件
        $(window).on('scroll', function () {
            scroll();
        });
    });
});

//3.回到顶部
$backTop.on('click', function () {
    //赋值给滚动条
    $('html').animate({
        scrollTop: 0
    });
});



