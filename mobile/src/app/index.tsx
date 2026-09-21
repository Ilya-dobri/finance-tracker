

import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { API_URL } from "./auth/login";
import { syncNotifications } from "@/components/services/notifications/syncNotifications";
import { useAccountStore } from "@/components/store/useStatementStore";

export default function Home() {
  const BankOtherDataFromStore = useAccountStore((state) => state.bankData);
  const route = useRouter()
    const bankData = useAccountStore(
    (state) => state.bankData
  );
  useEffect(() => {
    
       const checkAuth = async () => {
         const response = await fetch(`${API_URL}/api/auth/me`);
         
         if(response.ok){
            route.push('/profile')
         }else{
          route.push('/auth/login')
         }
       }
    checkAuth()
  }, [route])
  useEffect(() => {
     const accountId = bankData?.[0]?.id;
  if (!accountId) return;

  syncNotifications(accountId);
}, [BankOtherDataFromStore]);
  return (
   <View>
      <Text>Home</Text>
    </View>
  );
}
