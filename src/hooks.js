import { useState, useEffect, useRef } from 'react';

export const useIsOpen = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  return {
    isOpen,
    setIsOpen,
    dropdownRef,
  };
};

export const useScrollToChipEnd = (selectedOptionsMap) => {
  const chipEndRef = useRef(null);
  const [isScrollAllowed, setIsScrollAllowed] = useState(false);

  useEffect(() => {
    // Effect to scroll to end of chip
    if (isScrollAllowed) {
      chipEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [selectedOptionsMap, isScrollAllowed]);

  return { chipEndRef, isScrollAllowed, setIsScrollAllowed };
};
