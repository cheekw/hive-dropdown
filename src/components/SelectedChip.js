import React, { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './SelectedChip.css';

const SelectedChip = memo(
  forwardRef(({ value }, ref) => (
    <div ref={ref} className='selected-chip'>
      {value}
    </div>
  ))
);

SelectedChip.propTypes = { value: PropTypes.string };

export default SelectedChip;
