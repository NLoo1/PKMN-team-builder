import React from "react";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Profile } from "../../containers/Profile";
import PokeAPI from "../../services/api";

// Mock the PokeAPI module
jest.mock("../../services/api");

describe("Profile Component", () => {
  const mockCurrentUser = { username: "testuser", isAdmin: true };
  const mockToken = "dummy-token";

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });

  test("displays loading message before data is fetched", async () => {
    // Mock implementations to simulate waiting
    PokeAPI.getUser.mockImplementation(() => new Promise(() => {}));
    PokeAPI.getProfileTeams.mockImplementation(() => new Promise(() => {}));

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/profile"]}>
          <Profile currentUser={mockCurrentUser} token={mockToken} />
        </MemoryRouter>
      );
    });

    // Verify that the loading message is displayed
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("renders profile data", async () => {
    // Mock successful data retrieval
    PokeAPI.getUser.mockResolvedValue({
      user: {
        username: "testuser",
        email: "testuser@example.com",
        isAdmin: true,
        bio: "Test Bio",
      },
    });

    PokeAPI.getProfileTeams.mockResolvedValue([]);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/profile"]}>
          <Profile currentUser={mockCurrentUser} token={mockToken} />
        </MemoryRouter>
      );
    });

    // Verify that the user data is displayed
    expect(await screen.findByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("Test Bio")).toBeInTheDocument();
    expect(screen.getByText("This user has no teams.")).toBeInTheDocument();
  });

  test("handles error when fetching user data", async () => {
    // Mock a rejected promise for the getUser method
    PokeAPI.getUser.mockRejectedValue(new Error("Failed to fetch user data"));

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/profile"]}>
          <Profile currentUser={mockCurrentUser} token={mockToken} />
        </MemoryRouter>
      );
    });

    // Verify that the error message is displayed
    expect(screen.getByText("Failed to fetch user data")).toBeInTheDocument();
  });
});
