// Основний файл (index.js)

import Notiflix from 'notiflix';
import { fetchData, perPage } from './api-js';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// import { toggleScrollToTopButton, scrollToTop } from './scrollToTop';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let totalHits = 0;

const lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionDelay: 250,
  captionsData: 'alt',
  captionPosition: 'bottom',
});

loadMoreBtn.style.display = 'none'; // Початково приховуємо кнопку "Load more"

form.addEventListener('submit', async e => {
  e.preventDefault();
  const searchQuery = form.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }

  gallery.innerHTML = '';
  page = 1;

  const data = await fetchData(searchQuery, page);

  if (data && data.hits.length > 0) {
    totalHits = data.totalHits;

    data.hits.forEach(image => {
      gallery.appendChild(createPhotoCard(image));
    });

    if (totalHits > data.hits.length) {
      loadMoreBtn.style.display = 'block'; // Відображаємо кнопку після першого запиту
    }
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page++;

  const searchQuery = form
    .querySelector('input[name="searchQuery"]')
    .value.trim();

  const data = await fetchData(searchQuery, page);

  if (data && data.hits.length > 0) {
    data.hits.forEach(image => {
      gallery.appendChild(createPhotoCard(image));
    });

    if (page * perPage >= totalHits) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no more images matching your search query.'
    );
    loadMoreBtn.style.display = 'none';
  }
});

// function createPhotoCard(image) {
//   const photoCard = document.createElement('div');
//   photoCard.classList.add('photo-card');

//   const imageLink = document.createElement('a');
//   imageLink.href = image.largeImageURL;
//   imageLink.target = '_blank';

//   const imageElement = document.createElement('img');
//   imageElement.src = image.webformatURL;
//   imageElement.alt = image.tags;
//   imageElement.loading = 'lazy';

//   imageLink.appendChild(imageElement);

//   photoCard.appendChild(imageLink);

//   const infoDiv = document.createElement('div');
//   infoDiv.classList.add('info');
//   infoDiv.innerHTML = `
//     <p class="info-item"><b>Likes:</b> ${image.likes}</p>
//     <p class="info-item"><b>Views:</b> ${image.views}</p>
//     <p class="info-item"><b>Comments:</b> ${image.comments}</p>
//     <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
//   `;

//   photoCard.appendChild(infoDiv);

//   return photoCard;
// }

function createPhotoCard(image) {
  const photoCardLink = document.createElement('a');
  photoCardLink.href = image.largeImageURL;
  photoCardLink.target = '_blank';
  photoCardLink.classList.add('link');

  const photoCard = document.createElement('div');
  photoCard.classList.add('photo-card');

  const imageElement = document.createElement('img');
  imageElement.src = image.webformatURL;
  imageElement.alt = image.tags;
  imageElement.loading = 'lazy';

  photoCard.appendChild(imageElement);

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('info');
  infoDiv.innerHTML = `
    <p class="info-item"><b>Likes:</b> ${image.likes}</p>
    <p class="info-item"><b>Views:</b> ${image.views}</p>
    <p class="info-item"><b>Comments:</b> ${image.comments}</p>
    <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
  `;

  photoCard.appendChild(infoDiv);

  photoCardLink.appendChild(photoCard);

  return photoCardLink;
}

Notiflix.Notify.init({
  width: '350px',
  position: 'left-top',
  distance: '10px',
  fontSize: '18px',
  timeout: 10000,
  borderRadius: '50px',
  info: {
    background: '#007bff',
  },
});
