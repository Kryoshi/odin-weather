export { getWeatherData };

const API_KEY = "48d87e7905c448d39ba95320241305";

async function getWeatherData(location = "london") {
  try {
    const request_url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`;
    const response = await fetch(request_url, { mode: "cors" });
    const weatherData = await response.json();

    return weatherData;
  } catch (error) {
    console.log(error);
    return false;
  }
}
