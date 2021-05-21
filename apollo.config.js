module.export = {
  client: {
    service: {
      name: 'page-wms',
      url: 'http://localhost:3001/graphql'
    },
    includes: ['src/**/*.vue', 'src/**/*.ts']
  }
}
