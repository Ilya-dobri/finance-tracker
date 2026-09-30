import React, { memo, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useCategoriesStore } from "./store/useStatementStore";

type CategoriesListProps = {
  selectCategories: string
  setSelectCategories: (category: string) => void
};

const CategoriesList = memo(({selectCategories, setSelectCategories }: CategoriesListProps) => {
  const categories = useCategoriesStore(
    (state) => state.categories
  );


  const fetchCategories = useCategoriesStore(
    (state) => state.getCategories
  );
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [fetchCategories, categories.length]);
  

  return (
<View className="flex-row flex-wrap gap-2 w-[90%] self-center">
      {categories.map((category) => (
        <Pressable onPress={() => setSelectCategories(category.id)}  className={`w-[30%] h-9 items-center justify-center rounded-[10px] ${
        selectCategories === category.id
          ? "bg-[#FFA66B]"
          : "bg-gray-600/50"
      }`}  key={category.id}>
          <Text className="text-white">
            {category.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
});

export default CategoriesList;