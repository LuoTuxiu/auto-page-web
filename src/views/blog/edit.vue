<template>
	<div class="blog-edit">
		<div class="blog-header--action">
			<el-button @click="handleSaveLocal"> 保存到本地文件 </el-button>
			<el-button @click="handleClickPublishOwnBlog"> 发布到自己博客 </el-button>
			<el-button @click="handlePublishJuejin"> 发布掘金 </el-button>
		</div>
		<div class="blog-edit--content">
			<div class="markdown-input">
				<textarea
					v-model="markdownData"
					class="source markdown-input--textarea"
				/>
			</div>
			<vue-markdown class="vue-markdown--content" :source="markdownData" />
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
		VueMarkdown,
	},
})
export default class extends Vue {
	markdownData = ''

	mounted() {
		this.handleGetLocalBlogDetail()
	}

	async handleGetLocalBlogDetail(propParams = {}) {
		const params = {
			id: this.$route.params.id,
		}
		const result = await PageModule.GetPageDetail(params)
		this.markdownData = result.content
	}

	handleCurrentChange(current) {
		this.handleGetLocalBlogList({
			page: current,
		})
	}

	handleSizeChange(size) {
		this.handleGetLocalBlogList({
			limit: size,
		})
	}

	handleSaveLocal() {
		console.log(`handleSaveLocal`)
	}

	async handlePublishJuejin() {
		const result = await PageModule.publishJuejinBlogApi({
			id: this.$route.params.id,
		})
		this.handleGetLocalBlogList()
	}

	async handleClickDeleteJuejin(row) {
		const result = await PageModule.deleteJuejinBlogApi({
			id: row.id,
			juejin_id: row.juejin_id,
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
		& > div {
			flex: 1;
			height: 100vh;
		}
		.markdown-input {
			height: 100%;
			margin-right: 20px;
		}
		.markdown-input--textarea {
			width: 100%;
			height: 100vh;
		}
		.vue-markdown--content {
			border: 1px solid rgb(118, 118, 118);
		}
	}
</style>
