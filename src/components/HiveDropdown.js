import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Option from './Option';
import SelectedChip from './SelectedChip';
import VirtualizedList from './VirtualizedList';
import ChevronDown from '../assets/chevron-down.png';
import ChevronUp from '../assets/chevron-up.png';
import Clear from '../assets/clear.png';
import './HiveDropdown.css';

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
  const [selectedOptions, setSelectedOptions] = useState({});
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
    setSelectedOptions(result);
  };

  // Unselect all items
  const handleUnselectAll = () => setSelectedOptions({});

  const handleSelectOption = useCallback(
    (option) =>
      setSelectedOptions((selectedOptions) => {
        let result = {};
        if (isMultiSelect) {
          result = {
            ...selectedOptions,
            [option]: !selectedOptions[option],
          };
        } else {
          result = { [option]: !selectedOptions[option] };
        }

        if (typeof onChange == 'function') {
          onChange(result);
        }
        return result;
      }),
    [setSelectedOptions, isMultiSelect, onChange]
  );

  const renderSelectAllRow = ({ index, style }) => (
    <Option
      key={`select-all-${index}`}
      selected={false}
      value='Select All...'
      onSelect={handleSelectAll}
      style={style}
    />
  );

  const renderItemRow = ({ index, style }) => {
    const item = options[index];
    const selected = Boolean(selectedOptions[item.value]);
    return (
      <Option
        key={`${item.value}-${index}`}
        selected={selected}
        value={item.value}
        onSelect={() => handleSelectOption(item.value)}
        style={style}
      />
    );
  };

  const renderRow = ({ index, style }) => {
    if (index === 0 && showsSelectAll && isMultiSelect) {
      return renderSelectAllRow({ index, style });
    } else {
      return renderItemRow({ index, style });
    }
  };

  const selectedEntries = Object.entries(selectedOptions).filter(([_key, value]) => value);
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
      <VirtualizedList
        numItems={options.length}
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
