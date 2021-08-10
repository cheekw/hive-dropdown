import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Option from './Option';
import VirtualizedList from './VirtualizedList';
import DropdownTemplate from './DropdownTemplate';
import { useIsOpen, useScrollToChipEnd } from '../hooks';
import { handlePressEnter } from '../utils';
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
  const { isOpen, dropdownRef, setIsOpen } = useIsOpen();
  const [selectedOptionsMap, setSelectedOptionsMap] = useState({});
  const { chipEndRef, setIsScrollAllowed } = useScrollToChipEnd(selectedOptionsMap);
  const isSelectAllShown = showsSelectAll && isMultiSelect; // if select-all option can be shown

  // For the dropdown top bar
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
    setIsScrollAllowed(true);
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
            setIsScrollAllowed(false);
          } else {
            // add
            result[option] = true;
            setIsScrollAllowed(typeof option == 'string');
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
    [setSelectedOptionsMap, isMultiSelect, onChange, setIsScrollAllowed]
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

  const selectedOptions = Object.keys(selectedOptionsMap);
  const menuList = (
    <VirtualizedList
      numItems={isSelectAllShown ? options.length + 1 : options.length}
      itemHeight={itemHeight}
      listHeight={menuHeight}
      renderRow={renderRow}
    />
  );

  return (
    <DropdownTemplate
      ref={{ dropdownRef: dropdownRef, chipEndRef: chipEndRef }}
      isOpen={isOpen}
      showsClearSelection={showsClearSelection}
      selectedOptions={selectedOptions}
      selectedOptionsMap={selectedOptionsMap}
      handleClickBar={handleClickBar}
      handleUnselectAll={handleUnselectAll}
      menuList={menuList}
    />
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
