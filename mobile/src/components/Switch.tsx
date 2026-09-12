import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

export interface SwitchProps {
  /** Текущее состояние (для контролируемого компонента) */
  value?: boolean;
  /** Начальное состояние (для неконтролируемого компонента) */
  defaultValue?: boolean;
  /** Колбэк при изменении состояния */
  onValueChange?: (value: boolean) => void;
  /** Цвет трека при включении */
  activeColor?: string;
  /** Цвет трека при выключении */
  inactiveColor?: string;
  /** Цвет круглого бегунка */
  thumbColor?: string;
  /** Блокировка нажатия */
  disabled?: boolean;
  /** Время анимации в мс (по умолчанию 200) */
  animationDuration?: number;
  /** Внешние стили для контейнера */
  style?: StyleProp<ViewStyle>;
}

const Switch: React.FC<SwitchProps> = ({
  value: externalValue,
  defaultValue = false,
  onValueChange,
  activeColor = '#30D158',
  inactiveColor = '#39393D',
  thumbColor = '#FFFFFF',
  disabled = false,
  animationDuration = 200,
  style,
}) => {
  // Поддержка как управляемого (value), так и неуправляемого (defaultValue) состояния
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isChecked = externalValue !== undefined ? externalValue : internalValue;

  const animatedValue = useRef(new Animated.Value(isChecked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isChecked ? 1 : 0,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  }, [isChecked, animationDuration]);

  const handlePress = () => {
    if (disabled) return;

    const newValue = !isChecked;
    if (externalValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.pressable,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Animated.View style={[styles.track, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: thumbColor,
              transform: [{ translateX }],
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  track: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    // Тень iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2.5,
    // Тень Android
    elevation: 3,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default Switch;