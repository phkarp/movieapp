import { Component } from 'react';
import { Pagination } from 'antd';
import { Offline, Online } from 'react-detect-offline';

import Loader from '../loader/loader';
import MessageError from '../message-error/message-error';
import FilmsContainer from '../films-container/films-container';
import MovieService from '../../services/movie-service';

export default class RatedMovies extends Component {
  movieService = new MovieService();

  state = {
    films: null,
    loading: true,
    url: null,
    pages: 1,
    currentPage: 1,
    query: 'return',
    apiKey: '94f42cb5addddd4b06406efe51a662ce',
  };

  componentDidMount() {
    const { currentPage } = this.state;

    const { guestSession } = this.props;
    this.movieService
      .getRatedFilm(guestSession, currentPage)
      .then(newState => this.setState(newState))
      .catch(this.onError);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.url !== prevState.url) {
      const { guestSession, currentPage } = this.state;

      this.movieService
        .getRatedFilm(guestSession, currentPage)
        .then(newState => this.setState(newState))
        .catch(this.onError);
    }

    if (this.state.loading !== prevState.loading) {
      const { guestSession, currentPage } = this.state;

      this.movieService
        .getRatedFilm(guestSession, currentPage)
        .then(newState => this.setState(newState))
        .catch(this.onError);
    }
  }

  onError = err => {
    this.setState({ error: true, loading: false, errorDescription: err });
  };

  onChangePage = currentPage => {
    const { guestSession } = this.props;

    this.setState({
      currentPage,
      loading: true,
      url: `https://api.themoviedb.org/3/guest_session/${guestSession}/rated/movies?api_key=${this._apiKey}&page=${currentPage}`,
    });
  };

  onChangeRate = (id, value) => {
    const { guestSession } = this.state;

    if (!+value) {
      this.setState({ loading: true });
      this.movieService.deleteRated(id, guestSession).then(result => {
        return result;
      });
      return;
    }

    this.movieService.postRateFilm(id, value, guestSession).catch(this.onError);
  };

  render() {
    const { films, loading, error, errorDescription, currentPage, pages } = this.state;

    if (!films) {
      return <Loader />;
    }

    // console.log('rated', films);

    const messageOffline = { name: 'Not networks', message: 'Проверьте свое интернет соединение' };
    const errorMessage = error ? <MessageError errorDescription={errorDescription} /> : null;

    const hasData = !((loading && films.length) || error);

    const loader = loading ? <Loader /> : null;
    const content = hasData ? <FilmsContainer films={films} onChangeRate={this.onChangeRate} /> : null;
    const notFound = !films.length ? <span className={'not-found'}>Вы ещё не оценили ни одного фильма</span> : null;

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
