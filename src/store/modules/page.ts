import {
	VuexModule,
	Module,
	Action,
	Mutation,
	getModule
} from 'vuex-module-decorators'
import { gql } from '@apollo/client/core'
import applloClient from '@/apollo'
import store from '@/store'
import { rebuildResult } from '@/middleware/graphqlFormat'

export interface IPageState {
  list: []
}

@Module({ dynamic: true, store, name: 'page' })
class Page extends VuexModule implements IPageState {
  public list: any = ''

	@Action({
  	rawError: true
	})
  public async getPageList(
  	params = {
  		page: 1,
  		limit: 10,
  		keyword: '',
  		category_id: '0'
  	}
  ) {
  	const result = await rebuildResult(applloClient.query, 'pageList', {
  		query: gql`
				query {
					pageList(page: ${params.page}, limit: ${params.limit}, keyword: "${params.keyword || ''}", category_id: "${params.category_id || '0'}"){
						total
						list {
							pageId
							url
							title
							content
							endTime
							updateTime
							category {
								category_id
								category_name
							}
							createTime
							description
							keyword
							originPath
							juejin_id
							jianshu_id
							juejin_updateTime
							jianshu_updateTime
							own_blog_id
							own_blog_updateTime
						}
					}
				}
			`
  	})
  	return result
  }

  @Action
	public async getPageDetail(params: any) {
  	const result = await rebuildResult(applloClient.query, 'pageDetail', {
  		query: gql`
				query {
					pageDetail(pageId: "${params.pageId}") {
						url
						pageId
						content
						title
						juejin_id
						own_blog_id
						category {
							category_name
							_id
						}
					}
				}
			`
  	})
  	console.log(result)
  	return result
	}

  @Action
  public async updateToOwnBlogApi(params: any) {
  	const result = await rebuildResult(applloClient.mutate, 'updateLocalBlog', {
  		mutation: gql`
        mutation {
          updateLocalBlog(pageId: "${params.pageId || ''}") {
            data
          }
        }
      `
  	})
  	return result
  }

	@Action
  public async addOwnBlogApi(params: any) {
  	const result = await rebuildResult(applloClient.mutate, 'addLocalBlog', {
  		mutation: gql`
        mutation {
          addLocalBlog(pageId: "${params.pageId || ''}") {
            data
          }
        }
      `
  	})
  	return result
  }

	@Action
	public async deleteOwnBlogApi(params: any) {
  	try {
  		const result = await rebuildResult(applloClient.mutate, 'deleteLocalBlog', {
  			mutation: gql`
          mutation {
            deleteLocalBlog(pageId: "${params.pageId}") {
              data
            }
          }
        `
  		})
  		return result
  	} catch (error) {
  		return [error]
  	}
	}

  @Action({
  	rawError: true
  })
	public async updatePageApi(params: any) {
  	const result = await rebuildResult(applloClient.mutate, 'updatePage', {
  		mutation: gql`
				mutation {
					updatePage(title: "${params.title}", pageId: "${params.pageId || ''}", category_id: "${params.category_id || ''}", content: "${encodeURIComponent(params.content)}") {
						data
					}
				}
			`
  	})
  	return result
	}

	@Action({
  	rawError: true
	})
  public async addPageApi(params: Page.AddPageType) {
  	const result = await rebuildResult(applloClient.mutate, 'addPage', {
  		mutation: gql`
				mutation {
					addPage(input: {title: "${params.title}", content: "${encodeURIComponent(params.content)}", category_id: "${params.category_id || ''}"}) {
						data
					}
				}
			`
  	})
  	return result
  }

	@Action({
  	rawError: true
	})
	public async deletePageApi(params: any) {
  	const result = await rebuildResult(applloClient.mutate, 'deletePage', {
  		mutation: gql`
				mutation {
					deletePage(pageId: "${params.pageId || ''}") {
						data
					}
				}
			`
  	})
  	return result
	}

  @Action({
  	rawError: true
  })
	public async publishJuejinBlogApi(params: any) {
  	const result = await rebuildResult(applloClient.mutate, 'publishJuejinBlog', {
  		variables: {
  			content: params.content,
  			pageId: params.pageId
  		},
  		mutation: gql`
				mutation {
					publishJuejinBlog(pageId: "${params.pageId}") {
						data
					}
				}
			`
  	})
  	return result
	}

	@Action({
  	rawError: true
	})
  public async updateJuejinBlogApi(params: any) {
  	console.log(params)
  	const result = await rebuildResult(applloClient.mutate, 'updateJuejinBlog', {
  		// variables: {
  		// 	content: params.content,
  		// 	pageId: params.pageId
  		// },
  		mutation: gql`
				mutation {
					updateJuejinBlog(pageId: "${params.pageId}", juejin_id: "${params.juejin_id}") {
						data
					}
				}
			`
  		// mutation: gql`mutation($pageId: String!, $content: String!) {
  		// 		publishJuejinBlog(pageId: $pageId, content: $content) {
  		// 			data
  		// 		}
  		// 	}
  		// `
  	})
  	return result
  }

  @Action
	public async deleteJuejinBlogApi(params: any) {
  	try {
  		const result = await rebuildResult(applloClient.mutate, 'deleteJuejinBlog', {
  			mutation: gql`
          mutation {
            deleteJuejinBlog(pageId: "${params.pageId}", juejin_id: "${params.juejin_id}") {
              data
            }
          }
        `
  		})
  		return result
  	} catch (error) {
  		return [error]
  	}
	}

	@Action({
  	rawError: true
	})
  public async addCategory(params: Page.AddCategoryType) {
  	const result = await rebuildResult(applloClient.mutate, 'addCategory', {
  		mutation: gql`
				mutation {
					addCategory(input: {category_name_en: "${params.category_name_en}", category_name: "${params.category_name}"}) {
						data
					}
				}
			`
  	})
  	return result
  }

	@Action
	public async getCategorysList(
  	params = {
  		page: 1,
  		limit: 10
  	}
	) {
  	const result = await rebuildResult(applloClient.query, 'categoryList', {
  		query: gql`
				query {
					categoryList(page: ${params.page}, limit: ${params.limit}){
						total
						list {
							updateTime
							createTime
							category_name
							category_name_en
							category_id
						}
					}
				}
			`
  	})
  	return result
	}

	@Action
	public async getCategorysAll(
  	params = {
  		page: 1,
  		limit: 10
  	}
	) {
  	const result = await rebuildResult(applloClient.query, 'categoryAll', {
  		query: gql`
				query {
					categoryAll{
						total
						list {
							updateTime
							createTime
							category_name
							category_id
						}
					}
				}
			`
  	})
  	return result
	}

	@Action({
  	rawError: true
	})
	public async updateCategoryApi(params: any) {
  	const result = await rebuildResult(applloClient.mutate, 'updateCategory', {
  		mutation: gql`
				mutation {
					updateCategory(category_name_en: "${params.category_name_en}", category_name: "${params.category_name}", category_id: "${params.category_id || ''}") {
						data
					}
				}
			`
  	})
  	return result
	}

	@Action({
  	rawError: true
	})
	public async deleteCategorysApi(params: any) {
  	const result = await rebuildResult(applloClient.mutate, 'deleteCategory', {
  		mutation: gql`
				mutation {
					deleteCategory(category_id: "${params.category_id || ''}") {
						data
					}
				}
			`
		})
		console.log(result)
  	return result
	}

	@Action({
  	rawError: true
	})
	public async publishJianshuBlogApi(params: any) {
  	const result = await rebuildResult(applloClient.mutate, 'publishJianshuBlog', {
  		variables: {
  			content: params.content,
				pageId: params.pageId
  		},
  		mutation: gql`
				mutation {
					publishJianshuBlog(pageId: "${params.pageId}") {
						data
					}
				}
			`
  	})
  	return result
	}

	@Action({
  	rawError: true
	})
	public async updateJianshuBlogApi(params: any) {
  	const result = await rebuildResult(applloClient.mutate, 'updateJianshuBlog', {
  		variables: {
  			content: params.content,
				pageId: params.pageId,
				jianshu_id: params.jianshu_id,
				title: params.title
  		},
  		mutation: gql`
				mutation {
					updateJianshuBlog(pageId: "${params.pageId}",jianshu_id: "${params.jianshu_id}", title: "${params.title}",  content: "${encodeURIComponent(params.content)}") {
						data
					}
				}
			`
  	})
  	return result
	}

	@Action
	public async deleteJianshuBlogApi(params: any) {
  	try {
  		const result = await rebuildResult(applloClient.mutate, 'deleteJianshuBlog', {
  			mutation: gql`
          mutation {
            deleteJianshuBlog(pageId: "${params.pageId}", jianshu_id: "${params.jianshu_id}") {
              data
            }
          }
        `
  		})
  		return result
  	} catch (error) {
  		return [error]
  	}
	}

	@Action
	public async getJianshuList(
  	params = {
  		page: 1,
  		limit: 10
  	}
	) {
  	const result = await rebuildResult(applloClient.query, 'jianshuList', {
  		query: gql`
				query {
					jianshuList{
						list {
							notebook_id
							paid
							title
							content_updated_at
							id
						}
					}
				}
			`
  	})
  	return result
	}
}

export const PageModule = getModule(Page)
