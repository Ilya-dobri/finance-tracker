import React, {
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { MonoAccount, MonoCardProps, MonoData, MonoStatement, OtherCardProps } from "@/types/type";
import { useStore } from "zustand";
import { useAccountStore, useStatementStore } from "./store/useStatementStore";
import { getLogoForTx } from "./getIconForTx";
import { Carousel } from "react-native-reanimated-carousel";
import { useFocusEffect, usePathname } from "expo-router";
import MonoCarta from "./MonoCarta";

export type MonoAccountsResponse = MonoData | MonoAccount[];


export type CardProps = MonoCardProps | OtherCardProps;
const AccountUser: React.FC = () => {
  const cardMenuRef = useRef<BottomSheetModal>(null);
  const getCardStatement = useStatementStore(
    (state) => state.getCardStatementMono,
  );
  const getCardStatementBank = useStatementStore(
    (state) => state.getCartAnotherBankStatement,
  );
  const statementData = useStatementStore((state) => state.statementMono);
  const statementBankAnt = useStatementStore((state) => state.statementBank);
  const { width: PAGE_WIDTH } = Dimensions.get("window");
  const fetchMonobank = useAccountStore((state) => state.fetchMonobank);
  const monoDataFromStore = useAccountStore((state) => state.monoData);
  const hasFetchedRef = useRef(false);
  const fetchOtherBank = useAccountStore((state) => state.fetchOtherBank);
  const setSelectedAccountId = useAccountStore(
    (state) => state.setSelectedAccountId,
  );
  const [activeCardVariant, setActiveCardVariant] = useState<"SUM" | "OTHER">(
    "SUM",
  );
  const BankOtherDataFromStore = useAccountStore((state) => state.bankData);
  useEffect(() => {
    fetchMonobank();
    fetchOtherBank();
  }, []);
  const cards: CardProps[] = useMemo(() => {
    const monoCards =
      monoDataFromStore?.accounts?.map((account:MonoAccount) => ({
        variant: "SUM" as const,
        id: account.id,

        balance: account.balance,
        currencyCode: account.currencyCode,
        maskedPan: account.maskedPan,

        monoDataFromStore,
      })) ?? [];

    const otherCards =
      BankOtherDataFromStore?.map((account) => ({
        variant: "OTHER" as const,
        id: account.id,

        balance: Number(account.balance),
        provider: account.provider,
        currency: account.currency,

        displayNumber: account.displayNumber,
        displayExpiry: account.displayExpiry,
      })) ?? [];

    return [...monoCards, ...otherCards];
  }, [monoDataFromStore, BankOtherDataFromStore]);

  useEffect(() => {
    const accountId =
      monoDataFromStore?.accounts?.[0]?.id || BankOtherDataFromStore?.[0]?.id;
    if (!accountId) return;

    getCardStatement(accountId);
    getCardStatementBank(accountId);
  }, [monoDataFromStore, BankOtherDataFromStore]);

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
            <Carousel
              loop={false}
              style={{
                width: PAGE_WIDTH,
                height: 240,
              }}
              onSnapToItem={(index: number) => {
                const activeCard = cards[index];

                if (!activeCard) return;

                setActiveCardVariant(activeCard.variant);

                if (activeCard.variant === "SUM") {
                  getCardStatement(activeCard.id);
                } else {
                  getCardStatementBank(activeCard.id);
                }
              }}
              data={cards}
              renderItem={({ item }) => {
                if (item.variant === "SUM") {
                  return (
                    <MonoCarta
                      variant="SUM"
                      monoDataFromStore={item.monoDataFromStore}
                      balance={item.balance}
                      currencyCode={item.currencyCode}
                      maskedPan={item.maskedPan}
                    />
                  );
                }

                return (
                  <MonoCarta
                    variant="OTHER"
                    balance={item.balance}
                    provider={item.provider}
                    currency={item.currency}
                    displayNumber={item.displayNumber}
                    displayExpiry={item.displayExpiry}
                    currencyCode={0}
                    maskedPan={[]}
                  />
                );
              }}
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

          <View className="bg-[#1E1E2D] w-[89%] m-auto flex flex-col gap-[15px] rounded-[30px] p-[10px]">
            {activeCardVariant === "SUM" &&
              statementData.slice(0, 4).map((item) => {
                const logoUrl = getLogoForTx(item.description);

                return (
                  <View
                    key={item.id}
                    className="h-[42px] flex-row w-full justify-between p-[5px] items-center"
                  >
                    <View className="flex-row items-center gap-[17px]">
                      {logoUrl ? (
                        <RNImage
                          source={{ uri: logoUrl }}
                          style={{ width: 24, height: 24 }}
                          resizeMode="contain"
                        />
                      ) : (
                        <CreditCardIcon width={24} height={24} color="white" />
                      )}

                      <Text className="text-white">{item.description}</Text>
                    </View>

                    <Text className="text-white">{item.amount / 100}₴</Text>
                  </View>
                );
              })}

            {activeCardVariant === "OTHER" &&
              statementBankAnt.slice(0, 4).map((item) => (
                <View
                  key={item.id}
                  className="h-[42px] flex-row w-full justify-between p-[5px] items-center"
                >
                  <Text className="text-white">{"Транзакция"}</Text>

                  <Text className="text-white">{Number(item.balance)} ₴</Text>
                </View>
              ))}
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
