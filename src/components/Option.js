import React, { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import './Option.css';

const Option = memo(
  forwardRef(
    ({ value, selected, onSelect, style }, ref) => {
      const selectedClass = selected ? 'selected' : '';
      return (
        <div ref={ref} className={`option ${selectedClass}`} onClick={onSelect} style={style}>
          {value}
        </div>
      );
    },
    (prevProps, nextProps) => prevProps.selected === nextProps.selected
  )
);

Option.propTypes = {
  value: PropTypes.string,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  style: PropTypes.object,
};

Option.defaultProps = {
  selected: false,
};

export default Option;
