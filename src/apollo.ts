import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { DefaultOptions } from '@apollo/client/core/ApolloClient'

const defaultOptions: DefaultOptions = {
	watchQuery: {
		fetchPolicy: 'no-cache',
		errorPolicy: 'ignore'
	},
	query: {
		fetchPolicy: 'no-cache',
		errorPolicy: 'all'
	}
}
const applloClient = new ApolloClient({
	cache: new InMemoryCache(),
	defaultOptions: defaultOptions,
	uri: `${process.env.VUE_APP_BASE_API}graphql`
})

export default applloClient
