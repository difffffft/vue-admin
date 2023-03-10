<template>
  <div class="user-manage table-crud">
    <!-- 筛选条件 -->
    <div class="table-filter">
      <div class="table-filter-form">
        <el-form :inline="true" :model="filterFormData">
          <el-form-item label="模板分类">
            <el-select
              v-model="filterFormData.categoryId"
              @change="handleSelectCategory"
              placeholder="请选择模板分类"
            >
              <el-option
                v-for="item in state.categoryList"
                value-key="id"
                :key="item.id"
                :value="item.id"
                :label="item.fileCategoryName"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div class="table-filter-options">
        <el-button icon="Refresh" @click="filterFormData.reset">重置</el-button>
        <el-button type="primary" icon="Search" @click="handleFilterQuery"
          >查询</el-button
        >
      </div> -->
    </div>

    <!-- 结果展示区域 -->
    <div class="table-result">
      <!-- 用户操作区域 -->
      <div class="table-options">
        <el-button type="primary" icon="Plus" @click="handleCreateClick"
          >导入模板</el-button
        >
      </div>

      <el-table
        border
        :data="state.tableData"
        style="width: 100%"
        v-loading="state.loading"
      >
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="fileName" label="文件名称" />
        <el-table-column prop="insertTime" label="上传时间" />
        <el-table-column prop="operator" label="上传用户" />
        <el-table-column
          fixed="right"
          label="操作"
          class="table-item-options"
          width="280px"
        >
          <template #default="scoped">
            <!-- <el-button type="success" icon="Search" circle /> -->
            <!-- <el-button
              type="primary"
              icon="Edit"
              circle
              @click="handleUpdateClick(scoped.$index)"
            /> -->
            <!-- <RouterLink to="/use-temp">使用</RouterLink> -->
            <el-button @click="handleDownloadClick(scoped.$index)"
              >下载</el-button
            >
            <el-button @click="handleUseTempClick(scoped.$index)" type="primary"
              >使用模板</el-button
            >
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
      <div class="table-pagination-block">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          v-model:current-page="state.currentPage"
          v-model:page-size="state.pageSize"
          :page-sizes="state.pageSizeList"
          :total="state.total"
          @size-change="handleFilterQuery"
          @current-change="handleFilterQuery"
        />
      </div>
    </div>
  </div>

  <el-dialog
    v-model="InsertUpdateDialogData.visible"
    :title="
      InsertUpdateDialogData.mode === DIALOG_MODE.CREATE ? '新增' : '修改'
    "
  >
    <el-form :model="InsertUpdateDialogData.formData">
      <el-form-item label="文件名称" label-width="140px">
        <el-input
          v-model="InsertUpdateDialogData.formData.fileName"
          autocomplete="off"
        />
      </el-form-item>

      <el-form-item label="分类" label-width="140px">
        <el-select
          v-model="InsertUpdateDialogData.formData.fileCategoryId"
          placeholder="请选择分类"
        >
          <el-option
            v-for="item in state.categoryList"
            value-key="id"
            :key="item.id"
            :value="item.id"
            :label="item.fileCategoryName"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="上传文件" label-width="140px">
        <el-upload
          ref="upload"
          class="file-upload"
          :headers="fileUploadHeader"
          :action="fileUploadActionUrl"
          :limit="1"
          :auto-upload="true"
          :on-exceed="handleExceed"
          :on-success="handleFileUploadSuccess"
        >
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
        </el-upload>
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

<script lang="ts" setup name="TempListManage">
import {
  ElMessage,
  ElMessageBox,
  genFileId,
  UploadInstance,
  UploadProps,
  UploadRawFile,
} from "element-plus";
import { ref, reactive } from "vue";
import {
  reqDeleteTemp,
  reqGetCategoryAll,
  reqGetTempList,
  reqInsertTemp,
  reqUpdateTemp,
} from "@/api";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";

const router = useRouter();

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
  tableData: <QueryTempFormType[]>[],
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
  //管理员可选择的角色列表
  categoryList: <QueryTempCategoryResponse[]>[],
});

/**
 * 筛选表单的数据
 */
const filterFormData = reactive({
  categoryId: "",
  reset() {
    filterFormData.categoryId = "";
  },
});

/**
 * 按条件分页查询
 */
const handleFilterQuery = async () => {
  state.loading = true;
  try {
    const res = await reqGetTempList({
      currentPage: state.currentPage,
      pageSize: state.pageSize,
      categoryId: filterFormData.categoryId,
    });
    state.tableData = res.data.records;
    state.total = res.data.total;
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
  formData: <InsertTempFormType>{
    id: "",
    fileName: "",
    fileUrl: "",
    fileCategoryId: "",
  },
  //重置数据
  reset() {
    InsertUpdateDialogData.formData.id = "";
    InsertUpdateDialogData.formData.fileName = "";
    InsertUpdateDialogData.formData.fileUrl = "";
    InsertUpdateDialogData.formData.fileCategoryId = "";
    upload && upload.value && upload.value!.clearFiles();
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
  InsertUpdateDialogData.formData.fileName = state.tableData[index].fileName;
  InsertUpdateDialogData.formData.fileUrl = state.tableData[index].fileUrl;
  InsertUpdateDialogData.formData.fileCategoryId =
    state.tableData[index].fileCategoryId;

  InsertUpdateDialogData.visible = true;
};
const handleDialogOk = async () => {
  InsertUpdateDialogData.loading = true;

  console.log(InsertUpdateDialogData.formData);
  switch (InsertUpdateDialogData.mode) {
    case DIALOG_MODE.CREATE:
      try {
        await reqInsertTemp({
          fileName: InsertUpdateDialogData.formData.fileName,
          fileUrl: InsertUpdateDialogData.formData.fileUrl,
          fileCategoryId: InsertUpdateDialogData.formData.fileCategoryId,
        });
        ElMessage.success("新增成功");
      } catch (error) {}
      break;
    case DIALOG_MODE.UPDATE:
      try {
        await reqUpdateTemp({
          id: InsertUpdateDialogData.formData.id,
          fileName: InsertUpdateDialogData.formData.fileName,
          fileUrl: InsertUpdateDialogData.formData.fileUrl,
          fileCategoryId: InsertUpdateDialogData.formData.fileCategoryId,
        });
        ElMessage.success("新增成功");
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
  const { id, fileUrl } = state.tableData[index];
  ElMessageBox.confirm("确认删除吗,删除后不可恢复?", "删除警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      await reqDeleteTemp({
        id,
        fileUrl,
      });
      ElMessage.success("删除成功");
      handleFilterQuery();
    } catch (error) {
      ElMessage.success("删除失败");
    }
  });
};

const handleCategoryAllQuery = async () => {
  try {
    const res = await reqGetCategoryAll();
    state.categoryList = res.data;
    if (state.categoryList.length <= 0) {
      ElMessage.error("一个分类都没有");
    } else {
      filterFormData.categoryId = state.categoryList[0].id;
      handleFilterQuery();
    }
  } catch (error) {}
};

handleCategoryAllQuery();

const handleDownloadClick = (i: number) => {
  window.open(state.tableData[i].fileUrl);
};
const handleUseTempClick = (i: number) => {
  router.push({ path: "/use-temp", query: { id: state.tableData[i].id } });
};
const handleSelectCategory = () => {
  handleFilterQuery();
};

const upload = ref<UploadInstance>();
const fileUploadActionUrl =
  import.meta.env.VITE_APP_BASE_API + "/template/upload";
const fileUploadHeader = {
  token: Cookie.get("token"),
};
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const handleFileUploadSuccess = (res: any) => {
  InsertUpdateDialogData.formData.fileUrl = res.data;
};
</script>

<style lang="scss" scoped>
.file-upload {
  width: 100%;
}
</style>
