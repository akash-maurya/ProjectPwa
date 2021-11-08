
import React  , {useState , useEffect} from 'react';
import Cookies from "universal-cookie";
import axios from "axios";
import Image from 'next/dist/client/image';
import style from '../../styles/checkout.module.css';
import Fallback from '../../components/fallback';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import Backbutton from '../../public/Back_button.png' ;
import CircularProgress from "@mui/material/CircularProgress";

const Checkout = ()=>{

   const [proceed , setProceed ] = useState(true);
   const [items , setItems]  = useState([]);
   const [showfallback , setfallback] =useState(false);
   const cookies = new Cookies();



const getOrderItems = async() => {
  const hitUrl = "https://licious-lite.herokuapp.com/api/Cart/getCartItems";
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

        
          setItems(response.data);
         
       
      })
      .catch((err) => {
        setfallback(true);
        console.log(err);
      });
  }
};


const updateAddprensent = async()=>{  
  const hitUrl = "https://licious-lite.herokuapp.com/api/update/getdetails";
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
      
      if (response.data.success === true) {
        
          if(response.data.data.address.trim().length !== 0){
            // console.log(response.data.data.address);
            getOrderItems();
          }
          else{
            setProceed(false);
          }

      }
    })
    .catch((err) => {
      setfallback(true);
      console.log(err);
    });
}
}

useEffect(() => {
 updateAddprensent();
},[]);


const ItemBox = (props)=>{

  return <>
          <div className = {style.item_container}>
            <h1 className = {style.item_heading}>
              {props.name}
            </h1>
          </div>
    </>
}


    return (
      <>
        { !showfallback && !items.length && proceed && (
          <CircularProgress
            sx={{
              marginTop: "7rem",
              marginLeft: "50%",
              color: "red",
            }}
          />
        )}

        {items.length && !showfallback && proceed && (
          <div className={style.success_container}>
            <Link href="/cart" passHref>
              <FontAwesomeIcon
                className={style.backbutton}
                icon={faChevronLeft}
              ></FontAwesomeIcon>
            </Link>
            <p className={style.order_placed}>
              Your order has been placed successfully
            </p>
          </div>
        )}

        {items.length && proceed && (
          <div className={style.flex_container}>
            {items.map((item) => {
              return <ItemBox key={item._id} name={item.name} />;
            })}
          </div>
        )}

        {!proceed && !showfallback && (
          <div className={style.fail_container}>

           <div  className = {style.flex_box}>
            <Link href="/cart" passHref>
             
                <FontAwesomeIcon
                  className={style.backbutton}
                  icon={faChevronLeft}
                ></FontAwesomeIcon>
             
            </Link>
       

            <p className={style.failed}> Failed to place the order</p>
          </div>
            <div className={style.failed_message}>
              <h1>Please Fill your address to complete your order</h1>
            </div>

            <Link href="/profile" passHref>
              <button className={style.update_button}>
                Update your address
              </button>
            </Link>
          </div>
        )}
        {showfallback && <Fallback />}
      </>
    );


}
export default Checkout;