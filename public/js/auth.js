const AUTH_TOKEN_KEY = "luxe_token";
const AUTH_USER_KEY = "luxe_user";

const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || "null");
  } catch {
    return null;
  }
};

const saveSession = ({ token, user }) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

const setStatus = (message, type = "error") => {
  const status = document.getElementById("authStatus");
  if (!status) return;
  status.hidden = false;
  status.className = `auth-status ${type}`;
  status.textContent = message;
};

const renderHeaderAuth = () => {
  const actions = document.querySelector("[data-auth-actions]");
  if (!actions) return;

  const user = getUser();
  if (!user) {
    actions.innerHTML = `
      <a class="ghost-link" href="/login.html">Log in</a>
      <a class="header-btn" href="/signup.html">Sign up</a>
    `;
    return;
  }

  actions.innerHTML = `
    <span class="auth-user">Hi, ${user.name.split(" ")[0]}</span>
    <button class="ghost-btn" type="button" id="logoutBtn">Log out</button>
  `;

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    clearSession();
    window.location.href = "/";
  });
};

const handleAuthSubmit = async (form, endpoint) => {
  const button = form.querySelector('button[type="submit"]');
  const payload = Object.fromEntries(new FormData(form).entries());

  button.disabled = true;
  button.textContent = endpoint === "signup" ? "Creating account..." : "Logging in...";

  try {
    const response = await fetch(`/api/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    saveSession(data);
    setStatus("Success! Redirecting...", "success");
    window.location.href = "/";
  } catch (error) {
    setStatus(error.message || "Unable to continue.");
  } finally {
    button.disabled = false;
    button.textContent = endpoint === "signup" ? "Create account" : "Log in";
  }
};

document.getElementById("signupForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  if (password !== confirmPassword) {
    setStatus("Passwords do not match.");
    return;
  }

  handleAuthSubmit(form, "signup");
});

document.getElementById("loginForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  handleAuthSubmit(event.currentTarget, "login");
});

renderHeaderAuth();

if ((document.getElementById("signupForm") || document.getElementById("loginForm")) && getToken()) {
  window.location.href = "/";
}
