<template>
  <div class="app-header">
    <div class="app-header-l">
      <el-icon :size="20" @click.stop="handleOpen">
        <Menu></Menu>
      </el-icon>
      <div class="app-header-breadcrumb">
        <!-- <el-breadcrumb separator-icon="ArrowRight">
          <el-breadcrumb-item
            :to="{ path: v.path }"
            v-for="(v, k) in mainStore.shortcutList"
            :key="v.path"
            >{{ v.meta.title }}</el-breadcrumb-item
          >
        </el-breadcrumb> -->
        <h4>{{ headerTitle }}</h4>
      </div>
    </div>
    <div class="app-header-r">
      <!-- 搜索 -->
      <div class="app-header-search">
        <el-dropdown
          ref="dropdown"
          size="large"
          trigger="contextmenu"
          max-height="400"
        >
          <el-input
            v-model.trim="state.searchText"
            size="large"
            placeholder="请输入关键词"
            prefix-icon="Search"
          />
          <template #dropdown>
            <el-dropdown-menu class="search-dropdown-menu">
              <el-dropdown-item
                class="search-dropdown-menu-item"
                v-for="(v, k) in state.searchList"
              >
                {{ v.meta?.title }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 其他功能 -->
      <!-- <div class="header-icon">
        <div class="iconfont icon-search"></div>
      </div> -->

      <!-- 账号 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar shape="square" icon="UserFilled" :size="38" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onUnmounted } from "vue";
import { useUserStore } from "@/store";
import { useRoute } from "vue-router";
import PubSub from "pubsub-js";
import lodash from "lodash";


PubSub.subscribe("setTitle", (eventName: string, title: string) => {
  headerTitle.value = title;
});
onUnmounted(() => {
  PubSub.unsubscribe("setTitle");
});

const headerTitle = ref("");
const dropdown = ref();
const route = useRoute();
const userStore = useUserStore();
const emit = defineEmits<{ (e: "click"): void }>();
const state = reactive({
  searchText: "",
  searchList: new Array<AppRouteRecord>(),
});
const handleOpen = () => {
  emit("click");
};
const handleLogout = () => {
  userStore.logout();
};

const handleSearch = lodash.debounce((value: string) => {
  state.searchList = [];
  state.searchList = userStore.menus.flattenMenus.filter((item) => {
    return item.meta && value != "" && item.meta?.title.indexOf(value) >= 0;
  });
}, 300);

watch(
  () => state.searchText,
  (newValue, oldValue) => {
    handleSearch(newValue);
  }
);

watch(
  () => [...state.searchList],
  (newValue, oldValue) => {
    if (newValue.length !== 0 && state.searchText !== "") {
      dropdown.value.handleOpen();
    }
  }
);
</script>

<style lang="scss" scoped>
.app-header {
  height: var(--el-header-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header-l,
.app-header-r {
  display: flex;
  align-items: center;
}

.app-header-r {
  flex: 1;
  justify-content: flex-end;
}

.app-header-search {
  margin-right: 12px;
  height: 38px;
}

.app-header-breadcrumb {
  padding: var(--el-header-padding);
  line-height: 1;
  max-width: 200px;
  h4 {
    font-weight: 600;
    font-size: 15px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.el-icon {
  cursor: pointer;
}

.header-icon {
  width: var(--el-header-height);
  height: var(--el-header-height);
  display: flex;
  justify-content: center;
  align-items: center;
  .iconfont {
    font-size: 24px;
  }
}

.search-dropdown-menu-item {
  padding: 60px 0px !important;
}

.search-dropdown-menu {
  width: 222px;
}
</style>
