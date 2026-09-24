
import { ScrollView, View } from "react-native";
import AccountUser from "@/components/AccountUser";


const Page = () => {
  


  return (
     <ScrollView
      className="flex-1 bg-[#161622]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 100,
      }}
    >
    <View>
      
      <AccountUser />
    </View>
    </ScrollView>
  );
};

export default Page