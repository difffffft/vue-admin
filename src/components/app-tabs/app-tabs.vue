<template>
  <div class="tabs-wrap" v-if="mainStore.shortcutList.length !== 0">
    <el-tag
      v-for="tag in mainStore.shortcutList"
      closable
      :key="tag.fullPath"
      :type="mainStore.shortcutActiveFullpath === tag.fullPath ? '' : 'info'"
      size="large"
      @click="handleTabClick(tag.fullPath)"
      @close="handleCLoseTabClick(tag.fullPath)"
    >
      {{ tag.meta.title }}
    </el-tag>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store";

const router = useRouter();
const route = useRoute();
const mainStore = useAppStore();

const handleTabClick = (fullPath: string) => {
  route.fullPath !== fullPath && router.push(fullPath);
};

const handleCLoseTabClick = (path: string) => {
  mainStore.removeShortcutItem(path);
};
</script>

<style lang="scss" scoped>
.tabs-wrap {
  padding: 12px;
  overflow-x: scroll;
  display: flex;
  scrollbar-width: 0;
  border-bottom: solid 1px rgba($color: #000000, $alpha: 0.1);
}

.tabs-wrap::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.el-tag {
  margin-left: 20px;
  cursor: pointer;
}
.el-tag:first-child {
  margin-left: 10px;
}
</style>
