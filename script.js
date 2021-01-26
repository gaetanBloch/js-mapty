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

const buildMapUri = (
  latitude,
  longitude,
) => `https://www.google.fr/maps/@${latitude},${longitude}`;

const init = () => {
  const location = navigator.geolocation;
  if (!location) return;
  location.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log(buildMapUri(latitude, longitude));
    }, (error) => {
      console.log(error);
    },
  );
};

init();
