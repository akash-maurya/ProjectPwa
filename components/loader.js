
import CircularProgress from "@mui/material/CircularProgress";
import Style from '../styles/loader.module.css';

const Loader = () => {
  return (
    <>
    <div className = {Style.body}>
      <CircularProgress
        sx={{
          marginTop: "47%",
          marginLeft: "47%",
          color: "red",
        }}
      />
      </div>
    </>
  );
};

export default Loader ;