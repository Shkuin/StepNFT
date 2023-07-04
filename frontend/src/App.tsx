import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { Grid } from "@mui/material";
import { MagicUserMetadata } from "magic-sdk";
import { WagmiConfig } from 'wagmi'

import { routes } from "./routes";
import GreateGoal from "./pages/GreateGoal";
import Goals from "./pages/Goals";
import Goal from "./pages/Goal";
import AuthLogin from "./pages/AuthLogin";
import Home from "./pages/Home";
import AuthCallback from "./pages/AuthCallback";
import Profile from "./pages/Profile";
import { UserContextProvider } from "./contexts/UserContext";

import { wagmiClient } from './utils/wagmi'

import "./App.css";

function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <UserContextProvider>
        <div className="w-full h-full sm:w-96 sm:mx-auto sm:my-o p-6 flex flex-col">
          <Routes>
            <Route path={routes.home} element={<Home/>} />
            <Route path={routes.authLogin} element={<AuthLogin/>} />
            <Route path={routes.authCallback} element={<AuthCallback/>} />
            <Route path={routes.createGoal} element={<GreateGoal />} />
            <Route path={routes.goals} element={<Goals />} />
            <Route path={routes.goal} element={<Goal />} />
            <Route path={routes.profile} element={<Profile/>} />
          </Routes>
        </div>
      </UserContextProvider>
    </WagmiConfig>
  );
}

export default App;
