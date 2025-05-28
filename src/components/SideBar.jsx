import { House, CheckCircle, Brain, CalendarCheck, BotMessageSquare, AlignJustify } from 'lucide-react';

export default function SideBar() {
    return (
        <div>
            <h1 style={{ fontFamily: '"Zen Dots", cursive' }}>Manual Font Test</h1>

        <header className="
            h-full p-1 ml-4 
            bg-white border-l-4 border-black 
            flex flex-col justify-start items-center">
                <h2 className="mb-2 text-5xl font-zendy">GritHub</h2>

                <SideBarItem Icon={AlignJustify} />
                <SideBarItem Icon={House} />
                <SideBarItem Icon={CheckCircle} />
                <SideBarItem Icon={Brain} />
                <SideBarItem Icon={CalendarCheck} />
                <SideBarItem Icon={BotMessageSquare} />
            </header>
        </div>
    )
}

export function SideBarItem({ Icon }) {
    return (
        <Icon
            size={48}
            className="p-2 rounded-lg m-2
            bg-white text-black
            hover:bg-black hover:text-white
            transition-colors duration-300 
            cursor-pointer"
        />
    );
}
