<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import PubSub from "pubsub-js";
import { onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "./store";
const appStore = useAppStore();
const route = useRoute();
PubSub.subscribe("setTitle", (eventName: string, title: string) => {
  document.title = title;
  appStore.renameShortcut(route.fullPath, title);
});
onUnmounted(() => {
  PubSub.unsubscribe("setTitle");
});
</script>

<style lang="scss"></style>
