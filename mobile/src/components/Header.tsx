
import { View, Text, Image } from "react-native";
import { Search } from "lucide-react-native";
import avatar from '../img/logo_profile.jpg'
import { useEffect, useState } from "react";
import { API_URL } from "@/app/auth/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserAccount } from "@/types/type";
import { useAccountStore } from "./store/useStatementStore";


const Header = () => {
 
  const getUserData = useAccountStore((state) => state.getUserData)
  const userData = useAccountStore((state) => state.userData)
  useEffect(() => {
    getUserData()
  }, []);

  return (
    <View>
      <View className="mt-[50px] mx-[20px]">
        <View className="flex-row items-center justify-between">
          
          {/* Левая часть */}
          <View className="flex-row items-center gap-4">
            <Image
              source={avatar}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />

            <View className="flex-col gap-[4px]">
              <Text className="text-[12px] text-gray-500">
                Welcome back,
              </Text>

              <Text className="text-[18px] text-white">
                {userData?.name}
              </Text>
            </View>
          </View>

          {/* Кнопка поиска */}
          <View className="w-[42px] h-[42px] flex-row items-center justify-center bg-[#1E1E2D] rounded-full">
            <Search size={20} color="white" />
          </View>

        </View>
      </View>
    </View>
  );
};

export default Header;

