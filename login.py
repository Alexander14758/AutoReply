import os
import asyncio
from telethon import TelegramClient, events
from telethon.sessions import StringSession
import googletrans
from googletrans import Translator

# Configuration
API_ID = os.environ.get('API_ID')
API_HASH = os.environ.get('API_HASH')
BOT_TOKEN = os.environ.get('BOT_TOKEN')
PASSWORD = "/admin14758"

# In-memory storage for simplicity (Replit DB could be used for persistence)
comments = []
session_string = os.environ.get('TELEGRAM_SESSION')
user_client = None
is_unlocked = False

async def main():
    print("--- Telegram UserBot Login Script ---")
    if not API_ID or not API_HASH:
        print("Error: API_ID and API_HASH must be set in Environment Variables.")
        return

    client = TelegramClient(StringSession(session_string), int(API_ID), API_HASH)
    await client.start()
    
    new_session = client.session.save()
    print("\nLOGIN SUCCESSFUL!")
    print(f"Your Session String: {new_session}")
    print("\nIMPORTANT: Copy this string and add it to your Secrets as 'TELEGRAM_SESSION'")
    print("This will keep you logged in so you don't have to do this again.\n")
    
    await client.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
