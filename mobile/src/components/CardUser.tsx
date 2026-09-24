import React, { useEffect, useRef } from 'react'
import { useAccountStore } from './store/useStatementStore';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { BankAccount, MonoAccount } from '@/types/type';
import MonoCarta from './MonoCarta';
import MenuAddCard from './MenuAddCard';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const CardUser = () => {
  const cardMenuRef = useRef<BottomSheetModal>(null);
  const fetchMonobank = useAccountStore((state) => state.fetchMonobank);
  const monoDataFromStore = useAccountStore((state) => state.monoData);
  const selectedAccountId = useAccountStore((state) => state.selectedAccountId);
  const fetchOtherBank = useAccountStore((state) => state.fetchOtherBank)
  const otherBankDataFromStore = useAccountStore((state) => state.bankData)




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
        {monoDataFromStore?.accounts?.map((mono: MonoAccount) => {
          return (
            <MonoCarta

              variant={"CardList"}
              key={mono.id}
              monoDataFromStore={monoDataFromStore}
              balance={mono.balance}
              currencyCode={mono.currencyCode}
              maskedPan={mono.maskedPan}
            />
          );
        })}
        {otherBankDataFromStore?.map((account: BankAccount) => (
           <MonoCarta
    key={account.id}
    variant="OTHER"
    provider={account.provider}
    balance={Number(account.balance)}
    currency={account.currency}
    currencyCode={Number(account.currency)}
    maskedPan={[account.displayNumber ?? ""]}
    displayNumber={account.displayNumber}
    displayExpiry={account.displayExpiry}
  />
        ))}
      </View>
      <Pressable onPress={() => cardMenuRef.current?.present()} className="w-[84%] mt-9 rounded-[10px] m-auto h-[40px] bg-[#009cff]  flex items-center justify-center">
        <Text className="text-white font-medium">Add Card</Text>
      </Pressable>
      <MenuAddCard
        
        onClose={() => cardMenuRef.current?.dismiss()}
        ref={cardMenuRef}
      />
    </View>
    </ScrollView>
  );
}

export default CardUser
