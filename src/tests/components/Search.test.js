import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Search } from '../../components/Search';
import PokeAPI from '../../services/api';

// Mock the PokeAPI functions
jest.mock('../../services/api');

describe('Search Component', () => {
  const mockGetItems = jest.fn();
  const mockSetData = jest.fn();
  const mockSetLoadMoreCount = jest.fn();
  const mockSetOffset = jest.fn();
  const mockSetIsSearching = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input and button', () => {
    render(
      <Search
        getItems={mockGetItems}
        location=""
        setData={mockSetData}
        setLoadMoreCount={mockSetLoadMoreCount}
        setOffset={mockSetOffset}
        setIsSearching={mockSetIsSearching}
        type="pokemon"
      />
    );

    expect(screen.getByPlaceholderText(/search.../i)).toBeInTheDocument();
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
  });

  test('fetches all items when search input is empty', async () => {
    render(
      <Search
        getItems={mockGetItems}
        location=""
        setData={mockSetData}
        setLoadMoreCount={mockSetLoadMoreCount}
        setOffset={mockSetOffset}
        setIsSearching={mockSetIsSearching}
        type="pokemon"
      />
    );

    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(mockGetItems).toHaveBeenCalled();
      expect(mockSetLoadMoreCount).toHaveBeenCalledWith(20);
      expect(mockSetOffset).toHaveBeenCalledWith(0);
      expect(mockSetIsSearching).toHaveBeenCalledWith(false);
      expect(mockSetData).toHaveBeenCalledWith([]);
    });
  });

  test('searches for Pokémon correctly', async () => {
    const mockData = [{ name: 'Pikachu' }, { name: 'Bulbasaur' }];
    PokeAPI.getAllPokemon.mockResolvedValue(mockData);

    render(
      <Search
        getItems={mockGetItems}
        location=""
        setData={mockSetData}
        setLoadMoreCount={mockSetLoadMoreCount}
        setOffset={mockSetOffset}
        setIsSearching={mockSetIsSearching}
        type="pokemon"
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/search.../i), { target: { value: 'Pikachu' } });
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(PokeAPI.getAllPokemon).toHaveBeenCalledWith(0, 2000);
      expect(mockSetData).toHaveBeenCalledWith([{ name: 'Pikachu' }]);
    });
  });

  test('handles user search correctly', async () => {
    const mockUsers = [{ username: 'Ash' }, { username: 'Misty' }];
    PokeAPI.filterUsers.mockResolvedValue(mockUsers);
  
    render(
      <Search
        getItems={mockGetItems}
        location=""
        setData={mockSetData}
        setLoadMoreCount={mockSetLoadMoreCount}
        setOffset={mockSetOffset}
        setIsSearching={mockSetIsSearching}
        type="users"
      />
    );
  
    fireEvent.change(screen.getByPlaceholderText(/search.../i), { target: { value: 'Ash' } });
    fireEvent.click(screen.getByText(/submit/i));
  
    await waitFor(() => {
      expect(PokeAPI.filterUsers).toHaveBeenCalledWith('Ash', localStorage.token);
      expect(mockSetData).toHaveBeenCalledWith([{ username: 'Ash' }, { username: 'Misty' }]); // Updated expectation
    });
  });
  

  test('logs error when search fails', async () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    PokeAPI.getAllPokemon.mockRejectedValue(new Error('Fetch error'));
  
    render(
      <Search
        getItems={mockGetItems}
        location=""
        setData={mockSetData}
        setLoadMoreCount={mockSetLoadMoreCount}
        setOffset={mockSetOffset}
        setIsSearching={mockSetIsSearching}
        type="pokemon"
      />
    );
  
    fireEvent.change(screen.getByPlaceholderText(/search.../i), { target: { value: 'Pikachu' } });
    fireEvent.click(screen.getByText(/submit/i));
  
    await waitFor(() => {
      expect(PokeAPI.getAllPokemon).toHaveBeenCalled();
      expect(consoleErrorMock).toHaveBeenCalledWith('Error during search:', new Error('Fetch error'));
    });
  
    consoleErrorMock.mockRestore();
  });
  
});
