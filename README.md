# Telegram Automation Bot

This bot allows you to manually trigger comments across your joined channels and groups with automatic translation (English/Spanish) and a 5-second anti-spam delay.

## Setup Instructions

### 1. Configure Secrets
Add the following keys to your Replit **Secrets** (Environment Variables):
- `API_ID`: Your Telegram API ID
- `API_HASH`: Your Telegram API Hash
- `BOT_TOKEN`: Your Bot Token from @BotFather

### 2. Login (One-time setup)
To avoid being blocked by Telegram's automated bot detection, you must login once via the console:
1. Open the Replit **Shell**.
2. Run: `python login.py`
3. Enter your phone number and the code sent to your Telegram.
4. **Copy the Session String** printed in the console.
5. Add it to your Replit **Secrets** as `TELEGRAM_SESSION`.

### 3. Run the Bot
Once the `TELEGRAM_SESSION` is set, you can run the bot:
`python main.py`

## Usage
1. Message your bot and send `/start`.
2. Enter the password: `/admin14758`.
3. Use `/add <your comment>` to save multiple comments.
4. Click **"Send Messages"** to start the manual automation.
