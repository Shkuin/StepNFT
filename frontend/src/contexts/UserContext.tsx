import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { MagicUserMetadata } from "magic-sdk";
import { OAuthExtension } from '@magic-ext/oauth';
import { ethers } from "ethers";
import { SDKBase, InstanceWithExtensions } from '@magic-sdk/provider';

import { provider, magic } from '../hooks/useMagicLink';

export type UserContextType = {
    isUserMetadataLoading: boolean,
    isInitialAuthorizationPending: boolean,
    isUserAuthorized: boolean,
    userMetadata?: MagicUserMetadata
    didToken?: string;
    setUserMetadata(userMedata: MagicUserMetadata | undefined): void;
    checkAuthorization(isInitialAppLoad: boolean): void;
    magic: InstanceWithExtensions<SDKBase, OAuthExtension[]>,
    provider: ethers.providers.Web3Provider,
}

export const UserContext = createContext<UserContextType>({
    isUserMetadataLoading: false,
    isInitialAuthorizationPending: true,
    isUserAuthorized: false,
    userMetadata: undefined,
    setUserMetadata() {},
    checkAuthorization() {},
    magic,
    provider
});

export const UserContextProvider: FC<PropsWithChildren> = (props) => {
	const { children } = props;

    const [userMetadata, setUserMetadata] = useState<MagicUserMetadata | undefined>(undefined);
    const [didToken, setDidToken] = useState<string | undefined>(undefined);
    const [isUserMetadataLoading, setIsUserMetadataLoading] = useState<boolean>(false);
    const [isInitialAuthorizationPending, setIsInitialAuthorizationPending] = useState<boolean>(true);

    const isUserAuthorized = useMemo(() => {
      return !!(!isInitialAuthorizationPending && userMetadata && didToken);
    }, [isInitialAuthorizationPending, userMetadata, didToken]);
    

    const checkAuthorization = (isInitialAppLoad: boolean) => {
        if (isInitialAppLoad) setIsInitialAuthorizationPending(true);

        // setIsUserMetadataLoading(true);

         magic.user.isLoggedIn()
          .then(async (isLoggedIn) => {
              if (isLoggedIn) {
                  await Promise.all([
                      magic.user.getMetadata().then((userMedata) => setUserMetadata(userMedata)),
                      magic.user.getIdToken().then(idToken => setDidToken(idToken))
                  ])

                  if (isInitialAppLoad) setIsInitialAuthorizationPending(false);

                //   setIsUserMetadataLoading(false);
              } else {
                  setUserMetadata(undefined);
                  setDidToken(undefined);

                  if (isInitialAppLoad) setIsInitialAuthorizationPending(false);
                //   setIsUserMetadataLoading(false);
              }
          })
          .catch(error => {
            console.log('isLoggedIn error')
              setUserMetadata(undefined);
              setDidToken(undefined);
            //   setIsUserMetadataLoading(false);

            if (isInitialAppLoad) setIsInitialAuthorizationPending(false);

              console.error(error);
              console.error('checkAuthorization error');
          })

    }

    useEffect(() => {
        checkAuthorization(true);

        // const intervalId = setInterval(() => {
        //     checkAuthorization(false);
        // }, 10000)


        // return () => clearInterval(intervalId);
    }, [])


    const value: UserContextType = {
        isInitialAuthorizationPending,
        isUserMetadataLoading,
        isUserAuthorized,
        userMetadata,
        didToken,
        setUserMetadata,
        checkAuthorization,
        magic,
        provider
    }

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
};

export const useUserContext = () => {
	const context = useContext(UserContext);

	if (!context)
		throw new Error('`UserContext` can not be used outside `UserContext.Provider`');

	return context;
};

