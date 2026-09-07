import {
  Home,
  CreditCard,
  PieChart,
  Settings
} from "lucide-react-native";

export const footerItems = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    path: "/profile",
  },
  {
    id: "cards",
    label: "My Cards",
    icon: CreditCard,
    path: "/cards",
  },
  {
    id: "statistics",
    label: "Statistics",
    icon: PieChart,
    path: "/statistics",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];