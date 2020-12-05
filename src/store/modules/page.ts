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

export interface IPageState {
  list: []
}

@Module({ dynamic: true, store, name: 'page' })
class Page extends VuexModule implements IPageState {
  public list: any = ''

  @Action
  public async GetPageList(
  	params = {
  		page: 1,
  		limit: 10
  	}
  ) {
  	const { data } = await applloClient.query({
  		query: gql`
				query {
					pageList(page: ${params.page}, limit: ${params.limit}){
						total
						list {
							pageId
							url
							title
							content
							endTime
							updateTime
							grouping
							createTime
							description
							keyword
							originPath
							juejin_id
						}
					}
				}
			`
  	})
  	return data.pageList
  }

  @Action
  public async GetPageDetail(params: any) {
  	const { data } = await applloClient.query({
  		query: gql`
				query {
					pageDetail(pageId: "${params.pageId}") {
						url
						pageId
						content
						title
						juejin_id
					}
				}
			`
  	})
  	return data.pageDetail
  }

  @Action
  public async UploadToOwnBlogApi(params = {}) {
  	const { data } = await applloClient.mutate({
  		mutation: gql`
        mutation {
          updateLocalBlog {
            data
          }
        }
      `
  	})
  	return data.pageList
  }

  @Action({
  	rawError: true
  })
  public async updatePageApi(params: any) {
  	const { data } = await applloClient.mutate({
  		mutation: gql`
				mutation {
					updatePage(title: "${params.title}", pageId: "${params.pageId || ''}", content: "${encodeURIComponent(params.content)}") {
						data
					}
				}
			`
  	})
  	console.log(data)
  	return data
  }

	@Action({
  	rawError: true
	})
  public async addPageApi(params: Page.AddPageType) {
  	console.log(params)
  	const { data } = await applloClient.mutate({
  		mutation: gql`
				mutation {
					addPage(input: {title: "${params.title}", content: "${encodeURIComponent(params.content)}", grouping: "${params.grouping || ''}"}) {
						data
					}
				}
			`
  	})
  	console.log(data)
  	return data
  }

	@Action({
  	rawError: true
	})
	public async deletePageApi(params: any) {
  	const { data } = await applloClient.mutate({
  		mutation: gql`
				mutation {
					deletePage(pageId: "${params.pageId || ''}") {
						data
					}
				}
			`
  	})
  	console.log(data)
  	return data
	}

  @Action({
  	rawError: true
  })
	public async publishJuejinBlogApi(params: any) {
  	const { data } = await applloClient.mutate({
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
  		// mutation: gql`mutation($pageId: String!, $content: String!) {
  		// 		publishJuejinBlog(pageId: $pageId, content: $content) {
  		// 			data
  		// 		}
  		// 	}
  		// `
  	})
  	return data.publishJuejinBlog.data
	}

	@Action({
  	rawError: true
	})
  public async updateJuejinBlogApi(params: any) {
  	console.log(params)
  	const { data } = await applloClient.mutate({
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
  	return data.publishJuejinBlog.data
  }

  @Action
	public async deleteJuejinBlogApi(params: any) {
  	try {
  		const { data } = await applloClient.mutate({
  			mutation: gql`
          mutation {
            deleteJuejinBlog(pageId: "${params.pageId}", juejin_id: "${params.juejin_id}") {
              data
            }
          }
        `
  		})
  		return [, data]
  	} catch (error) {
  		return [error]
  	}
	}
}

export const PageModule = getModule(Page)
