const { L } = window;

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map;
let mapEvent;

const handleMapClick = (event) => {
  mapEvent = event;
  form.classList.remove('hidden');
  inputDistance.focus();
};

const displayMap = (position) => {
  map = L.map('map')
    .setView([
      position.coords.latitude,
      position.coords.longitude,
    ], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.on('click', handleMapClick);
};

const toggleHidden = (input) => {
  input.closest('.form__row')
    .classList
    .toggle('form__row--hidden');
};

const typeChanged = () => {
  toggleHidden(inputCadence);
  toggleHidden(inputElevation);
};

const displayMarker = (event) => {
  event.preventDefault();

  // Reset input fields
  inputDistance.value = '';
  inputDuration.value = '';
  inputCadence.value = '';
  inputElevation.value = '';
  inputType.value = 'running';
  inputCadence.parentElement.classList.remove('form__row--hidden');
  inputElevation.parentElement.classList.add('form__row--hidden');

  form.classList.add('hidden');

  L.marker([mapEvent.latlng.lat, mapEvent.latlng.lng])
    .addTo(map)
    .bindPopup(L.popup({
      maxWidth: 200,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: 'running-popup',
    }).setContent('Running'))
    .openPopup();
};

const init = () => {
  form.classList.add('hidden');
  form.addEventListener('submit', displayMarker);
  inputType.addEventListener('change', typeChanged);

  const location = navigator.geolocation;
  if (!location) return;
  location.getCurrentPosition(
    displayMap,
    (error) => {
      throw new Error(error.message);
    },
  );
};

init();
