import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import SelectedChips from './SelectedChips';
import ChevronDown from '../assets/chevron-down.png';
import ChevronUp from '../assets/chevron-up.png';
import Clear from '../assets/clear.png';
import { handlePressEnter } from '../utils';

const DropdownTemplate = forwardRef(
  (
    { isOpen, showsClearSelection, handleClickBar, handleUnselectAll, selectedOptions, menuList },
    ref
  ) => {
    const { dropdownRef, chipEndRef } = ref;

    return (
      <div ref={dropdownRef} className={isOpen ? 'dropdown active' : 'dropdown'}>
        <div
          tabIndex={0}
          className='dropdown-bar'
          onClick={handleClickBar}
          onKeyPress={(event) => handlePressEnter(event, null, handleClickBar)}
        >
          <div className='inner-bar'>
            <SelectedChips ref={chipEndRef} itemNames={selectedOptions} />
          </div>
          <div>
            {showsClearSelection && (
              <img
                tabIndex={1}
                className='clear-icon'
                src={Clear}
                alt='clear all button'
                onKeyDown={(event) => handlePressEnter(event, null, handleUnselectAll)}
                onClick={handleUnselectAll}
              />
            )}
            <img
              className='caret-icon'
              src={isOpen ? ChevronUp : ChevronDown}
              alt='dropdown caret icon'
            />
          </div>
        </div>
        {menuList}
      </div>
    );
  }
);

DropdownTemplate.propTypes = {
  isOpen: PropTypes.bool,
  showsClearSelection: PropTypes.bool,
  handleClickBar: PropTypes.func,
  handleUnselectAll: PropTypes.func,
  selectedOptions: PropTypes.arrayOf(PropTypes.string),
  menuList: PropTypes.node,
};

export default DropdownTemplate;
