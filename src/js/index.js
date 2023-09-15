import Notiflix from 'notiflix';
import { PixabayAPI } from './api-js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { toggleScrollToTopButton, scrollToTop } from './scrollToTop';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  list: document.querySelector('.list'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.loadMoreBtn.classList.add('hidden');

let page = 1;
let totalHits = 0;
let totalPages = 0;
let currentPage = 1;

const pixabayApi = new PixabayAPI(40);

refs.form.addEventListener('submit', async e => {
  e.preventDefault();
  const searchQuery = refs.form.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }

  pixabayApi.q = searchQuery;
  refs.gallery.innerHTML = '';
  page = 1;

  try {
    const { totalHits, hits } = await pixabayApi.getPhotos();

    totalHits = totalHits;
    totalPages = Math.ceil(totalHits / pixabayApi.per_page);

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

    if (totalPages > 1) {
      refs.loadMoreBtn.classList.remove('hidden');
    }
  } catch (error) {
    console.error(error);
  } finally {
    refs.form.reset();
  }
});

refs.loadMoreBtn.addEventListener('click', loadMoreImages);

async function loadMoreImages() {
  currentPage++;

  try {
    pixabayApi.page = currentPage;

    const { hits } = await pixabayApi.getPhotos();

    if (hits.length > 0) {
      refs.gallery.innerHTML = refs.gallery.innerHTML + renderMarkup(hits);

      if (currentPage >= totalPages) {
        refs.loadMoreBtn.classList.add('hidden');
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }

      scrollToNextPage();
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no more images matching your search query. Please try again.'
      );
      refs.loadMoreBtn.classList.add('hidden');
    }
  } catch (error) {
    console.error(error);
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

async function loadMoreData(e) {
  pixabayApi.page += 1;

  const { hits } = await pixabayApi.getPhotos();

  try {
    if (pixabayApi.page === totalPages) {
      Notiflix.Notify.info("You've reached the end of search results");
      observer.unobserve(refs.list);

      return;
    }
    refs.gallery.insertAdjacentHTML('beforeend', renderMarkup(hits));
    lightbox.refresh();
  } catch (error) {
    console.error(error);
  }
}

function scrollToNextPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

Notiflix.Notify.init({
  width: '350px',
  position: 'left-top',
  distance: '10px',
  fontSize: '18px',

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
