import style from "../../styles/profile.module.css";
import Styles from "../../styles/profilePage.module.css";
import Head from "next/head";
import Link from "next/link";
import user from "../../public/user.jpeg";
import Image from "next/image";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import Router from "next/router";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { Avatar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.css";

const Profile = () => {
  const cookies = new Cookies();

  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [address, setadress] = useState("");
  const [image, setimage] = useState("/user.jpeg");
  const [mobileNumber, setmobileNumber] = useState(0);
  const [ApiFirstName, setApiFirstName] = useState("");
  const [ApiLastName, setApiLastName] = useState("");
  const [ApiAddress, setApiAddress] = useState("");
  const [ApiImage, setApiImage ] = useState("");
  const [Isvalid, setIsvalid] = useState(true);
  const [showUpdate, setUpdate] = useState(false);
  const [showoffline, setoffline] = useState(false);

  const handlefirstname = (event) => {
    setfirstname(event.target.value);
    validate("firstname", event.target.value);
  };

  const handlelastname = (event) => {
    setlastname(event.target.value);
    validate("lastname", event.target.value);
  };

  const handleadress = (event) => {
    setadress(event.target.value);
    validate("address", event.target.value);
  };

  const handleimage = (event) => {
    setimage(event.target.value);
    validate("image", event.target.value);
  };

  async function getdetails() {
    const hitUrl = "https://licious-lite.herokuapp.com/api/update/getdetails";
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
          console.log(response.data);

          if (response.data.success === true) {
            const resdata = response.data.data;
            const namesplit = resdata.name.split(" ");
            console.log(namesplit);
            setfirstname(namesplit[0]);
            setlastname(namesplit[1]);
            setadress(resdata.address);
            setimage(resdata.image);
            setmobileNumber(resdata.mobileNumber);
            setApiFirstName(namesplit[0]);
            setApiLastName(namesplit[1]);
            setApiAddress(resdata.address);
            setApiImage(resdata.image);
          }
        })
        .catch((err) => {
          Router.push('/');
          console.log(err);
        });
    }
  }

  useEffect(() => {
    getdetails();
  }, []);

  const handlelogout = () => {
    cookies.remove("authToken");
    Router.push("/");
  };

  async function updateProfile(fname, lname, userAddress, image) {
    let res = "";
    const data = {
      firstname: fname,
      lastname: lname,
      address: userAddress,
      image: image,
    };
    const hitUrl =
      "https://licious-lite.herokuapp.com/api/update/updateDetails";
    const authToken = cookies.get("authToken");
    const header = {
      "Content-Type": "application/json",
      authToken: authToken,
    };

    if (authToken) {
      await axios
        .put(hitUrl, data, {
          headers: header,
        })
        .then((response) => {
          // console.log(response.data);
          console.log("called----------")
          setUpdate(true);

          setTimeout(() => {
            setUpdate(false);
          }, 1500);
          return response.data;
        })
        .catch((err) => {
          setoffline(true);

          setTimeout(() => {
            setoffline(false);
          }, 3500);
          console.log(err);
        });
    }
    return res;
  }

  function validate(key, val) {
    if (key === "firstname") {
      if (ApiFirstName !== val) {
        setIsvalid(false);
      } else {
        setIsvalid(true);
      }
    } else if (key === "lastname") {
      if (ApiLastName !== val) {
        setIsvalid(false);
      } else {
        setIsvalid(true);
      }
    } else if (key === "address") {
      if (ApiAddress !== val) {
        setIsvalid(false);
      } else {
        setIsvalid(true);
      }
    } 
    else if (key === "image") {
      if (ApiImage !== val) {
        setIsvalid(false);
      } else {
        setIsvalid(true);
      }
    } 
    else {
      setIsvalid(true);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(firstname + " " + lastname + " " + address + " " + image);

    const resdata = updateProfile(firstname, lastname, address, image);
    if (resdata.success && resdata.success === true) {
      console.log(resdata + "updated successfully");
    } else {
      const authToken = cookies.get("authToken");
      const data = {
        authToken: authToken,
        firstname: firstname,
        lastname: lastname,
        address: address,
        image: image
      };

      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready.then(function (sw) {
          //  sw.sync.register("sync-new-profile");

          writedata("profile", data)
            .then(function () {
              console.log("sync new profile registered");
              return sw.sync.register("sync-new-profile");
            })
            .catch(function (err) {
              console.log(err);
            });
        });
      }
      console.log("failed to update");
    }
  };

  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

    {showUpdate && <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      TransitionComponent={TransitionLeft}
      open={showUpdate}
      autoHideDuration={2000}
    >
      <Alert
        severity="success"
        sx={{
          width: "100%",
          marginTop: "4rem",
          bgcolor: "rgb(64, 158, 64)",
          color: "white",
        }}
      >
        Profile updated successfully
      </Alert>
    </Snackbar>}

    {showoffline &&  <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        TransitionComponent={TransitionLeft}
        open={showoffline}
        autoHideDuration={3000}
      >
        <Alert
          severity="error"
          sx={{
            width: "50vw",
            marginTop: "4rem",
            bgcolor: "rgb(228, 111, 111)",
            color: "white",
          }}
        >
          You are offline
        </Alert>
      </Snackbar>}

      <div className={style.container}>
        <div className={style.update_box}>
          <Link href="/" passHref>
            <FontAwesomeIcon
              className={style.back_arrow}
              icon={faChevronLeft}
            ></FontAwesomeIcon>
          </Link>

          <h1 id={style.heading}>Update Profile</h1>
        </div>

        {/* <div className={style.image_section}>
          <img src={image} className={style.image} alt="user Image"></img>
        </div> */}
        {/* <div>
          <div className="text-center">
            <img className={Styles.profilepic} src={image} alt="Profile pic" />
          </div>
        </div> */}

        <form autoComplete="off" onSubmit={handleSubmit}>
        
          <div className="text-center">
            <img className={Styles.profilepic} src={image} alt="Profile pic" />
          </div>
        
          <div className={style.text_container}>
            <div className={style.name}>
              <div className={style.column_flex}>
                <label className={style.label}>First Name</label>
                <input
                  className={style.name_input}
                  name="firstname"
                  type="text"
                  autoComplete="false"
                  onChange={handlefirstname}
                  value={firstname}
                />
              </div>

              <div className={style.column_flex}>
                <label className={style.label}>Last Name</label>
                <input
                  className={style.name_input}
                  name="lastname"
                  type="text"
                  autoComplete="false"
                  onChange={handlelastname}
                  value={lastname}
                />
              </div>
            </div>

            <label className={style.label}>Phone no</label>
            <input
              className={style.input}
              disabled
              name="phoneNumber"
              type="tel"
              value={mobileNumber}
            />

            <label className={style.label}>Address</label>
            <input
              className={style.input}
              onChange={handleadress}
              name="address"
              type="text"
              autoComplete="false"
              value={address}
            />
            <label className={style.label}>Image</label>
            <input
              className={style.input}
              onChange={handleimage}
              name="image"
              type="text"
              autoComplete="false"
              value={image}
            />

            <button
              type="submit"
              className={style.btn}
              id="submitbtn"
              disabled={Isvalid}
            >
              Submit
            </button>

            <button onClick={handlelogout} className={style.btn_logout}>
              LOGOUT
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
