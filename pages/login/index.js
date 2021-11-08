import style from "../../styles/login.module.css";
import Image from "next/image";
import logo from "../../public/Licious-Logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes} from "@fortawesome/free-solid-svg-icons";

import axios  from "axios";
import React , {useState} from "react";
import Cookies from 'universal-cookie';

const Login = (props) => {

  const cookies = new Cookies();
  const [showOTPbox , setOTPbox]  = useState(false);
  const [phonenumber , setPhoneNumber] = useState(0);
  const [showInvalid , setInvalid] = useState(false);
  const [userConfirmed ,setUserConfirmed] = useState(false);
  const [showInvalidOTP , setInvalidOTP] = useState(false);
  const [OTP , setOTP] = useState(0);
  const [hash , setHash] = useState("");
  const[showNetworkError ,setNetworkError] = useState(false);
  // const [disableButton , setDisableButton] = useState(true);

  async function  SentOTP(phonenumber){
        const data = {number : phonenumber };
        let resp = "";
        const headerVal = {
          Accept: "application/json",
          "Content-Type" : "application/json"
        }
        console.log("Fetch fun");
        await axios
          .post(
            `https://licious-lite.herokuapp.com/api/auth/login/sendOTP`,
            data,
            {
              headers: headerVal,
            }
          )
          .then((result) => {
            // console.log(result);
            resp = result;
          })
          .catch((error) => {
            console.log(error);
          });
        return resp;
  }

  async function VerifyOTP(phonenumber , OTP , hash){
    const data = {phonenumber : phonenumber , OTP : OTP , sessionId : hash} ;
    let resp = "";
   

   const url = "https://licious-lite.herokuapp.com/api/auth/login/verify";
    await axios.post(url , data)
    .then((result)=>{
       
        resp = result ;
    })
    .catch((error)=>{
      console.log(error);
    })
    return resp ;
  }
  

  const handleSubmit = async (event)=>{

    event.preventDefault() ;
    console.log(phonenumber);
    console.log(OTP);
    if(phonenumber.toString().length === 10){
          
            const res = await SentOTP(phonenumber);
           
           if(!res || res.data.success === false){
               setOTPbox(false);
               setNetworkError(true);
               setTimeout(()=>{
                  setNetworkError(false)
              }, 1500)
            }
          else
          {
           
             setNetworkError(false);
             setOTPbox(true);
             setInvalid(false);
             setHash(res.data.sessionId);
          
          }
          
           
    }
    else{
       setInvalid(true)
       setTimeout(()=>{
        setInvalid(false);
       },1500)
      }
  }



  const ConfirmOTP = async(event)=>{
     event.preventDefault();
    // const 
    const response = await VerifyOTP(phonenumber , OTP , hash) ;
    // console.log(response);
    if(!response || response.data.success === false){
          setInvalidOTP(true);
          // set
    }
    else{
      console.log(response.data);
      setUserConfirmed(true);
      setInvalid(false);
      setOTPbox(false);
      
      cookies.set('authToken' , response.data.AuthToken ,  {sameSite : 'Strict' ,path : '/' , expires : new Date(new Date().getTime() + 3600*24*180)}  );
      setTimeout(()=>{
          props.toggleLogin(event);
      }, 2000);
    }
  }

  const handlePhoneChange = async(event)=>{
      const number = event.target.value ;
       setPhoneNumber(number);
   
      setInvalid(false);
  
  }

  const handleChangeOTP = (event)=>{
       setOTP(event.target.value);
       console.log(OTP);

  }

  const handleclick = (event)=>{
   
    props.toggleLogin(event);
  }


  // check whether user is logged in or not


  return (
    <>
      <div className = {style.outer_layer}>
        <div className={style.container}>
          <div className={style.layer}>
            <div className={style.flexbox}>
             

              <button onClick={handleclick} className={style.toggleButton}>
                <FontAwesomeIcon
                  className={style.cross}
                  icon={faTimes}
                ></FontAwesomeIcon>
              </button>
            </div>
            <div className={style.login_box}>
              <form className={style.form}>
                <h2 className={style.animate}>Sign In / Sign Up</h2>
               
                <input
                  type="tel"
                  autoComplete="off"
                  placeholder="Enter Your phone number"
                  min="10"
                  max="10"
                  disabled={showOTPbox}
                  onChange={handlePhoneChange}
                />

                {showOTPbox && (
                  <input
                    type="password"
                    onChange={handleChangeOTP}
                    placeholder="Enter your OTP"
                  />
                )}

                {showInvalid && (
                  <button disabled id={style.invalid}>
                    Invlid number{" "}
                  </button>
                )}

                {showInvalidOTP && (
                  <button disabled id={style.invalid}>
                    Invalid OTP
                  </button>
                )}

                {showNetworkError && (
                  <button disabled id={style.invalid}>
                    Please connect to Internet, Can not login
                  </button>
                )}

                {showOTPbox && (
                  <button disabled id={style.specialButton}>
                    OTP has been sent successfully
                  </button>
                )}

                {userConfirmed && (
                  <button disabled id={style.specialButton}>
                    LoggedIn successfully
                  </button>
                )}

                {!showOTPbox && (
                  <button type="submit" onClick={handleSubmit}>
                    Proceed Via OTP
                  </button>
                )}

                {showOTPbox && (
                  <button onClick={ConfirmOTP}>Confirm OTP</button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
