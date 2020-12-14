import { ApolloClient, InMemoryCache } from '@apollo/client/core'

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
	uri: 'http://localhost:3001/graphql'
})

export default applloClient
