import style from "../styles/cart.module.css";
import Cookies from "universal-cookie";
import axios from "axios";
import React , {useState} from 'react' ;
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

const Item_bar = (props) => {



const cookies = new Cookies();
const [hide , setHide] = useState(false) ;
const [show ,setshow] =  useState(false);
const [quant ,setquant] = useState(props.quantity);
const [price , setprice] = useState(props.amount);

let hidden  = false ;

const customcss = {
  display : "none" ,
  transition: "all 10s ease-out"
}

const handleDelete = () => {
 
    const hitUrl = `https://licious-lite.herokuapp.com/api/Cart/deleteItem`;
    const authToken = cookies.get("authToken");
    const header = {
      "Content-Type": "application/json",
      "authToken": authToken,
    };
   const data  = {"itemID" : props.itemId};
   console.log(data);
    if (authToken) {
    
      
      axios
        .put(hitUrl, data ,{
          headers: header,
        })
        .then((response) => {
          setshow(true);
          hidden = true ;
          console.log(hidden);
          setHide( true );
          props.decrease_cost(props.amount*quant);
          console.log("item deleted successfully");
          setTimeout(() => {
            setshow(false);
          }, 1000);
          return true;
        })
        .catch((err) => {
          props.check_network();
          console.log(err);
        });
    }
  };

  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }

  const dec_item = ()=>{

       
    if(quant == 1){
      const check = handleDelete();
      if(check){
        return true;
      }
      return;
    }
       

       const hitUrl = `https://licious-lite.herokuapp.com/api/Cart/updateOrder/dec`;

       const authToken = cookies.get("authToken");
       const header = {
         "Content-Type": "application/json",
         "authToken": authToken,
       };

       const data = { name: props.name, amount: props.amount };

       console.log(data);

       if (authToken) {
         axios
           .post(hitUrl, data, {
             headers: header,
           })
           .then((response) => {
           
            //  console.log("item decremented successfully");
                  setquant((prevVal) => {
                    return prevVal - 1;
                  });
                  setprice((prevVal) => {
                    return prevVal - props.amount;
                  });
                  console.log("decreasing cost")
                  props.decrease_cost(props.amount);
           })
           .catch((err) => {
             props.check_network()
             console.log(err);
           });
       }
   
  }

  const incrementItem = ()=>{
      const hitUrl = `https://licious-lite.herokuapp.com/api/Cart/updateOrder/inc`;

      const authToken = cookies.get("authToken");
      const header = {
        "Content-Type": "application/json",
        "authToken": authToken,
      };

      const data = { name: props.name, amount: props.amount/quant };
      console.log(data);
      if (authToken) {
        axios
          .post(hitUrl, data, {
            headers: header,
          })
          .then((response) => {
            console.log("item incremented successfully");
               setquant((prevVal) => {
                 return prevVal + 1;
               });
               setprice((prevVal) => {
                 return prevVal + props.amount;
               });

               console.log("price increasing");
               props.increase_cost(props.amount);
              
          })
          .catch((err) => {
            props.check_network();
            console.log("something went wrong")
            console.log(err);
          });
      }

  }

  return (
    <>
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
          sx={{ width: "100%", bgcolor: "rgb(64, 158, 64)", color: "white" }}
        >
          Item deleted successfully
        </Alert>
      </Snackbar>

      <div
        style={
          hide === true
            ? { display: "none", transition: "all 1s ease-out" }
            : {}
        }
        className={style.product_container}
      >
        <h2>
          <span>Item</span> : {props.name}
        </h2>
        <p>
         
          <span>Amount </span>: ₹{props.amount * quant}
        </p>
        <p>
        
          <button onClick={dec_item} className={style.dec_button}>
           -
          </button>
          <span className={style.quantity}>
         {quant}
          </span>
          <button onClick={incrementItem} className={style.inc_button}>
            +
          </button>
         
        </p>

        <button className={style.delete} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </>
  );
};

export default Item_bar;
