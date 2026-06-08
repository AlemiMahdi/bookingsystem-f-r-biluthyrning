/* ═══════════════════════════════════════════
   CARS.JS - BILVISNING, SÖKNING, BOKNING
═══════════════════════════════════════════ */

let allCars = [];
let carSortKey  = 'name';
let carSortDir  = 'asc';
let bookingCarId = null;

async function renderCarsView() {
  renderMain(`
    <div class="view">
      <h1 class="view-title">Tillgängliga bilar</h1>
      <p class="view-subtitle">Välj en bil och boka din resa</p>
      <div class="section-divider"></div>
      <div class="cars-toolbar" id="cars-toolbar">
        <input type="text" class="search-input" id="car-search" placeholder="Sök bil eller typ..." aria-label="Sök bil" />
        <button class="sort-btn active" data-sort="name">Sortera: Namn ↕</button>
        <button class="sort-btn" data-sort="type">Sortera: Typ ↕</button>
        <button class="sort-btn" data-sort="price">Sortera: Pris ↕</button>
      </div>
      <div id="cars-grid" class="cars-grid">${loading('Laddar bilar...')}</div>
    </div>
  `);

  setupCarSort();
  await fetchAndRenderCars();

  const searchInput = document.getElementById('car-search');
  if (searchInput) {
    searchInput.addEventListener('input', filterCars);
  }
}

function setupCarSort() {
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sort;
      if (carSortKey === key) {
        carSortDir = carSortDir === 'asc' ? 'desc' : 'asc';
      } else {
        carSortKey = key;
        carSortDir = 'asc';
      }
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      btn.textContent = `Sortera: ${key === 'name' ? 'Namn' : key === 'type' ? 'Typ' : 'Pris'} ${carSortDir === 'asc' ? '↑' : '↓'}`;
      renderCarGrid(getFilteredSortedCars());
    });
  });
}

async function fetchAndRenderCars() {
  try {
    const res = await fetch(`${API}/cars`, { credentials: 'include' });
    let cars = await res.json();
    
    // Lägg till imagePath baserat på ID
    cars = cars.map(car => ({
      ...car,
      imagePath: imageMap[car.id] || car.imagePath
    }));
    
    allCars = cars;
    renderCarGrid(getFilteredSortedCars());
  } catch (e) {
    allCars = defaultCars;
    renderCarGrid(getFilteredSortedCars());
  }
}

function getFilteredSortedCars() {
  const q = (document.getElementById('car-search')?.value || '').toLowerCase();
  let list = allCars.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.type.toLowerCase().includes(q) ||
    c.model.toLowerCase().includes(q)
  );
  list = list.sort((a, b) => {
    let va = a[carSortKey], vb = b[carSortKey];
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    if (va < vb) return carSortDir === 'asc' ? -1 : 1;
    if (va > vb) return carSortDir === 'asc' ?  1 : -1;
    return 0;
  });
  return list;
}

function filterCars() {
  renderCarGrid(getFilteredSortedCars());
}

function renderCarGrid(cars) {
  const grid = document.getElementById('cars-grid');
  if (!grid) return;
  if (!cars.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">🚗</div>
        <h3>Inga bilar hittades</h3>
        <p>Prova att ändra sökning eller filter.</p>
      </div>`;
    return;
  }
  grid.innerHTML = cars.map(car => carCardHTML(car)).join('');

  // Bind book buttons
  grid.querySelectorAll('.btn-book[data-car-id]').forEach(btn => {
    btn.addEventListener('click', () => openBookingModal(Number(btn.dataset.carId)));
  });
}

function carCardHTML(car) {
  const imgContent = car.imagePath
    ? `<img src="${car.imagePath}" alt="${car.name}" class="car-image" />`
    : '🚗';

  const footer = car.booked
    ? `<span class="booked-badge">Bokad</span>`
    : `<button class="btn-book" data-car-id="${car.id}">Boka nu</button>`;

  return `
    <article class="car-card">
      <div class="car-card-img">${imgContent}</div>
      <div class="car-card-body">
        <div class="car-card-type">${car.type}</div>
        <div class="car-card-name">${car.name} ${car.model}</div>
        <div class="car-card-features">
          ${[car.feature1, car.feature2, car.feature3].filter(Boolean).map(f =>
            `<span class="feature-tag">${f}</span>`
          ).join('')}
        </div>
      </div>
      <div class="car-card-footer">
        <div class="car-price">${car.price.toLocaleString('sv-SE')} <span>kr/dag</span></div>
        ${footer}
      </div>
    </article>`;
}

function openBookingModal(carId) {
  const car = allCars.find(c => c.id === carId);
  if (!car) return;
  bookingCarId = carId;

  document.getElementById('modal-car-info').innerHTML = `
    <strong>${car.name} ${car.model}</strong>
    ${car.type} · ${car.price.toLocaleString('sv-SE')} kr/dag
  `;

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('booking-from').min = today;
  document.getElementById('booking-from').value = today;
  document.getElementById('booking-to').min = today;
  document.getElementById('booking-to').value = '';

  hideError('booking-error');
  hideError('booking-success');
  
  const modal = document.getElementById('booking-modal');
  modal.style.display = 'flex';
  
  // Fokusera första input-fältet
  setTimeout(() => {
    document.getElementById('booking-from').focus();
  }, 100);
}

function closeBookingModal() {
  document.getElementById('booking-modal').style.display = 'none';
}

function initBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;

  document.getElementById('modal-close').addEventListener('click', closeBookingModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeBookingModal();
    }
  });

  // ESC-tangent stänger modal (WCAG AA)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeBookingModal();
    }
  });

  document.getElementById('confirm-booking-btn').addEventListener('click', confirmBooking);
}

async function confirmBooking() {
  hideError('booking-error');
  hideError('booking-success');

  const from = document.getElementById('booking-from').value;
  const to = document.getElementById('booking-to').value;

  // Hämtar dagens datum i lokal tid, inte UTC
  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-');

  if (!from || !to) {
    showError('booking-error', 'Välj både från- och till-datum.');
    return;
  }

  if (from < todayString || to < todayString) {
    showError('booking-error', 'Du kan inte boka datum som redan har passerat.');
    return;
  }

  if (from > to) {
    showError('booking-error', 'Från-datum måste vara före till-datum.');
    return;
  }

  try {
    const res = await apiFetch('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        carId: bookingCarId,
        fromDate: from,
        toDate: to
      }),
    });

    if (res.status === 201 || res.ok) {
      showSuccess('booking-success', '✓ Bokning bekräftad!');

      const car = allCars.find(c => c.id === bookingCarId);
      if (car) {
        car.booked = true;
      }

      setTimeout(() => {
        closeBookingModal();
        renderCarGrid(getFilteredSortedCars());
      }, 1500);
    } else {
      const data = await res.json().catch(() => ({}));
      showError('booking-error', data.error || 'Bokning misslyckades.');
    }
  } catch (e) {
    showError('booking-error', 'Kunde inte ansluta till servern.');
  }
}