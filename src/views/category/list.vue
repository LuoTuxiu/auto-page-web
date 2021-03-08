<template>
  <div class="blog-list">
    <div>
      <el-button @click="handleClickAddNewBlog">
        新建Category
      </el-button>
      <el-button @click="handleGetCategoryList">
        刷新
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="data"
    >
      <!-- <el-table-column prop="pageId" label="pageId" /> -->
      <el-table-column
        prop="category_name"
        label="分类名称"
      />
      <el-table-column
        prop="category_name_en"
        label="分类英文名称"
      />
      <!-- <el-table-column
        prop="keyword"
        label="关键字"
      /> -->
      <!-- <el-table-column
        prop="content"
        label="内容"
        width="200"
      /> -->
      <el-table-column
        prop="category_id"
        label="分类ID"
      />
      <!-- <el-table-column
        prop="originPath"
        label="原始路径"
      /> -->
      <el-table-column
        prop="updateTime"
        label="更新时间"
      >
        <template slot-scope="scope">
          <span> {{ scope.row.updateTime | formatDate }} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
      >
        <template slot-scope="scope">
          <span> {{ scope.row.createTime | formatDate }} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operator"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleClickEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="handleClickDeletepage(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      title="编辑分类信息"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form">
        <el-form-item
          label="分类名称"
        >
          <el-input
            v-model="form.category_name"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="分类英文名称"
        >
          <el-input
            v-model="form.category_name_en"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="handleComfirmSave"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { PageModule } from '@/store/modules/page'
@Component({
	name: 'Category'
})
export default class extends Vue {
	data = []
	total = 0
	loading = false
  form = {}
  dialogFormVisible = false
  currentRow = {}

  mounted() {
  	this.handleGetCategoryList()
  }

  async handleGetCategoryList(propParams = {}) {
  	this.loading = true
  	const params = {
  		page: 1,
  		limit: 10,
  		...propParams
  	}
  	const [err, result] = await PageModule.getCategorysList(params)
  	if (!err) {
  		this.data = [].concat(result.list)
  		this.total = result.total
  	} else {
  		this.data = []
  		this.total = 0
  	}
  	this.loading = false
  }

  handleCurrentChange(current) {
  	this.handleGetCategoryList({
  		page: current
  	})
  }

  handleSizeChange(size) {
  	this.handleGetCategoryList({
  		limit: size
  	})
  }

  async handleClickDeletepage(row) {
  	const [err] = await PageModule.deleteCategorysApi({
  		category_id: row.category_id
  	})
  	if (!err) {
  		this.handleGetCategoryList()
  		this.$message({
  			type: 'success',
  			message: '删除分类成功'
  		})
  	} else {
  		this.$message({
  			type: 'warning',
  			message: err.message
  		})
  	}
  }

  async handleComfirmSave() {
  	this.dialogFormVisible = false
  	if (this.form.category_id) {
  		await this.handleEditCategoryRequest()
  		this.handleGetCategoryList()
  	} else {
  		await this.handleAddCategoryRequest()
  		this.handleGetCategoryList()
  	}
  }

  handleClickAddNewBlog() {
  	this.dialogFormVisible = true
  	this.currentRow = Object.assign({})
  	this.form = Object.assign({})
  	// const that = this
  	// this.$prompt('请输入分类', '提示', {
  	// 	confirmButtonText: '确定',
  	// 	cancelButtonText: '取消',
  	// 	closeOnClickModal: false
  	// }).then(async({ value }) => {
  	// 	const [err] = await PageModule.addCategory({
  	// 		category_name: value
  	// 	})
  	// 	if (!err) {
  	// 		that.handleGetCategoryList()
  	// 	}
  	// })
  }

  async handleAddCategoryRequest() {
  	const { category_name, category_name_en } = this.form
  	const [err] = await PageModule.addCategory({
  		category_name, category_name_en
  	})
  }

  handleClickEdit(row) {
  	this.dialogFormVisible = true
  	this.currentRow = Object.assign(row)
  	this.form = Object.assign({
  		category_name: row.category_name,
  		category_name_en: row.category_name_en,
  		category_id: row.category_id
  	})
  	// const that = this
  	// this.$prompt('请输入分类进行编辑', '提示', {
  	// 	confirmButtonText: '确定',
  	// 	cancelButtonText: '取消',
  	// 	inputValue: row.category_name,
  	// 	closeOnClickModal: false
  	// })
  	// 	.then(async({ value }) => {
  	// 		const [err] = await PageModule.updateCategoryApi({
  	// 			category_name: value,
  	// 			category_id: row.category_id
  	// 		})
  	// 		if (!err) {
  	// 			that.handleGetCategoryList()
  	// 		}
  	// 	})
  	// 	.catch((e) => {
  	// 		this.$message({
  	// 			type: 'info',
  	// 			message: '取消输入'
  	// 		})
  	// 	})
  }

  async handleEditCategoryRequest() {
  	const { category_name, category_name_en, category_id } = this.form
  	const [err] = await PageModule.updateCategoryApi({
  		category_name,
  		category_name_en,
  		category_id
  	})
  }
}
</script>

<style lang="scss" scoped>
	.blog-list {
		padding: 10px;
	}
</style>
