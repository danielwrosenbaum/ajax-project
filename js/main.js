var $getWeatherPage = document.querySelector('.get-weather');
var $headingContainer = document.querySelector('.heading-container');
var $mainHeading = document.querySelector('.heading');
var $backButton = document.querySelector('.back-button');
var $backgroundPic = document.querySelector('.background-pic');
var $goButton = document.querySelector('.go-button');
var $getButton = document.querySelector('.get-button');
var $viewButton = document.querySelector('.view-button');
var $homePage = document.querySelector('.homepage');
var $viewPage = document.querySelector('.viewpage');
var $weatherPage = document.querySelector('.weatherpage');
var $form = document.querySelector('.city-form');
var $headerColor = document.querySelector('.header');

var $newImage = document.createElement('img');
var $viewBackButton = document.createElement('button');
var $randomBackground = document.createElement('img');
var $weatherBackButton = document.createElement('button');
var $errorContainer = document.createElement('div');
var $backButtonContainer = document.createElement('div');
var $weatherHeading = document.createElement('h1');
var $weatherContainer = document.createElement('div');
var $imageContainer = document.createElement('div');
var $weatherImageContainer = document.createElement('div');

$getButton.addEventListener('click', goToGet);
$backButton.addEventListener('click', goBack);
$viewBackButton.addEventListener('click', goBack);
$goButton.addEventListener('click', goToWeather);
$goButton.addEventListener('submit', submitCity);
$viewButton.addEventListener('click', goToView);
$weatherBackButton.addEventListener('click', goBack);

getArtData('snow');
function submitCity(event) {
  event.preventDefault();
  var cityWeather = event.target.elements.cityName.value;
  getWeather(cityWeather);
}
function goToGet(event) {
  $getWeatherPage.className = 'get-weather view';
  $homePage.className = 'homepage hidden';
}
function goToView(event) {
  $homePage.className = 'homepage hidden';
  $viewPage.className = 'viewpage';
  var $viewImageContainer = document.createElement('div');
  $viewImageContainer.className = 'view-container';
  $viewPage.appendChild($viewImageContainer);
  $viewBackButton.className = 'back-button';
  $viewBackButton.textContent = 'Back';
  $viewPage.appendChild($viewBackButton);

}
function changeBackground(weather) {
  var xhr4 = new XMLHttpRequest();
  xhr4.open('GET', 'https://www.rijksmuseum.nl/api/en/collection?key=TnIr6Ed8&imgonly=true&type=painting&q=' + weather);
  xhr4.responseType = 'json';
  xhr4.addEventListener('load', function () {
    generateRandomBackground(xhr4.response);
  });
  xhr4.send();
}

function generateRandomBackground(response) {
  var i = Math.floor(Math.random() * response.artObjects.length);
  var $newPic = response.artObjects[i].webImage.url;
  var $newPicAlt = response.artObjects[i].title;
  $newImage.setAttribute('src', $newPic);
  $newImage.setAttribute('alt', $newPicAlt);
  $randomBackground.setAttribute('src', $newPic);
  $randomBackground.setAttribute('alt', $newPicAlt);
  $backgroundPic.prepend($randomBackground);
}

function getArtData(weather) {
  var xhr3 = new XMLHttpRequest();
  xhr3.open('GET', 'https://www.rijksmuseum.nl/api/en/collection?key=TnIr6Ed8&imgonly=true&type=painting&q=' + weather);
  xhr3.responseType = 'json';
  xhr3.addEventListener('load', function () {
    generateGetWeatherPage(xhr3.response);
  });
  xhr3.send();
}

function generateGetWeatherPage(response) {
  var i = Math.floor(Math.random() * response.artObjects.length);
  var $newPic = response.artObjects[i].webImage.url;
  var $newPicAlt = response.artObjects[i].title;
  $randomBackground.setAttribute('src', $newPic);
  $randomBackground.setAttribute('alt', $newPicAlt);
  $backgroundPic.prepend($randomBackground);
  $imageContainer.className = 'image-container';
  $getWeatherPage.prepend($imageContainer);

  $newImage.setAttribute('src', $newPic);
  $newImage.setAttribute('alt', $newPicAlt);
  $newImage.className = 'main-pic';
  $imageContainer.prepend($newImage);
  var $newImageTitle = document.createElement('h4');
  $newImageTitle.textContent = response.artObjects[i].title;
  $imageContainer.appendChild($newImageTitle);
  var $newImageArtist = document.createElement('div');
  $newImageArtist.textContent = response.artObjects[i].principalOrFirstMaker;
  $imageContainer.appendChild($newImageArtist);
}

function goBack(event) {
  $getWeatherPage.className = 'get-weather hidden';
  $homePage.className = 'homepage view';
  $viewPage.className = 'viewpage hidden';
  $weatherPage.className = 'weatherpage hidden';
  $headerColor.className = 'header normal';
  removeWeatherInfo($weatherContainer);
  removeWeatherInfo($weatherImageContainer);
  $mainHeading.className = 'heading view';
  $weatherHeading.className = 'hidden';
  changeBackground('snow');
}

function removeWeatherInfo(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function goToWeather(event) {
  $getWeatherPage.className = 'get-weather hidden';
  $weatherPage.className = 'weatherpage view';

}
function getWeather(cityName) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=8e56c099331856fb966227282999fa5c');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    generateWeatherContent(xhr.response);
  });
  xhr.send();
}

function generateWeatherContent(response) {
  if (response.cod === '404') {
    $weatherPage.prepend($errorContainer);
    var notFound = document.createElement('h1');
    notFound.className = 'row center';
    notFound.textContent = 'City not found, please try again.';
    $errorContainer.appendChild(notFound);
  } else {
    var cityTemp = Math.trunc(response.main.temp);
    var weatherCondition = response.weather[0].main;
    $mainHeading.className = 'heading hidden';
    $weatherHeading.className = 'view';
    $weatherHeading.textContent = weatherCondition + '  ' + cityTemp + ' \u00B0F';
    $headingContainer.appendChild($weatherHeading);
    getArtWeather(weatherCondition);
    $weatherContainer.className = 'weather-container';
    $weatherPage.appendChild($weatherContainer);
    var $cityName = document.createElement('h1');
    $cityName.textContent = response.name;
    $cityName.className = 'row column-full center';
    $weatherContainer.prepend($cityName);
    var $moreText = document.createElement('h3');
    $moreText.className = 'row column-full center';
    $moreText.textContent = 'Current Weather Conditions:';
    $weatherContainer.appendChild($moreText);
    var $weatherRowContainer = document.createElement('div');
    $weatherRowContainer.className = 'row center';
    $weatherContainer.append($weatherRowContainer);
    var $iconContainer = document.createElement('div');
    $iconContainer.className = 'column-half';
    $weatherRowContainer.append($iconContainer);
    var $weatherIcon = document.createElement('i');
    $iconContainer.append($weatherIcon);
    var $conditionsContainer = document.createElement('div');
    $conditionsContainer.className = 'column-half';
    $weatherRowContainer.append($conditionsContainer);
    var newCityTemp = document.createElement('h2');
    newCityTemp.textContent = cityTemp + ' \u00B0F';
    $conditionsContainer.appendChild(newCityTemp);
    var newCityWeather = document.createElement('h2');
    newCityWeather.textContent = weatherCondition;
    $conditionsContainer.appendChild(newCityWeather);
    if (weatherCondition === 'Clouds') {
      $headerColor.className = 'header clouds';
      $weatherIcon.className = 'fas fa-cloud fa-7x';
      $weatherContainer.style.color = 'white';
    } else if (weatherCondition === 'Clear') {
      $headerColor.className = 'header clear';
      $weatherIcon.className = 'fas fa-sun fa-7x';
      $weatherContainer.style.color = 'rgb(255, 227, 70)';
      // newCityWeather.textContent = 'Clear';
    } else if (weatherCondition === 'Snow') {
      $headerColor.className = 'header snow';
      $weatherIcon.className = 'far fa-snowflake fa-7x';
      $weatherContainer.style.color = 'rgb(156, 156, 253)';
    } else if (weatherCondition === 'Rain') {
      $headerColor.className = 'header rain';
      $weatherIcon.className = 'fas fa-cloud-showers-heavy fa-7x';
      $weatherContainer.style.color = 'blue';
    } else {
      $headerColor.className = 'header normal';
    }
  }
  $weatherPage.appendChild($backButtonContainer);
  $backButtonContainer.className = 'button-container';
  $weatherBackButton.className = 'back-button';
  $weatherBackButton.textContent = 'Back';
  $backButtonContainer.appendChild($weatherBackButton);
  $form.reset();
}

function getArtWeather(weather) {
  if (weather === 'Clear') {
    weather = 'Sun';
  }
  var xhr2 = new XMLHttpRequest();
  xhr2.open('GET', 'https://www.rijksmuseum.nl/api/en/collection?key=TnIr6Ed8&imgonly=true&type=painting&q=' + weather);
  xhr2.responseType = 'json';
  xhr2.addEventListener('load', function () {
    generateWeatherPicture(xhr2.response);
  });
  xhr2.send();
}

function generateWeatherPicture(response) {
  var i = Math.floor(Math.random() * response.artObjects.length);
  var $newPic = response.artObjects[i].webImage.url;
  var $newPicAlt = response.artObjects[i].title;
  $randomBackground.setAttribute('src', $newPic);
  $randomBackground.setAttribute('alt', $newPicAlt);
  $backgroundPic.prepend($randomBackground);
  $weatherImageContainer.className = 'image-container';
  $weatherPage.prepend($weatherImageContainer);
  var $newImage = document.createElement('img');
  $newImage.setAttribute('src', $newPic);
  $newImage.setAttribute('alt', $newPicAlt);
  $newImage.className = 'main-pic';
  $weatherImageContainer.prepend($newImage);
  var $newImageTitle = document.createElement('h4');
  $newImageTitle.textContent = response.artObjects[i].title;
  $weatherImageContainer.appendChild($newImageTitle);
  var $newImageArtist = document.createElement('div');
  $newImageArtist.textContent = response.artObjects[i].principalOrFirstMaker;
  $weatherImageContainer.appendChild($newImageArtist);
}
