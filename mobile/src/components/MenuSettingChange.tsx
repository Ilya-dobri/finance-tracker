import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { Pressable, Text, TextInput, View } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/app/auth/login";
import { useAccountStore } from "./store/useStatementStore";
import { BookKey, Mail, ShieldCheck, User } from "lucide-react-native";

interface MenuProps {
  onClose: () => void;
  variant: 'EDIT_PASS'| 'EDIT_NAME' |'CONTACT'|"THEME"|'LANGUAGE'|  "PRIVACY" | null
}

const Menu = forwardRef<BottomSheetModal, MenuProps>(({variant, onClose }, ref) => {
  const internalRef = useRef<BottomSheetModal>(null);
  const [password, setIsPassword] = useState('')
  const [name, setIsName] = useState('')
  const snapPoints = useMemo(() => ["40%"], []);
 const getUserData = useAccountStore((state) => state.getUserData)
  useImperativeHandle(ref, () => internalRef.current as BottomSheetModal);
const userData = useAccountStore((state) => state.userData)
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

useEffect(( ) => {
  getUserData()
},[])
  const ButtonToChangePass = async () => {
    const token = await AsyncStorage.getItem('session_token')
    const response = await fetch(`${API_URL}/api/auth/me/password`,{
     method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      
    })
    if(response.ok){
      internalRef.current?.dismiss()
      getUserData()
    }
  }
  const ButtonToChangeName = async () => {
    const token = await AsyncStorage.getItem('session_token')
    const response = await fetch(`${API_URL}/api/auth/me/name`,{
     method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      
    })
    if(response.ok){
      internalRef.current?.dismiss()
      getUserData()
    }
  }


  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );



 if(variant === 'EDIT_PASS'){

    if (password === userData?.password){
      return(
        <View>
          123
        </View>
      )
    }
     return (
    <BottomSheetModal
      ref={internalRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: "#1E1E2D",
      }}
      handleIndicatorStyle={{
        backgroundColor: "#3A3A44",
      }}
    >
      <BottomSheetView className="flex-1 px-6 pt-2">
        <Text className="mt-8 text-center text-[20px] font-bold text-white">
          Change Password
        </Text>
       <View className="mt-5 p-2 flex-row items-center bg-gray-700 rounded-2xl px-4">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-[#FFA66B]/20">
    <BookKey  size={20} color="#FFA66B" />
</View>
         <TextInput   placeholderTextColor="#9CA3AF" value={password} onChangeText={setIsPassword} placeholder="new pass" className="ml-3 flex-1 h-10 outline-none text-white "/>
       </View>
      
         <View className=" w-[80%] rounded-[10px] m-auto mt-10 flex items-center justify-center ">
          
          <Pressable onPress={ButtonToChangeName} className="w-[90%] shadow-2xl shadow-[#FFA66B]  h-10 rounded-[10px]  bg-[#FFA66B] flex items-center justify-center ">
          <Text className="text-black font-semibold">Change</Text>
        </Pressable>
        </View>
      
      </BottomSheetView>
    </BottomSheetModal>
  );
 }
 if(variant === 'EDIT_NAME'){
return (
    <BottomSheetModal
      ref={internalRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: "#1E1E2D",
      }}
      handleIndicatorStyle={{
        backgroundColor: "#3A3A44",
      }}
    >
      <BottomSheetView className="flex-1 px-6 pt-2">
        <Text className="mt-5 text-center text-[20px] font-bold text-white">
          Change name
        </Text>
        {
          name === userData?.name && (
            <View>
              <Text className="text-2xl text-red-600">You cannot set the same password </Text>
            </View>
          )
        }
        <View className=" mt-5 p-2 flex-row items-center bg-gray-700 rounded-2xl px-4">
<View className="h-10 w-10 items-center justify-center rounded-full bg-[#FFA66B]/20">
    <User size={20} color="#FFA66B" />
</View>

  <TextInput
    value={name}
    onChangeText={setIsName}
    placeholder="new name"
    placeholderTextColor="#9CA3AF"
    className=" ml-3 flex-1 h-10 outline-none text-white"
  />
</View>
      
        <View className=" w-[80%] rounded-[10px] m-auto mt-10 flex items-center justify-center ">
          <Pressable onPress={ButtonToChangeName} className="w-[90%] shadow-2xl shadow-[#FFA66B]  h-10 rounded-[10px]  bg-[#FFA66B] flex items-center justify-center ">
          <Text className="text-black font-semibold">Change</Text>
        </Pressable>
        </View>
      
      </BottomSheetView>
    </BottomSheetModal>
  );
 }
 if (variant === "CONTACT") {
 

  return (
    <BottomSheetModal
      ref={internalRef}
      snapPoints={["45%"]}
      enableDynamicSizing={false}
      enablePanDownToClose
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: "#1E1E2D",
      }}
      handleIndicatorStyle={{
        backgroundColor: "#3A3A44",
      }}
    >
      <BottomSheetView className="flex-1 px-6 pt-2">
        <Text className="mt-8 text-center text-[20px] font-bold text-white">
          Contact Us
        </Text>

        <Text className="mt-3 text-center text-gray-400">
          Have a question or found a problem? Contact our support team.
        </Text>

        <Pressable
          
          className="mt-8 flex-row items-center gap-4 rounded-2xl bg-gray-700 px-4 py-4"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-[#FFA66B]/20">
            <Mail size={21} color="#FFA66B" />
          </View>

          <View>
            <Text className="text-[16px] font-semibold text-white">
              Email Support
            </Text>

            <Text className="mt-1 text-gray-400">
              support@yourapp.com
            </Text>
          </View>
        </Pressable>

        <Text className="mt-6 text-center text-[13px] text-gray-500">
          We usually respond as soon as possible.
        </Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
if (variant === "PRIVACY") {
  return (
    <BottomSheetModal
      ref={internalRef}
      snapPoints={["65%"]}
      enableDynamicSizing={false}
      enablePanDownToClose
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: "#1E1E2D",
      }}
      handleIndicatorStyle={{
        backgroundColor: "#3A3A44",
      }}
    >
      <BottomSheetView className="flex-1 px-6 pt-2">
        <View className="mt-7 items-center">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-[#FFA66B]/15">
            <ShieldCheck
              size={28}
              color="#FFA66B"
            />
          </View>

          <Text className="mt-4 text-[20px] font-bold text-white">
            Privacy Policy
          </Text>

          <Text className="mt-2 text-center text-gray-400">
            Your privacy and financial information are important to us.
          </Text>
        </View>

        <View className="mt-8 gap-5">
          <View>
            <Text className="text-[16px] font-semibold text-white">
              Personal information
            </Text>

            <Text className="mt-1 leading-5 text-gray-400">
              We store only the information required for your account,
              such as your name and profile image.
            </Text>
          </View>

          <View>
            <Text className="text-[16px] font-semibold text-white">
              Financial information
            </Text>

            <Text className="mt-1 leading-5 text-gray-400">
              Your connected accounts and transactions are used only
              to provide financial tracking and analytics.
            </Text>
          </View>

          <View>
            <Text className="text-[16px] font-semibold text-white">
              Security
            </Text>

            <Text className="mt-1 leading-5 text-gray-400">
              We take reasonable measures to protect your information
              and prevent unauthorized access.
            </Text>
          </View>

          <View>
            <Text className="text-[16px] font-semibold text-white">
              Your control
            </Text>

            <Text className="mt-1 leading-5 text-gray-400">
              You can update your profile information and manage your
              account from the application settings.
            </Text>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
});

Menu.displayName = "Menu";

export default Menu;