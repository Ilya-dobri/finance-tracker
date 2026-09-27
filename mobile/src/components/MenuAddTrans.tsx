import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
} from "react";

import { Text, View } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { CardProps } from "./AccountUser";
import { BankAccount, MonoAccount } from "@/types/type";
import { useAccountStore } from "./store/useStatementStore";
import MonoCarta from "./MonoCarta";

interface MenuProps {
  onClose: () => void;
}

const MenuAddTrans = forwardRef<BottomSheetModal, MenuProps>(
  ({ onClose }, ref) => {
    const internalRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => ["80%"], []);
    
    const monoDataFromStore = useAccountStore((state) => state.monoData);
    const BankOtherDataFromStore = useAccountStore((state) => state.bankData);
    useImperativeHandle(ref, () => internalRef.current as BottomSheetModal);

    // const monoDbAccount = BankOtherDataFromStore?.find((account) =>{
    //   account.provider === 'monobank'
    // })

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
            <View className="flex w-full gap-2 ">
              {BankOtherDataFromStore?.filter((account)=> account.provider !== 'monobank')?.map((bank: BankAccount) => {
                return (
                  <View className="w-[80%] flex items-center justify-center rounded-[13px] m-auto h-10 bg-gray-600" key={bank.id}>
                    <Text className="text-white text-[15px]">{bank.last4}</Text>
                  </View>
                );

              })}
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

MenuAddTrans.displayName = "Menu";

export default MenuAddTrans;
