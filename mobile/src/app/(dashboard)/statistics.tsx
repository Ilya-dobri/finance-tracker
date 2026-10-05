import { getBankTransactionIcon } from '@/components/getBankTransactionImage';
import { getLogoForTx } from '@/components/getIconForTx';
import SpendingChart from '@/components/SpendingChart';
import { useAccountStore, useStatementStore } from '@/components/store/useStatementStore'
import { BankAccount, MonoAccount } from '@/types/type';
import { CreditCardIcon, X } from 'lucide-react-native';
import React, { memo, useMemo, useState } from 'react'
import { Image, Text, View } from 'react-native'
import monoCarta from '../../img/monoCarta.png';
import PrivatCard from '@/assets/privatbank-card-minimal.svg'
import {

  Pressable,
  Image as RNImage,
  Dimensions,
  ScrollView,
  SectionList,
} from "react-native";
const statistics = memo(() => {
  const [isActiveTransactionPanel, setIsActiveTransactionPanel] =
      useState(false);
  const monoDataFromStore = useAccountStore((state) => state.monoData);
  const bankDataFromStore = useAccountStore((state) => state.bankData);
  const selectAccount = useAccountStore((state) => state.selectedAccountId);
  const activeCardVariant = useAccountStore((state) => state.activeCardVariant);
  const statementData = useStatementStore((state) => state.statementMono);
  const statementBankAnt = useStatementStore((state) => state.statementBank);
const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const bank = useAccountStore((state) => state.bankData);
 const isMono = activeCardVariant === "MONOBANK_SUM";
const transactions = useMemo(() => {
  if (isMono) {
    return (statementData ?? []).map((item) => ({
      id: String(item.id),
      title: item.description ?? "",
      description: item.description ?? "",
      accountId: selectAccount ?? "",
      amount: Number(item.amount ?? 0) / 100,
      date: new Date(item.time * 1000).toISOString(),
      time: Number(item.time ?? 0),
      type: "",
      isMono: true,
    }));
  }

  return (statementBankAnt ?? []).map((item) => ({
    id: String(item.id),
    title: item.description ?? "",
    description: item.description ?? "",
    accountId: selectAccount ?? "",
    amount: Number(item.amount ?? 0),
    date: item.date ? String(item.date) : "",
    time: item.date ? new Date(item.date).getTime() / 1000 : 0,
    type: item.type ?? "",
    isMono: false,
  }));
}, [isMono, statementData, statementBankAnt, selectAccount]);
const filteredTransactions = useMemo(() => {
 


  const now = new Date();
   return transactions.filter((item) => {
    if (!item.date) return false;

    const date = new Date(item.date);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    const isCurrentMonth =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth();

    if (!isCurrentMonth) return false;

    if (selectedDay === null) {
      return true;
    }

    return (
      date.getDate() === selectedDay &&
      item.amount !== 0
    );
  });
}, [  transactions, selectedDay]);

const selectedCard = bank?.find(
  (card) => card.id === selectAccount
);

const selectedMonoCard = monoDataFromStore?.accounts?.find(
  (card: MonoAccount) => card.id === selectAccount
);
const selectBankCard = bankDataFromStore?.find(
  (card: BankAccount) => card.id === selectAccount
);

    const groupedTransactions = useMemo(() => {
  const groups = new Map<
    string,
    typeof filteredTransactions
  >();
      filteredTransactions.forEach((item) => {
        const date = new Date(item.date);
       const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    const transactions = groups.get(key) ?? [];
    transactions.push(item);
    groups.set(key, transactions);

      })
  return Array.from(groups, ([date, data]) => ({
    title: new Date(`${date}T12:00:00`).toLocaleDateString(
      "ru-RU",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ),
    data,
  }));
},[filteredTransactions]);
    
        
      

  return (
    <View className='w-full'>
      <View className='w-full mt-10 flex items-center h-10 mt-5 justify-center'>
        <Text className='text-white text-[20px] font-semibold'>Statistics</Text></View>
       <View className='mt-20 flex items-center h-10  justify-center'>
         <Text className='text-gray-600 text-2xl font-semibold'>Current Balance</Text>
        
           {activeCardVariant === "MONOBANK_SUM"? 
        
        
       <View className="w-[60%] gap-5 h-10 bg-[#1E1E2D] flex-row items-center justify-center gap-2 rounded-2xl">

  <View className="relative w-12 h-8 overflow-hidden">
     <Image
    source={monoCarta}
    accessibilityLabel="Mono Card"
    resizeMode="stretch"
    style={{
      position: "absolute",
      width: 130,
      height: 80,
      left: "50%",
      top: "50%",
      transform: [{ translateX: -65 }, { translateY: -40 }],
    }}
  />
  </View>

  <Text className="text-white">
    {selectedMonoCard?.maskedPan?.[0] ?? "Нет номера"}
  </Text>

</View>
       
        : <View className='w-[60%] gap-5 h-10 bg-[#1E1E2D] flex-row items-center justify-center gap-2 rounded-2xl'>
                <PrivatCard
              accessibilityLabel="PrivatBank Card"
              width={30}
              height={80}
              style={{
      
      
    }}
  />
           <Text className="text-white">
    {selectBankCard?.displayNumber ?? "Нет номера"}
  </Text>
  
  </View>}
 {activeCardVariant === "MONOBANK_SUM" ? ( monoDataFromStore?.accounts?.map((account: MonoAccount) => {
          if ( account.id !== selectAccount) {
            return null;
          }

          return (
            <View key={account.id} className='w-full flex items-center h-10  justify-center'>
              <Text className='text-white text-lg font-semibold'>{((account.balance ?? 0) / 100).toLocaleString("uk-UA")} ₴</Text>
            </View>
          );
        })) : (bankDataFromStore?.map((account: BankAccount) => {
          if ( account.id !== selectAccount) {
            return null;
          }

          return (
            <View key={account.id} className='w-full flex items-center h-10  justify-center'>
              <Text className='text-white text-lg font-semibold'>{(Number(account.balance ?? 0)).toLocaleString("uk-UA")} ₴</Text>
            </View>
          );
        }))}
       </View>

       <View className=' mt-10 flex items-center   justify-center'>
        <SpendingChart
  transactions={transactions}
  accountId={selectAccount ?? ""}
  selectedDay={selectedDay}
  onSelectDay={(day) => {
    setSelectedDay((prev) =>
      prev === day ? null : day
    );
  }}
/>
       </View>



        <View className="flex-row justify-between w-full items-center p-[23px]">
                   <Text className="text-[18px] text-white tracking-[1px] font-light">
                     Transaction
                   </Text>
       
                   <Pressable
                     onPress={() => setIsActiveTransactionPanel((prev) => !prev)}
                   >
                     <Text className="text-[14px] text-blue-600 underline">
                       View All
                     </Text>
                   </Pressable>
                 </View>
                  {isActiveTransactionPanel && (
              <Pressable
                onPress={() => setIsActiveTransactionPanel(false)}
                className="absolute top-6 right-3 z-50"
              >
                <View className="p-[6px] bg-gray-600 rounded-3xl">
                  <X size={24} color="red" />
                </View>
              </Pressable>
            )}
  <View
            className={`
              ${
                isActiveTransactionPanel
                  ? "overflow-hidden absolute top-0 z-40 h-screen w-full bg-[#1E1E2D] pt-10 p-[10px] rounded-[30px]"
                  : "bg-[#1E1E2D] w-[89%] m-auto flex flex-col gap-[15px] rounded-[30px] p-[10px]"
              }
            `}
          >
 {isActiveTransactionPanel ? (
              activeCardVariant === "MONOBANK_SUM" ? (
                <SectionList
                  style={{
                    flex: 1,
                  }}
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
                              source={{
                                uri: logoUrl,
                              }}
                              style={{
                                width: 24,
                                height: 24,
                              }}
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
                              {new Date(item.time * 100).toLocaleTimeString(
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
                         {item.amount.toFixed(2)} ₴
                        </Text>
                      </View>
                    );
                  }}
                  renderSectionFooter={({ section }) => (
                    <View className="py-4 my-3 border-t border-gray-700">
                      <Text className="text-gray-400 text-center">
                        {section.title}
                      </Text>
                    </View>
                  )}
                />
              ) : (
                <SectionList
                  style={{
                    flex: 1,
                  }}
                  sections={groupedTransactions}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingTop: 40,
                    paddingBottom: 30,
                  }}
                  renderItem={({ item }) => {
                    const icon = getBankTransactionIcon({
                      description: item.description ?? "",

                      type: (item.type ?? "") as Parameters<
                        typeof getBankTransactionIcon
                      >[0]["type"],
                    });

                    return (
                      <View className="h-[55px] flex-row justify-between items-center p-[5px]">
                        <View className="flex-row items-center gap-[17px] flex-1">
                          {icon}

                          <View className="flex-1">
                            <Text className="text-white" numberOfLines={1}>
                              {item.description}
                            </Text>

                            {item.date && (
                              <Text className="text-gray-400 text-xs">
                                {new Date(item.date).toLocaleTimeString(
                                  "ru-RU",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </Text>
                            )}
                          </View>
                        </View>

                        <Text className="text-white">
                          {Number(item.amount ) } ₴
                        </Text>
                      </View>
                    );
                  }}
                  renderSectionFooter={({ section }) => (
                    <View className="py-4 my-3 border-t border-gray-700">
                      <Text className="text-gray-400 text-center">
                        {section.title}
                      </Text>
                    </View>
                  )}
                />
              )
            ) : (
              <ScrollView
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 15,
                }}
              >
                {activeCardVariant === "MONOBANK_SUM"
                  ? filteredTransactions.slice(0,selectedDay === null
      ? 4
      : filteredTransactions.length
).map((item) => {
                      const logoUrl = getLogoForTx(item.description ?? "");

                      return (
                        <View
                          key={item.id}
                          className="h-[42px] flex-row w-full justify-between p-[5px] items-center"
                        >
                          <View className="flex-row items-center gap-[17px] flex-1">
                            {logoUrl ? (
                              <RNImage
                                source={{
                                  uri: logoUrl,
                                }}
                                style={{
                                  width: 24,
                                  height: 24,
                                }}
                                resizeMode="contain"
                              />
                            ) : (
                              <CreditCardIcon size={24} color="white" />
                            )}

                            <Text
                              className="text-white flex-1"
                              numberOfLines={1}
                            >
                              {item.description}
                            </Text>
                          </View>

                          <Text className="text-white">
                           {item.amount.toFixed(2)} ₴
                          </Text>
                        </View>
                      );
                    })
                  : filteredTransactions.slice(0, 4).map((item) => {
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
                          <View className="flex-row items-center gap-5 flex-1">
                            {icon}

                            <Text
                              className="text-white flex-1"
                              numberOfLines={1}
                            >
                              {item.description}
                            </Text>
                          </View>

                          <Text className="text-white">
                            {Number(item.amount)} ₴
                          </Text>
                        </View>
                      );
                    })}
              </ScrollView>
            )}
            </View>
    </View>
  )
})

export default statistics
