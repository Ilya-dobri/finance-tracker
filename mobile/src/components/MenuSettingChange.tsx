import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { Pressable, Text, TextInput } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

interface MenuProps {
  onClose: () => void;
  variant: 'EDIT_PASS'| 'EDIT_NAME' |'CONTACT'|"THEME"|'LANGUAGE'|  "PRIVACY" | null
}

const Menu = forwardRef<BottomSheetModal, MenuProps>(({variant, onClose }, ref) => {
  const internalRef = useRef<BottomSheetModal>(null);
  const [passvord, setIsPassword] = useState('')
  const snapPoints = useMemo(() => ["40%"], []);

  useImperativeHandle(ref, () => internalRef.current as BottomSheetModal);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );




  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

 if(variant === 'EDIT_PASS'){
     return (
    <BottomSheetModal
      ref={internalRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: "#1E1E2D",
      }}
      handleIndicatorStyle={{
        backgroundColor: "#3A3A44",
      }}
    >
      <BottomSheetView className="flex-1 px-6 pt-2">
        <Text className="mt-8 text-center text-[20px] font-bold text-white">
          Change Password
        </Text>
        <TextInput value={passvord} onChangeText={setIsPassword} placeholder="pass" className="px-4 mt-10 border-none text-gray-400 w-full h-10 bg-gray-700 rounded-2xl "/>
      
        <Pressable className="w-[60%] h-10 rounded-[10px] mt-10 bg-[#FFA66B] flex items-center justify-center ">
          <Text>Change</Text>
        </Pressable>
      
      </BottomSheetView>
    </BottomSheetModal>
  );
 }
});

Menu.displayName = "Menu";

export default Menu;