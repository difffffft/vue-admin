<template>
  <div class="temp-category-manage table-crud">
    <!-- 结果展示区域 -->
    <div class="table-result">
      <!-- 用户操作区域 -->
      <div class="table-options">
        <el-button type="primary" icon="Plus" @click="handleCreateClick"
          >新增分类</el-button
        >
      </div>

      <el-table
        border
        :data="state.tableData"
        style="width: 100%"
        v-loading="state.loading"
      >
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="fileCategoryName" label="分类名称" />
        <el-table-column prop="insertTime" label="创建时间" />
        <el-table-column
          fixed="right"
          label="操作"
          class="table-item-options"
          width="300px"
        >
          <template #default="scoped">
            <!-- <el-button type="success" icon="Search" circle /> -->
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
      <el-form-item label="分类名称" label-width="140px">
        <el-input
          v-model="InsertUpdateDialogData.formData.fileCategoryName"
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
import {
  reqDeleteCategory,
  reqGetCategoryAll,
  reqInsertCategory,
  reqUpdateCategory,
} from "@/api";

enum DIALOG_MODE {
  CREATE,
  UPDATE,
}

const pageSizeList = [5, 10, 20];
/**
 * 表单数据
 */
const state = reactive({
  // 查询的所有数据
  tableData: <QueryCategoryResultType[]>[],
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
});

/**
 * 筛选表单的数据
 */
const filterFormData = reactive({
  username: "",
  nickname: "",
  reset() {
    filterFormData.username = "";
    filterFormData.nickname = "";
  },
});

/**
 * 按条件分页查询
 */
const handleFilterQuery = async () => {
  state.loading = true;
  try {
    const res = await reqGetCategoryAll();
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
  formData: <UpdateCategoryFormType>{
    id: "",
    fileCategoryName: "",
  },
  //重置数据
  reset() {
    InsertUpdateDialogData.formData.id = "";
    InsertUpdateDialogData.formData.fileCategoryName = "";
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
  InsertUpdateDialogData.formData.fileCategoryName =
    state.tableData[index].fileCategoryName;

  InsertUpdateDialogData.visible = true;
};
const handleDialogOk = async () => {
  InsertUpdateDialogData.loading = true;

  switch (InsertUpdateDialogData.mode) {
    case DIALOG_MODE.CREATE:
      try {
        const res = await reqInsertCategory({
          fileCategoryName: InsertUpdateDialogData.formData.fileCategoryName,
        });
        ElMessage.success("新增成功");
      } catch (error) {}
      break;
    case DIALOG_MODE.UPDATE:
      try {
        const res = await reqUpdateCategory({
          id: InsertUpdateDialogData.formData.id,
          fileCategoryName: InsertUpdateDialogData.formData.fileCategoryName,
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
      await reqDeleteCategory({
        id,
      });
      ElMessage.success("删除成功");
      handleFilterQuery();
    } catch (error) {
    }
  });
};

handleFilterQuery();
</script>

<style lang="scss" scoped></style>
