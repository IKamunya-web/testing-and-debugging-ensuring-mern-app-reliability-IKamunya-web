import React, { useState } from 'react';
import PropTypes from 'prop-types';

function BugForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), description: description.trim() });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} aria-label="bug-form">
      <div>
        <label htmlFor="bug-title">Title</label>
        <input id="bug-title" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="bug-desc">Description</label>
        <textarea id="bug-desc" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <button type="submit">Report Bug</button>
    </form>
  );
}

BugForm.propTypes = {
  onCreate: PropTypes.func.isRequired
};

export default BugForm;
