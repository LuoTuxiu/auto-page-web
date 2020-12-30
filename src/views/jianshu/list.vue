<template>
  <div class="blog-list">
    <div>
      <!-- <el-button @click="handleClickAddNewBlog">
        新建Category
      </el-button> -->
      <el-button @click="handleGetJianshuList">
        刷新
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="data"
    >
      <!-- <el-table-column prop="pageId" label="pageId" /> -->
      <el-table-column
        prop="title"
        label="简书标题"
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
        prop="id"
        label="简书id"
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
          <span> {{ scope.row.content_updated_at * 1000 | formatDate }} </span>
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
@Component({
	name: 'Blog'
})
export default class extends Vue {
	data = []
  total = 0
  loading = false

  mounted() {
  	this.handleGetJianshuList()
  }

  async handleAddNewJianshu(row) {
  	const [err] = await PageModule.deleteCategorysApi({
  		category_id: row.category_id
  	})
  		if (!err) {
  		this.handleGetJianshuList()
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

  async handleGetJianshuList(propParams = {}) {
  	this.loading = true
  	const params = {
  		page: 1,
  		limit: 10,
  		...propParams
  	}
  	const [err, result] = await PageModule.getJianshuList(params)
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
  	this.handleGetJianshuList({
  		page: current
  	})
  }

  handleSizeChange(size) {
  	this.handleGetJianshuList({
  		limit: size
  	})
  }

  async handleClickDeletepage(row) {
  	const [err] = await PageModule.deleteJianshuBlogApi({
  		jianshu_id: row.id
  	})
  		if (!err) {
  		this.handleGetJianshuList()
  		this.$message({
  			type: 'success',
  			message: '删除简书博客成功'
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
  			that.handleGetJianshuList()
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
  			that.handleGetJianshuList()
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
