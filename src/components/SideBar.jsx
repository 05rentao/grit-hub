import { useNavigate } from 'react-router-dom'
import { House, CheckCircle, Brain, CalendarCheck, BotMessageSquare, AlignJustify, Timer, BrushCleaning } from 'lucide-react';

export default function SideBar() {
    return (
        <div>
        <header className="
            h-full p-1 ml-4 mr-4 fixed
            bg-white border-l-4 border-r-4 border-black 
            flex flex-col justify-start items-center">

                <SideBarItem Icon={AlignJustify} />
                <SideBarItem Icon={House} label="Home" to="/" />
                <SideBarItem Icon={CheckCircle} label="To-Do" to="/todo" />
                <SideBarItem Icon={Brain} label="Journal" to="/journal" />
                <SideBarItem Icon={CalendarCheck} label="Calendar" to="/calendar" />
                <SideBarItem Icon={Timer} label="Pomodoro" to="/pomodoro" />
                <SideBarItem Icon={BotMessageSquare} label="GPT" to="/gpt" />
                <ResetButton />
            </header>
        </div>
    )
}

export function ResetButton() {
    return (
        <button 
        onClick={() => {
                        localStorage.removeItem('todo-lists');
                        window.location.reload(); // force React to reload with defaults
                    }}
        className="flex flex-col items-center group -2">
            <BrushCleaning 
                size={48}
                className="p-2 rounded-lg m-2
                bg-red-500 text-white
                hover:bg-red-700 hover:text-white
                transition-colors duration-300 
                cursor-pointer"
            />
            <span className="
            text-xs -mt-1.5 opacity-0 group-hover:opacity-100 transition flex flex-wrap ">Reset storage</span>
        </button>
    )
}

export function SideBarItem({ Icon, label, to }) {
    const navigate = useNavigate()

    return (
        <button 
        onClick={() => navigate(to)} 
        className="flex flex-col items-center group -2">
            <Icon
            size={48}
            className="p-2 rounded-lg m-2
            bg-white text-black
            hover:bg-black hover:text-white
            transition-colors duration-300 
            cursor-pointer"
            />
            <span className="
            text-xs -mt-1.5 opacity-0 group-hover:opacity-100 transition">{label}</span>
        </button>
    )
}