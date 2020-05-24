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
	public async GetPageList() {
		const { data } = await applloClient.query({
			query: gql`
				query {
					pageList(page: 1, limit: 10){
						url
						_id
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
					pageDetail(_id: "${params._id}") {
						url
						_id
					}
				}
			`
		})
		return data.pageList
	}
}

export const PageModule = getModule(Page)
