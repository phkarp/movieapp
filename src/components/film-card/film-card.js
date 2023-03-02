import { Rate, Space, Tag } from 'antd';
import { format } from 'date-fns';
import { Component, Fragment } from 'react';

import './film-card.css';
import { GenresConsumer } from '../movie-service-context/movie-service-context';
import Loader from '../loader/loader';

export default class FilmCard extends Component {
  cutText(str, maxLength) {
    let newStr = str.slice();
    if (newStr.length > maxLength) {
      const newLength = newStr.lastIndexOf(' ', maxLength - 3);
      newStr = `${str.slice(0, newLength)}...`;
    }
    return newStr;
  }

  render() {
    const { onChangeRate, ratedFilms } = this.props;

    let {
      overview: description,
      poster_path: imageUrl,
      genre_ids: genreIds,
      release_date: releaseDate,
      title,
      id,
      vote_average: averageRating,
      rating,
    } = this.props.film;

    if (releaseDate) {
      releaseDate = format(new Date(releaseDate), 'MMMM d, u');
    } else {
      releaseDate = `дата релиза неизвестна`;
    }

    if (imageUrl) {
      imageUrl = `https://image.tmdb.org/t/p/w200${imageUrl}`;
    } else {
      imageUrl = `https://i.postimg.cc/Z5qQpwWG/no-photo.png`;
    }

    let lengthDescription = 140;
    if (title.length < 15) {
      lengthDescription = 180;
    }
    if (title.length > 30) {
      lengthDescription = 100;
      title = this.cutText(title, 30);
    }
    if (title.length > 40) {
      lengthDescription = 80;
      title = this.cutText(title, 40);
    }
    description = this.cutText(description, lengthDescription);
    // console.log(film);
    return (
      <article className="film-card">
        <GenresConsumer>
          {appState => {
            return (
              <BodyCard
                imageUrl={imageUrl}
                title={title}
                releaseDate={releaseDate}
                description={description}
                appState={appState}
                genreIds={genreIds}
                averageRating={averageRating}
                onChangeRate={value => {
                  return onChangeRate(id, value);
                }}
                rating={rating}
                id={id}
                ratedFilms={ratedFilms}
              />
            );
          }}
        </GenresConsumer>
      </article>
    );
  }
}

const BodyCard = ({
  imageUrl,
  title,
  releaseDate,
  description,
  appState,
  genreIds,
  onChangeRate,
  averageRating,
  rating,
  id,
  ratedFilms,
}) => {
  const { genres } = appState;

  if (!genres) {
    return <Loader />;
  }

  let ratingFilm = 0;
  if (ratedFilms) {
    const idxElem = ratedFilms.findIndex(el => el.id === id);
    if (idxElem !== -1) {
      ratingFilm = ratedFilms[idxElem].rating;
    }
  }
  ratingFilm = rating ? rating : ratingFilm;
  // console.log(ratedFilm.findIndex(el => el.id === id));
  // console.log(id);
  // console.log(ratedFilm);

  const genresNames = genres.filter(genre => genreIds.includes(genre.id));
  const tagsGenres = genresNames.map(genre => {
    return <Tag key={genre.id}>{genre.name}</Tag>;
  });

  let color;
  if (averageRating > 7) color = '#66E900';
  if (averageRating <= 7) color = '#E9D100';
  if (averageRating <= 5) color = '#E97E00';
  if (averageRating <= 3) color = '#E90000';

  return (
    <Fragment>
      <div className="film-card__poster">
        <img src={imageUrl} alt="" width={200} />
      </div>
      <div className="film-card__body">
        <div className="film-card__head">
          <div className="film-card__head-left">
            <h1 className="film-card__h1">{title}</h1>
            <p className="film-card__data">{releaseDate}</p>
            <Space size={[0, 8]} wrap>
              {tagsGenres}
            </Space>
          </div>
          <div className="film-card__rating" style={{ borderColor: color }}>
            {averageRating.toFixed(1)}
          </div>
        </div>
        <div className="film-card__foot">
          <p className="film-card__description">{description}</p>
          <Rate allowHalf defaultValue={ratingFilm} count={10} onChange={onChangeRate} />
        </div>
      </div>
    </Fragment>
  );
};
