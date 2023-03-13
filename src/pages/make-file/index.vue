<template>
  <div class="make-file">
    <header>
      <div class="header-item" v-for="(v, k) in state.stepList">
        <div
          class="header-item-wrap"
          :class="state.stepIndex === k ? 'header-item-active' : ''"
        >
          <span class="title1"> {{ v.title1 }}</span>
          <span class="title2"> {{ v.title2 }}</span>
        </div>
        <div class="header-divider"></div>
      </div>
    </header>
    <el-divider border-style="dashed" />
    <main>
      <section v-show="state.stepIndex === 0">
        <el-form :model="state.stepData0.formData">
          <el-form-item label="项目名称" label-width="120px">
            <el-input
              :size="'large'"
              style="width: 300px"
              v-model="state.stepData0.formData.projectName"
              clearable
              placeholder="请输入项目名称"
            />
          </el-form-item>
          <el-form-item label="项目编号" label-width="120px">
            <el-input
              :size="'large'"
              style="width: 300px"
              v-model="state.stepData0.formData.projectId"
              clearable
              placeholder="请输入项目编号"
            />
          </el-form-item>
          <el-form-item label="投标人名称" label-width="120px">
            <el-input
              :size="'large'"
              style="width: 300px"
              v-model="state.stepData0.formData.tendererName"
              clearable
              placeholder="请输入投标人名称"
            />
          </el-form-item>
        </el-form>
      </section>
      <section v-show="state.stepIndex === 1">
        <!-- <h4>{{ state.stepList[state.stepIndex].title3 }}</h4> -->

        <el-select
          v-model="state.stepData1.tempCategoryId"
          @change="handleSelectTempCategory"
          placeholder="请选择模板分类"
        >
          <el-option
            v-for="item in state.tempCategoryList"
            value-key="id"
            :key="item.id"
            :value="item.id"
            :label="item.fileCategoryName"
          />
        </el-select>

        <el-table
          border
          :data="state.stepData1.tempList"
          style="width: 100%"
          v-loading="state.stepData1.loading"
        >
          <el-table-column prop="id" label="序号" />
          <el-table-column prop="fileName" label="文件名称" />
          <el-table-column prop="insertTime" label="上传时间" />
          <el-table-column prop="operator" label="上传用户" />
          <el-table-column fixed="right" label="选择模板" align="center">
            <template #default="scoped">
              <el-radio
                :size="'large'"
                v-model="state.stepData1.tempSelectId"
                :label="scoped.row.id"
              >
                {{ "" }}
              </el-radio>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-pagination-block">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            v-model:current-page="state.currentPage"
            v-model:page-size="state.pageSize"
            :page-sizes="state.pageSizeList"
            :total="state.total"
            @size-change="handleSelectTempCategory"
            @current-change="handleSelectTempCategory"
          />
        </div>
      </section>
      <section v-show="state.stepIndex === 2">
        <!-- <h4>{{ state.stepList[state.stepIndex].title3 }}</h4> -->
        <el-tree
          ref="treeRef"
          show-checkbox
          node-key="id"
          highlight-current
          expand-on-click-node
          :data="state.stepData2.clauseList"
          @check="handleClauseCheckChange"
          :default-checked-keys="state.stepData2.clauseSelectList"
          :default-expanded-keys="state.stepData2.clauseSelectList"
          :props="defaultProps"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span v-if="data.biaoxing !== '-1'">
                <el-checkbox v-model="data.biaoxing" label="标星★" />
              </span>
              <span class="node">{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </section>
      <section v-show="state.stepIndex === 3">
        <h4>{{ state.stepList[state.stepIndex].title3 }}</h4>
      </section>
    </main>
    <footer>
      <el-space :size="12">
        <el-button size="large" type="success" v-if="state.stepIndex === 3"
          >编辑</el-button
        >
        <el-button size="large" type="success" v-if="state.stepIndex === 3"
          >下载</el-button
        >
        <el-button
          size="large"
          type="success"
          :loading="state.stepData2.previewLoading"
          v-if="state.stepIndex === 2"
          @click="handlePreviewClick"
          >预览</el-button
        >
        <el-button
          size="large"
          v-if="state.stepIndex > 0"
          @click="state.stepIndex--"
          >上一步</el-button
        >
        <el-button
          size="large"
          v-if="state.stepIndex < 3"
          type="primary"
          @click="handleNext"
          >下一步</el-button
        >
      </el-space>
    </footer>
  </div>
</template>

<script lang="ts" setup name="MakeFile">
import { reqGetTempList, reqMakeFile } from "@/api";
import { reqGetClauseListByTempCategoryId } from "@/api/clause-list.api";
import { reqGetTempCategoryList } from "@/api/temp-category.api";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { ElTree } from "element-plus";
import { useRouter } from "vue-router";

const treeRef = ref<InstanceType<typeof ElTree>>();
const defaultProps = {
  children: "children",
  label: "label",
};
const router = useRouter();
const pageSizeList = [5, 10, 20];

const state = reactive({
  tempCategoryList: <QueryTempCategoryResponse[]>[],

  // 当前页
  currentPage: 1,
  // 用户可以选择的每页数量
  pageSizeList,
  // 每页多少条数据
  pageSize: pageSizeList[1],
  // 总数据量
  total: 300,

  stepIndex: 2,
  stepList: [
    {
      title1: "第一步",
      title2: "项目信息 ",
      title3: "1.请选择您的模板",
    },
    {
      title1: "第二步",
      title2: "选择模板",
      title3: "1.请选择您的模板",
    },
    {
      title1: "第三步",
      title2: "选择条款",
      title3: "2.请选择您的条款",
      data: [],
    },
    {
      title1: "第四步",
      title2: "编辑/导出",
      title3: "导出成功！\n您可以下载文件到本地或者继续编辑！",
      data: [],
    },
  ],

  stepData0: {
    formData: {
      projectName: "",
      projectId: "",
      tendererName: "",
    },
  },
  stepData1: {
    tempCategoryId: "",
    tempList: <QueryTempFormType[]>[],
    loading: false,
    tempSelectId: "",
  },
  stepData2: {
    clauseList: [],
    clauseSelectList: [],
    previewLoading: false,
  },
});

const handleSelectTempCategory = async () => {
  try {
    state.stepData1.loading = true;
    const res = await reqGetTempList({
      currentPage: state.currentPage,
      pageSize: state.pageSize,
      categoryId: state.stepData1.tempCategoryId,
    });
    state.stepData1.tempList = res.data.records;
    state.total = res.data.total;
  } catch (error) {
  } finally {
    state.stepData1.loading = false;
  }
};
const handleGetClauseList = async () => {
  try {
    const res = await reqGetClauseListByTempCategoryId({
      tempCategoryId: state.stepData1.tempSelectId,
    });
    state.stepData2.clauseList = res.data as never;
  } catch (error) {
  } finally {
  }
};

const handleNext = () => {
  //校验表单
  if (state.stepIndex === 0) {
    if (!state.stepData0.formData.projectName) {
      ElMessage.error("必须填写项目名称");
      return;
    }
    if (!state.stepData0.formData.projectName) {
      ElMessage.error("必须填写项目编号");
      return;
    }
    if (!state.stepData0.formData.projectName) {
      ElMessage.error("必须填写投标人名称");
      return;
    }
  }
  if (state.stepIndex === 1) {
    // 必须选择一个模板
    if (!state.stepData1.tempSelectId) {
      ElMessage.error("至少选择一个模板");
      return;
    }
    handleGetClauseList();
  }

  state.stepIndex++;
};
const handleClauseCheckChange = (data: any, data2: any) => {
  state.stepData2.clauseSelectList = data2.checkedKeys;
};
const handlePreviewClick = async () => {
  state.stepData2.previewLoading = true;
  const clauseIdList = treeRef.value!.getCheckedKeys(false) as string[];
  try {
    const res = await reqMakeFile({
      templateId: state.stepData1.tempSelectId,
      clauseIdList,
    });

    router.push({
      path: "/use-temp",
      query: {
        id: 0,
        readonly: 1,
      },
    });
  } catch (error) {
  } finally {
    state.stepData2.previewLoading = false;
  }
};
const init = async () => {
  // 1.查询所有模板分类，方便用户选择
  try {
    const res = await reqGetTempCategoryList();
    state.tempCategoryList = res.data;
    if (state.tempCategoryList.length <= 0) {
      ElMessage.error("一个分类都没有");
    } else {
      state.stepData1.tempCategoryId = state.tempCategoryList[0].id;
    }
  } catch (error) {}

  // 2.根据选择的模板分类ID,查询
  handleSelectTempCategory();
};

init();

handleGetClauseList();
</script>

<style lang="scss" scoped>
::v-deep(.el-tree-node__content) {
  height: 60px !important;
}
::v-deep(.el-tree-node.is-checked) {
  background-color: var(--el-tree-node-hover-bg-color);
}

header {
  display: flex;
}

.header-item {
  display: flex;
  align-items: center;
}

.header-item-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 6px;
  margin-right: 12px;
  span {
    font-size: 14px;
    color: #666666;
  }
}

.header-item-active {
  background-color: var(--el-color-primary);
  span {
    font-weight: 600;
    color: white;
  }
}
.header-divider {
  height: 1px;
  border: 0.5px dashed rgba($color: #000000, $alpha: 0.24);
  width: 120px;
}
.header-item:last-child {
  .header-divider {
    display: none;
  }
}

.make-file {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 12px;
}

main {
  flex: 1;
  overflow-y: scroll;
}
footer {
  display: flex;
  justify-content: flex-end;
}
.custom-tree-node {
  display: flex;
  align-items: center;
  .node {
    margin-left: 12px;
  }
}
</style>
