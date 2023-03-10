<template>
  <div class="app-header">
    <div class="app-header-l">
      <el-icon :size="20" @click.stop="handleOpen">
        <Menu></Menu>
      </el-icon>
      <div class="app-header-breadcrumb">
        <h4>{{ headerTitle }}</h4>
      </div>
    </div>
    <div class="app-header-r">
      <!-- 搜索 -->
      <div class="app-header-search">
        <el-input
          v-model.trim="state.searchText"
          size="large"
          placeholder="请输入关键词"
          prefix-icon="Search"
          @blur="handleSearchBlur"
          @focus="handleSearchFocus"
        />
        <ul
          class="app-search-result-panel"
          v-if="state.searchPanelShow && state.searchList.length > 0"
        >
          <li
            class="text-oneline"
            v-for="v in state.searchList"
            :key="v.path"
            @click="handleGo(v.path)"
          >
            {{ v.label }}
          </li>
        </ul>
      </div>

      <!-- 账号 -->
      <el-dropdown>
        <el-avatar
          class="text-online"
          shape="square"
          :icon="'UserFilled'"
          :size="38"
          >{{ ""[0] }}</el-avatar
        >
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleAccountSetting"
              >账号设置</el-dropdown-item
            >
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
import PubSub from "pubsub-js";
import lodash from "lodash";
import { useRouter } from "vue-router";

PubSub.subscribe("setTitle", (eventName: string, title: string) => {
  headerTitle.value = title;
});
onUnmounted(() => {
  PubSub.unsubscribe("setTitle");
});

const headerTitle = ref("");
const userStore = useUserStore();
const router = useRouter();
const emit = defineEmits<{ (e: "click"): void }>();
const state = reactive({
  searchPanelShow: false,
  searchText: "",
  searchList: <{ label: string; path: string }[]>[],
});
const handleOpen = () => {
  emit("click");
};
const handleGo = (path: string) => {
  state.searchPanelShow = false;
  router.push(path);
};
const handleLogout = () => {
  userStore.logout();
};
const handleAccountSetting = () => {
  alert("设置账号");
};

const handleSearch = lodash.debounce((value: string) => {
  state.searchList = [];
  userStore.routesSearchList.forEach((item) => {
    if (item.sname.indexOf(value) >= 0 && value.trim() !== "") {
      state.searchList.push({
        label: item.name,
        path: item.path,
      });
    }
  });
}, 300);

const handleSearchBlur = () => {
  setTimeout(() => {
    state.searchPanelShow = false;
  }, 100);
};
const handleSearchFocus = () => {
  state.searchPanelShow = true;
};

watch(
  () => state.searchText,
  (newValue, oldValue) => {
    handleSearch(newValue);
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
  position: relative;
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

.app-search-result-panel {
  position: absolute;
  z-index: 3000;
  top: 120%;
  right: 0;
  width: 100%;
  padding: 12px;
  background-color: #fff;
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  transition: var(--el-transition-box-shadow);
  transform: translate3d(0, 0, 0);
  border: 1px solid var(--el-input-border-color, var(--el-border-color));
  li {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    padding-left: 12px;
    height: 44px;
    margin-bottom: 12px;
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  }
  li:last-child {
    margin-bottom: 0;
  }
  li:hover {
    background-color: #f2f2f2;
  }
}

.el-icon {
  cursor: pointer;
}
.search-dropdown-menu-item {
  padding: 60px 0px !important;
}
.search-dropdown-menu {
  width: 222px;
}
</style>
