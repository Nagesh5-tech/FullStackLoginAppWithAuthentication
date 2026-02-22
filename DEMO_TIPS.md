# Interview Demo Tips

## Before the Interview

1. **Pre-wake the backend (1–2 minutes before)**
   - Open your Netlify app: `https://reactloginapp1.netlify.app`
   - The app automatically sends a wake-up request when the login page loads
   - Keep the tab open so the backend (Render) has time to spin up
   - By the time you demo, the server should be ready

2. **Have a test account ready**
   - Use credentials that you know work
   - Or register a new user if you want to show the full flow

3. **Check both URLs**
   - Frontend: https://reactloginapp1.netlify.app
   - Backend: https://login-backend-84u9.onrender.com (you can quickly visit this to wake it)

## During the Demo

- If you see **"Connecting to server... (attempt X of 5)"** — the app is retrying automatically. Wait a few seconds; it usually succeeds by attempt 2–3.
- The button shows **"Connecting..."** while the request is in progress.
- If the server was asleep, the first login may take up to 60 seconds. Subsequent requests are fast.

## Technical Details (if asked)

- **Pre-wake**: On load, the app sends a lightweight request to the backend so it starts waking before the user submits the form
- **Retry logic**: Up to 5 attempts with 15-second pauses — handles Render free-tier cold starts
- **Timeout**: 90 seconds per request to allow the server to wake fully
