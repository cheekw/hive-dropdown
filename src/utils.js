export const handlePressEnter = (event, params, func) => {
  if (event.key === 'Enter') {
    func(params);
  }
};
