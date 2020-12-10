interface GraphqlResponseType {
	data: object,
	errors: any[] | undefined
}

const rebuildResult = async(next, path, ...args) => {
	try {
		const { errors, data }: GraphqlResponseType = await next(...args)
		if (errors) {
			const error = errors[0]
			return [{
				code: error.extensions.code,
				mgs: error.message,
				data: error.data
			}]
		} else {
			return [, data[path]]
		}
	} catch (error) {
		console.log(error)
	}
}

export {
	rebuildResult
}
