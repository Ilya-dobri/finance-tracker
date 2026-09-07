import { MonoStatement } from "./../../mobile/src/types/type";
import { API_URL } from "./../../mobile/src/app/auth/login";

import { prisma } from "../lib/prisma";
import { Router, Request, type Response as ExpressResponse } from "express";
const router = Router();

router.get("/", async (req: Request, res: ExpressResponse) => {
  try {
    const token =
      req.cookies?.session_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const session = await prisma.session.findUnique({
      where: {
        token,
      },
    });

    if (!session) {
      return res.status(401).json({ error: "Не авторизован" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json(user.accounts);
  } catch (error) {
    console.error("🔥 ACCOUNTS ERROR:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/", async (req: Request, res: ExpressResponse) => {
  const token =
    req.cookies?.session_token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const session = await prisma.session.findUnique({
    where: { token },
  });
  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { token } });
    }
    return res.status(401).json({ error: "Session expired" });
  }
  const { name, provider, currency, bankAccountId } = req.body;

  const account = await prisma.account.create({
    data: {
      name,
      provider,
      currency,
      bankAccountId,
      userId: session.userId,
    },
  });

  res.json(account);
});

router.get("/mono", async (req: Request, res: ExpressResponse) => {
  try {
    const authToken =
      req.cookies?.session_token || req.headers.authorization?.split(" ")[1];

    if (!authToken) {
      return res.status(500).json({ error: "MONO_TOKEN не найден" });
    }
    const session = await prisma.session.findUnique({
      where: { token: authToken },
    });
    if (!session) {
      return res.status(401).json({ error: "Не авторизован" });
    }
    const account = await prisma.account.findFirst({
      where: { userId: session.userId, provider: "monobank" },
    });
    if (!account) {
      return res.status(404).json({ error: "Аккаунт не найден" });
    }
    const response = await fetch(
      "https://api.monobank.ua/personal/client-info",
      {
        headers: { "X-Token": account.bankAccountId },
      },
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("🔥 MONO ERROR:", error);
    res.status(500).json({ error: "Ошибка при получении данных Mono" });
  }
});

router.get("/mono/statement", async (req: Request, res: ExpressResponse) => {
  try {
    const authToken =
      req.cookies?.session_token || req.headers.authorization?.split(" ")[1];
    if (!authToken) {
      return res.status(401).json({ error: "Не авторизован" });
    }

    const session = await prisma.session.findUnique({
      where: { token: authToken },
    });
    if (!session) {
      return res.status(401).json({ error: "Не авторизован" });
    }

    const account = await prisma.account.findFirst({
      where: { userId: session.userId, provider: "monobank" },
    });
    if (!account) {
      return res.status(404).json({ error: "Аккаунт не найден" });
    }

    // accountId — id конкретной карты монобанка (из client-info -> accounts[i].id)
    // если не передан, берём '0' — это дефолтный счёт клиента
    const accountId = (req.query.accountId as string) || "0";

    // диапазон дат в секундах, по умолчанию — последние 30 дней
    const to = req.query.to
      ? Number(req.query.to)
      : Math.floor(Date.now() / 1000);
    const from = req.query.from
      ? Number(req.query.from)
      : to - 30 * 24 * 60 * 60;

    const MAX_RANGE = 31 * 24 * 60 * 60 + 60 * 60; // 31 день + 1 час
    if (to - from > MAX_RANGE) {
      return res.status(400).json({
        error: "Максимальный диапазон — 31 день + 1 час за один запрос",
      });
    }

    const response = await fetch(
      `https://api.monobank.ua/personal/statement/${accountId}/${from}/${to}`,
      { headers: { "X-Token": account.bankAccountId } },
    );

    if (response.status === 429) {
      return res.status(429).json({
        error:
          "Слишком много запросов. Monobank разрешает 1 запрос на выписку раз в 60 секунд для одного токена",
      });
    }

    if (!response.ok) {
      const text = await response.text();
      console.error("Mono statement error:", response.status, text);
      return res.status(response.status).json({ error: "Ошибка Monobank API" });
    }

    const data = (await response.json()) as MonoStatement[];
    res.json(data);
  } catch (error) {
    console.error("🔥 MONO STATEMENT ERROR:", error);
    res.status(500).json({ error: "Ошибка при получении выписки Mono" });
  }
});

export default router;
