<template>
  <div class="blog-edit">
    <div class="blog-header--action">
      <div>
        <label
          for=""
          class="blog-title--label"
        >文章标题</label>
        <el-input
          v-model="detail.title"
          class="header-input--title"
        />
      </div>
      <div>
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
    </div>
    <div class="blog-edit--content">
      <div
        id="markdown-input"
        class="markdown-input"
      >
        <el-input
          id="markdown-input--textarea"
          v-model="markdownData"
          autosize
          type="textarea"
          class="source markdown-input--textarea"
        />
      </div>
      <vue-markdown
        id="vue-markdown--content"
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

	destroyed() {
		document.getElementById('markdown-input').removeEventListener('scroll', this.handleInputScroll)
	}
	mounted() {
		document.getElementById('markdown-input').addEventListener('scroll', this.handleInputScroll)
		this.handleGetLocalBlogDetail()
	}

	async handleGetLocalBlogDetail(propParams = {}) {
		const pageId = this.$route.params.id
		if (pageId) {
			const params = {
				pageId
			}
			const [err, result] = await PageModule.getPageDetail(params)
			this.detail = Object.assign({}, result)
			this.markdownData = decodeURIComponent(result.content)
		}
	}

	handleInputScroll(event) {
		const markdownContent = document.getElementById('vue-markdown--content')
		markdownContent.scrollTop = event.target.scrollTop * markdownContent.scrollHeight / event.target.scrollHeight
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
		// this.$prompt('请输入文章标题', '提示', {
		// 	confirmButtonText: '确定',
		// 	cancelButtonText: '取消',
		// 	inputErrorMessage: '文章标题格式不正确',
		// 	inputValue: this.detail.title,
		// 	closeOnClickModal: false
		// }).then(async({ value }) => {
		const params = {
			content: this.markdownData,
			grouping: '前端',
			title: this.detail.title
		}
		let err
		if (pageId) {
			[err] = await PageModule.updatePageApi({ ...params,
				pageId
			})
		} else {
			[err] = await PageModule.addPageApi(params)
		}
		if (!err) {
			this.$router.push({
				name: 'blogList',
				params: {
				}
			})
		} else {
			this.$message({
				type: 'warning',
				message: err.message
			})
		}
		// }).catch(() => {
		// 	this.$message({
		// 		type: 'info',
		// 		message: '取消输入'
		// 	})
		// })
	}

	async handlePublishJuejin() {
		const [err] = await PageModule.publishJuejinBlogApi({
			pageId: this.$route.params.id,
			content: this.markdownData
		})
		if (!err) {
			this.handleGetLocalBlogDetail()
			this.$message({
				type: 'success',
				message: '发布成功'
			})
		} else {
			this.$message({
				type: 'warning',
				message: err.message
			})
		}
	}

	async handleUpdateuejin(row) {
		const [err] = await PageModule.updateJuejinBlogApi({
			pageId: this.$route.params.id,
			juejin_id: this.detail.juejin_id
		})
		if (!err) {
			this.$message({
				type: 'success',
				message: '发布成功'
			})
		} else {
			this.$message({
				type: 'warning',
				message: err.message
			})
		}
	}

	async handleClickDeleteJuejin(row) {
		await PageModule.deleteJuejinBlogApi({
			pageId: row.pageId,
			juejin_id: row.juejin_id
		})
		this.handleGetLocalBlogList()
	}

	async handleClickPublishOwnBlog() {
		await PageModule.UploadToOwnBlogApi()
	}
}
</script>

<style lang="scss" scoped>
	.blog-edit {
		padding: 20px;
		.blog-header--action{
			display: flex;
			justify-content: space-between;
			.blog-title--label{
				margin-right: 10px;
			}
			.header-input--title{
				width: 500px;
			}
		}
	}
	.blog-edit--content {
		display: flex;
		padding: 20px 0;
		height: 90vh;
		& > div {
			flex: 1;
			width: 50%;
		}
		.markdown-input {
			margin-right: 20px;
			overflow-y: auto;
		}
		// .markdown-input--textarea {
		// 	width: 100%;
		// 	height: 100%;
		// }
		.vue-markdown--content {
			border: 1px solid rgb(118, 118, 118);
			overflow-y: auto;
			img{
				width: 100%;
			}
		}
	}
</style>
<style lang="scss">
.blog-header--action{
	.el-input{
		width: 200px;
	}
}
</style>
