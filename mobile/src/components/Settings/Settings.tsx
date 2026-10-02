import { ChevronLeft, ChevronRight, LogOut, Pencil } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Switch from "../Switch";
import Footer from "../footer/Footer";
import { SETTINGS_CHENG, SETTINGS_SECTIONS, SettingVariant } from "./setting.config";
import { useRouter } from "expo-router";
import { API_URL } from "@/app/auth/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAccountStore } from "../store/useStatementStore";
import { Platform } from "react-native";
import * as DocumentPicker from 'expo-document-picker'
import avatar from '@/img/logo_profile.jpg'
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Menu from "../MenuSettingChange";
const Settings = () => {
  const router = useRouter();
  const userData = useAccountStore((state) => state.userData)
  const [selectedAvatar, setSelectedAvatar] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
  const getUserData = useAccountStore((state) => state.getUserData)
  
  const menuRef = useRef<BottomSheetModal>(null);

const [menuVariant, setMenuVariant] =
  useState<SettingVariant | null>(null);
  useEffect(( ) => {
    getUserData()
  },[])
  const openSettingMenu = (variant?: SettingVariant) => {
  if (!variant) return;

  setMenuVariant(variant);

  requestAnimationFrame(() => {
    menuRef.current?.present();
  });
};
const pickImage = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      multiple: false,
      copyToCacheDirectory: true,
    })

    if (result.canceled) return

    const image = result.assets[0]

    if (image?.uri) {
      setSelectedAvatar(image)
    }
  } catch (error) {
    console.error('Ошибка выбора фотографии:', error)
  }
}

  const ButtonUpdateAvatar = async () => {
    if (!selectedAvatar) return
    const token = await AsyncStorage.getItem('session_token')
    
    const formData = new FormData();

if (Platform.OS === "web") {
  // Для браузера
  if (!selectedAvatar.file) return;

  formData.append("avatar", selectedAvatar.file);
} else {
  
  formData.append("avatar", {
    uri: selectedAvatar.uri,
    name: selectedAvatar.name,
    type: selectedAvatar.mimeType ?? "image/jpeg",
  } as any);
}

    try {
      const response = await fetch(`${API_URL}/api/auth/me/avatar`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
const data = await response.json();
      if (!response.ok) {
  console.log("Ошибка загрузки:", data.error);
  return;
}

await useAccountStore.getState().getUserData();
setSelectedAvatar(null);
 getUserData()
    } catch (error) {
      console.error('Ошибка при отправке аватара:', error)
    }
  }
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
      <View className="w-full h-auto pt-20 flex items-center">
        <View className="relative">
          <Image
            source={
               selectedAvatar
      ? { uri: selectedAvatar.uri }
      : userData?.avatar_url
        ? { uri: userData.avatar_url }
        : avatar
            }
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Pressable
            onPress={pickImage}
            className="absolute bottom-0 right-3 bg-white rounded-full p-1"
          >
            <Pencil className="w-5 h-5 text-black" />
          </Pressable>
        </View>
        <Text className="text-[25px] text-white font-semibold mt-2">
          {userData?.name}
        </Text>
      </View>

      <View className="m-auto rounded-[18px] mt-4.25 p-3 w-[90%] gap-6 bg-[#1E1E2D]">
        {SETTINGS_SECTIONS.map((s) => (
            <Pressable
              onPress={() => openSettingMenu(s.variant)}
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
      <View className="m-auto rounded-[18px] mt-4.25 p-3 w-[90%] gap-6 bg-[#1E1E2D]">
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
      {selectedAvatar && (
        <Pressable
          onPress={ButtonUpdateAvatar}
          className="mt-4 rounded-2xl bg-[#FFA66B] px-5 py-3 align-self-center"
        >
          <Text className="font-semibold text-black text-center">
            Сохранить аватар
          </Text>
        </Pressable>
      )}
       <Pressable
          onPress={ExiteOutUser}
          className=" rounded-[12px] w-[60%] h-[50] mt-[20px] m-auto p-3 w-[90%] gap-6 bg-[#363649] flex  justify-center items-center   flex-row"
        >
          <Text className="font-semibold text-red-400">Log out </Text>
        </Pressable>

            <Menu
            variant={menuVariant}
        ref={menuRef}
        onClose={() => {
          console.log("Закрыто");
        }}
      />
    </View>
       
     
  );
};

export default Settings;
