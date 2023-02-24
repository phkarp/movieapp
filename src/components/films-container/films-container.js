import { Component } from 'react';

import FilmCard from '../film-card/film-card';
import './films-container.css';

export default class FilmsContainer extends Component {
  static defaultProps = {
    films: [],
  };

  render() {
    const { films } = this.props;

    const filmCard = films
      .slice()
      .filter((film, i) => {
        return i < 6;
      })
      .map((film, i) => <FilmCard film={film} key={'key' + i} />);

    return <div className="container">{filmCard}</div>;
  }
}
