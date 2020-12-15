interface GraphqlResponseType {
	data: object,
	errors: any[] | undefined
}

const rebuildResult = async(next: Function, path: string, ...args: any[]) => {
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
			return [null, data[path]]
		}
	} catch (error) {
		return [null, error]
	}
}

export {
	rebuildResult
}
