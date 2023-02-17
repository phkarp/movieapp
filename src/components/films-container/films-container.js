import { Component } from 'react';

import FilmCard from '../film-card/film-card';
import './films-container.css';

export default class FilmsContainer extends Component {
  render() {
    return (
      <div className="container">
        <FilmCard />
        <FilmCard />
        <FilmCard />
        <FilmCard />
        <FilmCard />
        <FilmCard />
      </div>
    );
  }
}
