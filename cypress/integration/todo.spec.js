/// <reference types="cypress" />

describe("Test a TODO app", () => {

    const createATodo = (input, delay=10) => {

        //Type the note
        cy.get("[data-test=todo_input]")
            .type(input, { delay: delay, parseSpecialCharSequences: false})
            .should("have.value", input)

        //Submit the note
        cy.get(".App-inputs > button") //in reality would probably also add a 'data-test' tag
            .click();
        cy.get("[data-test=todo_list] > li").last()
            .should("contain.text", input);
    }
    
    beforeEach(() => {

        //Navigate to the webpage
        cy.visit("/");
    })

    it("10000: loades components", () => {

        //Verify that the application is running (it's considered bad practise to init a build/connection via a test)
        cy.log("Checks whether the application is running.")
        cy.log("Should beforeAll() fail, start the project with 'npm start' using the default port 3000.")
        cy.visit("/");
        cy.get("[data-test=todo_input]")
            .should("be.visible");
    })

    it("10001: adds a TODO note", () => {
        const note = "10001_";

        //Write a normal note
        createATodo(`${note}_NORMAL`)
        cy.get(" [data-test=todo_input]")
            .should("have.value", "");

        //Write a note with special characters
        createATodo(`${note}_\\}][{€$£@}]!"#¤%&/()=?`);

        //Write a note with no characters
        cy.get(" [data-test=todo_input]")
            .type(" ")
            .should("have.value", " ");
        cy.get(".App-inputs > button")
            .click();
        cy.get("[data-test=todo_list] > li")
            .should("have.length", 2)
            .should("not.contain.text", " ");
    })

    it("10002: completes a TODO note", () => {
        const note = "10002_";
        const numberOfNotes = 10

        const getRandInt = max => {
            return Math.floor(Math.random() * (max + 1));
        }

        //Populate the list with notes
        for (let i = 0; i < numberOfNotes; i++) {
            createATodo(`${note}${i}`, 0);
        }

        for (let i = numberOfNotes-1; i >= 0; i--) {

            //Complete a note
            cy.get("[data-test=todo_list] > li").as("todoList").eq(getRandInt(i))
                .find(".App-tick")
                    .click();
            if (i == 0) 
                break;
            cy.get("@todoList")
                .should("have.length", i)
                .last().then($li => {
                    expect($li.index()+1).to.eq(i)
                });
        }
    })

    it.skip("small bonus test :)", () => {

        //Checks if input has a max length constraint
        const largeInput = "Bee Movie Script: According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let's shake it up a little. Barry! Breakfast is ready! Ooming! Hang on a second. Hello? - Barry? - Adam? - Oan you believe this is happening? - I can't. I'll pick you up. Looking sharp. Use the stairs. Your father paid good money for those. Sorry. I'm excited. Here's the graduate. We're very proud of you, son. A perfect report card, all B's. Very proud. Ma! I got a thing going here. - You got lint on your fuzz. - Ow! That's me! - Wave to us! We'll be in row 118,000. - Bye! Barry, I told you, stop flying in the house! - Hey, Adam. - Hey, Barry.";
        cy.get(" [data-test=todo_input]")
            .type(largeInput, { delay: 0 })
            .should("not.have.value", largeInput);
    })
})