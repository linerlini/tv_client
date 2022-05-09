<template>
  <div class="login-wrapper">
    <div class="login-form-box" :style="{ height: boxUI.boxHeight }">
      <div class="login-box">
        <p class="box-title">ACCOUNT LOGIN</p>
        <div class="box-form">
          <el-form label-position="top" size="large" :model="loginFormData" :rules="loginFormRule" ref="loginForm">
            <el-form-item label="ACCOUNT" prop="account">
              <el-input placeholder="please input your account" v-model="loginFormData.account"></el-input>
            </el-form-item>
            <el-form-item label="PASSWORD" prop="password">
              <el-input type="password" placeholder="please input your password" v-model="loginFormData.password">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" color="#4285F4" @click="submit" :loading="submiting">LOGIN IN
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="register-box" :class="{ visible: boxUI.boxType === BoxType.REGISTER }">
        <p class="box-title">ACCOUNT LOGIN</p>
        <div class="box-form">
          <el-form label-position="top" size="large" :model="registerFormData" :rules="registerFormRule"
            ref="registerForm">
            <el-form-item label="USERNAME" prop="userName">
              <el-input placeholder="please input your username" v-model="registerFormData.userName"></el-input>
            </el-form-item>
            <el-form-item label="ACCOUNT" prop="account">
              <el-input placeholder="please input your account" v-model="registerFormData.account"></el-input>
            </el-form-item>
            <el-form-item label="PASSWORD" prop="password">
              <el-input type="password" placeholder="please input your password" v-model="registerFormData.password">
              </el-input>
            </el-form-item>
            <el-form-item label="CONFIRM PASSWORD" prop="confirmPassword">
              <el-input type="password" placeholder="please confirm your password"
                v-model="registerFormData.confirmPassword"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="large" color="white" @click="submit" :loading="submiting">REGISTER</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="close" @click="changeBoxType"></div>
      </div>
      <div class="form-toggle" @click="changeBoxType"></div>
      <div class="mark" :class="{ visible: boxUI.boxType === BoxType.REGISTER }"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue'
import type { ElForm } from 'element-plus'
import { login, LoginResponse, register } from '@/server/user'
import { ResponseData, User } from '@/types'
import { ResponseCode } from '@/config/constants'
import { useUserStore, useMovieStore } from 'store/index'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { useRouter } from 'vue-router'
import { RouteName } from '@/router'
// type interface都直接忽视，ts语法
type FormInstance = InstanceType<typeof ElForm>
// 获取用户仓库
const userStore = useUserStore()
// 获取电影仓库
const movieStore = useMovieStore()
// 获取使用路由的工具
const router = useRouter()

// 定义盒子样式
// 登录盒子高度
const LOGIN_BOX_HEIGHT = '450px'
// 注册盒子高度
const SIGN_BOX_HEIGHT = '600px'
// 盒子类型有登录和注册两种
const enum BoxType {
  LOGIN,
  REGISTER
}
// 盒子样式属性
const boxUI = reactive({
  boxType: BoxType.LOGIN,
  boxHeight: LOGIN_BOX_HEIGHT,
  markVisible: 0
})
const drawerVisible = ref(false)
// 在登录盒子和注册盒子之间切换
function changeBoxType () {
  const boxType = boxUI.boxType
  if (boxType === BoxType.LOGIN) {
    // 当前为登录盒子的时候 切换为注册盒子
    boxUI.boxType = BoxType.REGISTER
    drawerVisible.value = true
    boxUI.boxHeight = SIGN_BOX_HEIGHT
    boxUI.markVisible = 1
  } else {
    // 相反
    boxUI.boxType = BoxType.LOGIN
    boxUI.boxHeight = LOGIN_BOX_HEIGHT
    boxUI.markVisible = 0
  }
}
// 登录表单数据
const loginFormData = reactive({
  account: '',
  password: ''
})
// 拿到登录表单dom
const loginForm = ref<FormInstance>()
// 注册表单数据
const registerFormData = reactive({
  account: '',
  password: '',
  confirmPassword: '',
  userName: ''
})
// 拿到注册表单dom
const registerForm = ref<FormInstance>()
// 定义登录表单的校验规则
const loginFormRule = {
  account: [
    {
      // 定义account是必填的，在account输入失焦的时候校验一次
      required: true,
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      trigger: 'blur'
    }
  ]
}
// 定义注册表单的校验规则
const registerFormRule = {
  account: [
    {
      required: true,
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {
      required: true,
      trigger: 'blur',
      // 注册的时候不是要输两道密码迈，这个就是看第二次输的和第一次对不对
      validator (rule: any, value: any, callback: any) {
        if (value !== registerFormData.password) {
          callback(new Error("Two inputs don't match!"))
        } else {
          callback()
        }
      }
    }
  ],
  userName: [
    {
      required: true,
      trigger: 'blur'
    }
  ]
}
// 是否正在提交表单
const submiting = ref(false)
// 校验表单数据是否ok
async function checkFormData (type: BoxType) {
  let result: boolean | undefined = false
  try {
    if (type === BoxType.LOGIN && loginForm.value) {
      // 拿到登录表单的校验结果 成功还是失败
      result = await loginForm.value.validate()
    }
    if (type === BoxType.REGISTER && registerForm.value) {
      // 拿到注册表单的校验结果 成功还是失败
      result = await registerForm.value.validate()
    }
  } catch (err) {
    console.error(err)
  }
  return result
}
// 获取用户
async function getUser (type: BoxType) {
  let result: User | null | LoginResponse = null
  try {
    let reqResult: ResponseData<User> | ResponseData<LoginResponse>
    if (type === BoxType.LOGIN) {
      // 如果现在是登录，就走登录的请求
      reqResult = await login(loginFormData.account, loginFormData.password)
    } else {
      // 如果现在是注册，就走注册的请求
      reqResult = await register(
        registerFormData.account,
        registerFormData.password,
        registerFormData.userName
      )
    }
    result = reqResult.data
    ElMessage[reqResult.code === ResponseCode.SUCCESS ? 'success' : 'error'](
      reqResult.msg
    )
  } catch (err) {
    console.error(err)
  }
  return result
}
// 表单提交处理
async function submit () {
  // 设置正在提交数据
  submiting.value = true
  // 获取表单的校验结果 成功还是失败
  const checkResult = await checkFormData(boxUI.boxType)
  if (!checkResult) {
    return
  }
  // 获取用户数据
  const data = await getUser(boxUI.boxType)
  if (data) {
    // 登录或者注册成功
    // collections是收藏
    const { userInfo, collections } = data as LoginResponse
    userStore.$state = {
      ...userInfo,
      isLogin: true
    }
    movieStore.collectMovie = collections
    // 上面一坨就是把用户信息 收藏信息都存起来
    // 跳转首页
    nextTick(() => {
      router.push({
        name: RouteName.MAIN
      })
    })
  }
  submiting.value = false
}
</script>
<style lang="scss" scoped>
$box-background: white;
$box-width: 600px;
$title-font-size: 24px;
$login-title-color: #4285f4;
$signin-title-color: white;

.login-wrapper {
  height: 100%;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;

  .login-form-box {
    width: $box-width;
    background-color: $box-background;
    border-radius: 4px;
    box-shadow: 0 0 30px rgb(0 0 0 / 10%);
    position: relative;
    transition: all 0.3s ease;
    overflow: hidden;

    .login-box {
      height: 100%;
      padding: 60px;
      padding-right: 90px;

      .box-title {
        color: $login-title-color;
        text-align: left;
      }
    }

    .register-box {
      width: 100%;
      position: absolute;
      top: 0px;
      bottom: 0px;
      right: -100%;
      background-color: #4285f4;
      padding: 60px;
      padding-right: 120px;
      transition: all 0.3s ease;
      transform: translateX(0px);
      z-index: 2;

      &.visible {
        transform: translateX(calc(-100% + 60px));
      }

      .box-title {
        color: $signin-title-color;
      }

      .close {
        position: absolute;
        width: 60px;
        height: 60px;
        background-color: white;
        border-radius: 50%;
        top: 45px;
        right: 120px;
        cursor: pointer;

        &::before,
        &::after {
          content: '';
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 30px;
          height: 4px;
          background: #4285f4;
          transform: translate(-50%, -50%);
        }

        &::before {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        &::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
      }

      :deep(.el-form-item__label) {
        color: white;
      }

      :deep(.el-button) {
        color: #4285f4;
      }
    }

    .box-title {
      font-size: $title-font-size;
      font-weight: 700;
      margin-bottom: 40px;
      text-align: left;
    }

    .form-toggle {
      position: absolute;
      right: 0px;
      top: 0px;
      bottom: 0px;
      width: 30px;
      background-color: #4285f4;
      transition: width 0.3s ease;
      cursor: pointer;

      &::after,
      &::before {
        content: '';
        width: 2px;
        height: 30px;
        background-color: #689df6;
        top: 50px;
        position: absolute;
        opacity: 1;
        transition: opacity 0.3s ease;
      }

      &::before {
        left: 9px;
      }

      &::after {
        right: 9px;
      }

      &:hover {
        width: 42px;

        &::before,
        &::after {
          opacity: 0;
        }
      }
    }

    .mark {
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
      background: #333333;
      z-index: -1;
      transition: opacity 0.3s ease;
      opacity: 0;

      &.visible {
        z-index: 1;
        opacity: 1;
      }
    }

    :deep(.el-form-item__label) {
      color: rgba(0, 0, 0, 0.6);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.2em;
    }

    :deep(.el-button) {
      width: 100%;
      padding: 20px 12px;
      font-weight: 600;
    }
  }
}
</style>
