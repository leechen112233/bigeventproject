// 注意：每次在调用$.get $.post $.ajax之前
// 都会调用ajaxPrefilter这个函数
//在这个函数中可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (option) {
    // console.log(option.url);
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url;
    // console.log(option.url);
})