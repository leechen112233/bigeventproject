$(function () {
    var form = layui.form;
    form.verify({
        nickname: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === '共产党' || value === '犯罪') {
                return '昵称不能含有敏感词汇';
            }
            if (value.length < 6 || value.length > 12) {
                return '昵称必为6到12个字符';
            }
        }
    });
    //调用initUserInfor函数
    initUserInfor();

    //给提交按钮绑定点击事件
    $('.layui-form').on('submit', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        // console.log($(this).serialize());
        //调用updateUserInfo()函数
        updateUserInfo();
    })

    //给重置按钮绑定点击事件
    $('#btnReset').on('click', function (e) {
        //阻止表单的默认重置行为
        e.preventDefault();
        //再次调用initUserInfor方法
        initUserInfor();
    })

    // 定义一个函数初始化用户的信息
    function initUserInfor() {
        //参考是的之前index.js里的函数
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                //判断res.status
                if (res.status != 0) {
                    return layer.msg('获取用户信息失败')
                }
                //使用layui的form.val()快速给表单元素赋值
                form.val('formUserInfo', res.data);
            },
        })
    }

    //定义一个函数更新用户信息
    function updateUserInfo() {
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg('更新用户信息失败！')
                layer.msg('更新用户信息成功！');
                // console.log(res);
                //调用父页面的方法 window只的是当前js所在的页面
                // parent指的是父页面
                window.parent.getUserInfor();
            }
        })
    }
})