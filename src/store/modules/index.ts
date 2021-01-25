import Vue from 'vue'
import Vuex from 'vuex'
import { IAppState } from './app'
import { IUserState } from './user'
import { IPageState } from './page'

Vue.use(Vuex)

export interface IRootState {
  app: IAppState
  user: IUserState
  page: IPageState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
