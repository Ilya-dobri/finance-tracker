export interface SettingItem {
  
}

export interface SettingSection {
 id: string;
  title: string;
  type: 'switch' | 'link';
  value?: string;
  route?: string
}

export const SETTINGS_SECTIONS: SettingSection[] = [
  
  { id: 'profile', title: 'My Profile', type: 'link', route: 'MyProfile' },
  { id: 'contact', title: 'Contact Us', type: 'link' },
{ id: 'Password', title: 'Change Password', type: 'link' },
  { id: 'Privacy', title: 'Privacy Policy', type: 'link' },
 
];


export const SETTINGS_CHENG: SettingSection[] = [
  
 

  { id: 'Theme ', title: 'Theme ', type: 'link', },
   { id: 'language', title: 'Language', type: 'link', value: 'English' },
];