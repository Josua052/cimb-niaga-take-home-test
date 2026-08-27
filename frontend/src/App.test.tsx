import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders application header title correctly', () => {
    render(<App />);
    expect(screen.getByText('Supervisor Call Monitoring')).toBeInTheDocument();
  });
});
