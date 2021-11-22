
import style from '../styles/footer.module.css';
import Script from 'next/script';
const footer = (props)=>{

    return (
      <>
        <Script id="footer-script" defer>
          {`window.addEventListener('online', function(e) {
      console.log("You are online");
      if(document.getElementById('footer')){
      document.getElementById('footer').style.filter = 'grayscale(0)';
      document.getElementById('footer').style.marginTop = 'auto';
      document.getElementById('footer').style.position = 'static';
      }
      }, false);

      window.addEventListener('offline', function(e) {
  
       console.log("You are offline");
       if(document.getElementById('footer')){
       document.getElementById('footer').style.filter = 'grayscale(1)';
       document.getElementById('footer').style.marginTop = '110%';
       document.getElementById('footer').style.position = 'static';
       }
      }, false);`}
        </Script>
        <div
          id="footer"
          style={
            props.nonetwork
              ? { marginTop: "22vh" }
              : props.isloading
              ? { marginTop: "50vh" }
              : {}
          }
          className={style.footer_container}
        >
          <h1> @2021 Delightful Gourmet Pvt Ltd. All Rights Reserved</h1>
          <p>
            Licious is your one-stop fresh meat delivery shop. In here, you get
            nothing but the freshest meat and seafood, delivered straight to
            your doorstep. Now you can buy meat online anytime at your
            convenience. Indulge in our diverse selection: Chicken, Mutton,
            Seafood (Fish, Prawns, Crabs), Marinades and Cold Cuts. All our
            products are completely natural and healthy. Once youve experienced
            Licious, youll never go back to the old way of buying meat and
            seafood.
          </p>
        </div>
      </>
    );
}

export default footer;