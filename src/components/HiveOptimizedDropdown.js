import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Option from './Option';
import SelectedChip from './SelectedChip';
import VirtualizedList from './VirtualizedList';
import ChevronDown from '../assets/chevron-down.png';
import ChevronUp from '../assets/chevron-up.png';
import Clear from '../assets/clear.png';
import './HiveOptimizedDropdown.css';

const HiveDropdown = ({
  itemHeight,
  menuHeight,
  isMultiSelect,
  options,
  onChange,
  showsSelectAll,
  showsClearSelection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wasStringOptionAdded, setWasStringOptionAdded] = useState(false);
  const [selectedOptionsMap, setSelectedOptionsMap] = useState({});
  const isSelectAllShown = showsSelectAll && isMultiSelect; // if select-all option can be shown
  const dropdownRef = useRef(null);
  const chipEndRef = useRef(null);

  useEffect(() => {
    // Handle Effect when clicking outside of dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    const cleanup = () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    return cleanup;
  }, [dropdownRef]);

  useEffect(() => {
    // Effect to scroll to end of chip
    if (wasStringOptionAdded) {
      chipEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [selectedOptionsMap, wasStringOptionAdded]);

  // For the dropdown top bar
  const handleClickBar = () => setIsOpen((isOpen) => !isOpen);

  // For some accesibility features
  const handlePressEnter = (event, params, func) => {
    if (event.key === 'Enter') {
      func(params);
    }
  };

  // Select all items
  const handleSelectAll = () => {
    const result = {};
    for (let i = 0; i < options.length; i++) {
      result[options[i].value] = true;
    }
    if (typeof onChange == 'function') {
      onChange(result);
    }
    setSelectedOptionsMap(result);
    setWasStringOptionAdded(true);
  };

  // Unselect all items
  const handleUnselectAll = () => {
    if (typeof onChange == 'function') {
      onChange();
    }
    setSelectedOptionsMap({});
  };

  const handleSelectOption = useCallback(
    (option) => {
      setSelectedOptionsMap((selectedOptionsMap) => {
        let result = {};
        if (isMultiSelect) {
          result = { ...selectedOptionsMap };
          if (selectedOptionsMap[option] === true) {
            // remove
            delete result[option];
            setWasStringOptionAdded(false);
          } else {
            // add
            result[option] = true;
            setWasStringOptionAdded(typeof option === 'string');
          }
        } else {
          if (selectedOptionsMap[option] === true) {
            // remove
            delete result[option];
          } else {
            // set to 1 item
            result = { [option]: true };
          }
        }
        if (typeof onChange == 'function') {
          onChange(result);
        }
        return result;
      });
    },
    [setSelectedOptionsMap, isMultiSelect, onChange]
  );

  const renderRow = ({ index, style }) => {
    let itemIndex = index;
    if (isSelectAllShown) {
      // reduce index by one to accomodate for extra row
      itemIndex = index - 1;
    }
    if (itemIndex < 0 && isSelectAllShown) {
      const handleKeyPress = (event) => handleSelectAll(event, null, handleSelectAll);
      return (
        <Option
          tabIndex={0}
          key={index}
          selected={false}
          onSelect={handleSelectAll}
          onKeyPress={handleKeyPress}
          style={style}
        >
          Select All...
        </Option>
      );
    } else {
      const item = options[itemIndex];
      const handleSelectOptionItem = () => handleSelectOption(item.value);
      const handleKeyPress = (event) => handlePressEnter(event, item.value, handleSelectOptionItem);
      return (
        <Option
          tabIndex={index + 3}
          key={`${item.value}-${index}`}
          selected={Boolean(selectedOptionsMap[item.value])}
          onSelect={handleSelectOptionItem}
          onKeyPress={handleKeyPress}
          style={style}
        >
          {item.value}
        </Option>
      );
    }
  };

  const selectedOptionKeys = Object.keys(selectedOptionsMap);
  const SelectedChips = () => (
    <>
      {selectedOptionKeys.map((itemName, i) => {
        if (selectedOptionKeys.length > 1) {
          return <SelectedChip key={`${itemName}-${i}`}>{itemName}</SelectedChip>;
        } else {
          return itemName;
        }
      })}
      <div ref={chipEndRef} />
    </>
  );

  return (
    <div ref={dropdownRef} className={isOpen ? 'dropdown active' : 'dropdown'}>
      <div
        tabIndex={0}
        className='dropdown-bar'
        onClick={handleClickBar}
        onKeyPress={(event) => handlePressEnter(event, null, handleClickBar)}
      >
        <div className='inner-bar'>
          <SelectedChips />
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
      <VirtualizedList
        numItems={isSelectAllShown ? options.length + 1 : options.length}
        itemHeight={itemHeight}
        listHeight={menuHeight}
        renderRow={renderRow}
      />
    </div>
  );
};

HiveDropdown.propTypes = {
  isMultiSelect: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  itemHeight: PropTypes.number,
  menuHeight: PropTypes.number,
};

HiveDropdown.defaultProps = {
  isMultiSelect: false,
  options: [],
  itemHeight: 32,
  menuHeight: 320,
  onChange: () => null,
};

export default HiveDropdown;
