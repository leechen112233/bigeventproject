$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //定义一个美化事件的过滤器函数
    template.defaults.imports.dataFormat = function (time) {
        var date = new Date(time);

        var y = date.getFullYear()
        var m = padZero(date.getMonth() + 1)
        var d = padZero(date.getDate())

        var hh = padZero(date.getHours())
        var mm = padZero(date.getMinutes())
        var ss = padZero(date.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义一个补零函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }

    // 定义一个查询的参数对象，每次向服务器查询数据的时候，就发这个q过去
    var q = {
        pagenum: 1, //页码值 默认为1
        pagesize: 2, //每页显示多少条数据 默认显示2条
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态
    }

    // 调用获取文章列表的函数
    initTable();

    //调用initArtCateList函数
    initArtCateList();

    //给筛选form表单绑定submit事件 并刷新页面
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        // console.log(q);
        initTable();
    })

    // 通过代理给删除按钮绑定click事件 并刷新页面
    $('tbody').on('click', '#btnDelete', function () {
        // 1.先拿到页面上有几个删除按钮
        var len = $('#btnDelete').length;

        var btnId = $(this).attr('data-id');
        // 1.显示confirm弹出层
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //点击确认后执行的代码
            // 2.手动发起ajax请求根据id删除对应的文章
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + btnId,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    // console.log(res);
                    layer.msg('删除成功！')
                    //注意：当文章删除后，需要判断最后一页是否还有数据，如果没数据，需要把页码之减1后再调用initTable函数 转第53行代码
                    if (len === 1) {
                        //注意：页码值最小是1，所以还要对页码值进行判断，如果页码值是1，则永远是1，如果页码值不是1再进行减1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    //调用initTable重新加载页面
                    initTable();
                    //关闭弹出层
                    layer.close(index);
                }
            })
        });
    })

    //1.实现文章列表的功能
    // 1.1通过ajax获得文章列表的数据 封装一个函数
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);
                // 1.2使用模板引擎渲染页面
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 3.1调用渲染分页的函数
                renderPage(res);
            }
        })
    }

    //2.定义获取文章分类列表的函数
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败!');
                }
                // console.log(res);
                //使用模板引擎渲染页面
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $('select[name=cate_id]').html(htmlStr);
                //由于layui.js在模板引擎渲染之前执行所以必须调用render方法才能重新渲染
                form.render();
            }
        })
    }
    // 3.定义用来渲染分页区域的函数
    function renderPage(res) {
        // console.log(res.total);
        laypage.render({
            elem: 'pages'
            , count: res.total,
            limit: q.pagesize,
            limits: [2, 3, 5, 10],
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                // jump回调函数触发的两种方式
                // 1.选择不同页码时会触发
                // 2.默认调用renderPage方法时会自动触发（容易引起死循环）
                // console.log(first);
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                q.pagenum = obj.curr;
                //根据最新的q调用initTable刷新文章列表
                //如果first是true 就是第二种触发jump回调函数

                // 把最新的条目数复制给q.pagesize
                q.pagesize = obj.limit;
                if (first !== true) {
                    initTable();
                }
            }
        });
    }
})