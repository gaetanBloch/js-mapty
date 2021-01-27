const { L } = window;

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapEvent;

  init = () => {
    form.classList.add('hidden');
    form.addEventListener('submit', this.#showForm);
    inputType.addEventListener('change', this.#typeChanged);
    this.#getPosition();
  };

  #getPosition = () => {
    const location = navigator.geolocation;
    if (!location) return;
    location.getCurrentPosition(
      this.#loadMap,
      (error) => {
        throw new Error(error.message);
      },
    );
  };

  #handleMapClick = (event) => {
    this.#mapEvent = event;
    form.classList.remove('hidden');
    inputDistance.focus();
  };

  #loadMap = (position) => {
    this.#map = L.map('map')
      .setView([
        position.coords.latitude,
        position.coords.longitude,
      ], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this.#handleMapClick);
  };

  #toggleHidden = (input) => {
    input.closest('.form__row')
      .classList
      .toggle('form__row--hidden');
  };

  #typeChanged = () => {
    this.#toggleHidden(inputCadence);
    this.#toggleHidden(inputElevation);
  };

  #showForm = (event) => {
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

    L.marker([this.#mapEvent.latlng.lat, this.#mapEvent.latlng.lng])
      .addTo(this.#map)
      .bindPopup(L.popup({
        maxWidth: 200,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      }).setContent('Running'))
      .openPopup();
  };
}

class Workout {
  #id;
  distance;
  duration;
  coords;
  date;
  type;

  static MONTHS = [
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

  constructor(distance, duration, coords) {
    if (this.constructor === Workout) {
      throw new TypeError(
        'Abstract class "Workout" cannot be instantiated directly',
      );
    }

    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
    this.date = new Date();
    this.#id = (`${Date.now()}`).slice(-10);
  }

  getDescription = () => (
    `${this.type[0].toUpperCase() + this.type.slice(1)} \
    on ${Workout.MONTHS[this.date.getMonth()]} ${this.date.getDate()}`
  );
}

class Running extends Workout {
  cadence;
  pace;

  constructor(distance, duration, coords, cadence) {
    super(distance, duration, coords);
    this.cadence = cadence;
    this.type = 'running';
    this.pace = this.#getPace();
  }

  #getPace = () => {
    return 0;
  };
}

class Cycling extends Workout {
  elevationGain;
  speed;

  constructor(distance, duration, coords, elevationGain) {
    super(distance, duration, coords);
    this.elevationGain = elevationGain;
    this.type = 'cycling';
    this.speed = this.#getSpeed();
  }

  #getSpeed = () => {
    return 0;
  };
}

new App().init();
