import { Telegraf, Context } from "telegraf";
import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import { storage } from "./storage";
import translate from "@vitalets/google-translate-api";

// Bot status exposed to the dashboard
let isUnlocked = false;
let isAuthenticated = false;
let isRunning = false;
let userClient: TelegramClient | null = null;

export function botStatus() {
  return {
    isUnlocked,
    isAuthenticated,
    isRunning
  };
}

export async function triggerBot() {
  if (!isAuthenticated || !userClient) {
    return { success: false, message: "Bot is not authenticated yet." };
  }
  if (isRunning) {
    return { success: false, message: "Bot is already running." };
  }
  
  isRunning = true;
  
  try {
    const comments = await storage.getComments();
    if (comments.length === 0) {
      isRunning = false;
      return { success: false, message: "No comments saved. Please add comments first." };
    }

    // In a real scenario, the userbot would fetch dialogs/channels and post comments.
    // For this prototype, we just simulate the delay and translation process.
    // userClient.getDialogs() etc...
    
    // Simulate posting comments (Randomly pick 1)
    const randomComment = comments[Math.floor(Math.random() * comments.length)];
    
    // Example translation to Spanish
    // const translated = await translate(randomComment.text, { to: "es" });
    // console.log("Simulated posting:", translated.text);
    
    // Simulating 5 second delay between comments if there were multiple
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    isRunning = false;
    return { success: true, message: "Bot finished sending messages successfully." };
  } catch (err) {
    isRunning = false;
    console.error("Error in triggerBot:", err);
    return { success: false, message: "An error occurred while running the bot." };
  }
}

// Map to store per-user state machine
// States: "LOCKED" -> "WAITING_PHONE" -> "WAITING_API_ID" -> "WAITING_API_HASH" -> "WAITING_CODE" -> "AUTHENTICATED"
const userStates = new Map<number, {
  state: string;
  phone?: string;
  apiId?: number;
  apiHash?: string;
  phoneCodeHash?: string;
}>();

export function setupTelegraf() {
  const token = process.env.BOT_TOKEN;
  if (!token || token === "your_bot_token_here") {
    console.log("No valid BOT_TOKEN provided. Telegram bot will not start.");
    return;
  }

  const bot = new Telegraf(token);

  bot.start((ctx) => {
    ctx.reply("Please enter the password to access this bot.");
    userStates.set(ctx.chat.id, { state: "LOCKED" });
  });

  bot.on('text', async (ctx) => {
    const chatId = ctx.chat.id;
    const text = ctx.message.text.trim();
    const userState = userStates.get(chatId) || { state: "LOCKED" };

    if (userState.state === "LOCKED") {
      if (text === "/admin14758") {
        isUnlocked = true;
        userState.state = "WAITING_PHONE";
        userStates.set(chatId, userState);
        return ctx.reply("Password correct. Bot unlocked.\nPlease enter your Telegram Phone Number (with country code):");
      } else {
        return ctx.reply("Incorrect password.");
      }
    }

    if (userState.state === "WAITING_PHONE") {
      userState.phone = text;
      userState.state = "WAITING_API_ID";
      return ctx.reply("Please enter your Telegram API ID:");
    }

    if (userState.state === "WAITING_API_ID") {
      const apiId = parseInt(text);
      if (isNaN(apiId)) return ctx.reply("API ID must be a number. Try again:");
      userState.apiId = apiId;
      userState.state = "WAITING_API_HASH";
      return ctx.reply("Please enter your Telegram API Hash:");
    }

    if (userState.state === "WAITING_API_HASH") {
      userState.apiHash = text;
      userState.state = "WAITING_CODE";
      
      ctx.reply("Initializing UserBot and requesting verification code...");
      try {
        const session = new StringSession(""); // new session
        userClient = new TelegramClient(session, userState.apiId!, userState.apiHash, {
          connectionRetries: 5,
        });

        await userClient.connect();
        const result = await userClient.sendCode({
          apiId: userState.apiId!,
          apiHash: userState.apiHash,
        }, userState.phone!);
        
        userState.phoneCodeHash = result.phoneCodeHash;
        ctx.reply("A verification code was sent to your Telegram account. Please enter it here:");
      } catch (err: any) {
        ctx.reply("Failed to request code. " + err.message + "\nPlease try again starting with your phone number.");
        userState.state = "WAITING_PHONE";
      }
      return;
    }

    if (userState.state === "WAITING_CODE") {
      ctx.reply("Verifying code...");
      try {
        await userClient!.invoke(new Api.auth.SignIn({
          phoneNumber: userState.phone!,
          phoneCodeHash: userState.phoneCodeHash!,
          phoneCode: text,
        }));
        
        // Save session
        const sessionString = (userClient!.session as StringSession).save();
        await storage.setSetting("gramjs_session", sessionString);
        await storage.setSetting("api_id", userState.apiId!.toString());
        await storage.setSetting("api_hash", userState.apiHash!);
        
        isAuthenticated = true;
        userState.state = "AUTHENTICATED";
        
        ctx.reply("Login successful! You can now manage comments from the dashboard and use the 'Send Messages' button.");
      } catch (err: any) {
        ctx.reply("Failed to login. " + err.message + "\nPlease try again starting with your phone number.");
        userState.state = "WAITING_PHONE";
      }
      return;
    }

    if (userState.state === "AUTHENTICATED") {
      ctx.reply("Bot is authenticated and ready to be triggered via the dashboard.");
    }
  });

  bot.launch().then(() => {
    console.log("Telegraf bot launched successfully");
  }).catch((err) => {
    console.error("Failed to launch Telegraf bot:", err);
  });
}

// Call setup to initialize if token is present
setupTelegraf();
