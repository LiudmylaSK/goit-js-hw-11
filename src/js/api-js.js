// api-js.js

import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '39444367-c9719dfa6fa0cb49879b0c228';

  constructor(perPage) {
    this.per_page = perPage;
    this.page = 1;
    this.q = '';
  }

  async getPhotos() {
    const response = await axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.q,
        page: this.page,
        per_page: this.per_page,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    return response.data;
  }
}
