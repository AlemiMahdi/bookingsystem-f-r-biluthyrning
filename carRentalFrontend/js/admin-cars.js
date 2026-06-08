/* ═══════════════════════════════════════════
   ADMIN-CARS.JS - ADMIN BILHANTERING
═══════════════════════════════════════════ */

async function renderAdminCarsView() {
  renderMain(`
    <div class="view">
      <h1 class="view-title">Hantera bilar</h1>
      <p class="view-subtitle">Lägg till, redigera eller ta bort bilar</p>
      <div class="section-divider"></div>
      ${loading()}
    </div>`);

  try {
    const res = await fetch(`${API}/cars`, { credentials: 'include' });
    const cars = await res.json();

    const carRow = c => `
  <tr data-id="${c.id}">
    <td class="hide-mobile">${c.id}</td>

    <td>
      ${c.name}
      <button
        type="button"
        class="expand-btn"
        data-expand="c${c.id}"
        aria-label="Visa mer information om bil ${c.id}"
        aria-expanded="false"
      >
        ▼
      </button>
    </td>

    <td class="hide-mobile">${c.model}</td>
    <td class="hide-mobile">${c.type}</td>
    <td class="hide-mobile">${c.price.toLocaleString('sv-SE')} kr</td>

    <td>
      <span class="badge ${c.booked ? 'badge-inactive' : 'badge-active'}">
        ${c.booked ? 'Bokad' : 'Ledig'}
      </span>
    </td>

    <td>
      <div class="td-actions">
        <button type="button" class="btn-edit" data-edit-car="${c.id}">
          Redigera
        </button>

        <button type="button" class="btn-delete" data-del-car="${c.id}">
          Ta bort
        </button>
      </div>
    </td>
  </tr>

  <tr class="expanded-row" id="expand-c${c.id}">
    <td colspan="7">
      <div class="expanded-content">
        <div class="expanded-field">
          <span class="field-label">ID</span>
          <span class="field-value">${c.id}</span>
        </div>

        <div class="expanded-field">
          <span class="field-label">Modell</span>
          <span class="field-value">${c.model}</span>
        </div>

        <div class="expanded-field">
          <span class="field-label">Typ</span>
          <span class="field-value">${c.type}</span>
        </div>

        <div class="expanded-field">
          <span class="field-label">Pris</span>
          <span class="field-value">${c.price.toLocaleString('sv-SE')} kr</span>
        </div>

        <div class="expanded-field">
          <span class="field-label">Egenskap 1</span>
          <span class="field-value">${c.feature1 || '-'}</span>
        </div>

        <div class="expanded-field">
          <span class="field-label">Egenskap 2</span>
          <span class="field-value">${c.feature2 || '-'}</span>
        </div>

        <div class="expanded-field">
          <span class="field-label">Egenskap 3</span>
          <span class="field-value">${c.feature3 || '-'}</span>
        </div>
      </div>
    </td>
  </tr>`;

    renderMain(`
      <div class="view">
        <h1 class="view-title">Hantera bilar</h1>
        <div class="section-divider"></div>

        <div class="table-toolbar">
          <p class="view-subtitle" style="margin:0">${cars.length} bilar i systemet</p>
          <button type="button" class="btn-add" id="add-car-btn">+ Lägg till bil</button>
        </div>

        <div class="table-wrapper">
          <table id="admin-cars-table">
            <thead>
              <tr>
                <th data-col="id" class="hide-mobile">ID <span class="sort-arrow">⇅</span></th>
                <th data-col="name">Namn <span class="sort-arrow">⇅</span></th>
                <th data-col="model" class="hide-mobile">Modell <span class="sort-arrow">⇅</span></th>
                <th data-col="type" class="hide-mobile">Typ <span class="sort-arrow">⇅</span></th>
                <th data-col="price" class="hide-mobile">Pris <span class="sort-arrow">⇅</span></th>
                <th data-col="booked">Status <span class="sort-arrow">⇅</span></th>
                <th>Åtgärd</th>
              </tr>
            </thead>

            <tbody>
              ${cars.map(carRow).join('')}
            </tbody>
          </table>
        </div>
      </div>`);

    makeSortable('admin-cars-table', cars, carRow);
    bindAdminCarActions('admin-cars-table', cars);
    bindExpandableRows('admin-cars-table');

    document.getElementById('add-car-btn').addEventListener('click', () => {
      renderAddCarForm();
    });

  } catch (e) {
    renderMain(`
      <p style="color:var(--clr-error);padding:20px">
        Kunde inte ladda bilar.
      </p>
    `);
  }
}

function bindAdminCarActions(tableId, cars) {
  const table = document.getElementById(tableId);
  if (!table) return;

  if (table.dataset.carActionsBound === 'true') return;
  table.dataset.carActionsBound = 'true';

  table.addEventListener('click', async e => {
    const deleteBtn = e.target.closest('[data-del-car]');
    const editBtn = e.target.closest('[data-edit-car]');

    if (deleteBtn) {
      e.preventDefault();

      if (!confirm('Ta bort denna bil?')) return;

      const id = deleteBtn.dataset.delCar;

      const res = await apiFetch(`/cars/${id}`, {
        method: 'DELETE',
      });

      if (res.ok || res.status === 204) {
        renderAdminCarsView();
      }

      return;
    }

    if (editBtn) {
      e.preventDefault();

      const id = Number(editBtn.dataset.editCar);
      const car = cars.find(c => c.id === id);

      if (car) {
        renderEditCarForm(car);
      }
    }
  });
}

function renderAddCarForm() {
  const main = document.getElementById('main-content');

  main.innerHTML = `
    <div class="view">
      <h1 class="view-title">Lägg till bil</h1>
      <div class="section-divider"></div>

      <div class="form-card">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Namn</label>
            <input id="ac-name" placeholder="t.ex. Volvo" />
          </div>

          <div class="form-group">
            <label>Modell</label>
            <input id="ac-model" placeholder="t.ex. XC90" />
          </div>

          <div class="form-group">
            <label>Typ</label>
            <input id="ac-type" placeholder="t.ex. SUV" />
          </div>

          <div class="form-group">
            <label>Pris (kr/dag)</label>
            <input type="number" id="ac-price" placeholder="995" />
          </div>

          <div class="form-group">
            <label>Egenskap 1</label>
            <input id="ac-f1" placeholder="t.ex. Automat" />
          </div>

          <div class="form-group">
            <label>Egenskap 2</label>
            <input id="ac-f2" placeholder="t.ex. AWD" />
          </div>

          <div class="form-group">
            <label>Egenskap 3</label>
            <input id="ac-f3" placeholder="t.ex. GPS" />
          </div>

          <div class="form-group">
            <label>Status</label>
            <select id="ac-booked">
              <option value="false">Ledig</option>
              <option value="true">Bokad</option>
            </select>
          </div>

          <div class="form-group" style="grid-column:1/-1">
            <label>Bild (valfritt)</label>
            <input type="file" id="ac-image" accept="image/*" />
          </div>
        </div>

        <div id="ac-error" class="login-error" style="display:none"></div>
        <div id="ac-success" class="login-success" style="display:none"></div>

        <div class="form-actions">
          <button
            type="button"
            class="btn-primary"
            style="width:auto;padding:10px 24px"
            id="save-add-car-btn"
          >
            Spara bil
          </button>

          <button type="button" class="btn-cancel" id="cancel-add-car-btn">
            Avbryt
          </button>
        </div>
      </div>
    </div>`;

  document.getElementById('cancel-add-car-btn').addEventListener('click', renderAdminCarsView);

  document.getElementById('save-add-car-btn').addEventListener('click', async () => {
    const formData = new FormData();

    formData.append('name', document.getElementById('ac-name').value.trim());
    formData.append('model', document.getElementById('ac-model').value.trim());
    formData.append('type', document.getElementById('ac-type').value.trim());
    formData.append('price', document.getElementById('ac-price').value);
    formData.append('feature1', document.getElementById('ac-f1').value.trim());
    formData.append('feature2', document.getElementById('ac-f2').value.trim());
    formData.append('feature3', document.getElementById('ac-f3').value.trim());
    formData.append('booked', document.getElementById('ac-booked').value);

    const imgFile = document.getElementById('ac-image').files[0];

    if (imgFile) {
      formData.append('image', imgFile);
    }

    try {
      const encoded = btoa(`${session.username}:${session.password}`);

      const res = await fetch(`${API}/cars`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Basic ${encoded}`,
        },
        body: formData,
      });

      if (res.status === 201 || res.ok) {
        showSuccess('ac-success', 'Bil tillagd!');
        setTimeout(renderAdminCarsView, 1200);
      } else {
        showError('ac-error', 'Kunde inte lägga till bil.');
      }
    } catch (e) {
      showError('ac-error', 'Serverfel.');
    }
  });
}

function renderEditCarForm(c) {
  const main = document.getElementById('main-content');

  main.innerHTML = `
    <div class="view">
      <h1 class="view-title">Redigera bil #${c.id}</h1>
      <div class="section-divider"></div>

      <div class="form-card">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Namn</label>
            <input id="ec-name" value="${c.name}" />
          </div>

          <div class="form-group">
            <label>Modell</label>
            <input id="ec-model" value="${c.model}" />
          </div>

          <div class="form-group">
            <label>Typ</label>
            <input id="ec-type" value="${c.type}" />
          </div>

          <div class="form-group">
            <label>Pris (kr/dag)</label>
            <input type="number" id="ec-price" value="${c.price}" />
          </div>

          <div class="form-group">
            <label>Egenskap 1</label>
            <input id="ec-f1" value="${c.feature1 || ''}" />
          </div>

          <div class="form-group">
            <label>Egenskap 2</label>
            <input id="ec-f2" value="${c.feature2 || ''}" />
          </div>

          <div class="form-group">
            <label>Egenskap 3</label>
            <input id="ec-f3" value="${c.feature3 || ''}" />
          </div>

          <div class="form-group">
            <label>Status</label>
            <select id="ec-booked">
              <option value="false" ${!c.booked ? 'selected' : ''}>
                Ledig
              </option>
              <option value="true" ${c.booked ? 'selected' : ''}>
                Bokad
              </option>
            </select>
          </div>
        </div>

        <div id="ec-error" class="login-error" style="display:none"></div>

        <div class="form-actions">
          <button
            type="button"
            class="btn-primary"
            style="width:auto;padding:10px 24px"
            id="save-edit-car-btn"
          >
            Spara
          </button>

          <button type="button" class="btn-cancel" id="cancel-edit-car-btn">
            Avbryt
          </button>
        </div>
      </div>
    </div>`;

  document.getElementById('cancel-edit-car-btn').addEventListener('click', renderAdminCarsView);

  document.getElementById('save-edit-car-btn').addEventListener('click', async () => {
    const body = {
      name: document.getElementById('ec-name').value.trim(),
      model: document.getElementById('ec-model').value.trim(),
      type: document.getElementById('ec-type').value.trim(),
      price: parseFloat(document.getElementById('ec-price').value),
      feature1: document.getElementById('ec-f1').value.trim(),
      feature2: document.getElementById('ec-f2').value.trim(),
      feature3: document.getElementById('ec-f3').value.trim(),
      booked: document.getElementById('ec-booked').value === 'true',
    };

    const res = await apiFetch(`/cars/${c.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    if (res.ok) {
      renderAdminCarsView();
    } else {
      showError('ec-error', 'Kunde inte spara bilen.');
    }
  });
}