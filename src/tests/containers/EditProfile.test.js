import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditUser from '../../containers/EditProfile';
import PokeAPI from '../../services/api';

// Mocking the API calls
jest.mock('../../services/api', () => ({
  getUser: jest.fn(),
}));

// Mocking the editUser function
const mockEditUser = jest.fn();

// Test suite
describe('EditUser Component', () => {
  // Helper function to render the component with necessary props
  const renderComponent = (props) => {
    render(
      <MemoryRouter initialEntries={['/edit/Ash']}>
        <Routes>
          <Route path="/edit/:username" element={<EditUser {...props} />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders EditUser component correctly', async () => {
    PokeAPI.getUser.mockResolvedValue({
      user: {
        username: 'Ash',
        email: 'ash@example.com',
        bio: 'Pokemon Trainer',
        isAdmin: false,
      },
    });

    renderComponent({ editUser: mockEditUser, token: 'test-token', currentUser: { username: 'Ash', isAdmin: false } });

    expect(screen.getByLabelText(/Username:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New password:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm password:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bio:/i)).toBeInTheDocument();
  });

  test('fills out and submits the form successfully', async () => {
    PokeAPI.getUser.mockResolvedValue({
      user: {
        username: 'Ash',
        email: 'ash@example.com',
        bio: 'Pokemon Trainer',
        isAdmin: false,
      },
    });

    renderComponent({ editUser: mockEditUser, token: 'test-token', currentUser: { username: 'Ash', isAdmin: false } });

    fireEvent.change(screen.getByLabelText(/Username:/i), { target: { value: 'Ash Ketchum' } });
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'ashketchum@example.com' } });
    fireEvent.change(screen.getByLabelText(/New password:/i), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText(/Confirm password:/i), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText(/Bio:/i), { target: { value: 'Updated Bio' } });

    fireEvent.click(screen.getByRole('button', { name: /Confirm changes/i }));

    await waitFor(() => {
      expect(mockEditUser).toHaveBeenCalledWith({
        username: 'Ash Ketchum',
        email: 'ashketchum@example.com',
        bio: 'Updated Bio',
        password: 'newpassword123',
        confirmPassword: 'newpassword123',
        makeAdmin: false,
      }, 'Ash');
    });
  });

  test('shows error when form validation fails', async () => {
    PokeAPI.getUser.mockResolvedValue({
      user: {
        username: 'Ash',
        email: 'ash@example.com',
        bio: 'Pokemon Trainer',
        isAdmin: false,
      },
    });

    renderComponent({ editUser: mockEditUser, token: 'test-token', currentUser: { username: 'Ash', isAdmin: false } });

    fireEvent.click(screen.getByRole('button', { name: /Confirm changes/i }));

    // Use findByText to wait for the text to appear
    const errorMessage = await screen.findByText(/Please fill out all fields/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('shows error message when API call fails', async () => {
    PokeAPI.getUser.mockRejectedValue(new Error('Failed to fetch user data'));

    renderComponent({ editUser: mockEditUser, token: 'test-token', currentUser: { username: 'Ash', isAdmin: false } });

    // Wait for the component to handle the error and display the message
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch user data/i)).toBeInTheDocument();
    });
  });

  test('redirects when not authorized to edit profile', async () => {
    // Mocking `alert` to avoid actual alert calls during the test
    window.alert = jest.fn();

    renderComponent({ editUser: mockEditUser, token: 'test-token', currentUser: { username: 'Brock', isAdmin: false } });

    await waitFor(() => {
      // Check if the alert was called with the correct message
      expect(window.alert).toHaveBeenCalledWith("Cannot edit another user's profile.");
      
      // Verify that the component does not render the form
      expect(screen.queryByText(/Change profile:/i)).toBeNull();
    });
  });
});
