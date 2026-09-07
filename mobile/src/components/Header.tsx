
import { View, Text, Image } from "react-native";
import { Search } from "lucide-react-native";
import avatar from '../img/logo_profile.jpg'
import { useEffect, useState } from "react";
import { API_URL } from "@/app/auth/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserAccount } from "@/types/type";


const Header = () => {
  const [userData, setUserData] = useState<UserAccount | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem("session_token");
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("User data:", data);
      setUserData(data.user);
    };

    fetchUserData();
  }, []);

  return (
    <View>
      <View className="mt-[10px] mx-[20px]">
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

