import './index.css'; // or './main.css'
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom'

import LandingGrid, { Box } from './components/LandingGrid.jsx';
import SideBar from './components/SideBar.jsx';
import TodoPage from './components/TodoPage.jsx'
import JournalBlock from './components/JournalBlock'
import TimerBlock from './components/TimerBlock'
import GPTBlock from './components/GPTBlock'
import CalBlock from './components/CalendarBlock.jsx';
// App.jsx


export default function App() {
  const [showDashboard, setShowDashboard] = useState(true);
  return (
    <div className="h-screen flex flex-row w-screen">
       {/* SideBar */}
        <SideBar />

      {/* MAIN */}
      <main className="h-full w-full ml-24 p-4 overflow-x-auto">
        <Routes>
          <Route path="/" element={<LandingGrid />} />
          <Route path="/todo" element={<TodoPage />} />
          <Route path="/journal" element={<JournalBlock />} />
          <Route path="/calendar" element={<CalBlock />} />
          <Route path="/timer" element={<TimerBlock />} />
          <Route path="/gpt" element={<GPTBlock />} />
        </Routes>

        
      </main>
      
      

      {/* FOOTER (optional) */}
      {/* <footer className="h-12 p-4 text-sm text-center text-gray-500 bg-white">Footer</footer> */}
      
    </div>

  )
}
