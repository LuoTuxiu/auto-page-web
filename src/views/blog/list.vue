<template>
  <div
    v-loading="loading"
    class="blog-list"
  >
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
            @keydown.enter.native="handleGetLocalBlogList"
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
      <el-button
        id="page-list-btn-add"
        @click="handleClickAddNewBlog"
      >
        新建本地博客
      </el-button>
      <!-- <el-button @click="handleGetLocalBlogList">
        刷新
      </el-button> -->
    </div>
    <div
      class="page-content"
    >
      <el-tabs
        v-model="activeTabs"
        tab-position="left"
        style="height: 200px;"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          v-for="item in category"
          :key="item.category_id"
          :name="item.category_id"
          :label="item.category_name"
        />
      </el-tabs>
      <div
        class="rightTabContent"
      >
        <el-table
          :data="data"
          size="mini"
        >
          <!-- <el-table-column prop="pageId" label="pageId" /> -->
          <el-table-column
            prop="title"
            label="标题"
            width="240"
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
          <!-- <el-table-column
            prop="createTime"
            label="创建时间"
          >
            <template slot-scope="scope">
              <span> {{ scope.row.createTime | formatDate }} </span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="juejin_id"
            label="掘金id"
          />
          <el-table-column
            prop="jianshu_id"
            label="简书id"
          />
          <el-table-column
            prop="own_blog_id"
            label="自建站博客id"
          />
          <el-table-column
            prop="operator"
            label="操作"
            width="260"
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
              <el-popconfirm
                title="确定删除掘金吗？"
                @confirm="handleClickDeleteJuejin(scope.row)"
              >
                <el-button
                  v-if="scope.row.juejin_id"
                  slot="reference"
                  type="text"
                  size="small"
                >
                  删除掘金
                </el-button>
              </el-popconfirm>
              <el-button
                v-if="!scope.row.own_blog_id"
                type="text"
                size="small"
                @click="handleClickPublishOwnBlog(scope.row)"
              >
                发布到自己博客
              </el-button>
              <el-button
                v-if="scope.row.own_blog_id"
                type="text"
                size="small"
                @click="handleClickDeleteLocalBlog(scope.row)"
              >
                删除自建站博客
              </el-button>
              <el-button
                v-if="scope.row.jianshu_id"
                type="text"
                size="small"
                @click="handleClickUpdateJianshu(scope.row)"
              >
                更新简书
              </el-button>
              <el-button
                v-else
                type="text"
                size="small"
                @click="handleClickPublishJianshu(scope.row)"
              >
                发布简书
              </el-button>
              <el-popconfirm
                title="确定删除简书吗？"
                @confirm="handleClickDeleteJianshu(scope.row)"
              >
                <el-button
                  v-if="scope.row.jianshu_id"
                  type="text"
                  size="small"
                >
                  删除简书
                </el-button>
              </el-popconfirm>
              <el-popconfirm
                title="确定删除该文章吗？"
                @confirm="handleClickDeletepage(scope.row)"
              >
                <el-button
                  type="text"
                  size="small"
                >
                  删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination
      layout="total, sizes, prev, pager, next"
      :total="total"
      :page-size="limit"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { PageModule } from '@/store/modules/page'
@Component({
  name: 'Blog'
})
export default class extends Vue {
  data = []
  category = []
  activeTabs = 0
  total = 0
  loading = false
  filterForm = {}
  limit = 100

  mounted() {
  	this.handleGetAllCategory()
  	this.handleGetLocalBlogList()
  }

  async handleTabClick(tab) {
  	this.handleGetLocalBlogList({ category_id: this.activeTabs })
  }

  async handleGetLocalBlogList(propParams = {}) {
  	this.loading = true
  	const params = {
  		page: 1,
  		limit: this.limit,
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
  	this.limit = size
  	this.handleGetLocalBlogList({
  		limit: size
  	})
  }

  async handleClickPublishJuejin(row) {
  	const [err] = await PageModule.publishJuejinBlogApi({
  		pageId: row.pageId,
  		content: row.content
  	})
  	if (!err) {
  		this.$message({
  			type: 'success',
  			message: '发布掘金成功'
  		})
  		this.handleGetLocalBlogList()
  	} else {
  		this.$message({
  			type: 'warning',
  			message: err.message
  		})
  	}
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

  async handleClickDeleteLocalBlog(row) {
          	this.loading = true
  	const [err] = await PageModule.deleteOwnBlogApi({
  		pageId: row.pageId
  	})
          	this.loading = false
  	if (!err) {
  		this.handleGetLocalBlogList()
  		this.$message({
  			type: 'success',
  			message: '删除自建站博客成功'
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
  	async handleGetAllCategory(propParams = {}) {
  	const [err, result] = await PageModule.getCategorysAll()
  	this.category = [].concat(result.list)
  }

  async handleClickUpdateJianshu(row) {
  	const [err, result] = await PageModule.updateJianshuBlogApi({
  		pageId: row.pageId,
  		content: row.content,
  		jianshu_id: row.jianshu_id,
  		title: row.title
  	})
  	if (!err) {
  	  	this.handleGetLocalBlogList()
  		this.$message({
  			type: 'success',
  			message: '更新简书博客成功'
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
  		jianshu_id: row.jianshu_id
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
    const newRouteData = this.$router.resolve({ name: 'blogEdit',
  		params: {
  			id: row.pageId
  		} })
    window.open(newRouteData.href, '_blank')
  }

  async handleClickPublishOwnBlog(row) {
      	this.loading = true
  	const [err] = await PageModule.addOwnBlogApi({
  		pageId: row.pageId
  	})
      	this.loading = false
  		if (!err) {
  		this.handleGetLocalBlogList()
  		this.$message({
  			type: 'success',
  			message: '新建本地博客成功'
  		})
  	} else {
  		this.$message({
  			type: 'warning',
  			message: err.message
  		})
  	}
  }
}
</script>

<style lang="scss" scoped>
.rightTabContent{
      overflow-y: auto;
    flex: 1;
}
</style>
