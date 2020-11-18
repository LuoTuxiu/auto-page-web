// import request from '@/utils/request'

// export const getUserInfo = (data: any) =>
// 	request({
// 		url: '/api/user/userInfo',
// 		data
// 	})

// export const login = (data: any) =>
// 	request({
// 		url: '/public/user/login',
// 		method: 'post',
// 		data
// 	})

// export const logout = () =>
// 	request({
// 		url: '/api/user/logout',
// 		method: 'post'
// 	})
import { gql } from '@apollo/client/core'

export const LOGIN = gql`
				mutation Login($name: String!, passwd: String!){
					login(name: $name, passwd: $passwd) {
						token
					}
				}
			`
