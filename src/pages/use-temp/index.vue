<template>
  <div>
    编辑组件
    <input />
  </div>
</template>

<script lang="ts" setup name="UseTemp">
import { useRoute } from "vue-router";
import PubSub from "pubsub-js";
import { onActivated, onMounted } from "vue";

const route = useRoute();
const { id } = route.query;
const title = route.meta.title;

onActivated(() => {
  PubSub.publish("setTitle", title + "-" + id);
});
</script>
