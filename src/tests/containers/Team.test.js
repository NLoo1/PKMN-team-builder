
import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Team } from "../../containers/Team";
import PokeAPI from "../../services/api";

jest.mock('../../services/api', () => ({
  getAllPokemonInTeam: jest.fn(),
  getTeamById: jest.fn(),
}));


describe("Team Component", () => {
  const mockToken = "dummy-token";
  const mockCurrentUser = {
    user_id: "1",
    isAdmin: "true",
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
  });

  test("displays loading message before data is fetched", async () => {
    PokeAPI.getAllPokemonInTeam.mockImplementation(() => new Promise(() => {})); 
    PokeAPI.getTeamById.mockImplementation(() => new Promise(() => {}));

    await render(
      <MemoryRouter initialEntries={["/teams/1"]}>
        <Team token={mockToken} currentUser={mockCurrentUser} />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument(); // Case-insensitive match
  });

  test("renders team data correctly", async () => {
    PokeAPI.getAllPokemonInTeam.mockResolvedValue([
      {
        position: 1,
        pokemon_id: 1,
        pokemon_name: "bulbasaur",
      },
      {
        position: 2,
        pokemon_id: 4,
        pokemon_name: "charmander",
      },
    ]);
    PokeAPI.getTeamById.mockResolvedValue({
      team_name: "Fire Squad",
      user_id: "1",
    });

    await render(
      <MemoryRouter initialEntries={["/teams/1"]}>
        <Team token={mockToken} currentUser={mockCurrentUser} />
      </MemoryRouter>
    );

    expect(await screen.findByText("Fire Squad")).toBeInTheDocument();
    expect(screen.getByText("Bulbasaur")).toBeInTheDocument(); // Ensure the Pokémon names are capitalized
    expect(screen.getByAltText("bulbasaur")).toHaveAttribute(
      "src",
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
    );
  });

  test("handles error when fetching team data", async () => {
    PokeAPI.getAllPokemonInTeam.mockRejectedValue(new Error("Failed to fetch Pokémon"));
    PokeAPI.getTeamById.mockRejectedValue(new Error("Failed to fetch team"));

    await render(
      <MemoryRouter initialEntries={["/teams/1"]}>
        <Team token={mockToken} currentUser={mockCurrentUser} />
      </MemoryRouter>
    );

    // Adjust the query to be more flexible if needed
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch pokémon/i)).toBeInTheDocument();
    });

    // Debug output to inspect rendered content
    screen.debug();
  });

  test('shows edit and delete buttons based on user permissions', async () => {
    const mockTeamData = [
      { position: 1, pokemon_id: 1, pokemon_name: 'bulbasaur' },
      { position: 2, pokemon_id: 4, pokemon_name: 'charmander' }
    ];

    const mockTeamName = { team_name: 'Fire Squad', user_id: '1' };

    // Mock the API responses
    require('../../services/api').getAllPokemonInTeam.mockResolvedValue(mockTeamData);
    require('../../services/api').getTeamById.mockResolvedValue(mockTeamName);

    const mockCurrentUser = { user_id: '1', isAdmin: 'true' };

    // Use act to wrap the render and state updates
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/teams/1']}>
          <Team token="test-token" currentUser={mockCurrentUser} />
        </MemoryRouter>
      );
    });

    // Wait for the buttons to appear and assert their presence
    await waitFor(() => {
      expect(screen.getByText(/edit team/i)).toBeInTheDocument();
      expect(screen.getByText(/delete team/i)).toBeInTheDocument();
    });
  });
  
  
  
});
