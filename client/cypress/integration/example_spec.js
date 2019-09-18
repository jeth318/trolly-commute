Cypress.on('window:load', (window) => {
    window.fetch = null;
})

describe('Trolly Commute App', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
        method: 'GET',
        url: '*location*',
    }).as('apiLocation')

    cy.visit('http://localhost:3000/');
  });

    it('should render a header', () => {
        getMainHeader().should('be.visible');
        getMainHeader().contains('Trolly Commute');
    })

    it('should render a live clock', () => {
        getClock().should('be.visible');
    })

    describe('Search area', () => {
        it('should render two text inputs', () => {
            getOriginInput().should('be.visible');
            getDestinationInput().should('be.visible');
        });

        it('should render the "swap icon"', () => {
            getSwapIcon().should('be.visible');
        })

        it('should render a submit button', () => {
            getSubmitButton().should('be.visible');
        })

        describe('Text input', () => {
            it('should not display search results when two or less characters is typed in', () => {
                getOriginInput().type('Central');
                getOriginResultsContainer().should('be.visible');
                getOriginInput().clear().type('Ce');
                getOriginResultsContainer().should('not.be.visible');
            });

            it('should display search results when three or more characters is typed in', () => {
                getOriginResultsContainer().should('not.be.visible');                
                getOriginInput().type('Cen');
                getOriginResultsContainer().should('be.visible');
            });
        });

        describe('Swap button', () => {
            it('should swap the inputs', () => {
                getOriginInput().type('Central');
                cy.wait('@apiLocation').then((xhr) => {
                    getOriginResult().click();
                    getOriginResultsContainer().should('not.be.visible');

                    getDestinationInput().type('Brunns');
                    cy.wait('@apiLocation').then((xhr) => {
                        getDestinationResult().click();
                        getDestinationResultsContainer().should('not.be.visible')
                    }) 
                }) 
                getSwapIcon().click();
                getOriginInput().should('have.value', 'Brunnsparken, Göteborg')
                getDestinationInput().should('have.value', 'Centralstationen, Göteborg')
            })
        })

        describe.only('Error message', () => {
            it('should show error message when submitting without origin populated', () => {
                getDestinationInput().type('Brunns');
                cy.wait('@apiLocation').then((xhr) => {
                    getDestinationResult().click();
                    getSubmitButton().click();
                    getAlert().should('be.visible').should('have.text', 'Starthållplatsen är inte korrekt angiven')
                });
            });

            it('should show error message when submitting without destination populated', () => {
                getOriginInput().type('Central');
                cy.wait('@apiLocation').then((xhr) => {
                    getOriginResult().click();
                    getSubmitButton().click();
                    getAlert().should('be.visible').should('have.text', 'Sluthållplatsen är inte korrekt angiven')
                });
            });

            it.only('should show two error message when submitting with destination and origin depopulated', () => {
                getSubmitButton().click();
                getAlert().first().should('have.text', 'Starthållplatsen är inte korrekt angiven')
                getAlert().last().should('have.text', 'Sluthållplatsen är inte korrekt angiven')
            });

            it.only('should show two error message when submitting with destination and origin depopulated', () => {
                getSubmitButton().click();
                getAlert().first().should('have.text', 'Starthållplatsen är inte korrekt angiven')
                getAlert().last().should('have.text', 'Sluthållplatsen är inte korrekt angiven')
            });
        })
    })
})

const getMainHeader = () => cy.get('.heading');
const getOriginInput = () => cy.get('input').first();
const getDestinationInput = () => cy.get('input').last();
const getClock = () => cy.get('#updatetime');
const getSwapIcon = () => cy.get('#swapImg');
const getSubmitButton = () => cy.get('button');
const getOriginResultsContainer = () => cy.get('.results').first();
const getDestinationResultsContainer = () => cy.get('.results').last();
const getOriginResult = () => cy.get('div[name="Centralstationen, Göteborg"]');
const getDestinationResult = () => cy.get('div[name="Brunnsparken, Göteborg"]');
const getAlert = () => cy.get('.alert-danger');