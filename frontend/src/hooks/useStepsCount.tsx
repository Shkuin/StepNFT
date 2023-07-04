import { useCallback, useState } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const useGetSteps = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [steps, setSteps] = useState<string>();

    const fetchSteps = useCallback(async (startTime: number, endTime: number) => {
        setLoading(true);
        setError(false);
        setSteps(String(0));
        try {
            const url = new URL(`${backendUrl}/steps`);
            url.search = new URLSearchParams({
                startTime: String(startTime), endTime: String(endTime)
            }).toString()

            const resp = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await resp.json();
            setSteps(data.steps || 0);
        } catch (e) {
            console.error(e);
            setError(true)
        } finally {
            setLoading(false);
        }
    }, []);

    return { fetchSteps, error, loading, steps };
}
