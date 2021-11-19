import style from '../styles/fallback.module.css';
import Link from 'next/link';
import router from 'next/router';
import SignalWifiOffOutlinedIcon from "@material-ui/icons/SignalWifiOffOutlined";
const hard_refresh = ()=>{
  
if(window.location.pathname === '/')
  router.reload(window.location.pathname);
}

const fallback  = ()=>{

    return (
      <>
        <div className={style.fallback_container}>
          <div>
            <SignalWifiOffOutlinedIcon sx = { {color : "red"}} fontSize = "large" className={style.nonetwork} />
          </div>

          <div className={style.content}>
            <h1 className={style.h1}>No Connection</h1>
            <div>
              <p className={style.para}>
                Please check your internet connection and try again
              </p>
            </div>

            <Link href="/" passHref>
              <button onClick={hard_refresh} className={style.refresh}>
                Refresh
              </button>
            </Link>
          </div>
        </div>
      </>
    );
}

export default fallback ;