// app/_layout.tsx
import { Stack } from "expo-router";

import '../global.css';
import Footer from "@/components/footer/Footer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 300,
            contentStyle: {
              backgroundColor: "#161622",
            },
          }}
        />
        <Footer />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}