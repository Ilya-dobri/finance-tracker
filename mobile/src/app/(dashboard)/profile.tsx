
import { ScrollView, View } from "react-native";
import { useEffect } from "react";
import Header from "@/components/Header";
import AccountUser from "@/components/AccountUser";
import { API_URL } from "../auth/login";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Page = () => {
  


  return (
     <ScrollView
      className="flex-1 bg-[#161622]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 100,
      }}
    >
    <View>
      <Header />
      <AccountUser />
    </View>
    </ScrollView>
  );
};

export default Page