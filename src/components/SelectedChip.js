import React, { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './SelectedChip.css';

const SelectedChip = memo(
  forwardRef(({ children }, ref) => (
    <div ref={ref} className='selected-chip'>
      {children}
    </div>
  ))
);

SelectedChip.propTypes = {
  children: PropTypes.node,
};

export default SelectedChip;
