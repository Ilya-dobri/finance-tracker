import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';

export default function RegistrationScreen() {
  const router = useRouter();

  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleButton = async () => {
    try {
      const API_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3000' // для эмулятора Android
  : 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/auth/registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, email, password }),
      });
      const data = await response.json();
      if (response.ok ) {
        const redirectUrl = data.user?.redirect || '/auth/login';
  router.push(redirectUrl);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        showsVerticalScrollIndicator={false}
        className="bg-orange-50/50"
      >
        {/* Внешний контейнер */}
        <View className="flex-1 justify-center items-center px-5 py-10">
          
          {/* Карточка */}
          <View className="w-full max-w-sm p-3 rounded-[32px] bg-white shadow-xl shadow-black/10">
            {/* Внутренний слой */}
            <View className="w-full rounded-[26px] bg-gray-50/80 p-6">
              
              {/* Заголовок и логотип */}
              <View className="items-center mb-8">
                <View className="w-16 h-16 mb-4 rounded-2xl bg-[#FF7E3A] items-center justify-center shadow-md shadow-orange-300">
                  <Text className="text-2xl text-white font-bold">R</Text>
                </View>

                <Text className="text-2xl font-bold text-gray-800">Registration</Text>
                <Text className="mt-1 text-sm text-gray-500">Create your account</Text>
              </View>

              {/* Форма */}
              <View className="gap-4 w-full">
                
                {/* Login */}
                <View className="gap-1.5">
                  <Text className="text-sm font-semibold text-gray-700">Login</Text>
                  <TextInput
                    placeholder="Enter login"
                    placeholderTextColor="#9CA3AF"
                    className="w-full h-12 px-4 rounded-2xl border border-gray-200 bg-white text-gray-800 text-base focus:border-[#FF7E3A]"
                    value={login}
                    onChangeText={setLogin}
                    autoCapitalize="none"
                  />
                </View>

                {/* Email */}
                <View className="gap-1.5">
                  <Text className="text-sm font-semibold text-gray-700">Email</Text>
                  <TextInput
                    placeholder="Enter email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="w-full h-12 px-4 rounded-2xl border border-gray-200 bg-white text-gray-800 text-base focus:border-[#FF7E3A]"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                {/* Password */}
                <View className="gap-1.5">
                  <Text className="text-sm font-semibold text-gray-700">Password</Text>
                  <TextInput
                    placeholder="Enter password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    className="w-full h-12 px-4 rounded-2xl border border-gray-200 bg-white text-gray-800 text-base focus:border-[#FF7E3A]"
                    value={password}
                    onChangeText={setPassword}
                  />

                  <TouchableOpacity className="align-self-end mt-1">
                    <Text className="text-sm text-[#FF7E3A] text-right font-medium">
                      Forgot password?
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Кнопка регистрации */}
                <TouchableOpacity
                  onPress={handleButton}
                  activeOpacity={0.8}
                  className="w-full h-12 mt-2 rounded-2xl bg-[#FF7E3A] items-center justify-center shadow-md shadow-orange-300"
                >
                  <Text className="text-white font-semibold text-base">Register</Text>
                </TouchableOpacity>

                {/* Переход на Вход */}
                <View className="flex-row justify-center items-center mt-2">
                  <Text className="text-sm text-gray-500">Already have an account? </Text>
                  <TouchableOpacity onPress={() => router.push('/auth/login')}>
                    <Text className="font-semibold text-[#FF7E3A] text-sm">Sign In</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}