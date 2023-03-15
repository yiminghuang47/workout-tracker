import "./App.css";

import { useState } from "react";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./Layout";
import IndexPage from "./components/IndexPage";
import { UserContextProvider } from "./UserContext";
import Workouts from "./components/Workouts";
import VisualizeWorkouts from "./pages/VisualizeWorkouts";

function App() {
  const [name, setName] = useState("");
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/register"} element={<Register />} />
          <Route path={"/workouts"} element={<Workouts />} />
          <Route path={"/visualize"} element={<VisualizeWorkouts />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
