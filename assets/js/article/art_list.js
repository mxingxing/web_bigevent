$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage

    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 获取文章列表并渲染
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                renderPage(res.total);
            }
        });
    }

    initTable();

    // 美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        var dt = new Date();
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth());
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    // 补零函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }

    // 渲染筛选下拉列表
    $.ajax({
        type: "GET",
        url: "/my/article/cates",
        success: function (res) {
            if (res.status !== 0) return layer.msg(res.message);
            var htmlStr = template('tpl-cate', res);
            $('[name=cate_id]').html(htmlStr);
            // layui重新渲染数据
            form.render();
        }
    });

    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })

    // 渲染分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 8, 10],
            jump: function (obj,first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;

                //首次不执行
                if (!first) {
                    initTable();
                }
            }
        });
    }

    // 删除操作
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        var num = $('.btn-delete').length;
        console.log(num);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg(res.message);
                    layer.msg(res.message);

                    if (num === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            });
            layer.close(index);
        })
    })

    // 编辑操作
    $('tbody').on('click', '.btn-edit', function() {
        var id = $(this).attr('data-id');
        // console.log(id);
        location.href = '/article/art_edit.html?id=' + id;
    })

})