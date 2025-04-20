import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import styles from "./Root.module.css";
const Root = () => {
  return (
    <>
      <NavBar />
      <div className={styles.outletContainer}>
        <Outlet />
      </div>
    </>
  );
};

export default Root;
