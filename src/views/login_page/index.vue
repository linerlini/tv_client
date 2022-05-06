<template>
  <div class="login-wrapper">
    <div class="login-form-box" :style="{ height: boxUI.boxHeight }">
      <div class="login-box">
        <p class="box-title">ACCOUNT LOGIN</p>
        <div class="box-form">
          <el-form
            label-position="top"
            size="large"
            :model="loginFormData"
            :rules="loginFormRule"
            ref="loginForm"
          >
            <el-form-item label="ACCOUNT" prop="account">
              <el-input
                placeholder="please input your account"
                v-model="loginFormData.account"
              ></el-input>
            </el-form-item>
            <el-form-item label="PASSWORD" prop="password">
              <el-input
                type="password"
                placeholder="please input your password"
                v-model="loginFormData.password"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                color="#4285F4"
                @click="submit"
                :loading="submiting"
                >LOGIN IN</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div
        class="register-box"
        :class="{ visible: boxUI.boxType === BoxType.REGISTER }"
      >
        <p class="box-title">ACCOUNT LOGIN</p>
        <div class="box-form">
          <el-form
            label-position="top"
            size="large"
            :model="registerFormData"
            :rules="registerFormRule"
            ref="registerForm"
          >
            <el-form-item label="USERNAME" prop="userName">
              <el-input
                placeholder="please input your username"
                v-model="registerFormData.userName"
              ></el-input>
            </el-form-item>
            <el-form-item label="ACCOUNT" prop="account">
              <el-input
                placeholder="please input your account"
                v-model="registerFormData.account"
              ></el-input>
            </el-form-item>
            <el-form-item label="PASSWORD" prop="password">
              <el-input
                type="password"
                placeholder="please input your password"
                v-model="registerFormData.password"
              ></el-input>
            </el-form-item>
            <el-form-item label="CONFIRM PASSWORD" prop="confirmPassword">
              <el-input
                type="password"
                placeholder="please confirm your password"
                v-model="registerFormData.confirmPassword"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                size="large"
                color="white"
                @click="submit"
                :loading="submiting"
                >REGISTER</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div class="close" @click="changeBoxType"></div>
      </div>
      <div class="form-toggle" @click="changeBoxType"></div>
      <div
        class="mark"
        :class="{ visible: boxUI.boxType === BoxType.REGISTER }"
      ></div>
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

type FormInstance = InstanceType<typeof ElForm>

const userStore = useUserStore()
const movieStore = useMovieStore()
const router = useRouter()

// 定义盒子样式
const LOGIN_BOX_HEIGHT = '450px'
const SIGN_BOX_HEIGHT = '600px'
const enum BoxType {
  LOGIN,
  REGISTER
}
const boxUI = reactive({
  boxType: BoxType.LOGIN,
  boxHeight: LOGIN_BOX_HEIGHT,
  markVisible: 0
})
const drawerVisible = ref(false)
function changeBoxType () {
  const boxType = boxUI.boxType
  if (boxType === BoxType.LOGIN) {
    boxUI.boxType = BoxType.REGISTER
    drawerVisible.value = true
    boxUI.boxHeight = SIGN_BOX_HEIGHT
    boxUI.markVisible = 1
  } else {
    boxUI.boxType = BoxType.LOGIN
    boxUI.boxHeight = LOGIN_BOX_HEIGHT
    boxUI.markVisible = 0
  }
}
// 表单数据
const loginFormData = reactive({
  account: '',
  password: ''
})
const loginForm = ref<FormInstance>()

const registerFormData = reactive({
  account: '',
  password: '',
  confirmPassword: '',
  userName: ''
})
const registerForm = ref<FormInstance>()
// todo 获取rule的类型
const loginFormRule = {
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
  ]
}
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
// 提交数据
const submiting = ref(false)
async function checkFormData (type: BoxType) {
  let result: boolean | undefined = false
  try {
    if (type === BoxType.LOGIN && loginForm.value) {
      result = await loginForm.value.validate()
    }
    if (type === BoxType.REGISTER && registerForm.value) {
      result = await registerForm.value.validate()
    }
  } catch (err) {
    console.error(err)
  }
  return result
}
async function getUser (type: BoxType) {
  let result: User | null | LoginResponse = null
  try {
    let reqResult: ResponseData<User> | null | ResponseData<LoginResponse> = null
    if (type === BoxType.LOGIN) {
      reqResult = await login(loginFormData.account, loginFormData.password)
    }
    if (type === BoxType.REGISTER) {
      reqResult = await register(
        registerFormData.account,
        registerFormData.password,
        registerFormData.userName
      )
    }
    if (reqResult) {
      result = reqResult.data
      ElMessage[reqResult.code === ResponseCode.SUCCESS ? 'success' : 'error'](
        reqResult.msg
      )
    }
  } catch (err) {
    console.error(err)
  }
  return result
}
async function submit () {
  submiting.value = true
  const checkResult = await checkFormData(boxUI.boxType)
  if (!checkResult) {
    return
  }
  const data = await getUser(boxUI.boxType)
  if (data) {
    const { userInfo, collections } = data as LoginResponse
    userStore.$state = {
      ...userInfo,
      isLogin: true
    }
    movieStore.collectMovie = collections
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
