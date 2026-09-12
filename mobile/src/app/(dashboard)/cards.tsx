import MenuAddCard from "@/components/MenuAddCard";
import MonoCarta from "@/components/MonoCarta";
import { useAccountStore } from "@/components/store/useStatementStore";
import { BankAccount, MonoAccount } from "@/types/type";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";

const cards = () => {
    const cardMenuRef = useRef<BottomSheetModal>(null);
  const fetchMonobank = useAccountStore((state) => state.fetchMonobank);
  const monoDataFromStore = useAccountStore((state) => state.monoData);
  const selectedAccountId = useAccountStore((state) => state.selectedAccountId);
  const fetchOtherBank = useAccountStore((state) => state.fetchOtherBank)
  const otherBankDataFromStore = useAccountStore((state) => state.bankData)
  useEffect(() => {
    fetchMonobank();
  
  });

  return (
    <View>
      <View className="w-[90%] m-auto mt-4  flex-row flex items-center justify-center  h-[42px]">
        <Text className="text-white text-[20px]">My Cards</Text>
      </View>
      <View className="flex gap-5">
        {monoDataFromStore?.accounts?.map((mono: MonoAccount) => {
          return (
            <MonoCarta

              variant={"UNSUMM"}
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
  );
};

export default cards;
