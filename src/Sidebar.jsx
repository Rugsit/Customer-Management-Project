import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect } from "react";
import { context } from "./App";
export default function Sidebar() {
  const {isSidebarShow, setIsSidebarShow} = useContext(context);


  return (
    <div className={"shadow-lg fixed top-0 bg-white bottom-0 left-0 w-fit p-3 z-10 -translate-x-full sm:translate-x-0 transition-all" + (isSidebarShow ? " translate-x-0" : "")}>
      <div className="flex justify-between items-center gap-x-4">
        <h1 className="text-2xl my-5 font-bold bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-clip-text text-transparent">Customer App</h1>
        <FontAwesomeIcon icon={faCircleXmark} className={"transition-all text-2xl text-red-500 sm:hidden sm:opacity-0" + (isSidebarShow ? " opacity-100" : " opacity-0")} onClick={() => {
          setIsSidebarShow(!isSidebarShow);
        }}/>
      </div>
      <p className="text-gray-500 mb-4">Main Menu</p>
      <div className="flex flex-col items-start">
        <button className="flex py-2 px-3  items-center gap-x-3 active:bg-zinc-200 rounded-lg w-full transition-all">
          <FontAwesomeIcon icon={faUser} className="text-zinc-400"/>
          <p>Customers</p>
        </button>
      </div>
    </div>
  );
}
