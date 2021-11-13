import style from "../../styles/login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes} from "@fortawesome/free-solid-svg-icons";
import axios  from "axios";
import React , {useState} from "react";
import Cookies from 'universal-cookie';
import router from 'next/router';




const Login = (props) => {

  const cookies = new Cookies();
  const [showOTPbox , setOTPbox]  = useState(false);
  const [phonenumber , setPhoneNumber] = useState(0);
  const [showInvalid , setInvalid] = useState(true);
  const [userConfirmed ,setUserConfirmed] = useState(false);
  const [showInvalidOTP , setInvalidOTP] = useState(false);
  const [OTP ,setOTP] = useState(0);
  const [hash ,setHash] = useState("");
  const[showNetworkError ,setNetworkError] = useState(false);
  

  async function readGuestData() {
     
     await readallData('cart')
     .then(async data =>{
       
        for( let i = 0 ; i < data.length ; i++){
          const item = data[i];
          const product = {
            name: item.name,
            amount: item.amount,
            quantity: item.quantity,
          };
        const hitUrl = `https://lite-licious.herokuapp.com/api/Cart/addtoCart`;
        const header = {
           "Content-Type" : "application/json",
           "authToken" : cookies.get('authToken')
        }
        await axios.post(hitUrl , product , {headers : header})
        .then((res)=>{
          console.log("item added successfully" + res);
          deleteItem('cart',item.itemId);
        })
        .catch((err)=>{
          console.log("failed to add ");
        })
        if(i == data.length -1){
          setTimeout(()=>{
               router.push('/checkout');
          } , 2000)
           
        }
       }
       
     })
  }

  async function  SentOTP(phonenumber){
        const data = {number : phonenumber };
        let resp = "";
        const headerVal = {
          Accept: "application/json",
          "Content-Type" : "application/json"
        }
        
        await axios
          .post(
            `https://lite-licious.herokuapp.com/api/auth/login/sendOTP`,
            data,
            {
              headers: headerVal,
            }
          )
          .then((result) => {
            resp = result;
          })
          .catch((error) => {
            console.log(error);
          });
        return resp;
  }

  async function VerifyOTP(phonenumber , OTP , hash){
    const data = {phonenumber : phonenumber , OTP : OTP , sessionId : hash} ;
    let resp = '';
    const url = "https://lite-licious.herokuapp.com/api/auth/login/verify";
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
               props.handle_offline();
               props.toggleLogin(event); 
               return ;
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
    const response = await VerifyOTP(phonenumber , OTP , hash) ;  
    if(!response || response.data.success === false){
          setInvalidOTP(true);
          setTimeout(() => {
             setInvalidOTP(false);
          }, 1500);
    }
    else{
     
      setUserConfirmed(true);
      setInvalid(false);
      setOTPbox(false);
      
      cookies.set('authToken' , response.data.AuthToken ,  {sameSite : 'Strict' ,path : '/' , expires : new Date(new Date().getTime() + 3600*24*180)} );
      await readGuestData();
  
      window.location.pathname === '/cart'
      ? router.reload(window.location.pathname) : '';
      
      setTimeout(()=>{
          props.toggleLogin(event);
      }, 2000);
    }
  }

  const handlePhoneChange = async(event)=>{
       const number = event.target.value ;
       setPhoneNumber(number);
       if(number.length !== 10){
         setInvalid(true);
       }
       else if(number.length === 10){
         
        for(let i = 0 ; i < number.length ; i++){
          if(number[i] >= '0' && number[i] <= '9'){
            continue ;
          }
          else{
            setInvalid(true);
            return ;
          }
        }
        setInvalid(false);
        return ;
       }
  }

  const handleChangeOTP = (event)=>{
       setOTP(event.target.value);
       console.log(OTP);

  }

  const handleclick = (event)=>{ 
    props.toggleLogin(event);
  }

  function onlynumber(evt) {
   var theEvent = evt || window.event;

   // Handle paste
   if (theEvent.type === "paste") {
     key = event.clipboardData.getData("text/plain");
   } else {
     // Handle key press
     var key = theEvent.keyCode || theEvent.which;
     key = String.fromCharCode(key);
   }
   var regex = /[0-9]|\./;
   if (!regex.test(key)) {
     theEvent.returnValue = false;
     if (theEvent.preventDefault) theEvent.preventDefault();
   }
  }


  return (
    <>
      <div className={style.outer_layer}>
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
                  maxLength = '10'
                  disabled={showOTPbox}
                  onChange={handlePhoneChange}
                  onKeyPress = {onlynumber}
                />

                {showOTPbox && (
                  <input
                    type="password"
                    onChange={handleChangeOTP}
                    placeholder="Enter your OTP"
                  />
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
                  <button  style = { showInvalid ? { backgroundColor : "gray"} : {}} disabled = {showInvalid} type="submit" onClick={handleSubmit}>
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
