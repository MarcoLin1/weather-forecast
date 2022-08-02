import { DATE_FORMAT } from '../constant/date'
import { useState, useEffect, useCallback } from 'react'
import { calculateSunTime } from '../utils/helper'
import dayjs from 'dayjs'

const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
  // fetch api
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`)
    .then(response => response.json())
    .then(data => {
      // get response and filter
      const locationData = data.records.location[0]
      const weatherData = locationData.weatherElement.reduce((neededElements, item) => {
        if (['WDSD', 'TEMP'].includes(item.elementName)) {
          neededElements[item.elementName] = item.elementValue
        }
        return neededElements
      }, {})
      return {
        locationName: locationData.locationName,
        windSpeed: weatherData.WDSD,
        temperature: weatherData.TEMP,
        observationTime: locationData.time.obsTime
      }
    })
}

const fetchWeatherForecast = ({ authorizationKey, cityName }) => {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`)
    .then(response => response.json())
    .then(data => {
      const forecastLocationData = data.records.location[0].weatherElement
      const weatherElementData = forecastLocationData.reduce((neededElements, item) => {
        if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
          neededElements[item.elementName] = item.time[0].parameter
        }
        return neededElements
      }, {})
      return {
        description: weatherElementData.Wx.parameterName,
        weatherCode: weatherElementData.Wx.parameterValue,
        rainPossibility: weatherElementData.PoP.parameterName,
        comfortability: weatherElementData.CI.parameterName
      }
    })
}

const fetchWeatherSunriseAndSunset = ({ authorizationKey, cityName}) => {
  const date = dayjs().format(DATE_FORMAT)
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=${authorizationKey}&locationName=${cityName}&timeFrom=${date}`)
    .then(response => response.json())
    .then(data => {
      const dataLocation = data.records.locations.location[0]
      const time = dataLocation.time.map((time) => {
        const {sunrise, sunset} = time.parameter
          .filter((timeParameter) => ['日出時刻', '日沒時刻'].includes(timeParameter.parameterName))
          .reduce((accumulator, timeParameter) => {
            const objectKey = timeParameter.parameterName === '日出時刻' ? 'sunrise' : 'sunset'
            accumulator[objectKey] = timeParameter.parameterValue
            return accumulator
          }, {})
        
          return {
            dataTime: time.dataTime,
            sunrise,
            sunset
          }
      })

      return {
        locationName: dataLocation.locationName,
        time
      }
    })
    .then(({time}) => calculateSunTime(time))
}

const useWeatherAPI = ({ locationName, cityName, authorizationKey }) => {
  const [weatherElement, setWeatherElement] = useState({
    locationName: '',
    description: '',
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    observationTime: new Date(),
    comfortability: '',
    weatherCode: 0,
    isLoading: true,
    moment: 'night'
  })

  // useCallback可以保護該fn避免因為重新轉譯後再次建立新的函式 (因為call by reference)，把該fn保留下來
  const fetchData = useCallback(async () => {
    setWeatherElement((prevElement) => {
      return {
        ...prevElement,
        isLoading: true
      }
    })

    // await all data to fetch successfully, every fn return promise object 
    // promise all return array, so use 解構賦值取出回傳資料
    const [currentWeather, weatherForecast, moment] = await Promise.all([
      fetchCurrentWeather({ authorizationKey, locationName}),
      fetchWeatherForecast({ authorizationKey, cityName }),
      fetchWeatherSunriseAndSunset({ authorizationKey, cityName })
    ])

    setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        moment,
        isLoading: false
    }, [])
  }, [authorizationKey, locationName, cityName])

  // second parameter name = dependencies, it means something to be monitored, if it has change that will call the function in useEffect, if it has not change that will not to call it 
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return [weatherElement, fetchData]
}

export default useWeatherAPI