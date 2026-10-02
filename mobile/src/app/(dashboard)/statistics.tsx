import { getBankTransactionIcon } from '@/components/getBankTransactionImage';
import { getLogoForTx } from '@/components/getIconForTx';
import SpendingChart from '@/components/SpendingChart';
import { useAccountStore, useStatementStore } from '@/components/store/useStatementStore'
import { MonoAccount } from '@/types/type';
import { CreditCardIcon, X } from 'lucide-react-native';
import React, { memo, useMemo, useState } from 'react'
import { Text, View } from 'react-native'
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
  const selectAccount = useAccountStore((state) => state.selectedAccountId);
  const activeCardVariant = useAccountStore((state) => state.activeCardVariant);
  const statementData = useStatementStore((state) => state.statementMono);
  const statementBankAnt = useStatementStore((state) => state.statementBank);
const [selectedDay, setSelectedDay] = useState<number | null>(null);
const filteredTransactions = useMemo(() => {
  if (selectedDay === null) {
    return statementData || statementBankAnt;
  }
  

  const now = new Date();

  return statementData.filter((item) => {
    const date = new Date(item.time * 1000);

    return (
      Number(item.amount) < 0 &&
      date.getDate() === selectedDay &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

}, [statementData, selectedDay]);
    const chartTransactions = useMemo(
      () =>
        statementData.map((item) => ({
          ...item,
          title: item.description ?? "",
          accountId: selectAccount ?? "",
          date: new Date(item.time * 1000).toISOString(),
        })),
      [statementData, selectAccount],
    );


    const groupedMonoTransactions = useMemo(() => {
        const groups = new Map<string, typeof statementData>();
    
        filteredTransactions.forEach((item) => {
          const date = new Date(item.time * 1000);
          const key = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
    
            String(date.getDate()).padStart(2, "0"),
          ].join("-");
          const transactions = groups.get(key) ?? [];
          transactions.push(item);
          groups.set(key, transactions);
        },[filteredTransactions]);
    
        return Array.from(groups, ([date, data]) => ({
          title: new Date(`${date}T12:00:00`).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
    
          data,
        }));
      }, [statementData, filteredTransactions]);
      
        const groupedTransactions = useMemo(() => {
          const groupsOther = new Map<string, typeof statementBankAnt>();
          
          statementBankAnt.forEach((item) => {
            if (!item.date) return;
            const date = new Date(item.date);
            const key = [
              date.getFullYear(),
              String(date.getMonth() + 1).padStart(2, "0"),
      
              String(date.getDate()).padStart(2, "0"),
            ].join("-");
            const transactions = groupsOther.get(key) ?? [];
            transactions.push(item);
            groupsOther.set(key, transactions);
          });
      
          return Array.from(groupsOther, ([date, data]) => ({
            title: new Date(`${date}T12:00:00`).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
      
            data,
          }));
        }, [statementBankAnt]);
  return (
    <View>
      <View className='w-full mt-10 flex items-center h-10 mt-5 justify-center'>
        <Text className='text-white text-[20px] font-semibold'>Statistics</Text></View>
       <View className='w-full mt-20 flex items-center h-10  justify-center'>
         <Text className='text-gray-600 text-2xl font-semibold'>Current Balance</Text>
        <Text> {activeCardVariant === "MONOBANK_SUM"? '123' : '222'}</Text>
  {monoDataFromStore?.accounts?.map((account: MonoAccount) => {
          if ( account.id !== selectAccount) {
            return null;
          }

          return (
            <View key={account.id} className='w-full flex items-center h-10  justify-center'>
              <Text className='text-white text-lg font-semibold'>{((account.balance ?? 0) / 100).toLocaleString("uk-UA")} ₴</Text>
            </View>
          );
        })}
       </View>

       <View className=' mt-10 flex items-center   justify-center'>
        <SpendingChart
  transactions={chartTransactions}
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
                  sections={groupedMonoTransactions}
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
                          {Number(item.amount)} ₴
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
                            {Number(item.amount ?? 0) / 100}₴
                          </Text>
                        </View>
                      );
                    })
                  : statementBankAnt.slice(0, 4).map((item) => {
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
