import { Component } from 'react';
import { Input } from 'antd';

import './search.css';

export default class Search extends Component {
  onChangeInput = e => {
    const value = e.target.value.trim();
    if (value !== '') {
      this.props.onChangeInput(value);
    } else {
      this.props.onChangeInput('return');
    }
  };

  render() {
    return (
      <div className="search">
        <div className="search__tab-container">
          <label className="search__tab-label">
            <input type="radio" name="tab" className="search__tab" defaultChecked="checked" />
            Search
          </label>
          <label className="search__tab-label">
            <input type="radio" name="tab" className="search__tab" />
            Rated
          </label>
        </div>
        <Input placeholder="Type to search..." className="search__field" size={'large'} onChange={this.onChangeInput} />
      </div>
    );
  }
}
