import React, { use, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image as RNImage,
  Dimensions,
} from "react-native";
import { QuickActionsMenu } from "./QuickActionsMenu";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";
import { CreditCardIcon } from "lucide-react-native";
import { API_URL } from "@/app/auth/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MenuAddCard from "./MenuAddCard";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { MonoStatement } from "@/types/type";
import { useStore } from "zustand";
import { useAccountStore, useStatementStore } from "./store/useStatementStore";
import { getLogoForTx } from "./getIconForTx";
import { Carousel } from "react-native-reanimated-carousel";

interface MonoAccount {
  id: string;
  balance: number;
  currencyCode: number;
  maskedPan: string[];
  iban: string;
  type: string;
  sendId: string;
  clientId: string;
  // ... інші поля за потреби
}

interface MonoData {
  clientId?: string;
  name?: string;
  accounts: MonoAccount[];
}

interface AccountStoreState {
  getCardStatement: (accountId: string) => void;
}

export type MonoAccountsResponse = MonoData | MonoAccount[];

const AccountUser: React.FC = () => {
 

  const cardMenuRef = useRef<BottomSheetModal>(null);
  const getCardStatement = useStatementStore((state) => state.getCardStatement);
  const statementData = useStatementStore((state) => state.statement);
  const { width: PAGE_WIDTH } = Dimensions.get("window");
  const fetchMonobank = useAccountStore((state) => state.fetchMonobank);
  const monoDataFromStore = useAccountStore((state) => state.monoData);
useEffect(() => {
    fetchMonobank();
  }, []);

  useEffect(() => {
    if (monoDataFromStore?.accounts?.[0]?.id) {
      getCardStatement(monoDataFromStore.accounts[0].id);
    }
  }, [monoDataFromStore]);

  return (
    <View className="">
      {monoDataFromStore?.accounts?.length === 0 ? (
        <View className="flex mt-[180px] gap-10 justify-center items-center">
          <View className="w-auto h-auto p-3 bg-[#1E1E2D] rounded-3xl">
            <CreditCardIcon className="w-20 h-20" color="white" />
          </View>
          <View className="flex flex-col justify-center items-center gap-4">
            <Text className="text-[18px] font-bold text-white">
              У вас нет карт 😭
            </Text>
            <Pressable
              onPress={() => cardMenuRef.current?.present()}
              className="w-64 h-12 bg-[#FF7E3A] flex items-center justify-center rounded-3xl"
            >
              <Text className="font-bold text-[18px]  ">Добавить</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View>
          <View className="mt-[20px]">
            <Carousel<MonoAccount>
              loop={false}
              style={{ width: PAGE_WIDTH, height: 240 }}
              data={monoDataFromStore?.accounts || []}
              onSnapToItem={(index: number) => {
                const activeCard = monoDataFromStore?.accounts[index];
                if (activeCard?.id) {
                  getCardStatement(activeCard.id);
                }
              }}
              renderItem={({ item: f }) => (
                <View className="flex items-center justify-center w-full">
                  <View
                    id="card"
                    className="relative p-[23px] h-[199px] w-[335px] justify-between flex flex-col rounded-[28px]"
                    style={{ backgroundColor: "#1c1c1f" }}
                  >
                    <Text className="font-bold tracking-[2px] text-[18px] text-white">
                      monobank
                    </Text>

                    <View className="flex-row justify-center items-center h-auto gap-6">
                      <Text className="text-[24px] text-[#cdcdcd] tracking-[5px]">
                        {f.maskedPan?.[0]}
                      </Text>
                    </View>

                    <Text className="font-medium uppercase tracking-[3px] text-[#cdcdcd]">
                      {monoDataFromStore?.name || "TARAS SHEVCHENKO"}
                    </Text>
                  </View>

                  <Text className="text-white mt-3 text-[16px] font-semibold">
                    {(f.balance / 100).toLocaleString("uk-UA")}{" "}
                    {f.currencyCode === 980 ? "UAH" : f.currencyCode}
                  </Text>
                </View>
              )}
            />
          </View>

          <View>
            <QuickActionsMenu />
          </View>

          <View className="flex-row justify-between w-full items-center p-[23px]">
            <Text className="text-[18px] text-white tracking-[1px] font-light">
              Transaction
            </Text>
            <Text className="text-[14px] text-blue-600 underline">
              Sell All
            </Text>
          </View>

          <View className="bg-[#1E1E2D] w-[95%] m-auto flex flex-col gap-[13px] rounded-2xl p-[10px]">
            {statementData.slice(0, 4).map((item) => {
              const logoUrl = getLogoForTx(item.description);
              return (
                <View
                  key={item.id}
                  className="h-[42px]  flex-row w-full rounded-xl m-auto justify-between p-[23px] items-center"
                >
                  <View className="flex-row items-center  justify-center gap-[17px]">
                    <View className="w-10.5 h-10.5 bg-[#1E1E2D] rounded-2xl flex items-center justify-center rounded-4xl">
                      <View className="w-10.5 h-10.5 bg-[#1E1E2D] flex items-center justify-center rounded-2xl overflow-hidden">
                        {logoUrl ? (
                          <RNImage
                            source={{ uri: logoUrl }}
                            style={{ width: 24, height: 24 }}
                            resizeMode="contain"
                          />
                        ) : (
                          <CreditCardIcon
                            width={24}
                            height={24}
                            color="white"
                          />
                        )}
                      </View>
                    </View>

                    <View className="flex flex-col">
                      <Text className="text-white text-[16px]">
                        {item.description}
                      </Text>
                      <Text className="text-[12px] text-gray-600">
                        Entertainment
                      </Text>
                    </View>
                  </View>
                  <Text className="text-white">{item.amount / 100}₴ </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
      <MenuAddCard
        onClose={() => cardMenuRef.current?.dismiss()}
        ref={cardMenuRef}
      />
    </View>
  );
};

export default AccountUser;
