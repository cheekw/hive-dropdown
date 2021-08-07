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
  const [selectedOptionsMap, setSelectedOptionsMap] = useState({});
  const isSelectAllShown = showsSelectAll && isMultiSelect;
  const dropdownRef = useRef(null);

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

  // For the Dropdown top bar
  const handleClickBar = () => setIsOpen((isOpen) => !isOpen);

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
            delete result[option];
          } else {
            result[option] = true;
          }
        } else {
          if (selectedOptionsMap[option] === true) {
            delete result[option];
          } else {
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
      return (
        <Option
          key={index}
          selected={false}
          value='Select All...'
          onSelect={handleSelectAll}
          style={style}
        />
      );
    } else {
      const item = options[itemIndex];
      const handleSelectOptionItem = () => handleSelectOption(item.value);
      return (
        <Option
          key={`${item.value}-${index}`}
          selected={Boolean(selectedOptionsMap[item.value])}
          value={item.value}
          onSelect={handleSelectOptionItem}
          style={style}
        />
      );
    }
  };

  const selectedEntries = Object.entries(selectedOptionsMap).filter(([_key, value]) => value);
  const selectedChips = selectedEntries.map(([itemName], i) => {
    if (selectedEntries.length > 1) {
      return <SelectedChip key={`${itemName}-${i}`} value={itemName} />;
    } else {
      return itemName;
    }
  });

  return (
    <div ref={dropdownRef} className={isOpen ? 'dropdown active' : 'dropdown'}>
      <div className='dropdown-bar' onClick={handleClickBar}>
        <div className='inner-bar'>{selectedChips}</div>
        <div>
          {showsClearSelection && (
            <img
              className='clear-icon'
              src={Clear}
              alt='Clear all icon'
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
      {
        <VirtualizedList
          numItems={isSelectAllShown ? options.length + 1 : options.length}
          itemHeight={itemHeight}
          listHeight={menuHeight}
          renderRow={renderRow}
        />
      }
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
