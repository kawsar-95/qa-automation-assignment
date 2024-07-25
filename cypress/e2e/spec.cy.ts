// Define constants for URLs an// Define constants for URLs and endpoints
const BASE_URL = 'http://localhost:3000';
const API_RESET = `${BASE_URL}/api/reset`;
const API_BOARDS = `${BASE_URL}/api/boards`;

describe('Should navigate to the website and perform actions', () => {
  beforeEach(() => {
    // Reset the application state before each test
    cy.request('POST', API_RESET);
    cy.visit(BASE_URL);
  });

  it('Create a new board and add two lists to it', () => {
    const boardName = 'new board';
    const list1 = 'list1';
    const list2 = 'list2';

    // Intercept the board creation POST request
    cy.intercept('POST', API_BOARDS).as('createBoard');

    // Create a board and validate its creation
    createBoard(boardName);
    cy.wait('@createBoard').then(({ response }) => {
      expect(response!.statusCode).to.eq(201);
      cy.location('pathname').should('eq', `/board/${response!.body.id}`);
    });
    cy.get('[data-cy="board-title"]').should('be.visible');

    // Create lists and validate their creation
    createList(list1, 1);
    createList(list2, 2);

    // Delete a list and validate
    deleteList(0, 1);
  });
  after(() => {
    cy.request('POST', API_RESET);
    cy.wait(1000);

  })

  // Function to create a board
  function createBoard(name: string) {
    cy.get('[data-cy="first-board"]').type(`${name}{enter}`);
  }

  // Function to create a list and validate its creation
  function createList(name: string, expectedLength: number) {
    cy.get('[data-cy="add-list-input"]').click().type(`${name}{enter}`);
    cy.get('[data-cy=list]').should('have.length', expectedLength);
  }

  // Function to delete a list and validate the remaining lists
  function deleteList(indexToDelete: number, expectedLengthAfterDelete: number) {
    cy.get('[data-cy="list-options"]').eq(indexToDelete).click();
    cy.get('[data-cy="delete-list"]').click();
    cy.get('[data-cy=list]').should('have.length', expectedLengthAfterDelete);
  }
});