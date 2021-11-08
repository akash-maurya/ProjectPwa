
import style from '../../styles/cart.module.css';
import Cookies from "universal-cookie";
import axios from "axios";
import ItemBar from '../../components/itemBar';
import React , {useState , useEffect} from 'react';
import Link from 'next/link';
import Fallback from '../../components/fallback';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import CircularProgress from "@mui/material/CircularProgress";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const Cart = ()=>{
    
 
  const cookies  = new Cookies();
  const [items ,setItems] = useState([]);
  const [cost , settotalCost] = useState(0);
  const [numberOfitem ,setNumItems] = useState(0);
  const [isloading , setloading] = useState(true);
  const [nonetwork ,setnonetwork] = useState(false);
  const [show , setshow] = useState(false);



  const handle_snackbar = ()=>{

      setshow(true);

      setTimeout(() => {
        setshow(false);
      }, 1000);
  }


  async function getcartItems() {
 

  const authToken = cookies.get("authToken");
  const header = {
    "Content-Type": "application/json",
    "authToken": authToken,
  };

  const getUrl = "https://licious-lite.herokuapp.com/api/Cart/getCartItems";
  
  if (authToken) {
    await axios
      .get(getUrl, { headers: header })
      .then((response) => {
        const data = response.data;
        console.log(data);
        setItems(data) ;
        let count = 0;
        for (let i = 0; i < data.length; i++) {
          count = (count + data[i].amount* data[i].quantity);
        }
        settotalCost(count);
        
        setNumItems(data.length);
        setloading(false);
      })
      .catch((err) => {
        setnonetwork(true);
        console.log(err);
      });
  }
 
}


const active_fallback = ()=>{
    setnonetwork(true);
}

const toggle_load = ()=>{
  setloading((prevVal)=>{
    return !prevVal;
  })
}
useEffect(() => {
  getcartItems();
},[])

const dec_cost = (amount)=>{

    settotalCost((prevVal)=>{
      return prevVal -amount;
    })
}
const inc_cost =(amount)=>{
  settotalCost((prevVal)=>{
    return prevVal +amount;
  })
}

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}


const CheckoutBar = (props)=>{

  return (
    <>
      <div className={style.chekout_container}>
        <div className={style.checkout_footer}>
          <div className={style.cost}>
            <h2>Total : ₹{props.total} </h2>
          </div>
          <div>
            <Link href="/checkout" passHref>
              <button className={style.checkout_button}>
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}


//------------------------------ Cart JSX ---------------------------------
  return (
    <>
      <div className={style.header}>
        <Link href="/" passHref>
          <div>
            <FontAwesomeIcon
              className={style.back_arrow}
              icon={faChevronLeft}
            ></FontAwesomeIcon>
          </div>
        </Link>

        <p> Order Summary</p>
      </div>

      {!nonetwork && isloading && (
        <CircularProgress
          sx={{
            marginTop: "7rem",
            marginLeft: "50%",
            color: "red",
          }}
        />
      )}

      {show && (
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          TransitionComponent={TransitionLeft}
          open={show}
          autoHideDuration={1000}
        >
          <Alert
            severity="success"
            sx={{
              width: "100%",
              marginTop: "5rem",
              bgcolor: "rgb(64, 158, 64)",
              color: "white",
            }}
          >
            Item deleted successfully
          </Alert>
        </Snackbar>
      )}

      {!nonetwork && !isloading && (
        <div className={style.item_container}>
          {items.map((item) => {
            return (
              <ItemBar
                key={item._id}
                check_network={active_fallback}
                increase_cost={inc_cost}
                decrease_cost={dec_cost}
                active_load={toggle_load}
                handle_snack = {handle_snackbar}
                quantity={item.quantity}
                itemId={item._id}
                name={item.name}
                amount={item.amount}
                refresh={getcartItems}
              />
            );
          })}
        </div>
      )}
      {!nonetwork && !cost && !isloading && (
        <div>
          <button className={style.empty_cart}>Your Cart is Empty</button>
        </div>
      )}
      {cost && !nonetwork && <CheckoutBar total={cost} />}

      {nonetwork && <Fallback />}
    </>
  );
}

export default Cart ;