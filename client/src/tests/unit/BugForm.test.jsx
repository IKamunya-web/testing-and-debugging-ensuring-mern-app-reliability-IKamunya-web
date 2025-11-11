import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BugForm from '../../components/BugForm';

describe('BugForm', () => {
  it('renders and submits input to onCreate', () => {
    const handleCreate = jest.fn();
    render(<BugForm onCreate={handleCreate} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const descInput = screen.getByLabelText(/Description/i);
    const submitBtn = screen.getByRole('button', { name: /Report Bug/i });

    fireEvent.change(titleInput, { target: { value: 'Test bug' } });
    fireEvent.change(descInput, { target: { value: 'Steps to reproduce' } });
    fireEvent.click(submitBtn);

    expect(handleCreate).toHaveBeenCalledTimes(1);
    expect(handleCreate).toHaveBeenCalledWith(expect.objectContaining({ title: 'Test bug', description: 'Steps to reproduce' }));
  });

  it('does not submit when title is empty', () => {
    const handleCreate = jest.fn();
    render(<BugForm onCreate={handleCreate} />);

    const submitBtn = screen.getByRole('button', { name: /Report Bug/i });
    fireEvent.click(submitBtn);
    expect(handleCreate).not.toHaveBeenCalled();
  });
});
