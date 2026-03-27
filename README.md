# Telegram AutoComment UserBot

A pure Python Telegram userbot that automatically listens to all your joined channels and posts a random comment on every new post.

## How It Works

- Runs as **your own Telegram account** (userbot) using Telethon
- Listens to every channel you've joined
- When a new post appears, waits 5 seconds then posts a random comment from your saved pool
- A separate control bot (via BOT_TOKEN) lets you manage comments and toggle the bot on/off

---

## Setup

### Step 1 — Add Secrets

Go to **Tools → Secrets** in Replit and add:

| Key | Value |
|-----|-------|
| `API_ID` | Your Telegram API ID (from https://my.telegram.org) |
| `API_HASH` | Your Telegram API Hash (from https://my.telegram.org) |
| `BOT_TOKEN` | Bot token from @BotFather (for the control bot) |
| `TELEGRAM_SESSION` | Generated in Step 2 below |

### Step 2 — Login (one time only)

Open the Replit **Shell** and run:

```
python login.py
```

- Enter your phone number when prompted
- Enter the code Telegram sends you
- Copy the **session string** printed at the end
- Add it to Secrets as `TELEGRAM_SESSION`

### Step 3 — Run the Bot

Click **Run** or the workflow will start `python main.py` automatically.

---

## Control Bot Commands

Message your bot on Telegram:

1. Send `/admin14758` to authenticate
2. Then use these commands:

| Command | Description |
|---------|-------------|
| `/status` | Check if bot is running |
| `/listcomments` | Show all saved comments |
| `/addcomment <text>` | Add a new comment to the pool |
| `/delcomment <number>` | Remove a comment by its number |
| `/startbot` | Enable auto-commenting |
| `/stopbot` | Disable auto-commenting |

---

## Notes

- Comments are stored in `comments.json` and persist across restarts
- The bot comes pre-loaded with 10 default comments you can edit or replace
- A 5-second delay is applied before each comment to reduce spam risk
