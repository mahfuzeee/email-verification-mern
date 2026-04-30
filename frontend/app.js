const BASE = "http://localhost:3000";
let countdownTimer = null;

/* ─── Navigation ─── */
function showPage(name) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("page-" + name).classList.add("active");
}

function goToOtp() {
  const email = document.getElementById("login-email").value.trim();
  if (email) document.getElementById("otp-email").value = email;
  showPage("otp");
}

/* ─── Helpers ─── */
function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  btn.disabled = loading;
  btn.classList.toggle("loading", loading);
}

function showMsg(id, text, type = "error") {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = "msg msg-" + type + " show";
}

function clearMsgs(...ids) {
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("show");
  });
}

function togglePw(inputId, btn) {
  const inp = document.getElementById(inputId);
  const isText = inp.type === "text";
  inp.type = isText ? "password" : "text";
  btn.textContent = isText ? "👁" : "🙈";
}

/* ─── Password Strength ─── */
function checkStrength(val) {
  const bars = ["s1", "s2", "s3", "s4"];
  const lbl = document.getElementById("strength-label");
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const colors = ["", "#ff6b6b", "#ff9f43", "#ffd32a", "#43e97b"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  bars.forEach((id, i) => {
    document.getElementById(id).style.background =
      i < score ? colors[score] : "var(--border)";
  });
  lbl.textContent = val.length ? labels[score] : "";
  lbl.style.color = colors[score] || "var(--muted)";
}

/* ─── Register ─── */
async function register() {
  clearMsgs("reg-error", "reg-success");
  const name = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;

  if (!name || !email || !password)
    return showMsg("reg-error", "⚠ All fields are required.");
  if (password.length < 8)
    return showMsg("reg-error", "⚠ Password must be at least 8 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return showMsg("reg-error", "⚠ Please enter a valid email address.");

  setLoading("reg-btn", true);
  try {
    const res = await fetch(`${BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      showMsg(
        "reg-success",
        "✓ Account created! Redirecting to login…",
        "success",
      );
      setTimeout(() => showPage("login"), 1800);
    } else {
      showMsg("reg-error", "⚠ " + (data.message || "Registration failed."));
    }
  } catch {
    showMsg(
      "reg-error",
      "⚠ Could not reach the server. Is the backend running?",
    );
  } finally {
    setLoading("reg-btn", false);
  }
}

/* ─── Login ─── */
async function login() {
  clearMsgs("login-error", "login-success");
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password)
    return showMsg("login-error", "⚠ Email and password are required.");

  setLoading("login-btn", true);
  try {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      if (data.token) localStorage.setItem("auth_token", data.token);
      showMsg("login-success", "✓ Login successful! Redirecting…", "success");
      // Replace redirect below with your app's dashboard route
      setTimeout(
        () => showMsg("login-success", "✓ Logged in as " + email, "success"),
        1800,
      );
    } else {
      showMsg("login-error", "⚠ " + (data.message || "Invalid credentials."));
    }
  } catch {
    showMsg(
      "login-error",
      "⚠ Could not reach the server. Is the backend running?",
    );
  } finally {
    setLoading("login-btn", false);
  }
}

/* ─── Request OTP ─── */
async function requestOtp() {
  clearMsgs("otp-error", "otp-success");
  const email = document.getElementById("otp-email").value.trim();
  if (!email)
    return showMsg("otp-error", "⚠ Please enter your email address first.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return showMsg("otp-error", "⚠ Please enter a valid email address.");

  setLoading("send-otp-btn", true);
  try {
    const res = await fetch(`${BASE}/api/auth/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      showMsg("otp-success", "✓ OTP sent! Check your inbox.", "success");
      startCountdown();
    } else {
      showMsg("otp-error", "⚠ " + (data.message || "Failed to send OTP."));
    }
  } catch {
    showMsg(
      "otp-error",
      "⚠ Could not reach the server. Is the backend running?",
    );
  } finally {
    setLoading("send-otp-btn", false);
  }
}

/* ─── Verify OTP ─── */
async function verifyOtp() {
  clearMsgs("otp-error", "otp-success");
  const email = document.getElementById("otp-email").value.trim();
  const otp = document.getElementById("otp-code").value.trim();

  if (!email || !otp)
    return showMsg("otp-error", "⚠ Email and OTP code are both required.");
  if (otp.length < 4)
    return showMsg("otp-error", "⚠ Please enter the full OTP code.");

  setLoading("verify-btn", true);
  try {
    const res = await fetch(`${BASE}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (res.ok) {
      clearCountdown();
      showPage("success");
    } else {
      showMsg("otp-error", "⚠ " + (data.message || "OTP verification failed."));
    }
  } catch {
    showMsg(
      "otp-error",
      "⚠ Could not reach the server. Is the backend running?",
    );
  } finally {
    setLoading("verify-btn", false);
  }
}

/* ─── Countdown ─── */
function startCountdown() {
  clearCountdown();
  let secs = 60;
  const timerEl = document.getElementById("otp-timer");
  const countEl = document.getElementById("countdown");
  const sendBtn = document.getElementById("send-otp-btn");
  timerEl.style.display = "block";
  sendBtn.disabled = true;
  countdownTimer = setInterval(() => {
    secs--;
    countEl.textContent = secs;
    if (secs <= 0) {
      clearCountdown();
    }
  }, 1000);
}

function clearCountdown() {
  clearInterval(countdownTimer);
  const timerEl = document.getElementById("otp-timer");
  const sendBtn = document.getElementById("send-otp-btn");
  if (timerEl) timerEl.style.display = "none";
  if (sendBtn) sendBtn.disabled = false;
}

/* ─── Enter key support ─── */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const active = document.querySelector(".page.active");
  if (!active) return;
  const id = active.id;
  if (id === "page-register") register();
  else if (id === "page-login") login();
  else if (id === "page-otp") verifyOtp();
});
