import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faMagnifyingGlass, faPenToSquare, faTrash, faBars } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { context } from "./App";
export default function Cutomers() {
  const {isPopupShow, setIsPopupShow, 
    customers, setCustomers, 
    isSidebarShow, setIsSidebarShow,
    loading, setLoading} = useContext(context);
  const searchRef = useRef(); 

  const fetchData = async () => {
    let response = await fetch("http://localhost:3000/customers");
    let data = await response.json();
    setCustomers(data);
  }

  const deleteCustomer = async (id) => {
    try {
      await fetch("http://localhost:3000/customers/" + id, {
        method: "DELETE",
      });
      setLoading({
        status: true,
        which: "DELETE",
        success: true
      })
      fetchData();
    } catch(err) {
      console.log(err);
      setLoading({
        status:true,
        which: "DELETE",
        success: false
      })
    }
  }

  const search = async () => {
    let keyword = searchRef.current.value;
    if (keyword == "") {
      fetchData();
    } else {
      let response = await fetch("http://localhost:3000/customers");
      let data = await response.json();
      let targetData = data.filter((item) => {
        let date = new Date(item.date_of_birth).toLocaleString().split(",")[0];
        if (item.first_name.includes(keyword) || 
        item.last_name.includes(keyword) ||
        date.includes(keyword) ||
        item.phone.includes(keyword) ||
        item.email.includes(keyword) ||
        item.ban.includes(keyword) ) {
          return item;
        }
      })
      setCustomers(targetData);
      
    }
    
  }


  useEffect(() => {
    fetchData();
  }, [])
  return (
    <div className="p-7  sm:pl-56 relative">
      <div className="fixed bg-white top-0 left-0 right-0 p-4 sm:hidden shadow-lg">
        <FontAwesomeIcon icon={faBars} className="text-2xl text-zinc-500" onClick={() => {
          setIsSidebarShow(!isSidebarShow)
        }}/>
      </div>
      <h1 className="text-4xl mb-6 sm:mt-0 mt-16 ">Customers</h1>
      <div className="bg-white p-3 rounded-lg shadow-lg">
        <div className="gap-x-3 gap-y-3 w-full grid grid-cols-1 sm:flex">
          <button className="flex items-center bg-green-500 rounded-lg text-white px-4 py-2 active:bg-green-300" onClick={() => {
            setIsPopupShow({
              status:true,
              which: "ADD",
            });
          }}>
            <FontAwesomeIcon icon={faSquarePlus} className="mr-3 "/>
            <p>Create Customer</p>
          </button>
          <div className="flex items-center border-2 rounded-lg  w-full sm:max-w-60">
            <input placeholder="Search" className="p-2 focus:outline-none rounded-lg w-full"ref={searchRef} onChange={search}/>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2 text-zinc-400"/>
          </div>
        </div>
        <div className={"sm:block hidden overflow-x-auto overflow-y-hidden mt-4 rounded-lg relative " + (customers.length === 0 ? " h-44":"h-fit")}>
          <table className="border-collapse w-full table-auto">
            <thead>
              <tr className="text-nowrap bg-zinc-100 border-b-2">
                <th className="p-3">#</th>
                <th className="p-3">First Name</th>
                <th className="p-3">Last Name</th>
                <th className="p-3">Date of Birth</th>
                <th className="p-3">Phone Number</th>
                <th className="p-3">Email Name</th>
                <th className="p-3">B A N</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((item, index) => {
                let time = new Date(item.date_of_birth);
                return <tr key={index} className="">
                  <th className="p-3 font-normal ">{item.id}</th>
                  <th className="p-3 font-normal">{item.first_name}</th>
                  <th className="p-3 font-normal">{item.last_name}</th>
                  <th className="p-3 font-normal">{time.toLocaleString().split(",")[0]}</th>
                  <th className="p-3 font-normal">{item.phone}</th>
                  <th className="p-3 font-normal">{item.email}</th>
                  <th className="p-3 font-normal text-nowrap">{item.ban}</th>
                  <th className="p-3 font-normal text-zinc-400 text-nowrap">
                    <FontAwesomeIcon icon={faPenToSquare} className="mr-5 cursor-pointer hover:text-blue-400 transition-all" onClick={() => {
                      setIsPopupShow({
                        status: true,
                        which: "UPDATE",
                        data: {
                        id: item.id,
                        first_name: item.first_name,
                        last_name: item.last_name,
                        date_of_birth: time,
                        phone: item.phone,
                        email: item.email,
                        ban: item.ban
                        }
                      })
                    }}/>
                    <FontAwesomeIcon icon={faTrash} className="cursor-pointer hover:text-red-400 transition-all" onClick={() => {
                      deleteCustomer(item.id);
                    }}/>
                  </th>
                </tr>
              })}
            </tbody>
          </table>
          <div className={"absolute w-full flex justify-center transition-all " + (customers.length == 0 ? " visible translate-y-0" : " invisible translate-y-full overflow-hidden")}>
            <p className="text-2xl mt-6 mb-7">
              <button className="bg-gray-500 p-6 rounded-lg text-zinc-50 cursor-default opacity-70 shadow-lg">
                None of Customer
              </button>
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 mt-8 sm:hidden h-full">
        {customers.map((item) => {
          let time = new Date(item.date_of_birth);
          return (
            <div className="w-full bg-white p-4 rounded-lg shadow-lg" key={item.id}>
              <div className="flex justify-between">
                <p className="text-2xl font-bold mb-5">{item.first_name + " " + item.last_name}</p>
                <div className="text-zinc-400 text-lg">
                    <FontAwesomeIcon icon={faPenToSquare} className="mr-5 cursor-pointer hover:text-blue-400 transition-all" onClick={() => {
                      setIsPopupShow({
                        status: true,
                        which: "UPDATE",
                        data: {
                        id: item.id,
                        first_name: item.first_name,
                        last_name: item.last_name,
                        date_of_birth: time,
                        phone: item.phone,
                        email: item.email,
                        ban: item.ban
                        }
                      })
                    }}/>
                    <FontAwesomeIcon icon={faTrash} className="cursor-pointer hover:text-red-400 transition-all" onClick={() => {
                      deleteCustomer(item.id);
                    }}/>
                </div>
              </div>
              <p className="text-1xl font-bold">Date of Birth</p>
              <p>{item.date_of_birth}</p>
              <p className="mt-3 font-bold">Phone Number</p>
              <p>{item.phone}</p> 
              <p className="mt-3 font-bold">Email</p> 
              <p>{item.email}</p>
              <p className="mt-3 font-bold">Bank Account Number</p>
              <p>{item.ban}</p>
            </div>
          )
        })}
      </div>
    </div>
  );
}
