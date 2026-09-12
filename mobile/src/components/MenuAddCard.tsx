import React, {
  useCallback,
  forwardRef,
  useMemo,
  useState,
  useRef,
  useImperativeHandle,
} from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { ChevronRight, CreditCardIcon, Key } from "lucide-react-native";
import { API_URL } from "@/app/auth/login";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MenuAddCardProps {
  onClose: () => void;
}

const MenuAddCard = forwardRef<BottomSheetModal, MenuAddCardProps>(
  ({ onClose }, ref) => {
    const snapPoints = useMemo(() => ["80%"], []);

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          onClose();
        }
      },
      [onClose],
    );

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
    const internalRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => internalRef.current as BottomSheetModal);
    const [cvv, setCVV] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [isvisible, setIsVisible] = useState(false);
    const [bankKey, setBankKey] = useState("");
    const [bank, setBank] = useState("");
    const menuProgress = useSharedValue(0);
    const menuAnimatedStyle = useAnimatedStyle(() => ({
      opacity: menuProgress.value,
      transform: [{ translateY: (1 - menuProgress.value) * -8 }],
    }));

    const changeBank = (text: string) => {
      setBank(text);
      setIsVisible(false);
      menuProgress.value = withTiming(0, { duration: 180 });
    };
    const cleanCardNumber = cardNumber.replace(/\D/g, "");

    const last4 = cleanCardNumber.slice(-4);

    const handleCardNumber = (text: string) => {
      const digits = text.replace(/\D/g, "").slice(0, 16);

      const formatted = digits.match(/.{1,4}/g)?.join(" ") ?? "";

      setCardNumber(formatted);
    };
    
    const handleCVVNumber = (text: string) => {
      const digits = text.replace(/\D/g, "").slice(0, 4);

       let formatted = digits;

  if (digits.length > 2) {
    formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

      setCVV(formatted);
    };
    const sendDataBank = async () => {
        if (!bank) {
    console.error("Сначала выберите банк");
    return;
  }
  if (bank === "monobank") {
    await sendMonobank();
  } else {
    await sendOtherBank();
  }
};
    const sendMonobank = async () => {
      try {
        const token = await AsyncStorage.getItem("session_token");

        const response = await fetch(`${API_URL}/api/accounts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ← обязательно, иначе 401
          },
          
          body: JSON.stringify({
            name: bank, // раньше было "bank"
            provider: bank, // "monobank" / "privatbank"
            bankAccountId: bankKey, // раньше было "Key"
            currency: "UAH", // или что там нужно по схеме
            
           
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log(data);
          internalRef.current?.dismiss();
        } else {
          console.error("Error sending bank data:", response.status, data);
        }
      } catch (err) {
        console.error("Network/fetch error:", err);
      }
    };
    const sendOtherBank = async () => {
      try {
        const token = await AsyncStorage.getItem("session_token");

        const response = await fetch(`${API_URL}/api/accounts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ← обязательно, иначе 401
          },
          
          body: JSON.stringify({
            name: bank, // раньше было "bank"
            provider: bank, // "monobank" / "privatbank"
            currency: "UAH", // или что там нужно по схеме
            
            displayNumber: cardNumber,
            bankAccountId: last4,
            displayExpiry: cvv
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log(data);
          internalRef.current?.dismiss();
        } else {
          console.error("Error sending bank data:", response.status, data);
        }
      } catch (err) {
        console.error("Network/fetch error:", err);
      }
    };
    return (
      <BottomSheetModal
        topInset={0}
        ref={internalRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "#1E1E2D" }}
        handleIndicatorStyle={{ backgroundColor: "#3A3A44" }}
      >
        <BottomSheetView className="flex-1 px-6 pt-2">
          <View className="mt-[30px] w-full flex items-center justify-center  gap-6">
            <View className="w-auto h-auto p-3 bg-[#ff7f3af1] rounded-3xl">
              <CreditCardIcon className="w-10 h-10" color="white" />
            </View>
            <Text className="text-white text-[20px] font-bold mb-4">
              Добавить карту
            </Text>
            <View className="relative z-10  w-[80%]">
              <Text className="text-white text-[16px] font-medium mb-2">
                Выберите банк
              </Text>
              <Pressable
                className="  w-full rounded-2xl bg-[#27273A] px-5 py-4"
                onPress={() => {
                  setIsVisible(!isvisible);
                  menuProgress.value = withTiming(isvisible ? 0 : 1, {
                    duration: 180,
                  });
                }}
              >
                <Text className="text-white">{bank || "Выбрать банк"}</Text>
              </Pressable>
              {isvisible ? (
                <Animated.View
                  pointerEvents={isvisible ? "auto" : "none"}
                  className="  w-[200px] rounded-2xl  px-5 py-4"
                  style={menuAnimatedStyle}
                >
                  <View className="absolute left-0 top-0 w-auto rounded-2xl  p-2">
                    <Pressable
                      className="min-w-[180px] flex-row items-center justify-between rounded-xl border border-[#5A5A64] bg-[#3B3B49] px-4 py-3 active:bg-[#626273]"
                      onPress={() => changeBank("monobank")}
                      accessibilityRole="button"
                    >
                      <Text className="text-base font-medium text-white">
                        monobank
                      </Text>
                      <ChevronRight size={18} color="#BDBDC7" />
                    </Pressable>
                    <Pressable
                      className="mt-2 min-w-[180px] flex-row items-center justify-between rounded-xl border border-[#5A5A64] bg-[#3B3B49] px-4 py-3 active:bg-[#626273]"
                      onPress={() => changeBank("privatbank")}
                      accessibilityRole="button"
                    >
                      <Text className="text-base font-medium text-white">
                        privatbank
                      </Text>
                      <ChevronRight size={18} color="#BDBDC7" />
                    </Pressable>
                    <Pressable
                      className="mt-2 min-w-[180px] flex-row items-center justify-between rounded-xl border border-[#5A5A64] bg-[#3B3B49] px-4 py-3 active:bg-[#626273]"
                      onPress={() => changeBank("pumb")}
                      accessibilityRole="button"
                    >
                      <Text className="text-base font-medium text-white">
                        pumb
                      </Text>
                      <ChevronRight size={18} color="#BDBDC7" />
                    </Pressable>
                  </View>
                </Animated.View>
              ) : null}
            </View>
            {bank === "monobank" && (
              <View className="w-[80%]">
                <Text className="text-white text-[16px] font-medium mb-2">
                  Ключ доступа
                </Text>
                <TextInput
                  placeholder="Введите ключ доступа от банка"
                  placeholderTextColor="#A2A2A7"
                  className="w-full h-14 px-5 rounded-2xl border-0 bg-[#27273A] text-base text-white focus:border-0 focus:outline-[#ff7f3af1]"
                  style={{ borderWidth: 0 }}
                  value={bankKey}
                  onChangeText={setBankKey}
                />
              </View>
            )}
            {bank !== "monobank" && (
              <>
                <View className="w-[80%] mt-[10px]">
                  <Text className="text-white text-[16px] font-medium mb-2">
                    NumBank
                  </Text>
                  <TextInput
                    placeholder="0000 0000 0000 0000"
                    placeholderTextColor="#A2A2A7"
                    keyboardType="number-pad"
                    className="w-full h-14 px-5 rounded-2xl border-0 bg-[#27273A] text-base text-white focus:border-0 focus:outline-[#ff7f3af1]"
                    style={{ borderWidth: 0 }}
                    value={cardNumber}
                    onChangeText={handleCardNumber}
                  />
                </View>
                <View className="w-[80%] ">
                  <View className="w-[40%] ">
                    <Text className="text-white text-[16px] font-medium mb-2">
                      CVV
                    </Text>
                    <TextInput
                      placeholder="00/00"
                      placeholderTextColor="#A2A2A7"
                      keyboardType="number-pad"
                      className="w-full h-14 px-5 rounded-2xl border-0 bg-[#27273A] text-base text-white focus:border-0 focus:outline-[#ff7f3af1]"
                      style={{ borderWidth: 0 }}
                      value={cvv}
                      onChangeText={handleCVVNumber}
                    />
                  </View>
                </View>
              </>
            )}

            <Pressable
              className="w-[60%] h-12 bg-[#FF7E3A] flex items-center justify-center rounded-2xl mt-6"
              onPress={sendDataBank}
            >
              <Text className="font-bold text-[18px] text-white">Добавить</Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default MenuAddCard;
