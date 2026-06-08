/* ═══════════════════════════════════════════
   AUTH.JS - INLOGGNING, REGISTRERING, UTLOGGNING
═══════════════════════════════════════════ */

function initAuth() {
  // Login-event listeners
  const loginBtn = document.getElementById('login-btn');
  const loginForm = document.getElementById('login-form');
  const passwordInput = document.getElementById('password');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLogin();
    });
  } else if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
  }

  if (passwordInput) {
    passwordInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleLogin();
    });
  }

  // Register button
  const showRegisterBtn = document.getElementById('show-register');
  if (showRegisterBtn) {
    showRegisterBtn.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('login-overlay').style.display = 'none';
      document.getElementById('register-overlay').style.display = 'flex';
    });
  }

  // Back to login button
  const showLoginBtn = document.getElementById('show-login');
  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('register-overlay').style.display = 'none';
      document.getElementById('login-overlay').style.display = 'flex';
    });
  }

  // Register button
  const registerBtn = document.getElementById('register-btn');
  if (registerBtn) {
    registerBtn.addEventListener('click', handleRegister);
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

async function handleLogin() {
  hideError('login-error');
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    showError('login-error', 'Fyll i användarnamn och lösenord.');
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (!res.ok) {
      showError('login-error', 'Fel användarnamn eller lösenord.');
      return;
    }

    const data = await res.json();
    session.username = username;
    session.password = password;
    session.userId   = data.userId;
    session.isAdmin  = data.isAdmin;

    startApp();
  } catch (e) {
    showError('login-error', 'Kunde inte ansluta till servern. Kontrollera att backend körs.');
  }
}

async function handleRegister() {
  hideError('register-error');
  hideError('register-success');

  const body = {
    firstName: document.getElementById('reg-firstname').value.trim(),
    lastName:  document.getElementById('reg-lastname').value.trim(),
    username:  document.getElementById('reg-username').value.trim(),
    email:     document.getElementById('reg-email').value.trim(),
    phone:     document.getElementById('reg-phone').value.trim(),
    password:  document.getElementById('reg-password').value,
    role:      'ROLE_USER',
  };

  if (!body.firstName || !body.lastName || !body.username || !body.email || !body.password) {
    showError('register-error', 'Fyll i alla obligatoriska fält.');
    return;
  }

  try {
    const res = await fetch(`${API}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (res.status === 201 || res.ok) {
      showSuccess('register-success', 'Konto skapat! Du kan nu logga in.');
      setTimeout(() => {
        document.getElementById('register-overlay').style.display = 'none';
        document.getElementById('login-overlay').style.display = 'flex';
      }, 1800);
    } else {
      showError('register-error', 'Registrering misslyckades. Försök igen.');
    }
  } catch (e) {
    showError('register-error', 'Kunde inte ansluta till servern.');
  }
}

function handleLogout() {
  session = { username: null, password: null, userId: null, isAdmin: false };
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-overlay').style.display = 'flex';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

function startApp() {
  document.getElementById('login-overlay').style.display = 'none';
  document.getElementById('register-overlay').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  document.getElementById('header-username').textContent = session.username;
  document.getElementById('header-role-badge').textContent = session.isAdmin ? 'Admin' : 'Kund';

  buildNav();
  navigateTo('cars');
}