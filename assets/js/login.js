$(function() {
    // 点击注册按钮
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    // 点击登录按钮
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 从 layui 中获取 form 对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify() 函数自定义校验规则
    form.verify({
        pwd:[
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            // 通过形参拿到的是确认密码框的内容
            // 还需要拿到密码框里面的内容
            // 进行判断 判断失败返回一个提示消息
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return "两次密码不一致!" // 必须有return返回值
            }
        }
    })

    // 监听用户注册
    $('#form_reg').on('submit', function (e) {
        // 取消默认提交行为
        e.preventDefault();
        // ajax请求
        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg(res.message);
                $('#link_login').click();
            }
        });
    });

    // 监听用户登录
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('登陆成功！');
                localStorage.setItem('token', res.token);
                // 跳转后台页面
                location.href = '/index.html';
            }
        });
    })
})