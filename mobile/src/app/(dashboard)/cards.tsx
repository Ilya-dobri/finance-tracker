import CardUser from "@/components/CardUser";
import MenuAddCard from "@/components/MenuAddCard";
import MonoCarta from "@/components/MonoCarta";
import { useAccountStore } from "@/components/store/useStatementStore";
import { BankAccount, MonoAccount } from "@/types/type";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const cards = () => {
  return <CardUser/>

 
};

export default cards;
