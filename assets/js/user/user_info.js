$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify = ({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    initUserInfo();

    // 获取用户信息
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                // console.log(res);
                // 快速为表单赋值
                form.val('formUserInfo',res.data);
            }
        });
    }

    // 重置表单的数据
    $('#btnReset').on('click', function(e) {
        // 取消默认行为
        e.preventDefault();
        initUserInfo();
    })

    // 更新用户信息
    $('.layui-form').on('submit', function(e) {
        // 取消默认行为
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg(res.message);
                window.parent.getUserInfo();
            }
        });
    })
})