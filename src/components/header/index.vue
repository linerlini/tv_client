<template>
  <header :class="{ scroll: hasScrolled }">
    <!--主标题-->
    <div class="header-base">
      <div class="logo">MOVIE</div>
      <nav class="nav">
        <div class="nav-label" @click="router.push({ name: RouteName.HOME })">
          首页
        </div>
        <div class="nav-label" @click="router.push({ name: RouteName.MOVIE })">
          电影
        </div>
        <div class="nav-label" @click="router.push({ name: RouteName.VIDEO })">
          视频
        </div>
        <div
          class="nav-label"
          @click="router.push({ name: RouteName.COLLECT })"
        >
          我的收藏
        </div>
      </nav>
      <div class="tools">
        <div class="search-tool">
          <ElInput
            clearable
            :prefix-icon="Search"
            v-model="searchKeywords"
            @input="searchValueChange"
          >
          </ElInput>
        </div>
        <div class="user">
          <el-popover
            trigger="click"
            placement="bottom"
            effect="dark"
            popper-class="avatar-popper"
          >
            <div class="pop-content" @click="loginOutHandle">退出登录</div>
            <template #reference>
              <el-avatar
                shape="square"
                :size="32"
              >{{userStore.userName}}</el-avatar>
            </template>
          </el-popover>
        </div>
      </div>
    </div>
    <!--fu标题-->
    <div
      v-if="isShowSubTItle"
      class="header-subtitle"
      :style="{ top: `${subTitleTop}px` }"
    >
      <div class="subtitle" :class="{ small: selectedType }" @click="resetType">
        <span>电影</span>
        <span v-show="selectedType">-></span>
      </div>
      <div class="subgenres">
        <el-select
          v-model="selectedType"
          placeholder="类型"
          v-if="!selectedType"
          @change="typeChangeHandle"
        >
          <el-option
            v-for="(value, name) in MovieType"
            :key="name"
            :label="value"
            :value="value"
          >
          </el-option>
        </el-select>
        <div class="type subtitle" v-else>{{ selectedType }}电影</div>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { Search, UserFilled } from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'
import { throttle } from '@/utils'
import { MovieType, ResponseCode } from '@/config/constants'
import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/router'
import { useMovieStore, useUserStore } from '@/store'
import { requestLoginOut } from '@/server/user'
import { ElMessage } from 'element-plus'
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const movieStore = useMovieStore()
// 是否显示副标题
const isShowSubTItle = computed(() => route.name === RouteName.MOVIE)

// 设置标题和副标题滚动样式
const HEADER_HEIGHT = 68
const hasScrolled = ref(false)
const subTitleTop = ref(68)
onMounted(() => {
  const rootDom = document.getElementById('app')
  const scrollHandle = () => {
    const scrollTop = rootDom!.scrollTop
    requestAnimationFrame(() => {
      hasScrolled.value = scrollTop > 0
      subTitleTop.value = Math.max(0, HEADER_HEIGHT - scrollTop)
    })
  }
  rootDom!.addEventListener('scroll', throttle(scrollHandle, 100))
})
// 选择电影类型
const selectedType = ref<MovieType>()
function resetType () {
  if (selectedType.value) {
    selectedType.value = undefined
    movieStore.movieType = undefined
  }
}
function typeChangeHandle (value: string) {
  movieStore.movieType = value
}
// 搜索视频
const searchKeywords = ref('')
function searchValueChange (value: Event) {
  if (!value) {
    router.back()
  }
  if (value && route.name !== RouteName.SEARCH) {
    router.push({
      name: RouteName.SEARCH
    })
  }
  movieStore.searchKeywords = value as unknown as string
}
// 退出登录
async function loginOutHandle () {
  const result = await requestLoginOut()
  if (result.code === ResponseCode.SUCCESS) {
    userStore.isLogin = false
    router.replace({
      name: RouteName.LOGIN
    })
    ElMessage.success('退出成功，请重新登录')
  } else {
    ElMessage.error('退出失败，请重试')
  }
}
</script>
<style lang="scss" scoped>
header {
  position: relative;
  z-index: 1;
  > div {
    height: 68px;
    padding: 0 55px;
    display: flex;
    align-items: center;
    background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.7) 10%,
      rgba(0, 0, 0, 0)
    );
    background-color: transparent;
  }
  .header-base {
    color: white;
    .logo {
      color: #e50914;
      font-weight: 600;
      font-size: 26px;
      margin-right: 25px;
    }
    nav {
      display: flex;
      font-size: 14px;
      margin-right: auto;

      > div {
        margin-left: 20px;
        cursor: pointer;
      }
    }
    .tools {
      display: flex;
      align-items: center;
      margin-left: auto;
      .user {
        font-size: 0px;
        margin-left: 20px;
      }
    }
  }
  .header-subtitle {
    position: fixed;
    top: 68px;
    left: 0px;
    right: 0px;
    .subtitle {
      font-size: 38px;
      font-weight: 700;
      color: white;
      margin-right: 15px;
      &.small {
        color: grey;
        font-size: 18px;
      }
    }
    .subgenres {
      padding: 0 30px;
      :deep(.el-input) {
        width: 100px;
        .el-input__inner {
          border-radius: 0px;
          background: #000;
        }
      }
    }
  }
  &.scroll {
    > div {
      background: rgb(20, 20, 20);
    }
  }
}
.pop-content {
  text-align: center;
  font-size: 14px;
}
</style>
