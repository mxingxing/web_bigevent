$(function () {
    var layer = layui.layer;
    var form = layui.form;

    // 封装 渲染文章类别 的函数
    function initArtCateList() {
        // 发送获取文章类别的ajax
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                // 调用模板字符串
                var htmlStr = template('tpl-table', res);
                // console.log(res);
                // console.log(htmlStr);

                // 向tbody里面渲染数据
                $('tbody').html(htmlStr);
            }
        });
    }
    // 调用函数
    initArtCateList();

    // 预先保存弹出框的id  方便关闭
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        });
    })

    // 增添文章类别  需要利用事件委托（因为弹出框是动态生成的）
    $('body').on('submit', '#form-add', function (e) {
        // 取消默认提交行为
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                initArtCateList();
                layer.msg(res.message);
                // console.log(indexAdd);
                layer.close(indexAdd);
            }
        });
    })

    // 通过代理 为编辑按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', ".btn-edit", function() {
        var id = $(this).attr('data-id');
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });

        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                form.val('form-edit', res.data);
            }
        });
    })

    // 通过代理 为确认修改按钮绑定事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg(res.message)
                // 重新渲染数据
                initArtCateList();
                // 关闭弹出层
                layer.close(indexEdit);
            }
        });
    })

    // 通过代理 为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg(res.message);
                    layer.msg(res.message);
                    layer.close(index);
                    initArtCateList();
                }
            });
        });
    })

})