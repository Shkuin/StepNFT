import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Box, Button } from "@mui/material";
import { Address } from 'wagmi'

import { useMagicLink } from "../../hooks/useMagicLink";

import Header from "../../components/Header";
import Page from "../../components/Page";
import { routes } from "../../routes";
import { useUserContext } from "../../contexts/UserContext";
import Caption from "../../components/Caption";

const Profile = () => {
  const navigate = useNavigate();
  const { provider, magic } = useMagicLink();
  const { setUserMetadata, userMetadata, didToken, isUserAuthorized, isInitialAuthorizationPending } = useUserContext();

  const handleLogout = () => {
    magic.user.logout().then(() => {
      setUserMetadata(undefined);
      navigate(routes.authLogin);
    });
  };

  useEffect(() => {
    if (isUserAuthorized) {
      console.log('didToken', didToken)
    }
  }, [isUserAuthorized]);

  useEffect(() => {
    if (!isUserAuthorized && !isInitialAuthorizationPending) {
      navigate(routes.authLogin);
    }
  }, [isUserAuthorized, isInitialAuthorizationPending, navigate])

  return (
    <Page>
      <Header title="Profile"/>

      <Box>
        {userMetadata && (
            <>
                
              <Box className="mb-4">
                <Caption>Email</Caption>
                <div>{userMetadata.email}</div>
              </Box>

              <Box className="mb-4">
                <Caption>Address</Caption>
                <a
                  href={`https://mumbai.polygonscan.com/address/${userMetadata.publicAddress}`}
                  target='_blank'
                >
                  {userMetadata.publicAddress}
                </a>
              </Box>

              <Button
                onClick={handleLogout}
                size='large'
                className="text-accent"
                variant="contained"
              >
                Logout
              </Button>
            </>
          )}
      </Box>
    </Page>
  )
};

export default Profile;
