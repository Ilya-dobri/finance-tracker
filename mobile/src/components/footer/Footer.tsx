'use client'


import Image from 'next/image';
import { footerItems } from './footer.config';
import { useEffect, useState } from 'react';
import { Link } from "expo-router"; 
import type { Href } from "expo-router";
import { Text, View } from 'react-native';
const Footer = () => {
    const [activeId, setActiveId] = useState('')
useEffect(() => {
    // Используем уникальный ключ, чтобы не пересекалось с другими проектами на localhost
    const savedTab = localStorage.getItem('financeTracker_activeTab');
    if (savedTab) {
      setActiveId(savedTab);
    }
  }, []);
   const handleSetActive = (id: string) => {
    setActiveId(id);
    localStorage.setItem('financeTracker_activeTab', id);
  };
  return (
    <View className=''>
      <footer className='flex  bg-[#27273A] h-[66px] gap-[35px] m-auto justify-center fixed bottom-3 left-0 right-0 w-[80%] rounded-[40px]'>
        
          {footerItems.map((f) => {
             const isActive = activeId === f.id
             const Icon = f.icon;
           return(
             
              <Link href={f.path as Href} onPress={() => handleSetActive(f.id)} key={f.id} className={`${isActive ? "text-blue-500" : "text-gray-500"} flex gap-1 flex-col items-center justify-center `}>
            <Icon size={20} />
              <Text className='text-[11px]'>{f.label}</Text>
            </Link>
             
           )
})}
        
      </footer>
    </View>
  )
}

export default Footer
