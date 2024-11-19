import { createContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Customers from "./Customers.jsx";
import Popup from "./Popup.jsx";
import Sidebar from "./Sidebar.jsx";

export const context = createContext(null);

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [isPopupShow, setIsPopupShow] = useState({
    status: false,
    which: "ADD",
    data: {}
  });
  const [loading, setLoading] = useState(false);
  const [isSidebarShow, setIsSidebarShow] = useState({
    status: false,
    which: "",
    success: true
  });

  useEffect(() => {
    if (loading.status === true) {
      setTimeout(() => {
        setLoading({
          status:false,
          which: loading.which,
          success: loading.success,
        })
      }, 3000)
    }
  }, [loading])

  return (
    <context.Provider value={{
      isPopupShow, setIsPopupShow,
      customers, setCustomers,
      isSidebarShow, setIsSidebarShow,
      loading, setLoading,
    }}>
      <div className="relative h-full min-h-screen">
        <Sidebar />
        <Customers />
        <Popup />
        <div className={"fixed bottom-5 right-4 p-3 bg-white shadow-lg rounded-lg flex justify-center items-center gap-3 loading transition-all " + (loading.status ? "" : " translate-y-20")}>
          <FontAwesomeIcon icon={loading.success ? faCircleCheck : faCircleXmark} className={loading.success ? "text-green-500" : "text-red-500"}/>
          <p>
            {loading.which === "ADD" ? "Create" : loading.which === "UPDATE" ? "Update" : "Delete"} {loading.success ? "successfully" : "fail"}
          </p>
        </div>
      </div>
  </context.Provider>
  )
}
