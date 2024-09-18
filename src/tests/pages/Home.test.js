import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../../pages/Home"; 

describe("Home Component", () => {
  
  // Test to ensure the welcome message renders correctly
  test("renders welcome message", () => {
    render(<Home />);
    
    const welcomeMessage = screen.getByText(/Welcome to Pokemon Team Builder!/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  // Test to ensure the Card component is rendered
  test("renders a Card component", () => {
    render(<Home />);

    // Use querySelector or getByClassName to select the card
    const cardElement = document.querySelector(".card");
    expect(cardElement).toBeInTheDocument();
  });

  // Test to ensure the CardBody component is rendered
  test("renders a CardBody component", () => {
    render(<Home />);

    // Check if the CardBody element is rendered by its class
    const cardBodyElement = document.querySelector(".card-body");
    expect(cardBodyElement).toBeInTheDocument();
  });

  // Test to check if the section has the correct classes
  test("renders the section with correct classes", () => {
    render(<Home />);

    // Use querySelector to select the section
    const sectionElement = document.querySelector("section");
    expect(sectionElement).toHaveClass("col home");
  });

  // Snapshot test to check if the component renders the same structure over time
  test("matches snapshot", () => {
    const { asFragment } = render(<Home />);
    expect(asFragment()).toMatchSnapshot();
  });

  // Test to ensure the heading is accessible and correct
  test("renders an accessible heading", () => {
    render(<Home />);

    // Check if the h3 element with the welcome message is rendered
    const headingElement = screen.getByRole("heading", { level: 3, name: /welcome to pokemon team builder!/i });
    expect(headingElement).toBeInTheDocument();
  });

  // Test to check if the welcome message has bold font weight
  test("renders welcome message with bold font weight", () => {
    render(<Home />);

    // Check if the welcome message has the correct class for bold text
    const welcomeMessage = screen.getByText(/Welcome to Pokemon Team Builder!/i);
    expect(welcomeMessage).toHaveClass("font-weight-bold");
  });
});
