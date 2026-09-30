export interface SettingItem {
  
}

export interface SettingSection {
 id: string;
  title: string;
  type: 'switch' | 'link';
  value?: string;
  route?: string
  variant?:SettingVariant
}
export type SettingVariant =
  | "EDIT_NAME"
  | "EDIT_PASS"
  | "CONTACT"
  | "PRIVACY"
  | "THEME"
  | "LANGUAGE";


export const SETTINGS_SECTIONS: SettingSection[] = [
  {
    id: "Nickname",
    title: "Change name",
    type: "link",
    variant: "EDIT_NAME",
  },
  {
    id: "Password",
    title: "Change Password",
    type: "link",
    variant: "EDIT_PASS",
  },
  {
    id: "contact",
    title: "Contact Us",
    type: "link",
    variant: "CONTACT",
  },
  {
    id: "Privacy",
    title: "Privacy Policy",
    type: "link",
    variant: "PRIVACY",
  },
];


export const SETTINGS_CHENG: SettingSection[] = [
  
 

  { id: 'Theme ', title: 'Theme ', type: 'link', },
   { id: 'language', title: 'Language', type: 'link', value: 'English' },
];