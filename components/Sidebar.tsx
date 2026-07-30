import { Bell, House, Settings, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import {useState} from "react";
import axios from "axios";

const ICONS = {
    House,
    Settings,
    Users,
    Bell,
    Info,
};


export default function Sidebar() {
    const [sidebarItems, setSidebarItems] = useState([]);
    const pathname = usePathname();
    

    useEffect(() => {

    }, [])

    return (
        <div className="relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 w-64">
            <div className="h-full bg-[#1e1e1e] backdrop-blur-md p-4 flex flex-col"></div>
        </div>
    )
}