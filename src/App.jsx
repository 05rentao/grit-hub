import './index.css'; // or './main.css'

import TodoBlock from './components/TodoBlock'
import TimerBlock from './components/TimerBlock'
import JournalBlock from './components/JournalBlock'
import GPTBlock from './components/GPTBlock'
// App.jsx

export default function App() {
  return (
    <div className="grid gap-4 p-4">
      <TodoBlock />
      <TimerBlock />
      <JournalBlock />
      <GPTBlock />
    </div>
  )
}
