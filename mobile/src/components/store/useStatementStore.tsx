import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MonoStatement } from "@/types/type";
import { API_URL } from "@/app/auth/login";
import { MonoAccountsResponse } from "../AccountUser";



interface Store {
  state: string;
  
  setState: (state: string) => void;
  statement: MonoStatement[];
  getCardStatement: (accountId: string) => Promise<void>;
}
function isSameStatement(a: MonoStatement[], b: MonoStatement[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id || a[i].amount !== b[i].amount) return false;
  }
  return true;
}
export const useStatementStore = create<Store>((set,get) => ({
  state: "",
  statement: [],
  setState: (state) => set({ state }),

  async getCardStatement(accountId: string) {
    const token = await AsyncStorage.getItem("session_token");
    if (!token || !accountId) return;

    const to = Math.floor(Date.now() / 1000);
    const from = to - 30 * 24 * 60 * 60; // 30 дней

    try {
      const response = await fetch(
        `${API_URL}/api/accounts/mono/statement?accountId=${accountId}&from=${from}&to=${to}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        console.error("Statement error:", response.status);
        return;
      }

      const data = await response.json();
      console.log("Monobank statement:", data);
        if (isSameStatement(get().statement, data)) return;
      set({ statement: data });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

}));


interface AccountStore {
  monoData: any;
  isLoading: boolean;
  fetchMonobank: () => void;
}


export const useAccountStore = create<AccountStore>((set) => ({
  monoData: null,
  isLoading: false,

  fetchMonobank: async () => {
    
     const token = await AsyncStorage.getItem("session_token");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/api/accounts/mono`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
         set({ monoData: { accounts: [] } });
          return;
        }

        const data: MonoAccountsResponse = await response.json();

        if (!Array.isArray(data) && Array.isArray(data.accounts)) {
          console.log("Monobank accounts:", data);
          set({ monoData: data });
        } else if (Array.isArray(data)) {
          set({ monoData: { accounts: data } });
        }
      } catch (error) {
        console.error("Failed to load accounts:", error);
      }
    }

    
  }
));
