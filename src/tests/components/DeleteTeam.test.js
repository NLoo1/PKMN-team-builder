import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DeleteTeam from '../../components/DeleteTeam';
import PokeAPI from '../../services/api';

jest.mock('../../services/api', () => ({
  deleteTeam: jest.fn(),
  getTeamById: jest.fn(),
}));

// Mock console.error
beforeAll(() => {
  console.error = jest.fn();
});

// Mock window.alert
const mockAlert = jest.fn();
window.alert = mockAlert;

test('renders and handles deletion correctly', async () => {
  const mockTeam = { user_id: '1', team_name: 'New Team' };
  PokeAPI.getTeamById.mockResolvedValue(mockTeam);
  PokeAPI.deleteTeam.mockResolvedValue(); // Mock successful deletion

  const currentUser = { user_id: '1', isAdmin: false, token:'mock-token' };
  const token = 'mock-token';
  const teamId = '123';

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/delete-team/${teamId}`]}>
  <Routes>
    <Route path="/delete-team/:id" element={<DeleteTeam deleteTeam={PokeAPI.deleteTeam} token={token} currentUser={currentUser} />} />
    <Route path="*" element={<div>No route found</div>} />
  </Routes>
</MemoryRouter>

    );
  });

  const confirmButton = screen.getByRole('button', { name: /Confirm/i });
  expect(confirmButton).toBeInTheDocument();

  userEvent.click(confirmButton);

  await waitFor(() => {
    expect(PokeAPI.deleteTeam).toHaveBeenCalledWith(teamId, token);
  });

  expect(mockAlert).toHaveBeenCalledWith('Successfully deleted team New Team');
});

test('displays error message if deletion fails', async () => {
  PokeAPI.getTeamById.mockResolvedValue({ user_id: '1', team_name: 'New Team' });
  PokeAPI.deleteTeam.mockRejectedValue(new Error('Deletion failed'));

  const currentUser = { user_id: '1', isAdmin: false };
  const token = 'mock-token';
  const teamId = '123';

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/delete-team/${teamId}`]}>
        <Routes>
          <Route path="/delete-team/:id" element={<DeleteTeam deleteTeam={PokeAPI.deleteTeam} token={token} currentUser={currentUser} />} />
        </Routes>
      </MemoryRouter>
    );
  });

  const confirmButton = screen.getByRole('button', { name: /Confirm/i });
  expect(confirmButton).toBeInTheDocument();

  userEvent.click(confirmButton);

  await waitFor(() => {
    expect(console.error).toHaveBeenCalledWith('Error deleting team:', expect.any(Error));
  });

  expect(mockAlert).toHaveBeenCalledWith('Failed to delete team');
});
