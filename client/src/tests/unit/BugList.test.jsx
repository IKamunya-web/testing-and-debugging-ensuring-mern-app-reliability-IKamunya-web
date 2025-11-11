import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import BugList from '../../components/BugList';

const sampleBugs = [
  { _id: '1', title: 'Bug 1', description: 'Desc 1', status: 'open' },
  { _id: '2', title: 'Bug 2', description: 'Desc 2', status: 'in-progress' }
];

describe('BugList', () => {
  it('renders a list of bugs and calls handlers', () => {
    const onDelete = jest.fn();
    const onUpdateStatus = jest.fn();

    render(<BugList bugs={sampleBugs} onDelete={onDelete} onUpdateStatus={onUpdateStatus} />);

    expect(screen.getByText('Reported Bugs')).toBeInTheDocument();
    expect(screen.getByTestId('bug-1')).toBeInTheDocument();
    expect(screen.getByTestId('bug-2')).toBeInTheDocument();

  // There are multiple status selects (one per bug). Target the first bug's select.
  const firstBug = screen.getByTestId('bug-1');
  const { getByLabelText, getByText } = within(firstBug);

  const statusSelect = getByLabelText(/Status/i);
  // change to in-progress
  fireEvent.change(statusSelect, { target: { value: 'in-progress' } });
  expect(onUpdateStatus).toHaveBeenCalledWith('1', 'in-progress');

  // change to resolved
  fireEvent.change(statusSelect, { target: { value: 'resolved' } });
  expect(onUpdateStatus).toHaveBeenCalledWith('1', 'resolved');

  // delete
  const deleteBtn = getByText('Delete');
  fireEvent.click(deleteBtn);
  expect(onDelete).toHaveBeenCalledWith('1');
  });
});
