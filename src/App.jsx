import './index.css'; // or './main.css'
import React, { useState } from 'react';


import LandingGrid, { Box } from './components/LandingGrid.jsx';
import SideBar from './components/SideBar.jsx';
import TodoBlock from './components/TodoBlock'
import TimerBlock from './components/TimerBlock'
import JournalBlock from './components/JournalBlock'
import GPTBlock from './components/GPTBlock'
// App.jsx


export default function App() {
  const [showDashboard, setShowDashboard] = useState(true);
  return (
    <div className="h-screen flex flex-row ">

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto min-w-[700px]">
        <div className="h-full">
          <LandingGrid />
        </div>
      </main>
      
      {/* SideBar */}
      <SideBar />

      {/* FOOTER (optional) */}
      {/* <footer className="h-12 p-4 text-sm text-center text-gray-500 bg-white">Footer</footer> */}
      
    </div>

  )
}
