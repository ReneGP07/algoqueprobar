const appState = {
  lineMode: 'line',
  demoTick: 0,
  alertsOpen: false,
};

const kpiData = [
  { id: 'oee', label: 'OEE', value: '78.6%', change: '+6.4 pp vs. turno anterior', tone: 'good', points: [28, 34, 31, 42, 39, 45, 41, 43, 36, 38, 47, 41, 50, 46, 52] },
  { id: 'availability', label: 'Disponibilidad', value: '92.3%', change: '+3.1 pp vs. turno anterior', tone: 'good', points: [62, 64, 63, 66, 65, 67, 63, 64, 66, 68, 67, 69, 66, 70, 72] },
  { id: 'quality', label: 'Calidad', value: '96.4%', change: '+1.8 pp vs. turno anterior', tone: 'good', points: [84, 85, 84, 87, 86, 88, 87, 89, 88, 90, 91, 90, 92, 91, 93] },
  { id: 'cycle', label: 'Tiempo de ciclo prom.', value: '42.6 s', change: '-5.3 s vs. turno anterior', tone: 'neutral', points: [52, 49, 47, 46, 44, 45, 43, 42, 41, 44, 43, 42, 40, 41, 39] },
  { id: 'alerts', label: 'Alertas activas', value: '7', change: 'Críticas: 2   Mayores: 5', tone: 'bad', points: [2, 4, 3, 6, 4, 3, 5, 6, 3, 4, 5, 3, 2, 4, 3] },
];

const stations = [
  { id: '01', name: 'Carga', utilization: 68, status: 'good', icon: '▣' },
  { id: '02', name: 'Montaje', utilization: 72, status: 'good', icon: '⚙' },
  { id: '03', name: 'Guía', utilization: 61, status: 'good', icon: '◇' },
  { id: '04', name: 'Prensa', utilization: 74, status: 'good', icon: '⌁' },
  { id: '05', name: 'Atornillado', utilization: 96, status: 'bad', icon: '⚠' },
  { id: '06', name: 'Torque', utilization: 83, status: 'warn', icon: '◇' },
  { id: '07', name: 'Inspección', utilization: 58, status: 'good', icon: '◎' },
  { id: '08', name: 'Salida', utilization: 62, status: 'good', icon: '▣' },
];

const alerts = [
  { severity: 'Crítica', tone: 'critical', text: 'Prensa #12 - Vibración alta en motor', time: 'Hace 5 min' },
  { severity: 'Mayor', tone: 'major', text: 'Transportador #3 - Atasco detectado', time: 'Hace 12 min' },
  { severity: 'Mayor', tone: 'major', text: 'Soldadora #7 - Temperatura elevada', time: 'Hace 24 min' },
  { severity: 'Mayor', tone: 'major', text: 'Estación 05 - Tiempo de ciclo fuera de objetivo', time: 'Hace 31 min' },
];

const recommendations = [
  'Redistribuir tareas de la estación 05 durante el turno actual.',
  'Agregar operador de apoyo en estación 05 si la carga se mantiene arriba de 90%.',
  'Validar herramienta de atornillado y torque programado.',
  'Revisar microparos de los últimos 15 minutos.',
  'Comparar desempeño contra turno anterior antes de cambiar estándar de operación.'
];

function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function createSparkline(points, tone = 'good') {
  const width = 180;
  const height = 36;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const coords = points.map((point, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((point - min) / range) * (height - 7) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const color = tone === 'bad' ? '#df5d56' : tone === 'neutral' ? '#5ca7d9' : '#58c56f';
  const fillId = `fill-${Math.random().toString(36).slice(2)}`;
  return `
    <svg class="sparkline" viewBox="0 0 ${width} ${height}" aria-hidden="true">
      <defs>
        <linearGradient id="${fillId}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.28" />
          <stop offset="100%" stop-color="${color}" stop-opacity="0" />
        </linearGradient>
      </defs>
      <polyline points="${coords}" fill="none" stroke="${color}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" />
      <polygon points="0,${height} ${coords} ${width},${height}" fill="url(#${fillId})" />
    </svg>
  `;
}

function renderKpis() {
  const container = qs('[data-kpis]');
  if (!container) return;
  container.innerHTML = kpiData.map(kpi => `
    <article class="card kpi-card" data-kpi="${kpi.id}">
      <div class="kpi-label">${kpi.label}</div>
      <div class="kpi-value ${kpi.tone === 'good' ? 'good' : kpi.tone === 'bad' ? 'bad' : ''}">${kpi.value}</div>
      <div class="kpi-change ${kpi.tone === 'good' ? 'good' : kpi.tone === 'bad' ? 'bad' : ''}">${kpi.change}</div>
      ${createSparkline(kpi.points, kpi.tone)}
    </article>
  `).join('');
}

function renderStations() {
  const container = qs('[data-stations]');
  if (!container) return;
  container.innerHTML = stations.map(station => {
    const heatClass = appState.lineMode === 'heatmap' ? `heatmap ${station.status}` : station.status;
    return `
      <div class="station ${heatClass}" title="Estación ${station.id}: ${station.utilization}% de utilización">
        <div class="station-number">${station.id}</div>
        <div class="station-machine">${station.icon}</div>
        <div class="station-load">${station.utilization}%</div>
      </div>
    `;
  }).join('');
}

function renderUtilizationChart() {
  const container = qs('[data-utilization-bars]');
  if (!container) return;
  container.innerHTML = `<div class="target-line" aria-hidden="true"></div>` + stations.map(station => `
    <div class="bar-wrap">
      <div class="bar-value">${station.utilization}%</div>
      <div class="bar ${station.status === 'bad' ? 'bad' : station.status === 'warn' ? 'warn' : ''}" style="height:${station.utilization}%;"></div>
      <div class="bar-label">${station.id}</div>
    </div>
  `).join('');
}

function renderAlerts() {
  qsa('[data-alert-list]').forEach(container => {
    const limit = Number(container.dataset.limit || alerts.length);
    container.innerHTML = alerts.slice(0, limit).map(alert => `
      <div class="alert-row">
        <span class="alert-sev ${alert.tone}">${alert.tone === 'critical' ? '●' : '▲'} ${alert.severity}</span>
        <span>${alert.text}</span>
        <time>${alert.time}</time>
      </div>
    `).join('');
  });
}

function renderRecommendations() {
  qsa('[data-recommendations]').forEach(container => {
    const short = container.dataset.short === 'true';
    const items = short ? recommendations.slice(0, 2) : recommendations;
    container.innerHTML = items.map(item => `
      <div class="action-row">
        <span class="checkbox">✓</span>
        <span>${item}</span>
        ${short ? '' : '<span></span>'}
      </div>
    `).join('');
  });
}

function setupLineMode() {
  qsa('[data-line-mode]').forEach(button => {
    button.addEventListener('click', () => {
      appState.lineMode = button.dataset.lineMode;
      qsa('[data-line-mode]').forEach(btn => btn.classList.toggle('active', btn.dataset.lineMode === appState.lineMode));
      renderStations();
    });
  });
}

function setupSidebar() {
  const btn = qs('[data-collapse-sidebar]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-collapsed');
  });
}

function setupChatDemo() {
  const form = qs('[data-chat-form]');
  const input = qs('[data-chat-input]');
  const list = qs('[data-chat-list]');
  if (!form || !input || !list) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    list.insertAdjacentHTML('beforeend', `
      <div class="message user">
        <div class="message-meta"><span>Técnico</span><time>${now}</time></div>
        <p>${escapeHtml(text)}</p>
      </div>
    `);
    input.value = '';

    window.setTimeout(() => {
      list.insertAdjacentHTML('beforeend', `
        <div class="message ai">
          <div class="message-meta"><span>Asistente IA</span><time>${now}</time></div>
          <p>Demo visual: en una versión conectada, aquí se consultarían historial, SOP y datos de sensor. Para este prototipo se muestra una respuesta simulada y segura.</p>
        </div>
      `);
      list.scrollTop = list.scrollHeight;
    }, 350);
  });
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function setupRecommendationsModal() {
  const modal = qs('[data-modal]');
  const openers = qsa('[data-open-recommendations]');
  const closers = qsa('[data-close-modal]');
  if (!modal) return;

  openers.forEach(opener => opener.addEventListener('click', () => modal.classList.add('open')));
  closers.forEach(closer => closer.addEventListener('click', () => modal.classList.remove('open')));
  modal.addEventListener('click', event => {
    if (event.target === modal) modal.classList.remove('open');
  });
}

function setupNotifications() {
  const btn = qs('[data-toggle-notifications]');
  const menu = qs('[data-notifications-menu]');
  if (!btn || !menu) return;
  btn.addEventListener('click', event => {
    event.stopPropagation();
    appState.alertsOpen = !appState.alertsOpen;
    menu.classList.toggle('open', appState.alertsOpen);
  });
  document.addEventListener('click', () => {
    appState.alertsOpen = false;
    menu.classList.remove('open');
  });
}

function setupDemoOperation() {
  const btn = qs('[data-run-demo]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    appState.demoTick += 1;
    const critical = appState.demoTick % 2 === 1;
    const stationFive = stations.find(station => station.id === '05');
    if (stationFive) {
      stationFive.utilization = critical ? 96 : 78;
      stationFive.status = critical ? 'bad' : 'warn';
    }
    const statusText = qs('[data-operation-status-text]');
    const statusDot = qs('[data-operation-status-dot]');
    if (statusText && statusDot) {
      statusText.textContent = critical ? 'Atención requerida' : 'Operación estable';
      statusDot.className = `status-dot ${critical ? 'warning' : ''}`;
    }
    renderStations();
    renderUtilizationChart();
  });
}

function updateClock() {
  qsa('[data-clock]').forEach(el => {
    el.textContent = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  });
}

function init() {
  renderKpis();
  renderStations();
  renderUtilizationChart();
  renderAlerts();
  renderRecommendations();
  setupLineMode();
  setupSidebar();
  setupChatDemo();
  setupRecommendationsModal();
  setupNotifications();
  setupDemoOperation();
  updateClock();
  window.setInterval(updateClock, 60000);
}

document.addEventListener('DOMContentLoaded', init);
