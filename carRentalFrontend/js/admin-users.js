/* ═══════════════════════════════════════════
   ADMIN-USERS.JS - ADMIN ANVÄNDARHANTERING
═══════════════════════════════════════════ */

async function renderAdminUsersView() {
  renderMain(`
    <div class="view">
      <h1 class="view-title">Användare</h1>
      <p class="view-subtitle">Hantera alla registrerade användare</p>
      <div class="section-divider"></div>
      ${loading()}
    </div>`);

  try {
    const res = await apiFetch('/users');
    const users = await res.json();

    const userRow = u => `
  <tr data-id="${u.id}">
    <td class="hide-mobile">${u.id}</td>

    <td>
      ${u.firstName} ${u.lastName}
      <button
        type="button"
        class="expand-btn"
        data-expand="u${u.id}"
        aria-label="Visa mer information om användare ${u.id}"
        aria-expanded="false"
      >
        ▼
      </button>
    </td>

    <td class="hide-mobile">${u.username}</td>
    <td class="hide-mobile">${u.email}</td>
    <td class="hide-mobile">${u.phone}</td>
    <td class="hide-mobile">${u.noOfOrders}</td>

    <td>
      <span class="badge ${u.role === 'ROLE_ADMIN' ? 'badge-admin' : 'badge-user'}">
        ${u.role === 'ROLE_ADMIN' ? 'Admin' : 'Kund'}
      </span>
    </td>

    <td>
      <div class="td-actions">
        <button type="button" class="btn-edit" data-edit-user="${u.id}">
          Redigera
        </button>

        <button type="button" class="btn-delete" data-del-user="${u.id}">
          Ta bort
        </button>
      </div>
    </td>
  </tr>

  <tr class="expanded-row" id="expand-u${u.id}">
    <td colspan="8">
      <div class="expanded-content">
        <div class="expanded-field">
          <span class="field-label">ID</span>
          <span class="field-value">${u.id}</span>
        </div>

        <div class="expanded-field">
          <span class="field-label">Användarnamn</span>
          <span class="field-value">${u.username}</span>
        </div>

        <div class="expanded-field">
          <span class="field-label">E-post</span>
          <span class="field-value">${u.email}</span>
        </div>

        <div class="expanded-field">
          <span class="field-label">Telefon</span>
          <span class="field-value">${u.phone}</span>
        </div>

        <div class="expanded-field">
          <span class="field-label">Bokningar</span>
          <span class="field-value">${u.noOfOrders}</span>
        </div>
      </div>
    </td>
  </tr>`;

    renderMain(`
      <div class="view">
        <h1 class="view-title">Användare</h1>
        <p class="view-subtitle">${users.length} användare totalt</p>
        <div class="section-divider"></div>

        <div class="table-wrapper">
          <table id="users-table">
            <thead>
              <tr>
                <th data-col="id" class="hide-mobile">ID <span class="sort-arrow">⇅</span></th>
                <th data-col="firstName">Namn <span class="sort-arrow">⇅</span></th>
                <th data-col="username" class="hide-mobile">Användarnamn <span class="sort-arrow">⇅</span></th>
                <th data-col="email" class="hide-mobile">E-post <span class="sort-arrow">⇅</span></th>
                <th data-col="phone" class="hide-mobile">Telefon <span class="sort-arrow">⇅</span></th>
                <th data-col="noOfOrders" class="hide-mobile">Bokningar <span class="sort-arrow">⇅</span></th>
                <th data-col="role">Roll <span class="sort-arrow">⇅</span></th>
                <th>Åtgärd</th>
              </tr>
            </thead>

            <tbody>
              ${users.map(userRow).join('')}
            </tbody>
          </table>
        </div>
      </div>`);

    makeSortable('users-table', users, userRow);
    bindAdminUserActions('users-table', users);
    bindExpandableRows('users-table');

  } catch (e) {
    renderMain(`
      <p style="color:var(--clr-error);padding:20px">
        Kunde inte ladda användare.
      </p>
    `);
  }
}

/* ─── EDIT / DELETE ──────────────────────────────────────
   Även Redigera/Ta bort körs via tabellen.
   Då fungerar knapparna även efter sortering.
────────────────────────────────────────────────────────── */
function bindAdminUserActions(tableId, users) {
  const table = document.getElementById(tableId);
  if (!table) return;

  if (table.dataset.userActionsBound === 'true') return;
  table.dataset.userActionsBound = 'true';

  table.addEventListener('click', async e => {
    const deleteBtn = e.target.closest('[data-del-user]');
    const editBtn = e.target.closest('[data-edit-user]');

    if (deleteBtn) {
      e.preventDefault();

      if (!confirm('Ta bort denna användare?')) return;

      const id = deleteBtn.dataset.delUser;

      const res = await apiFetch(`/users/${id}`, {
        method: 'DELETE',
      });

      if (res.ok || res.status === 204) {
        renderAdminUsersView();
      }

      return;
    }

    if (editBtn) {
      e.preventDefault();

      const id = Number(editBtn.dataset.editUser);
      const user = users.find(u => u.id === id);

      if (user) {
        renderEditUserForm(user);
      }
    }
  });
}

function renderEditUserForm(u) {
  const main = document.getElementById('main-content');

  main.innerHTML = `
    <div class="view">
      <h1 class="view-title">Redigera användare #${u.id}</h1>
      <div class="section-divider"></div>

      <div class="form-card">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Förnamn</label>
            <input id="eu-fname" value="${u.firstName}" />
          </div>

          <div class="form-group">
            <label>Efternamn</label>
            <input id="eu-lname" value="${u.lastName}" />
          </div>

          <div class="form-group">
            <label>Användarnamn</label>
            <input id="eu-uname" value="${u.username}" />
          </div>

          <div class="form-group">
            <label>E-post</label>
            <input id="eu-email" value="${u.email}" />
          </div>

          <div class="form-group">
            <label>Telefon</label>
            <input id="eu-phone" value="${u.phone}" />
          </div>

          <div class="form-group">
            <label>Nytt lösenord <small>(lämna tomt)</small></label>
            <input type="password" id="eu-pass" />
          </div>

          <div class="form-group">
            <label>Roll</label>
            <select id="eu-role">
              <option value="ROLE_USER" ${u.role === 'ROLE_USER' ? 'selected' : ''}>
                Kund
              </option>
              <option value="ROLE_ADMIN" ${u.role === 'ROLE_ADMIN' ? 'selected' : ''}>
                Admin
              </option>
            </select>
          </div>
        </div>

        <div id="eu-error" class="login-error" style="display:none"></div>

        <div class="form-actions">
          <button
            type="button"
            class="btn-primary"
            style="width:auto;padding:10px 24px"
            id="save-user-btn"
          >
            Spara
          </button>

          <button type="button" class="btn-cancel" id="cancel-user-btn">
            Avbryt
          </button>
        </div>
      </div>
    </div>`;

  document.getElementById('cancel-user-btn').addEventListener('click', renderAdminUsersView);

  document.getElementById('save-user-btn').addEventListener('click', async () => {
    const newPass = document.getElementById('eu-pass').value;

    const body = {
      firstName: document.getElementById('eu-fname').value.trim(),
      lastName: document.getElementById('eu-lname').value.trim(),
      username: document.getElementById('eu-uname').value.trim(),
      email: document.getElementById('eu-email').value.trim(),
      phone: document.getElementById('eu-phone').value.trim(),
      role: document.getElementById('eu-role').value,

      /*
        Viktigt:
        Om lösenordet lämnas tomt skickar vi session.password.
        Det är samma mönster som du hade innan.
      */
      password: newPass || session.password,
    };

    const res = await apiFetch(`/users/${u.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    if (res.ok) {
      renderAdminUsersView();
    } else {
      showError('eu-error', 'Kunde inte spara användare.');
    }
  });
}