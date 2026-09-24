import { View, Text, Pressable } from "react-native";

import {
  Plus,
  ChartNoAxesCombined,
  Search,
  RefreshCw,
} from "lucide-react-native";

type ActivButton = {
  refresh: () => void;
  add: () => void
  analytics: () => void
};

export const QuickActionsMenu = ({ refresh, analytics }: ActivButton) => {
  return (
    <View className="flex-row justify-evenly gap-[16px] w-full p-4">

    
      <Pressable
       
        className="flex-col items-center gap-[8px]"
      >
        <View className="bg-[#1E1E2D] rounded-3xl w-[54px] h-[54px] items-center justify-center">
          <Plus size={24} color="#FFA66B" />
        </View>

        <Text className="text-[#A2A2A7]">
          Add
        </Text>
      </Pressable>

      
      <Pressable
        onPress={analytics}
        className="flex-col items-center gap-[8px]"
      >
        <View className="bg-[#1E1E2D] rounded-3xl w-[54px] h-[54px] items-center justify-center">
          <ChartNoAxesCombined size={24} color="#FFA66B" />
        </View>

        <Text className="text-[#A2A2A7]">
          Analytics
        </Text>
      </Pressable>

      
      <Pressable
        onPress={() => {}}
        className="flex-col items-center gap-[8px]"
      >
        <View className="bg-[#1E1E2D] rounded-3xl w-[54px] h-[54px] items-center justify-center">
          <Search size={24} color="#FFA66B" />
        </View>

        <Text className="text-[#A2A2A7]">
          Search
        </Text>
      </Pressable>

     
      <Pressable
         onPress={refresh}
        className="flex-col items-center gap-[8px]"
      >
        <View className="bg-[#1E1E2D] rounded-3xl w-[54px] h-[54px] items-center justify-center">
          <RefreshCw size={24} color="#FFA66B" />
        </View>

        <Text className="text-[#A2A2A7]">
          Sync
        </Text>
      </Pressable>

    </View>
  );
};