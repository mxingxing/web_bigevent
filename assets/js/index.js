$(function() {
    getUserInfo();

    // 退出按钮
    var layer = layui.layer;
    $('.btnLogout').on('click', function() {
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 清空浏览器缓存
            localStorage.removeItem('token');
            // 返回首页
            location.href = '/login.html';

            layer.close(index);
        });
    })
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: function (res) {
            if (res.status !== 0) return layer.msg(res.message);
            renderAvatar(res.data);
        },
        // complete: function (res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 清除浏览器缓存
        //         localStorage.removeItem('token');
        //         // 返回首页
        //         location.href = '/login.html';
        //     }
        // }
    });
}

// 渲染用户的头像
function renderAvatar(user) {
    // 获取用户的昵称或用户名
    var name = user.nickname || user.username;
    // 渲染到欢迎
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first);
    }
}