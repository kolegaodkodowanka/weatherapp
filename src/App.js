import "./App.css";
import Search from "./components/search/search";
import CurrentWeather from "./components/search/current-weather/current-weather";
import { WEATHER_API_KEY, WEATHER_API_URL } from "./api";
import { useState, useEffect } from "react"; // Import useEffect
import Forecast from "./components/forecast/forecast";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    // Load data from local storage when the component mounts
    const storedCurrentWeather = localStorage.getItem("currentWeather");
    const storedForecast = localStorage.getItem("forecast");
    
    if (storedCurrentWeather) {
      setCurrentWeather(JSON.parse(storedCurrentWeather));
    }
    
    if (storedForecast) {
      setForecast(JSON.parse(storedForecast));
    }
  }, []); // Empty dependency array means this effect runs only once, on mount

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();
        
        // Update state and store data in local storage
        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        localStorage.setItem("currentWeather", JSON.stringify({ city: searchData.label, ...weatherResponse }));

        setForecast({ city: searchData.label, ...forecastResponse });
        localStorage.setItem("forecast", JSON.stringify({ city: searchData.label, ...forecastResponse }));
      })
      .catch((err) => console.log(err));
  };

  console.log(currentWeather);
  console.log(forecast);

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;
