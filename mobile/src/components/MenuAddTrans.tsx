import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  useState,
  useEffect,
  memo,
} from "react";

import { Animated, Pressable, Text, View } from "react-native";
import Reanimated, {
  LinearTransition,
  FadeInUp,
  FadeOutUp,
} from "react-native-reanimated";
import { Alert } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { BankAccount } from "@/types/type";
import { useAccountStore } from "./store/useStatementStore";

import PrivatCard from "../../assets/privatbank-card-minimal.svg";
import CategoriesList from "./CategoriesList";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/app/auth/login";

interface MenuProps {
  onClose: () => void;
 
}

const MenuAddTrans = memo(forwardRef<BottomSheetModal, MenuProps>(
  ({ onClose }, ref) => {
    const internalRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => ["80%"], []);
    
    const [selectCategories, setSelectCategories] = useState('')
    const BankOtherDataFromStore = useAccountStore((state) => state.bankData);
    useImperativeHandle(ref, () => internalRef.current as BottomSheetModal);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<BankAccount | null>(null);
    const [amount,setAmoung] = useState('')

    const [description, setDescription] = useState("")
      const fetchMonobank = useAccountStore((state) => state.fetchMonobank);
      
       const fetchOtherBank = useAccountStore((state) => state.fetchOtherBank);

    const botomCreateTrans = async (): Promise<void> => {
       const parsedAmount = Number(amount.replace(",", "."));
  if (!selectedCard) {
    Alert.alert("Ошибка", "Выберите карту");
    return;
  }

  if (!selectCategories) {
    Alert.alert("Ошибка", "Выберите категорию");
    return;
  }

  if (!amount.trim() || !Number.isFinite(parsedAmount)) {
    return;
  }

  const type = parsedAmount < 0 ? "expense" : "income";
      const token = await AsyncStorage.getItem("session_token");
      
      const response = await fetch( `${API_URL}/api/accounts/${selectedCard?.id}/transactions`, {
         method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: parsedAmount,
            type: type,
            description: description,
            categoryId: selectCategories,
            date: new Date().toISOString(),

          })
      })
        if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      if (response.ok){
        internalRef.current?.dismiss()
        fetchOtherBank()
        
      }
    }

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
          <View className="flex-1 items-center">
            <Text className="mt-8 text-[20px] font-bold text-white">
              Add Ne Transaction
            </Text>

            <Pressable
              onPress={() => setIsOpen(!isOpen)}
              className="w-[80%] self-center items-center mt-5 justify-center rounded-[13px] h-10 bg-gray-600/50"
            >
              <Text className="flex-row flex items-center gap-4 text-white text-[15px]">
                 <Text>{selectedCard?.provider == 'privatbank' && <Text><PrivatCard width={32} height={32}  /></Text>}</Text> 
                {selectedCard ? selectedCard.displayNumber : "Выберите карту ▼"}
              </Text>
            </Pressable>
            <Reanimated.View
              layout={LinearTransition.duration(150)}
              className="flex   w-[80%] gap-2 mt-5 mb-5">
              {isOpen && (
                <Reanimated.View
                  exiting={FadeOutUp.duration(190)}
                  layout={LinearTransition.duration(120)}
                  className=" gap-2"
                >
                  {BankOtherDataFromStore?.filter(
                    (account) =>
                      account.provider !== "monobank" &&
                      account.displayNumber !== selectedCard?.displayNumber,
                  ).map((bank: BankAccount, index) => (
                    <Reanimated.View
                      key={bank.id}
                      entering={FadeInUp.delay(index * 80)
                        .springify()
                        .damping(17)}
                    >
                      <Pressable
                        key={bank.id}
                        onPress={() => {
                          setSelectedCard(bank);
                          setIsOpen(false);
                        }}
                        className="w-[50%]   justify-center rounded-[13px] h-10 bg-gray-600/50"
                      >
                       <View className="flex-row w-[90%] m-auto items-center gap-5 justify-start">
                         <Text>{bank.provider == 'privatbank' && <Text><PrivatCard width={32} height={32}  /></Text>}</Text>
                       
                     
                          
                         <Text className="text-white text-[15px]">
                          {"•••• " + bank.bankAccountId.slice(-4)}
                        </Text>
                       
                       </View>
                      </Pressable>

                    </Reanimated.View>
                  ))}
                </Reanimated.View>
              )}
            </Reanimated.View>
          </View>
         <View>
          <Text className="text-white text-2xl font-semibold p-3">Categories</Text>
           <CategoriesList
           selectCategories={selectCategories as ""}
            setSelectCategories={ setSelectCategories}
          />
         </View>
           <View className="mt-7">
            <Text className="text-white text-2xl font-semibold p-3">Описание</Text>
        <TextInput
                       
                       placeholder="Please describe the transaction"
                       
                       className="w-full bg-gray-600/50 h-12 px-5 rounded-2xl border   text-white"
                       value={description}
                       onChangeText={setDescription}
                     />
        <Text className="text-white text-2xl font-semibold p-3">Сумма</Text>
        <TextInput
                       
                       placeholder="sum"
                       
                       className="w-[30%] bg-gray-600/50 h-12 px-5 rounded-2xl border   text-white"
                       value={String(amount)}
                       onChangeText={(value) => setAmoung((value))}
                     />
        </View>

        <Pressable onPress={botomCreateTrans} className="w-[80%] m-auto mt-6 rounded-[12px] flex items-center justify-center h-10 bg-[#FFA66B]">
          <Text className=" text-2xl font-semibold text-black">Create </Text>
        </Pressable>
        </BottomSheetView>
       
      </BottomSheetModal>
    );
  },
));

MenuAddTrans.displayName = "Menu";

export default MenuAddTrans;
