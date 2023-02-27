import { createRoot } from 'react-dom/client';
import { Component } from 'react';
import { Pagination } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import { debounce } from 'lodash';

import './index.css';
import FilmsContainer from './components/films-container/films-container';
import MessageError from './components/message-error/message-error';
import Loading from './components/loading/loading';
import Search from './components/search/search';

class App extends Component {
  state = {
    films: null,
    loading: true,
    url: null,
    pages: 1,
    currentPage: 1,
    query: 'return',
    apiKey: '94f42cb5addddd4b06406efe51a662ce',
  };

  onError = err => {
    this.setState({ error: true, loading: false, errorDescription: err });
  };

  onChangePage = currentPage => {
    this.setState(state => {
      return {
        currentPage,
        loading: true,
        url: `https://api.themoviedb.org/3/search/movie?api_key=${state.apiKey}&query=${state.query}&page=${currentPage}`,
      };
    });
  };

  debouncedSearch = debounce(value => {
    const { apiKey } = this.state;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${value}&page=${1}`;
    this.setState({ loading: true, query: value, url: url });
  }, 300);

  onChangeInput = value => {
    this.debouncedSearch(value);
  };

  componentDidMount() {
    const { apiKey, query, currentPage } = this.state;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${currentPage}`;

    getFilms(url)
      .then(resultSearch => {
        const films = resultSearch.results;
        const pages = resultSearch['total_pages'];

        const currentPage = resultSearch.page;

        this.setState({ films, loading: false, error: false, pages, currentPage });

        return films;
      })
      .catch(this.onError);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.url !== prevState.url) {
      const { apiKey, query, currentPage } = this.state;
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${currentPage}`;

      getFilms(url)
        .then(resultSearch => {
          const films = resultSearch.results;
          const pages = resultSearch['total_pages'];

          const currentPage = resultSearch.page;

          this.setState({ films, loading: false, error: false, pages, currentPage });

          return films;
        })
        .catch(this.onError);
    }
  }

  render() {
    const { films, loading, error, errorDescription, currentPage, pages } = this.state;
    if (!films) {
      return <Loading />;
    }

    const messageOffline = { name: 'Not networks', message: 'Проверьте свое интернет соединение' };
    const errorMessage = error ? <MessageError errorDescription={errorDescription} /> : null;

    const hasData = !((loading && films.length) || error);

    const loader = loading ? <Loading /> : null;
    const content = hasData ? <FilmsContainer films={films} /> : null;
    const notFound = !films.length ? <span className={'not-found'}>Не найдено фильмов с таким названием</span> : null;

    return (
      <div className="movies-body">
        <Search onChangeInput={this.onChangeInput} />
        <Offline>
          <MessageError errorDescription={messageOffline} />
        </Offline>
        <Online>
          {notFound}
          {errorMessage}
          {loader}
          {content}
        </Online>
        <Pagination
          defaultCurrent={currentPage}
          total={pages * 20}
          defaultPageSize={20}
          showSizeChanger={false}
          onChange={this.onChangePage}
          hideOnSinglePage={true}
        />
      </div>
    );
  }
}

const getFilms = async url => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, received ${res.status}`);
  }
  return await res.json();
};

const root = createRoot(document.getElementById('root'));

root.render(<App />);
