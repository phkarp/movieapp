export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3';
  _apiKey = '94f42cb5addddd4b06406efe51a662ce';

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }

    return await res.json();
  }

  async getMovies(query, currentPage) {
    const res = await this.getResource(`/search/movie?api_key=${this._apiKey}&query=${query}&page=${currentPage}`);
    const films = res.results;
    const pages = res['total_pages'];

    const newCurrentPage = res.page;

    return { films, loading: false, error: false, pages, currentPage: newCurrentPage };
  }

  async createGuessSession() {
    return this.getResource(`/authentication/guest_session/new?api_key=${this._apiKey}`);
  }

  getGenres() {
    return this.getResource(`/genre/movie/list?api_key=${this._apiKey}&language=en-US`);
  }

  async getRatedFilm(guestId, currentPage) {
    const res = await this.getResource(
      `/guest_session/6be76e132e278c45c36516cf813aad16/rated/movies?api_key=${this._apiKey}&page=${currentPage}`
    );
    const { results: films, total_pages: pages, page: newCurrentPage } = res;
    return { films, loading: false, error: false, pages, currentPage: newCurrentPage };
  }

  async postRateFilm(movieId, value) {
    return await fetch(
      `${this._apiBase}/movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=6be76e132e278c45c36516cf813aad16`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value: value }),
      }
    );
  }

  async deleteRated(movieId) {
    return await fetch(
      `${this._apiBase}/movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=6be76e132e278c45c36516cf813aad16`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      }
    );
  }
  // async test(query, currentPage) {
  //   const res = await this.getResource(
  //     `/search/movie?api_key=${this._apiKey}&query=${query}&page=${currentPage}&guest_session_id=6be76e132e278c45c36516cf813aad16`
  //   );
  //   return res;
  // }
}
