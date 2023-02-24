<template>
  <el-tabs
    v-show="mainStore.shortcutList.length > 0"
    v-model="mainStore.shortcutActive"
    type="border-card"
    closable
    @tab-click="handleTabClick"
    @tab-remove="removeTab"
  >
    <el-tab-pane
      v-for="item in mainStore.shortcutList"
      :key="item.path"
      :label="(item.meta?.title as string)"
      :name="item.path"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { TabsPaneContext, TabPaneName } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store";

const router = useRouter();
const route = useRoute();
const mainStore = useAppStore();

const handleTabClick = (v: TabsPaneContext, e: Event) => {
  route.path !== v.paneName && router.push({ path: v.paneName as string });
};

const removeTab = (targetName: TabPaneName) => {
  mainStore.removeShortcutItem(targetName as string);
};
</script>

<style lang="scss" scoped>
.el-tabs {
  background-color: #f2f2f2;
}

:deep(.el-tabs--border-card) {
  background-color: #f2f2f2;
  background: #f2f2f2;
  border: none;
}

:deep(.el-tabs__header) {
  background-color: #f2f2f2;
  border-top: none;
  border-bottom: none;
}

:deep(.el-tabs__content) {
  height: 0 !important;
  padding: 0;
}
</style>
