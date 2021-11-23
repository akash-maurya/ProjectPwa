import style from "../styles/cart.module.css";
import Cookies from "universal-cookie";
import axios from "axios";
import React , {useState} from 'react' ;
import LinearProgress from "@mui/material/LinearProgress";



const Item_bar = (props) => {
      const cookies = new Cookies();
      const [hide , setHide] = useState(false) ;
      const [quant ,setquant] = useState(props.quantity);
      const [price , setprice] = useState(props.amount);

      let hidden  = false ;

  const handleDelete = () => {
 
    const hitUrl = `https://lite-licious.herokuapp.com/api/Cart/deleteItem`;
    const authToken = cookies.get("authToken");
    const header = {
      "Content-Type": "application/json",
      "authToken": authToken,
    };
   const data  = {"itemID" : props.itemID};
   //console.log(data);
    if (authToken) {
    
      
      axios
        .put(hitUrl, data ,{
          headers: header,
        })
        .then((response) => {
          setHide(true);
          hidden = true ;
          //console.log(hidden);
          props.handle_snack();
          props.decrease_cost(props.amount*quant);
          //console.log("item deleted successfully");
          
          return true;
        })
        .catch((err) => {
          props.check_network();
          //console.log("error occured " );
          //console.log(err);
        });
    }
    else{
      const item_key = props.itemId;
      deleteItem("cart" , item_key)
      .then(()=>{
        setHide(true);
        props.handle_snack();
        props.decrease_cost(props.amount * quant);
        //console.log("deleted");
      })
    }
  };

  
  const dec_item = async()=>{

       
    if(quant == 1){
      const check = handleDelete();
      if(check){
        return true;
      }
      return;
    }
       

       const hitUrl = `https://lite-licious.herokuapp.com/api/Cart/updateOrder/dec`;

       const authToken = cookies.get("authToken");
       const header = {
         "Content-Type": "application/json",
         "authToken": authToken,
       };

       const data = { name: props.name, itemId :  props.itemId , amount: props.amount };

       //console.log(data);

       if (authToken) {
         axios
           .post(hitUrl, data, {
             headers: header,
           })
           .then((response) => {
           
           
                  setquant((prevVal) => {
                    return prevVal - 1;
                  });
                  setprice((prevVal) => {
                    return prevVal - props.amount;
                  });
                  //console.log("decreasing cost")
                  props.decrease_cost(props.amount);
           })
           .catch((err) => {
             props.check_network();
             //console.log(err);
           });
       }
       else{
          let qt = 1;
          
          await readallData("cart").then(async (data) => {
            for (var item of data) {
              if (item.name === props.itemId) {
                qt = item.quantity - 1;
                
                await deleteItem("cart", item.name).then(() => {
                  //console.log("updating item..");
                });
                break;
              }
            }
          });
          const data = { name: props.name, itemId : props.itemId ,amount: props.amount, quantity: qt };
          writedata("cart", data).then(() => {
              setquant((prevVal) => {
                return prevVal - 1;
              });
              setprice((prevVal) => {
                return prevVal - props.amount;
              });
               props.decrease_cost(props.amount);
            //console.log("item quanity decreased");
          });
        
       }
   
  }

  const incrementItem = async()=>{
      const hitUrl = `https://lite-licious.herokuapp.com/api/Cart/updateOrder/inc`;

      const authToken = cookies.get("authToken");
      const header = {
        "Content-Type": "application/json",
        "authToken": authToken,
      };

      const data = { name: props.name, amount: props.amount/quant };
      //console.log(data);
      if (authToken) {
        axios
          .post(hitUrl, data, {
            headers: header,
          })
          .then((response) => {
            //console.log("item incremented successfully");
               setquant((prevVal) => {
                 return prevVal + 1;
               });
               setprice((prevVal) => {
                 return prevVal + props.amount;
               });

               //console.log("price increasing");
               props.increase_cost(props.amount);
              
          })
          .catch((err) => {
            props.check_network();
            //console.log("something went wrong")
            //console.log(err);
          });
      }
      else{
        let qt = 1;

        await readallData("cart").then(async (data) => {
          for (var item of data) {
            if (item.name === props.name) {
              qt = item.quantity + 1;

              await deleteItem("cart", item.itemId).then(() => {
                //console.log("updating item..");
              });
              break;
            }
          }
        });
        const data = { name: props.name, itemId :  props.itemId , amount: props.amount, quantity: qt };
        writedata("cart", data).then(() => {
          setquant((prevVal) => {
            return prevVal + 1;
          });
          setprice((prevVal) => {
            return prevVal + props.amount;
          });
           props.increase_cost(props.amount);
          //console.log("item quanity increased");
        });
      }

  }

  return (
    <>
      <div
        style={
          hide === true
            ? { display: "none", transition: "all 1s ease-out" }
            : {}
        }
        className={style.product_container}
      >
        <h2>{props.name}</h2>

        <div className={style.flex_container}>
          <p>₹{props.amount * quant}</p>

          <p>
            <button onClick={dec_item} className={style.dec_button}>
              -
            </button>
            <span className={style.quantity}>{quant}</span>
            <button onClick={incrementItem} className={style.inc_button}>
              +
            </button>
          </p>

          <button className={style.delete} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default Item_bar;
