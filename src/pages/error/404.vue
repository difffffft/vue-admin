<template>
    <div class="auto">
        <div class="container">
            <div class="settings">
                <i class="icon"></i>
                <h4>很抱歉！没有找到您要访问的页面！</h4>
                <!-- <p><span id="num">5</span> 秒后将自动跳转到首页</p> -->
                <div>
                    <RouterLink tag="a" to="/">返回首页</RouterLink>
                    <a href="javascript:;" title="上一步" id="reload-btn">上一步</a>
                </div>
            </div>
            <div class="space"></div>
            <div class="bg">
                <img src="@/assets/404-bg.png" alt="">
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.auto {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: antiquewhite;
    // margin: 230px auto;
}

.container {
    display: flex;
    // background-color: #2cb7fd;
    // background: url(@/assets/404-bg.png) no-repeat 560px top;
}

.bg {
    height: 100%;

    img {
        height: 100%;
        object-fit: contain;
    }
}

@media screen and (max-width:1080px) {
    .container {
        flex-direction: column;
        flex-flow: column-reverse;
    }

    .space {
        width: 100px;
        height: 80px;
    }

    .bg {
        width: 100%;
        height: auto;

        img {
            width: 60%;
            height: auto;
            object-fit: contain;
        }
    }
}

.space {
    width: 100px;
}

.settings .icon {
    display: block;
    width: 242px;
    height: 106px;
    background: url(@/assets/404.png) no-repeat 0 0;
}

.settings h4 {
    margin: 30px 0 15px 0;
    font-size: 18px;
    color: #2cb7fd;
}

.settings p {
    font-size: 14px;
    color: #999;
}

.settings>div {
    margin-top: 40px;
    font-size: 0;
}

.settings>div a {
    display: inline-block;
    padding: 10px 40px;
    border: 1px solid #2cb7fd;
    font-size: 15px;
    color: #2cb7fd;
    text-decoration: none;
}

.settings>div a:first-child {
    margin-right: 20px;
    color: #fff;
    background-color: #2cb7fd;
}
</style>