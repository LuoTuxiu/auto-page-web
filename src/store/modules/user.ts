import {
	VuexModule,
	Module,
	Action,
	Mutation,
	getModule
} from 'vuex-module-decorators'
// import { login, logout, getUserInfo } from '@/api/users'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import store from '@/store'
import gql from 'graphql-tag'
import applloClient from '@/apollo'

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []

  @Mutation
  private SET_TOKEN(token: string) {
  	console.log(`即将要设置的token ${token}`)
  	this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
  	this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
  	this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
  	this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
  	this.roles = roles
  }

  @Action
  public async Login(userInfo: any) {
  	// let { name, password } = userInfo
  	// name = name.trim()
  	try {
  		const { data } = await applloClient.mutate({
  			mutation: gql`
					mutation {
						login(name: "${userInfo.name}", passwd: "${userInfo.passwd}") {
							token
						}
					}
				`
  		})
  		// console.log(`接口返回的 ${data.token}`)
  		setToken(data.login.token)
  		this.SET_TOKEN(data.login.token)
  	} catch (error) {
  		throw new Error(error)
  	}
  }

	@Action
  public async Register(userInfo: any) {
  	try {
  		const data = await applloClient.mutate({
  			mutation: gql`
					mutation {
						register(name: "${userInfo.name}", passwd: "${userInfo.passwd}") {
							code
						}
					}
				`
  		})
  		console.log(data)
  	} catch (error) {
  		console.warn(error)
  	}
  }

  @Action
	public ResetToken() {
  	removeToken()
  	this.SET_TOKEN('')
  	this.SET_ROLES([])
	}

  @Action
  public async GetUserInfo() {
  	if (this.token === '') {
  		throw Error('GetUserInfo: token is undefined!')
  	}
  	// const { data } = await getUserInfo({
  	// 	/* Your params here */
  	// })
  	const { data } = await applloClient.query({
  		query: gql`
			query {
				userInfo {
					name
					roles
				}
			}
      `
  	})
  	if (!data) {
  		throw Error('Verification failed, please Login again.')
  	}
  	const { roles, name, avatar, introduction } = data.userInfo
  	// roles must be a non-empty array
  	if (!roles || roles.length <= 0) {
  		throw Error('GetUserInfo: roles must be a non-null array!')
  	}
  	this.SET_ROLES(roles)
  	this.SET_NAME(name)
  	this.SET_AVATAR(avatar)
  	this.SET_INTRODUCTION(introduction)
  }

  @Action
  public async LogOut() {
  	if (this.token === '') {
  		throw Error('LogOut: token is undefined!')
  	}
  	// await logout()
  	const { data } = await applloClient.mutate({
  		mutation: gql`
				mutation {
					logout{
						data
					}
				}
			`
  	})
  	console.log(data)
  	removeToken()
  	this.SET_TOKEN('')
  	this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
