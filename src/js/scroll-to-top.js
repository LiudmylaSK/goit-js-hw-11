// scroll-to-top.js

export function toggleScrollToTopButton() {
  const scrollToTopButton = document.getElementById('scrollToTopBtn');
  scrollToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

const scrollToTopButton = document.getElementById('scrollToTopBtn');

scrollToTopButton.addEventListener('click', scrollToTop);
window.addEventListener('scroll', toggleScrollToTopButton);
