import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import toast, { Toaster } from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import CarFront from "./pages/CarFront.jsx"; // Updated component for car details
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context, server } from "./main";
import Account from "./pages/Account";
import CarsPage from "./pages/CarsPage.jsx"; // Updated for cars listing
import CarForm from "./pages/CarForm.jsx"; // Updated for adding/editing cars

import { getToken } from "./api.js";
import MyCarsPage from "./pages/MyCarsPage.jsx";

function App() {
  const { user, setUser, loading, setLoading } = useContext(Context);
  const [refresh, setRefresh] = useState(false);
  const history = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkToken = async () => {
      let isToken = await getToken();
      if (
        !isToken &&
        location.pathname !== "/login" &&
        location.pathname !== "/register"
      ) {
        history("/");
      }
    };

    checkToken();
  }, [history, location.pathname]);

  const getUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/users/getuser`, {
        withCredentials: true,
      });

      setUser(data.user);
      setRefresh(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setUser(null);
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }

    console.log("app");
  }, [history]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/cars" element={<CarsPage />} /> {/* Updated */}
          <Route path="/account/cars/new" element={<CarForm />} />{" "}
          {/* Updated */}
          <Route path="/account/cars/:id" element={<CarForm />} />{" "}
          {/* Updated */}
          <Route path="/car/:id" element={<CarFront />} /> {/* Updated */}
          <Route path="/account/mycars" element={<MyCarsPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
