import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginUser from "../../components/LoginForm";

// Mock the useNavigate hook from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LoginUser Component", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form with username and password fields", () => {
    render(
      <MemoryRouter>
        <LoginUser login={mockLogin} />
      </MemoryRouter>
    );

    // Debug output to help troubleshoot
    screen.debug();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test("shows error message if fields are empty and form is submitted", async () => {
    render(
      <MemoryRouter>
        <LoginUser login={mockLogin} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/please fill out both fields/i)).toBeInTheDocument();
  });

  test('calls login function with correct data and navigates on successful login', async () => {
  render(<LoginUser />);
  
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));

  // Add your assertions here
});

test('shows error message on login failure', async () => {
    render(<LoginUser />);
    screen.debug(); // This will print the rendered output
  
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
  
    // Add assertions here
  });
});
