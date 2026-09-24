import { ChevronLeft, ChevronRight, LogOut } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Switch from "../Switch";
import Footer from "../footer/Footer";
import { SETTINGS_CHENG, SETTINGS_SECTIONS } from "./setting.config";
import { useRouter } from "expo-router";
import { API_URL } from "@/app/auth/login";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = () => {
  const router = useRouter();

  const ExiteOutUser = async () => {
    const token = await AsyncStorage.getItem("session_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const data = await response.json();
      console.log("Logout error:", data);
      return;
    }
    await AsyncStorage.removeItem("session_token");
    router.replace("/auth/login");
  };
  const handleRoutButton = (route: any) => {
    if (route === undefined) return;
    router.push(`./${route}`);
  };

  return (
    <View>
      <View className="w-[90%] m-auto mt-15  flex-row flex items-center justify-center  h-[42px]">
        <Text className="text-white text-[20px]">Setting</Text>
      </View>

      <View className="flex justify-end mt-[10px] h-auto">
        <View className="m-auto rounded-[18px] mt-[32px] p-3 w-[90%] gap-6 bg-[#1E1E2D]">
          <Pressable className=" flex w-full justify-between items-center   flex-row">
            <Text className="text-[17px] font-semibold text-white">
              Use biometric
            </Text>
            <Switch />
          </Pressable>
          {SETTINGS_SECTIONS.map((s) => (
            <Pressable
              onPress={() => handleRoutButton(s.route)}
              key={s.id}
              className=" flex w-full justify-between items-center   flex-row"
            >
              <Text className="text-[17px] font-semibold text-white">
                {s.title}
              </Text>
              <Text className="text-[17px] font-semibold text-white gap-3 flex flex-row">
                {s.value || ""} <ChevronRight color="white" />
              </Text>
            </Pressable>
          ))}
        </View>
        <View className="m-auto rounded-[18px] mt-[17px] p-3 w-[90%] gap-6 bg-[#1E1E2D]">
          {SETTINGS_CHENG.map((s) => (
            <Pressable
              key={s.id}
              className=" flex w-full justify-between items-center   flex-row"
            >
              <Text className="text-[17px] font-semibold text-white">
                {s.title}
              </Text>
              <Text className=" text-[17px] font-semibold text-white gap-3 flex flex-row">
                {s.value || ""} <ChevronRight color="white" />
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          onPress={ExiteOutUser}
          className=" rounded-[12px] h-[50] mt-[20px] m-auto p-3 w-[90%] gap-6 bg-[#363649] flex  justify-center items-center   flex-row"
        >
          <Text className="font-semibold text-red-400">Log out </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Settings;
