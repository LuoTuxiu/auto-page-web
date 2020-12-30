<template>
  <div class="blog-list">
    <div>
      <el-form
        :inline="true"
        :model="filterForm"
        class="demo-form-inline"
      >
        <el-form-item label="关键字">
          <el-input
            v-model="filterForm.keyword"
            placeholder="请输入关键字"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item label="活动区域">
          <el-select
            v-model="formInline.region"
            placeholder="活动区域"
          >
            <el-option
              label="区域一"
              value="shanghai"
            />
            <el-option
              label="区域二"
              value="beijing"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button
            type="primary"
            @click="handleGetLocalBlogList"
          >
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <el-button @click="handleClickPublishOwnBlog">
        发布到自己博客
      </el-button>
      <el-button @click="handleClickAddNewBlog">
        新建本地博客
      </el-button>
      <!-- <el-button @click="handleGetLocalBlogList">
        刷新
      </el-button> -->
    </div>
    <el-table
      v-loading="loading"
      :data="data"
    >
      <!-- <el-table-column prop="pageId" label="pageId" /> -->
      <el-table-column
        prop="title"
        label="标题"
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
        prop="category.category_name"
        label="分类"
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
        prop="juejin_id"
        label="掘金id"
      />
      <el-table-column
        prop="jianshu_id"
        label="简书id"
      />
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
            v-if="!scope.row.juejin_id"
            type="text"
            size="small"
            @click="handleClickPublishJuejin(scope.row)"
          >
            发布掘金
          </el-button>
          <el-button
            v-if="scope.row.juejin_id"
            type="text"
            size="small"
            @click="handleClickDeleteJuejin(scope.row)"
          >
            删除掘金
          </el-button>
          <el-button
            v-if="!scope.row.juejin_id"
            type="text"
            size="small"
            @click="handleClickPublishJianshu(scope.row)"
          >
            发布简书
          </el-button>
          <el-button
            v-if="scope.row.juejin_id"
            type="text"
            size="small"
            @click="handleClickDeleteJianshu(scope.row)"
          >
            删除简书
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
@Component({
	name: 'Blog'
})
export default class extends Vue {
	data = []
  total = 0
  loading = false
  filterForm = {}

  mounted() {
  	this.handleGetLocalBlogList()
  }

  async handleGetLocalBlogList(propParams = {}) {
  	this.loading = true
  	const params = {
  		page: 1,
  		limit: 100,
  		keyword: this.filterForm.keyword,
  		...propParams
  	}
  	const [err, result] = await PageModule.getPageList(params)
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
  	this.handleGetLocalBlogList({
  		page: current
  	})
  }

  handleSizeChange(size) {
  	this.handleGetLocalBlogList({
  		limit: size
  	})
  }

  async handleClickPublishJuejin(row) {
  	const result = await PageModule.publishJuejinBlogApi({
  		pageId: row.pageId,
  		content: row.content
  	})
  	this.handleGetLocalBlogList()
  }

  async handleClickDeleteJuejin(row) {
  	const [err] = await PageModule.deleteJuejinBlogApi({
  		pageId: row.pageId,
  		juejin_id: row.juejin_id
  	})
  	if (!err) {
  		this.handleGetLocalBlogList()
  		this.$message({
  			type: 'success',
  			message: '删除掘金博客成功'
  		})
  	} else {
  		this.$message({
  			type: 'warning',
  			message: err.message
  		})
  	}
  }

  async handleClickPublishJianshu(row) {
  	const [err, result] = await PageModule.publishJianshuBlogApi({
  		pageId: row.pageId,
  		content: row.content
  	})
  	if (!err) {
  	  	this.handleGetLocalBlogList()
  		this.$message({
  			type: 'success',
  			message: '发布简书博客成功'
  		})
  	} else {
  		this.$message({
  			type: 'warning',
  			message: err.message
  		})
  	}
  }

  async handleClickDeleteJianshu(row) {
  	const [err] = await PageModule.deleteJianshuBlogApi({
  		pageId: row.pageId,
  		juejin_id: row.juejin_id
  	})
  	if (!err) {
  		this.handleGetLocalBlogList()
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

  async handleClickDeletepage(row) {
  	const [err] = await PageModule.deletePageApi({
  		pageId: row.pageId
  	})
  		if (!err) {
  		this.handleGetLocalBlogList()
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
  	this.$router.push({
  		name: 'blogAdd',
  		params: {
  		}
  	})
  }

  handleClickEdit(row) {
  	this.$router.push({
  		name: 'blogEdit',
  		params: {
  			id: row.pageId
  		}
  	})
  }

  async handleClickPublishOwnBlog() {
  	const result = await PageModule.UploadToOwnBlogApi()
  	console.log(result)
  }
}
</script>

<style lang="scss" scoped>
	.blog-list {
		padding: 10px;
	}
</style>
