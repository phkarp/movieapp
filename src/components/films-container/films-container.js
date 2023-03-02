import { Component } from 'react';

import FilmCard from '../film-card/film-card';
import './films-container.css';

export default class FilmsContainer extends Component {
  static defaultProps = {
    films: [],
  };

  render() {
    const { films, onChangeRate, ratedFilms } = this.props;

    const filmCard = films
      .slice()
      .map((film, i) => <FilmCard film={film} key={'key' + i} onChangeRate={onChangeRate} ratedFilms={ratedFilms} />);

    return <div className="container">{filmCard}</div>;
  }
}
