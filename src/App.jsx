import { useEffect, useState } from 'react';
import loader from './assets/loader.svg';
import "./App.css";
import browser from './assets/browser.svg';

const APIKEY = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [dpt, setDpt] = useState([]);
  const [selectedDpt, setSelectedDpt] = useState('');
  const [cities, setCities] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);
  

  useEffect(() => {
    fetch(`http://api.airvisual.com/v2/nearest_city?key=${APIKEY}`)
      .then(response => response.json())
      .then(responseData => {
        if (responseData.data) {
          setWeatherData({
            city: responseData.data.city,
            country: responseData.data.country,
            iconId: responseData.data.current.weather.ic,
            temperature: responseData.data.current.weather.tp,
          });
        }
      })
      .catch(error => {
        console.log(error)
        console.dir(error)
        setErrorInfo(error.message);
      }
        
    );
  }, []);

  useEffect(() => {
    if (dpt.length === 0) {
      fetch(`http://api.airvisual.com/v2/states?country=France&key=${APIKEY}`)
        .then(response => response.json())
        .then(responseData => {
          if (Array.isArray(responseData.data)) {
            setDpt(responseData.data);
          }
        })
        .catch(error => {
          console.log(error)
          console.dir(error)
          setErrorInfo(error.message);
        })
    }
  }, [dpt]);

  const handleDptChange = (event) => {
    const selectedDpt = event.target.value;
    setSelectedDpt(selectedDpt);

    if (selectedDpt) {
      fetch(`http://api.airvisual.com/v2/cities?state=${selectedDpt}&country=France&key=${APIKEY}`)
        .then(response => response.json())
        .then(responseData => {
          if (Array.isArray(responseData.data)) {
            setCities(responseData.data);
            console.log(responseData.data);
          }
        })
        .catch(error => {
          console.log(error)
          console.dir(error)
          setErrorInfo(error.message);
        })
    }
  };
  const setVilleData = (event) => {
    const city = event.target.value;

    if (cities) {
      fetch(`http://api.airvisual.com/v2/city?city=${city}&state=${selectedDpt}&country=France&key=${APIKEY}`)
        .then(response => response.json())
        .then(responseData => {
          console.log(responseData.data.city);

          if (responseData.data) {
          setWeatherData(
            {
              city: responseData.data.city,
              country: responseData.data.country,
              iconId: responseData.data.current.weather.ic,
              temperature: responseData.data.current.weather.tp,
            }
          )
        }
        })
        .catch(error => {
          console.log(error)
          console.dir(error)
          setErrorInfo(error.message);
        })
    }
  };
  return (
    <main>
     
      

      <div className={`loader-container ${(!weatherData && !errorInfo) && "active"}`}>
        <img src={loader} alt="Loading..." />
      </div>

      {weatherData && (
        <>
         <div className="selectors">
          <label>Choisissez un département:</label>
          <select className='select' onChange={handleDptChange}>
            {dpt.map((item, index) => (
              <option key={index} value={item.state}>{item.state}</option>
            ))}
          </select>

          {cities != null && ( 
            <select className='select' onChange={setVilleData}>
            {cities.map((item, index) => (
              <option key={index} value={item.city}>{item.city}</option>
            ))}
            </select>
          )}

        </div>
        
          <p className="city-name">{weatherData.city}</p>
          <p className="country-name">{weatherData.country}</p>
          <p className="temperature">{weatherData.temperature}°</p>
          <div className="info-icon-container">
            <img src={`/icons/${weatherData.iconId}.svg`} alt="Weather icon" className='info-icon' />
          </div>
        </>
      )}
      {(errorInfo && weatherData ) && (
        <> 
        <p className="error-information">{errorInfo}</p>
        <img src={browser} alt="error icon"/>
        </>
      )}
    </main>
  );
}

export default App;
