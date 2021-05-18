$(function () {
    // 3.定义layui的form和layer对象
    var layer = layui.layer;
    var form = layui.form;

    // 1.加载文章分类下拉菜单
    initCate();
    //1.定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }

    // 5.初始化富文本编辑 
    initEditor()

    // 6.初始化图片裁剪区域
    // 6.1. 初始化图片裁剪器
    var $image = $('#image')

    // 6.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 6.3. 初始化裁剪区域
    $image.cropper(options)

    // 7.实现用户选择图片的功能
    //模拟点击input:files事件
    $('#btnChooseImg').on('click', function () {
        // console.log('ok');
        $('#coverFile').click();
    })
    // 8.给coverFile绑定change事件
    $('#coverFile').on('change', function (e) {
        // 1. 拿到用户选择的文件
        var files = e.target.files;
        if (files.length === 0) {
            return layer.msg('没有选择文件')
        }
        // 2. 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        // 3. 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image.cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });




    // 9.定义文章的发布状态
    var art_state = '已发布';
    // 10.为存为草稿按钮绑定事件
    $('#btnSaveDraft').on('click', function () {
        art_state = '草稿';
    })

    // 为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', art_state);
                publishArticle(fd);
            })

    })
})



// 定义一个发布文章的方法
function publishArticle(fd) {
    $.ajax({
        method: "post",
        url: "/my/article/add",
        data: fd,
        //注意：如果向服务器提交的是FormData格式的数据必须添加以下两个配置项
        contentType: false,
        processDate: false,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('发布文章失败！')
            }
            console.log('发布文章成功！');
            location.href = '/article/art_list.js';
        }
    })
}