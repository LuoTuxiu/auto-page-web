context('Page', () => {
  beforeEach(() => {
    cy.setCookie('token', '1619251029449')
  })

  const now = new Date().getTime()
  const nowTestTitle = `${now}_title_cy_test`
  const nowTestTitleAfterEdit = `${now}_after_edit`
  it('test can not add empty title page', () => {
    cy.visit('http://localhost:8080/#/blog/list')
    cy.wait(1000)
    cy.get('#page-list-btn-add').click()
    cy.wait(1000)
    cy.get('#page-edit-btn-save').click()
    cy.get('.el-radio__label')
      .contains('前端')
      .click()
    cy.get('#page-edit-popover-btn-save').click()

    cy.get('.el-message__content')
      .contains('title required')
      .should('have.length', 1)
  })

  it('test add page right', () => {
    cy.visit('http://localhost:8080/#/blog/list')
    cy.wait(1000)
    cy.get('#page-list-btn-add').click()
    cy.wait(1000)

    cy.get('div.header-input--title.el-input').type(nowTestTitle)
    cy.get('#page-edit-btn-save').click()
    cy.get('.el-radio__label')
      .contains('前端')
      .click()
    cy.get('#page-edit-popover-btn-save').click()
    cy.get('.el-message__content')
      .contains('保存成功')
      .should('have.length', 1)

    cy.go('back')

    cy.get('.el-table__row td')
      .contains(nowTestTitle)
      .should('have.length', 1)
  })

  it('test edit page right', () => {
    cy.get('.el-table__row td')
      .contains(nowTestTitle)
      .parent()
      .parent()
      .children()
      .last()
      .children('div')
      .children('button')
      .first()
      .click()

    cy.get('div.header-input--title.el-input').type(nowTestTitleAfterEdit)
    cy.get('#page-edit-btn-save').click()
    cy.get('.el-radio__label')
      .contains('前端')
      .click()
    cy.get('#page-edit-popover-btn-save').click()
    cy.get('.el-message__content')
      .contains('保存成功')
      .should('have.length', 1)

    cy.go('back')

    cy.get('.el-table__row td')
      .contains(nowTestTitleAfterEdit)
      .should('have.length', 1)
  })

  it('test page delete right', () => {
    cy.get('.el-table__row td')
      .contains(nowTestTitleAfterEdit)
      .parent()
      .parent()
      .children()
      .last()
      .children('div')
      .children('button')
      .last()
      .click()

    cy.get('.el-table__row td')
      .contains(nowTestTitleAfterEdit)
      .should('have.length', 0)
  })
})
