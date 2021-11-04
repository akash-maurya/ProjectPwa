import Image from 'next/image';

import style from '../styles/product.module.css';
import Cookies from "universal-cookie";
import axios from 'axios';
import Router from "next/router";
import router from 'next/router';


const CardItem = (props)=>{

const cookies = new Cookies();

const addItem = async (event)=>{

     event.preventDefault();
     const authToken = cookies.get('authToken');
     const header = {
      "Content-Type": "application/json",
       "authToken" : authToken,
    };

    if(authToken){
        const data = {name : props.title , amount : props.price};
        console.log(data);
        const addUrl =
          "https://licious-lite.herokuapp.com/api/Cart/updateOrder/inc";
       await axios.post(addUrl , data  , {headers : header})
        .then((res)=>{
             console.log(res.data);
             props.triggerPopup(event , res.data.message);
        })
        .catch((error)=>{
          router.reload(window.location.reload);
          console.log(error);
        })
    }
    
}


    return (
      <>
      

        <div className={style.card_container}>
          <div className={style.card_image}>
            <Image
              src={props.image}
              className={style.image}
              layout="fill"
              alt="picture"
            />
          </div>
          <div className={style.text_container}>
            <h2 className={style.title}>{props.title}</h2>

            <p>{props.description}</p>

            <div className={style.priceAndbutton}>
              <h3 className={style.price}>MRP : ₹{props.price} </h3>
              <a>
                <button onClick={addItem} className={style.button}>
                  Add to Cart
                </button>
              </a>
            </div>
          </div>
        </div>
      </>
    );
}

export default CardItem ;