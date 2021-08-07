import React, { memo } from 'react';
import PropTypes from 'prop-types';
import './Option.css';

const Option = memo(
  ({ value, selected, onSelect, style }) => {
    const selectedClass = selected ? 'selected' : '';
    return (
      <div className={`option ${selectedClass}`} onClick={onSelect} style={style}>
        {value}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.selected === nextProps.selected
);

Option.propTypes = {
  value: PropTypes.string,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  style: PropTypes.func,
};

Option.defaultProps = {
  selected: false,
};

export default Option;
