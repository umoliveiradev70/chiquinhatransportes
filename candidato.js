(function () {
  const services = window.cqFirebase;
  const list = document.getElementById('applications-list');
  const message = document.getElementById('portal-message');
  const statusLabels = { recebida: 'Candidatura recebida', triagem: 'Em triagem', entrevista: 'Entrevista', aprovada: 'Aprovada', recusada: 'Encerrada' };

  function showMessage(text) { message.textContent = text; message.style.display = 'block'; }
  function formatDate(value) { return value && value.toDate ? value.toDate().toLocaleDateString('pt-BR') : 'Agora'; }
  function renderApplications(items) {
    if (!items.length) {
      list.innerHTML = '<div class="empty-portal"><i class="fa-regular fa-folder-open"></i><h2>Nenhuma candidatura encontrada</h2><p>Quando você se candidatar a uma vaga, o acompanhamento aparecerá aqui.</p><a class="btn btn-primary" href="index.html#vagas">Ver vagas abertas</a></div>';
      return;
    }
    list.innerHTML = items.map(item => {
      const app = item.data();
      const status = app.status || 'recebida';
      return `<article class="application-card"><div class="application-card-header"><div><h2>${app.jobTitle || 'Banco de Talentos'}</h2><span class="application-id">Protocolo ${item.id.slice(0, 8).toUpperCase()}</span></div><span class="status-badge status-${status}">${statusLabels[status] || status}</span></div><div class="application-meta"><span class="text-muted"><i class="fa-regular fa-calendar"></i> Enviada em ${formatDate(app.createdAt)}</span></div><div class="application-details"><div><strong>Localização:</strong> ${app.candidate?.city || 'Não informado'}</div><div><strong>Última atualização:</strong> ${formatDate(app.updatedAt)}</div>${app.adminNote ? `<div><strong>Mensagem do RH:</strong> ${app.adminNote}</div>` : ''}</div><div class="application-card-footer"><span class="text-muted"><i class="fa-solid fa-envelope-circle-check"></i> Currículo enviado ao RH por e-mail</span></div></article>`;
    }).join('');
  }

  let currentUser = null;

  function initProfileModal() {
    const modal = document.getElementById('profile-modal');
    const openBtn = document.getElementById('btn-open-profile');
    const closeBtn = document.getElementById('close-profile-btn');
    const alertBox = document.getElementById('profile-modal-alert');
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');

    function showAlert(text, type = 'success') {
      alertBox.textContent = text;
      alertBox.className = 'portal-alert ' + (type === 'success' ? 'portal-alert-success' : 'portal-alert-danger');
      alertBox.style.display = 'block';
      setTimeout(() => { alertBox.style.display = 'none'; }, 6000);
    }

    function openModal() {
      if (currentUser) {
        nameInput.value = currentUser.displayName || '';
        emailInput.value = currentUser.email || '';
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
    bindEye('toggle-profile-pass', 'profile-new-pass');
    bindEye('toggle-profile-confirm', 'profile-confirm-pass');

    // 1. Atualizar Nome
    const formProfile = document.getElementById('form-update-profile');
    const btnSaveName = document.getElementById('btn-save-name');
    const spinnerName = document.getElementById('save-name-spinner');
    const textName = document.getElementById('btn-save-name-text');

    if (formProfile) {
      formProfile.addEventListener('submit', async (e) => {
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
          document.getElementById('user-name').textContent = newName;
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

    // 2. Alterar Senha
    const formPass = document.getElementById('form-update-password');
    const passInput = document.getElementById('profile-new-pass');
    const confirmInput = document.getElementById('profile-confirm-pass');
    const btnSavePass = document.getElementById('btn-save-pass');
    const spinnerPass = document.getElementById('save-pass-spinner');
    const textPass = document.getElementById('btn-save-pass-text');

    if (formPass) {
      formPass.addEventListener('submit', async (e) => {
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
            showAlert('Por segurança, saia da conta e faça login novamente para alterar sua senha.', 'error');
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
    setupProfileUi();
    if (!services || !services.configured) { showMessage('Firebase ainda não foi configurado. Preencha firebase-config.js para ativar esta área.'); return; }
    services.onAuthStateChanged(async user => {
      if (!user) { window.location.href = 'index.html?login=candidato'; return; }
      if (!user.emailVerified) {
        await services.signOut();
        window.location.href = 'index.html?verify=required';
        return;
      }
      currentUser = user;
      const adminEmails = ['umoliveiradev@gmail.com', 'chiquinhatransports@gmail.com'];
      if (adminEmails.includes((user.email || '').toLowerCase())) { window.location.href = 'admin.html'; return; }
      document.getElementById('user-name').textContent = user.displayName || user.email;
      if (user.photoURL) document.getElementById('user-photo').src = user.photoURL;
      try {
        const snapshot = await services.db.collection('applications').where('userId', '==', user.uid).get();
        renderApplications(snapshot.docs.sort((a, b) => (b.data().createdAt?.seconds || 0) - (a.data().createdAt?.seconds || 0)));
      } catch (error) { console.error(error); showMessage('Não foi possível carregar suas candidaturas.'); }
    });
  }

  function setupProfileUi() {
    initProfileModal();
  }

  document.getElementById('sign-out').addEventListener('click', () => services.signOut().then(() => { window.location.href = 'index.html'; }));
  document.getElementById('theme-toggle').addEventListener('click', () => { const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', next); localStorage.setItem('cq_theme', next); });
  init();
})();
