import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../../components/Button';

describe('Button accessibility', () => {
  it('has role=button by default and supports aria-label', () => {
    render(<Button aria-label="My Button">Label</Button>);
    const btn = screen.getByRole('button', { name: /my button/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-label', 'My Button');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled aria-label="Disabled Btn">X</Button>);
    const btn = screen.getByRole('button', { name: /disabled btn/i });
    expect(btn).toBeDisabled();
  });
});
