import {jwtDecode} from "jwt-decode";

let accessToken = null;
let refreshTimer = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = token;

  // notify other tabs
  localStorage.setItem("access-update", Date.now());

  if (refreshTimer) clearTimeout(refreshTimer);
  if (token) scheduleSilentRefresh(token);
};

export const clearAccessToken = () => {
  accessToken = null;

  // notify logout multi-tab
  localStorage.setItem("logout", Date.now());
};

export const setupMultiTabSync = () => {
  window.addEventListener("storage", (e) => {
    if (e.key === "logout") {
      window.location.href = "/login";
    }
    if (e.key === "access-update") {

    }
  });
};

async function refreshTokenSilently() {
  const res = await fetch(import.meta.env.VITE_API_URL + "/auth/refresh", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Silent refresh failed");
  const data = await res.json();

  setAccessToken(data.accessToken);
  return data.accessToken;
}

function scheduleSilentRefresh(token) {
  const decoded = jwtDecode(token);
  if (!decoded.exp) return;

  const expiresAt = decoded.exp * 1000;
  const now = Date.now();

  const refreshBefore = 30_000; 

  const delay = Math.max(expiresAt - now - refreshBefore, 5000);

  refreshTimer = setTimeout(() => {
    refreshTokenSilently().catch(() => clearAccessToken());
  }, delay);
}
