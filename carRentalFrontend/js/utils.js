/* ═══════════════════════════════════════════
   UTILS.JS - HJÄLPFUNKTIONER
═══════════════════════════════════════════ */

// ─── API-ANROP ─────────────────────────────────────────

function authHeaders() {
  const encoded = btoa(`${session.username}:${session.password}`);
  return {
    'Authorization': `Basic ${encoded}`,
    'Content-Type': 'application/json',
  };
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: authHeaders(),
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  return res;
}

// ─── UI-UPPDATERINGAR ─────────────────────────────────────────

function showError(elId, msg) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  el.setAttribute('role', 'alert');
  el.setAttribute('aria-live', 'assertive');
}

function hideError(elId) {
  const el = document.getElementById(elId);
  if (el) el.style.display = 'none';
}

function showSuccess(elId, msg) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
}

function loading(html = '') {
  return `<div class="loading"><div class="spinner"></div>${html}</div>`;
}

function renderMain(html) {
  document.getElementById('main-content').innerHTML = html;
}

// ─── TABELLSORTERING ─────────────────────────────────────────

function makeSortable(tableId, data, renderRowFn) {
  const table = document.getElementById(tableId);
  if (!table) return;
  let sortCol = null, sortDir = 'asc';

  table.querySelectorAll('thead th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (sortCol === col) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      else { sortCol = col; sortDir = 'asc'; }

      table.querySelectorAll('thead th').forEach(h => {
        h.classList.remove('sort-asc', 'sort-desc');
        const arrow = h.querySelector('.sort-arrow');
        if (arrow) arrow.textContent = '⇅';
      });
      th.classList.add(`sort-${sortDir}`);
      const arrow = th.querySelector('.sort-arrow');
      if (arrow) arrow.textContent = sortDir === 'asc' ? '↑' : '↓';

      const sorted = [...data].sort((a, b) => {
        let va = a[col], vb = b[col];
        if (typeof va === 'string') va = va.toLowerCase();
        if (typeof vb === 'string') vb = vb.toLowerCase();
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ?  1 : -1;
        return 0;
      });

      table.querySelector('tbody').innerHTML = sorted.map(renderRowFn).join('');
    });
  });
}

function bindExpandableRows(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  // Förhindrar att samma tabell får flera click-events
  if (table.dataset.expandBound === 'true') return;
  table.dataset.expandBound = 'true';

  table.addEventListener('click', e => {
    const btn = e.target.closest('.expand-btn');

    if (!btn) return;
    if (!table.contains(btn)) return;

    e.preventDefault();

    const id = btn.dataset.expand;
    const expandedRow = document.getElementById(`expand-${id}`);

    if (!expandedRow) return;

    const isOpen = expandedRow.classList.contains('show');

    expandedRow.classList.toggle('show', !isOpen);
    btn.classList.toggle('open', !isOpen);

    btn.textContent = isOpen ? '▼' : '▲';
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
}

