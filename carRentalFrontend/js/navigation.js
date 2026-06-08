/* ═══════════════════════════════════════════
   NAVIGATION.JS - NAVIGERINGSMENY OCH ROUTING
═══════════════════════════════════════════ */

function buildNav() {
  const nav = session.isAdmin ? adminNav : customerNav;
  const ul  = document.getElementById('nav-list');
  ul.innerHTML = nav.map(item => `
    <li>
      <a href="#" data-view="${item.id}" aria-label="${item.label}">
        <span class="nav-icon" aria-hidden="true">${item.icon}</span>
        <span>${item.label}</span>
      </a>
    </li>
  `).join('');

  ul.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(a.dataset.view);
    });
  });
}

function setActiveNav(viewId) {
  document.querySelectorAll('#nav-list a').forEach(a => {
    a.classList.toggle('active', a.dataset.view === viewId);
  });
}

function navigateTo(viewId) {
  setActiveNav(viewId);
  switch (viewId) {
    case 'cars':            renderCarsView(); break;
    case 'my-bookings':     renderMyBookingsView(); break;
    case 'profile':         renderProfileView(); break;
    case 'admin-bookings':  renderAdminBookingsView(); break;
    case 'admin-users':     renderAdminUsersView(); break;
    case 'admin-cars':      renderAdminCarsView(); break;
    default: renderCarsView();
  }
}