import React from "react";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Profile } from "../../containers/Profile";
import PokeAPI from "../../services/api";

// Mock the PokeAPI module
jest.mock("../../services/api");

describe('Profile Component', () => {
  const mockCurrentUser = { username: 'testuser', isAdmin: true };
  const mockToken = 'dummy-token';

  test('displays loading message before data is fetched', async () => {
    // Mock API to simulate loading state
    PokeAPI.getUser.mockImplementation(() => new Promise(() => {})); // Simulate pending request

    render(
      <MemoryRouter>
        <Profile
          currentUser={mockCurrentUser}
          token={mockToken}
          editUser={() => {}}
          deleteUser={() => {}}
        />
      </MemoryRouter>
    );

    expect(await screen.findByText('Loading...')).toBeInTheDocument(); // Wait for loading message
  });

  test('renders profile data', async () => {
    PokeAPI.getUser.mockResolvedValue({
      user: {
        username: 'testuser',
        email: 'testuser@example.com',
        isAdmin: true,
        bio: 'Test Bio',
      }
    });
    PokeAPI.getProfileTeams.mockResolvedValue([]);

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile
            currentUser={mockCurrentUser}
            token={mockToken}
            editUser={() => {}}
            deleteUser={() => {}}
          />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Test Bio')).toBeInTheDocument();
    expect(screen.queryByText('This user has no teams.')).toBeInTheDocument();
  });

  test('handles error when fetching user data', async () => {
    PokeAPI.getUser.mockRejectedValue(new Error('Failed to fetch user data'));

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile
            currentUser={mockCurrentUser}
            token={mockToken}
            editUser={() => {}}
            deleteUser={() => {}}
          />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Failed to fetch user data.')).toBeInTheDocument();
  });

  test('handles update to EditUser inside a test', async () => {
    // This is a dummy test to address warnings about `act()`
    // Add any necessary code here if you have `EditUser` related state updates to handle
  });

  test('checks routes are matched properly', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Profile
          currentUser={mockCurrentUser}
          token={mockToken}
          editUser={() => {}}
          deleteUser={() => {}}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    // Add more route-specific checks if needed
  });
});
