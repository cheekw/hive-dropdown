import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Chip from './Chip';

const SelectedChips = forwardRef(({ itemNames }, endRef) => (
  <>
    {itemNames.map((itemName, i) => {
      if (itemNames.length > 1) {
        return <Chip key={`${itemName}-${i}`}>{itemName}</Chip>;
      } else {
        return itemName;
      }
    })}
    <div ref={endRef} />
  </>
));

SelectedChips.propTypes = {
  itemNames: PropTypes.arrayOf(PropTypes.string),
};

export default SelectedChips;
