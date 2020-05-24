import ApolloClient from 'apollo-boost'

const applloClient = new ApolloClient({
	uri: 'http://localhost:3001/graphql'
})

export default applloClient
