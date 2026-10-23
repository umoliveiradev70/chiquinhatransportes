(function () {
  const services = window.cqFirebase;
  const list = document.getElementById('admin-list');
  const message = document.getElementById('admin-message');
  const statusLabels = { recebida: 'Candidatura recebida', triagem: 'Em triagem', entrevista: 'Entrevista', aprovada: 'Aprovada', recusada: 'Encerrada' };
  let applications = [];
  let searchQuery = '';

  function showMessage(text) { message.textContent = text; message.style.display = 'block'; }
  function formatDate(value) { return value && value.toDate ? value.toDate().toLocaleDateString('pt-BR') : 'Agora'; }

  function setupDashboard() {
    const toolbar = document.querySelector('.admin-toolbar');
    const statusFilter = document.getElementById('status-filter');
    const totalCount = document.getElementById('total-count');
    if (!toolbar || !statusFilter || !totalCount) return;

    const stats = document.createElement('section');
    stats.className = 'admin-stats';
    stats.innerHTML = '<div class="admin-stat-card"><span class="admin-stat-icon stat-icon-total"><i class="fa-solid fa-users"></i></span><div><strong id="stat-total">0</strong><span>Total</span></div></div><div class="admin-stat-card"><span class="admin-stat-icon stat-icon-new"><i class="fa-solid fa-inbox"></i></span><div><strong id="stat-recebida">0</strong><span>Novas</span></div></div><div class="admin-stat-card"><span class="admin-stat-icon stat-icon-progress"><i class="fa-solid fa-arrows-rotate"></i></span><div><strong id="stat-andamento">0</strong><span>Em andamento</span></div></div><div class="admin-stat-card"><span class="admin-stat-icon stat-icon-approved"><i class="fa-solid fa-circle-check"></i></span><div><strong id="stat-aprovada">0</strong><span>Aprovadas</span></div></div>';
    toolbar.parentElement.insertBefore(stats, toolbar);

    const title = document.createElement('div');
    title.className = 'admin-toolbar-title';
    title.innerHTML = '<strong id="total-count-label"></strong><span>Filtre e atualize os processos abaixo</span>';
    title.querySelector('strong').textContent = totalCount.textContent;

    const controls = document.createElement('div');
    controls.className = 'admin-toolbar-controls';
    controls.innerHTML = '<label class="admin-search"><i class="fa-solid fa-magnifying-glass"></i><input id="admin-search" type="search" placeholder="Buscar candidato ou vaga..." aria-label="Buscar candidato ou vaga"></label>';
    controls.appendChild(statusFilter);
    toolbar.innerHTML = '';
    toolbar.append(title, controls);
    totalCount.remove();
    document.getElementById('admin-search').addEventListener('input', event => { searchQuery = event.target.value.toLowerCase().trim(); render(); });
    statusFilter.addEventListener('change', render);
  }

  function updateStats() {
    const counts = applications.reduce((result, item) => { const status = item.data().status || 'recebida'; result.total += 1; result[status] = (result[status] || 0) + 1; return result; }, { total: 0 });
    document.getElementById('stat-total').textContent = counts.total || 0;
    document.getElementById('stat-recebida').textContent = counts.recebida || 0;
    document.getElementById('stat-andamento').textContent = (counts.triagem || 0) + (counts.entrevista || 0);
    document.getElementById('stat-aprovada').textContent = counts.aprovada || 0;
  }

  function render() {
    const filter = document.getElementById('status-filter').value;
    const filtered = applications.filter(item => {
      const app = item.data();
      const status = app.status || 'recebida';
      const searchable = `${app.jobTitle || ''} ${app.candidate?.name || ''} ${app.candidate?.email || ''}`.toLowerCase();
      return (filter === 'todos' || status === filter) && (!searchQuery || searchable.includes(searchQuery));
    });
    const countLabel = document.getElementById('total-count-label');
    if (countLabel) countLabel.textContent = `${filtered.length} candidatura(s) encontrada(s)`;
    if (!filtered.length) { list.innerHTML = '<div class="empty-portal"><i class="fa-regular fa-folder-open"></i><h2>Nenhuma candidatura encontrada</h2><p>Tente alterar os filtros ou aguarde novas inscrições.</p></div>'; return; }
    list.innerHTML = filtered.map(item => {
      const app = item.data();
      const status = app.status || 'recebida';
      return `<article class="application-card" data-id="${item.id}"><div class="application-card-header"><div><h2>${app.jobTitle || 'Banco de Talentos'}</h2><span class="application-id">${app.candidate?.name || 'Candidato'} · ${app.candidate?.email || ''}</span></div><span class="status-badge status-${status}">${statusLabels[status] || status}</span></div><div class="application-details"><div><strong>Telefone:</strong> ${app.candidate?.phone || 'Não informado'}</div><div><strong>Cidade:</strong> ${app.candidate?.city || 'Não informado'}</div><div><strong>Enviada em:</strong> ${formatDate(app.createdAt)}</div><div><strong>Currículo:</strong> enviado ao RH por e-mail</div></div><div class="application-card-footer"><select class="admin-status" aria-label="Status da candidatura"><option value="recebida" ${status === 'recebida' ? 'selected' : ''}>Recebida</option><option value="triagem" ${status === 'triagem' ? 'selected' : ''}>Em triagem</option><option value="entrevista" ${status === 'entrevista' ? 'selected' : ''}>Entrevista</option><option value="aprovada" ${status === 'aprovada' ? 'selected' : ''}>Aprovada</option><option value="recusada" ${status === 'recusada' ? 'selected' : ''}>Encerrada</option></select><textarea class="admin-note" placeholder="Mensagem opcional para o candidato...">${app.adminNote || ''}</textarea><button class="btn btn-primary admin-update"><i class="fa-solid fa-floppy-disk"></i> Salvar atualização</button></div></article>`;
    }).join('');
    list.querySelectorAll('.admin-update').forEach(button => button.addEventListener('click', async event => {
      const card = event.currentTarget.closest('.application-card');
      button.disabled = true;
      try {
        const status = card.querySelector('.admin-status').value;
        await services.db.collection('applications').doc(card.dataset.id).update({ status, statusLabel: statusLabels[status], adminNote: card.querySelector('.admin-note').value.trim(), updatedAt: services.serverTimestamp() });
        await loadApplications();
      } catch (error) { console.error(error); showMessage('Não foi possível salvar esta atualização.'); }
      finally { button.disabled = false; }
    }));
  }

  async function loadApplications() { const snapshot = await services.db.collection('applications').get(); applications = snapshot.docs.sort((a, b) => (b.data().createdAt?.seconds || 0) - (a.data().createdAt?.seconds || 0)); updateStats(); render(); }
  function init() {
    setupDashboard();
    if (!services || !services.configured) { showMessage('Firebase ainda não foi configurado.'); return; }
    services.onAuthStateChanged(async user => {
      if (!user) { await services.signInWithGoogle().catch(() => { window.location.href = 'index.html'; }); return; }
      try { const isAdminEmail = (user.email || '').toLowerCase() === 'umoliveiradev@gmail.com'; const adminDoc = await services.db.collection('admins').doc(user.uid).get(); if (!isAdminEmail && !adminDoc.exists) throw new Error('not-admin'); await loadApplications(); }
      catch (error) { console.error(error); showMessage('Acesso negado. Este usuário não está autorizado como administrador.'); }
    });
  }
  document.getElementById('sign-out').addEventListener('click', () => services.signOut().then(() => { window.location.href = 'index.html'; }));
  document.getElementById('theme-toggle').addEventListener('click', () => { const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', next); localStorage.setItem('cq_theme', next); });
  init();
})();
