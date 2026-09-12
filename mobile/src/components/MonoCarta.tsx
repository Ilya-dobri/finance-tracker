import { MonoData } from '@/types/type'
import React from 'react'
import { Text, View } from 'react-native'
export type MonoAccountsResponse = {
  monoDataFromStore?: MonoData;
  balance?: number;
  currencyCode: number;
  maskedPan: string[];
  variant?: "SUM" | "UNSUMM" | "OTHER";
   provider?: string;
  displayNumber?: string | null;
  displayExpiry?: string | null;
  currency?: string;
};

const MonoCarta = ({  variant,
  monoDataFromStore,
  balance,
  currencyCode,
  maskedPan,

  provider,
  displayNumber,
  displayExpiry,
  currency,}: MonoAccountsResponse) => {
  return (
    <>
      {variant === 'SUM' && (
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
              {maskedPan?.[0]}
            </Text>
          </View>

          <Text className="font-medium uppercase tracking-[3px] text-[#cdcdcd]">
            {monoDataFromStore?.name || "TARAS SHEVCHENKO"}
          </Text>
        </View>

        <Text className="text-white mt-3 text-[16px] font-semibold">
          {((balance ?? 0) / 100).toLocaleString("uk-UA")} {" "}
          {currencyCode === 980 ? "UAH" : currencyCode}
        </Text>
      </View>
      )}

      {variant === 'UNSUMM' && (
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
                {maskedPan?.[0]}
              </Text>
            </View>

            <Text className="font-medium uppercase tracking-[3px] text-[#cdcdcd]">
              {monoDataFromStore?.name || "TARAS SHEVCHENKO"}
            </Text>
          </View>

          
        </View>
      )}
       {variant === "OTHER" && (
        <View className="flex items-center justify-center w-full">
          <View
            className="relative p-[23px] h-[199px] w-[335px] justify-between flex flex-col rounded-[28px]"
            style={{
              backgroundColor:
                provider?.toLowerCase() === "privatbank"
                  ? "#168a45"
                  : "#24242b",
            }}
          >
          
            <View className="flex-row justify-between items-center">
              <Text className="font-bold tracking-[2px] text-[18px] text-white">
                {provider || "Bank"}
              </Text>

              <Text className="text-white text-[13px] font-medium">
                {currency || "UAH"}
              </Text>
            </View>

           
            <View className="flex-row justify-center items-center">
              <Text className="text-[22px] text-[#f1f1f1] tracking-[3px]">
                {displayNumber || "•••• •••• •••• ••••"}
              </Text>
            </View>

          
            <View className="flex-row justify-between items-end">
              <View>
                <Text className="text-[10px] text-[#cfcfcf]">
                  CARD HOLDER
                </Text>

                <Text className="font-medium uppercase tracking-[2px] text-[#ffffff]">
                  {monoDataFromStore?.name || "CARD HOLDER"}
                </Text>
              </View>

              <View className="items-end">
                <Text className="text-[10px] text-[#cfcfcf]">
                  VALID THRU
                </Text>

                <Text className="text-white text-[15px] font-medium">
                  {displayExpiry || "--/--"}
                </Text>
              </View>
            </View>
          </View>

         
        </View>
      )}
    </>
  )
}

export default MonoCarta
