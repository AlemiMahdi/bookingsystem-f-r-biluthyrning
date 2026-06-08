/* ═══════════════════════════════════════════
   BOOKINGS.JS - KUNDENS BOKNINGAR
═══════════════════════════════════════════ */

async function renderMyBookingsView() {
  renderMain(`
    <div class="view">
      <h1 class="view-title">Mina bokningar</h1>
      <p class="view-subtitle">Översikt över dina aktiva och avslutade bokningar</p>
      <div class="section-divider"></div>
      ${loading('Laddar bokningar...')}
    </div>
  `);

  try {
    const res = await apiFetch('/bookings/me');

    if (res.status === 404) {
      renderMain(`
        <div class="view">
          <h1 class="view-title">Mina bokningar</h1>
          <div class="section-divider"></div>
          <div class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>Inga bokningar ännu</h3>
            <p>Du har inte gjort några bokningar. Gå till Bilar och boka din första resa!</p>
          </div>
        </div>`);
      return;
    }

    const bookings = await res.json();
    const rows = bookings.map(b => `
      <tr>
        <td>${b.id}</td>
        <td>${b.fromDate}</td>
        <td>${b.toDate}</td>
        <td>${b.carId}</td>
        <td><span class="badge ${b.active ? 'badge-active' : 'badge-inactive'}">${b.active ? 'Aktiv' : 'Avslutad'}</span></td>
        
      </tr>`).join('');

    renderMain(`
      <div class="view">
        <h1 class="view-title">Mina bokningar</h1>
        <p class="view-subtitle">${bookings.length} bokning(ar) totalt</p>
        <div class="section-divider"></div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Från</th><th>Till</th><th>Bil-ID</th><th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `);
  } catch (e) {
    renderMain(`<p style="color:var(--clr-error);padding:20px">Kunde inte ladda bokningar.</p>`);
  }
}