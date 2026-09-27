import React, { useEffect, useRef } from 'react'
import { useAccountStore } from './store/useStatementStore';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { BankAccount, MonoAccount } from '@/types/type';
import MonoCarta from './MonoCarta';
import MenuAddCard from './MenuAddCard';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';

const CardUser = () => {
  const cardMenuRef = useRef<BottomSheetModal>(null);
 
  const monoDataFromStore = useAccountStore((state) => state.monoData);
  const selectedAccountId = useAccountStore((state) => state.selectedAccountId);

  const otherBankDataFromStore = useAccountStore((state) => state.bankData)
const deleteCartOutBank = useAccountStore((state) => state.deleteCartOutBank)
 const fetchMonobank = useAccountStore((state) => state.fetchMonobank);
  const fetchOtherBank = useAccountStore((state) => state.fetchOtherBank);
  const bank = useAccountStore((state) => state.bankData);
  const isLoading = useAccountStore((state) => state.isLoading)
useEffect(() => {
  
    fetchMonobank();
    fetchOtherBank();
  }, []);


      
   const monoDbAccount = otherBankDataFromStore?.find(
      (account) => account.provider === "monobank"
    );

   return (
     <ScrollView
          className="flex-1 bg-[#161622]"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
        >
    <View>
      <View className="w-[90%] m-auto mt-13 mb-5 flex-row flex items-center justify-center  h-[42px]">
        <Text className="text-white text-[20px]">My Cards</Text>
      </View>
      
      <View className="flex gap-5">
  {monoDbAccount &&      monoDataFromStore?.accounts?.map((mono: MonoAccount) => {
          
          return (
            <MonoCarta
              id={monoDbAccount?.id}
              variant={"CardList"}
              key={mono.id}
              monoDataFromStore={monoDataFromStore}
              balance={mono.balance}
              currencyCode={mono.currencyCode}
              maskedPan={mono.maskedPan}
            />
          );
        })}
        {otherBankDataFromStore?.filter((account) => account.provider !== 'monobank').map((account: BankAccount) => {


            return(
            <MonoCarta
    key={account.id}
        id={account.id}

    variant="CardListBank"
    provider={account.provider}
    balance={Number(account.balance)}
    currency={account.currency}
    currencyCode={Number(account.currency)}
    maskedPan={[account.displayNumber ?? ""]}
    displayNumber={account.displayNumber}
    displayExpiry={account.displayExpiry}
  />
          )
          
            
          
          
          
})}
      </View>
      <Pressable onPress={() => cardMenuRef.current?.present()} className="w-[84%] mt-9 rounded-[10px] m-auto h-[40px] bg-[#009cff]  flex items-center justify-center">
        <Text className="text-white font-medium">Add Card</Text>
      </Pressable>
      <MenuAddCard
        
        onClose={() => cardMenuRef.current?.dismiss()}
        ref={cardMenuRef}
      />
    </View>
    {isLoading && <>
    <View className="absolute inset-0 z-50 items-center justify-center bg-black/20">
        <Image
          source={require("@/assets/orange_loading_spinner_transparent.gif")}
          style={{ width: 100, height: 100 }}
          contentFit="contain"
        />
      </View></>}
    </ScrollView>
  );
}

export default CardUser
