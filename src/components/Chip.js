import React, { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Chip.css';

const Chip = memo(
  forwardRef(({ children }, ref) => (
    <div ref={ref} className='selected-chip'>
      {children}
    </div>
  ))
);

Chip.propTypes = {
  children: PropTypes.node,
};

export default Chip;
