import Image from "next/image";
import Script from "next/dist/client/script";
import style from "../styles/product.module.css";
import Cookies from "universal-cookie";
import axios from "axios";
import router from "next/router";

const CardItem = (props) => {
  const cookies = new Cookies();

  const addItem = async (event) => {
    event.preventDefault();
    const authToken = cookies.get("authToken");
    const header = {
      "Content-Type": "application/json",
      "authToken": authToken,
    };

    if (authToken) {
      const data = { name: props.title, amount: props.price };
      console.log(data);

      const addUrl = "https://lite-licious.herokuapp.com/api/Cart/updateOrder/inc";
      await axios
        .post(addUrl, data, { headers: header })
        .then((res) => {
          console.log(res.data);
          props.triggerPopup(event, res.data.message,props.title);
        })
        .catch((error) => {
          router.reload(window.location.reload);
          console.log(error);
        });
     }
     else{

       let qt = 1 ;
       let resmessage = "item added successfully";
       await readallData("cart")
        .then( async (data)=>{
          for(var item of data){
             if(item.name === props.title){
                qt = item.quantity +1 ;
                resmessage = "item quantity increased";
                await deleteItem("cart" , item.itemId)
                .then(()=>{
                  console.log("updating item..");
                })
                break ;
                
             }
          }
        })
       const data = { name :  props.title , itemId :  props.itemId , amount :  props.price , quantity :  qt};
        writedata("cart" , data)
        .then(()=>{
          props.triggerPopup(event, resmessage,props.title);
          console.log("item added for guest ");
        })
        
     }
  };

  return (
    <>
      <Script src="/idb.js"></Script>
      <Script src="/utility.js"></Script>

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

          <p>{props.description.slice(0, 60)}</p>

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
};

export default CardItem;
