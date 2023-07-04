import { useCallback, useEffect, useRef, useState } from "react";
import { useUserContext } from "../contexts/UserContext";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const FITNESS_SCOPE = 'https://www.googleapis.com/auth/fitness.activity.read';

export const useConnectGoogleAccount = () => {
    const googleClient = useRef<any>();
    const [synced, setSynced] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();
    const { didToken } = useUserContext();
    useEffect(() => {
        if(!didToken) {
            return;
        }
        const checkAccountConnected = async () => {
            setLoading(true);
            try {
                const resp = await fetch(`${backendUrl}/user`, {
                    headers: {
                        Authorization: `Bearer ${didToken}`
                    }
                });
                const { synced } = await resp.json();
                setSynced(synced);
            } catch (e) {
                setError('Error while checkng user account sync')
            } finally {
                setLoading(false);
            }
        }

        checkAccountConnected();
    }, [didToken]);
    useEffect(() => {
        if(!didToken) return;
        if (googleClient.current) return;
        const google = (window as any).google;
        if (!google) {
            console.log('Google library not found');
            return;
        }
        googleClient.current = google.accounts.oauth2.initCodeClient({
            client_id: clientId,
            scope: FITNESS_SCOPE,
            callback: async (token: Record<string, string>) => {
                try {
                    setLoading(true);
                    await fetch(`${backendUrl}/user/connect`, {
                        method: 'POST',
                        body: JSON.stringify(token),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${didToken}`
                        },
                    })
                    setSynced(true);
                } catch (e) {
                    setError('Error while synced user account')
                } finally {
                    setLoading(false);
                }
            }
        });
    }, [didToken]);

    // deprecated way of getting scope to google fit, we require scope access  at login flow
    const connectAccount = useCallback(async () => {
        const client = googleClient.current;
        if (client) {
            await client.requestCode();
        }
    }, [])

    return { connectAccount, synced, loading, error };
}
