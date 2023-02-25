import { createRoot } from 'react-dom/client';
import { Component } from 'react';
import { Pagination } from 'antd';

import Search from './components/search/search';
import FilmsContainer from './components/films-container/films-container';
import './index.css';

class App extends Component {
  state = {
    films: [],
    url: 'https://api.themoviedb.org/3/search/movie?api_key=94f42cb5addddd4b06406efe51a662ce&query=return',
  };

  componentDidMount() {
    const url = this.state.url;

    getFilms(url).then(resultSearch => {
      this.setState({ films: resultSearch });
      return resultSearch;
    });
  }

  render() {
    const { films } = this.state;
    if (!films.length) {
      const url = this.state.url;
      getFilms(url).then(resultSearch => this.setState({ films: resultSearch }));
    }

    return (
      <div className="movies-body">
        <Search />
        <FilmsContainer films={films} />
        <Pagination defaultCurrent={1} total={50} />
      </div>
    );
  }
}

const getFilms = async url => {
  return await fetch(url)
    .then(resolve => resolve.json())
    .then(result => result.results);
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
