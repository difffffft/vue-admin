<template>
  <el-menu
    :collapse="mainStore.asideCollapse"
    class="el-menu-vertical-demo"
    :default-active="mainStore.shortcutActive"
    text-color="#fff"
    active-text-color="#ffd04b"
    background-color="#545c64"
  >
    <app-logo></app-logo>
    <template v-for="(v, k) in userStore.menus" :key="v.path">
      <el-menu-item
        :index="v.path"
        v-if="!v.children || (v.children && v.children.length == 0)"
        @click="handleOpenPage(v)"
      >
        <el-icon>
          <component :is="v.meta?.icon"></component>
        </el-icon>
        <span>{{ v.meta?.title }}</span>
      </el-menu-item>
      <el-sub-menu :index="v.path" v-else>
        <template #title>
          <el-icon>
            <component :is="v.meta?.icon"></component>
          </el-icon>
          <span>{{ v.meta?.title }}</span>
        </template>
        <el-menu-item
          :index="j.path"
          v-for="(j, i) in v.children"
          :key="j.path"
          @click="handleOpenPage(j)"
          >{{ j.meta?.title }}</el-menu-item
        >
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
import AppLogo from "@/components/app-logo/app-logo.vue";
import { RouteRecordRaw, useRoute, useRouter } from "vue-router";
import { useAppStore, useUserStore } from "@/store";

const mainStore = useAppStore();
const userStore = useUserStore()
const router = useRouter();
const route = useRoute();

const handleOpenPage = (item: AppRouteRecord) => {
  route.path !== item.path && router.push(item.path);
};
</script>

<style lang="scss" scoped></style>
