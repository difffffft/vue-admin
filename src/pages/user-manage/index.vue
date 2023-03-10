<template>
  <div class="user-manage table-crud">
    <!-- 筛选条件 -->
    <div class="table-filter">
      <div class="table-filter-form">
        <el-form :inline="true" :model="filterFormData">
          <el-form-item label="手机号">
            <el-input
              v-model="filterFormData.phoneNum"
              clearable
              placeholder="请输入手机号码"
            />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input
              v-model="filterFormData.nickname"
              clearable
              placeholder="请输入昵称"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="table-filter-options">
        <el-button icon="Refresh" @click="filterFormData.reset">重置</el-button>
        <el-button type="primary" icon="Search" @click="handleFilterQuery"
          >查询</el-button
        >
      </div>
    </div>

    <!-- 结果展示区域 -->
    <div class="table-result">
      <!-- 用户操作区域 -->
      <div class="table-options">
        <el-button type="primary" icon="Plus" @click="handleCreateClick"
          >新增账号</el-button
        >
      </div>

      <el-table
        border
        :data="state.tableData"
        style="width: 100%"
        v-loading="state.loading"
      >
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="phoneNum" label="手机号" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="insertTime" label="创建时间" />
        <el-table-column prop="roleList" label="角色">
          <template #default="scoped">
            <span>{{
              scoped.row.roleList
                .map((item: QueryRoleResultType) => item.roleName)
                .join("/")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="备注" />
        <el-table-column
          fixed="right"
          label="操作"
          class="table-item-options"
          width="210px"
        >
          <template #default="scoped">
            <!-- <el-button type="success" icon="Search" circle /> -->
            <el-button @click="handleUpdatePasswordClick(scoped.$index)"
              >修改密码</el-button
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
      <el-form-item label="电话" label-width="140px">
        <el-input
          v-model="InsertUpdateDialogData.formData.phoneNum"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="密码"
        label-width="140px"
        v-if="InsertUpdateDialogData.mode === DIALOG_MODE.CREATE"
      >
        <el-input
          v-model="InsertUpdateDialogData.formData.password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="昵称" label-width="140px">
        <el-input
          v-model="InsertUpdateDialogData.formData.nickname"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="备注" label-width="140px">
        <el-input
          v-model="InsertUpdateDialogData.formData.comment"
          autocomplete="off"
        />
      </el-form-item>

      <el-form-item label="角色" label-width="140px">
        <el-select
          style="width: 100%"
          v-model="InsertUpdateDialogData.formData.roleList"
          multiple
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
          placeholder="请选择用户角色"
        >
          <el-option
            v-for="item in state.roleList"
            value-key="id"
            :key="item.id"
            :value="item.id"
            :label="item.roleName"
            :disabled="item.id === '1'"
          />
        </el-select>

        <!-- <el-select
          v-model="InsertUpdateDialogData.formData.roles"
          placeholder="请选择角色"
        >
          <el-option label="超级管理员" value="0" />
          <el-option label="管理员" value="1" />
        </el-select> -->
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

<script lang="ts" setup name="UserManage">
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive } from "vue";
import {
  reqDeleteUser,
  reqGetRoleAll,
  reqGetUserList,
  reqInsertUser,
  reqUpdateUser,
  reqUpdateUserPassword,
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
  tableData: <QueryUserFormType[]>[],
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
  roleList: <QueryRoleResultType[]>[],
});

/**
 * 筛选表单的数据
 */
const filterFormData = reactive({
  phoneNum: "",
  nickname: "",
  reset() {
    filterFormData.phoneNum = "";
    filterFormData.nickname = "";
  },
});

/**
 * 按条件分页查询
 */
const handleFilterQuery = async () => {
  state.loading = true;
  try {
    const res = await reqGetUserList({
      currentPage: state.currentPage,
      pageSize: state.pageSize,
      nickName: filterFormData.nickname,
      phoneNum: filterFormData.phoneNum,
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
  formData: <InsertUpdateUserFormType>{
    id: "",
    phoneNum: "",
    nickname: "",
    password: "",
    //组件只能用string
    roleList: <string[]>[],
    comment: "",
  },
  //重置数据
  reset() {
    InsertUpdateDialogData.formData.id = "";
    InsertUpdateDialogData.formData.phoneNum = "";
    InsertUpdateDialogData.formData.password = "";
    InsertUpdateDialogData.formData.nickname = "";
    InsertUpdateDialogData.formData.roleList = [];
    InsertUpdateDialogData.formData.comment = "";
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
  InsertUpdateDialogData.formData.phoneNum = state.tableData[index].phoneNum;
  InsertUpdateDialogData.formData.nickname = state.tableData[index].nickname;
  InsertUpdateDialogData.formData.comment = state.tableData[index].comment;
  InsertUpdateDialogData.formData.roleList = state.tableData[
    index
  ].roleList.map((item) => String(item.id));
  InsertUpdateDialogData.visible = true;
};
const handleDialogOk = async () => {
  InsertUpdateDialogData.loading = true;
  let roleList = InsertUpdateDialogData.formData.roleList.map((id) => {
    return {
      id,
    };
  });

  switch (InsertUpdateDialogData.mode) {
    case DIALOG_MODE.CREATE:
      try {
        await reqInsertUser({
          phoneNum: InsertUpdateDialogData.formData.phoneNum,
          password: InsertUpdateDialogData.formData.password,
          nickname: InsertUpdateDialogData.formData.nickname,
          comment: InsertUpdateDialogData.formData.comment,
          roleList,
        });
        ElMessage.success("新增成功");
      } catch (error) {}
      break;
    case DIALOG_MODE.UPDATE:
      try {
        await reqUpdateUser({
          id: InsertUpdateDialogData.formData.id as string,
          phoneNum: InsertUpdateDialogData.formData.phoneNum,
          nickname: InsertUpdateDialogData.formData.nickname,
          comment: InsertUpdateDialogData.formData.comment,
          roleList,
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

const handleUpdatePasswordClick = (index: number) => {
  const { id } = state.tableData[index];
  ElMessageBox.prompt("请输入新的密码", "修改密码", {
    confirmButtonText: "修改",
    cancelButtonText: "取消",
    inputErrorMessage: "请输入新的密码",
  }).then(async ({ value: password }) => {
    try {
      await reqUpdateUserPassword({
        id,
        password,
      });
      ElMessage.success("修改成功");
    } catch (error) {}
  });
};

const handleDeleteClick = (index: number) => {
  const { id } = state.tableData[index];
  ElMessageBox.confirm("确认删除吗,删除后不可恢复?", "删除警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const res = await reqDeleteUser({
        id,
      });
      ElMessage.success("删除成功");
      handleFilterQuery();
    } catch (error) {
      ElMessage.success("删除失败");
    }
  });
};

const handleRolesQuery = async () => {
  try {
    const res = await reqGetRoleAll();
    state.roleList = res.data;
  } catch (error) {}
};
handleRolesQuery();
handleFilterQuery();
</script>

<style lang="scss" scoped></style>
