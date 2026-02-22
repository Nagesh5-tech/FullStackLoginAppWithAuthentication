import API_BASE_URL from "./config/api";

const FETCH_TIMEOUT = 60000; // 60 seconds - Render free tier can take 30-50s to wake
const RETRY_DELAY = 3000;    // 3 seconds between retries
const MAX_RETRIES = 2;

/**
 * Fetch with timeout and retry logic for Render cold starts.
 */
async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
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
    const isRetryable = err.name === "AbortError" || err.message === "Failed to fetch";
    if (retries > 0 && isRetryable) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY));
      return fetchWithRetry(url, { ...options, signal: undefined }, retries - 1);
    }
    throw err;
  }
}

export async function apiLogin(email, password) {
  const response = await fetchWithRetry(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  return { ok: response.ok, status: response.status, data };
}

export async function apiSignup(payload) {
  const response = await fetchWithRetry(`${API_BASE_URL}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  return { ok: response.ok, status: response.status, data };
}
