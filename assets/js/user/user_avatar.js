$(function () {
    var layer = layui.layer;
    // 1. 实现基本的裁剪功能
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1 / 1,
        // 指定预览区域
        preview: '.img-preview'
    };

    // 1.3 创建裁剪区域
    $image.cropper(options);

    // 2.更换要被裁剪的图片
    //2.1使用代码模拟input:file的点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click();

    })
    // 2.2先给input：file绑定change事件
    // 只要选择的文件变化，就会触发change事件
    $('#file').on('change', function (e) {
        var filelist = e.target.files;
        console.log(filelist);
        if (filelist.length === 0) {
            layer.msg('请选择图片');
        }
        //1.拿到选择的文件
        var file = e.target.files[0];
        //2.生成url
        var newImgURL = URL.createObjectURL(file);
        //3.初始化裁剪区域
        $image.cropper('destroy').attr('src', newImgURL).cropper(options);
    })

    // 3.上传用户裁剪的图片并更新
    // 3.1 给确定按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        // 3.2裁剪图片后输出base64的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            }).toDataURL('image/png');       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 3.3手动发送ajax请求
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: dataURL,
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('更新头像失败！')
                }
                layer.msg('更新头像成功！')
                //调用父页面的方法重新渲染
                window.parent.getUserInfor();
            }
        })
    })
})
