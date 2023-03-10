<template>
  <el-container>
    <el-aside>
      <app-aside />
    </el-aside>
    <el-container>
      <el-header>
        <app-header @click="handleShowAside"></app-header>
        <app-tabs />
      </el-header>
      <el-main>
        <router-view v-slot="{ Component, route }">
          <keep-alive :include="state.includeList">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </router-view>
      </el-main>
      <!-- <el-footer></el-footer> -->
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import AppAside from "@/components/app-aside/app-aside.vue";
import AppHeader from "@/components/app-header/app-header.vue";
import AppTabs from "@/components/app-tabs/app-tabs.vue";
import { useAppStore } from "@/store";
import { reactive, watch } from "vue";
import { useRoute } from "vue-router";
const appStore = useAppStore();

const handleShowAside = () => {
  appStore.$patch({ asideCollapse: !appStore.asideCollapse });
};

const state = reactive({
  includeList: new Array(),
});
const route = useRoute();
watch(
  () => route,
  (newVal, oldVal) => {
    if (
      newVal.meta.keepAlive &&
      state.includeList.indexOf(newVal.name) === -1
    ) {
      state.includeList.push(newVal.name);
    }
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;

  .el-aside {
    width: auto;

    ul {
      height: 100%;
    }
  }
}

.el-menu {
  border-right: none;
}

.el-header {
  height: auto;
}

.el-main {
  background-color: #f2f2f2;
  overflow-y: scroll;
}
</style>
