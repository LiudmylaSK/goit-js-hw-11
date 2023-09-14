// api-js

import axios from 'axios';

const API_KEY = '39444367-c9719dfa6fa0cb49879b0c228';
const perPage = 40;

export async function fetchData(searchQuery, page) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );

    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }

    const data = response.data;

    if (!data || data.hits.length === 0) {
      throw new Error('No data found');
    }

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export { perPage };
