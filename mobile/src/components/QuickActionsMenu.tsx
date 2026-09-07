import { ArrowUp, ArrowDown, DollarSign, UploadCloud } from 'lucide-react-native';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export const QuickActionsMenu = () => {
  const router = useRouter();

  const actionsConfig = [
    {
      id: 'sent',
      label: 'Sent',
      icon: ArrowUp,
     
    },
    {
      id: 'receive',
      label: 'Receive',
      icon: ArrowDown,
      
    },
    {
      id: 'loan',
      label: 'Loan',
      icon: DollarSign,
     
    },
    {
      id: 'topup',
      label: 'Topup',
      icon: UploadCloud,
      
    },
  ];

  return (
    <View className="flex-row gap-[40px] justify-center w-full p-4">
      {actionsConfig.map((item) => {
        const Icon = item.icon;
        return (
          <Pressable key={item.id}  className="flex flex-col items-center gap-[8px]">
            <View className="bg-[#1E1E2D] rounded-3xl w-[54px] h-[54px] flex items-center justify-center">
              <Icon color="white" />
            </View>
            <Text className="text-[#A2A2A7]">{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};