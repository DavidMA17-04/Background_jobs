/**
 * Worker Service Dashboard - Client Application
 * Polling, reactive UI transitions, and job simulation
 */

// DOM Elements
const workerStateCard = document.getElementById('worker-state-card');
const stateBadge = document.getElementById('state-badge');
const stateBadgeText = document.getElementById('state-badge-text');
const heroTitle = document.getElementById('hero-title');
const heroDesc = document.getElementById('hero-desc');
const processingDetails = document.getElementById('processing-details');
const activeTaskId = document.getElementById('active-task-id');
const progressBar = document.getElementById('progress-bar');
const heroFooterNote = document.getElementById('hero-footer-note');
const manualTriggerBtn = document.getElementById('manual-trigger-btn');

const totalProcessedCount = document.getElementById('total-processed-count');
const serviceStatus = document.getElementById('service-status');
const liveIndicator = document.getElementById('live-indicator');
const tableCount = document.getElementById('table-count');
const jobsTableBody = document.getElementById('jobs-table-body');
const emptyRow = document.getElementById('empty-row');

// Local State
let knownJobIds = new Set();
let isPolling = false;
let isCurrentlyProcessing = false;
let progressInterval = null;

// Format ISO date to local readable time (HH:mm:ss)
function formatTime(isoString) {
  if (!isoString) return '--:--:--';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch (e) {
    return isoString;
  }
}

// Update the Reactive Processing Hero Card
function updateHeroState(isProcessing, currentTaskId) {
  if (isProcessing) {
    if (!isCurrentlyProcessing) {
      isCurrentlyProcessing = true;
      workerStateCard.classList.add('processing');
      stateBadge.className = 'state-badge state-processing';
      stateBadgeText.textContent = '⚡ PROCESANDO REPORTE...';
      heroTitle.textContent = 'Generando Reporte en Segundo Plano...';
      heroDesc.textContent = 'Simulando procesamiento asíncrono y consolidación de datos (1.000 ms)...';
      processingDetails.classList.remove('hidden');
      activeTaskId.textContent = currentTaskId || 'en ejecución';
      heroFooterNote.textContent = 'Procesamiento en progreso para este job';

      // Animate progress bar across 1s
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      void progressBar.offsetWidth; // Force reflow
      progressBar.style.transition = 'width 1000ms ease-out';
      progressBar.style.width = '100%';
    }
  } else {
    if (isCurrentlyProcessing || !isCurrentlyProcessing) {
      isCurrentlyProcessing = false;
      workerStateCard.classList.remove('processing');
      stateBadge.className = 'state-badge state-idle';
      stateBadgeText.textContent = '● EN ESPERA (IDLE)';
      heroTitle.textContent = 'Worker Listo para Procesar';
      heroDesc.textContent = 'Esperando invocación HTTP del Scheduler cada 10 segundos o solicitudes manuales para generar reportes...';
      processingDetails.classList.add('hidden');
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      heroFooterNote.textContent = 'Estado síncrono simulado con retardo de 1 segundo por reporte';
    }
  }
}

// Render the Table of Recent Jobs
function renderRecentJobs(recentJobs) {
  if (!recentJobs || recentJobs.length === 0) {
    if (emptyRow) {
      jobsTableBody.innerHTML = '';
      jobsTableBody.appendChild(emptyRow);
    }
    tableCount.textContent = '0';
    return;
  }

  tableCount.textContent = recentJobs.length.toString();

  // Create document fragment
  const fragment = document.createDocumentFragment();

  recentJobs.forEach((job) => {
    const isNew = !knownJobIds.has(job.taskId);
    knownJobIds.add(job.taskId);

    const tr = document.createElement('tr');
    if (isNew) {
      tr.classList.add('new-row');
    }

    tr.innerHTML = `
      <td>
        <span class="status-pill-table status-processed">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          PROCESSED
        </span>
      </td>
      <td><span class="id-badge">${escapeHtml(job.taskId)}</span></td>
      <td><span class="type-badge">${escapeHtml(job.type || 'REPORT_GENERATION')}</span></td>
      <td><span class="time-text">${formatTime(job.receivedAt)}</span></td>
      <td><span class="time-text">${formatTime(job.processedAt)}</span></td>
      <td><span class="duration-chip">${job.durationMs || 1000} ms</span></td>
    `;

    fragment.appendChild(tr);
  });

  jobsTableBody.innerHTML = '';
  jobsTableBody.appendChild(fragment);
}

// Basic HTML escaping
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Main Polling Loop
async function fetchRecentState() {
  if (isPolling) return;
  isPolling = true;

  try {
    const response = await fetch('/api/jobs/recent', {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Update Connection & Service Status
    serviceStatus.textContent = data.status || 'ONLINE';
    totalProcessedCount.textContent = data.totalProcessed || 0;

    // Update Hero Card
    updateHeroState(Boolean(data.isProcessing), data.currentTaskId);

    // Update Table
    renderRecentJobs(data.recentJobs || []);

  } catch (error) {
    console.warn('Aviso: no se pudo obtener el estado del Worker:', error.message);
    serviceStatus.textContent = 'CONECTANDO...';
  } finally {
    isPolling = false;
  }
}

// Manual Job Trigger
async function triggerManualJob() {
  const originalText = manualTriggerBtn.innerHTML;
  manualTriggerBtn.disabled = true;
  manualTriggerBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="pulse-dot" style="display:inline-block;"></svg>
    Enviando...
  `;

  try {
    const payload = {
      taskId: `task-manual-${Date.now().toString().slice(-6)}`,
      type: 'MANUAL_TRIGGER',
      timestamp: new Date().toISOString(),
    };

    const response = await fetch('/api/jobs/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error en servidor: ${response.status}`);
    }

    // Refresh immediately to capture processing or result
    await fetchRecentState();
  } catch (err) {
    alert('Error al enviar job manual: ' + err.message);
  } finally {
    manualTriggerBtn.disabled = false;
    manualTriggerBtn.innerHTML = originalText;
  }
}

// Event Listeners
manualTriggerBtn.addEventListener('click', triggerManualJob);

// Start Polling (every 1000ms)
fetchRecentState();
setInterval(fetchRecentState, 1000);
