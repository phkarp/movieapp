import { Component } from 'react';
import './search.css';

export default class Search extends Component {
  render() {
    return (
      <div className="search">
        <div className="search__tab-container">
          <label className="search__tab-label">
            <input type="radio" name="tab" className="search__tab" />
            Search
          </label>
          <label className="search__tab-label">
            <input type="radio" name="tab" className="search__tab" />
            Rated
          </label>
        </div>
        <input placeholder="Type to search..." className="search__field" />
      </div>
    );
  }
}
