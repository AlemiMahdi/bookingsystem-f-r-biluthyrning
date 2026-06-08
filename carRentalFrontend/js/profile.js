/* ═══════════════════════════════════════════
   PROFILE.JS - KUNDENS PROFIL
═══════════════════════════════════════════ */

async function renderProfileView() {
  renderMain(`
    <div class="view">
      <h1 class="view-title">Min profil</h1>
      <div class="section-divider"></div>
      ${loading()}
    </div>`);

  try {
    const res = await apiFetch(`/users/${session.userId}`);
    const user = await res.json();

    renderMain(`
      <div class="view">
        <h1 class="view-title">Min profil</h1>
        <div class="section-divider"></div>
        <div class="profile-card" id="profile-display">
          <h3>Kontoinformation</h3>
          <div class="profile-field"><label>Förnamn</label><span>${user.firstName}</span></div>
          <div class="profile-field"><label>Efternamn</label><span>${user.lastName}</span></div>
          <div class="profile-field"><label>Användarnamn</label><span>${user.username}</span></div>
          <div class="profile-field"><label>E-post</label><span>${user.email}</span></div>
          <div class="profile-field"><label>Telefon</label><span>${user.phone}</span></div>
          <div class="profile-field"><label>Antal bokningar</label><span>${user.noOfOrders}</span></div>
          <div class="form-actions" style="margin-top:20px">
            <button class="btn-primary" style="width:auto;padding:10px 24px" id="edit-profile-btn">Redigera profil</button>
          </div>
        </div>
      </div>`);

    document.getElementById('edit-profile-btn').addEventListener('click', () => renderEditProfile(user));
  } catch (e) {
    renderMain(`<p style="color:var(--clr-error);padding:20px">Kunde inte ladda profil.</p>`);
  }
}

function renderEditProfile(user) {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="view">
      <h1 class="view-title">Redigera profil</h1>
      <div class="section-divider"></div>
      <div class="form-card">
        <h3>Uppdatera uppgifter</h3>
        <div class="form-grid-2">
          <div class="form-group"><label>Förnamn</label><input id="e-fname" value="${user.firstName}" /></div>
          <div class="form-group"><label>Efternamn</label><input id="e-lname" value="${user.lastName}" /></div>
          <div class="form-group"><label>Användarnamn</label><input id="e-uname" value="${user.username}" /></div>
          <div class="form-group"><label>Telefon</label><input id="e-phone" value="${user.phone}" /></div>
          <div class="form-group"><label>E-post</label><input id="e-email" value="${user.email}" /></div>
          <div class="form-group"><label>Nytt lösenord <small>(lämna tomt = oförändrat)</small></label><input type="password" id="e-pass" placeholder="Nytt lösenord" /></div>
        </div>
        <div id="profile-edit-error" class="login-error" style="display:none"></div>
        <div id="profile-edit-success" class="login-success" style="display:none"></div>
        <div class="form-actions">
          <button class="btn-primary" style="width:auto;padding:10px 24px" id="save-profile-btn">Spara</button>
          <button class="btn-cancel" id="cancel-profile-btn">Avbryt</button>
        </div>
      </div>
    </div>`;

  document.getElementById('cancel-profile-btn').addEventListener('click', renderProfileView);
  document.getElementById('save-profile-btn').addEventListener('click', async () => {
    const body = {
      firstName: document.getElementById('e-fname').value.trim(),
      lastName:  document.getElementById('e-lname').value.trim(),
      username:  document.getElementById('e-uname').value.trim(),
      phone:     document.getElementById('e-phone').value.trim(),
      email:     document.getElementById('e-email').value.trim(),
      password:  document.getElementById('e-pass').value || session.password,
      role:      user.role,
    };

    try {
      const res = await apiFetch(`/users/${session.userId}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      if (res.ok) {
        session.username = body.username;
        if (document.getElementById('e-pass').value) {
          session.password = document.getElementById('e-pass').value;
        }
        document.getElementById('header-username').textContent = session.username;
        showSuccess('profile-edit-success', 'Profil uppdaterad!');
        setTimeout(renderProfileView, 1400);
      } else {
        showError('profile-edit-error', 'Kunde inte spara ändringar.');
      }
    } catch (e) {
      showError('profile-edit-error', 'Serverfel.');
    }
  });
}