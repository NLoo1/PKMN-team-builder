import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SignupUser from '../../components/Signup';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the addUser function
const mockAddUser = jest.fn();

// Wrap the component in Router for navigation
const renderWithRouter = (component) => {
  return render(<Router>{component}</Router>);
};

describe('SignupUser Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders SignupUser component correctly', () => {
    renderWithRouter(<SignupUser addUser={mockAddUser} />);
    
    screen.debug(); // Print the DOM to help debug
  
    expect(document.querySelector('#username')).toBeInTheDocument();
    expect(document.querySelector('#email')).toBeInTheDocument();
    expect(document.querySelector('#password')).toBeInTheDocument();
    expect(document.querySelector('#confirmPassword')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
  });
  

  test('handles form submission correctly', async () => {
    renderWithRouter(<SignupUser addUser={mockAddUser} />);
    
    fireEvent.change(document.querySelector('#username'), { target: { value: 'Ash' } });
    fireEvent.change(document.querySelector('#email'), { target: { value: 'ash@example.com' } });
    fireEvent.change(document.querySelector('#password'), { target: { value: 'password123' } });
    fireEvent.change(document.querySelector('#confirmPassword'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(mockAddUser).toHaveBeenCalledWith({
        username: 'Ash',
        password: 'password123',
        confirmPassword: 'password123',
        email: 'ash@example.com'
      });
    });
  });

  test('displays error when passwords do not match', async () => {
    renderWithRouter(<SignupUser addUser={mockAddUser} />);
    
    fireEvent.change(document.querySelector('#username'), { target: { value: 'Ash' } });
    fireEvent.change(document.querySelector('#email'), { target: { value: 'ash@example.com' } });
    fireEvent.change(document.querySelector('#password'), { target: { value: 'password123' } });
    fireEvent.change(document.querySelector('#confirmPassword'), { target: { value: 'password124' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match./i)).toBeInTheDocument();
    });
  });

  test('displays error when fields are empty', async () => {
    renderWithRouter(<SignupUser addUser={mockAddUser} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please fill out all fields./i)).toBeInTheDocument();
    });
  });

  test('displays error when addUser fails', async () => {
    mockAddUser.mockRejectedValueOnce(new Error('Failed to register user.'));
    renderWithRouter(<SignupUser addUser={mockAddUser} />);
    
    fireEvent.change(document.querySelector('#username'), { target: { value: 'Ash' } });
    fireEvent.change(document.querySelector('#email'), { target: { value: 'ash@example.com' } });
    fireEvent.change(document.querySelector('#password'), { target: { value: 'password123' } });
    fireEvent.change(document.querySelector('#confirmPassword'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
  
    await waitFor(() => {
      expect(screen.getByText(/Failed to register user./i)).toBeInTheDocument();
    });
  });
  
});
