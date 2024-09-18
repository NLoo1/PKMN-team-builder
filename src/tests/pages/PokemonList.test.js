import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PokemonList } from '../../pages/PokemonList'; 
import useFetchItems from '../../hooks/useFetchItems';

// Mock the useFetchItems hook
jest.mock('../../hooks/useFetchItems');

// Mock Item and Search components
jest.mock('../../components/Item', () => () => <tr><td>Mocked Item</td></tr>);
jest.mock('../../components/Search', () => () => <div>Mocked Search</div>);

describe('PokemonList Component', () => {
  const mockUser = { currentUser: { token: 'test-token' } };

  beforeEach(() => {
    // Reset mock for useFetchItems before each test
    useFetchItems.mockReturnValue({
      data: [],
      isLoading: false,
      getItems: jest.fn(),
      setData: jest.fn()
    });
  });

  test('renders loading state initially', () => {
    // Mock the hook to return loading state
    useFetchItems.mockReturnValueOnce({
      data: [],
      isLoading: true,
      getItems: jest.fn(),
      setData: jest.fn()
    });

    render(<PokemonList currentUser={mockUser} />);

    const loadingElement = screen.getByText(/loading/i);
    expect(loadingElement).toBeInTheDocument();
  });

  test('renders table with pokemon data', () => {
    const mockData = [
      { name: 'Pikachu', pokemon_id: 1 },
      { name: 'Bulbasaur', pokemon_id: 2 }
    ];

    // Mock the hook to return pokemon data
    useFetchItems.mockReturnValueOnce({
      data: mockData,
      isLoading: false,
      getItems: jest.fn(),
      setData: jest.fn()
    });

    render(<PokemonList currentUser={mockUser} />);

    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();

    const pikachuRow = screen.getByText(/pikachu/i);
    const bulbasaurRow = screen.getByText(/bulbasaur/i);

    expect(pikachuRow).toBeInTheDocument();
    expect(bulbasaurRow).toBeInTheDocument();
  });

  test('renders "Load More" button and triggers load more action', () => {
    render(<PokemonList currentUser={mockUser} />);

    const loadMoreButton = screen.getByRole('button', { name: /load more/i });
    expect(loadMoreButton).toBeInTheDocument();

    fireEvent.click(loadMoreButton);

    expect(useFetchItems().getItems).toHaveBeenCalled();
  });

  test('renders Search component', () => {
    render(<PokemonList currentUser={mockUser} />);

    const searchComponent = screen.getByText(/mocked search/i);
    expect(searchComponent).toBeInTheDocument();
  });

  test('renders Item component for each Pokemon', () => {
    const mockData = [
      { name: 'Pikachu', pokemon_id: 1 },
      { name: 'Charmander', pokemon_id: 2 }
    ];

    // Mock the hook to return pokemon data
    useFetchItems.mockReturnValueOnce({
      data: mockData,
      isLoading: false,
      getItems: jest.fn(),
      setData: jest.fn()
    });

    render(<PokemonList currentUser={mockUser} />);

    const pikachuRow = screen.getByText(/mocked item/i);
    expect(pikachuRow).toBeInTheDocument();
  });
});
