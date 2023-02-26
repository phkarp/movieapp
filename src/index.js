import { createRoot } from 'react-dom/client';
import { Component } from 'react';
import { Pagination } from 'antd';
import { Offline, Online } from 'react-detect-offline';

import Search from './components/search/search';
import FilmsContainer from './components/films-container/films-container';
import './index.css';
import MessageError from './components/message-error/message-error';
import Loading from './components/loading/loading';

class App extends Component {
  state = {
    films: [],
    loading: true,
    url: 'https://api.themoviedb.org/3/search/movie?api_key=94f42cb5addddd4b06406efe51a662ce&query=return',
  };

  onError = err => {
    this.setState({ error: true, loading: false, errorDescription: err });
  };

  componentDidMount() {
    const url = this.state.url;

    getFilms(url)
      .then(resultSearch => {
        this.setState({ films: resultSearch, loading: false, error: false });
        return resultSearch;
      })
      .catch(this.onError);
  }

  render() {
    const { films, loading, error, errorDescription } = this.state;
    const messageOffline = { name: 'Not networks', message: 'Проверьте свое интернет соединение' };
    const errorMessage = error ? <MessageError errorDescription={errorDescription} /> : null;
    const hasData = !(loading || error);

    const spinner = loading ? <Loading /> : null;
    const content = hasData ? <FilmsContainer films={films} /> : null;

    return (
      <div className="movies-body">
        <Search />
        <Offline>
          <MessageError errorDescription={messageOffline} />
        </Offline>
        <Online>
          {errorMessage}
          {spinner}
          {content}
        </Online>
        <Pagination defaultCurrent={1} total={50} />
      </div>
    );
  }
}

const getFilms = async url => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, received ${res.status}`);
  }
  const body = await res.json();

  return await body.results;
};

const root = createRoot(document.getElementById('root'));

root.render(<App />);
