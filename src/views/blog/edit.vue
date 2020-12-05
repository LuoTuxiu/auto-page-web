<template>
  <div class="blog-edit">
    <div class="blog-header--action">
      <el-button @click="handleSave">
        保存
      </el-button>
      <!-- <el-button @click="handleSaveLocal">
        保存到本地文件
      </el-button> -->
      <el-button @click="handleClickPublishOwnBlog">
        发布到自己博客
      </el-button>
      <el-button
        v-if="detail.juejin_id"
        @click="handleUpdateuejin"
      >
        编辑且发布掘金
      </el-button>
      <el-button
        v-else
        @click="handlePublishJuejin"
      >
        发布掘金
      </el-button>
    </div>
    <div class="blog-edit--content">
      <div class="markdown-input">
        <textarea
          v-model="markdownData"
          class="source markdown-input--textarea"
        />
      </div>
      <vue-markdown
        class="vue-markdown--content"
        :source="markdownData"
      />
    </div>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { Table } from 'element-ui'
import VueMarkdown from 'vue-markdown'
import { PageModule } from '@/store/modules/page'

@Component({
	name: 'Blog',
	components: {
		VueMarkdown
	}
})
export default class extends Vue {
	markdownData = ''
	detail = {}

	mounted() {
		this.handleGetLocalBlogDetail()
	}

	async handleGetLocalBlogDetail(propParams = {}) {
		console.log('====================================')
		console.log(`即将发请求`)
		console.log('====================================')
		const pageId = this.$route.params.id
		console.log('====================================')
		console.log(pageId)
		console.log('====================================')
		if (pageId) {
			const params = {
				pageId
			}
			const result = await PageModule.GetPageDetail(params)
			this.detail = Object.assign({}, result)
			this.markdownData = result.content
		}
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

	async handleSave() {
		console.log(`handleSaveLocal`)
		const pageId = this.$route.params.id
		this.$prompt('请输入文章标题', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			inputErrorMessage: '文章标题格式不正确',
			inputValue: this.detail.title,
			closeOnClickModal: false
		}).then(async({ value }) => {
			const params = {
				content: this.markdownData,
				grouping: '前端',
				title: value
			}
			if (pageId) {
				await PageModule.updatePageApi({ ...params,
					pageId
				})
			} else {
				await PageModule.addPageApi(params)
			}
		}).catch(() => {
			this.$message({
				type: 'info',
				message: '取消输入'
			})
		})
	}

	async handlePublishJuejin() {
		const result = await PageModule.publishJuejinBlogApi({
			pageId: this.$route.params.id,
			content: this.markdownData
		})
		this.handleGetLocalBlogList()
	}

	async handleUpdateuejin(row) {
		const result = await PageModule.updateJuejinBlogApi({
			pageId: this.$route.params.id,
			juejin_id: this.detail.juejin_id
		})
		this.handleGetLocalBlogList()
	}

	async handleClickDeleteJuejin(row) {
		const result = await PageModule.deleteJuejinBlogApi({
			pageId: row.pageId,
			juejin_id: row.juejin_id
		})
		console.log(result)
		this.handleGetLocalBlogList()
	}

	async handleClickPublishOwnBlog() {
		const result = await PageModule.UploadToOwnBlogApi()
	}
}
</script>

<style lang="scss" scoped>
	.blog-edit {
		padding: 20px;
	}
	.blog-edit--content {
		display: flex;
		padding: 20px 0;
		height: 100vh;
		& > div {
			flex: 1;
			width: 50%;
		}
		.markdown-input {
			margin-right: 20px;
		}
		.markdown-input--textarea {
			width: 100%;
			height: 100%;
		}
		.vue-markdown--content {
			border: 1px solid rgb(118, 118, 118);
			overflow-y: auto;
		}
	}
</style>
