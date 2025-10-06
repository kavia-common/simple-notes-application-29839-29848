import { render, screen } from '@testing-library/react';
import App from './App';

describe('App basic UI', () => {
  test('shows New Note button in the sidebar', () => {
    render(<App />);
    expect(screen.getAllByRole('button', { name: /\bnew note\b/i })[0]).toBeInTheDocument();
  });

  test('shows empty state when there are no notes', () => {
    // Clear any persisted data that might exist
    window.localStorage.clear();
    render(<App />);
    expect(screen.getByRole('status')).toHaveTextContent(/welcome to ocean notes/i);
  });
});
