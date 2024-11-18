import { useContext, useEffect, useRef, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { context } from './App';

export default function Popup() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  let {isPopupShow, setIsPopupShow, customers, setCustomers, loading, setLoading} = useContext(context);
  let firstNameRef = useRef();
  let lastNameRef = useRef();
  let dateOfBirthRef = useRef();
  let emailRef = useRef();
  let banRef = useRef();

  useEffect(() => {
    if (isPopupShow.which === "UPDATE" && isPopupShow.status !== false) {
      let rawDate = isPopupShow.data.date_of_birth;
      let resultDate = `${rawDate.getFullYear()}-${rawDate.getMonth() + 1 < 10 ? "0" + (rawDate.getMonth()+1) : rawDate.getMonth()+1}-${rawDate.getDate() < 10 ? "0" + rawDate.getDate() : rawDate.getDate()}`
      firstNameRef.current.value = isPopupShow.data.first_name;
      lastNameRef.current.value = isPopupShow.data.last_name;
      dateOfBirthRef.current.value = resultDate;
      setPhone(isPopupShow.data.phone);
      emailRef.current.value = isPopupShow.data.email;
      banRef.current.value = isPopupShow.data.ban
    }
  }, [isPopupShow])

  const validateForm = () => {
    if (firstNameRef.current.value.trim() === "" ||
        lastNameRef.current.value.trim() === "" || 
        dateOfBirthRef.current.value.trim() === "" ||
        phone === "" ||
        emailRef.current.value.trim() === "" ||
        banRef.current.value.trim() === ""){
      throw new Error("Input field must not be empty")
    }
  }

  const createCustomer = async () => {
    try{
      validateForm();
      const payload = {
        first_name: firstNameRef.current.value,
        last_name: lastNameRef.current.value,
        date_of_birth: dateOfBirthRef.current.value,
        phone: phone,
        email: emailRef.current.value,
        ban: banRef.current.value
      }

      let response = await fetch("http://localhost:3000/customers", {
        method: "POST",
        headers: {
         "Content-Type": "application/json", 
        },
        body: JSON.stringify(payload) 
      });

      let data = await response.json();
      payload.id = data.insertId;

      setCustomers([payload, ...customers]);
      setLoading({
        status: true,
        which: "ADD",
        success: true,
      })
      closePopup();
      setError("");
    } catch (err) {
      setError(err.message);
      setLoading({
        status: true,
        which: "ADD",
        success: false,
      })
    }
  }

  const updateCustomer = async () => {
    try{
      validateForm();
      const payload = {
        first_name: firstNameRef.current.value,
        last_name: lastNameRef.current.value,
        date_of_birth: dateOfBirthRef.current.value,
        phone: phone,
        email: emailRef.current.value,
        ban: banRef.current.value
      }

      let response = await fetch("http://localhost:3000/customers/" + isPopupShow.data.id, {
        method: "PUT",
        headers: {
         "Content-Type": "application/json", 
        },
        body: JSON.stringify(payload) 
      });

      let data = await response.json();
      setCustomers(data);
      setLoading({
        status: true,
        which: "UPDATE",
        success: true,
      })
      closePopup();
      setError("");
    } catch(err) {
      setLoading({
        status: true,
        which: "UPDATE",
        success: false,
      })
      setError(err.message);
    }
  }

  const closePopup = () => {
    setIsPopupShow({
      status: false,
      which: isPopupShow.which,
    });
    setTimeout(() => {
      firstNameRef.current.value = "";
      lastNameRef.current.value = "";
      dateOfBirthRef.current.value = "";
      setPhone("");
      emailRef.current.value = "";
      banRef.current.value = "";
    }, 500)
    setError("");
  }

  return (
    <div className=''>
      <div className={"fixed top-0 bottom-0 left-0 right-0 bg-black opacity-25 z-20 transition-all " + (isPopupShow.status ? " visible" : "invisible opacity-0")}></div>
      <div className={"fixed w-11/12 max-w-xl bg-white top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-lg p-4 shadow-lg transition-all " + (isPopupShow.status ? " visible opacity-100 scale-100" : " invisible opacity-0 scale-75")}>
        <p className={'font-bold text-2xl mb-3' + (isPopupShow.which === "ADD" ? " text-green-600" : " text-blue-600")}>{isPopupShow.which === "ADD" ? "Create " : "Update "} Customer </p>
        <p>Customer Name</p>
        <div className="grid grid-cols-1 gap-3 mt-2 mb-3 sm:grid-cols-2">
          <input className="w-full bg-zinc-100 p-2 rounded-lg focus:outline-none focus:outline-zinc-400 focus:" placeholder='First name' ref={firstNameRef}/>
          <input className="w-full bg-zinc-100 p-2 rounded-lg focus:outline-none focus:outline-zinc-400" placeholder='Last name' ref={lastNameRef}/>
        </div>
        <p className='mb-2'>Date of Birth</p>
        <input type="date" className='bg-zinc-100 p-2 mb-3 cursor-pointer rounded-lg w-full sm:w-1/2 outline-none focus:outline-zinc-400 ' ref={dateOfBirthRef}/>
        <p>Phone Number</p>
        <PhoneInput
        defaultCountry="ua"
        value={phone}
        onChange={(phone) => setPhone(phone)}
        className='mt-2 mb-3 w-full sm:w-1/2 '
        countrySelectorStyleProps={{
            buttonStyle:{
            padding: "10px"
            }
          }}
        inputStyle={{
            backgroundColor: "rgb(244 244 245)",
            fontSize: "1rem",
            lineHeight: "1.5rem",
            border: "none",
            padding: "8px",
            width: "100%"
          }}
      />
        <p>E-mail</p>
        <input type='email'className='p-2 focus:outline-none bg-zinc-100 mt-2 mb-3 w-full sm:w-1/2 outline-none focus:outline-zinc-400 rounded-lg' placeholder='example@gmail.com ' ref={emailRef}/> 
        <p>Bank Account Number</p>
        <input className='p-2 focus:outline-none bg-zinc-100 mt-2 mb-3 w-full sm:w-1/2 outline-none focus:outline-zinc-400 rounded-lg' placeholder='1-23-45-67-890' ref={banRef}/> 

        <p className='text-red-500'>{error}</p>
        <div className='grid grid-cols-2 gap-4 w-full sm:w-1/2 mt-2'>
        <button className={ 'py-2 w-full  text-white rounded-lg ' + (isPopupShow.which == "ADD" ? " bg-green-600 active:bg-green-500" : " bg-blue-500 active:bg-blue-500") } onClick={() => {
            if (isPopupShow.which == "ADD") {
              createCustomer();
            } else {
              updateCustomer();
            }
          }}>{isPopupShow.which == "ADD" ? "Create" : "Update"}</button>
        <button className='bg-zinc-300 py-2 w-full rounded-lg active:bg-zinc-200' onClick={closePopup}>Discard</button>
        </div>
      </div>
    </div>
    
  );
}
