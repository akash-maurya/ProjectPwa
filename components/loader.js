import React from 'react'
import Loader from "react-loader-spinner";

const Load = () => {
    return (
      <div align="center">
        <Loader
          type="Bars"
          color="#00BFFF"
          height={100}
          // width={100}
          timeout={10000}
        />
      </div>
    );
}

export default Load
