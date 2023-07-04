import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box, Button } from "@mui/material";

import { useMagicLink } from "../../hooks/useMagicLink";

import Header from "../../components/Header";
import Page from "../../components/Page"
import { routes } from "../../routes";
import { useUserContext } from "../../contexts/UserContext";

const AuthLogin = () => {
  // const { userInfo, showWallet, logout, login }  = useUser()
  const { provider, magic } = useMagicLink();
  
  const navigate = useNavigate();

  const { setUserMetadata, userMetadata, isUserAuthorized, isInitialAuthorizationPending } = useUserContext();

  const  handleLogin = async () => {
    await magic.oauth.loginWithRedirect({
      provider: 'google',
      redirectURI: new URL('/auth/callback', window.location.origin).href,
      scope: [
        'email', 
        'profile', 
        'openid', 
        'https://www.googleapis.com/auth/fitness.activity.read'
      ]
    });
  }

  useEffect(() => {
    if (isUserAuthorized) {
      navigate(routes.profile);
    }
  }, [isUserAuthorized, navigate])

  return (
    <Page>
      <Header title="Login"/>

      <div className="flex justify-center">
        <Button
          onClick={handleLogin}
          size='large'
          disabled={isInitialAuthorizationPending}
          className="text-accent"
          variant="contained"
        >
          Login with Google
        </Button>
      </div>
    </Page>
  );
};

export default AuthLogin;
