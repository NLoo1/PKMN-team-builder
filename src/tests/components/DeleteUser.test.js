import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DeleteUser from "../../components/DeleteUser";

// Mock the useNavigate hook from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("DeleteUser Component", () => {
  const mockDeleteUser = jest.fn();
  const token = "test-token";

  // Mock localStorage
  beforeAll(() => {
    global.localStorage = {
      getItem: jest.fn(() => 'true'),  // Mocking isAdmin as true
      setItem: jest.fn(),
    };
  });

  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (currentUser, username) => {
    return render(
      <MemoryRouter initialEntries={[`/delete/${username}`]}>
        <Routes>
          <Route
            path="/delete/:username"
            element={
              <DeleteUser deleteUser={mockDeleteUser} token={token} currentUser={currentUser} />
            }
          />
        </Routes>
      </MemoryRouter>
    );
  };

  test("renders confirm and back buttons", () => {
    renderComponent({ username: "testuser" }, "testuser");

    expect(screen.getByText(/confirm/i)).toBeInTheDocument();
    expect(screen.getByText(/back/i)).toBeInTheDocument();
  });

  test("calls deleteUser on form submit when confirmed", () => {
    window.confirm = jest.fn().mockReturnValue(true); // Mock confirmation dialog

    renderComponent({ username: "testuser" }, "testuser");

    const confirmButton = screen.getByText(/confirm/i);
    fireEvent.click(confirmButton);

    // Ensure deleteUser was called with the correct arguments
    expect(mockDeleteUser).toHaveBeenCalledWith("testuser", token);
  });

  test("does not call deleteUser when deletion is not confirmed", () => {
    window.confirm = jest.fn().mockReturnValue(false); // Mock confirmation rejection

    renderComponent({ username: "testuser" }, "testuser");

    const confirmButton = screen.getByText(/confirm/i);
    fireEvent.click(confirmButton);

    // Ensure deleteUser was not called
    expect(mockDeleteUser).not.toHaveBeenCalled();
  });

  test("navigates away if not authorized", () => {
    renderComponent({ username: "otheruser" }, "testuser");

    expect(window.alert).toHaveBeenCalledWith("You are not authorized to delete this user.");
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("displays error message if deletion fails", async () => {
    mockDeleteUser.mockRejectedValue(new Error("Deletion failed"));
  
    render(
      <MemoryRouter>
        <DeleteUser deleteUser={mockDeleteUser} token={token} currentUser={{ username: "testuser" }} />
      </MemoryRouter>
    );
  
    const confirmButton = screen.getByText(/confirm/i);
    fireEvent.click(confirmButton);
  
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("You are not authorized to delete this user.");
    });
  });
  
});
