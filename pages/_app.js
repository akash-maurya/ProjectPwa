import '../styles/globals.css'
import Head from "next/head";
import { useEffect } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
import Script from 'next/script';
import 'bootstrap/dist/css/bootstrap.css'
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {

  useEffect(()=>{
    
    if('serviceWorker' in navigator){

         
            navigator.serviceWorker.register('/sw.js').then(
              function (registration) {
                console.log(
                  "Service Worker registration successful with scope: ",
                  registration.scope
                );
              },
              function (err) {
                console.log("Service Worker registration failed: ", err);
              }
            );
      }
  },[])

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="yes" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon/L-icon-180.png"></link>




        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Antique&display=swap"
          rel="stylesheet"
        ></link>

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no"
        ></meta>
        <script defer src="/idb.js"></script>
      <script defer src="/utility.js"></script>
      </Head>
      
      <Component {...pageProps} />
    </>
  );
}

export default MyApp
