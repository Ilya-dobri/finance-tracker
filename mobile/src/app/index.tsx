'use client'

import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Home() {
  const route = useRouter()
  useEffect(() => {
    
       const checkAuth = async () => {
         const response = await fetch("/api/auth/me");
         
         if(response.ok){
            route.push('/profile')
         }else{
          route.push('/auth/login')
         }
       }
    checkAuth()
  }, [route])
  return (
   <view>
    
   </view>
  );
}
