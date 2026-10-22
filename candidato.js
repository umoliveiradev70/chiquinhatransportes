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
      return `<article class="application-card"><div class="application-card-header"><div><h2>${app.jobTitle || 'Banco de Talentos'}</h2><span class="application-id">Protocolo ${item.id.slice(0, 8).toUpperCase()}</span></div><span class="status-badge status-${status}">${statusLabels[status] || status}</span></div><div class="application-meta"><span class="text-muted"><i class="fa-regular fa-calendar"></i> Enviada em ${formatDate(app.createdAt)}</span></div><div class="application-details"><div><strong>Localização:</strong> ${app.candidate?.city || 'Não informado'}</div><div><strong>Última atualização:</strong> ${formatDate(app.updatedAt)}</div>${app.adminNote ? `<div><strong>Mensagem do RH:</strong> ${app.adminNote}</div>` : ''}</div><div class="application-card-footer"><a class="btn btn-outline" href="${app.resume?.url || '#'}" target="_blank" rel="noopener"><i class="fa-regular fa-file-lines"></i> Ver currículo enviado</a></div></article>`;
    }).join('');
  }

  function init() {
    if (!services || !services.configured) { showMessage('Firebase ainda não foi configurado. Preencha firebase-config.js para ativar esta área.'); return; }
    services.onAuthStateChanged(async user => {
      if (!user) { window.location.href = 'index.html'; return; }
      document.getElementById('user-name').textContent = user.displayName || user.email;
      if (user.photoURL) document.getElementById('user-photo').src = user.photoURL;
      try {
        const snapshot = await services.db.collection('applications').where('userId', '==', user.uid).get();
        renderApplications(snapshot.docs.sort((a, b) => (b.data().createdAt?.seconds || 0) - (a.data().createdAt?.seconds || 0)));
      } catch (error) { console.error(error); showMessage('Não foi possível carregar suas candidaturas.'); }
    });
  }

  document.getElementById('sign-out').addEventListener('click', () => services.signOut().then(() => { window.location.href = 'index.html'; }));
  document.getElementById('theme-toggle').addEventListener('click', () => { const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', next); localStorage.setItem('cq_theme', next); });
  init();
})();
