
import { ThemeProvider } from '@emotion/react'
import { findLocation } from './utils/helper';
import React, { useState, useEffect, useMemo } from "react";
import useWeatherAPI from './hooks/useWeatherAPI';
import styled from "@emotion/styled";
import WeatherCard from "./views/WeatherCard";
import WeatherSetting from './views/WeatherSetting';

const theme = {
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  }
}

const Container = styled.div`
  background-color: ${({theme}) => theme.backgroundColor};
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const authorizationKey = process.env.REACT_APP_AUTHORIZATION_KEY

function App() {
  const storageCity = localStorage.getItem('cityName') ?? '臺北市'

  const [currentTheme, setCurrentTheme] = useState('light')

  const [currentPage, setCurrentPage] = useState('WeatherCard')

  const [currentCity, setCurrentCity] = useState(storageCity)
  
  // 使用useMemo把資料保存下來  
  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity]) 

  const { cityName, locationName } = currentLocation

  const [weatherElement, fetchData] = useWeatherAPI({
    locationName: locationName,
    cityName: cityName,
    authorizationKey: authorizationKey 
  })

  const handleChangeTheme = (type) => {
    return () => type === 'light' ? setCurrentTheme('dark') : setCurrentTheme('light')
  }

  const handleCurrentPage = (currentPage) => {
    setCurrentPage(currentPage)
  }

  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity)
  }

  // 一個元件中可以根據需要使用多個useEffect，可根據程式邏輯或者dependencies會相依到的變數建立多個不同的useEffect
  useEffect(() => {
    setCurrentTheme(weatherElement.moment === 'day' ? 'light' : 'dark')
  }, [weatherElement.moment])

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (
          <WeatherCard 
            cityName={cityName}
            weatherElement={weatherElement}
            fetchData={fetchData}
            currentTheme={currentTheme}
            handleChangeTheme={handleChangeTheme}
            handleCurrentPage={handleCurrentPage}
          />
        )}
        {currentPage === 'WeatherSetting' &&  
          <WeatherSetting 
            cityName={cityName}
            handleCurrentPage={handleCurrentPage} 
            handleCurrentCityChange={handleCurrentCityChange} 
          />}
      </Container>
    </ThemeProvider>
  );
}

export default App;
