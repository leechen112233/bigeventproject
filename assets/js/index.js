$(function () {
    getUserInfor();

    //到处layer对象
    var layer = layui.layer;

    //给退出按钮绑定点击事件
    $('#logout').on('click', function () {
        layer.confirm('确定退出？', { icon: 3, title: '提示' }, function (index) {
            layer.close(index);
            //清空localStorag
            localStorage.removeItem('token');
            //跳转页面
            location.href = 'login.html';
        });
    })
})

//定义一个获取用户信息的函数
function getUserInfor() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        //设置请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            //判断res.status
            if (res.status != 0) {
                return layer.msg('获取用户信息失败')
            }
            renderUserAvatar(res);
        },
        //无论成功还是失败，都会调用complete回调函数
        // complete: function (res) {
        //     // console.log('执行了complete回调函数');
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // 1.强制清空token
        //         localStorage.removeItem('token');
        //         // 2.强制跳转到login.html页面
        //         location.href = 'login.html';
        //     }
        // }
    })
}

// 定义一个渲染用户头像的函数
function renderUserAvatar(res) {
    // 获取用户名称
    var name = res.data.nickname || res.data.username;
    //渲染用户页面
    $('#welcome').html('welcome&nbsp;&nbsp;' + name);
    //按需渲染头像
    if (res.data.user_pic) {
        $('.layui-nav-img').attr('src', res.data.user_pic).show();
        return $('#text-avatar').hide();
    }
    $('.layui-nav-img').hide();
    $('.text-avatar').text(name[0].toUpperCase()).show();
}

