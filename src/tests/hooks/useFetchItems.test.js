import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import useFetchItems from '../../hooks/useFetchItems';
import PokeAPI from '../../services/api';

// Mock the PokeAPI functions
jest.mock('../../services/api');

const mockGetAllPokemon = PokeAPI.getAllPokemon;
const mockGetUsers = PokeAPI.getUsers;
const mockGetAllTeams = PokeAPI.getAllTeams;
const mockGetAllUserTeams = PokeAPI.getAllUserTeams;

describe('useFetchItems Hook', () => {
  const wrapper = ({ children }) => <>{children}</>;

  test('fetches and returns Pokémon data', async () => {
    const mockPokemonData = [{ pokemon_id: 1, name: 'Pikachu' }];
    mockGetAllPokemon.mockResolvedValue(mockPokemonData);

    let result;
    function TestComponent() {
      result = useFetchItems('pokemon', 0, 20, {});
      return null;
    }

    render(<TestComponent />, { wrapper });

    await act(async () => {
      // Wait for the hook to update
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.data).toEqual(mockPokemonData);
    expect(result.isLoading).toBe(false);
  });

  test('fetches and returns users data', async () => {
    const mockUsersData = [{ id: 1, name: 'Ash' }];
    mockGetUsers.mockResolvedValue(mockUsersData);

    let result;
    function TestComponent() {
      result = useFetchItems('users', 0, 20, { token: 'mockToken' });
      return null;
    }

    render(<TestComponent />, { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.data).toEqual(mockUsersData);
    expect(result.isLoading).toBe(false);
  });

  test('handles error when fetching data', async () => {
    mockGetAllPokemon.mockRejectedValue(new Error('Failed to fetch'));

    let result;
    function TestComponent() {
      result = useFetchItems('pokemon', 0, 20, {});
      return null;
    }

    render(<TestComponent />, { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.data).toEqual([]);
    expect(result.isLoading).toBe(false);
  });

  test('fetches and returns team data', async () => {
    const mockTeamsData = [{ id: 1, name: 'Team Rocket' }];
    mockGetAllTeams.mockResolvedValue(mockTeamsData);

    let result;
    function TestComponent() {
      result = useFetchItems('teams', 0, 20, {});
      return null;
    }

    render(<TestComponent />, { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.data).toEqual(mockTeamsData);
    expect(result.isLoading).toBe(false);
  });

  test('fetches and returns user teams data', async () => {
    const mockUserTeamsData = [{ id: 1, name: 'My Team' }];
    mockGetAllUserTeams.mockResolvedValue(mockUserTeamsData);

    let result;
    function TestComponent() {
      result = useFetchItems('my-teams', 0, 20, { currentUser: { token: 'mockToken' } });
      return null;
    }

    render(<TestComponent />, { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.data).toEqual(mockUserTeamsData);
    expect(result.isLoading).toBe(false);
  });
});
