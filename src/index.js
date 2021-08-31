import markup from './partials/markup.hbs';
import * as basicLightbox from '../node_modules/basiclightbox';
import { fetchUrl } from './partials/apiService';
import { alert, defaultModules } from '../node_modules/@pnotify/core/dist/PNotify.js';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('#btn'),
};

let pageNumber = 1;
let inputValue = '';
refs.button.style.visibility = 'hidden';

function createMarkupBySearchResult(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  refs.button.style.visibility = 'hidden';

  inputValue = e.target.query.value;

  pageNumber = 1;

  fetchUrl(inputValue, pageNumber).then(createMarkup);
  pageNumber += 1;
}

async function loadMore() {
  if (inputValue === '') {
    return;
  }
  await fetchUrl(inputValue, pageNumber).then(createMarkup);
  pageNumber += 1;

  //   setTimeout(
  //     () =>
  //       refs.button.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'end',
  //       }),
  //     250,
  //   );
}

function openModal(e) {
  if (e.target.tagName !== 'IMG') {
    return;
  }

  const openModal = basicLightbox.create(`
    <div class="modal">
    <img src=${e.target.dataset.src}/>
    </div>
`);

  openModal.show();
}

function createMarkup(data) {
  if (data.hits.length === 0) {
    alert({
      text: 'Sorry, nothing was found for this request!',
    });
    return;
  }

  if (data.hits.length > 11) {
    refs.button.style.visibility = 'visible';
  }

  const createItemMarkup = data.hits.map(item => markup(item)).join('');
  refs.gallery.insertAdjacentHTML('beforeend', createItemMarkup);
}

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
};

const observer = new IntersectionObserver(loadMore, options);

observer.observe(refs.button);

refs.form.addEventListener('submit', createMarkupBySearchResult);
refs.button.addEventListener('click', loadMore);
refs.gallery.addEventListener('click', openModal);
