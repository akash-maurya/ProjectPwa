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
        <link rel="apple-touch-icon" sizes="16x16" href="/icon/App_icon_16.png"></link>
        <link rel="apple-touch-icon" sizes="24x24" href="/icon/App_icon_24.png"></link>
        <link rel="apple-touch-icon" sizes="32x32" href="/icon/App_icon_32.png"></link>
        <link rel="apple-touch-icon" sizes="64x64" href="/icon/App_icon_64.png"></link>
        <link rel="apple-touch-icon" sizes="128x128" href="/icon/App_icon_128.png"></link>
        <link rel="apple-touch-icon" sizes="256x256" href="/icon/App_icon_256.png"></link>
        <link rel="apple-touch-icon" sizes="512x512" href="/icon/App_icon_512.png"></link>


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
