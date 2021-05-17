$(function () {
    //自定义密码的校验规则
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd').val()) {
                return '新旧密码不能一致！';
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    });

    //给form表单绑定submit事件
    $('.layui-form').on('submit', function () {
        // 手动发送ajax数据请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改密码失败！')
                }
                layer.msg('修改密码成功！');
                console.log(res);
                // 成功后要重置form表单
                $('.layui-form')[0].reset();
            }
        })
    })
})
