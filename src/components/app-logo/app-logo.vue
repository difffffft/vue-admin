<template>
    <div class="app-logo" @click="handleGoHome" :class="mainStore.asideCollapse ? 'app-collapse-logo' : ''">
        <img src="@/assets/logo.png">
        <h1>通用后台管理</h1>
    </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store'
import { useRouter } from 'vue-router';

const router = useRouter()
const mainStore = useAppStore()
const handleGoHome = () => {
    router.push({ path: '/' })
}
</script>

<style lang="scss" scoped>
.app-logo {
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;

    img {
        width: 36px;
        height: 36px;
    }

    h1 {
        text-align: center;
        color: white;
        font-size: 18px;
        text-overflow: ellipisis;
        white-space: nowrap;
        overflow: hidden;
        margin-left: 4px;
    }
}

.app-collapse-logo {
    img {
        width: 24px;
        height: 24px;
    }

    h1 {
        display: none;
    }
}
</style>