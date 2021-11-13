import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import style from "../../styles/checkout.module.css";
import Fallback from "../../components/fallback";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.css";
import CircularProgress from "@mui/material/CircularProgress";
import router from "next/router";

const Checkout = () => {
  const [proceed, setProceed] = useState(true);
  const [items, setItems] = useState([]);
  const [showfallback, setfallback] = useState(false);
  const cookies = new Cookies();


  const clearCart = async ()=>{

    const hitUrl = `https://lite-licious.herokuapp.com/api/Cart/clearCart`;
    const authToken = cookies.get("authToken");
    const header = {
     "Content-Type": "application/json",
     authToken: authToken,
    };
    await axios.delete(hitUrl , { headers : header})
          .then((res)=>{
            // do nothing
            console.log("cart cleared...");
          })
          .catch((err)=>{
            console.log("cart did not clear..")
          })
    

  }

  const updateOrderCount = async()=>{
    const hitUrl = "https://lite-licious.herokuapp.com/api/update/orderCount";
    const authToken = cookies.get("authToken");
    const header = {
      "Content-Type": "application/json",
      "authToken": authToken,
    };
    console.log(authToken);
    const auth = cookies.get("authToken");
    const body = {
      "userAuth": auth,
    };

    if (authToken) {
      await axios
        .post(hitUrl, body, { headers: header })
        .then((res) => {
          console.log("Order Count increased");
          console.log(res);
        })
        .catch((err) => {
          console.log("Order Count updation failure");
          console.log(err);
        });
    }
  }

  const getOrderItems = async () => {
    const hitUrl = "https://lite-licious.herokuapp.com/api/Cart/getCartItems";
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
          const data = response.data;
          console.log(response);
          console.log(data);
          setItems(data);     
        })
        .catch((err) => {
          setfallback(true);
          console.log(err);
        });
    }
  };

  const updateAddprensent = async () => {
    const hitUrl = "https://lite-licious.herokuapp.com/api/update/getdetails";
    const authToken = cookies.get("authToken");
    const header = {
      "Content-Type": "application/json",
      authToken: authToken,
    };

    if (authToken) {
      await axios
        .get(hitUrl, {
          headers: header,
        })
        .then((response) => {
          if (response.data.success === true) {
            if (response.data.data.address.trim().length !== 0) {
              console.log(response.data.data.address);
              getOrderItems();
              setTimeout(() => {
                clearCart();
              }, 2000);
              updateOrderCount();
            } else {
              setProceed(false);
            }
          }
        })
        .catch((err) => {
          setfallback(true);
          console.log(err);
        });
    }
  };
  
  const redirectTocart = ()=>{
    console.log(" going out")
    router.push('/cart');
  }
  

  useEffect(() => {
    updateAddprensent();
  }, []);

  const ItemBox = (props) => {
    return (
      <>
      <li className="list-group-item">
        <div className="fs-5 text-center">
          <p className = {style.title}>{props.name}</p>
        </div>
      </li>
      </>
    );
  };
  return (
    <>
      {!items.length && proceed && (
        <CircularProgress
          sx={{
            marginTop: "7rem",
            marginLeft: "50%",
            color: "red",
          }}
        />
      )}

      {items.length && !showfallback && proceed ? (
        <div>
          <div
            className="d-flex justify-content-between text-center "
            style={{ background: "#e41d36" }}
          >
            <div
              className="p-2 bd-highlight align-self-center"
              style={{ color: "#fff" }}
            >
              <button
                onClick={redirectTocart}
                style={{
                  cursor: "pointer",
                  border: "none",
                  outline: "none",
                  backgroundColor: "#e41d36",
                  color: "#fff",
                  zIndex: "10",
                  width : "2rem"
                }}
              >
                <FontAwesomeIcon
                  className={style.back_icon}
                  icon={faChevronLeft}
                ></FontAwesomeIcon>
              </button>
            </div>

            <div className="py-2 flex-grow-1" style={{ marginLeft: "-20px" }}>
              <h2 className={style.heading}>Order Placed</h2>
            </div>
          </div>
          <div className=" text-center">
         
            <div className={style.success_box}>
              <h2>Congratulations</h2>
              <p>
                Your Order placed successfully{" "}
                <img className={style.checkicon} src="/Success.svg"></img>
              </p>
            </div>
 <br></br>
<div className="text-center">
              <Link href="/" passHref>
                <button className="btn btn-danger my-2">Go to Home</button>
              </Link>
            </div>
<br></br>
          </div>
        </div>
      ) : (
        ""
      )}
      
     

      {items.length && proceed ? (
        <div className={`container-sm ${style.itemlist}`}>
          <div className="card text-center">
            <div className="card-header text-center">
              <p className = {style.order_sum}>Order Summary</p>
            </div>
            <div className="list-group list-group-flush">
              {items.map((item , index) => {
                return (
                  
                    <ItemBox key={index} name={item.name} />
                 
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {!proceed && !showfallback ? (
        <div className={style.fail_container}>
          <div className={style.flex_box}>
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
            <button className={style.update_button}>Update your address</button>
          </Link>
        </div>
      ) : (
        ""
      )}
      {showfallback ? <Fallback /> : ""}
    </>
  );
};
export default Checkout;
