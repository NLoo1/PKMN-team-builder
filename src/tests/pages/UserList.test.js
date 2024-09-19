import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import useFetchItems from '../../hooks/useFetchItems';
import { UserList } from '../../pages/UserList';

// Mock Search component
jest.mock('../../components/Search', () => ({
  Search: () => <div>Mocked Search</div>
}));

// Mock Item component
jest.mock('../../components/Item', () => (props) => (
  <tr>
    <td>{props.data.username}</td>
  </tr>
));

// Mock the useFetchItems hook
jest.mock('../../hooks/useFetchItems');

describe('UserList Component', () => {
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
    useFetchItems.mockReturnValueOnce({
      data: [],
      isLoading: true,
      getItems: jest.fn(),
      setData: jest.fn()
    });

    render(<UserList currentUser={mockUser} />);

    const loadingElement = screen.getByText(/loading/i);
    expect(loadingElement).toBeInTheDocument();
  });

  test('renders table with user data', async () => {
    const mockData = [
      { username: 'john_doe' },
      { username: 'jane_doe' }
    ];

    useFetchItems.mockReturnValueOnce({
      data: mockData,
      isLoading: false,
      getItems: jest.fn(),
      setData: jest.fn()
    });

    render(<UserList currentUser={mockUser} />);

    await waitFor(() => {
      const tableElement = screen.getByRole('table');
      expect(tableElement).toBeInTheDocument();

      expect(screen.getByText(/john_doe/i)).toBeInTheDocument();
      expect(screen.getByText(/jane_doe/i)).toBeInTheDocument();
    });
  });

  test('renders Search component', () => {
    render(<UserList currentUser={mockUser} />);

    const searchComponent = screen.getByText(/mocked search/i);
    expect(searchComponent).toBeInTheDocument();
  });

  test('renders Item component for each user', async () => {
    const mockData = [
      { username: 'john_doe' },
      { username: 'jane_doe' }
    ];

    useFetchItems.mockReturnValueOnce({
      data: mockData,
      isLoading: false,
      getItems: jest.fn(),
      setData: jest.fn()
    });

    render(<UserList currentUser={mockUser} />);

    await waitFor(() => {
      // Use getAllByRole to get all <tr> elements
      const itemRows = screen.getAllByRole('row');
      expect(itemRows).toHaveLength(mockData.length + 1); // Adding 1 for the header row
    });
  });
});
