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
							blogId
							url
							title
							content
							endTime
							updateTime
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
					pageDetail(blogId: "${params.blogId}") {
						url
						blogId
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
  public async updateToLocalApi(params: any) {
  	const { data } = await applloClient.mutate({
  		mutation: gql`
				mutation {
					updateToLocal(blogId: "${params.blogId}", content: "${encodeURIComponent(params.content)}") {
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
  			blogId: params.blogId
  		},
  		mutation: gql`
				mutation {
					publishJuejinBlog(blogId: "${params.blogId}") {
						data
					}
				}
			`
  		// mutation: gql`mutation($blogId: String!, $content: String!) {
  		// 		publishJuejinBlog(blogId: $blogId, content: $content) {
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
  		// 	blogId: params.blogId
  		// },
  		mutation: gql`
				mutation {
					updateJuejinBlog(blogId: "${params.blogId}", juejin_id: "${params.juejin_id}") {
						data
					}
				}
			`
  		// mutation: gql`mutation($blogId: String!, $content: String!) {
  		// 		publishJuejinBlog(blogId: $blogId, content: $content) {
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
            deleteJuejinBlog(blogId: "${params.blogId}", juejin_id: "${params.juejin_id}") {
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
