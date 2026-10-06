
import { View, Text, Image, Pressable, TextInput } from "react-native";
import { Search as SearchIcon } from "lucide-react-native";
import avatar from "../img/logo_profile.jpg";
import { useEffect, useState } from "react";
import { BankAccount, MonoStatement } from "@/types/type";
import { useAccountStore } from "./store/useStatementStore";

import Animated, {
  FadeInDown,
  FadeOutUp,
} from "react-native-reanimated";

type SearchTransaction = {
  id: string;
  description: string;
  amount: number;
  date: Date;
};
type HeaderProps = {
  openSerch: boolean;
  
  setOpenSearch: (value: boolean) => void;
  statementBankAnt: BankAccount[];
  statementData: MonoStatement[];
  activeCardVariant?: "MONOBANK_SUM" | "CardList" | "BANK-OTHER"| "BANK-SUM" | "CardListBank";
};

const Header = ({
  openSerch,
  setOpenSearch,
  statementBankAnt,
  statementData,
  activeCardVariant
}: HeaderProps) => {
  const [text, setText] = useState("");
  const getUserData = useAccountStore((state) => state.getUserData);
  const userData = useAccountStore((state) => state.userData);

  useEffect(() => {
    getUserData();
  }, [getUserData]);
  
const filterTrans = (): SearchTransaction[] => {
  const searchText = text.trim().toLowerCase();

  if (!searchText) return [];

  const monoTransactions: SearchTransaction[] =
    (statementData ?? []).map((trans) => ({
      id: `mono-${trans.id}`,
      description: trans.description ?? "",
      amount: Number(trans.amount ?? 0) / 100,
      date: new Date(trans.time * 1000),
    }));

  const bankTransactions: SearchTransaction[] =
    (statementBankAnt ?? []).map((trans) => ({
      id: `bank-${trans.id}`,
      description: trans.description ?? "",
      amount: Number(trans.amount ?? 0),
      date: new Date(trans.date ?? 0),
    }));

  const allTransactions = [
    ...monoTransactions,
    ...bankTransactions,
  ];

  return allTransactions.filter((trans) =>
    trans.description
      .toLowerCase()
      .includes(searchText)
  );
};
  return (
    <View className="z-10">
      <View className="mt-[50px] mx-[20px]">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <Image
              source={avatar}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />

            <View className="flex-col gap-[4px]">
              <Text className="text-[12px] text-gray-500">Welcome back,</Text>
              <Text className="text-[18px] text-white">{userData?.name}</Text>
            </View>
          </View>

          {!openSerch ? (
            <Pressable
              onPress={() => setOpenSearch(true)}
              className="w-[42px] h-[42px] flex-row items-center justify-center bg-[#1E1E2D] rounded-full"
            >
              <SearchIcon size={20} color="white" />
            </Pressable>
          ) : (
            <View className="absolute inset-x-0 top-0 flex items-center justify-center w-full bg-opacity-50">
              <View className="gap-5 shadow-white flex-row items-center bg-[#1E1E2D] p-3 rounded-lg w-full h-14">
                <TextInput
                  autoFocus
                  className="outline-none active:shadow-2xl w-full active:shadow-2xl text-white h-full"
                  placeholderTextColor="#888"
                  placeholder="Search"
                  value={text}
                  onChangeText={setText}
                />
                <Pressable onPress={() => setOpenSearch(false)} className="w-[34px] h-[34px] flex items-center justify-center rounded-3xl bg-[#FFA66B]/30">
                  <SearchIcon  size={20} color="#FFA66B" />
                </Pressable>
              </View>
            </View>
          )}
        
      
            </View>
             {openSerch && text.trim().length > 0 && (
      <Animated.View
        entering={FadeInDown.duration(220)}
        exiting={FadeOutUp.duration(150)}
        className="
          absolute
          top-[85px]
          left-[20px]
          right-[20px]
          z-50
          bg-[#1E1E2D]
          rounded-[20px]
          border
          border-[#2C2C3D]
          p-2
        "
        style={{ elevation: 12 }}
      >
        {filterTrans().length > 0 ? (
          filterTrans().slice(0, 5).map((trans, index) => (
            <Animated.View
              key={trans.id}
              entering={FadeInDown
                .delay(index * 40)
                .duration(180)}
              className="flex-row items-center justify-between px-3 py-3 rounded-[15px]"
            >
              <View className="flex-row items-center gap-3 flex-1">

                <Pressable  className="w-[38px] h-[38px] rounded-full bg-[#FFA66B]/15 items-center justify-center">
                  <SearchIcon
                    
                    size={17}
                    color="#FFA66B"
                  />
                </Pressable>

                <View className="flex-1">
                  <Text
                    numberOfLines={1}
                    className="text-white text-[14px] font-medium"
                  >
                    {trans.description}
                  </Text>

                  
                  <Text className="text-gray-500 text-[11px] mt-[2px]">
  {trans.date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  })}
</Text>
                </View>

              </View>

                  <Text
                    className={`text-[13px] font-semibold ${
                      Number(trans.amount) < 0
                        ? "text-[#FF8D8D]"
                        : "text-[#7ED6A5]"
                    }`}
                  >
                    {Number(trans.amount ?? 0)} ₴
                  </Text>
                </Animated.View>
              ))
            ) : (
              <View className="h-[65px] items-center justify-center">
                <Text className="text-gray-500 text-[12px]">
                  Ничего не найдено
                </Text>
              </View>
            )}
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default Header;

