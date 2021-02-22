
//myjs
//1.引入jquery模块
import { } from 'https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js';
//引入首页js模块
import { } from '../script/index_module.js';


//2.获取本地存储里面的数据进行渲染(渲染过程封装函数实现)
if (localStorage.getItem('localsid') && localStorage.getItem('localnum')) {
    let arrsid = localStorage.getItem('localsid').split(','); //编号  
    let arrnum = localStorage.getItem('localnum').split(','); //数量  
    for (let i = 0; i < arrsid.length; i++) {
        renderList(arrsid[i], arrnum[i]); //sid:编号  num:数量。
    }

}

//3.封装函数实现渲染过程 - 克隆方式
//隐藏的元素进行克隆 
//:hidden  匹配所有不可见元素，或者type为hidden的元素
//clone([Even[,deepEven]])克隆匹配的DOM元素并且选中这些克隆的副本。里面两个参数都是布尔值，表示是否克隆元素身上的事件和是否克隆元素身上的事件和子元素。
//parents([expr]):获取当前元素所有的父节点，参数就是具体的父节点
//例如：$('.box').parents();获取所有的box的父节点，包括body、html、document
//例如：$('.box').parents('body');获取所有的box的父节点，仅取到body。

//获取所有的接口数据，通过传入的sid和接口数据的sid进行比较，找到对应的那条数据。
function renderList(sid, num) { //sid:编号  num:数量。
    $.ajax({
        url: 'http://10.31.165.42/VMALL.COM/php/v_allData.php',
        dataType: 'json'
    }).done(function (data) {
        $.each(data, function (index, value) { //遍历数组和对象  index:数组索引  value:每一个数据-对象
            if (value.sid === sid) { //根据当前的sid找对应的数据
                let $clonebox = $('.goods-item:hidden').clone(true, true);
                $clonebox.find('.goods-pic img').attr('src', value.picurl);
                $clonebox.find('.goods-pic img').attr('sid', value.sid); //给图片对象添加一个自定义属性(数组的索引)
                $clonebox.find('.goods-d-info a').html(value.title);
                $clonebox.find('.b-price strong').html(value.price);
                $clonebox.find('.quantity-form input').val(num);
                $clonebox.find('.b-sum strong').html((value.price * num).toFixed(2));
                $clonebox.css('display', 'block'); //显示克隆的元素
                $('.item-list').append($clonebox); //追加

                allprice(); //计算总价
            }
        })
    });
}

//注意事项，接下来的操作针对可视的购物车列表操作，忽略隐藏的购物车列表。
//:visible匹配所有的可见元素 - $('.goods-item:visible')




//4.封装函数统计商品的数量和总价(多次涉及改变，所有封装)
function allprice() {
    let $allnum = 0; //存储商品的数量
    let $allprice = 0; //存储商品的总价
    $('.goods-item:visible').each(function (index, element) { //遍历多个元素对象，index:索引   element:元素的元素对象。
        //$(this):当前操作的商品列表goods-item
        if ($(this).find('.cart-checkbox input').prop('checked')) { //判断当前的商品列表前面的复选框是否是选中的
            $allnum += parseInt($(this).find('.quantity-form input').val());
            $allprice += parseInt($(this).find('.b-sum strong').html());
        }
    });

    $('.amount-sum em').html($allnum); //赋值总的数量
    $('.totalprice').html('￥' + $allprice + '.00'); //赋值总的价格
}


//5.全选
$('.allsel').on('click', function () {
    $('.goods-item:visible').find('input:checkbox').prop('checked', $(this).prop('checked'));
    $('.allsel').prop('checked', $(this).prop('checked'));
    allprice();
});


$('.item-list').on('click', 'input:checkbox', function () {
    if ($('.goods-item:visible').find('input:checkbox').length === $('.goods-item:visible').find('input:checked').length) {
        $('.allsel').prop('checked', true);
    } else {
        $('.allsel').prop('checked', false);
    }
    allprice();
});

// 6.数量的改变
$('.quantity-add').on('click', function () {
    let $num = $(this).parents('.goods-item').find('.quantity-form input').val();
    $num++;
    $(this).parents('.goods-item').find('.quantity-form input').val($num);

    $(this).parents('.goods-item').find('.b-sum strong').html(singleprice($(this))); //计算单价以及赋值
    allprice(); //计算总价

    localStorageData($(this)); //重新将数量添加到本地存储
});

$('.quantity-down').on('click', function () {
    let $num = $(this).parents('.goods-item').find('.quantity-form input').val();
    $num--;
    if ($num <= 1) {
        $num = 1
    }
    $(this).parents('.goods-item').find('.quantity-form input').val($num);
    $(this).parents('.goods-item').find('.b-sum strong').html(singleprice($(this))); //计算单价以及赋值
    allprice(); //计算总价
    localStorageData($(this)); //重新将数量添加到本地存储
});

$('.quantity-form input').on('input', function () {
    let $reg = /^\d+$/; //行首行尾匹配一个或者多个数字
    if (!$reg.test($(this).val())) { //如果不满足条件，值为1
        $(this).val(1);
    }
    $(this).parents('.goods-item').find('.b-sum strong').html(singleprice($(this))); //计算单价以及赋值
    allprice(); //计算总价
    localStorageData($(this)); //重新将数量添加到本地存储
});

//封装函数实现小计的改变
function singleprice(obj) { //obj:当前操作的元素对象。
    let $price = obj.parents('.goods-item').find('.b-price strong').html(); //单价
    let $num = obj.parents('.goods-item').find('.quantity-form input').val(); //数量
    return ($price * $num).toFixed(2); //保留2位小数
}




//7.将修改后的值存的本地存储里面。
//商品编号和数量的数组。
let $arrsid = []; //存储的商品编号,以及获取本地存储的商品编号
let $arrnum = []; //存储商品的数量,以及获取本地存储的商品数量

function getLocalStorage() {
    if (localStorage.getItem('localsid') && localStorage.getItem('localnum')) { //商品已经存储过
        $arrsid = localStorage.getItem('localsid').split(','); //将获取的编号转换成数组，方便后面判断是否存在当前编号。
        $arrnum = localStorage.getItem('localnum').split(',');
    } else {
        $arrsid = [];
        $arrnum = [];
    }
}

//封装函数实现本地存储。
//获取当前商品的sid,通过商品的sid才能找到对应的数量。
function localStorageData(obj) { //obj:当前操作的元素对象。
    getLocalStorage(); //获取本地存储，将其转换成数组。
    let $index = obj.parents('.goods-item').find('.goods-pic img').attr('sid'); //获取对应的sid  
    $arrnum[$arrsid.indexOf($index)] = obj.parents('.goods-item').find('.quantity-form input').val(); //根据sid将对应的新的数量赋值给数组,重新存储。
    localStorage.setItem('localnum', $arrnum); //本地存储
}


//8.删除购物车商品列表
$('.b-action a').on('click', function () {
    let $this = $(this);
    if (window.confirm('你确定要删除吗?')) {
        $this.parents('.goods-item').remove();
        delstorage($arrsid, $(this).parents('.goods-item').find('.goods-pic img').attr('sid'));
        allprice(); //计算总价
    }
});

$('.operation a').on('click', function () {
    if (window.confirm('你确定要删除吗?')) {
        $('.goods-item:visible').each(function (index, element) {
            if ($(this).find('.cart-checkbox input').is(':checked')) { //找到复选框，是否是选中的，如果是返回true
                $(this).remove();
                delstorage($arrsid, $(this).find('.goods-pic img').attr('sid'));
                allprice(); //计算总价
            }
        });
    }
});

//点击结算按钮 清空购物车商品id和数量
$('.settlement-btn').on('click', function () {
    if ($('.amount-sum em').html() == 0) {
        alert("没有可以结算的商品！");

    } else {
        if (window.confirm('确定要结算当前选中商品吗？')) {
            $('.goods-item:visible').each(function (index, element) {
                if ($(this).find('.cart-checkbox input').is(':checked')) { //找到复选框，是否是选中的，如果是返回true
                    $(this).remove();
                    delstorage($arrsid, $(this).find('.goods-pic img').attr('sid'));
                    allprice(); //计算总价
                }
            });
            alert('结算成功！');
        }
    }
});

//通过删除按钮找到本地存储对应的值，将其删除，重新设置本地存储。

//[1,3,2,4]   3
function delstorage(arrsid, sid) { //arrsid:数组   sid:数组中对应的值
    getLocalStorage(); //将获取的本地存储的值转换成数组
    let $index = -1; //存储索引的
    $.each(arrsid, function (index, valuesid) {
        if (valuesid == sid) {
            $index = index; //满足条件的值对应的索引赋值给$index
        }
    });

    //获取对应的索引进行删除。
    $arrsid.splice($index, 1);
    $arrnum.splice($index, 1);

    //重新设置本地存储。
    localStorage.setItem('localsid', $arrsid);
    localStorage.setItem('localnum', $arrnum);
}
//判断商品本地存储的数量，没有数据讲购物车为空的区域显示
const $cartWrap = $('.cart-wrap');
const $cartEmpty = $('.cart-empty');
let $loginedName = window.localStorage.getItem('loginName');
if (window.localStorage.getItem('localnum') == "" || $loginedName == null) {
    $cartEmpty.show();
    $cartWrap.hide();
} else {
    $cartEmpty.hide();
    $cartWrap.show();
}

