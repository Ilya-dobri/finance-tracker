const BRAND_DOMAINS: Record<string, string> = {
  // Международные
  apple: 'apple.com',
  uber: 'uber.com',
  bolt: 'bolt.eu',
  netflix: 'netflix.com',
  spotify: 'spotify.com',
  mcdonald: 'mcdonalds.com',
  steam: 'steampowered.com',
  google: 'google.com',
  temu: 'temu.com',

  // Ритейл / Супермаркеты Украина
  silpo: 'silpo.ua',
  сільпо: 'silpo.ua',
  atb: 'atbmarket.com',
  атб: 'atbmarket.com',
  varus: 'varus.ua',
  варус: 'varus.ua',
  fora: 'fora.ua',
  фора: 'fora.ua',
  novus: 'novus.ua',
  новус: 'novus.ua',

  // Заправки / Авто
  wog: 'wog.ua',
  okko: 'okko.ua',
  окко: 'okko.ua',
  socar: 'socar.ua',
  ukrnafta: 'ukrnafta.com',

  // Почта / Сервисы
  nova_poshta: 'novaposhta.ua',
  нова_пошта: 'novaposhta.ua',
  rozetka: 'rozetka.com.ua',
  розетка: 'rozetka.com.ua',
  glovo: 'glovoapp.com',
};

export const getLogoForTx = (description: string): string | null => {
  if (!description) return null;
  const desc = description.toLowerCase();

  const match = Object.entries(BRAND_DOMAINS).find(([keyword]) =>
    desc.includes(keyword)
  );

  if (!match) return null;

  const domain = match[1];

  // Способ 1: Google Favicon API (Очень стабильный, редко 404)
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  // Способ 2: Clearbit (Высокое качество, но иногда падает на .ua доменах)
  // return `https://logo.clearbit.com/${domain}`;
};