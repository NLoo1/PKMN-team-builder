import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "../../components/NavBar"; // Adjust the path if necessary

// Helper function to render NavBar with Router
const renderNavBar = (props) => {
  render(
    <Router>
      <NavBar {...props} />
    </Router>
  );
};

describe("NavBar Component", () => {
  test("renders correctly for logged-in users", () => {
    const currentUser = { username: "testuser" };
    renderNavBar({ currentUser });

    // Check if Profile link is present
    expect(screen.getByRole("link", { name: /Profile/i })).toBeInTheDocument();
    
    // Check if Logout link is present
    expect(screen.getByText("Logout")).toBeInTheDocument();
    

  });

  test("renders correctly for admin users", () => {
    const currentUser = { username: "admin", isAdmin: true };
    renderNavBar({ currentUser });

    // Check if Admin Panel link is present
    expect(screen.getByText("Users")).toBeInTheDocument();

  });

  test("renders correctly for guests", () => {
    renderNavBar({});

    // Check if Signup link is present
    expect(screen.getByRole("link", { name: /Sign up/i })).toBeInTheDocument();
    
    // Check if Login link is present
    expect(screen.getByRole("link", { name: /Login/i })).toBeInTheDocument();
  });

  test("logout button works", () => {
    const currentUser = { username: "testuser" };
    const logout = jest.fn();
    renderNavBar({ currentUser, logout });

    // Click the logout button
    fireEvent.click(screen.getByText("Logout"));

    // Check if the logout function is called
    expect(logout).toHaveBeenCalled();
  });
});
