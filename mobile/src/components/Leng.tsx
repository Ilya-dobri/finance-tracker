import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
} from "react";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { Text, View } from "react-native";

interface MenuSettingsProps {
  onClose?: () => void;
}

const MenuSettings = forwardRef<BottomSheetModal, MenuSettingsProps>(
  ({ onClose }, ref) => {
    const internalRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => ["60%"], []);

    useImperativeHandle(
      ref,
      () => internalRef.current as BottomSheetModal
    );

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          onClose?.();
        }
      },
      [onClose]
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
      []
    );

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
          backgroundColor: "#555563",
        }}
      >
        <BottomSheetView className="flex-1 px-6 pt-4">
          <View className="flex-1">
            <Text className="text-white text-[20px] font-semibold">
              Menu
            </Text>

            {/* сюда потом добавишь содержимое */}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

MenuSettings.displayName = "MenuSettings";

export default MenuSettings;