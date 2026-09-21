import { footerItems } from "./footer.config";
import { Link, usePathname } from "expo-router";
import type { Href } from "expo-router";
import { Pressable, Text, View } from "react-native";

const Footer = () => {
  const pathname = usePathname();

  return (
    <View className="absolute bottom-6 left-0 right-0 items-center">
      <View className="flex-row bg-[#27273A] h-[66px] gap-[35px] justify-center items-center w-[80%] rounded-[40px]">
        {footerItems.map((f) => {
          const isActive = pathname === f.path;
          const Icon = f.icon;

          return (
            <Link
              href={f.path as Href}
              key={f.id}
              asChild
            >
              <Pressable className="items-center justify-center gap-1">
                <Icon
                  size={20}
                  color={isActive ? "#3B82F6" : "#9CA3AF"}
                />

                <Text
                  className={`text-[11px] ${
                    isActive ? "text-blue-500" : "text-gray-400"
                  }`}
                >
                  {f.label}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
};

export default Footer;