# Hive Dropdown Demo

Frontend Hive challenge to build a dropdown in React and/or vanilla Java
This demo was built using create-react-app boilerplate.

## Pre-Req
[npm](https://www.npmjs.com/) (used 7.20.5)
[node](https://nodejs.org/en/) (used v14.17.4)

## Preview
![gif demo](demo.gif)

### 1. Setup
```bash
npm install
```

### 2. Run Demo
```bash
npm start
```

## Usage of Component
```jsx
import HiveDropdown from './components';

const options = [{value: 'option1', value: 'option2', value: 'option3'}];

...

// In render function
<HiveDropdown showsSelectAll={true} showsClearSelection={true}isMultiSelect={true} options={options} onChange={(data) => console.log(data)} />
```

## Component Props
| Prop | Type | Description | 
| :---: | :---: | :---: | 
| showsSelectAll | boolean | ability to have a select-all items button. Only works when 'isMultiSelect' prop is also true. | 
| isMultiSelect | boolean | ability to select multiple items. | 
| showsClearSelection | boolean | ability to have a clear selection button at the right side of the dropdown (appears as an x icon). | 
| options | Array\<Object\> | The items displayed as selectable options in the dropdown. Each item in the array atleast have {value: \<String\>}. Values should be unique. |
| onChange | function | callback that gives data as parameter. Triggers whenever user makes a selection, clears a selection, selects all. | 

## Notes
For normal use-cases of around ~100 items dropdown, a simple list that is completely rendered items in the would suffice. But I went with the route of assuming there will be a very large list of items since that was mentioned in the challenge.

I took the approach of a virtualized list for most efficiency but they are difficult to work with due to constraints of needing very specific sizing. This also has a negative trade-off with the extensibility and readability of the code.

Current virtualized list can generate a list of 1000000+ selectable items without lag as shown in the demo.

But this would still be slow for a select-all button because the best-conceivable-time-complexity is O(n), where it has to go through n number of items and make them true. Lag is unnoticeable at 1000 items but noticeable at 10000 items when selecting all items.

Another trade-off was made to improve efficiency. Initialization of selected options is not possible (it also wasn’t listed as  component requirement). If initialization is required, it would be better to utilize an array, which could maintain ordering of selection. This trade-off was made for efficiency again. Using an object key-value map to store the selected values (no false values) instead of something like an array of booleans so that initialization, clearing, and referencing specific values is O(1). This allows speedier response from creation of the elements, clearing items, and selecting items. But this also removes ordering, so selecting items will not look as nice cause the most recently selected options can visually pop-up in any ordering.