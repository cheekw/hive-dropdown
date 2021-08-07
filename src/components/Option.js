import React, { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import './Option.css';

const Option = memo(
  forwardRef(
    ({ children, selected, onSelect, style }, ref) => {
      const selectedClass = selected ? 'selected' : '';
      return (
        <div ref={ref} className={`option ${selectedClass}`} onClick={onSelect} style={style}>
          {children}
        </div>
      );
    },
    (prevProps, nextProps) => prevProps.selected === nextProps.selected // only update when select bool changes
  )
);

Option.propTypes = {
  children: PropTypes.node,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  style: PropTypes.object,
};

Option.defaultProps = {
  selected: false,
};

export default Option;
