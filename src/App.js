import './App.css';
import HiveDropdown from './components/HiveDropdown';
import HiveOptimizedDropdown from './components/HiveOptimizedDropdown';

const createOptions = (num) =>
  [...Array(num).keys()].map((i) => ({
    value: 'option ' + i,
    selected: i % 2 === 0,
  }));

const demoOptionsBig = createOptions(1000000);
const demoOptionsSmall = createOptions(1000);

function App() {
  return (
    <div className='App'>
      <span className='title'>Demo of Hive Dropdown</span>
      <div className='container'>
        <div className='dropdown-container'>
          <div className='category'>OptimizedSingle Select {demoOptionsBig.length} items</div>
          <HiveOptimizedDropdown
            options={demoOptionsBig}
            // onChange={(data) => console.log('single select output: ' + JSON.stringify(data))}
          />
        </div>
      </div>
      <div className='container'>
        <div className='dropdown-container'>
          <div className='category'>Optimized Multi Select {demoOptionsBig.length} items</div>
          <HiveOptimizedDropdown
            isMultiSelect={true}
            options={demoOptionsBig}
            onChange={(data) => console.log('multi select output: ' + JSON.stringify(data))}
          />
        </div>
      </div>
      <div className='container'>
        <div className='dropdown-container'>
          <div className='category'>
            Optimized Multi Select/Unselect All {demoOptionsSmall.length} items
          </div>
          <HiveOptimizedDropdown
            showsSelectAll
            showsClearSelection
            isMultiSelect={true}
            options={demoOptionsSmall}
            onChange={(data) => console.log('multi select output: ' + JSON.stringify(data))}
          />
        </div>
      </div>

      <div className='container'>
        <div className='dropdown-container'>
          <div className='category'>
            Unoptimized Multi Select/Unselect All {demoOptionsSmall.length} items
          </div>
          <HiveDropdown
            isMultiSelect
            showsSelectAll
            showsClearSelection
            options={demoOptionsSmall}
            // onChange={(data) => console.log('multi select output: ' + JSON.stringify(data))}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
