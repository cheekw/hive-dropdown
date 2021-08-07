import React, { memo } from 'react';
import PropTypes from 'prop-types';
import './SelectedChip.css';

const SelectedChip = memo(({ value }) => <div className='selected-chip'>{value}</div>);

SelectedChip.propTypes = { value: PropTypes.string };

export default SelectedChip;
