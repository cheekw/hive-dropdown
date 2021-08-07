const { Component } = React
const { render, findDOMNode } = ReactDOM

class Table extends Component {
  constructor(props) {
    // Initial props:
    super(props)

    // Initial state:
    this.state = {
      columns: Object.keys(this.props.rows[0]),
      tableHeight: (this.props.rowHeight * this.props.rows.length),
      scroll: {
        top: 0,
        index: 0,
        end: Math.ceil((this.props.tableHeight * 2) / this.props.rowHeight)
      }
    }

    // Event handlers:
    this.onScroll = this.onScroll.bind(this)
    this.scrollInterval = null
  }

  onScroll({ target }) {
    let state = this.state;

    let scrollTop = target.scrollTop
    let rowHeight = this.props.rowHeight
    let tableHeight = this.props.tableHeight
    let index = Math.floor(scrollTop / rowHeight)

    state.scroll.index = index
    state.scroll.end = index + Math.ceil((tableHeight * 2) / rowHeight)
    state.scroll.top = (scrollTop / rowHeight) * rowHeight

    this.setState(state);
  }

  generateRows() {
    let columns = this.state.columns
    let rowHeight = this.props.rowHeight
    let rows = this.props.rows
    let index = this.state.scroll.index
    let end = this.state.scroll.end
    let items = []

    do {
      if (index >= rows.length) {
        index = rows.length
        break
      }

      const rowAttrs = {
        style: {
          position: "absolute",
          top: (index * rowHeight),
          left: 0,
          height: rowHeight,
          lineHeight: `${rowHeight}px`
        },
        className: `tr ${(index % 2) === 0 ? 'tr-odd' : 'tr-even'}`
      }

      items.push(
        <tr {...rowAttrs} key={index}>
          {columns.map((column, i) =>
            <td key={i}>
              {rows[index][column]}
            </td>
          )}
        </tr>
      )

      index++
    } while (index < end)

      return items
  }

  render() {
    const tableHeight = (this.props.tableHeight > this.state.tableHeight)
    ? this.state.tableHeight + 2
    : this.props.tableHeight

    const tableAttrs = {
      className: 'table-content',
      style: { height: tableHeight },
      onScroll: this.onScroll
    }

    const tbodyAttr = {
      style: {
        position: "relative",
        display: 'inline-block',
        height: this.state.tableHeight,
        maxHeight: this.state.tableHeight,
        width: "100%"
      }
    }
    return (
      <div className={"wrapper"}>
        <table>
          <thead>
            <tr className={'tr'}>
              {this.state.columns.map((name, i) =>
                <th key={i}>{name}</th>
              )}
            </tr>
          </thead>
        </table>
        <table {...tableAttrs}>
          <tbody {...tbodyAttr}>
            {this.generateRows()}
          </tbody>
        </table>
      </div>
    )
  }
}

Table.defaultProps = {
  rowHeight: 35,
  tableHeight: 200
}

Table.propTypes = {
  rowHeight: PropTypes.number.isRequired,
  tableHeight: PropTypes.number.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired
}

const people = new Array(100000).fill(true).map((val, id) => ({
  id: id,
  firstName: Math.random().toString(20).substring(8),
  lastName: Math.random().toString(20).substring(8),
  age: Math.ceil(Math.random() * 80)
}))

// Render your table
render(
  <div>
    <h1>Records: {people.length}</h1>
    <Table rows={people} />
  </div>
, document.getElementById("app"))