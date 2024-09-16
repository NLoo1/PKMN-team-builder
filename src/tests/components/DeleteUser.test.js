import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router, Routes, Route } from 'react-router-dom';
import DeleteUser from '../../components/DeleteUser';
import { createMemoryHistory } from 'history';

const history = createMemoryHistory();

beforeEach(() => {
  global.alert = jest.fn(); // Mock global alert
});

const renderWithRouter = (component) => {
    return render(
      <Router location="/delete/testuser" navigator={history}>
        <Routes>
          <Route path="/delete/:username" element={component} />
        </Routes>
      </Router>
    );
  };
  

test('renders and checks authorization', async () => {
  renderWithRouter(<DeleteUser />);
  
  await waitFor(() => {
  expect(screen.getByText((content, element) => 
    content.startsWith("Are you sure you want to delete") && element.tagName === "H1"
  )).toBeInTheDocument();
});

});

test('handles user deletion correctly', async () => {
  // Add your mock implementation for user deletion
  const mockDeleteUser = jest.fn();
  
  renderWithRouter(<DeleteUser deleteUser={mockDeleteUser} />);
  
  fireEvent.click(screen.getByText(/Confirm/i));
  
  await waitFor(() => {
    expect(mockDeleteUser).toHaveBeenCalled();
  });
});

test('displays error message if deletion fails', async () => {
  // Mock failure scenario
  const mockDeleteUser = jest.fn().mockRejectedValue(new Error('Deletion failed'));
  
  renderWithRouter(<DeleteUser deleteUser={mockDeleteUser} />);
  
  fireEvent.click(screen.getByText(/Confirm/i));
  
  await waitFor(() => {
    expect(screen.getByText(/Deletion failed/i)).toBeInTheDocument();
  });
});

test('prevents unauthorized access', async () => {
  renderWithRouter(<DeleteUser />);
  
  await waitFor(() => {
    expect(global.alert).toHaveBeenCalledWith("You are not authorized to delete this user.");
  });
});
