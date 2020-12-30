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
            @click="handleAddNewJianshu(scope.row)"
          >
            新建简书博客
          </el-button>
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
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { Table } from 'element-ui'
import { PageModule } from '@/store/modules/page'
import { log } from 'util'
@Component({
	name: 'Blog'
})
export default class extends Vue {
	data = []
  total = 0
  loading = false

  mounted() {
  	this.handleGetCategoryList()
  }

  async handleAddNewJianshu(row) {
  	const [err] = await PageModule.deleteCategorysApi({
  		category_id: row.category_id
  	})
  		if (!err) {
  		this.handleGetCategoryList()
  		this.$message({
  			type: 'success',
  			message: '删除本地博客成功'
  		})
  	} else {
  		this.$message({
  			type: 'warning',
  			message: err.message
  		})
  	}
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
  			message: '删除本地博客成功'
  		})
  	} else {
  		this.$message({
  			type: 'warning',
  			message: err.message
  		})
  	}
  }

  handleClickAddNewBlog() {
  	const that = this
  	this.$prompt('请输入分类', '提示', {
  		confirmButtonText: '确定',
  		cancelButtonText: '取消',
  		closeOnClickModal: false
  	}).then(async({ value }) => {
  		const [err] = await PageModule.addCategory({
  			category_name: value
  		})
  		if (!err) {
  			that.handleGetCategoryList()
  		}
  	})
  }

  handleClickEdit(row) {
  		const that = this
  	this.$prompt('请输入分类进行编辑', '提示', {
  		confirmButtonText: '确定',
  		cancelButtonText: '取消',
  		inputValue: row.category_name,
  		closeOnClickModal: false
  	}).then(async({ value }) => {
  		const [err] = await PageModule.updateCategoryApi({
  			category_name: value,
  			category_id: row.category_id
  		})
  		if (!err) {
  			that.handleGetCategoryList()
  		}
  	}).catch((e) => {
  		this.$message({
  			type: 'info',
  			message: '取消输入'
  		})
  	})
  }
}
</script>

<style lang="scss" scoped>
	.blog-list {
		padding: 10px;
	}
</style>
