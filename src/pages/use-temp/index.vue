<template>
  <!-- <div>此注释不能被删除，意外的BUG</div> -->
  <!-- iframe不能给组件加name进行缓存 name="UseTemp" -->
  <!-- <iframe id="onlyoffice"></iframe> -->
  <div id="onlyoffice" v-loading="state.loading"></div>
</template>

<script lang="ts" setup>
import PubSub from "pubsub-js";
import { useRoute } from "vue-router";
import { onActivated, onBeforeUnmount, onMounted, onUnmounted } from "vue";
import { ref, reactive } from "vue";
import { getTempById } from "@/api";

const route = useRoute();
let { id, readonly } = route.query;

const title = route.meta.title;
onActivated(() => {
  PubSub.publish("setTitle", title + "-" + id);
});

const state = reactive<{
  loading: boolean;
  editor: any;
}>({
  loading: false,
  editor: null,
});

onMounted(async () => {
  try {
    state.loading = true;
    const res = await getTempById({
      templateId: route.query.id as string,
      flag: readonly as string,
    });
    const { key, fileUrl, fileName, fileType, userId } = res.data;
    console.log("fileUrl",fileUrl);
    
    //没问题就初始化编辑器
    const editorConfig = {
      width: "100%",
      height: "100%",
      editorConfig: {
        lang: "zh-CN",
        mode: "edit",
      },
      documentType: "word",
      document: {
        fileType: fileType,
        key,
        url: fileUrl,
        title: fileName,
      },
      user: {
        id: userId,
      },
      permissions: {},
    };
    state.editor = new window.DocsAPI.DocEditor("onlyoffice", editorConfig);
  } catch (error) {
  } finally {
    state.loading = false;
  }
});

onBeforeUnmount(() => {
  if (state.editor) {
    state.editor.destroyEditor();
    state.editor = null;
  }
});
</script>

<style>
#onlyoffice {
  height: 100%;
}
</style>
