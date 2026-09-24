import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import  { useState } from "react";
import { View, Text, TextInput, Pressable, Platform, Keyboard } from "react-native";
export const API_URL =
  Platform.OS === "web"
    ? "http://localhost:3000"
    : "http://192.168.0.140:3000";
    
    const Page = () => {
 const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleButton = async () => {
  try {
    const url = `${API_URL}/api/auth/login`;

    console.log("➡️ POST:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    console.log("⬅️ STATUS:", response.status);

    const data = await response.json();

    console.log("⬅️ DATA:", data);

    if (!response.ok) {
      console.log("❌ Login error:", data);
      return;
    }

    if (data.token) {
      await AsyncStorage.setItem("session_token", data.token);
      console.log("✅ Token saved");
    }

    router.push(data.redirect || data.user?.redirect || "/profile");
  } catch (error) {
    console.error("🔥 FETCH ERROR:", error);
  }
};

  const handleRegist = () => {
    router.push('/auth/registration');
    Keyboard.dismiss()

  };

  return (
    <Pressable onPress={Keyboard.dismiss}
  className="flex-1 justify-center items-center bg-gray-100">
      <View className="w-[335px] p-4 rounded-[32px] bg-white/80 shadow-lg">
        <View className="w-full rounded-[26px] bg-gray-50 p-10 justify-center">
          <View className="items-center mb-14">
            <View className="w-16 h-16 mb-5 rounded-2xl bg-[#FF7E3A] items-center justify-center">
              <Text className="text-2xl text-white font-bold">S</Text>
            </View>

            <Text className="text-3xl font-bold text-gray-800">Sing in</Text>
            <Text className="mt-2 text-sm text-gray-500">Войдите в свой аккаунт</Text>
          </View>

          <View className="flex flex-col gap-7 w-full">
            <View className="flex flex-col gap-2">
              <Text className="text-sm font-semibold text-gray-700">Email</Text>
              <TextInput
                placeholder="Введите email"
                className="w-full h-12 px-5 rounded-2xl border border-gray-200 bg-white text-gray-800"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View className="flex flex-col gap-2">
              <Text className="text-sm font-semibold text-gray-700">Password</Text>
              <TextInput
                
                placeholder="Введите пароль"
                secureTextEntry
                className="w-full h-12 px-5 rounded-2xl border border-gray-200 bg-white text-gray-800"
                value={password}
                onChangeText={setPassword}
              />

              <View className="flex-row justify-end">
                <Pressable>
                  <Text className="text-sm text-[#FF7E3A]">Забыли пароль?</Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={handleButton}
              className="w-full h-13 mt-2 rounded-2xl bg-[#FF7E3A] items-center justify-center"
            >
              <Text className="text-white font-semibold">Sign In</Text>
            </Pressable>

            <View className="flex-row justify-center gap-1">
              <Text className="text-sm text-gray-500">Нет аккаунта?</Text>
              <Pressable  onPress={handleRegist}>
                <Text className="font-semibold text-[#FF7E3A]">Зарегистрироваться</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default Page;