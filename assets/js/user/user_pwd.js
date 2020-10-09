$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd:[/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function(value) {
            if (value === $('[name=oldPwd').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd').val()) {
                return '两次密码不一致！'
            }
        }
    })

    // 修改密码
    $('.layui-form').on('submit', function(e) {
        // 取消默认行为
        e.preventDefault();
        // 发起ajax
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg(res.message + '2秒后跳转到登录界面');
                $('.layui-form')[0].reset();
                setTimeout(function() {
                    return window.parent.location.href = '/login.html';
                },2000)
            }
        });
    })
})