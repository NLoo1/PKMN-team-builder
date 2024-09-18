import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EditTeam from '../../containers/EditTeam';
import PokeAPI from '../../services/api';
import useFetchItems from '../../hooks/useFetchItems';

// Mock the PokeAPI class methods
jest.mock('../../services/api', () => {
  const mockApi = {
    getTeamById: jest.fn(),
    deleteTeam: jest.fn(),
    getUser: jest.fn(),
    getProfileTeams: jest.fn(),
    editPokemonInTeam: jest.fn(),
  };
  return mockApi;
});

jest.mock('../../hooks/useFetchItems', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('EditTeam Component', () => {
  const mockCurrentUser = {
    user_id: '1',
    username: 'testuser',
    token: 'mockToken',
    isAdmin: 'false',
  };

  const mockTeamData = {
    team_name: 'Test Team',
    user_id: '1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.alert to prevent actual alerts
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('handles Load More button click', async () => {
    const mockData = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, name: `Pokemon ${i + 1}`, image: 'url' }));
    PokeAPI.getTeamById.mockResolvedValue(mockTeamData);
    useFetchItems.mockReturnValue({
      data: mockData,
      getItems: jest.fn(),
    });

    render(<EditTeam currentUser={mockCurrentUser} token="mockToken" />);

    // Check for Load More button
    const loadMoreButton = screen.queryByText('Load More');
    expect(loadMoreButton).toBeInTheDocument();

    // Click Load More
    fireEvent.click(loadMoreButton);

    // Add any additional assertions if needed
  });

  it('displays alert if trying to add more than 6 Pokémon', async () => {
    const mockData = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, name: `Pokemon ${i + 1}`, image: 'url' }));
    PokeAPI.getTeamById.mockResolvedValue(mockTeamData);
    useFetchItems.mockReturnValue({
      data: mockData,
      getItems: jest.fn(),
    });

    render(<EditTeam currentUser={mockCurrentUser} token="mockToken" />);

    // Select more than 6 Pokémon
    for (let i = 1; i <= 7; i++) {
      const checkbox = screen.getAllByRole('checkbox')[i - 1];
      fireEvent.click(checkbox);
    }

    // Check if alert is displayed
    expect(window.alert).toHaveBeenCalledWith('You can only add up to 6 Pokémon to a team.');
  });
});
