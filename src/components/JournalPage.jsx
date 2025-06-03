import React from 'react';
import { useState } from 'react';


export default function JournalBlock() {
  const [num, setnum] = useState([5]);


  return (
  <div className="flex justify-start items-start">
    <h1 className="bg-green-500
    transform hover:translate-x-10 z-20"
    >
      It works! { num }
    </h1>
    <button 
      onClick={() => setnum([...num, num.length + 1])}
      className="p-2 bg-blue-500 text-white rounded-md ml-4 z-10"
      >b</button>
  </div>
  )}