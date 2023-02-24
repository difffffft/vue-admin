<template>
  <div class="page login">
    <div
      class="bg"
      :style="{ backgroundImage: 'url(' + state.bgImage + ')' }"
    ></div>
    <div class="content">
      <div class="content__wrapper">
        <h3>欢迎<span>登录</span></h3>
        <div class="from">
          <div class="form-item">
            <div class="desc">
              <el-icon> <Avatar /> </el-icon><span>用户名</span>
            </div>
            <el-input
              class="form-input"
              v-model="state.username"
              placeholder="请输入账号"
            ></el-input>
          </div>
          <div class="form-item">
            <div class="desc">
              <el-icon>
                <Briefcase />
              </el-icon>
              <span>密码</span>
            </div>

            <el-input
              class="form-input"
              v-model="state.password"
              placeholder="请输入密码"
              type="password"
              show-password
              @keyup.enter="handleLogin"
            ></el-input>
          </div>
        </div>
        <div class="login-btn__wrapper">
          <el-button
            type="primary"
            class="login-btn"
            :loading="state.loading"
            @click="handleLogin"
            >{{ state.loadingText }}</el-button
          >
          <el-button class="login-forget-btn">忘记密码?</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Cookie from "js-cookie";
import { reactive } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { reqLogin } from "@/api";

const route = useRoute();
const callback = (route.query.callback as string) || "/";
const state = reactive({
  username: "",
  password: "",
  loading: false,
  loadingText: "登录",
  bgImage: require("@/assets/login_bg.png"),
  router: useRouter(),
});

const handleLogin = async () => {
  state.loading = true;
  state.loadingText = "登录中";
  try {
    let res: any = await reqLogin({
      username: state.username,
      password: state.password,
    });
    const { token } = res.data;
    //持久化用户信息
    Cookie.set("token", token);
    ElMessage.success("登录成功");
    state.router.push(callback);
  } catch (err: any) {
    console.log(err);
    ElMessage.error(err.message);
  } finally {
    state.loading = false;
    state.loadingText = "登录";
  }
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;

  .bg {
    width: 60%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .content {
    // width: 40%;
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: scroll;

    .content__wrapper {
      width: 100%;
      padding: 18%;

      h3 {
        font-size: 36px;
        font-weight: 600;
        letter-spacing: 2px;

        span {
          color: var(--el-color-primary);
        }
      }

      .from {
        margin-top: 60px;

        .form-item {
          margin-top: 30px;

          .desc {
            display: flex;
            align-items: center;

            .el-icon {
              color: var(--el-color-primary);
            }

            img {
              width: 16px;
              height: 16px;
            }

            span {
              margin-left: 8px;
            }
          }

          .form-input {
            margin-top: 10px;
            height: 56px;

            :global(.el-input__wrapper) {
              padding: 0 24px;
              background-color: rgba(
                $color: var(--el-color-primary),
                $alpha: 0.04
              ) !important;
            }
          }
        }
      }

      .login-btn__wrapper {
        display: flex;
        margin-top: 60px;

        .el-button {
          height: 56px;
        }

        .login-btn {
          flex: 6;
        }

        .login-forget-btn {
          flex: 4;
        }
      }
    }
  }
}

@media screen and (max-width: 780px) {
  .login {
    .bg {
      width: 0;
    }
  }
}
</style>
