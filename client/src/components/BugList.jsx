import React from 'react';
import PropTypes from 'prop-types';

function BugList({ bugs, onDelete, onUpdateStatus }) {
  return (
    <div>
      <h2>Reported Bugs</h2>
      <ul>
        {bugs.map(bug => (
          <li key={bug._id} data-testid={`bug-${bug._id}`}>
            <strong>{bug.title}</strong> - <span>{bug.status}</span>
            <p>{bug.description}</p>
            <label htmlFor={`status-${bug._id}`} style={{ marginRight: '8px' }}>Status</label>
            <select
              id={`status-${bug._id}`}
              value={bug.status}
              onChange={(e) => onUpdateStatus(bug._id, e.target.value)}
              aria-label={`status-select-${bug._id}`}>
              <option value="open">open</option>
              <option value="in-progress">in-progress</option>
              <option value="resolved">resolved</option>
            </select>
            <button onClick={() => onDelete(bug._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

BugList.propTypes = {
  bugs: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string
  })).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func.isRequired
};

export default BugList;
