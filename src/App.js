import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterIcon from '@mui/icons-material/Water';
import './App.css';


const api = {
  key: "02e3d77820cfd9ee3e6ca048fb4e10b4",
  base: "https://api.openweathermap.org/data/2.5/",
  geo: "https://api.openweathermap.org/geo/1.0/",
  default: "http://api.openweathermap.org/geo/1.0/direct?q=pelotas"
}

function App() {
  const [query, setQuery] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentDescription, setCurrentDescription] = useState(null);
  const [forecastRes, setForecastRes] = useState(null);
  const [forecast, setForecast] = useState(null);

  const buscaLatLon = (event) => {
    if (event.key === "Enter") {
  
      if (query === '') {
        fetch(`${api.default}&appid=${api.key}`)
        .then(res => res.json())
        .then(result => {
        setQuery('');
        buscaClima(result);  
        });
      } else {
      fetch(`${api.geo}direct?q=${query}&units=metric&appid=${api.key}`)
        .then(res => res.json())
        .then(result => {
        setQuery('');
        buscaClima(result);     
      })
    } 
  }
  }
  

  const buscaClima = (searchData) => {

    if(searchData.length === 0) {
      const currentWeatherFetch = fetch(
        `${api.base}/weather?lat=-31.7699736&lon=-52.3410161&appid=${api.key}&units=metric`
      );
      const forecastFetch = fetch(
        `${api.base}/forecast?lat=-31.7699736&lon=-52.3410161&appid=${api.key}&units=metric`
      );
      Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather(weatherResponse);
        setForecastRes(forecastResponse.list);
        displayForecast(forecastResponse);
      })
    } else {
      const lat = searchData[0].lat;
      const lon = searchData[0].lon;
    const currentWeatherFetch = fetch(
      `${api.base}/weather?lat=${lat}&lon=${lon}&appid=${api.key}&units=metric`
    );
    const forecastFetch = fetch(
      `${api.base}/forecast?lat=${lat}&lon=${lon}&appid=${api.key}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        let description =  weatherResponse.weather[0].main;
          switch (description) {
            case 'Clear':
              description = 'Claro'
              break;
              case 'Rain':
                description = 'Chuva'
                break;
                case 'Clouds':
                  description = 'Nublado'
                  break;
                  case 'Thunderstorm':
                    description = 'Tempestade'
                    break;
                    case 'Drizzle':
                      description = 'Pouca chuva'
                      break;
                      case 'Snow':
                        description = 'Neve'
                        break;
          }
        const forecastResponse = await response[1].json();

        setCurrentWeather(weatherResponse);
        setCurrentDescription(description);
        setForecastRes(forecastResponse.list);
        displayForecast(forecastResponse);
      })
      .catch(console.log);
    }
  };

  function formataData(data) {
    var date = new Date(data * 1000);
    return date.getDate()+
          "/"+(date.getMonth()+1)+
          "/"+date.getFullYear()+
          " "+date.getHours();
  }

  async function displayForecast(forecast) {
    const forecastList = forecast.list;
    const dates = [];
    const newForecast = [];

    for (let i = 0; i < forecastList.length; i++) {
     

      const date = formataData(forecastList[i].dt);

        const { temp, temp_max, temp_min, humidity } = forecastList[i].main;
    
        newForecast.push({
                temp: temp,
                max: temp_max,
                min: temp_min,
                humidity: humidity,
                date
            }
        )
        dates.push(date);
       
    }
    setForecast(newForecast);
}

  return (
   
    <div className='app'>
      
    <main>
      
    <AppBar position="static" className="bar">
      <CssBaseline />
      <Toolbar className='toolbar' >
        <Typography variant="h5" className="name">
          WebWeather
        </Typography>
      </Toolbar>
    </AppBar>

    <br></br>

      <TextField
    className='searchBox' onChange={e => setQuery(e.target.value)} value={query} onKeyPress={buscaLatLon} label = "Procure uma cidade">
     </TextField>
     <br></br><br></br>
      {currentWeather && (
              <div className='currentWeather'>

            <Typography gutterBottom variant="h5" component="h2" align = "center" className="weatherDesc">
              {currentWeather.name}, {currentWeather.sys.country}
            </Typography>

            <div className='icon'>
            <img alt='' className='icon2' src= {`./icons/${currentWeather.weather[0].icon}.png`}/>
            </div>

            <Typography gutterBottom variant="body2" component="h2" align = "center" className="cityTemp">
            <DeviceThermostatIcon></DeviceThermostatIcon>{(currentWeather.main.temp).toFixed()}°C
            </Typography>



             <Typography gutterBottom variant="body2" component="h2" align = "center" className="weatherFeelsLike">
              Sensação térmica: {(currentWeather.main.feels_like).toFixed()}°C
            </Typography>

             <Typography gutterBottom variant="body2" component="h2" align = "center" className="tempMax">
             <NorthIcon fontSize="small"></NorthIcon> {currentWeather.main.temp_max}°C
            </Typography>

             <Typography gutterBottom variant="body2" component="h2" align = "center" className="tempMin">
              <SouthIcon fontSize='small'></SouthIcon> {currentWeather.main.temp_min}°C 
            </Typography>

            <Typography gutterBottom variant="body2" component="h2" align = "center" className="cityTemp">
            <WaterIcon></WaterIcon> {currentWeather.main.humidity}%
            </Typography>

            {currentDescription && (
            <Typography gutterBottom variant="body2" component="h2" align = "center" className="weatherDescription"> {currentDescription}
            </Typography>
            )}
            </div>
             
      )}



          {forecast && (
          <div>

        
<Grid container direction="row" justifyContent="center" alignItems="center"  className="container"  columnSpacing={1}  >

      { forecast.map((f, index) => (
       <div key={index} className="all">
        <Grid  item component = {Card} className="card" >
          <CardContent>
        <Typography gutterBottom variant="h7" component="h5" align = "center"  className="forecast">
          { f.date }h
          </Typography> 

          <Typography gutterBottom variant="body2" component="p" align = "center" className="max">
            <NorthIcon fontSize="small"></NorthIcon> { (f.max).toFixed() }°
      </Typography>

      <Typography gutterBottom variant="body2" component="p" align = "center" className="min">
        <SouthIcon fontSize='small'></SouthIcon>{ (f.min).toFixed() }°
      </Typography>

      <Typography gutterBottom variant="body2" component="p" align = "center" className="min">
        <WaterIcon className='waterIcon' fontSize='small'/> { f.humidity }%
      </Typography>

</CardContent>
      </Grid>
      </div>
    ))}

     </Grid>
     
    
     </div>
          )}
         
    </main>
    </div>
  );
}
  

export default App;