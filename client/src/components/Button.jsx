import React from 'react';
import PropTypes from 'prop-types';

const variantClass = (variant) => {
  switch (variant) {
    case 'secondary':
      return 'btn-secondary';
    case 'danger':
      return 'btn-danger';
    case 'primary':
    default:
      return 'btn-primary';
  }
};

const sizeClass = (size) => {
  switch (size) {
    case 'sm':
      return 'btn-sm';
    case 'lg':
      return 'btn-lg';
    case 'md':
    default:
      return 'btn-md';
  }
};

function Button({ children, variant = 'primary', size = 'md', disabled = false, className = '', onClick, ...rest }) {
  const classes = [variantClass(variant), sizeClass(size), disabled ? 'btn-disabled' : '', className]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);
  };

  return (
    <button className={classes} disabled={disabled} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
