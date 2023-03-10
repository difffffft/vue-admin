<template>
  <div class="clause-manage table-crud">
    <!-- 筛选条件 -->
    <div class="table-filter">
      <div class="table-filter-form">
        <el-form :inline="true" :model="filterFormData">
          <el-form-item label="模板分类">
            <el-select
              v-model="filterFormData.tempCategoryId"
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
          </el-form-item>
        </el-form>
      </div>
      <div class="table-filter-options">
        <el-button type="primary" icon="Plus" @click="handleCreateClick"
          >新增条款</el-button
        >
      </div>
    </div>

    <!-- 结果展示区域 -->
    <div class="table-result">
      <div class="clause-title-list">
        <li
          v-for="(v, k) in state.clauseTitleList"
          :key="v.id"
          :class="state.clauseTitleIndex === k ? 'active' : ''"
          @click="handleClauseTitleClick(k)"
        >
          <span> {{ v.title }}</span>
          <el-icon><ArrowRight /></el-icon>
        </li>
      </div>

      <el-table
        border
        :data="state.tableData"
        style="width: 100%; height: 100%"
        v-loading="state.loading"
      >
        <el-table-column prop="id" label="序号" width="100px" />
        <el-table-column prop="content" label="内容" />
        <el-table-column
          fixed="right"
          label="操作"
          class="table-item-options"
          width="210px"
        >
          <template #default="scoped">
            <el-button
              type="primary"
              icon="Edit"
              circle
              @click="handleUpdateClick(scoped.$index)"
            />
            <el-button
              type="danger"
              icon="Delete"
              circle
              @click="handleDeleteClick(scoped.$index)"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- <div class="table-pagination-block">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          v-model:current-page="state.currentPage"
          v-model:page-size="state.pageSize"
          :page-sizes="state.pageSizeList"
          :total="state.total"
          @size-change="handleFilterQuery"
          @current-change="handleFilterQuery"
        />
      </div> -->
    </div>
  </div>

  <el-dialog
    v-model="InsertUpdateDialogData.visible"
    :title="
      InsertUpdateDialogData.mode === DIALOG_MODE.CREATE ? '新增' : '修改'
    "
  >
    <el-form :model="InsertUpdateDialogData.formData">
      <el-form-item label="条款内容" label-width="140px">
        <el-input
          v-model="InsertUpdateDialogData.formData.content"
          type="textarea"
          :rows="5"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="InsertUpdateDialogData.visible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="handleDialogOk"
          :loading="InsertUpdateDialogData.loading"
        >
          {{
            InsertUpdateDialogData.mode === DIALOG_MODE.CREATE ? "新增" : "修改"
          }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive } from "vue";
import { reqGetClauseCategoryList } from "@/api/clause-manage.api";
import {
  reqDeleteClause,
  reqGetClauseList,
  reqInsertClause,
  reqUpdateClause,
} from "@/api/clause-list.api";
import { reqGetTempCategoryList } from "@/api/temp-category.api";

const enum DIALOG_MODE {
  CREATE,
  UPDATE,
}
const pageSizeList = [5, 10, 20];
/**
 * 表单数据
 */
const state = reactive({
  // 查询的所有数据
  tableData: <{ id: string; content: string }[]>[],
  // 当前页
  currentPage: 1,
  // 用户可以选择的每页数量
  pageSizeList,
  // 每页多少条数据
  pageSize: pageSizeList[1],
  // 总数据量
  total: 300,
  // 表格查询时的进度
  loading: false,

  // 模板分类列表
  tempCategoryList: <QueryTempCategoryResponse[]>[],
  // 标题索引
  clauseTitleIndex: 0,
  // 标题列表
  clauseTitleList: <{ id: string; title: string }[]>[],
});

/**
 * 筛选表单的数据
 */
const filterFormData = reactive({
  tempCategoryId: "",
  reset() {
    filterFormData.tempCategoryId = "";
  },
});

/**
 * 按条件分页查询
 */
const handleFilterQuery = async () => {
  state.loading = true;
  try {
    const res = await reqGetClauseList({
      clauseCategoryId: state.clauseTitleList[state.clauseTitleIndex].id,
      tempCategoryId: filterFormData.tempCategoryId,
    });
    state.tableData = res.data;
  } catch (error) {
  } finally {
    state.loading = false;
  }
};

/**
 * 插入或者新增的弹窗
 */
const InsertUpdateDialogData = reactive({
  // 是否显示弹窗
  visible: false,
  // 新增或者编辑之后，请求的加载进度
  loading: false,
  // 编辑模式还是新增模式
  // 默认是新增模式
  mode: DIALOG_MODE.CREATE,
  // 弹窗里面的数据
  formData: <{ id?: string; content: string }>{
    id: "",
    content: "",
  },
  //重置数据
  reset() {
    InsertUpdateDialogData.formData.id = "";
    InsertUpdateDialogData.formData.content = "";
  },
});

const handleCreateClick = () => {
  InsertUpdateDialogData.mode = DIALOG_MODE.CREATE;
  InsertUpdateDialogData.reset();
  InsertUpdateDialogData.visible = true;
};

const handleUpdateClick = (index: number) => {
  InsertUpdateDialogData.mode = DIALOG_MODE.UPDATE;
  InsertUpdateDialogData.reset();
  InsertUpdateDialogData.formData.id = state.tableData[index].id;
  InsertUpdateDialogData.formData.content = state.tableData[index].content;
  InsertUpdateDialogData.visible = true;
};
const handleDialogOk = async () => {
  InsertUpdateDialogData.loading = true;
  switch (InsertUpdateDialogData.mode) {
    case DIALOG_MODE.CREATE:
      try {
        await reqInsertClause({
          tempCategoryId: filterFormData.tempCategoryId,
          clauseCategoryId: state.clauseTitleList[state.clauseTitleIndex].id,
          content: InsertUpdateDialogData.formData.content,
        });
        ElMessage.success("新增成功");
      } catch (error) {}
      break;
    case DIALOG_MODE.UPDATE:
      try {
        await reqUpdateClause({
          id: InsertUpdateDialogData.formData.id as string,
          ccontent: InsertUpdateDialogData.formData.content,
        });
        ElMessage.success("修改成功");
      } catch (error) {}
      break;
    default:
      break;
  }

  InsertUpdateDialogData.loading = false;
  InsertUpdateDialogData.visible = false;
  handleFilterQuery();
};

const handleDeleteClick = (index: number) => {
  const { id } = state.tableData[index];
  ElMessageBox.confirm("确认删除吗,删除后不可恢复?", "删除警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      await reqDeleteClause({
        id,
      });
      ElMessage.success("删除成功");
      handleFilterQuery();
    } catch (error) {
      ElMessage.success("删除失败");
    }
  });
};

const handleClauseTitleClick = (k: number) => {
  state.clauseTitleIndex = k;
  handleFilterQuery();
};

const handleSelectTempCategory = async () => {
  try {
    const res = await reqGetClauseCategoryList({
      tempCategoryId: filterFormData.tempCategoryId,
    });
    state.clauseTitleList = res.data;
    state.clauseTitleIndex = 0;
  } catch (error) {}
  if (state.clauseTitleList.length > 0) {
    handleFilterQuery();
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
      filterFormData.tempCategoryId = state.tempCategoryList[0].id;
    }
  } catch (error) {}

  // 2.根据选择的模板分类ID,查询
  handleSelectTempCategory();
};

init();
</script>

<style lang="scss" scoped>
.table-result {
  flex-direction: row;
  margin-top: 0;
  height: 100%;
}
.clause-title-list {
  width: 200px;
  height: 100%;
  padding: 12px;
  padding-top: 0;
  li {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 8px;
    background-color: #f2f2f2;
    margin-bottom: 4px;
  }
  .active {
    background-color: var(--el-color-primary);
    color: white;
  }
}
.el-table {
  margin-top: 0;
}
</style>
