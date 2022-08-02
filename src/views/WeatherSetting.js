import React, { useState } from "react";
import styled from "@emotion/styled";
import { availableLocations } from "../utils/helper";

const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-sizing: border-box;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
`

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`

const StyleLabel = styled.label`
  display: block;
  font-size: 16px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.textColor};
`

const StyleSelect = styled.select`
  display: block;
  box-sizing: border-box;
  background: transparent;
  width: 100%;
  max-width: 100%;
  outline: none;
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
  box-shadow: none;
  border: 1px solid ${({ theme }) => theme.textColor};
  color: ${({ theme }) => theme.textColor};
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;
    font-size: 14px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`

const WeatherSetting = ({ handleCurrentPage, handleCurrentCityChange, cityName }) => {
  // controlled component 寫法
  const [locationName, setLocationName] = useState(cityName)

  const handleChange = (event) => {
    setLocationName(event.target.value)
  }

  // uncontrolled component 寫法，透過useRef指稱到input欄位，資料是保存在瀏覽器本身的input，並透過current.value取得欄位的值
  // 若要定義預設值，可以在input欄位使用 defaultValue="臺南市"，預設值就會定義成功
  // const inputLocationRef = useRef(null)

  const handleSave = () => {
    handleCurrentCityChange(locationName)
    handleCurrentPage('WeatherCard')
    localStorage.setItem('cityName', locationName)
  }

  return (
    <WeatherSettingWrapper>
      <Title>設定</Title>
      <StyleLabel htmlFor="location">地區</StyleLabel>
      <StyleSelect 
        id="location" 
        name="location" 
        defaultValue="澎湖縣" 
        value={locationName}
        onChange={handleChange}
      >
        {availableLocations.map((location) => (
          <option value={location.cityName} key={location.cityName}>
            {location.cityName}
          </option>
        ))}
      </StyleSelect>
      <ButtonGroup>
        <Back onClick={() => handleCurrentPage('WeatherCard')}>返回</Back>
        <Save onClick={handleSave}>儲存</Save>
      </ButtonGroup>
    </WeatherSettingWrapper>
  )
}

export default WeatherSetting