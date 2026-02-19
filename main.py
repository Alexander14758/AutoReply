import os
import asyncio
import random
from telethon import TelegramClient, events, Button
from telethon.sessions import StringSession
from googletrans import Translator

# Configuration from Secrets
API_ID = int(os.environ.get('API_ID', 0))
API_HASH = os.environ.get('API_HASH', '')
BOT_TOKEN = os.environ.get('BOT_TOKEN', '')
SESSION_STR = os.environ.get('TELEGRAM_SESSION', '')
ADMIN_PASSWORD = "/admin14758"

# State
unlocked_users = set()
saved_comments = []
translator = Translator()

# Initialize Clients
bot = TelegramClient('bot_session', API_ID, API_HASH).start(bot_token=BOT_TOKEN)
user_bot = None

if SESSION_STR:
    user_bot = TelegramClient(StringSession(SESSION_STR), API_ID, API_HASH)

async def start_user_bot():
    global user_bot
    if user_bot and not user_bot.is_connected():
        await user_bot.connect()

@bot.on(events.NewMessage(pattern='/start'))
async def start_handler(event):
    await event.respond("Please enter the password to access the bot.")

@bot.on(events.NewMessage)
async def message_handler(event):
    chat_id = event.chat_id
    text = event.text.strip()

    # Password Check
    if chat_id not in unlocked_users:
        if text == ADMIN_PASSWORD:
            unlocked_users.add(chat_id)
            await event.respond(
                "Access Granted! Use the menu below to manage your automation.",
                buttons=[
                    [Button.inline("Add Comment", b"add_comment"), Button.inline("View Comments", b"view_comments")],
                    [Button.inline("Send Messages", b"send_now")]
                ]
            )
        elif text == "/start":
            pass # Already handled
        else:
            await event.respond("Incorrect password.")
        return

    # Handle adding comments via text if in a 'state' (simplified here)
    if text.startswith("/add "):
        comment = text[5:]
        saved_comments.append(comment)
        await event.respond(f"Comment saved: {comment}")

@bot.on(events.CallbackQuery)
async def callback_handler(event):
    if event.data == b"add_comment":
        await event.respond("To add a comment, send: `/add your comment here`")
    
    elif event.data == b"view_comments":
        if not saved_comments:
            await event.respond("No comments saved yet.")
        else:
            msg = "Saved Comments:\n" + "\n".join([f"- {c}" for c in saved_comments])
            await event.respond(msg)

    elif event.data == b"send_now":
        if not SESSION_STR:
            await event.respond("Error: UserBot session not found. Please run the login script in the console first.")
            return
        
        if not saved_comments:
            await event.respond("Please add some comments first.")
            return

        await event.respond("Starting automation...")
        await run_automation(event)

async def run_automation(event):
    await start_user_bot()
    try:
        # Get all channels/groups
        async for dialog in user_bot.iter_dialogs():
            if dialog.is_channel or dialog.is_group:
                try:
                    # Get the last message to check language
                    messages = await user_bot.get_messages(dialog.id, limit=1)
                    if not messages: continue
                    
                    target_text = messages[0].message or ""
                    detected = translator.detect(target_text)
                    
                    comment = random.choice(saved_comments)
                    
                    # Translation logic
                    if detected.lang == 'es':
                        comment = translator.translate(comment, dest='es').text
                    
                    await user_bot.send_message(dialog.id, comment)
                    await event.respond(f"Posted to {dialog.name}")
                    
                    await asyncio.sleep(5) # 5 second delay
                except Exception as e:
                    print(f"Skipping {dialog.name}: {e}")
        
        await event.respond("Automation task complete.")
    except Exception as e:
        await event.respond(f"Critical Error: {e}")

print("Bot is running...")
bot.run_until_disconnected()
