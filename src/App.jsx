import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import LandingGrid, { Box } from './components/LandingGrid.jsx';
import SideBar from './components/SideBar.jsx';
import TodoPage from './components/TodoPage.jsx'
import JournalBlock from './components/JournalPage.js'
import PomodoroPage from './components/PomodoroPage.jsx'
import GPTBlock from './components/GPTBlock'
import CalBlock from './components/CalendarBlock.jsx';

function App() {
  const [showDashboard, setShowDashboard] = useState(true);
  return (
    <div className="h-screen flex flex-row w-screen dark-brown bg-bg text-txt">
       {/* SideBar */}
        <SideBar />

      {/* MAIN */}
      <main className="h-full w-full ml-24 p-4 overflow-x-auto ">
        <Routes>
          <Route path="/" element={<LandingGrid />} />
          <Route path="/todo" element={<TodoPage />} />
          <Route path="/journal" element={<JournalBlock />} />
          <Route path="/calendar" element={<CalBlock />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
          <Route path="/gpt" element={<GPTBlock />} />
        </Routes>

      </main>
    </div>

  )
}

export default App
