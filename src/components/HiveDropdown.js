import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Option from './Option';
import SelectedChip from './SelectedChip';
import ChevronDown from '../assets/chevron-down.png';
import ChevronUp from '../assets/chevron-up.png';
import Clear from '../assets/clear.png';
import './HiveDropdown.css';

const HiveDropdown = ({
  isMultiSelect,
  options,
  onChange,
  showsSelectAll,
  showsClearSelection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wasOptionAdded, setWasOptionAdded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOptionsMap, setSelectedOptionsMap] = useState({});
  const isSelectAllShown = showsSelectAll && isMultiSelect;
  const dropdownRef = useRef(null);
  const chipEndRef = useRef(null);

  useEffect(() => {
    // initializes selectedOptions
    const selectedArray = [];
    const selectedMap = {};
    for (let i = 0; i < options.length; i++) {
      const currItem = options[i];
      if (currItem.selected) {
        selectedMap[currItem.value] = true;
        selectedArray.push(currItem.value);
      }
    }
    setSelectedOptions(selectedArray);
    setSelectedOptionsMap(selectedMap);
  }, [options]);

  useEffect(() => {
    // Effect when clicking outside of dropdown to close menu
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
    const selectedMap = {};
    const selectedArray = [];
    for (let i = 0; i < options.length; i++) {
      const currItem = options[i];
      selectedMap[currItem.value] = true;
      selectedArray.push(currItem.value);
    }
    setSelectedOptions(selectedArray);
    setSelectedOptionsMap(selectedMap);
    setWasOptionAdded(true);
    if (typeof onChange == 'function') {
      onChange(selectedMap);
    }
  };

  // Unselect all items
  const handleUnselectAll = () => {
    if (typeof onChange == 'function') {
      onChange({});
    }
    setSelectedOptionsMap({});
    setSelectedOptions([]);
  };

  const handleSelectOption = (option) => {
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
    setSelectedOptions((selectedOptions) => {
      let result = [];
      if (isMultiSelect) {
        result = [...selectedOptions];
        if (selectedOptionsMap[option] === true) {
          const indexOfOption = result.indexOf(option);
          result.splice(indexOfOption, 1);
          setWasOptionAdded(false);
        } else {
          result.push(option);
          setWasOptionAdded(true);
        }
      } else {
        result = [option];
      }
      return result;
    });
  };

  useEffect(() => {
    // Effect to scroll to end of chip
    if (wasOptionAdded) {
      chipEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [selectedOptions, wasOptionAdded]);

  const SelectAllRow = ({ index, style }) => (
    <Option style={style} key={`select-all-${index}`} selected={false} onSelect={handleSelectAll}>
      Select All...
    </Option>
  );

  const ItemRow = ({ index, style }) => {
    const item = options[index];
    const selected = Boolean(selectedOptionsMap[item.value]);
    return (
      <Option style={style} selected={selected} onSelect={() => handleSelectOption(item.value)}>
        {item.value}
      </Option>
    );
  };

  const SelectedChips = () => (
    <>
      {selectedOptions.map((itemName, i) => {
        if (selectedOptions.length > 1) {
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
      <div className='dropdown-bar' onClick={handleClickBar}>
    <div className='inner-bar'>
          <SelectedChips />
        </div>
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
      <div className='list'>
        {isSelectAllShown && <SelectAllRow key={-1} index={-1} />}
        {options.map((item, index) => (
          <ItemRow key={`${item.value}-${index}`} index={index} />
        ))}
      </div>
    </div>
  );
};

HiveDropdown.propTypes = {
  isMultiSelect: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
};

HiveDropdown.defaultProps = {
  isMultiSelect: false,
  options: [],
  onChange: () => null,
};

export default HiveDropdown;
