$(function () {
    // 点击去注册帐号的连接
    $('#login_form').on('click', 'a', function () {
        $('#reg_form').show();
        $('#login_form').hide();
    })
    // 点击去登录的连接
    $('#reg_form').on('click', 'a', function () {
        $('#login_form').show();
        $('#reg_form').hide();
    })

    // 先从layui中获得form对象
    var form = layui.form;
    // 从layui中获取layer对象
    var layer = layui.layer;
    // 2.自定义form-verify属性
    form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            if (value === 'gcd') {
                alert('用户名不能为敏感词');
                return true;
            }
        }
        //自定义password的校验规则
        , password: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        //自定义repassword校验规则
        repassword: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            var pwd1 = $('#password1').val();
            // 再进行一次是否等于的判断
            if (value != pwd1) {
                // 如果判断失败则return错误提示消息
                return '两次输入的密码不一致！';
            }
        }
    });

    // 监听注册表单提交事件
    $('#reg_form').on('submit', function (e) {
        // 组织表单的默认提交行为
        e.preventDefault();
        var username = $('#reg_form [name=username]').val();
        var password = $('#reg_form [name=password]').val();
        //发起ajax的post请求

        $.post("/api/reguser", { username: username, password: password }, function (res) {
            if (res.status != 0) {
                layer.msg(res.message)
            }
            layer.msg(res.message)
            //用程序模拟点击行为
            setTimeout(function () {
                $('#link_login').click();
            }, 1000)
        })
    })

    //监听登录表单提交事件
    $('#login_form').on('submit', function (e) {
        //组织表单的默认提交行为
        e.preventDefault();
        //手动提交ajax的post请求
        var username = $('#login_form [name=username]').val();
        var password = $('#login_form [name=password]').val();
        var data = { username: username, password: password }
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: data,
            success: function (res) {
                if (res.status != 0)
                    return layer.msg(res.message);
                //把服务器返回的token值存储在localStorage里
                localStorage.setItem('token', res.token);
                //登录成功后跳转到主页
                location.href = 'index.html';
            }
        })
    })
})