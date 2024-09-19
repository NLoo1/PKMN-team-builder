import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';


test('renders Pokemon Team Builder', () => {
  render(<App />);
  const linkElement = screen.getByText("Welcome to Pokemon Team Builder!");
  expect(linkElement).toBeInTheDocument();
});
