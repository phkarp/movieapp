import { Component } from 'react';
import { Input, Pagination } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import { debounce } from 'lodash';

import './search.css';
import FilmsContainer from '../films-container/films-container';
import MessageError from '../message-error/message-error';
import Loader from '../loader/loader';
import MovieService from '../../services/movie-service';

export default class Search extends Component {
  movieService = new MovieService();

  state = {
    films: null,
    loading: true,
    url: null,
    pages: 1,
    currentPage: 1,
    query: 'return',
    apiKey: '94f42cb5addddd4b06406efe51a662ce',
    ratedFilms: null,
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
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${value}&page=1`;
    this.setState({ loading: true, query: value, url: url });
  }, 400);

  onChangeInput = e => {
    let value = e.target.value.trim();
    if (value === '') {
      value = 'return';
    }

    this.debouncedSearch(value);
  };

  async getArrRatedFilms(data, guestSessionId) {
    let arrRated = [];

    for (let i = data.currentPage; i <= data.pages; i++) {
      const item = await this.movieService.getRatedFilm(guestSessionId, i);
      item.films.forEach(film => arrRated.push({ id: film.id, rating: film.rating }));
    }

    return arrRated;
  }

  componentDidMount() {
    const { query, currentPage } = this.state;

    const { guestSession } = this.props;

    // this.movieService.test(query, currentPage).then(result => console.log(result));

    this.movieService
      .getMovies(query, currentPage)
      .then(newState => this.setState(newState))
      .catch(this.onError);

    this.movieService
      .getRatedFilm(guestSession, this.state.currentPage)
      .then(newState => {
        return this.getArrRatedFilms(newState, guestSession);
      })
      .then(ratedFilms => this.setState({ ratedFilms: ratedFilms }))
      .catch(this.onError);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.url !== prevState.url) {
      const { query, currentPage } = this.state;

      this.movieService
        .getMovies(query, currentPage)
        .then(newState => this.setState(newState))
        .catch(this.onError);
    }
  }

  onChangeRate = (id, value) => {
    const { guestSession } = this.state;
    if (!+value) {
      this.movieService.deleteRated(id, guestSession).then(answer => console.log('delete answer', answer));
      this.setState(({ ratedFilms }) => {
        const idx = ratedFilms.findIndex(el => el.id === id);

        return {
          todoData: [...ratedFilms.slice(0, idx), ...ratedFilms.slice(idx + 1)],
        };
      });
      return;
    }
    this.movieService.postRateFilm(id, value).then(answer => console.log('post answer', answer));

    this.setState(({ ratedFilms }) => {
      const idx = ratedFilms.findIndex(el => el.id === id);
      const newItem = {
        ...ratedFilms[idx],
        value: value,
      };

      const result = [...ratedFilms.slice(0, idx), newItem, ...ratedFilms.slice(idx + 1)];

      return { ratedFilms: result };
    });
  };

  render() {
    const { films, loading, error, errorDescription, currentPage, pages, onClickTabs, ratedFilms } = this.state;
    if (!films) {
      return <Loader />;
    }
    if (!ratedFilms) {
      return <Loader />;
    }

    const messageOffline = { name: 'Not networks', message: 'Проверьте свое интернет соединение' };
    const errorMessage = error ? <MessageError errorDescription={errorDescription} /> : null;

    const hasData = !((loading && films.length) || error);

    const loader = loading ? <Loader /> : null;
    const content = hasData ? (
      <FilmsContainer films={films} onChangeRate={this.onChangeRate} onClick={onClickTabs} ratedFilms={ratedFilms} />
    ) : null;
    const notFound = !films.length ? <span className={'not-found'}>Не найдено фильмов с таким названием</span> : null;

    const pagination = hasData ? (
      <Pagination
        defaultCurrent={currentPage}
        total={pages * 20}
        defaultPageSize={20}
        showSizeChanger={false}
        onChange={this.onChangePage}
        hideOnSinglePage={true}
      />
    ) : null;

    return (
      <div className="movies-body">
        <div className="search">
          <Input
            placeholder="Type to search..."
            className="search__field"
            size={'large'}
            onChange={this.onChangeInput}
          />
        </div>
        <Offline>
          <MessageError errorDescription={messageOffline} />
        </Offline>
        <Online>
          {notFound}
          {errorMessage}
          {loader}
          {content}
          {pagination}
        </Online>
      </div>
    );
  }
}
