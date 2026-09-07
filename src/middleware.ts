
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {

  
  const token = request.cookies.get('session_token')?.value;

  // Если токена нет, а пользователь пытается зайти в профиль
  if (!token) {
    // Мгновенно перенаправляем на страницу логина
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Если всё ок — пропускаем дальше
  return NextResponse.next();
}

// Указываем, для каких страниц должен работать этот охранник
export const config = {
  matcher: ['/profile', '/dashboard', '/card'], // добавь сюда свои защищенные роуты
}