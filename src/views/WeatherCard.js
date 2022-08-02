import { ReactComponent as RainIcon } from '../images/rain.svg'
import { ReactComponent as AirFlowIcon } from '../images/airFlow.svg'
import { ReactComponent as RefreshIcon } from '../images/refresh.svg'
import { ReactComponent as LoadingIcon } from '../images/loading.svg'
import { ReactComponent as CogIcon } from '../images/cog.svg'
import { ReactComponent as LightModeIcon } from '../images/light-mode.svg'
import { ReactComponent as DarkModeIcon } from '../images/dark-mode.svg'
import WeatherIcon from "../components/WeatherIcon";
import React from "react";
import styled from "@emotion/styled";
import dayjs from "dayjs";

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({theme}) => theme.boxShadow};
  box-sizing: border-box;
  padding: 30px 15px;
`
const Location = styled.div`
  font-size: 28px;
  color: ${({theme}) => theme.textColor};
  margin-top: 20px;
`

const Description = styled.div`
  font-size: 16px;
  color:${({theme}) => theme.textColor};
  margin-bottom: 30px;
`

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`

const Temperature = styled.div`
  color: ${({theme}) => theme.textColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({theme}) => theme.textColor};
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({theme}) => theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({theme}) => theme.textColor};
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => isLoading ? '1.5s' : '0s'}
  }
`;

const Cog = styled(CogIcon)`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`

const LightMode = styled(LightModeIcon)`
  position: absolute;
  top: 15px;
  left: 15px;
  width: 20px;
  height: 20px;
  cursor: pointer;
`

const DarkMode = styled(DarkModeIcon)`
  position: absolute;
  top: 15px;
  left: 15px;
  width: 20px;
  height: 20px;
  cursor: pointer;
`

const WeatherCard = ({ 
  weatherElement, 
  fetchData, 
  handleChangeTheme, 
  currentTheme, 
  handleCurrentPage, 
  cityName
}) => {
  const {
    observationTime,
    temperature,
    windSpeed,
    description,
    weatherCode,
    rainPossibility,
    comfortability,
    isLoading,
    moment
  } = weatherElement
  
  return (
  <WeatherCardWrapper>
    <Cog onClick={() => handleCurrentPage('WeatherSetting')}/>
    <Location>{cityName}</Location>
    <Description>{description} {comfortability}</Description>
    <CurrentWeather>
      <Temperature>
        {Math.round(temperature)} 
        <Celsius>C</Celsius>
      </Temperature>
      <WeatherIcon weatherCode={weatherCode} moment={moment}/>
    </CurrentWeather>
    <AirFlow>
      <AirFlowIcon />
      {windSpeed} m/h
    </AirFlow>
    <Rain>
      <RainIcon />
      {rainPossibility}%
    </Rain>
    <Refresh 
      onClick={fetchData}
      isLoading={isLoading}
    >
      最後觀測時間：{new Intl.DateTimeFormat('zh-Tw', {
        hour: 'numeric',
        minute: 'numeric'
      }).format(dayjs(observationTime))}
      {isLoading ? <LoadingIcon /> : <RefreshIcon />}
    </Refresh>
    {currentTheme === 'light' && <LightMode onClick={handleChangeTheme(currentTheme)}/>}
    {currentTheme === 'dark' && <DarkMode onClick={handleChangeTheme(currentTheme)}/>}
  </WeatherCardWrapper>
  )
}

export default WeatherCard