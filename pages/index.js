import CardItem from '../components/Card_item';
import Script from 'next/script';
import style from '../styles/Home.module.css';
import Header from './header';
import axios from 'axios';
import Fallback from '../components/fallback';
import Cookies from "universal-cookie";
import Footer from '../components/footer';
import React , {useEffect, useState} from 'react';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import CircularProgress from '@mui/material/CircularProgress';
import Link  from 'next/dist/client/link';


const  Home = () =>{
  
  const [Items,setItems] = useState([]);
  const [load, setloader] = useState(true);
  const [showPopup , setPopup] = useState(false);
  const [nonetwork ,setnonetwork] =useState(false);
  const [titleofitem , setItemTitle] = useState('');
  const [message , setmessage] = useState('');
  const [totoalItem , setTotalItem] = useState(0);
  const cookies = new Cookies();


async function getItems(){
  await fetch("https://lite-licious.herokuapp.com/api/items/getItems", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((respone) => {
      return respone.json();
    })
    .then((item) => {
      const ItemsArray = item.map((itemdata) => {
        return {
          itemId: itemdata.itemId,
          title: itemdata.title,
          description: itemdata.description,
          price: itemdata.price,
          weight: itemdata.weight,
          image: itemdata.image,
        };
      });

      setItems(ItemsArray);
      setloader(false);
    })
    .catch((err) => {
      setloader(false);
      setnonetwork(true);
      console.log(err);
    });
 }


 function CountCart (){
  const authToken = cookies.get("authToken");
  const header = {
    "Content-Type": "application/json",
    "authToken": authToken,
  };

  const getUrl ='https://lite-licious.herokuapp.com/api/Cart/getCartItems';
  
  if (authToken) {
     axios
      .get(getUrl, { headers: header })
      .then((response) => {
       
        const data = response.data;
        setTotalItem(data.length);
      
      })
      .catch((err) => {
      
        console.log(err);
      });
  }
}

const readguestItem =()=>{

 if(!cookies.get('authToken')){
  readallData("cart") 
  .then((data)=>{
    setTotalItem(data.length);
  })
}
}


const nonetworkzone = ()=>{
  setnonetwork(true);
}

 const handSetPopup = ( event , message , title)=>{

   let string = "";
   if(message === "item added successfully"){
     string = " added successfully";
     setmessage("added to cart ");
   }
   else{
     string = 'quantity increased';
     setmessage("quantity increased");
   }
    event.preventDefault();
    setItemTitle(title);
    // console.log("helo" + message);
    if (message === "item added successfully"){
        setTotalItem((prevVal)=>{
          return prevVal+1;
        })
    }
    setPopup(true);
    setTimeout(() => {
      setPopup(false);
    }, 1500);
    
 }

useEffect(() => {
 
    getItems()
    CountCart();
    readguestItem();
  
 
}, [])

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}
 
  return (
    <div>
      <div>
        <Script src="https://use.fontawesome.com/bff91f34a4.js"></Script>

        <Header
          cartItem={totoalItem}
          isoffline={nonetwork}
          isloading={load}
          handle_offline={nonetworkzone}
        />
      </div>

      {showPopup && (
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          TransitionComponent={TransitionLeft}
          open={showPopup}
          autoHideDuration={2500}
        >
          <Alert
            severity="success"
            sx={{
              marginTop: "4rem",
              bgcolor: "rgb(64, 158, 64)",
              color: "white",
            }}
          >
            {console.log(titleofitem)}
            {titleofitem + " "+message} 
          </Alert>
        </Snackbar>
      )}

      {!nonetwork && (
        <div className={style.create_box}>
          {load && (
            <CircularProgress
              sx={{
                marginTop: "50vh",
                marginLeft: "50%",
                color: "red",
              }}
              color="secondary"
            />
          )}
          {!load && (
            <div className={style.grid_container}>
              {Items.map((item) => {
                return (
                  <CardItem
                    triggerPopup={handSetPopup}
                    key={item.itemId}
                    itemId={item.itemId}
                    title={item.title}
                    description={item.description}
                    image={item.image}
                    price={item.price}
                    weight={item.weight}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
      {!load && totoalItem > 0 ? (
        <div className={style.footerCart}>
          <div className={style.flexview}>
            <img src="/bluetick.png" className={style.bluetick}></img>
            <div>Added to Cart</div>
          </div>

          <Link href="/cart" passHref>
            <button className={style.cart_button}>View cart </button>
          </Link>
        </div>
      ) : (
        ""
      )}
      {nonetwork && <Fallback />}
      <Footer nonetwork={nonetwork} isloading={load} />
    </div>
  );
}

export default Home;
