describe('Go to website', () => {
  it('Should navigate to the website', () => {
    const boardName = 'new board'
    const list1 = 'list1'
    const list2 = 'list2'

    // clean up before test
    cy.request('POST', 'http://localhost:3000/api/reset');

    // go to boards
    cy.intercept({
      method: 'POST',
      url: 'http://localhost:3000/api/boards',
      times: 3
    }).as('createBoard');
    cy.visit('http://localhost:3000/');

    // create a board 
    cy.get('[data-cy="first-board"]').type(`${boardName}{enter}`)
    cy.wait('@createBoard').then(({ response }) => {
      cy.location('pathname')
        .should('eq', `/board/${response!.body.id}`);
    });
    // Validating a board is created 
    cy.get('[data-cy="board-title"]').should('be.visible')

    // create 2 lists
    cy.get('[data-cy="add-list-input"]').click().type(`${list1}{enter}`)
    cy.wait(200)
    cy.get('[data-cy=list]').should('have.length', 1);

    cy.get('[data-cy="add-list-input"]').click().type(`${list2}{enter}`)
    cy.get('[data-cy=list]').should('have.length', 2);
    cy.wait(200)

    // delete a list
    cy.get('[data-cy="list-options"]').eq(0).click();
    cy.get('[data-cy="delete-list"]').click();
    cy.get('[data-cy=list]').should('have.length', 1);
    cy.wait(200)
  });

});
