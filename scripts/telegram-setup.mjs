// Helps find the group chat ID and checks the bot, without ever printing the token.
//
//   TELEGRAM_BOT_TOKEN=... node scripts/telegram-setup.mjs           -> bot info, webhook status, recent chats
//   TELEGRAM_BOT_TOKEN=... TELEGRAM_GROUP_CHAT_ID=... node scripts/telegram-setup.mjs --test
//                                                                    -> sends a synthetic test message
//
// The variables can also come from .env.local (never commit that file).
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile?.(file);
  } catch {
    // optional
  }
}

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const chatId = (process.env.TELEGRAM_GROUP_CHAT_ID || process.env.TELEGRAM_CHAT_ID)?.trim();
const base = (process.env.TELEGRAM_API_BASE || "https://api.telegram.org").replace(/\/$/, "");
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN is not set.");
  process.exit(1);
}

async function call(method, body) {
  const res = await fetch(`${base}/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const json = await res.json().catch(() => ({ ok: false, description: `HTTP ${res.status}` }));
  if (!json.ok) throw new Error(`${method}: ${json.error_code ?? res.status} ${json.description ?? ""}`.trim());
  return json.result;
}

try {
  const me = await call("getMe");
  console.log(
    `Bot: @${me.username} (can join groups: ${me.can_join_groups}, reads all group messages: ${me.can_read_all_group_messages})`,
  );

  if (process.argv.includes("--test")) {
    if (!chatId) throw new Error("TELEGRAM_GROUP_CHAT_ID is not set.");
    const chat = await call("getChat", { chat_id: chatId });
    console.log(`Group: ${chat.title} (${chat.type}, id ${chat.id})`);
    const sent = await call("sendMessage", {
      chat_id: chatId,
      text: "🧪 TEST — melbetagents.org can post to this group. No applicant data in this message.",
    });
    console.log(`Test message sent (message id ${sent.message_id}).`);
    process.exit(0);
  }

  const hook = await call("getWebhookInfo");
  if (hook.url) {
    console.log(`\nA webhook is set (${new URL(hook.url).host}), so getUpdates cannot be used.`);
    console.log("Find the chat ID in that webhook's logs, or see README → Telegram notifications for other options.");
    process.exit(0);
  }

  const updates = await call("getUpdates", { allowed_updates: ["message", "my_chat_member"] });
  const chats = new Map();
  for (const u of updates) {
    const chat = u.message?.chat ?? u.my_chat_member?.chat;
    if (chat && (chat.type === "group" || chat.type === "supergroup")) chats.set(chat.id, chat);
  }
  if (chats.size === 0) {
    console.log("\nNo group chats found in recent updates.");
    console.log("Add the bot to the group, send /start@" + me.username + " in the group, then run this again.");
  } else {
    console.log("\nGroups the bot has seen recently:");
    for (const chat of chats.values()) console.log(`  ${chat.id}  ${chat.title}  (${chat.type})`);
    console.log("\nUse the ID of your group (it starts with -) as TELEGRAM_GROUP_CHAT_ID.");
  }
} catch (error) {
  console.error(
    String(error.message ?? error)
      .split(token)
      .join("[redacted]"),
  );
  process.exit(1);
}
