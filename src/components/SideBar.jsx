import { useNavigate } from 'react-router-dom'
import { House, CheckCircle, NotebookPen, CalendarCheck, BotMessageSquare, AlignJustify, Timer, BrushCleaning } from 'lucide-react';

export default function SideBar() {
    return (
        <div>
        <header className="
            h-full ml-4 fixed
            bg-bg border-l-4 border-r-4 border-border 
            flex flex-col justify-start items-center">

                <SideBarItem Icon={AlignJustify} />
                <SideBarItem Icon={House} label="Home" to="/" />
                <SideBarItem Icon={CheckCircle} label="To-Do" to="/todo" />
                <SideBarItem Icon={NotebookPen} label="Journal" to="/journal" />
                <SideBarItem Icon={CalendarCheck} label="Calendar" to="/calendar" />
                <SideBarItem Icon={Timer} label="Pomodoro" to="/pomodoro" />
                <SideBarItem Icon={BotMessageSquare} label="GPT" to="/gpt" />
            </header>
        </div>
    )
}

export function SideBarItem({ Icon, label, to }) {
    const navigate = useNavigate()

    return (
        <button 
        onClick={() => navigate(to)} 
        className="flex flex-col items-center group -2">
            <Icon
            size={40}
            className="p-2 rounded-lg my-1
            bg-bg text-txt
            hover:bg-bg-secondary hover:text-txt-secondary
            transition-colors duration-300 
            cursor-pointer "
            />
            <span className="
            text-xs -mt-1.5 opacity-0 group-hover:opacity-100 transition">{label}</span>
        </button>
    )
}