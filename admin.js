(function () {
  const services = window.cqFirebase;
  const list = document.getElementById('admin-list');
  const tableContainer = document.getElementById('admin-table-container');
  const tableBody = document.getElementById('admin-table-body');
  const message = document.getElementById('admin-message');
  const searchInput = document.getElementById('admin-search');
  const statusFilterSelect = document.getElementById('status-filter');
  const jobFilterSelect = document.getElementById('job-filter');
  const sortFilterSelect = document.getElementById('sort-filter');
  const btnViewCards = document.getElementById('btn-view-cards');
  const btnViewTable = document.getElementById('btn-view-table');
  const btnRefresh = document.getElementById('btn-refresh');
  const btnExportCsv = document.getElementById('btn-export-csv');

  const statusLabels = {
    recebida: 'Recebida',
    triagem: 'Em triagem',
    entrevista: 'Entrevista',
    aprovada: 'Aprovada',
    recusada: 'Encerrada'
  };

  let applications = [];
  let currentAdminUser = null;
  let activeView = localStorage.getItem('cq_admin_view') || 'cards';
  let searchQuery = '';

  // Toast Helper
  function showToast(text, type = 'success', duration = 4000) {
    const toast = document.getElementById('portal-toast');
    const toastText = document.getElementById('toast-text');
    const toastIcon = document.getElementById('toast-icon');
    if (!toast || !toastText) return;

    toast.className = `portal-toast portal-toast-${type} show`;
    toastText.textContent = text;
    if (toastIcon) {
      toastIcon.className = type === 'success'
        ? 'fa-solid fa-circle-check'
        : (type === 'error' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-info');
    }

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  function showMessage(text, isError = true) {
    if (!message) return;
    message.textContent = text;
    message.className = 'portal-alert ' + (isError ? 'portal-alert-danger' : 'portal-alert-success');
    message.style.display = 'block';
  }

  function formatDate(value) {
    if (!value) return 'Data não informada';
    if (value.toDate) {
      return value.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return 'Recente';
  }

  function formatDateTime(value) {
    if (!value) return 'Data não informada';
    if (value.toDate) {
      return value.toDate().toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    }
    return 'Recente';
  }

  function buildWhatsAppLink(phone, candidateName, jobTitle) {
    if (!phone) return '#';
    let clean = phone.replace(/\D/g, '');
    if (!clean) return '#';
    if (clean.length === 10 || clean.length === 11) {
      clean = '55' + clean;
    }
    const firstName = (candidateName || 'Candidato').trim().split(' ')[0];
    const text = encodeURIComponent(
      `Olá ${firstName}, tudo bem? Aqui é da equipe de Recursos Humanos da Chiquinha Transportes. Entramos em contato referente à sua candidatura para a vaga de ${jobTitle || 'nosso processo seletivo'}.`
    );
    return `https://wa.me/${clean}?text=${text}`;
  }

  // Atualizar contadores do Dashboard KPI
  function updateKPIs() {
    const counts = { total: 0, recebida: 0, triagem: 0, entrevista: 0, aprovada: 0, recusada: 0 };
    applications.forEach(item => {
      const app = item.data();
      const status = app.status || 'recebida';
      counts.total += 1;
      if (counts[status] !== undefined) counts[status] += 1;
    });

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('stat-total', counts.total);
    setEl('stat-recebida', counts.recebida);
    setEl('stat-triagem', counts.triagem);
    setEl('stat-entrevista', counts.entrevista);
    setEl('stat-aprovada', counts.aprovada);
    setEl('stat-recusada', counts.recusada);
  }

  // Preencher seletor dinâmico de cargos
  function populateJobFilter() {
    if (!jobFilterSelect) return;
    const currentVal = jobFilterSelect.value;
    const jobs = new Set();
    applications.forEach(item => {
      const app = item.data();
      if (app.jobTitle) jobs.add(app.jobTitle);
    });

    jobFilterSelect.innerHTML = '<option value="todos">Todos os cargos</option>';
    Array.from(jobs).sort().forEach(job => {
      const opt = document.createElement('option');
      opt.value = job;
      opt.textContent = job;
      if (job === currentVal) opt.selected = true;
      jobFilterSelect.appendChild(opt);
    });
  }

  // Filtragem e ordenação dos dados
  function getFilteredApplications() {
    const statusFilter = statusFilterSelect ? statusFilterSelect.value : 'todos';
    const jobFilter = jobFilterSelect ? jobFilterSelect.value : 'todos';
    const sortVal = sortFilterSelect ? sortFilterSelect.value : 'recent';

    let result = applications.filter(item => {
      const app = item.data();
      const cand = app.candidate || {};
      const status = app.status || 'recebida';
      const job = app.jobTitle || '';

      const matchStatus = (statusFilter === 'todos' || status === statusFilter);
      const matchJob = (jobFilter === 'todos' || job === jobFilter);

      let matchSearch = true;
      if (searchQuery) {
        const fullSearch = `${job} ${cand.name || ''} ${cand.email || ''} ${cand.phone || ''} ${cand.city || ''} ${cand.state || ''} ${cand.cnh || ''}`.toLowerCase();
        matchSearch = fullSearch.includes(searchQuery);
      }

      return matchStatus && matchJob && matchSearch;
    });

    // Ordenação
    result.sort((a, b) => {
      const appA = a.data();
      const appB = b.data();
      if (sortVal === 'oldest') {
        return (appA.createdAt?.seconds || 0) - (appB.createdAt?.seconds || 0);
      } else if (sortVal === 'name') {
        return (appA.candidate?.name || '').localeCompare(appB.candidate?.name || '');
      }
      // default: 'recent'
      return (appB.createdAt?.seconds || 0) - (appA.createdAt?.seconds || 0);
    });

    return result;
  }

  // Renderizador principal
  function render() {
    const filtered = getFilteredApplications();

    // Atualizar labels de contagem
    const countLabel = document.getElementById('total-count-label');
    const subLabel = document.getElementById('filtered-count-sub');
    if (countLabel) countLabel.textContent = `${filtered.length} candidatura(s) encontrada(s)`;
    if (subLabel) {
      subLabel.textContent = filtered.length === applications.length
        ? 'Exibindo todas as candidaturas cadastradas'
        : `Filtradas de um total de ${applications.length} registros`;
    }

    if (!filtered.length) {
      const emptyHtml = `
        <div class="empty-portal">
          <i class="fa-regular fa-folder-open"></i>
          <h2>Nenhuma candidatura encontrada</h2>
          <p>Tente ajustar os filtros de busca ou aguarde novos candidatos se inscreverem.</p>
        </div>
      `;
      if (list) list.innerHTML = emptyHtml;
      if (tableBody) tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem;">Nenhuma candidatura corresponde aos filtros selecionados.</td></tr>`;
      return;
    }

    renderCards(filtered);
    renderTable(filtered);
  }

  // Renderizar Cards
  function renderCards(items) {
    if (!list) return;

    list.innerHTML = items.map(item => {
      const app = item.data();
      const cand = app.candidate || {};
      const status = app.status || 'recebida';
      const waLink = buildWhatsAppLink(cand.phone, cand.name, app.jobTitle);
      const emailLink = cand.email ? `mailto:${cand.email}?subject=Processo Seletivo - ${encodeURIComponent(app.jobTitle || 'Chiquinha Transportes')}` : '#';
      const cnhText = cand.cnh ? `CNH: ${cand.cnh}` : 'CNH: Não informada';
      const locationText = cand.city ? `${cand.city}${cand.state ? ' - ' + cand.state : ''}` : 'Local não informado';
      const resumeName = app.resume?.name || 'Enviado por e-mail';

      return `
        <article class="application-card" data-id="${item.id}">
          <div>
            <!-- Header do Card -->
            <div class="application-card-header">
              <div class="application-card-header-info">
                <span class="application-job-tag">
                  <i class="fa-solid fa-briefcase"></i> ${app.jobTitle || 'Banco de Talentos'}
                </span>
                <h2>${cand.name || 'Candidato'}</h2>
                <span class="application-id">
                  <i class="fa-regular fa-clock"></i> Inscrito em ${formatDate(app.createdAt)}
                </span>
              </div>
              <span class="status-badge status-${status}">
                <i class="fa-solid fa-circle" style="font-size: 0.5rem;"></i> ${statusLabels[status] || status}
              </span>
            </div>

            <!-- Tags / Metadados -->
            <div class="candidate-pills">
              <span class="meta-pill pill-cnh">
                <i class="fa-solid fa-id-card"></i> ${cnhText}
              </span>
              <span class="meta-pill">
                <i class="fa-solid fa-location-dot"></i> ${locationText}
              </span>
            </div>

            <!-- Detalhes de Contato -->
            <div class="application-details">
              <div><strong><i class="fa-regular fa-envelope"></i> E-mail:</strong> ${cand.email || 'Não informado'}</div>
              <div><strong><i class="fa-solid fa-phone"></i> Telefone:</strong> ${cand.phone || 'Não informado'}</div>
              <div><strong><i class="fa-regular fa-file-lines"></i> Currículo:</strong> ${resumeName}</div>
            </div>

            <!-- Apresentação breve do candidato, se houver -->
            ${cand.notes ? `<div class="candidate-notes-quote" title="Mensagem do candidato">"${cand.notes}"</div>` : ''}

            <!-- Botões de Ação Rápida do RH -->
            <div class="rh-quick-actions">
              ${cand.phone ? `
                <a href="${waLink}" target="_blank" rel="noopener" class="btn-contact btn-whatsapp" title="Abrir conversa no WhatsApp com o candidato">
                  <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </a>
              ` : ''}
              ${cand.email ? `
                <a href="${emailLink}" class="btn-contact btn-email-action" title="Enviar e-mail para o candidato">
                  <i class="fa-regular fa-envelope"></i> E-mail
                </a>
              ` : ''}
              <button type="button" class="btn-dossier btn-open-dossier" data-id="${item.id}" title="Ver ficha completa e histórico">
                <i class="fa-solid fa-magnifying-glass-plus"></i> Ficha
              </button>
            </div>
          </div>

          <!-- Rodapé de Gestão do Status e Notas -->
          <div class="application-card-footer">
            <select class="admin-status" aria-label="Status da candidatura">
              <option value="recebida" ${status === 'recebida' ? 'selected' : ''}>Candidatura Recebida</option>
              <option value="triagem" ${status === 'triagem' ? 'selected' : ''}>Em triagem</option>
              <option value="entrevista" ${status === 'entrevista' ? 'selected' : ''}>Entrevista Agendada</option>
              <option value="aprovada" ${status === 'aprovada' ? 'selected' : ''}>Aprovada</option>
              <option value="recusada" ${status === 'recusada' ? 'selected' : ''}>Processo Encerrado</option>
            </select>

            <textarea class="admin-note" placeholder="Orientação interna ou feedback visível para o candidato...">${app.adminNote || ''}</textarea>

            <div class="card-footer-buttons">
              <button class="btn btn-primary admin-update" type="button">
                <i class="fa-solid fa-floppy-disk"></i> Salvar
              </button>
              <button class="btn-delete-cand" type="button" title="Excluir esta candidatura permanentemente" data-id="${item.id}" data-name="${cand.name || 'Candidato'}">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    bindCardEvents();
  }

  // Renderizar Tabela
  function renderTable(items) {
    if (!tableBody) return;

    tableBody.innerHTML = items.map(item => {
      const app = item.data();
      const cand = app.candidate || {};
      const status = app.status || 'recebida';
      const waLink = buildWhatsAppLink(cand.phone, cand.name, app.jobTitle);
      const cnhText = cand.cnh || 'N/I';
      const locationText = cand.city ? `${cand.city}${cand.state ? '/' + cand.state : ''}` : '-';

      return `
        <tr data-id="${item.id}">
          <td>
            <span class="cand-name-cell">${cand.name || 'Candidato'}</span>
            <span class="cand-email-cell">${cand.email || ''} · ${cand.phone || ''}</span>
          </td>
          <td><strong>${app.jobTitle || 'Geral'}</strong></td>
          <td><span class="meta-pill pill-cnh" style="margin:0;">${cnhText}</span></td>
          <td>${locationText}</td>
          <td>${formatDate(app.createdAt)}</td>
          <td>
            <span class="status-badge status-${status}">
              ${statusLabels[status] || status}
            </span>
          </td>
          <td style="text-align: right; white-space: nowrap;">
            ${cand.phone ? `<a href="${waLink}" target="_blank" rel="noopener" class="btn-contact btn-whatsapp" style="display:inline-flex; padding: 0.35rem 0.65rem;" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>` : ''}
            <button type="button" class="btn-dossier btn-open-dossier" data-id="${item.id}" style="display:inline-flex; padding: 0.35rem 0.65rem;" title="Ver Ficha"><i class="fa-solid fa-eye"></i></button>
            <button type="button" class="btn-delete-cand" data-id="${item.id}" data-name="${cand.name || 'Candidato'}" style="display:inline-flex; padding: 0.35rem 0.65rem;" title="Excluir"><i class="fa-regular fa-trash-can"></i></button>
          </td>
        </tr>
      `;
    }).join('');

    bindTableEvents();
  }

  // Eventos dos Cards
  function bindCardEvents() {
    // Salvar Atualização do Card
    list.querySelectorAll('.admin-update').forEach(button => {
      button.addEventListener('click', async event => {
        const card = event.currentTarget.closest('.application-card');
        const docId = card.dataset.id;
        const newStatus = card.querySelector('.admin-status').value;
        const newNote = card.querySelector('.admin-note').value.trim();

        button.disabled = true;
        const originalHtml = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

        try {
          await services.db.collection('applications').doc(docId).update({
            status: newStatus,
            statusLabel: statusLabels[newStatus] || newStatus,
            adminNote: newNote,
            updatedAt: services.serverTimestamp()
          });

          // Atualizar localmente no array sem reload forçado
          const target = applications.find(x => x.id === docId);
          if (target) {
            const data = target.data();
            data.status = newStatus;
            data.statusLabel = statusLabels[newStatus] || newStatus;
            data.adminNote = newNote;
          }

          updateKPIs();
          render();
          showToast('Candidatura atualizada com sucesso!', 'success');
        } catch (error) {
          console.error('Erro ao atualizar candidatura:', error);
          showToast('Não foi possível salvar esta atualização.', 'error');
        } finally {
          button.disabled = false;
          button.innerHTML = originalHtml;
        }
      });
    });

    // Abrir Modal de Dossiê
    list.querySelectorAll('.btn-open-dossier').forEach(btn => {
      btn.addEventListener('click', () => openDossierModal(btn.dataset.id));
    });

    // Excluir Candidatura
    list.querySelectorAll('.btn-delete-cand').forEach(btn => {
      btn.addEventListener('click', () => handleDeleteCandidate(btn.dataset.id, btn.dataset.name));
    });
  }

  // Eventos da Tabela
  function bindTableEvents() {
    if (!tableBody) return;
    tableBody.querySelectorAll('.btn-open-dossier').forEach(btn => {
      btn.addEventListener('click', () => openDossierModal(btn.dataset.id));
    });
    tableBody.querySelectorAll('.btn-delete-cand').forEach(btn => {
      btn.addEventListener('click', () => handleDeleteCandidate(btn.dataset.id, btn.dataset.name));
    });
  }

  // Ação de Excluir Candidatura
  async function handleDeleteCandidate(docId, candidateName) {
    const confirmed = window.confirm(
      `Atenção: Tem certeza de que deseja excluir permanentemente a candidatura de "${candidateName}"?\n\nEsta ação removerá o registro do banco de dados.`
    );
    if (!confirmed) return;

    try {
      await services.db.collection('applications').doc(docId).delete();
      applications = applications.filter(x => x.id !== docId);
      updateKPIs();
      populateJobFilter();
      render();
      closeDossierModal();
      showToast(`Candidatura de ${candidateName} excluída com sucesso.`, 'success');
    } catch (error) {
      console.error('Erro ao excluir:', error);
      showToast('Falha ao excluir a candidatura. Verifique suas permissões.', 'error');
    }
  }

  // Modal de Dossiê Completo
  const dossierModal = document.getElementById('candidate-detail-modal');
  const closeDossierBtn = document.getElementById('close-detail-modal-btn');
  const formDossier = document.getElementById('form-modal-dossier');
  const btnDeleteDossier = document.getElementById('btn-delete-from-modal');

  function openDossierModal(docId) {
    const item = applications.find(x => x.id === docId);
    if (!item || !dossierModal) return;
    const app = item.data();
    const cand = app.candidate || {};
    const status = app.status || 'recebida';

    document.getElementById('modal-app-id').value = docId;
    document.getElementById('modal-dossier-job').textContent = app.jobTitle || 'BANCO DE TALENTOS';
    const badge = document.getElementById('modal-dossier-badge');
    badge.className = `status-badge status-${status}`;
    badge.textContent = statusLabels[status] || status;

    document.getElementById('modal-dossier-name').textContent = cand.name || 'Candidato sem nome';
    document.getElementById('modal-dossier-date').textContent = `Inscrição realizada em: ${formatDateTime(app.createdAt)}`;
    document.getElementById('modal-dossier-email').textContent = cand.email || 'Não informado';
    document.getElementById('modal-dossier-phone').textContent = cand.phone || 'Não informado';
    document.getElementById('modal-dossier-cnh').textContent = cand.cnh ? `Categoria ${cand.cnh}` : 'Não informada / Sem exigência';
    document.getElementById('modal-dossier-city').textContent = cand.city ? `${cand.city}${cand.state ? ' - ' + cand.state : ''}` : 'Não informada';
    document.getElementById('modal-dossier-resume').textContent = app.resume?.name ? `Arquivo: ${app.resume.name} (Entregue via Resend/RH)` : 'Enviado por e-mail ao RH';
    document.getElementById('modal-dossier-notes').textContent = cand.notes || 'Nenhuma observação informada pelo candidato.';

    // Links de Contato
    const waLink = document.getElementById('modal-whatsapp-link');
    if (cand.phone) {
      waLink.href = buildWhatsAppLink(cand.phone, cand.name, app.jobTitle);
      waLink.style.display = 'inline-flex';
    } else {
      waLink.style.display = 'none';
    }

    const emailLink = document.getElementById('modal-email-link');
    if (cand.email) {
      emailLink.href = `mailto:${cand.email}?subject=Processo Seletivo - ${encodeURIComponent(app.jobTitle || 'Chiquinha Transportes')}`;
      emailLink.style.display = 'inline-flex';
    } else {
      emailLink.style.display = 'none';
    }

    // Campos de Edição
    document.getElementById('modal-select-status').value = status;
    document.getElementById('modal-textarea-note').value = app.adminNote || '';

    // Botão de Excluir dentro do Modal
    if (btnDeleteDossier) {
      btnDeleteDossier.onclick = () => handleDeleteCandidate(docId, cand.name || 'Candidato');
    }

    dossierModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDossierModal() {
    if (!dossierModal) return;
    dossierModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeDossierBtn) closeDossierBtn.addEventListener('click', closeDossierModal);
  window.addEventListener('click', e => { if (e.target === dossierModal) closeDossierModal(); });

  if (formDossier) {
    formDossier.addEventListener('submit', async e => {
      e.preventDefault();
      const docId = document.getElementById('modal-app-id').value;
      const newStatus = document.getElementById('modal-select-status').value;
      const newNote = document.getElementById('modal-textarea-note').value.trim();
      const saveBtn = document.getElementById('btn-save-dossier');

      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

      try {
        await services.db.collection('applications').doc(docId).update({
          status: newStatus,
          statusLabel: statusLabels[newStatus] || newStatus,
          adminNote: newNote,
          updatedAt: services.serverTimestamp()
        });

        const target = applications.find(x => x.id === docId);
        if (target) {
          const data = target.data();
          data.status = newStatus;
          data.statusLabel = statusLabels[newStatus] || newStatus;
          data.adminNote = newNote;
        }

        updateKPIs();
        render();
        closeDossierModal();
        showToast('Ficha do candidato salva com sucesso!', 'success');
      } catch (err) {
        console.error('Erro ao salvar no modal:', err);
        showToast('Não foi possível salvar as alterações.', 'error');
      } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Salvar Alterações';
      }
    });
  }

  // Exportar para CSV / Excel
  function exportToCSV() {
    if (!applications.length) {
      showToast('Nenhuma candidatura para exportar.', 'error');
      return;
    }

    const headers = [
      'ID Protocolo',
      'Data de Inscrição',
      'Vaga / Cargo',
      'Nome do Candidato',
      'E-mail',
      'Telefone',
      'Cidade',
      'Estado',
      'CNH',
      'Status Atual',
      'Nota Interna do RH',
      'Mensagem do Candidato'
    ];

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""').replace(/\r?\n/g, ' ');
      return `"${clean}"`;
    };

    const rows = applications.map(item => {
      const app = item.data();
      const cand = app.candidate || {};
      return [
        escapeCsv(item.id),
        escapeCsv(formatDateTime(app.createdAt)),
        escapeCsv(app.jobTitle || 'Banco de Talentos'),
        escapeCsv(cand.name || ''),
        escapeCsv(cand.email || ''),
        escapeCsv(cand.phone || ''),
        escapeCsv(cand.city || ''),
        escapeCsv(cand.state || ''),
        escapeCsv(cand.cnh || 'Não informada'),
        escapeCsv(statusLabels[app.status] || app.status || 'Recebida'),
        escapeCsv(app.adminNote || ''),
        escapeCsv(cand.notes || '')
      ].join(';');
    });

    const csvContent = '\uFEFF' + headers.join(';') + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `candidaturas-chiquinha-transportes-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Planilha CSV gerada e baixada com sucesso!', 'success');
  }

  // Alternador de Visualização (Cards vs Tabela)
  function setView(view) {
    activeView = view;
    localStorage.setItem('cq_admin_view', view);

    if (view === 'table') {
      if (list) list.style.display = 'none';
      if (tableContainer) tableContainer.style.display = 'block';
      if (btnViewTable) btnViewTable.classList.add('active');
      if (btnViewCards) btnViewCards.classList.remove('active');
    } else {
      if (list) list.style.display = 'grid';
      if (tableContainer) tableContainer.style.display = 'none';
      if (btnViewCards) btnViewCards.classList.add('active');
      if (btnViewTable) btnViewTable.classList.remove('active');
    }
  }

  // Inicialização do Painel de Filtros e KPIs
  function setupControls() {
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        searchQuery = e.target.value.toLowerCase().trim();
        render();
      });
    }

    if (statusFilterSelect) {
      statusFilterSelect.addEventListener('change', () => {
        syncKpiActiveFilter(statusFilterSelect.value);
        render();
      });
    }

    if (jobFilterSelect) jobFilterSelect.addEventListener('change', render);
    if (sortFilterSelect) sortFilterSelect.addEventListener('change', render);

    if (btnViewCards) btnViewCards.addEventListener('click', () => setView('cards'));
    if (btnViewTable) btnViewTable.addEventListener('click', () => setView('table'));
    if (btnExportCsv) btnExportCsv.addEventListener('click', exportToCSV);
    if (btnRefresh) btnRefresh.addEventListener('click', () => loadApplications(true));

    // KPI Cards como filtros rápidos ao clicar
    document.querySelectorAll('.admin-stat-card').forEach(card => {
      card.addEventListener('click', () => {
        const status = card.dataset.statusFilter;
        if (status && statusFilterSelect) {
          statusFilterSelect.value = status;
          syncKpiActiveFilter(status);
          render();
        }
      });
    });

    setView(activeView);
  }

  function syncKpiActiveFilter(status) {
    document.querySelectorAll('.admin-stat-card').forEach(card => {
      if (card.dataset.statusFilter === status) {
        card.classList.add('active-filter');
      } else {
        card.classList.remove('active-filter');
      }
    });
  }

  // Carregar dados do Firestore
  async function loadApplications(isManualRefresh = false) {
    try {
      if (btnRefresh) btnRefresh.innerHTML = '<i class="fa-solid fa-rotate-right fa-spin"></i> Atualizando...';
      const snapshot = await services.db.collection('applications').get();
      applications = snapshot.docs;
      updateKPIs();
      populateJobFilter();
      render();
      if (isManualRefresh) {
        showToast('Dados recarregados do servidor com sucesso!', 'info');
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      showMessage('Não foi possível carregar as candidaturas do banco de dados.');
    } finally {
      if (btnRefresh) btnRefresh.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Recarregar';
    }
  }

  // Modal de Perfil do Administrador
  function initAdminProfileModal() {
    const modal = document.getElementById('admin-profile-modal');
    const openBtn = document.getElementById('btn-open-admin-profile');
    const closeBtn = document.getElementById('close-admin-profile-btn');
    const alertBox = document.getElementById('admin-profile-alert');
    const nameInput = document.getElementById('admin-name-input');
    const emailInput = document.getElementById('admin-email-input');

    function showAlert(text, type = 'success') {
      if (!alertBox) return;
      alertBox.textContent = text;
      alertBox.className = 'portal-alert ' + (type === 'success' ? 'portal-alert-success' : 'portal-alert-danger');
      alertBox.style.display = 'block';
      setTimeout(() => { alertBox.style.display = 'none'; }, 6000);
    }

    function openModal() {
      if (currentAdminUser) {
        nameInput.value = currentAdminUser.displayName || '';
        emailInput.value = currentAdminUser.email || '';
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (alertBox) alertBox.style.display = 'none';
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    function bindEye(btnId, inputId) {
      const btn = document.getElementById(btnId);
      const input = document.getElementById(inputId);
      if (!btn || !input) return;
      btn.addEventListener('click', () => {
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        const icon = btn.querySelector('i');
        if (icon) icon.className = isPass ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      });
    }
    bindEye('toggle-admin-pass', 'admin-new-pass');
    bindEye('toggle-admin-confirm', 'admin-confirm-pass');

    // 1. Atualizar Nome do Admin
    const formAdminName = document.getElementById('form-admin-name');
    const btnSaveName = document.getElementById('btn-save-admin-name');
    const spinnerName = document.getElementById('admin-name-spinner');
    const textName = document.getElementById('btn-save-admin-name-text');

    if (formAdminName) {
      formAdminName.addEventListener('submit', async e => {
        e.preventDefault();
        const newName = nameInput.value.trim();
        if (!newName || newName.length < 3) {
          showAlert('Por favor, informe seu nome completo.', 'error');
          return;
        }
        btnSaveName.disabled = true;
        spinnerName.style.display = 'inline-block';
        textName.textContent = 'Salvando...';

        try {
          await services.updateUserProfile({ displayName: newName });
          showAlert('Nome atualizado com sucesso!', 'success');
        } catch (error) {
          console.error(error);
          showAlert('Não foi possível atualizar o nome.', 'error');
        } finally {
          btnSaveName.disabled = false;
          spinnerName.style.display = 'none';
          textName.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Atualizar Nome';
        }
      });
    }

    // 2. Alterar Senha do Admin
    const formAdminPass = document.getElementById('form-admin-password');
    const passInput = document.getElementById('admin-new-pass');
    const confirmInput = document.getElementById('admin-confirm-pass');
    const btnSavePass = document.getElementById('btn-save-admin-pass');
    const spinnerPass = document.getElementById('admin-pass-spinner');
    const textPass = document.getElementById('btn-save-admin-pass-text');

    if (formAdminPass) {
      formAdminPass.addEventListener('submit', async e => {
        e.preventDefault();
        const newPass = passInput.value;
        const confirmPass = confirmInput.value;

        if (!newPass || newPass.length < 6) {
          showAlert('A nova senha deve ter no mínimo 6 dígitos.', 'error');
          return;
        }
        if (newPass !== confirmPass) {
          showAlert('A confirmação de senha não coincide.', 'error');
          return;
        }

        btnSavePass.disabled = true;
        spinnerPass.style.display = 'inline-block';
        textPass.textContent = 'Atualizando senha...';

        try {
          await services.updateUserPassword(newPass);
          passInput.value = '';
          confirmInput.value = '';
          showAlert('Senha alterada com sucesso!', 'success');
        } catch (error) {
          console.error(error);
          if (error.code === 'auth/requires-recent-login') {
            showAlert('Por segurança, faça login novamente para trocar sua senha.', 'error');
          } else {
            showAlert(error.message || 'Falha ao alterar senha.', 'error');
          }
        } finally {
          btnSavePass.disabled = false;
          spinnerPass.style.display = 'none';
          textPass.innerHTML = '<i class="fa-solid fa-key"></i> Salvar Nova Senha';
        }
      });
    }
  }

  // Inicialização geral
  function init() {
    setupControls();
    initAdminProfileModal();

    if (!services || !services.configured) {
      showMessage('Firebase ainda não foi configurado.');
      return;
    }

    services.onAuthStateChanged(async user => {
      if (!user) {
        window.location.href = 'index.html?login=admin';
        return;
      }
      currentAdminUser = user;
      try {
        const adminEmails = ['umoliveiradev@gmail.com', 'chiquinhatransports@gmail.com'];
        const isAdminEmail = adminEmails.includes((user.email || '').toLowerCase());
        const adminDoc = await services.db.collection('admins').doc(user.uid).get();

        if (!isAdminEmail && !adminDoc.exists) {
          throw new Error('not-admin');
        }

        await loadApplications();
      } catch (error) {
        console.error(error);
        showMessage('Acesso negado. Este usuário não está autorizado como administrador.');
      }
    });

    const btnSignOut = document.getElementById('sign-out');
    if (btnSignOut) {
      btnSignOut.addEventListener('click', () => {
        services.signOut().then(() => { window.location.href = 'index.html'; });
      });
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('cq_theme', next);
      });
    }
  }

  init();
})();
