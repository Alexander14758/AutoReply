# Installation Guide — Running the Bot in VS Code

Follow these steps exactly, in order.

---

## Requirements

Before starting, make sure you have these installed on your computer:

- **Python 3.11 or higher** — https://www.python.org/downloads/
- **VS Code** — https://code.visualstudio.com/
- **Git** (optional, for cloning) — https://git-scm.com/

---

## Step 1 — Get Your Telegram Credentials

### A. Telegram API ID and Hash
1. Go to https://my.telegram.org/apps
2. Log in with your phone number
3. Click **"API development tools"**
4. Fill in the form (App title and short name can be anything)
5. Copy your **App api_id** and **App api_hash**

### B. Bot Token
1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Follow the prompts to name your bot
4. Copy the **token** it gives you (looks like `123456789:ABCdef...`)

---

## Step 2 — Download the Project

Either clone with Git or download the ZIP:

**Option A — Git:**
```
git clone <your-repo-url>
cd <folder-name>
```

**Option B — Download ZIP:**
- Download the project as a ZIP from Replit or GitHub
- Extract the folder
- Open the folder in VS Code: `File → Open Folder`

---

## Step 3 — Open a Terminal in VS Code

Press `` Ctrl + ` `` (backtick) or go to `Terminal → New Terminal`

---

## Step 4 — Create a Virtual Environment

In the VS Code terminal, run:

```bash
python -m venv venv
```

Then activate it:

**Windows:**
```bash
venv\Scripts\activate
```

**Mac / Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` appear at the start of your terminal line.

---

## Step 5 — Install Dependencies

```bash
pip install telethon python-dotenv
```

---

## Step 6 — Set Up Your .env File

1. Find the file named `.example.env` in the project folder
2. Make a copy of it and rename the copy to `.env`
3. Open `.env` and fill in your values:

```
API_ID=your_actual_api_id
API_HASH=your_actual_api_hash
BOT_TOKEN=your_actual_bot_token
TELEGRAM_SESSION=
```

Leave `TELEGRAM_SESSION` blank for now — you'll fill it in Step 7.

---

## Step 7 — Log In to Telegram (One Time Only)

Run the login script in your terminal:

```bash
python login.py
```

- Enter your **phone number** (with country code, e.g. `+1234567890`)
- Telegram will send you a **verification code** — enter it
- If your account has **2FA**, enter your password when asked
- A long session string will be printed in the terminal

Copy everything between the dashed lines and paste it into your `.env` file as the value for `TELEGRAM_SESSION`:

```
TELEGRAM_SESSION=1BJWap1sBu...your_session_here...
```

Save the `.env` file.

---

## Step 8 — Run the Bot

```bash
python main.py
```

You should see:
```
UserBot connected successfully.
Control Bot connected successfully.
Listening for new channel posts. Auto-commenting: ON
```

The bot is now running. It will automatically comment on every new post in your joined channels.

---

## Step 9 — Control the Bot via Telegram

1. Open Telegram and message your bot (the one from @BotFather)
2. Send: `/admin14758`
3. Use these commands:

| Command | What it does |
|---------|-------------|
| `/status` | Check if auto-commenting is on |
| `/listcomments` | See all saved comments |
| `/addcomment your text here` | Add a new comment |
| `/delcomment 3` | Remove comment number 3 |
| `/stopbot` | Pause auto-commenting |
| `/startbot` | Resume auto-commenting |

---

## Keeping the Bot Running

To keep the bot running after you close VS Code, you can use:

**Windows:**
```bash
start /b python main.py
```

**Mac / Linux:**
```bash
nohup python main.py &
```

Or simply leave VS Code open with the terminal running.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `ModuleNotFoundError: telethon` | Run `pip install telethon python-dotenv` |
| `API_ID and API_HASH are required` | Make sure your `.env` file is filled in correctly |
| `Session is not authorized` | Run `python login.py` again and update `TELEGRAM_SESSION` in `.env` |
| Bot comments but not in some channels | That channel may not allow comments — this is normal |
| 2FA / password asked during login | Enter your Telegram account password (not the bot password) |
