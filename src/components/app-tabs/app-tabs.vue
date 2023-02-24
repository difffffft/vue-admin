<template>
    <el-tabs v-show="mainStore.shortcutList.length > 0" v-model="mainStore.shortcutActive" type="border-card" closable
        @tab-click="handleTabClick" @tab-remove="removeTab">
        <el-tab-pane v-for="item in mainStore.shortcutList" :key="item.path" :label="item.meta.title" :name="item.path">
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts" setup>
import { TabsPaneContext } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/store'

const router = useRouter()
const route = useRoute()
const mainStore = useAppStore()

const handleTabClick = (v: TabsPaneContext, k: Event) => {
    route.path !== v.paneName && router.push({ path: v.paneName as string })
}


const removeTab = (targetName: string) => {
    mainStore.removeShortcutItem(targetName)
}
</script>

<style lang="scss" scoped>
.el-tabs {
    background-color: #F2F2F2;
}

::v-deep .el-tabs--border-card {
    // background: var(--el-bg-color-overlay);
    background-color: #F2F2F2;
    background: #F2F2F2;
    border: none;
}



::v-deep .el-tabs__header {
    // margin: 0;
    background-color: #F2F2F2;
    border-top: none;
    border-bottom: none;
}

::v-deep .el-tabs__content {
    height: 0 !important;
    padding: 0;
}
</style>