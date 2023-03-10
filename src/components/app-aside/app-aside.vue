<template>
  <el-menu
    :collapse="mainStore.asideCollapse"
    :default-active="mainStore.shortcutActive"
    text-color="#EEE"
    active-text-color="#409eff"
    background-color="#545c64"
  >
    <app-logo></app-logo>

    <template v-for="(v, k) in userStore.routesList" :key="v.path">
      <!-- 没有子菜单 -->
      <el-menu-item
        :index="v.path"
        v-if="!v.meta.menuHidden && v.children.length === 0"
        @click="handleOpenPage(v)"
      >
        <el-icon>
          <component :is="v.meta?.menuIcon"></component>
        </el-icon>
        <span>{{ v.meta?.menuTitle }}</span>
      </el-menu-item>

      <!-- 有子菜单 -->
      <el-sub-menu
        :index="v.path"
        v-else-if="!v.meta.menuHidden && v.children.length !== 0"
      >
        <template #title>
          <el-icon>
            <component :is="v.meta?.menuIcon"></component>
          </el-icon>
          <span>{{ v.meta?.menuTitle }}</span>
        </template>

        <el-menu-item-group>
          <template v-for="j in v.children" :key="v.path">
            <el-sub-menu
              :index="j.path"
              v-if="!j.meta.menuHidden && j.children.length !== 0"
            >
              <template #title>
                <el-icon>
                  <component :is="j.meta?.menuIcon"></component>
                </el-icon>
                <span>{{ j.meta?.menuTitle }}</span>
              </template>

              <el-menu-item
                :index="m.path"
                :key="m.path"
                v-for="m in j.children"
                @click="handleOpenPage(m)"
              >
                <el-icon>
                  <component :is="m.meta?.menuIcon"></component>
                </el-icon>
                <span>{{ m.meta?.menuTitle }}</span>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item
              v-else-if="!j.meta.menuHidden && j.children.length === 0"
              :index="j.path"
              :key="j.path"
              @click="handleOpenPage(j)"
            >
              <el-icon>
                <component :is="j.meta?.menuIcon"></component>
              </el-icon>
              <span>{{ j.meta?.menuTitle }}</span>
            </el-menu-item>
          </template>
        </el-menu-item-group>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
import AppLogo from "@/components/app-logo/app-logo.vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore, useUserStore } from "@/store";

const mainStore = useAppStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const handleOpenPage = (item: AppRouteRecord) => {
  route.path !== item.path && router.push(item.path);
};
</script>

<style lang="scss" scoped>

</style>
