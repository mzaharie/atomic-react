context("ADatePicker", () => {
  before(() => {
    cy.visitInLightTheme("http://localhost:3000/components/date-picker");
  });

  it("navigates properly", () => {
    cy.get("#usage + .playground .a-date-picker").contains("January");
    cy.get("#usage + .playground .a-date-picker__day").eq(5).contains("1");
    cy.get("#usage + .playground .a-date-picker__next").click();
    cy.get("#usage + .playground .a-date-picker").contains("February");
    cy.get("#usage + .playground .a-date-picker__prev").click();
    cy.get("#usage + .playground .a-date-picker").contains("January");
    cy.get("#usage + .playground .a-date-picker__day.selected").contains("14");
    cy.get("#usage + .playground .a-date-picker__day").eq(7).click();
    cy.get("#usage + .playground .a-date-picker__day").contains("3");
  });

  it("supports themes", () => {
    if (Cypress.env("snapshots") === "off") return;

    cy.get("#usage + .playground .playground__preview").compareSnapshot(
      "DatePicker 1"
    );

    cy.get("[data-testid='enable-dusk-theme']").eq(0).click();

    cy.get("#usage + .playground .playground__preview").compareSnapshot(
      "DatePicker 2"
    );
  });

  const rangeSelector = "#initial-range + .playground .a-date-picker";

  it("selects the two outer bounds of a date range", () => {
    cy.get(`${rangeSelector} .a-date-picker__day`).eq(7).click();
    cy.get(`${rangeSelector} .a-date-picker__day`).eq(10).click();
    cy.get(`${rangeSelector} .a-date-picker__day.selected`).contains("3");
    cy.get(`${rangeSelector} .a-date-picker__day.selected`).contains("6");
  });

  it("selects inner bounds between a date range", () => {
    cy.get(`${rangeSelector} .a-date-picker__day`).eq(25).click();
    cy.get(`${rangeSelector} .a-date-picker__day`).eq(28).click();
    cy.get(`${rangeSelector} .a-date-picker__day.between`).eq(0).contains("22");
    cy.get(`${rangeSelector} .a-date-picker__day.between`).eq(1).contains("23");
  });

  it("selects a range between two months", () => {
    // Pick a month in current calendar selection UI
    cy.get(`${rangeSelector} .a-date-picker__day`).eq(30).click();

    // Navigate to next calendar month, pick a date, and ensure
    // the range has now been set
    cy.get(`${rangeSelector} .a-date-picker__next`).click();
    cy.get(`${rangeSelector} .a-date-picker__day`).eq(10).click();
    cy.get(`${rangeSelector} .a-date-picker__day.between:not(.disabled)`).should("have.length", 10);

    // Navigate back to previous month and ensure range is still set
    cy.get(`${rangeSelector} .a-date-picker__prev`).click();
    cy.get(`${rangeSelector} .a-date-picker__day.between:not(.disabled)`).should("have.length", 4);
  });

  it("displays the upper range bound when an initial range is supplied", () => {
    // Revisit to reset state of calendar
    cy.visitInLightTheme("http://localhost:3000/components/date-picker");
    cy.get(rangeSelector).contains("April");
    cy.get(`${rangeSelector} .a-date-picker__day.selected`).contains("5");
  });
});