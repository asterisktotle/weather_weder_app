import toCelsius from './utility/tempConversion.js';

const apiKey = '9be9c10917a7b878c59d38bb4f0504ac';
//SELECTOR INPUT
const searchInput = document.querySelector('.js-input');
const searchForm = document.querySelector('.js-form');

//EVENT HANDLER
searchForm.addEventListener('submit', async (event) => {
	event.preventDefault(); //prevent form page to refresh

	const city = searchInput.value.trim();

	if (city) {
		try {
			const weatherData = await getWeatherData(city);
			displayWeatherInfo(weatherData);
		} catch (error) {
			console.log(error);

			displayError('Please enter a city');
		}
	} else {
		displayError('Please enter a city');
	}
});

//FUNCTION
async function getWeatherData(city) {
	const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
	const response = await fetch(apiUrl);

	if (!response.ok) {
		throw new Error('Error: Could not fetch weather data');
	}

	return await response.json();
}

function displayWeatherInfo(weatherData) {
	const {
		name: city,
		main: { temp, humidity },
		weather: [{ description, id }],
	} = weatherData;

	//displayElements
	const html = `<h1 class="city">${city}</h1>
				<span class="today-weather"
					>${getWeatherIcon(id)}</i
				></span>
				<p class="today-temp">${toCelsius(temp)} °C</p>
				<p class="today-humidity">Humidity: ${humidity}%</p>
				<p class="description">${description}</p>`;

	const renderWeather = document.querySelector('.main');
	renderWeather.innerHTML = html;
}

function getWeatherIcon(weatherId) {
	switch (true) {
		case weatherId > 800:
			return ' <i class="fa-solid fa-cloud"></i>';
		case weatherId === 800:
			return ' <i class="fa-regular fa-sun"></i>';
		case weatherId >= 700 && weatherId < 800:
			return '<i class="fa-solid fa-smog"></i>';
		case weatherId >= 600 && weatherId < 700:
			return '<i class="fa-regular fa-snowflake"></i>';
		case weatherId >= 500 && weatherId < 600:
			return '<i class="fa-solid fa-cloud-rain"></i>';
		case weatherId >= 300 && weatherId < 400:
			return '<i class="fa-solid fa-cloud-showers-heavy"></i>';
		case weatherId >= 200 && weatherId < 300:
			return '<i class="fa-solid fa-cloud-showers-water"></i>';
	}
}

function displayError(message) {
	const errorMessage = document.querySelector('.error-message');
	const displayIcon = document.querySelector('.today-weather');

	if (errorMessage) {
		errorMessage.innerHTML = message;
		errorMessage.style.display = 'block';
		displayIcon.innerHTML = '<i class="fa-regular fa-face-rolling-eyes"></i>';
	} else {
		const errorMessage = document.createElement('p');
		errorMessage.classList.add('error-message');
		errorMessage.innerHTML = message;
		displayIcon.innerHTML = '<i class="fa-regular fa-face-rolling-eyes"></i>';

		const mainContainer = document.querySelector('.main');
		mainContainer.insertBefore(errorMessage, mainContainer.firstChild);
	}
}
