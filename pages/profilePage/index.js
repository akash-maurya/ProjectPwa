import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.css";
import Styles from "../../styles/profilePage.module.css";
import Router from "next/router";
import Loader from '../../components/loader';
import CircularProgress from "@mui/material/CircularProgress";



function Profile() {
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [address, setadress] = useState("");
  const [image, setimage] = useState("/user.jpeg");
  const [mobileNumber, setmobileNumber] = useState(0);
  const [ordercount, setordercount] = useState(0);
  const [load , setload] = useState(true) ;
  const cookies = new Cookies();
  useEffect(() => {
    getdetails();
  }, []);

  async function getdetails() {
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
          // console.log(response.data);

          if (response.data.success === true) {
            const resdata = response.data.data;
            const namesplit = resdata.name.split(" ");
           // console.log(namesplit);
            if (namesplit[0] != undefined) {
              setfirstname(namesplit[0]);
            }
            if (namesplit[1] != undefined) {
              setlastname(namesplit[1]);
            }
            if (resdata.address != undefined) {
              setadress(resdata.address);
            }
            if (resdata.image != undefined) {
              setimage(resdata.image);
            }
            if (resdata.mobileNumber != undefined) {
              setmobileNumber(resdata.mobileNumber);
            }
           // console.log("order count "+ resdata.orderCount )
            setordercount(resdata.orderCount);
          }
          setload(false);
        })
        .catch((err) => {
          Router.push("/");
          //console.log(err);
        });
    }
  }

  const handlelogout = () => {
    cookies.remove("authToken");
    Router.push("/");
  };

  return (
    <div>

      {load ?  <Loader /> : ""}
      <div
        className="d-flex justify-content-between "
        style={{ background: "#e41d36" }}
      >
        <div
          className="p-2 bd-highlight align-self-center"
          style={{ color: "#fff" }}
        >
          <Link href="/" passHref>
            <div style={{ cursor: "pointer" }}>
              <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
            </div>
          </Link>
        </div>
        <div className="p-2 flex-grow-1 bd-highlight text-center ">
          <h2 className={Styles.headline}>My Profile</h2>
        </div>
        <div className="p-2 bd-highlight">
          <Link href='/profile' passHref>
            <button className="btn" style={{ color: "#fff" }}>
              Update
            </button>
          </Link>
        </div>
      </div>
      <div className="container-md">
        <div className="text-center mt-2" style={{ background: "#f8f8f8" }}>
          
          <img
            className={Styles.profilepic}
            src={image}
            alt="profile pic"
          />
        
        </div>
        <div className="border-bottom mt-3">
          <h4 className={Styles.text_heading}>Basic Information</h4>
        </div>
        <div>
          <div className="mt-3">
            <div style={{ color: "#CBCBCB" }}>
              <p className={Styles.text_para}> FIRST NAME</p>
            </div>
            <div className="my-0 fs-5" style={{ fontFamily: "sans-serif" }}>
              <p className={Styles.text_main}>{firstname}</p>
            </div>
          </div>
          <div className="mt-3">
            <div style={{ color: "#CBCBCB" }}>
              <p className={Styles.text_para}>LAST NAME</p>
            </div>

            <div className="my-0 fs-5" style={{ fontFamily: "sans-serif" }}>
              <p className={Styles.text_main}>{lastname}</p>
            </div>
          </div>
          <div className="mt-3">
            <div style={{ color: "#CBCBCB" }}>
              {" "}
              <p className={Styles.text_para}>MOBILE NUMBER</p>
            </div>
            <div className="my-0 fs-5" style={{ fontFamily: "sans-serif" }}>
              <p className={Styles.text_main}>{mobileNumber}</p>
            </div>
          </div>

          <div className="mt-3">
            <div style={{ color: "#CBCBCB" }}>
              <p className={Styles.text_para}>ADDRESS</p>
            </div>
            <div className="my-0 fs-5" style={{ fontFamily: "sans-serif" }}>
              <p className={Styles.text_main}>{address}</p>
            </div>
          </div>

          <div className="mt-3">
            <div style={{ color: "#CBCBCB" }}>
              <p className={Styles.text_para}>ORDER PLACED</p>
            </div>
            <div className="my-0 fs-5" style={{ fontFamily: "sans-serif" }}>
              <p className={Styles.text_main}>{ordercount}</p>
            </div>
          </div>
        </div>

        <div className="d-grid d-md-block my-2 text-center">
          <button
            onClick={handlelogout}
            className="btn btn-outline-danger text-center"
          >
            LOG OUT
          </button>
        </div>
      </div>
    </div>
  );
}
export default Profile;
