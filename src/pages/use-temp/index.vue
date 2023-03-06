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
const { id } = route.query;
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
    });
    const { key, fileUrl, fileName, fileType, userId } = res.data;
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
      events: {
      

        onRequestSaveAs(data: { title: string; url: string }) {
          console.log("另存为", data.url);
        },

        onDownloadAs(data: any) {
          console.log("下载为", data);
        },

        onRequestHistory() {
          // state.editor.refreshHistory({
          //   currentVersion: 2,
          //   history: [
          //     {
          //       changes: "changes",
          //       created: "2010-07-06 10:13 AM",
          //       key: "af86C7e71Ca8",
          //       serverVersion: "serverVersion",
          //       user: {
          //         id: "F89d8069ba2b",
          //         name: "Kate Cage",
          //       },
          //       version: 1,
          //     },
          //     {
          //       changes: "changes",
          //       created: "2010-07-07 3:46 PM",
          //       key: "Khirz6zTPdfd7",
          //       user: {
          //         id: "78e1e841",
          //         name: "John Smith",
          //       },
          //       version: 2,
          //     },
          //   ],
          // });
        },

        /**
         * 声明此方法显示历史版本按钮
         */
        onRequestHistoryData(event: any) {
          // let version = event.data;
          // state.editor.setHistoryData({
          //   changesUrl: "https://example.com/url-to-changes.zip",
          //   fileType: "docx",
          //   key: "Khirz6zTPdfd7",
          //   previous: {
          //     fileType: "docx",
          //     key: "af86C7e71Ca8",
          //     url: "https://example.com/url-to-the-previous-version-of-the-document.docx",
          //   },
          //   url: "https://example.com/url-to-example-document.docx",
          //   version: version,
          // });
        },
        // onAppReady: this.onAppReady,
        //                 onDocumentStateChange: this.events_onDocumentStateChange,
        //                 onMetaChange: this.events_onMetaChange,
        //                 onDocumentReady: this.events_onDocumentReady,
        //                 onInfo: this.events_onInfo,
        //                 onWarning: this.events_onWarning,
        //                 onError: this.events_onError,
        //                 onRequestSharingSettings: this.events_onRequestSharingSettings,
        //                 onRequestRename: this.events_onRequestRename,

        //                 onMakeActionLink: this.events_onMakeActionLink,
        //                 onRequestInsertImage: this.events_onRequestInsertImage,
        //                 onRequestSaveAs: this.events_onRequestSaveAs,

        //                 onRequestMailMergeRecipients: this.events_onRequestMailMergeRecipients,
        //                 onRequestCompareFile: this.events_onRequestCompareFile,
        //                 onRequestEditRights: this.events_onRequestEditRights,
        //                 onRequestHistory: this.events_onRequestHistory,
        //                 onRequestHistoryClose: this.events_onRequestHistoryClose,
        //                 onRequestHistoryData: this.events_onRequestHistoryData,
        //                 onRequestRestore: this.events_onRequestRestore
      },
    };
    state.editor = new window.DocsAPI.DocEditor("onlyoffice", editorConfig);

    console.log(state.editor);
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
