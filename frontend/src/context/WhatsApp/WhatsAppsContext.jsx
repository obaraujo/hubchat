import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../../services/api";
import useWhatsApps from "../../hooks/useWhatsApps";
import WavoipPhoneWidget from "../../components/WavoipCall";
import { AuthContext } from "../Auth/AuthContext";

const WhatsAppsContext = createContext();

const WhatsAppsProvider = ({ children }) => {
  // Add fallback values to prevent destructuring errors
  const whatsAppData = useWhatsApps();
  const { loading = false, whatsApps = [] } = whatsAppData || {};
  const { user } = useContext(AuthContext);
  
  const [wavoipToken, setWavoipToken] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await api.get("/call/historical/user/whatsapp");

        // let wavoipToken  = "";
        // for(const d of data){
        //   if(d?.wavoip){
        //     wavoipToken = d.wavoip;
        //     break;
        //   }
        // }
        console.log('whavoip token', data)
        setWavoipToken(data?.whatsapp?.wavoip || null);
      } catch (err) {
        console.error("Erro fetchSession:", err);
        setWavoipToken(null);
      } finally {
        setLoadingSession(false);
      }
    };
    fetchSession();
  }, []);


  // Log error state for debugging
  if (error) {
    console.warn("WhatsAppsProvider error:", error);
  }

  return (
    <WhatsAppsContext.Provider value={{ whatsApps, loading, error }}>
      {children}
      {wavoipToken && (
        <WavoipPhoneWidget
          token={wavoipToken}
          position="bottom-right"
          name={user?.company?.name || "waVoip"}
          country="BR"
          autoConnect={true}
          onCallStarted={(data) => console.log("Chamada iniciada:", data)}
          onCallEnded={(data) => console.log("Chamada finalizada:", data)}
          onConnectionStatus={(status) => console.log("Status:", status)}
          onError={(error) => console.error("Erro:", error)}
        />
      )}
    </WhatsAppsContext.Provider>
  );
};

export { WhatsAppsContext, WhatsAppsProvider };