<template>
  <div class="app-header">
    <div class="app-header-l">
      <el-icon :size="20" @click.stop="handleOpen">
        <Menu></Menu>
      </el-icon>
      <div class="app-header-breadcrumb">
        <el-breadcrumb separator-icon="ArrowRight">
          <el-breadcrumb-item
            :to="{ path: v.path }"
            v-for="(v, k) in mainStore.shortcutList"
            :key="v.path"
            >{{ v.meta.title }}</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
    </div>
    <div class="app-header-r">
      <div class="app-header-search">
        <el-input
          v-model="state.searchText"
          class="w-50 m-2"
          size="large"
          placeholder="请输入"
          prefix-icon="Search"
        />
      </div>
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar icon="UserFilled" :size="38" shape="circle" />
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
import { reactive } from "vue";
import { useAppStore, useUserStore } from "@/store";

const mainStore = useAppStore();
const emit = defineEmits<{ (e: "click"): void }>();
const state = reactive({
  searchText: "",
});
const handleOpen = () => {
  emit("click");
};
const handleLogout = () => {
  useUserStore().logout();
};
</script>

<style lang="scss" scoped>
.app-header {
  height: 100%;
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
  margin-right: 20px;
}

.app-header-breadcrumb {
  margin-left: 20px;
  line-height: 1;
}

// .app-header-r {

// }

.el-icon {
  cursor: pointer;
}
</style>
