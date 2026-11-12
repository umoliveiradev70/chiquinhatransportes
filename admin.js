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
  let currentAdminUser = null;

  function initAdminProfileModal() {
    const modal = document.getElementById('admin-profile-modal');
    const openBtn = document.getElementById('btn-open-admin-profile');
    const closeBtn = document.getElementById('close-admin-profile-btn');
    const alertBox = document.getElementById('admin-profile-alert');
    const nameInput = document.getElementById('admin-name-input');
    const emailInput = document.getElementById('admin-email-input');

    function showAlert(text, type = 'success') {
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
      alertBox.style.display = 'none';
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

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
      formAdminName.addEventListener('submit', async (e) => {
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
      formAdminPass.addEventListener('submit', async (e) => {
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
            showAlert('Por motivos de segurança, saia e faça login novamente para trocar sua senha.', 'error');
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

  function init() {
    setupDashboard();
    initAdminProfileModal();
    if (!services || !services.configured) { showMessage('Firebase ainda não foi configurado.'); return; }
    services.onAuthStateChanged(async user => {
      if (!user) { window.location.href = 'index.html?login=admin'; return; }
      currentAdminUser = user;
      try { const adminEmails = ['umoliveiradev@gmail.com', 'chiquinhatransports@gmail.com']; const isAdminEmail = adminEmails.includes((user.email || '').toLowerCase()); const adminDoc = await services.db.collection('admins').doc(user.uid).get(); if (!isAdminEmail && !adminDoc.exists) throw new Error('not-admin'); await loadApplications(); }
      catch (error) { console.error(error); showMessage('Acesso negado. Este usuário não está autorizado como administrador.'); }
    });
  }
  document.getElementById('sign-out').addEventListener('click', () => services.signOut().then(() => { window.location.href = 'index.html'; }));
  document.getElementById('theme-toggle').addEventListener('click', () => { const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', next); localStorage.setItem('cq_theme', next); });
  init();
})();
