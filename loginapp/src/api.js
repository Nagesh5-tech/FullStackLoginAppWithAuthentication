import API_BASE_URL from "./config/api";

// Render free tier cold start: 30-60 seconds. Configure for interview/demo reliability.
const FETCH_TIMEOUT = 90000;  // 90 seconds - allows server to wake fully
const RETRY_DELAY = 15000;    // 15 seconds between retries (server needs time to spin up)
const MAX_RETRIES = 4;        // 5 total attempts = robust for cold starts

/**
 * Fetch with timeout and retry logic for Render cold starts.
 * @param {Function} onRetry - Optional callback(attempt, maxAttempts) when retrying (e.g. to show progress)
 */
async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES, onRetry) {
  const attempt = MAX_RETRIES - retries + 1;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    const isRetryable = err.name === "AbortError" || err.message === "Failed to fetch" ||
      (typeof err.message === "string" && err.message.toLowerCase().includes("network"));
    if (retries > 0 && isRetryable) {
      if (typeof onRetry === "function") {
        onRetry(attempt + 1, MAX_RETRIES + 1);
      }
      await new Promise((r) => setTimeout(r, RETRY_DELAY));
      return fetchWithRetry(url, { ...options, signal: undefined }, retries - 1, onRetry);
    }
    throw err;
  }
}

/** Pre-wake the backend when app loads. Call on Login mount to reduce wait when user clicks. */
export function wakeServer() {
  fetch(`${API_BASE_URL}/api/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
    .catch(() => {});
}

export async function apiLogin(email, password, onRetry) {
  const response = await fetchWithRetry(
    `${API_BASE_URL}/api/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
    MAX_RETRIES,
    onRetry
  );
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  return { ok: response.ok, status: response.status, data };
}

export async function apiSignup(payload, onRetry) {
  const response = await fetchWithRetry(
    `${API_BASE_URL}/api/signup`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    MAX_RETRIES,
    onRetry
  );
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  return { ok: response.ok, status: response.status, data };
}
