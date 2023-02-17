import { Rate, Space, Tag } from 'antd';
import { Component } from 'react';
import './film-card.css';

export default class FilmCard extends Component {
  render() {
    return (
      <article className="film-card">
        <div className="film-card__poster">
          <img
            src="https://disco-mania.ru/upload/iblock/099/p9z3i6w10nypvepfe7b77d6yh0ysre1h.jpg"
            alt=""
            width="183px"
            height="300px"
          />
        </div>
        <div>
          <div className="film-card__head">
            <div>
              <h1 className="film-card__h1">The way back</h1>
              <p className="film-card__data">March 5, 2020 </p>
              <Space size={[0, 8]} wrap>
                <Tag>Action</Tag>
                <Tag>Drama</Tag>
              </Space>
            </div>
            <div className="film-card__rating">6.6</div>
          </div>
          <div>
            <p className="film-card__description">
              A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction
              attempts to regain his soul and salvation by becoming the coach of a disparate ethnically mixed high ...
            </p>
            <Rate allowHalf defaultValue={2.5} count={10} />
          </div>
        </div>
      </article>
    );
  }
}
