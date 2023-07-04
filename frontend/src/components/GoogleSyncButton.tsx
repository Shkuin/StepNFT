import { FC } from "react";
import { useConnectGoogleAccount } from "../hooks/useConnectGoogleAccount";
import { GoogleFitIcon } from "./GoogleFitIcon";
import './styles.css'
import { SyncedGoogleFitIcon } from "./SyncedGoogleFitIcon";

export const GoogleSyncButton: FC = () => {
    const { connectAccount, error, loading, synced } = useConnectGoogleAccount();

    if (loading) <>Loading...</>
    if (error) <>{error}</>

    return (
        <button className="syncButton">
            <GoogleFitIcon />
            Let's syncs with Google Fit
            {synced ? <SyncedGoogleFitIcon /> : <div className="syncedGap" />}
        </button>
    );
};