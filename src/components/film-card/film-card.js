import { Rate, Space, Tag } from 'antd';
import { format } from 'date-fns';
import { Component, Fragment } from 'react';

import './film-card.css';

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
    const { film } = this.props;
    const { overview, poster_path } = film;

    let releaseDate = film['release_date'];
    if (releaseDate) {
      releaseDate = format(new Date(releaseDate), 'MMMM d, u');
    } else {
      releaseDate = `дата релиза неизвестна`;
    }

    let imageUrl = poster_path;
    if (poster_path) {
      imageUrl = `https://image.tmdb.org/t/p/original${imageUrl}`;
    } else {
      imageUrl = `https://i.postimg.cc/Z5qQpwWG/no-photo.png`;
    }

    let description = overview;
    let title = film.title;
    let lengthDescription = 170;
    if (title.length < 15) {
      lengthDescription = 220;
    }
    if (title.length > 30) {
      lengthDescription = 130;
    }
    if (title.length > 50) {
      lengthDescription = 100;
      title = this.cutText(title, 50);
    }
    description = this.cutText(description, lengthDescription);

    // console.log(film);
    return (
      <article className="film-card">
        <BodyCard imageUrl={imageUrl} title={title} releaseDate={releaseDate} description={description} />
      </article>
    );
  }
}

const BodyCard = ({ imageUrl, title, releaseDate, description }) => {
  return (
    <Fragment>
      <div className="film-card__poster">
        <img src={imageUrl} alt="" width="183px" height="300px" />
      </div>
      <div className="film-card__body">
        <div className="film-card__head">
          <div>
            <h1 className="film-card__h1">{title}</h1>
            <p className="film-card__data">{releaseDate}</p>
            <Space size={[0, 8]} wrap>
              <Tag>Action</Tag>
              <Tag>Drama</Tag>
            </Space>
          </div>
          <div className="film-card__rating">6.6</div>
        </div>
        <div className="film-card__foot">
          <p className="film-card__description">{description}</p>
          <Rate allowHalf defaultValue={2.5} count={10} />
        </div>
      </div>
    </Fragment>
  );
};
