import style from "../../styles/header.module.css";
import Cookies from "universal-cookie";
import Link from "next/link";
import Login from "../login";
import React , {useState, useEffect} from 'react';
import axios from "axios";
import Badge from "@material-ui/core/Badge";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCartOutlined";

const Product = (props) => {

const [showlogin , setLogin] = useState(false);
const [CheckLogin , setCheckLogin] = useState(false);
const [showCart , setShowCart] = useState(false);
const [showfallback , setfallback] = useState(false);
const [name , setName] = useState("");
const cookies = new Cookies();


const CheckUserLogin= ()=>{

  const authToken = cookies.get('authToken');
  if(!authToken){
    setCheckLogin(false);
  }
  else if(authToken){
    setCheckLogin(true);
    getdetails();
  }
}


async function getdetails (){

const hitUrl = "http://localhost:3000/api/update/getdetails";
const authToken = cookies.get("authToken");
const header = {
  "Content-Type": "application/json",
  "authToken": authToken,
  
};

if (authToken) {
  await axios
    .get(hitUrl, {
      headers: header,
    })
    .then((response) => {
      // console.log(response.data);
      if(response.data.success === true){
            const resdata = response.data.data;

            if(resdata.name.lenght !== 0){
            const fname = resdata.name.split(" ");
            setName(fname[0]);
          }
      }
    })
    .catch((err) => {
      console.log(err);
        setfallback(true);

    });
  }
}

const toggleCart = (event )=>{
   event.preventDefault() ;
   setShowCart(!showCart);
}
  
const nonetwork = ()=>{
    props.handle_offline();
}

const handleclick = (event)=>{
   event.preventDefault();
   setLogin((prevVal)=>{
     return !prevVal ;
   })
   console.log(showlogin + "--");
}


useEffect(() => {
  CheckUserLogin(); 
}, [showlogin , CheckLogin ]);

  return (
    <>
      <div>
        <nav className={style.navbar}>
          <h1 className={style.heading}>
            <span className={style.blue}>Licious</span>
            <span className={style.green}>Lite</span>
          </h1>

          <div className={style.flex_box}>
            {!CheckLogin && !props.isloading && (
              <Link href="/login" passHref>
                <button onClick={handleclick} className={style.btn}>
                  Login
                </button>
              </Link>
            )}

            {!props.isoffline && !props.isloading && CheckLogin && (
              <Link href="/profilePage" passHref>
                <button className={style.profile_btn}>
                  
                 {  <span className={style.name}>Hi {name}</span>}
                </button>
              </Link>
            )}

            <Link href="/cart" passHref>
              <button disabled={(!CheckLogin || props.isOffline)&& props.cartItem === 0} className={style.btn}>
                <span>Cart </span>
                <Badge badgeContent={props.cartItem} color="secondary"> 
                  <ShoppingCartIcon fontSize="small" />
                </Badge>
              </button>
            </Link>
          </div>
          {showlogin && <Login 
          toggleLogin={handleclick}
          handle_offline = {nonetwork}
          />}
        </nav>
      </div>
    </>
  );
};

export default Product;
