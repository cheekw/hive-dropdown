import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './VirtualizedList.css';

const VirtualizedList = ({ numItems, itemHeight, listHeight, renderRow }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const innerHeight = numItems * itemHeight; // height of row container that gets populated with rows.

  const generateRows = () => {
    const startIndex = Math.floor(scrollTop / itemHeight); // calculate initial item to render
    const endIndex = Math.min(numItems - 1, Math.floor((scrollTop + listHeight) / itemHeight)); // calculate last item to render
    const rows = [];
    for (let index = startIndex; index <= endIndex; index++) {
      const style = {
        position: 'absolute',
        top: index * itemHeight,
        left: '0px',
        height: itemHeight,
      };
      rows.push(renderRow({ index, style }));
    }
    return rows;
  };

  // max at 0 to deal with bouncy-overscroll issue on safari
  const onScroll = ({ target }) => setScrollTop(Math.max(0, target.scrollTop));

  return (
    <div className='virtualized-list' onScroll={onScroll} style={{ height: listHeight }}>
      <div className='inner-list' style={{ height: innerHeight, maxHeight: innerHeight }}>
        {generateRows()}
      </div>
    </div>
  );
};

VirtualizedList.propTypes = {
  numItems: PropTypes.number.isRequired,
  itemHeight: PropTypes.number.isRequired,
  listHeight: PropTypes.number.isRequired,
  renderRow: PropTypes.func.isRequired,
};

export default VirtualizedList;
