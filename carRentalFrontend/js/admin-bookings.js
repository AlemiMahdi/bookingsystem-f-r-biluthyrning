/* ═══════════════════════════════════════════
   ADMIN-BOOKINGS.JS - ADMIN BOKNINGSHANTERING
═══════════════════════════════════════════ */

async function renderAdminBookingsView() {
  renderMain(`
    <div class="view">
      <h1 class="view-title">Bokningar</h1>
      <p class="view-subtitle">Hantera alla bokningar i systemet</p>
      <div class="section-divider"></div>
      ${loading()}
    </div>`);

  try {
    const res = await apiFetch('/bookings');
    const bookings = await res.json();

    const bookingRow = b => `
      <tr data-id="${b.id}">
        <td>
          ${b.id}
          <button
            type="button"
            class="expand-btn"
            data-expand="${b.id}"
            aria-label="Visa mer information om bokning ${b.id}"
            aria-expanded="false"
          >
            ▼
          </button>
        </td>

        <td class="hide-mobile">${b.fromDate}</td>
        <td class="hide-mobile">${b.toDate}</td>
        <td class="hide-mobile">${b.userId}</td>
        <td class="hide-mobile">${b.carId}</td>

        <td>
          <span class="badge ${b.active ? 'badge-active' : 'badge-inactive'}">
            ${b.active ? 'Aktiv' : 'Avslutad'}
          </span>
        </td>

        <td>
          <div class="td-actions">
            <button type="button" class="btn-edit" data-edit-booking="${b.id}">
              Redigera
            </button>

            <button type="button" class="btn-delete" data-del-booking="${b.id}">
              Ta bort
            </button>
          </div>
        </td>
      </tr>

      <tr class="expanded-row" id="expand-${b.id}">
        <td colspan="7">
          <div class="expanded-content">
            <div class="expanded-field">
              <span class="field-label">Från</span>
              <span class="field-value">${b.fromDate}</span>
            </div>

            <div class="expanded-field">
              <span class="field-label">Till</span>
              <span class="field-value">${b.toDate}</span>
            </div>

            <div class="expanded-field">
              <span class="field-label">Kund-ID</span>
              <span class="field-value">${b.userId}</span>
            </div>

            <div class="expanded-field">
              <span class="field-label">Bil-ID</span>
              <span class="field-value">${b.carId}</span>
            </div>
          </div>
        </td>
      </tr>`;

    renderMain(`
      <div class="view">
        <h1 class="view-title">Bokningar</h1>
        <p class="view-subtitle">${bookings.length} bokningar totalt</p>
        <div class="section-divider"></div>

        <div class="table-wrapper">
          <table id="bookings-table">
            <thead>
              <tr>
                <th data-col="id">ID <span class="sort-arrow">⇅</span></th>
                <th data-col="fromDate" class="hide-mobile">Från <span class="sort-arrow">⇅</span></th>
                <th data-col="toDate" class="hide-mobile">Till <span class="sort-arrow">⇅</span></th>
                <th data-col="userId" class="hide-mobile">Kund-ID <span class="sort-arrow">⇅</span></th>
                <th data-col="carId" class="hide-mobile">Bil-ID <span class="sort-arrow">⇅</span></th>
                <th data-col="active">Status <span class="sort-arrow">⇅</span></th>
                <th>Åtgärd</th>
              </tr>
            </thead>

            <tbody>
              ${bookings.map(bookingRow).join('')}
            </tbody>
          </table>
        </div>
      </div>`);

    makeSortable('bookings-table', bookings, bookingRow);
    bindAdminBookingActions('bookings-table', bookings);
    bindExpandableRows('bookings-table');

  } catch (e) {
    renderMain(`
      <p style="color:var(--clr-error);padding:20px">
        Kunde inte ladda bokningar.
      </p>
    `);
  }
}

function bindAdminBookingActions(tableId, bookings) {
  const table = document.getElementById(tableId);
  if (!table) return;

  table.addEventListener('click', async e => {
    const deleteBtn = e.target.closest('[data-del-booking]');
    const editBtn = e.target.closest('[data-edit-booking]');

    if (deleteBtn) {
      e.preventDefault();

      if (!confirm('Ta bort denna bokning?')) return;

      const id = deleteBtn.dataset.delBooking;

      const res = await apiFetch(`/bookings/${id}`, {
        method: 'DELETE',
      });

      if (res.ok || res.status === 204) {
        renderAdminBookingsView();
      }

      return;
    }

    if (editBtn) {
      e.preventDefault();

      const id = Number(editBtn.dataset.editBooking);
      const booking = bookings.find(b => b.id === id);

      if (booking) {
        renderEditBookingForm(booking);
      }
    }
  });
}

function renderEditBookingForm(b) {
  const main = document.getElementById('main-content');

  main.innerHTML = `
    <div class="view">
      <h1 class="view-title">Redigera bokning #${b.id}</h1>
      <div class="section-divider"></div>

      <div class="form-card">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Från datum</label>
            <input type="date" id="eb-from" value="${b.fromDate}" />
          </div>

          <div class="form-group">
            <label>Till datum</label>
            <input type="date" id="eb-to" value="${b.toDate}" />
          </div>

          <div class="form-group">
            <label>Kund-ID</label>
            <input type="number" id="eb-uid" value="${b.userId}" />
          </div>

          <div class="form-group">
            <label>Bil-ID</label>
            <input type="number" id="eb-cid" value="${b.carId}" />
          </div>

          <div class="form-group">
            <label>Status</label>
            <select id="eb-active">
              <option value="true" ${b.active ? 'selected' : ''}>Aktiv</option>
              <option value="false" ${!b.active ? 'selected' : ''}>Avslutad</option>
            </select>
          </div>
        </div>

        <div id="eb-error" class="login-error" style="display:none"></div>

        <div class="form-actions">
          <button
            type="button"
            class="btn-primary"
            style="width:auto;padding:10px 24px"
            id="save-booking-btn"
          >
            Spara
          </button>

          <button type="button" class="btn-cancel" id="cancel-booking-btn">
            Avbryt
          </button>
        </div>
      </div>
    </div>`;

  document.getElementById('cancel-booking-btn').addEventListener('click', renderAdminBookingsView);

  document.getElementById('save-booking-btn').addEventListener('click', async () => {
    const body = {
      fromDate: document.getElementById('eb-from').value,
      toDate: document.getElementById('eb-to').value,
      userId: Number(document.getElementById('eb-uid').value),
      carId: Number(document.getElementById('eb-cid').value),
      active: document.getElementById('eb-active').value === 'true',
    };

    const res = await apiFetch(`/bookings/${b.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    if (res.ok) {
      renderAdminBookingsView();
    } else {
      showError('eb-error', 'Kunde inte spara bokning.');
    }
  });
}