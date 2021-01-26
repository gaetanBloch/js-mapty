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

const init = () => {
  const location = navigator.geolocation;
  if (!location) return;
  location.getCurrentPosition(
    (position) => {
      const map = L.map('map')
        .setView([
          position.coords.latitude,
          position.coords.longitude,
        ], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on('click', (mapEvent) => {
        L.marker([mapEvent.latlng.lat, mapEvent.latlng.lng])
          .addTo(map)
          .bindPopup(L.popup({
            maxWidth: 200,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: 'running-popup',
          })
            .setContent('Running'))
          .openPopup();
      });
    }, (error) => {
      throw new Error(error.message);
    },
  );
};

init();
