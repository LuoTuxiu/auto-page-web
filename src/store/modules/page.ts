import {
	VuexModule, Module, Action, Mutation, getModule
} from 'vuex-module-decorators'
import gql from 'graphql-tag'
import applloClient from '@/apollo'
import store from '@/store'

export interface IPageState {
	list: []
}

@Module({ dynamic: true, store, name: 'page' })
class Page extends VuexModule implements IPageState {
	public list: any = ''

	@Mutation

	@Action
	public async GetPageList(params = {
		page: 1,
		limit: 10
	}) {
		const { data } = await applloClient.query({
			query: gql`
				query {
					pageList(page: ${params.page}, limit: ${params.limit}){
						total
						list {
							id
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
					pageDetail(id: "${params.id}") {
						url
						id
						content
						title
					}
				}
			`
		})
		return data.pageDetail
	}

	@Action
	public async UploadToOwnBlogApi(params = {
	}) {
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

	@Action
	public async publishJuejinBlogApi(params: any) {
		const { data } = await applloClient.mutate({
			mutation: gql`
				mutation {
					publishJuejinBlog(id: "${params.id}") {
						data
					}
				}
			`
		})
		return data.pageList
	}

	@Action
	public async deleteJuejinBlogApi(params: any) {
		const { data } = await applloClient.mutate({
			mutation: gql`
				mutation {
					deleteJuejinBlog(id: "${params.id}", juejin_id: "${params.juejin_id}") {
						data
					}
				}
			`
		})
		return data
	}
}

export const PageModule = getModule(Page)
