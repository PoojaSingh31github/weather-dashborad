import React, { useState } from 'react'
import './App.css'
import WeatherApp from './components/Weather'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SingleCountry from './components/SingleCountry'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<WeatherApp />} />
          <Route path='/country' element={<SingleCountry />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
