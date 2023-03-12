<template>
  <div class="clause-import">
    <section>
      <p>您可以选择使用excel格式的文件<a>模板</a>进行批量导入!</p> 
      <div style="margin-top: 12px;">
         <el-button icon="Download" class="clause-import-button">条款导出</el-button>
         <el-button type="primary" icon="Upload" class="clause-import-button">条款导入</el-button>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.clause-import-button{
    width: 150px;
    height: 150px;
}
.clause-import {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
p {
  text-align: center;
}
</style>
