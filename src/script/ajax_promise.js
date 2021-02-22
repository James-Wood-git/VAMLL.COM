function $ajax(option) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        //1. 设置请求方式
        option.type = option.type || 'get';

        //2. *设置接口地址，没有设置地址则抛出错误
        if (!option.url) {
            throw new Error('请输入接口地址！');
        }

        //3. 判断是否异步
        if (option.async === 'false' || option.async === false) {
            option.async = false;
        } else {
            option.async = true;
        }

        //4. 设置数据（①数据是否存在 ②判断数据类型并转换）
        //判断数据类型并转换
        function objData(obj) {
            //声明一个空数组 用来存放数据
            let arr = [];
            //遍历数据对象
            for (let i in obj) {
                arr.push(i + '=' + obj[i]);//name=zhangsan
            }
            //将遍历获得的每一项数据以 & 符号进行拼接，并返回
            return arr.join('&');//name=zhangsan&age=18
        }
        //判断数据是否存在
        if (option.data) {
            //判断数据类型是不是对象
            if (Object.prototype.toString.call(option.data) === '[object Object]') {
                //数据是对象就调用对象数据的转换方法 objData(),并赋值给option对象的data属性
                option.data = objData(option.data);
            }

        }

        //5. 发送数据  并且发送的方式是 get
        //数据存在 并且 发送的方式是 get
        if (option.data && option.type === 'get') {
            //然后就将我们处理好的数据用【？】拼接到地址栏后面
            option.url += '?' + option.data;
        }

        xhr.open(option.type, option.url, option.async);

        //6. 发送数据 并且发送的方式是 post
        //数据存在 并且 发送的方式是post
        if (option.data && option.type === 'post') {
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            xhr.send(option.data);
        } else {//get方式
            xhr.send();
        }

        //7. 判断是不是异步
        if (option.async) {//异步
            //添加事件监听
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        //声明一个变量存放数据，并对数据进行初始化
                        let shuju = null;
                        //判断数据类型是不是json,是的话就将json数据转成json对象
                        if (option.dataType === 'json') {
                            shuju = JSON.parse(xhr.responseText);
                        } else {
                            shuju = xhr.responseText;
                        }
                        resolve(shuju);
                    } else {
                        reject('接口地址有误！');
                    }
                }
            }
        } else { //同步（无需监听）
            if (xhr.status === 200) {
                //声明一个变量存放数据，并对数据进行初始化
                let shuju = null;
                //判断数据类型是不是json,是的话就将json数据转成json对象
                if (option.dataType === 'json') {
                    shuju = JSON.parse(xhr.responseText);
                } else {
                    shuju = xhr.responseText;
                }
                resolve(shuju);
            } else {
                reject('接口地址有误！');
            }
        }
    });
}