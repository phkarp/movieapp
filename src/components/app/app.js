import { Tabs } from 'antd';
import { Component } from 'react';

import Search from '../search/search';
import RatedMovies from '../rated-movies/rated-movies';
import MovieService from '../../services/movie-service';
import './app.css';
import Loader from '../loader/loader';
import { GenresProvider } from '../movie-service-context/movie-service-context';

export default class App extends Component {
  movieService = new MovieService();

  state = {
    guestSession: null,
    genres: null,
    currentPage: 1,
    // ratedFilms: null,
  };

  // async getArrRatedFilms(data, guestSessionId) {
  //   let arrRated = [];
  //
  //   for (let i = data.currentPage; i <= data.pages; i++) {
  //     const item = await this.movieService.getRatedFilm(guestSessionId, i);
  //     item.films.forEach(film => arrRated.push({ id: film.id, rating: film.rating }));
  //   }
  //
  //   return arrRated;
  // }

  componentDidMount() {
    this.movieService
      .getGenres()
      .then(genres => this.setState({ genres: genres.genres }))
      .catch(this.onError);

    this.movieService
      .createGuessSession()
      .then(guestSession => this.setState({ guestSession: guestSession['guest_session_id'] }))
      .catch(this.onError);

    // this.movieService
    //   .getRatedFilm(guestSessionId, this.state.currentPage)
    //   .then(newState => {
    //     return this.getArrRatedFilms(newState, guestSessionId);
    //   })
    //   .then(ratedFilms => this.setState({ ratedFilms: ratedFilms }))
    //   .catch(this.onError);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // if (this.state.ratedFilms !== prevState.ratedFilms) {
    //   const { guestSessionId } = this.state;
    //
    //   this.movieService
    //     .getRatedFilm(guestSessionId, this.state.currentPage)
    //     .then(newState => {
    //       return this.getArrRatedFilms(newState, guestSessionId);
    //     })
    //     .then(ratedFilms => this.setState({ ratedFilms: ratedFilms }))
    //     .catch(this.onError);
    // }
  }

  onError = err => {
    this.setState({ error: true, loading: false, errorDescription: err });
  };

  render() {
    const { guestSession } = this.state;

    localStorage.setItem('guestSession', guestSession);

    if (!guestSession) {
      return <Loader />;
    }

    const items = [
      {
        key: '1',
        label: 'Search',
        children: <Search />,
      },
      {
        key: '2',
        label: 'Rated',
        children: <RatedMovies />,
      },
    ];

    return (
      <div className="app">
        <GenresProvider value={this.state}>
          <Tabs defaultActiveKey="1" items={items} centered={true} size={'large'} destroyInactiveTabPane={true} />
        </GenresProvider>
      </div>
    );
  }
}
