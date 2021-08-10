import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Option from './Option';
import DropdownTemplate from './DropdownTemplate';
import { useIsOpen, useScrollToChipEnd } from '../hooks';
import { handlePressEnter } from '../utils';
import './HiveDropdown.css';

const HiveDropdown = ({
  isMultiSelect,
  options,
  onChange,
  showsSelectAll,
  showsClearSelection,
}) => {
  const { isOpen, dropdownRef, setIsOpen } = useIsOpen();
  const { chipEndRef, setIsScrollAllowed } = useScrollToChipEnd();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOptionsMap, setSelectedOptionsMap] = useState({});
  const isSelectAllShown = showsSelectAll && isMultiSelect;

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
    setIsScrollAllowed(true);
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
          setIsScrollAllowed(false);
        } else {
          result.push(option);
          setIsScrollAllowed(true);
        }
      } else {
        result = [option];
      }
      return result;
    });
  };

  const SelectAllRow = ({ index, style }) => {
    const handleKeyPress = (event) => handlePressEnter(event, null, handleSelectAll);
    return (
      <Option
        tabIndex={1}
        style={style}
        key={`select-all-${index}`}
        selected={false}
        onSelect={handleSelectAll}
        onKeyPress={handleKeyPress}
      >
        Select All...
      </Option>
    );
  };

  const ItemRow = ({ index, style }) => {
    const item = options[index];
    const selected = Boolean(selectedOptionsMap[item.value]);
    const handleKeyPress = (event) => handlePressEnter(event, item.value, handleSelectOption);
    return (
      <Option
        tabIndex={index + 3}
        style={style}
        selected={selected}
        onSelect={() => handleSelectOption(item.value)}
        onKeyPress={handleKeyPress}
      >
        {item.value}
      </Option>
    );
  };

  const menuList = (
    <div className='list'>
      {isSelectAllShown && <SelectAllRow key={-1} index={-1} />}
      {options.map((item, index) => (
        <ItemRow key={`${item.value}-${index}`} index={index} />
      ))}
    </div>
  );

  return (
    <DropdownTemplate
      ref={{ dropdownRef: dropdownRef, chipEndRef: chipEndRef }}
      isOpen={isOpen}
      showsClearSelection={showsClearSelection}
      handleUnselectAll={handleUnselectAll}
      selectedOptions={selectedOptions}
      handleClickBar={handleClickBar}
      menuList={menuList}
    />
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
