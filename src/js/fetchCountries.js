const URL = 'https://restcountries.com/v3.1/name';

function fetchCountries(name) {
return fetch(
  `${URL}/${name}?fields=name,capital,population,flags,languages`
).then(res => {
    if (!res.ok) {
        throw new Error('Data fail!');
    }
    return res.json()
});
}

export default { fetchCountries };