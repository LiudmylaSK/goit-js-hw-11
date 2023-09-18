import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import { PixabayAPI } from './api-js';
import { toggleScrollToTopButton, scrollToTop } from './scroll-to-top';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  list: document.querySelector('.list'),
};

let totalPages = 0;
let totalHits = 0;

const pixabayApi = new PixabayAPI(40);

const observer = new IntersectionObserver(
  (entries, observer) => {
    if (entries[0].isIntersecting) {
      loadMoreData();
    }
  },
  {
    root: null,
    rootMargin: '600px',
    threshold: 1,
  }
);

async function performSearch() {
  try {
    const { totalHits, hits } = await pixabayApi.getPhotos();
    totalPages = Math.ceil(totalHits / pixabayApi.per_page);

    totalHits = totalHits;

    if (totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found: ${totalHits} images.`);
      refs.gallery.innerHTML = renderMarkup(hits);
      lightbox.refresh();
    }

    if (totalPages === 1) {
      return;
    }
    observer.observe(refs.list);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there was an error while fetching images. Please try again later.'
    );
  } finally {
    refs.form.reset();
  }
}

function renderMarkup(card) {
  return card
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery-link" href="${largeImageURL}">
        <div class="photo-card">
    <img class="img-item" src="${webformatURL}" alt="${tags}" loading="lazy"/>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </div>
  </a>`;
      }
    )
    .join('');
}

async function loadMoreData() {
  if (pixabayApi.page === totalPages) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }
  pixabayApi.page += 1;

  try {
    const { hits } = await pixabayApi.getPhotos();

    if (hits.length > 0) {
      refs.gallery.insertAdjacentHTML('beforeend', renderMarkup(hits));
      lightbox.refresh();

      // scrollToNextPage();
    } else {
      observer.disconnect();
    }
  } catch (error) {}
}

refs.form.addEventListener('submit', async e => {
  e.preventDefault();
  const searchQuery = refs.form.searchQuery.value.trim();

  if (searchQuery === '') {
    Notiflix.Notify.info('Please enter a search query');
    return;
  }

  pixabayApi.q = searchQuery;
  refs.gallery.innerHTML = '';
  pixabayApi.page = 1;

  performSearch();
});

// function scrollToNextPage() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

Notiflix.Notify.init({
  width: '280px',
  position: 'left-top',
  distance: '10px',
  fontSize: '16px',
  borderRadius: '50px',
  timeout: 5000,
  clickToClose: true,
  info: {
    background: '#007bff',
  },
});

let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionDelay: 250,
  captionsData: 'alt',
  captionPosition: 'bottom',
  scrollDisable: false,
});
