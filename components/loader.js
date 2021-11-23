
import CircularProgress from "@mui/material/CircularProgress";
import Style from '../styles/loader.module.css';

const Loader = () => {
  return (
    <>
    <div className = {Style.body}>
      <CircularProgress
        sx={{
          marginTop: "50%",
          marginLeft: "45%",
          color: "red",
        }}
      />
      </div>
    </>
  );
};

export default Loader ;