// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { FaSun, FaCloudSun, FaMoon, FaCloudMoon, FaWind, FaTint, FaThermometerHalf, FaUmbrella, FaExclamationTriangle } from "react-icons/fa";
import "../components/Weather.css";
import logo from "../assets/logo.png";

export default function Weather() {
    const [weatherData, setWeatherData] = useState(null);
    const [astroData, setAstroData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [historyData, setHistoryData] = useState(null);
    const [futureData, setFutureData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [city, setCity] = useState("Patna");

    const fetchWeather = async (cityName) => {
        try {
            const apiKey = "a4952222c6dc4f28a9253508252602";
            // 🌤️ Fetch Current Weather
            const weatherRes = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}&aqi=yes`
            );

            if (!weatherRes.ok) {
                throw new Error(`HTTP Error: ${weatherRes.status}`);
            };

            const weatherJson = await weatherRes.json();
            setWeatherData(weatherJson);

            // 🌙 Fetch Astronomy Data
            const astroRes = await fetch(
                `https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${cityName}`
            );

            if (!astroRes.ok) {
                throw new Error(`HTTP Error: ${astroRes.status}`);
            };
            const astroJson = await astroRes.json();
            setAstroData(astroJson);

            // ⏳ Fetch Forecast Data
            const forecastRes = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=5&aqi=yes&alerts=yes`
            );

            if (!forecastRes.ok) {
                throw new Error(`HTTP Error: ${forecastRes.status}`);
            };
            const forecastJson = await forecastRes.json();
            setForecastData(forecastJson);

            // ⏪ Fetch History Data (Yesterday ka data)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const formattedDate = yesterday.toISOString().split("T")[0];

            const historyRes = await fetch(
                `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${cityName}&dt=${formattedDate}`
            );
            if (!historyRes.ok) {
                throw new Error(`HTTP Error: ${historyRes.status}`);
            };
            const historyJson = await historyRes.json();
            setHistoryData(historyJson);

            // 🔮 Fetch Future Weather Data
            const futureRes = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=3&aqi=yes&alerts=yes`
            );
            if (!futureRes.ok) {
                throw new Error(`HTTP Error: ${futureRes.status}`);
            };
            const futureJson = await futureRes.json();
            setFutureData(futureJson);

            setLoading(false);
        }
        catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather(city);
    }, [city]);

    const handleSearch = (e) => {
        e.preventDefault();
        const newCity = e.target.city.value;
        setCity(newCity);
    };

    if (loading) {
        return <h1 className="loadingbtn">Loading...</h1>;
    }
    if (error) {
        return <p className="errorbtn">Error: {error.message}</p>;
    }

    return (
        <div className="weather-container">

            <form onSubmit={handleSearch}>
                <h1 className="heading">
                    <span className="heading-text">Weather App</span><span className="heading-logo">
                        <img src={logo} alt="logo" />
                    </span>
                </h1>
                <div className="input-container">
                    <input
                        type="text"
                        name="city"
                        placeholder="Enter city name"
                        defaultValue={city}
                    />
                    <button
                        type="submit"
                        className="input-button"
                    >Search
                    </button>
                </div>
            </form>



            {weatherData && astroData && forecastData && historyData && futureData && (
                <>


                    {/* 🌤️ Current Weather */}
                    <h2 className="weather-heading">
                        Weather in <span className="weather-location">{weatherData.location.name}, {weatherData.location.country}</span>
                    </h2>




                    <div className="main-data-astro-data">
                        {/* main weather data */}
                        <div className="main-weather-data">

                            <p className="weather-temp">🌡️ Temperature: {weatherData.current.temp_c}°C</p>
                            <p className="weather-wind">🌬️ Wind Speed: {weatherData.current.wind_kph} km/h</p>
                            <p className="weather-humidity">💧 Humidity: {weatherData.current.humidity}%</p>
                            <p className="weather-condition">🌥️ Condition: {weatherData.current.condition.text}</p>
                            <p className="weather-feels-like"><FaThermometerHalf /> Feels Like: {weatherData.current.feelslike_c}°C</p>
                            <p className="weather-rain-probability"><FaTint /> Rain Probability: {forecastData.forecast.forecastday[0].day.daily_chance_of_rain}%</p>
                            <p className="weather-uv">☀️ UV Index: {weatherData.current.uv}</p>
                            <p className="weather-wind-direction"><FaWind /> Wind Direction: {weatherData.current.wind_dir}</p>
                            <p className="weather-aqi">🌫️ Air Quality Index (AQI): {weatherData.current.air_quality["us-epa-index"]}</p>
                        </div>


                        {/* Astronomy data */}

                        <div className="astronomy-data">
                            <h2 className="astronomy-heading">Astronomy Data</h2>
                            <p className="astro-sunrise"><FaSun /> Sunrise: {astroData.astronomy.astro.sunrise}</p>
                            <p className="astro-sunset"><FaCloudSun /> Sunset: {astroData.astronomy.astro.sunset}</p>
                            <p className="astro-moonrise"><FaMoon /> Moonrise: {astroData.astronomy.astro.moonrise}</p>
                            <p className="astro-moonset"><FaCloudMoon /> Moonset: {astroData.astronomy.astro.moonset}</p>
                            <p className="astro-moon-phase">🌕 Moon Phase: {astroData.astronomy.astro.moon_phase}</p>
                        </div>

                    </div>



                    {/* future-weather-heading-data */}
                    <div className="future-weather-heading-data">

                        <div className="future-weather-main">
                            <h2 className="future-weather-heading">Future Weather Forecast</h2>
                        </div>

                        <div className="future-content">

                            {futureData.forecast.forecastday.map((day) => (
                                <div key={day.date} className="forecast-item forecast-item-future">
                                    <p className="forecast-date">📅 Date: {day.date}</p>
                                    <p className="forecast-max-temp">🌡️ Max Temp: {day.day.maxtemp_c}°C</p>
                                    <p className="forecast-min-temp">❄️ Min Temp: {day.day.mintemp_c}°C</p>
                                    <p className="forecast-condition">🌥️ Condition: {day.day.condition.text}</p>
                                    <p className="forecast-rain-probability"><FaUmbrella /> Rain Probability: {day.day.daily_chance_of_rain}%</p>
                                    <p className="forecast-uv">☀️ UV Index: {day.day.uv}</p>

                                </div>
                            ))}
                        </div>
                    </div>



                 
                   

                    <div className="history-data-alert-data">


                    {/* history heading data */}
                    <div className="history-heading-data">
                        <h2 className="history-heading">Yesterday Weather</h2>
                        <p className="history-max-temp">🌡️ Max Temp: {historyData.forecast.forecastday[0].day.maxtemp_c}°C</p>
                        <p className="history-min-temp">❄️ Min Temp: {historyData.forecast.forecastday[0].day.mintemp_c}°C</p>
                        <p className="history-condition">🌥️ Condition: {historyData.forecast.forecastday[0].day.condition.text}</p>
                        <p className="history-rain-probability"><FaUmbrella /> Rain Probability: {historyData.forecast.forecastday[0].day.daily_chance_of_rain}%</p>
                    </div>



                    {/* alerts-heading */}

                    <div className="alerts-heading-data">

                        <h2 className="alerts-heading"><FaExclamationTriangle /> Weather Alerts</h2>
                        {forecastData.alerts.alert.length > 0 ? (
                            forecastData.alerts.alert.map((alert, index) => (
                                <div key={index} className="alert-item">
                                    <p className="alert-headline">🚨 {alert.headline}</p>
                                    <p className="alert-desc">{alert.desc}</p>
                                </div>
                            ))
                        ) : (
                            <p className="no-alerts">No weather alerts.</p>
                        )}

                        </div>
                        

                        </div>



                    {/* hourly-heading */}


                    <div className="hourly-heading-data">

                        <h2 className="hourly-heading">Hourly Forecast</h2>


                        <div className="hourly-content">
                        {forecastData.forecast.forecastday[0].hour.map((hour) => (
                            <div key={hour.time} className="hourly-item">
                                <p className="hour-time">🕒 Time: {hour.time.split(" ")[1]}</p>
                                <p className="hour-temp">🌡️ Temp: {hour.temp_c}°C</p>
                                <p className="hour-condition">🌥️ Condition: {hour.condition.text}</p>
                                <p className="hour-rain-probability"><FaUmbrella /> Rain Probability: {hour.chance_of_rain}%</p>
                            </div>

                        ))}
                            </div>
                    </div>
                </>
            )}
        </div>
    );
}