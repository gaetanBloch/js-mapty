const { L } = window;

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

const RUNNING = 'running';
const CYCLING = 'cycling';

// Abstract class
class Workout {
  id = (`${Date.now()}`).slice(-10);
  date = new Date();
  distance;
  duration;
  coords;
  type;
  speed;
  unit;

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
  }

  toHTML = () => (
    `
    <li class="workout workout--${this.type}" data-id="${this.id}">
      <h2 class="workout__title">${this.getDescription()}</h2>
      <div class="workout__details">
        <span class="workout__icon">🏃‍♂️</span>
        <span class="workout__value">${this.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${this.duration}</span>
        <span class="workout__unit">min</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${this.speed.toFixed(1)}</span>
        <span class="workout__unit">${this.unit}</span>
      </div>
      <div class="workout__details">
        ${this.getSpecificHtml()}
      </div>
    </li>
    `
  );

  toPopUpContent = () => (
    (this.type === RUNNING ? '🏃‍♂ ' : '🚴‍♀ ') + this.getDescription()
  );

  getDescription = () => (
    `${this.type[0].toUpperCase() + this.type.slice(1)} \
    on ${Workout.MONTHS[this.date.getMonth()]} ${this.date.getDate()}`
  );

  // Method to override
  getSpecificHtml = () => {
    throw new Error('You must implement this function');
  };
}

class Running extends Workout {
  cadence;

  constructor(distance, duration, coords, cadence) {
    super(distance, duration, coords);
    this.cadence = cadence;
    this.type = RUNNING;
    this.unit = 'min/km';
    this.speed = this.#calcPace();
  }

  // min/km
  #calcPace = () => this.duration / this.distance;

  getSpecificHtml = () => (
    `
    <span class="workout__icon">🦶🏼</span>
    <span class="workout__value">${this.cadence}</span>
    <span class="workout__unit">spm</span>
    `
  );
}

class Cycling extends Workout {
  elevationGain;

  constructor(distance, duration, coords, elevationGain) {
    super(distance, duration, coords);
    this.elevationGain = elevationGain;
    this.type = CYCLING;
    this.speed = this.#calcSpeed();
    this.unit = 'km/h';
  }

  // km/h
  #calcSpeed = () => this.distance / (this.duration / 60);

  getSpecificHtml = () => (
    `
    <span class="workout__icon">⛰</span>
    <span class="workout__value">${this.elevationGain}</span>
    <span class="workout__unit">m</span>
    `
  );
}

class App {
  #MAP_ZOOM = 13;

  #map;
  #mapEvent;
  #workouts = [];

  init = () => {
    // Display map
    this.#getPosition();

    // Clear workouts list
    containerWorkouts.querySelectorAll('.workout')
      .forEach((wo) => wo.remove());
    form.classList.add('hidden');

    inputType.addEventListener('change', this.#typeChanged);
    form.addEventListener('submit', this.#newWorkout);
    containerWorkouts.addEventListener('click', this.#moveToMarker);
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

  #loadMap = (position) => {
    this.#map = L.map('map')
      .setView([
        position.coords.latitude,
        position.coords.longitude,
      ], this.#MAP_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this.#showForm);
  };

  // Workout type
  #typeChanged = () => {
    this.#toggleHiddenField(inputCadence);
    this.#toggleHiddenField(inputElevation);
  };

  #toggleHiddenField = (input) => {
    input.closest('.form__row')
      .classList
      .toggle('form__row--hidden');
  };

  #showForm = (event) => {
    this.#mapEvent = event;
    form.classList.remove('hidden');
    inputDistance.focus();
  };

  #newWorkout = (event) => {
    event.preventDefault();

    // Validate form
    if ((+inputDistance.value <= 0 || +inputDuration.value <= 0)
      || (inputType.value === RUNNING && +inputCadence.value <= 0)) {
      alert('Inputs must be positive numbers');
      return;
    }

    form.classList.add('hidden');

    const coords = [this.#mapEvent.latlng.lat, this.#mapEvent.latlng.lng];
    const workout = this.#createWorkout(coords);
    this.#workouts.push(workout);

    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(L.popup({
        maxWidth: 200,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${workout.type}-popup`,
      }).setContent(workout.toPopUpContent()))
      .openPopup();

    containerWorkouts.insertAdjacentHTML('beforeend', workout.toHTML());

    this.#resetForm();
  };

  #createWorkout = (coords) => {
    if (inputType.value === RUNNING) {
      return new Running(
        +inputDistance.value,
        +inputDuration.value,
        coords,
        +inputCadence.value,
      );
    }

    return new Cycling(
      +inputDistance.value,
      +inputDuration.value,
      coords,
      +inputElevation.value,
    );
  };

  // Reset input fields
  #resetForm = () => {
    inputDistance.value = '';
    inputDuration.value = '';
    inputCadence.value = '';
    inputElevation.value = '';
    inputType.value = RUNNING;
    inputCadence.parentElement.classList.remove('form__row--hidden');
    inputElevation.parentElement.classList.add('form__row--hidden');
  };

  #moveToMarker = (event) => {
    const workoutEl = event.target.closest('.workout');
    if (!workoutEl) return;
    const workout = this.#workouts
      .find((wo) => wo.id === workoutEl.dataset.id);
    this.#map.setView(workout.coords, this.#MAP_ZOOM, {
      animate: true,
      pan: { duration: 1 },
    });
  };
}

new App().init();
