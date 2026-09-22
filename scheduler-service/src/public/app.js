/**
 * Time Trigger Scheduler Dashboard Client
 * Coordinación en tiempo real y visualización del Time Trigger
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const countdownSecondsEl = document.getElementById('countdown-seconds');
  const countdownActionLabelEl = document.getElementById('countdown-action-label');
  const progressRing = document.getElementById('countdown-progress-ring');
  const schedulerStatusPill = document.getElementById('scheduler-status-pill');
  const schedulerStatusText = document.getElementById('scheduler-status-text');
  const liveClockEl = document.getElementById('live-clock');
  const metricTotalCountEl = document.getElementById('metric-total-count');
  const metricNextTimeEl = document.getElementById('metric-next-time');
  const metricWorkerStateEl = document.getElementById('metric-worker-state');
  const metricLastSyncEl = document.getElementById('metric-last-sync');
  const feedCountBadgeEl = document.getElementById('feed-count-badge');
  const jobsFeedListEl = document.getElementById('jobs-feed-list');
  const feedEmptyStateEl = document.getElementById('feed-empty-state');
  const footerConnectionTagEl = document.getElementById('footer-connection-tag');

  // Constantes del SVG Ring
  const RADIUS = 84;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // 527.787
  const INTERVAL_MS = 10000;

  if (progressRing) {
    progressRing.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    progressRing.style.strokeDashoffset = '0';
  }

  // Estado local
  let serverTargetTime = null;
  let serverOffsetMs = 0;
  let knownJobIds = new Set();
  let isConnected = false;

  // Actualizar reloj de encabezado
  function updateLiveClock() {
    const now = new Date();
    if (liveClockEl) {
      liveClockEl.textContent = now.toTimeString().split(' ')[0];
    }
    requestAnimationFrame(updateAnimationLoop);
  }

  // Bucle de animación suave (60fps) para el anillo y cuenta regresiva
  function updateAnimationLoop() {
    if (!serverTargetTime) {
      return;
    }

    const now = Date.now() + serverOffsetMs;
    const remainingMs = Math.max(0, serverTargetTime - now);
    const remainingSeconds = (remainingMs / 1000).toFixed(1);

    if (countdownSecondsEl) {
      countdownSecondsEl.textContent = remainingSeconds;
    }

    // Progreso del anillo (100% -> 0%)
    const fraction = Math.max(0, Math.min(1, remainingMs / INTERVAL_MS));
    const offset = CIRCUMFERENCE * (1 - fraction);
    if (progressRing) {
      progressRing.style.strokeDashoffset = offset;
    }

    if (countdownActionLabelEl) {
      if (remainingMs <= 400) {
        countdownActionLabelEl.textContent = '¡DISPARANDO TRABAJO!';
        countdownActionLabelEl.style.color = '#38bdf8';
        countdownActionLabelEl.style.fontWeight = '700';
      } else {
        countdownActionLabelEl.textContent = 'Próximo Disparo';
        countdownActionLabelEl.style.color = '';
        countdownActionLabelEl.style.fontWeight = '';
      }
    }
  }

  // Formateador de tiempo legible
  function formatTime(isoString) {
    if (!isoString) return '--:--:--';
    try {
      const date = new Date(isoString);
      return date.toTimeString().split(' ')[0];
    } catch {
      return isoString;
    }
  }

  // Calcular tiempo transcurrido relativo
  function timeAgo(isoString) {
    try {
      const diffSecs = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSecs < 1) return 'hace un instante';
      if (diffSecs < 60) return `hace ${diffSecs}s`;
      const mins = Math.floor(diffSecs / 60);
      return `hace ${mins}m ${diffSecs % 60}s`;
    } catch {
      return '';
    }
  }

  // Renderizar lista de jobs
  function renderJobs(recentJobs) {
    if (!recentJobs || recentJobs.length === 0) {
      if (feedEmptyStateEl) feedEmptyStateEl.style.display = 'flex';
      return;
    }

    if (feedEmptyStateEl) feedEmptyStateEl.style.display = 'none';

    // Construir elementos
    const currentRenderedCards = jobsFeedListEl.querySelectorAll('.job-item-card');
    const existingCardsMap = new Map();
    currentRenderedCards.forEach(card => {
      existingCardsMap.set(card.getAttribute('data-task-id'), card);
    });

    // Fragmento para agregar
    const fragment = document.createDocumentFragment();

    recentJobs.forEach(job => {
      const isNewlyDiscovered = !knownJobIds.has(job.taskId);
      if (isNewlyDiscovered) {
        knownJobIds.add(job.taskId);
      }

      const card = document.createElement('div');
      card.className = `job-item-card ${isNewlyDiscovered ? 'is-new' : ''}`;
      card.setAttribute('data-task-id', job.taskId);

      let statusBadgeHtml = '';
      if (job.status === 'CONFIRMED') {
        statusBadgeHtml = `
          <span class="job-status-tag status-confirmed">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            CONFIRMADO
          </span>`;
      } else if (job.status === 'PENDING') {
        statusBadgeHtml = `
          <span class="job-status-tag status-pending">
            <span class="status-dot"></span> EN PROCESO
          </span>`;
      } else {
        statusBadgeHtml = `
          <span class="job-status-tag status-failed">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            FALLIDO
          </span>`;
      }

      card.innerHTML = `
        <div class="job-id-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          ${job.taskId}
        </div>
        <div class="job-details">
          <div class="job-type">
            <span>Tipo:</span> <code>${job.type || 'GENERATE_REPORT'}</code>
          </div>
          <div class="job-desc">Time Trigger &bull; Despachado por Cron cada 10s</div>
        </div>
        <div class="job-timestamp">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>${formatTime(job.timestamp)} <small style="color:var(--text-subtle); margin-left:4px">(${timeAgo(job.timestamp)})</small></span>
        </div>
        <div>
          ${statusBadgeHtml}
        </div>
      `;

      fragment.appendChild(card);
    });

    jobsFeedListEl.innerHTML = '';
    jobsFeedListEl.appendChild(fragment);
  }

  // Polling de estado al backend
  async function fetchSchedulerStatus() {
    try {
      const response = await fetch('/api/scheduler/status');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Ajuste de offset de reloj cliente-servidor
      if (data.serverTime) {
        const clientNow = Date.now();
        const serverNow = new Date(data.serverTime).getTime();
        serverOffsetMs = serverNow - clientNow;
      }

      // Próxima ejecución
      if (data.nextExecutionTime) {
        serverTargetTime = new Date(data.nextExecutionTime).getTime();
        if (metricNextTimeEl) {
          metricNextTimeEl.textContent = formatTime(data.nextExecutionTime);
        }
      }

      // Métricas
      if (metricTotalCountEl) {
        metricTotalCountEl.textContent = data.totalJobsEmitted || 0;
      }

      if (feedCountBadgeEl) {
        const count = data.recentJobs ? data.recentJobs.length : 0;
        feedCountBadgeEl.textContent = `${count} ${count === 1 ? 'tarea registrada' : 'tareas registradas'}`;
      }

      // Estado de conexión
      if (!isConnected) {
        isConnected = true;
        if (schedulerStatusPill) {
          schedulerStatusPill.style.background = 'rgba(16, 185, 129, 0.1)';
          schedulerStatusPill.style.borderColor = 'rgba(16, 185, 129, 0.3)';
          schedulerStatusPill.style.color = '#34d399';
        }
        if (schedulerStatusText) {
          schedulerStatusText.textContent = 'CRON ACTIVO';
        }
        if (footerConnectionTagEl) {
          footerConnectionTagEl.innerHTML = '<span class="connection-ping"></span> Conectado a Scheduler API';
        }
      }

      // Renderizar jobs
      renderJobs(data.recentJobs || []);

      // Última sincronización
      if (metricLastSyncEl) {
        metricLastSyncEl.textContent = new Date().toTimeString().split(' ')[0];
      }

      // Verificar si hubo algún fallo reciente para estado del worker
      if (data.recentJobs && data.recentJobs.length > 0) {
        const latestJob = data.recentJobs[0];
        if (metricWorkerStateEl) {
          if (latestJob.status === 'CONFIRMED') {
            metricWorkerStateEl.textContent = 'ONLINE (200 OK)';
            metricWorkerStateEl.className = 'metric-value status-text-highlight';
          } else if (latestJob.status === 'FAILED') {
            metricWorkerStateEl.textContent = 'ERROR WORKER';
            metricWorkerStateEl.className = 'metric-value';
            metricWorkerStateEl.style.color = '#fb7185';
          }
        }
      }

    } catch (err) {
      isConnected = false;
      if (schedulerStatusPill) {
        schedulerStatusPill.style.background = 'rgba(244, 63, 94, 0.15)';
        schedulerStatusPill.style.borderColor = 'rgba(244, 63, 94, 0.3)';
        schedulerStatusPill.style.color = '#fb7185';
      }
      if (schedulerStatusText) {
        schedulerStatusText.textContent = 'RECONECTANDO...';
      }
      if (footerConnectionTagEl) {
        footerConnectionTagEl.innerHTML = '<span class="connection-ping" style="background-color:#fb7185"></span> Desconectado';
      }
    }
  }

  // Iniciar bucle de reloj y animación
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // Polling regular cada 1.2 segundos para mantener el feed fresco
  fetchSchedulerStatus();
  setInterval(fetchSchedulerStatus, 1200);
});
