import './App.css';
import HiveDropdown from './components/HiveDropdown';

const createOptions = (num) =>
  [...Array(num).keys()].map((i) => ({
    value: 'option ' + i,
    selected: false,
  }));

const demoOptions = createOptions(1000000);
const demoOptionsSelectAll = createOptions(1000);

function App() {
  return (
    <div className='App'>
      <span className='title'>Demo of Hive Dropdown</span>
      <div className='container'>
        <div className='dropdown-container'>
          <div className='category'>Single Select {demoOptions.length} items</div>
          <HiveDropdown
            options={demoOptions}
            // onChange={(data) => console.log('single select output: ' + JSON.stringify(data))}
          />
        </div>
      </div>
      <div className='container'>
        <div className='dropdown-container'>
          <div className='category'>Multi Select {demoOptions.length} items</div>
          <HiveDropdown
            isMultiSelect={true}
            options={demoOptions}
            // onChange={(data) => console.log('multi select output: ' + JSON.stringify(data))}
          />
        </div>
      </div>
      <div className='container'>
        <div className='dropdown-container'>
          <div className='category'>Multi Select/Unselect All {demoOptionsSelectAll.length} items</div>
          <HiveDropdown
            showsSelectAll
            showsClearSelection
            isMultiSelect={true}
            options={demoOptionsSelectAll}
            // onChange={(data) => console.log('multi select output: ' + JSON.stringify(data))}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
