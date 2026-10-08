# 🌸 Birthday Garden Web App 🌸

A romantic, interactive birthday web app designed for your special person who loves flowers.

---

## ✨ Features Included
- **💌 The Garden of Envelopes**: 3D envelopes sealed with wax stamps. She can tap to break the seal, open the envelope flap, and read personalized love letters, 10 things you adore about her, polaroid memories, love coupons, and birthday wishes.
- **💐 Handpick Your Birthday Bouquet**: Interactive floral vase workshop where she can pick blooms (peonies, English roses, lilies, lavender, sunflowers, baby's breath), watch them bloom dynamically in a glass vase, and reveal flower meanings.
- **🎂 Make a Wish Birthday Cake**: Multi-layer pastel cake with flickering candles she can tap or blow out, triggering confetti showers and revealing a secret birthday wish!
- **🎵 Romantic Melodic Player**: Built-in procedural acoustic lullaby (works 100% offline with zero external audio dependencies!), volume control, or link your favorite MP3 love song.
- **🌸 Floating Petals & Sparkle Canvas**: Gentle falling rose petals and fairy dust reacting to subtle breeze physics.
- **✍️ Note Customizer**: Easily edit her name, birthday countdown, envelope messages, and signature either via `notes.js` or directly inside the app with the **"Edit Notes"** button.

---

## 🚀 How to Preview Locally

You can preview the website immediately using any local web server:

```powershell
# Option 1: Using npx serve
npx -y serve .

# Option 2: Using Python
python -m http.server 3000
```
Then open `http://localhost:3000` in your browser.

---

## 🌐 How to Host & Share Online (Free)

### Method 1: Host on GitHub Pages (Recommended - 2 Minutes)
1. Create a new GitHub repository (e.g., `birthday-for-her`).
2. Push or upload all files (`index.html`, `style.css`, `app.js`, `notes.js`, etc.) into your repository.
3. On GitHub, go to **Settings** > **Pages** (under Code and automation).
4. Under **Branch**, select `main` (or `master`) and folder `/ (root)`, then click **Save**.
5. Within 1 minute, GitHub will give you a public link (e.g. `https://yourusername.github.io/birthday-for-her/`) that you can send her over WhatsApp or iMessage!

### Method 2: Host on Vercel (Instant 1-Click Link)
1. Go to [vercel.com](https://vercel.com) and log in (with GitHub or email).
2. Click **"Add New Project"** and import your GitHub repository (or drag-and-drop your project folder using Vercel CLI: `npx vercel`).
3. Click **Deploy**.
4. You get an instant custom URL like `https://happy-birthday-love.vercel.app`!

---

## ✍️ How to Personalize the Notes

You can customize the messages in two ways:
1. **Directly in the Web App**: Click the **"✍️ Edit Notes"** button in the top navigation bar. Enter her name, your name, date, and messages, then click **"Save & Apply"**.
2. **In `notes.js`**: Open [notes.js](file:///c:/Users/user/Birthday/notes.js) in your code editor and edit the text directly.

With love, happy birthday celebrating! 🌸
