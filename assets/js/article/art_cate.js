$(function () {
    var layer = layui.layer;

    var form = layui.form;

    var indexAdd = null;

    var indexEdit = null;

    initArtCateList();

    //给添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        // console.log('ok');
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    //给弹出层的form表单添加submit事件
    //注意这里必须通过代理的形式绑定事件
    $('body').on('submit', '#form-add', function (e) {
        // console.log($(this).serialize());
        // console.log('触发了新增分类事件');
        //如果不加阻止表单默认提交行为会报错
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                console.log('新增文章分类成功！');
                // console.log(res);
                initArtCateList();
                layer.close(indexAdd);
            }
        })
    })

    //通过代理给btn-edit绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        // 根据点击的按钮拿到id值(使用自定义属性)
        var btnId = $(this).attr('data-id');
        // console.log(btnId);
        // 再根据id值获取对应的信息
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + btnId,
            success: function (res) {
                console.log(res);
                // 再把信息添加在弹出层里
                // 这里可以使用layui里的form.val快速添加值
                form.val('form-edit', res.data);
            }
        })

        //通过代理给修改分类的form表单绑定submit事件
        $('body').on('submit', '#form-edit', function (e) {
            //阻止表单的默认提交行为    
            e.preventDefault();
            //发起ajax请求通过id修改相关数据
            $.ajax({
                method: "POST",
                url: "/my/article/updatecate",
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类信息失败！')
                    }
                    layer.msg('更新分类信息成功！')
                    //关闭弹出层
                    layer.close(indexEdit);
                    //再调用initArtCateList渲染页面
                    initArtCateList();
                }
            })
        })
    })

    //通过代理给btn-delete绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var btnId = $(this).attr('data-id');
        //使用提示框
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + btnId,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    // console.log(res);
                    layer.msg('删除文章分类成功！')
                    //调用initArtCateList重新加载页面
                    initArtCateList();
                    //关闭弹出层
                    layer.close(index);
                }
            })
        });
    })
})

//定义获取文章列表的函数
function initArtCateList() {
    $.ajax({
        method: "GET",
        url: "/my/article/cates",
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章类别失败!');
            }
            // layer.msg('获取文章类别成功!');
            var htmlStr = template('tpl-table', res);
            // console.log(htmlStr);
            $('tbody').html(htmlStr);
        }
    })
}