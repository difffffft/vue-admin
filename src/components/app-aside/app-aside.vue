<template>
  <el-menu
    :collapse="mainStore.asideCollapse"
    :default-active="mainStore.shortcutActive"
    text-color="#fff"
    active-text-color="#ffd04b"
    background-color="#545c64"
  >
    <app-logo></app-logo>

    <!-- <template v-for="(v, k) in userStore.menus.menus" :key="v.path">
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
          class="secondary-menu-item"
          :index="j.path"
          v-for="(j, i) in v.children"
          :key="j.path"
          @click="handleOpenPage(j)"
        >
          <template #title>
            <span>{{ j.meta?.title }}</span>
          </template>
        </el-menu-item>
      </el-sub-menu>
    </template> -->

    <template v-for="(v, k) in userStore.menus.menus" :key="v.path">
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

        <el-menu-item-group>
          <template v-for="j in v.children" :key="v.path">
            <el-sub-menu
              :index="j.path"
              v-if="j.children && j.children.length !== 0"
            >
              <template #title>{{ j.meta?.title }}</template>
              <el-menu-item
                :index="m.path"
                :key="m.path"
                v-for="m in j.children"
                @click="handleOpenPage(m)"
                >{{ m.meta?.title }}</el-menu-item
              >
            </el-sub-menu>
            
            <el-menu-item
              v-else
              :index="j.path"
              :key="j.path"
              @click="handleOpenPage(j)"
            >
              <span>{{ j.meta?.title }}</span>
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
.secondary-menu-item {
  padding-left: calc(
    var(--el-menu-base-level-padding) + var(--el-menu-level) *
      var(--el-menu-level-padding) + 8px
  ) !important;
}
</style>
