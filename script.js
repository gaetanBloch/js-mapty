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

const displayMarker = (event) => {
  event.preventDefault();

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
