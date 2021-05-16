// 注意：每次在调用$.get $.post $.ajax之前
// 都会调用ajaxPrefilter这个函数
//在这个函数中可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (option) {
    // console.log(option.url);
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url;
    // console.log(option.url);

    //统一为有权限的接口设置有权限的请求头
    if (option.url.indexOf('/my/') >= 0)
        option.headers = { Authorization: localStorage.getItem('token') || '' };

    //统一挂在complete回调函数
    option.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 1.强制清空token
            localStorage.removeItem('token');
            // 2.强制跳转到login.html页面
            location.href = 'login.html';
        }
    }
})