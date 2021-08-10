import React, { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import './Option.css';

const Option = memo(
  forwardRef(({ children, selected, onSelect, onKeyPress, style, tabIndex }, ref) => {
    const selectedClass = selected ? 'selected' : '';
    const ariaLabel = typeof children === 'string' ? children : 'select option ' + tabIndex;
    return (
      <div
        ref={ref}
        tabIndex={tabIndex}
        className={`option ${selectedClass}`}
        ariaLabel={ariaLabel}
        onClick={onSelect}
        onKeyPress={onKeyPress}
        style={style}
      >
        {children}
      </div>
    );
  }),
  (prevProps, nextProps) => prevProps.selected === nextProps.selected // only update when select bool changes
);

Option.propTypes = {
  children: PropTypes.node,
  tabIndex: PropTypes.number,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  onKeyPress: PropTypes.func,
  style: PropTypes.object,
};

Option.defaultProps = {
  selected: false,
};

export default Option;
