import asyncio
import json
import os
import random
import logging
from telethon import TelegramClient, events
from telethon.sessions import StringSession
from telethon.tl.types import Channel

logging.basicConfig(
    format="%(asctime)s [%(levelname)s] %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

API_ID = int(os.environ.get("API_ID", 0))
API_HASH = os.environ.get("API_HASH", "")
BOT_TOKEN = os.environ.get("BOT_TOKEN", "")
TELEGRAM_SESSION = os.environ.get("TELEGRAM_SESSION", "")
ADMIN_PASSWORD = "/admin14758"
COMMENTS_FILE = "comments.json"

DEFAULT_COMMENTS = [
    "I copy traded one wallet today and walked away with over $15.6k",
    "This signal just made me $8,400 in under 2 hours, unbelievable",
    "Been following this channel for weeks, finally pulled the trigger and made $12k",
    "Just closed a trade for +$6,200 profit thanks to this call",
    "I turned $500 into $4,800 following this channel's tips",
    "Made my weekly salary in one trade today, this channel is gold",
    "Copy traded this and banked $9,100 — my best trade ever",
    "Went in with $1k and came out with $7.3k, these calls are insane",
    "Finally a channel that actually delivers, up $11k this week alone",
    "This trade just paid my rent for 3 months, thank you!",
]

bot_running = True
authenticated_users = set()


def load_comments():
    if os.path.exists(COMMENTS_FILE):
        try:
            with open(COMMENTS_FILE, "r") as f:
                data = json.load(f)
                return data.get("comments", DEFAULT_COMMENTS)
        except Exception:
            pass
    save_comments(DEFAULT_COMMENTS)
    return list(DEFAULT_COMMENTS)


def save_comments(comments):
    with open(COMMENTS_FILE, "w") as f:
        json.dump({"comments": comments}, f, indent=2)


async def run():
    global bot_running

    if not API_ID or not API_HASH:
        logger.error("API_ID and API_HASH are required. Set them as Replit Secrets.")
        return

    if not TELEGRAM_SESSION:
        logger.error("TELEGRAM_SESSION is not set. Run login.py first to generate a session string.")
        return

    user_client = TelegramClient(StringSession(TELEGRAM_SESSION), API_ID, API_HASH)
    await user_client.connect()
    if not await user_client.is_user_authorized():
        logger.error("UserBot session is not authorized. Run login.py to generate a fresh TELEGRAM_SESSION.")
        await user_client.disconnect()
        return
    logger.info("UserBot connected successfully.")

    bot_client = None
    if BOT_TOKEN:
        bot_client = TelegramClient("bot_session", API_ID, API_HASH)
        await bot_client.start(bot_token=BOT_TOKEN)
        logger.info("Control Bot connected successfully.")
    else:
        logger.warning("BOT_TOKEN not set — control bot disabled.")

    @user_client.on(events.NewMessage(incoming=True))
    async def handle_channel_post(event):
        if not bot_running:
            return
        message = event.message
        if not message or not message.text:
            return
        if not getattr(message, "post", False):
            return

        comments = load_comments()
        if not comments:
            logger.warning("No comments available to post.")
            return

        chosen = random.choice(comments)
        await asyncio.sleep(5)

        chat = await event.get_chat()
        chat_title = getattr(chat, "title", str(event.chat_id))

        try:
            await user_client.send_message(
                entity=event.chat_id,
                message=chosen,
                comment_to=message.id
            )
            logger.info(f"Commented on post in [{chat_title}]: {chosen[:60]}...")
        except Exception:
            try:
                await user_client.send_message(
                    entity=event.chat_id,
                    message=chosen,
                    reply_to=message.id
                )
                logger.info(f"Replied to post in [{chat_title}]: {chosen[:60]}...")
            except Exception as e2:
                logger.error(f"Could not comment in [{chat_title}]: {e2}")

    if bot_client:
        @bot_client.on(events.NewMessage(pattern=r"^/start$"))
        async def cmd_start(event):
            await event.respond(
                "**Telegram AutoComment Bot**\n\n"
                "Send `/admin14758` to unlock the controls."
            )

        @bot_client.on(events.NewMessage(pattern=r"^/admin14758$"))
        async def cmd_auth(event):
            authenticated_users.add(event.sender_id)
            await event.respond(
                "**Authenticated!**\n\n"
                "Commands:\n"
                "`/status` — Bot status\n"
                "`/listcomments` — Show all comments\n"
                "`/addcomment <text>` — Add a comment\n"
                "`/delcomment <number>` — Delete a comment\n"
                "`/startbot` — Enable auto-commenting\n"
                "`/stopbot` — Disable auto-commenting"
            )

        @bot_client.on(events.NewMessage(pattern=r"^/status$"))
        async def cmd_status(event):
            if event.sender_id not in authenticated_users:
                await event.respond("Send `/admin14758` to authenticate first.")
                return
            comments = load_comments()
            status = "ON" if bot_running else "OFF"
            await event.respond(
                f"**Auto-commenting:** {status}\n"
                f"**Comments in pool:** {len(comments)}"
            )

        @bot_client.on(events.NewMessage(pattern=r"^/listcomments$"))
        async def cmd_list(event):
            if event.sender_id not in authenticated_users:
                await event.respond("Send `/admin14758` to authenticate first.")
                return
            comments = load_comments()
            if not comments:
                await event.respond("No comments saved yet.")
                return
            lines = "\n".join(f"{i+1}. {c}" for i, c in enumerate(comments))
            await event.respond(f"**Saved Comments:**\n\n{lines}")

        @bot_client.on(events.NewMessage(pattern=r"^/addcomment (.+)$"))
        async def cmd_add(event):
            if event.sender_id not in authenticated_users:
                await event.respond("Send `/admin14758` to authenticate first.")
                return
            new_comment = event.pattern_match.group(1).strip()
            comments = load_comments()
            comments.append(new_comment)
            save_comments(comments)
            await event.respond(f"Comment added. Total: {len(comments)}")

        @bot_client.on(events.NewMessage(pattern=r"^/delcomment (\d+)$"))
        async def cmd_del(event):
            if event.sender_id not in authenticated_users:
                await event.respond("Send `/admin14758` to authenticate first.")
                return
            idx = int(event.pattern_match.group(1)) - 1
            comments = load_comments()
            if idx < 0 or idx >= len(comments):
                await event.respond(f"Invalid number. Use 1 to {len(comments)}.")
                return
            removed = comments.pop(idx)
            save_comments(comments)
            await event.respond(f"Removed: {removed}")

        @bot_client.on(events.NewMessage(pattern=r"^/startbot$"))
        async def cmd_startbot(event):
            global bot_running
            if event.sender_id not in authenticated_users:
                await event.respond("Send `/admin14758` to authenticate first.")
                return
            bot_running = True
            await event.respond("Auto-commenting is now ON.")

        @bot_client.on(events.NewMessage(pattern=r"^/stopbot$"))
        async def cmd_stopbot(event):
            global bot_running
            if event.sender_id not in authenticated_users:
                await event.respond("Send `/admin14758` to authenticate first.")
                return
            bot_running = False
            await event.respond("Auto-commenting is now OFF.")

    logger.info(f"Listening for new channel posts. Auto-commenting: {'ON' if bot_running else 'OFF'}")

    tasks = [user_client.run_until_disconnected()]
    if bot_client:
        tasks.append(bot_client.run_until_disconnected())

    await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(run())
