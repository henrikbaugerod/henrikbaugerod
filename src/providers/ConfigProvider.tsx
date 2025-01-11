import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { WebsiteType } from "../types";

type ConfigType = {
    firstRender: boolean;
    setFirstRender: (value: boolean) => void;
    websites: WebsiteType[] | null;
}

const ConfigContext = createContext<ConfigType | null>(null);

const useConfigContext = () => {
    const context = useContext(ConfigContext);
    if (context === null) {
        throw new Error('useConfigContext must be used within a ConfigProvider');
    }

    return context;
}

const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const [firstRender, setFirstRender] = useState(true);
    const [websites, setWebsites] = useState<WebsiteType[] | null>(null);

    const fetchData = async () => {
        const response = await fetch("portfolio.json");
        const data = await response.json();
        setWebsites(data.websites);
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <ConfigContext.Provider value={{
            firstRender,
            setFirstRender,
            websites
        }}>
            {children}
        </ConfigContext.Provider>
    )
}

export { ConfigProvider, useConfigContext };