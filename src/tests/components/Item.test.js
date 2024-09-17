import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Item } from "../../components/Item";
import PokeAPI from "../../services/api";

// Mock the PokeAPI service
jest.mock("../../services/api", () => ({
  getPokemonSpriteByURL: jest.fn(),
}));

describe("Item Component", () => {
  const mockPokeAPIResponse = "http://example.com/pokemon.png";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Pokémon data with image and name", async () => {
    // Mock the API response
    PokeAPI.getPokemonSpriteByURL.mockResolvedValue(mockPokeAPIResponse);

    const pokemonData = { url: "http://pokeapi.co/api/v2/pokemon/1/", name: "bulbasaur" };
    
    render(
      <Router>
        <table>
          <tbody>
            <Item type="pokemon" data={pokemonData} />
          </tbody>
        </table>
      </Router>
    );

    // Check for loading text initially
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for the image to be loaded
    await waitFor(() => {
      expect(screen.getByRole("img")).toHaveAttribute("src", mockPokeAPIResponse);
    });

    // Check for the Pokémon name
    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
  });

  test("renders user data as a link", () => {
    const userData = { username: "testuser" };

    render(
      <Router>
        <table>
          <tbody>
            <Item type="users" data={userData} />
          </tbody>
        </table>
      </Router>
    );

    expect(screen.getByText("testuser")).toHaveAttribute("href", "/users/testuser");
  });

  test("renders team data with a link", () => {
    const teamData = { team_id: 1, team_name: "Test Team" };

    render(
      <Router>
        <table>
          <tbody>
            <Item type="teams" data={teamData} />
          </tbody>
        </table>
      </Router>
    );

    expect(screen.getByText("Test Team")).toHaveAttribute("href", "/teams/1");
  });

  test("renders selectable item with checkbox", () => {
    const pokemonData = { url: "http://pokeapi.co/api/v2/pokemon/1/", name: "bulbasaur" };

    render(
      <Router>
        <table>
          <tbody>
            <Item type="pokemon" data={pokemonData} isSelectable={true} isSelected={false} onCheckboxChange={() => {}} />
          </tbody>
        </table>
      </Router>
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  test("calls onCheckboxChange when checkbox is changed", () => {
    const onCheckboxChange = jest.fn();
    const pokemonData = { url: "http://pokeapi.co/api/v2/pokemon/1/", name: "bulbasaur" };

    render(
      <Router>
        <table>
          <tbody>
            <Item type="pokemon" data={pokemonData} isSelectable={true} isSelected={false} onCheckboxChange={onCheckboxChange} />
          </tbody>
        </table>
      </Router>
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(onCheckboxChange).toHaveBeenCalled();
  });
});
