
import { View } from "react-native";
import { useEffect } from "react";
import Header from "@/components/Header";
import AccountUser from "@/components/AccountUser";
import { API_URL } from "../auth/login";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Page = () => {
  


  return (
    <View>
      <Header />
      <AccountUser />
    </View>
  );
};

export default Page