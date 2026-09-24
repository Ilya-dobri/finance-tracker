import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image as RNImage,
  Dimensions,
  ScrollView,
  SectionList,
} from "react-native";
import { QuickActionsMenu } from "./QuickActionsMenu";

import { CreditCardIcon, X } from "lucide-react-native";

import MenuAddCard from "./MenuAddCard";

import {
  MonoAccount,
  MonoCardProps,
  MonoData,
  OtherCardProps,
} from "@/types/type";

import { useAccountStore, useStatementStore } from "./store/useStatementStore";
import { getLogoForTx } from "./getIconForTx";
import { Carousel } from "react-native-reanimated-carousel";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";

import MonoCarta from "./MonoCarta";
import { syncNotifications } from "./services/notifications/syncNotifications";
import { getBankTransactionIcon } from "./getBankTransactionImage";
import Header from "./Header";
import { router } from "expo-router";

export type MonoAccountsResponse = MonoData | MonoAccount[];

export type CardProps = MonoCardProps | OtherCardProps;
const AccountUser: React.FC = () => {
  const cardMenuRef = useRef<BottomSheetModal | null>(null);
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
  const fetchOtherBank = useAccountStore((state) => state.fetchOtherBank);
  const setSelectedAccountId = useAccountStore(
    (state) => state.setSelectedAccountId,
  );
  const selectedAccountId = useAccountStore((state) => state.selectedAccountId)
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const BankOtherDataFromStore = useAccountStore((state) => state.bankData);

  const [activeCardVariant, setActiveCardVariant] = useState<"SUM" | "OTHER">(
    "SUM",
  );
  const [isActiveTransactionPanel, setIsActiveTransactionPanel] =
    useState(false);
  useEffect(() => {
    fetchMonobank();
    fetchOtherBank();
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const refreshData = async () => {
  if (refreshing) return;
  setRefreshing(true)
  try {
    await Promise.all([
      fetchMonobank(),
       fetchOtherBank()
    ])
    if (activeCardId){
      if(activeCardVariant == 'SUM'){
        await getCardStatement(activeCardId)
      }else{
        await getCardStatementBank(activeCardId)
        await syncNotifications(activeCardId);
      }
    }
  } catch (error) {
    console.error("Ошибка обновления:", error);
  }finally{
    setRefreshing(false)
  }

}

  const cards: CardProps[] = useMemo(() => {
    const monoCards =
      monoDataFromStore?.accounts?.map((account: MonoAccount) => ({
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
    const monoAccountId = monoDataFromStore?.accounts?.[0]?.id;

    const otherAccountId = BankOtherDataFromStore?.[0]?.id;

    if (monoAccountId) {
      getCardStatement(monoAccountId);
    }

    if (otherAccountId) {
      getCardStatementBank(otherAccountId);
    }
  }, [
    monoDataFromStore,
    BankOtherDataFromStore,
    getCardStatement,
    getCardStatementBank,
  ]);
  const handleCardChange = async (index: number) => {
    const activeCard = cards[index];

    if (!activeCard) return;

    setActiveCardVariant(activeCard.variant);
    setActiveCardId(activeCard.id);
    setSelectedAccountId(activeCard.id);

    if (activeCard.variant === "SUM") {
      await getCardStatement(activeCard.id);
      return;
    }

    await syncNotifications(activeCard.id);

    await getCardStatementBank(activeCard.id);
  };
  const FilterTransaction = (
    items: typeof statementData | typeof statementBankAnt,
  ) => {
    return isActiveTransactionPanel ? items : items.slice(0, 4);
  };

  const groupedTransactions = useMemo(() => {
    const groups = new Map<string, typeof statementData>();

    
    statementData.forEach((item) => {
      const date = new Date(item.time * 1000);
      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");
      const transactions = groups.get(key) ?? [];
      transactions.push(item);
      groups.set(key, transactions);
    });
    return Array.from(groups, ([date, data]) => ({
      title: new Date(`${date}T12:00:00`).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      data,
    }));
  }, [statementData]);



useEffect(() => {
  console.log("SELECTED CARD:", selectedAccountId);
}, [selectedAccountId]);

useEffect(() => {
  if(cards.length === 0) return
  const firstCard = cards[0]
  setActiveCardId(firstCard.id)
   setActiveCardVariant(firstCard.variant);
  setSelectedAccountId(firstCard.id);
  if (firstCard.variant === "SUM") {
    getCardStatement(firstCard.id);
  } else {
    getCardStatementBank(firstCard.id);
  }
}, [cards])
  return (
    <View className="relative flex-1">
      <Header />

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
        <>
          <View className="mt-[20px]">
            <Carousel
              loop={false}
              style={{
                width: PAGE_WIDTH,
                height: 240,
              }}
              onSnapToItem={(index: number) => {
                void handleCardChange(index);
                
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
            <QuickActionsMenu analytics={() => router.push('/statistics')} add={() => {}} refresh={refreshData} />
          </View>

          <View className="flex-row justify-between w-full items-center p-[23px]">
            <Text className="text-[18px] text-white tracking-[1px] font-light">
              Transaction
            </Text>

            <Pressable
              onPress={() =>
                setIsActiveTransactionPanel(!isActiveTransactionPanel)
              }
            >
              <Text className="text-[14px] text-blue-600 underline">
                View All
              </Text>
            </Pressable>
          </View>

          <View
            className={`${isActiveTransactionPanel ? "overflow-hidden absolute top-0 h-screen w-[100%] bg-[#1E1E2D] pt-10 p-[10px] gap-[15px] rounded-[30px]" : "bg-[#1E1E2D] w-[89%] m-auto flex flex-col gap-[15px] rounded-[30px] p-[10px]"}`}
          >
            {isActiveTransactionPanel && (
              <Pressable
                onPress={() =>
                  setIsActiveTransactionPanel(!isActiveTransactionPanel)
                }
                className="flex-row absolute top-6 right-3 items-center"
              >
                <View className="p-[6px] bg-gray-600 rounded-3xl">
                  <X size={24} color="red" />
                </View>
              </Pressable>
            )}
            <ScrollView
              scrollEnabled={isActiveTransactionPanel}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              style={isActiveTransactionPanel ? { flex: 1 } : undefined}
              contentContainerStyle={{ gap: 15 }}
            >
              {isActiveTransactionPanel && activeCardVariant === "SUM" ? (
                <SectionList
                  style={{ flex: 1 }}
                  sections={groupedTransactions}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingTop: 40,
                    paddingBottom: 30,
                  }}
                  renderItem={({ item }) => {
                    const logoUrl = getLogoForTx(item.description ?? "");

                    return (
                      <View className="h-[55px] flex-row justify-between items-center p-[5px]">
                        <View className="flex-row items-center gap-[17px] flex-1">
                          {logoUrl ? (
                            <RNImage
                              source={{ uri: logoUrl }}
                              style={{ width: 24, height: 24 }}
                              resizeMode="contain"
                            />
                          ) : (
                            <CreditCardIcon size={24} color="white" />
                          )}

                          <View className="flex-1">
                            <Text className="text-white" numberOfLines={1}>
                              {item.description}
                            </Text>

                            <Text className="text-gray-400 text-xs">
                              {new Date(item.time * 1000).toLocaleTimeString(
                                "ru-RU",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </Text>
                          </View>
                        </View>

                        <Text className="text-white">
                          {Number(item.amount ?? 0) / 100} ₴
                        </Text>
                      </View>
                    );
                  }}
                  renderSectionFooter={({ section }: any) => (
                    <View className="py-4 my-3 border-t border-gray-700">
                      <Text className="text-gray-400 text-center">
                        {section.title}
                      </Text>
                    </View>
                  )}
                />
              ) : (
                FilterTransaction(statementData).map((item) => {
                  const logoUrl = getLogoForTx(item.description ?? "");

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
                          <CreditCardIcon
                            width={24}
                            height={24}
                            color="white"
                          />
                        )}

                        <Text className="text-white">{item.description}</Text>
                      </View>

                      <Text className="text-white">
                        {Number(item.amount ?? 0) / 100}₴
                      </Text>
                    </View>
                  );
                })
              )}

              {activeCardVariant === "OTHER" &&
                statementBankAnt.slice(0, 4).map((item) => {
                  const icon = getBankTransactionIcon({
                    description: item.description ?? "",
                    type: (item.type ?? "") as Parameters<
                      typeof getBankTransactionIcon
                    >[0]["type"],
                  });
                  return (
                    <View
                      key={item.id}
                      className="h-[42px] flex-row w-full justify-between p-[5px] items-center"
                    >
                      <View className="flex-row items-center flex gap-5">
                        {icon}
                        <Text className="text-white">{item.description}</Text>
                      </View>

                      <Text className="text-white">
                        {" "}
                        {Number(item.amount)} ₴
                      </Text>
                    </View>
                  );
                })}
            </ScrollView>
          </View>
        </>
      )}

      {refreshing && <>
       <View className="absolute inset-0 z-50 items-center justify-center bg-black/20">
    <Image
      source={require("@/assets/orange_loading_spinner_transparent.gif")}
      style={{ width: 100, height: 100 }}
      contentFit="contain"
    />
  </View>
      </>}
      <MenuAddCard
        onClose={() => cardMenuRef.current?.dismiss()}
        ref={cardMenuRef}
      />
    </View>
  );
};

export default AccountUser;
