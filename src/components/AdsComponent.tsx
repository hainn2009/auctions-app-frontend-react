import { useEffect } from "react";

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

export const AdsComponent: React.FC<{ dataAdSlot: string }> = ({
    dataAdSlot,
}) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            if (err instanceof Error) {
                console.error("Adsense error:", err.message);
            } else {
                console.error("Adsense error:", err);
            }
        }
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-9347518247329906"
            data-ad-slot={dataAdSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
        ></ins>
    );
};
