import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Footer from '../src/components/Footer'
import Page from './components/Page'
import HomePage from './components/HomePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='d-flex flex-column min-vh-100'>
            <Navbar/>
            <Routes>
              <Route path='' element={<HomePage/>}/>
              <Route path='labs/*' element={<Page/>}/>
            </Routes>
            <Footer/>
          </div>
    </>
  )
}

export default App
