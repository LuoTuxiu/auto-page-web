import request from '@/utils/request'

export const getPageListApi = (params: any) => {
	return request({
		url: '/api/page/list/query',
		params
	})
}
