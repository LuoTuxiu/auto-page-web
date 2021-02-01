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
}

@Module({ dynamic: true, store, name: 'PageSetting' })
class PageSetting extends VuexModule implements IPageState {
	@Action({
  	rawError: true
	})
	public async getPageSetting(
	) {
  	const result = await rebuildResult(applloClient.query, 'getPageSetting', {
  		query: gql`
				query {
					getPageSetting{
						cookie_juejin
						cookie_jianshu
					}
				}
			`
  	})
  	return result
	}

	@Action({
  	rawError: true
	})
	public async updatePageSettingApi(params: any) {
  	const result = await rebuildResult(applloClient.mutate, 'updatePageSetting', {
  		mutation: gql`
				mutation {
					updatePageSetting(input: {cookie_juejin: "${params.cookie_juejin}", cookie_jianshu: "${params.cookie_jianshu || ''}"}) {
						data
					}
				}
			`
  	})
  	return result
	}
}

export const PageSettingModule = getModule(PageSetting)
