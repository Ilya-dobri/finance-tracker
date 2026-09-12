import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BankAccount, MonoStatement } from "@/types/type";
import { API_URL } from "@/app/auth/login";
import { MonoAccountsResponse } from "../AccountUser";



interface Store {
  state: string;
  isLoading:boolean
  setState: (state: string) => void;
  statementMono: MonoStatement[] 
  statementBank:BankAccount[]
lastAccountId: string | null;
  getCardStatementMono: (accountId: string) => Promise<void>;
  getCartAnotherBankStatement: (accountId: string) => Promise<void>
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
  statementMono: [],
  statementBank: [],
  isLoading: false,
  lastAccountId: null,
  setState: (state) => set({ state }),

  async getCardStatementMono(accountId: string) {
   if (!accountId || get().isLoading) return;
   if (get().lastAccountId === accountId && get().statementMono.length > 0) return;
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
        if (isSameStatement(get().statementMono as MonoStatement[], data)) return;
      set({ statementMono: data, lastAccountId: accountId });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  },

  getCartAnotherBankStatement: async (accountId: string) => {
    const token = await AsyncStorage.getItem('session_token')
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/api/accounts/${accountId}/transactions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
       if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    const data: BankAccount[] = await response.json();
    set({statementBank: data})
    } catch (error) {
    console.error(error);

    set({
      statementBank: [],
    });
    }
  }
}));


interface AccountStore {
  monoData: any;
  isLoading: boolean;
  fetchMonobank: () => void;
  fetchOtherBank: () => void;
  setSelectedAccountId: (id: string) => void;
  selectedAccountId: any;
  bankData: BankAccount[] | null;
}


export const useAccountStore = create<AccountStore>((set, get) => ({
  monoData: null,
  bankData: [],
  isLoading: false,
  selectedAccountId: null,
  fetchMonobank: async () => {
   if (get().isLoading || get().monoData) return;
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
    },
    setSelectedAccountId: (id) => set({ selectedAccountId: id }),
    fetchOtherBank: async () => {
      if (get().isLoading) return;
     const token = await AsyncStorage.getItem("session_token");
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/api/accounts`,{
            method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
        })
        const data:  BankAccount[]= await response.json();
        set({ bankData: data });
      } catch (error) {
        console.error("Failed to load accounts:", error);
      }
  }

    }
    
  
));
