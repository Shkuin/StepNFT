import React, { useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from "@mui/material";

import { useMagicLink } from "../../hooks/useMagicLink";

import Page from "../../components/Page";
import Header from "../../components/Header";
import { routes } from "../../routes";
import { useUserContext } from "../../contexts/UserContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { provider, magic } = useMagicLink();
  const { checkAuthorization, isUserAuthorized } = useUserContext();

  // The redirect contains a `provider` query param if the user is logging in with a social provider
  useEffect(() => {
    let provider = new URLSearchParams(location.search).get('provider');

    console.log('provider', provider)

    if (provider) finishSocialLogin();
  }, [location.search]);

  // `getRedirectResult()` returns an object with user data from Magic and the social provider
  const finishSocialLogin = async () => {
    try {
      let result = await magic.oauth.getRedirectResult();
      console.log('magic redirect result', result);

      const idToken = result.magic.idToken;
      authenticateWithServer(idToken, result.oauth);
    } catch (error) {
      console.error(error);
    }
  };

  // Send token to server to validate
  const authenticateWithServer = async (magicIdToken: string, oauth: object) => {
    console.log('oauth', oauth);
    let res = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ oauth }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + magicIdToken,
      },
    });

    const data = await res.json();

    if (data) {
      checkAuthorization(false);
    }
  };

  useEffect(() => {
    if (isUserAuthorized) {
      navigate(routes.profile);
    }
  }, [isUserAuthorized, navigate])


  return (
    <Page>
      <Header title="Google authorization"/>

      <div className="flex justify-center">
        <div>Loading...</div>
      </div>
    </Page>
  )
};

export default AuthCallback;
