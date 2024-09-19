import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import useFetchItems from '../../hooks/useFetchItems';
import { PokemonList } from '../../pages/PokemonList'; 

// Mock Item and Search components
jest.mock('../../components/Search', () => ({
  Search: () => <div>Mocked Search</div>
}));

// Mock the useFetchItems hook
jest.mock('../../hooks/useFetchItems');

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

  afterEach(() => {
    jest.clearAllMocks(); // Clears any mocked calls or instances
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

  test('renders table with pokemon data', async () => {
    const mockData = [
      { name: 'Pikachu', pokemon_id: 1 },
      { name: 'Bulbasaur', pokemon_id: 2 }
    ];
  
    useFetchItems.mockReturnValueOnce({
      data: mockData,
      isLoading: false,
      getItems: jest.fn(),
      setData: jest.fn()
    });
  
    render(<PokemonList currentUser={mockUser} />);
  
    await waitFor(() => {
      const tableElement = screen.getByRole('table');
      expect(tableElement).toBeInTheDocument();
  
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    });
  });
  
  test('load more button exists', async () => {
    const mockData = [
      { name: 'Pikachu', pokemon_id: 1 },
      { name: 'Bulbasaur', pokemon_id: 2 }
    ];
  
    // Mock useFetchItems to include mockGetItems
    useFetchItems.mockReturnValue({
      data: mockData,
      isLoading: false,
      getItems: jest.fn(),
      setData: jest.fn()
    });
  
    render(<PokemonList currentUser={mockUser} />);
  
    // Click the "Load More" button
    const loadMoreButton = screen.getByText('Load More');
    expect(loadMoreButton).toBeInTheDocument();
    
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
  
    // Use getAllByRole to get all <tr> elements
    const itemRows = screen.getAllByRole('row');
    
    // Expect the number of rows to be equal to the number of mockData items
    // Note: Add 1 to account for the header row
    expect(itemRows).toHaveLength(mockData.length + 1); // Adding 1 for the header row
  });
  
});
