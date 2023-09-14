// scrollToTop.js

// export function toggleScrollToTopButton() {}

// export function scrollToTop() {}

const scrollToTopButton = document.getElementById('scrollToTopBtn');

function toggleScrollToTopButton() {
  if (window.scrollY > 300) {
    scrollToTopButton.style.display = 'block';
  } else {
    scrollToTopButton.style.display = 'none';
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

scrollToTopButton.addEventListener('click', scrollToTop);
window.addEventListener('scroll', toggleScrollToTopButton);
