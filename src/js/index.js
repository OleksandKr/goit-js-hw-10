import '../css/styles.css';
import API from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputRef: document.querySelector('#search-box'),
  countryListRef: document.querySelector('.country-list'),
  countryInfoRef: document.querySelector('.country-info'),
};

refs.inputRef.addEventListener('input', debounce(onInputTime, DEBOUNCE_DELAY));

function onInputTime(e) {
  e.preventDefault();
  const inputValue = e.target.value.trim();
  if (!inputValue) {
    resetMarkup(refs.countryListRef);
    resetMarkup(refs.countryInfoRef);
    return;
  }

  API.fetchCountries(inputValue)
    .then(result => {
      if (result.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (result.length >= 2 && result.length <= 10) {
        resetMarkup(refs.countryListRef);
        createMarkupListCountry(result);
        resetMarkup(refs.countryInfoRef);
      } else {
        resetMarkup(refs.countryInfoRef);
        createMarkupInfoCountry(result);
        resetMarkup(refs.countryListRef);
      }
    })
    .catch(() => {
      resetMarkup(refs.countryListRef);
      resetMarkup(refs.countryInfoRef);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkupListCountry(result) {
  const markup = result
    .map(({ name, flags }) => {
      return `<li class="item-country-list">
        <img class="list-img-country" src="${flags.svg}" alt="flag" />
        <p class="info-name-country">${name.official}</p>
      </li>`;
    })
    .join('');
  return refs.countryListRef.insertAdjacentHTML('beforeend', markup);
}

function createMarkupInfoCountry(result) {
  const markup = result
    .map(({ name, capital, population, flags, languages }) => {
      return `
  <div class="country__flag">
    <img class="country__img" src="${flags.svg}" alt="flag">
    <p class="country__name">${name.official}</p>
  </div>
  <ul class="country__info">
      <li class="country__item"> <b>Capital</b>:
    <span class="country__span">${capital}</span>
      </li>
      <li class="country__item"> <b>Population</b>:
    <span class="country__span">${population}</span>
      </li>
      <li class="country__item"> <b>Languages</b>:
    <span class="country__span">${Object.values(languages).join(', ')}</span>
      </li>
  </ul>`;
    })
    .join('');

  return refs.countryInfoRef.insertAdjacentHTML('beforeend', markup);
}

function resetMarkup(el) {
  el.innerHTML = '';
}
