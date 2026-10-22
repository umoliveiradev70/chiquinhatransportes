/**
 * CHIQUINHA TRANSPORTES - PORTAL DE CARREIRAS
 * JavaScript Interativo & Gestão de Vagas
 * Inspirado na experiência de recrutamento Sólides/Unimed
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========================================================
  // 1. BANCO DE DADOS DE VAGAS (REALISTA PARA TRANSPORTADORA)
  // ========================================================
  const JOBS_DATA = [
    {
      id: 'CQ-401',
      title: 'Analista Administrativo',
      category: 'administrativo',
      department: 'Administrativo & RH',
      location: 'Pouso Alegre - MG',
      route: 'Matriz',
      type: 'CLT Efetivo',
      modality: 'Presencial',
      salary: 'A combinar',
      pcd: false,
      date: 'Publicada recentemente',
      tags: ['Administrativo', 'CLT', 'Pouso Alegre'],
      description: 'Profissional responsável pelas rotinas administrativas da empresa, garantindo organização e suporte às demais áreas.',
      responsibilities: [
        'Controle de documentos e registros;',
        'Elaboração de relatórios;',
        'Acompanhamento de processos internos;',
        'Suporte às rotinas administrativas.'
      ],
      requirements: [
        'Ensino Superior completo ou em andamento em Administração ou áreas afins;',
        'Experiência em rotinas administrativas;',
        'Boa comunicação e organização.'
      ],
      benefits: [
        'Vale Transporte;',
        'Vale Alimentação;',
        'Plano de Saúde;',
        'Seguro de Vida.'
      ]
    },
    {
      id: 'CQ-402',
      title: 'Analista Comercial',
      category: 'administrativo',
      department: 'Administrativo & RH',
      location: 'Pouso Alegre - MG',
      route: 'Matriz',
      type: 'CLT Efetivo',
      modality: 'Presencial',
      salary: 'A combinar',
      pcd: false,
      date: 'Publicada recentemente',
      tags: ['Comercial', 'CLT', 'Pouso Alegre'],
      description: 'Responsável pelo relacionamento com clientes e pelo desenvolvimento de oportunidades comerciais para a empresa.',
      responsibilities: [
        'Atendimento a clientes;',
        'Elaboração de propostas comerciais;',
        'Acompanhamento de contratos e negociações;',
        'Prospecção e relacionamento comercial.'
      ],
      requirements: [
        'Ensino Superior completo em Administração, Logística ou áreas correlatas;',
        'Experiência na área comercial;',
        'Habilidade em negociação e comunicação.'
      ],
      benefits: [
        'Vale Transporte;',
        'Vale Alimentação;',
        'Plano de Saúde;',
        'Seguro de Vida.'
      ]
    },
    {
      id: 'CQ-403',
      title: 'Assistente Administrativo',
      category: 'administrativo',
      department: 'Administrativo & RH',
      location: 'Pouso Alegre - MG',
      route: 'Matriz',
      type: 'CLT Efetivo',
      modality: 'Presencial',
      salary: 'A combinar',
      pcd: false,
      date: 'Publicada recentemente',
      tags: ['Administrativo', 'CLT', 'Pouso Alegre'],
      description: 'Apoio às rotinas administrativas, financeiras e de recursos humanos da empresa.',
      responsibilities: [
        'Organização de arquivos e documentos;',
        'Apoio às rotinas de RH e DP;',
        'Suporte financeiro e administrativo;',
        'Atendimento interno e externo.'
      ],
      requirements: [
        'Ensino Médio completo ou Superior em andamento;',
        'Conhecimento básico em informática (Excel, Word);',
        'Organização e atenção aos detalhes.'
      ],
      benefits: [
        'Vale Transporte;',
        'Vale Alimentação;',
        'Plano de Saúde;',
        'Seguro de Vida.'
      ]
    },
    {
      id: 'CQ-404',
      title: 'Analista Logístico',
      category: 'logistica',
      department: 'Logística & Operações',
      location: 'Pouso Alegre - MG',
      route: 'Matriz',
      type: 'CLT Efetivo',
      modality: 'Presencial',
      salary: 'A combinar',
      pcd: false,
      date: 'Publicada recentemente',
      tags: ['Logística', 'CLT', 'Pouso Alegre'],
      description: 'Profissional responsável pela coordenação de serviços e gestão de fornecedores na área logística.',
      responsibilities: [
        'Coordenação de serviços gerais (limpeza, manutenção);',
        'Gestão de fornecedores.'
      ],
      requirements: [
        'Ensino Superior completo em Logística, Administração ou áreas afins;',
        'Experiência em operações logísticas;',
        'Capacidade analítica e organização.'
      ],
      benefits: [
        'Vale Transporte;',
        'Vale Alimentação;',
        'Plano de Saúde;',
        'Seguro de Vida.'
      ]
    },
    {
      id: 'CQ-405',
      title: 'Líder Facilities',
      category: 'logistica',
      department: 'Logística & Operações',
      location: 'Pouso Alegre - MG',
      route: 'Matriz',
      type: 'CLT Efetivo',
      modality: 'Presencial',
      salary: 'A combinar',
      pcd: false,
      date: 'Publicada recentemente',
      tags: ['Facilities', 'Liderança', 'CLT'],
      description: 'Liderança responsável pela coordenação dos serviços gerais e manutenção das instalações da empresa.',
      responsibilities: [
        'Coordenação de serviços gerais (limpeza, manutenção);',
        'Gestão de fornecedores.'
      ],
      requirements: [
        'Experiência em liderança de equipes de facilities ou serviços gerais;',
        'Organização e capacidade de gestão.'
      ],
      benefits: [
        'Vale Transporte;',
        'Vale Alimentação;',
        'Plano de Saúde;',
        'Seguro de Vida.'
      ]
    },
    {
      id: 'CQ-406',
      title: 'Almoxerife',
      category: 'logistica',
      department: 'Logística & Operações',
      location: 'Pouso Alegre - MG',
      route: 'Matriz',
      type: 'CLT Efetivo',
      modality: 'Presencial',
      salary: 'A combinar',
      pcd: false,
      date: 'Publicada recentemente',
      tags: ['Almoxarifado', 'Estoque', 'CLT'],
      description: 'Responsável pelo controle de entrada e saída de materiais e peças no almoxarifado.',
      responsibilities: [
        'Controle de entrada e saída de materiais e peças;',
        'Organização física e inventário do almoxarifado;',
        'Atendimento às requisições da frota e manutenção.'
      ],
      requirements: [
        'Ensino Médio completo;',
        'Experiência em almoxarifado ou controle de estoque;',
        'Organização e atenção.'
      ],
      benefits: [
        'Vale Transporte;',
        'Vale Alimentação;',
        'Plano de Saúde;',
        'Seguro de Vida.'
      ]
    },
    {
      id: 'CQ-407',
      title: 'Setor Transportes Operacional',
      category: 'motorista',
      department: 'Motoristas & Transporte',
      location: 'Pouso Alegre - MG',
      route: 'Rotas Nacionais',
      type: 'CLT Efetivo',
      modality: 'Presencial',
      salary: 'A combinar',
      pcd: false,
      date: 'Publicada recentemente',
      tags: ['Transporte', 'Operacional', 'CLT'],
      description: 'Profissional responsável pelas operações do setor de transportes da empresa.',
      responsibilities: [
        'Controle de frota;',
        'Manutenção preventiva;',
        'Planejamento de coletas e entregas.'
      ],
      requirements: [
        'Experiência no setor de transportes;',
        'Conhecimento em gestão de frota.'
      ],
      benefits: [
        'Vale Transporte;',
        'Vale Alimentação;',
        'Plano de Saúde;',
        'Seguro de Vida.'
      ]
    },
    {
      id: 'CQ-408',
      title: 'Analista de Transportes',
      category: 'motorista',
      department: 'Motoristas & Transporte',
      location: 'Pouso Alegre - MG',
      route: 'Rotas Nacionais',
      type: 'CLT Efetivo',
      modality: 'Presencial',
      salary: 'A combinar',
      pcd: false,
      date: 'Publicada recentemente',
      tags: ['Transportes', 'Análise', 'CLT'],
      description: 'Responsável pela análise e gestão das operações de transporte da empresa.',
      responsibilities: [
        'Controle de frota;',
        'Manutenção preventiva;',
        'Planejamento de coletas e entregas.'
      ],
      requirements: [
        'Ensino Superior em Logística, Administração ou áreas afins;',
        'Experiência em análise de transportes.'
      ],
      benefits: [
        'Vale Transporte;',
        'Vale Alimentação;',
        'Plano de Saúde;',
        'Seguro de Vida.'
      ]
    },
    {
      id: 'CQ-409',
      title: 'Vigilante',
      category: 'administrativo',
      department: 'Administrativo & RH',
      location: 'Pouso Alegre - MG',
      route: 'Matriz',
      type: 'CLT Efetivo',
      modality: 'Presencial',
      salary: 'A combinar',
      pcd: false,
      date: 'Publicada recentemente',
      tags: ['Segurança', 'Vigilância', 'CLT'],
      description: 'Responsável pelo monitoramento de acesso e segurança patrimonial das instalações da empresa.',
      responsibilities: [
        'Monitoramento de acesso e segurança patrimonial;',
        'Vigilância presencial.'
      ],
      requirements: [
        'Curso de Vigilante com registro na Polícia Federal;',
        'Experiência em segurança patrimonial.'
      ],
      benefits: [
        'Vale Transporte;',
        'Vale Alimentação;',
        'Plano de Saúde;',
        'Seguro de Vida.'
      ]
    },
    {
      id: 'CQ-410',
      title: 'Auxiliar de Limpeza',
      category: 'administrativo',
      department: 'Administrativo & RH',
      location: 'Pouso Alegre - MG',
      route: 'Matriz',
      type: 'CLT Efetivo',
      modality: 'Presencial',
      salary: 'A combinar',
      pcd: false,
      date: 'Publicada recentemente',
      tags: ['Limpeza', 'CLT', 'Pouso Alegre'],
      description: 'Responsável pela limpeza e conservação dos ambientes da empresa.',
      responsibilities: [
        'Limpeza e conservação dos ambientes comuns e administrativos;',
        'Abastecimento de materiais de higiene.'
      ],
      requirements: [
        'Ensino Fundamental completo;',
        'Experiência em serviços de limpeza.'
      ],
      benefits: [
        'Vale Transporte;',
        'Vale Alimentação;',
        'Plano de Saúde;',
        'Seguro de Vida.'
      ]
    },
    {
      id: 'CQ-411',
      title: 'Aux. de Manutenção Predial',
      category: 'manutencao',
      department: 'Oficina & Manutenção Pesada',
      location: 'Pouso Alegre - MG',
      route: 'Matriz',
      type: 'CLT Efetivo',
      modality: 'Presencial',
      salary: 'A combinar',
      pcd: false,
      date: 'Publicada recentemente',
      tags: ['Manutenção', 'Predial', 'CLT'],
      description: 'Responsável pela manutenção preventiva e corretiva das instalações prediais da empresa.',
      responsibilities: [
        'Execução de reparos básicos;',
        'Manutenção preventiva da infraestrutura.'
      ],
      requirements: [
        'Ensino Médio completo;',
        'Experiência em manutenção predial.'
      ],
      benefits: [
        'Vale Transporte;',
        'Vale Alimentação;',
        'Plano de Saúde;',
        'Seguro de Vida.'
      ]
    },
    {
      id: 'CQ-412',
      title: 'Motoristas',
      category: 'motorista',
      department: 'Motoristas & Transporte',
      location: 'Rotas Nacionais',
      route: 'Todas as bases da Chiquinha',
      type: 'CLT Efetivo',
      modality: 'Presencial (Viagens)',
      salary: 'A combinar',
      pcd: false,
      date: 'Publicada recentemente',
      tags: ['Motorista', 'CNH E', 'Rotas Nacionais'],
      description: 'Motoristas profissionais para condução de veículos da frota Chiquinha Transportes em rotas regionais e nacionais.',
      responsibilities: [
        'Realização segura de transportes;',
        'Cumprimento de rotas e prazos;',
        'Manutenção básica do veículo.'
      ],
      requirements: [
        'CNH Categoria C, D ou E válida com EAR;',
        'Experiência comprovada na condução de veículos de carga;',
        'Disponibilidade para viagens.'
      ],
      benefits: [
        'Vale Transporte;',
        'Vale Alimentação;',
        'Plano de Saúde;',
        'Diárias de viagem.'
      ]
    }
  ];
  // ========================================================
  // 2. ELEMENTOS DO DOM
  // ========================================================
  const jobsGrid = document.getElementById('jobs-grid');
  const jobsCountBadge = document.getElementById('jobs-count-badge');
  const emptyState = document.getElementById('empty-state');
  const filterChips = document.getElementById('filter-chips');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const locationSelect = document.getElementById('location-select');
  const departmentSelect = document.getElementById('department-select');
  const btnSubmitSearch = document.getElementById('btn-submit-search');
  const btnResetFilters = document.getElementById('btn-reset-filters');

  // Modais
  const jobDetailsModal = document.getElementById('job-details-modal');
  const closeJobDetailsBtn = document.getElementById('close-job-details-btn');
  const btnModalCancel = document.getElementById('btn-modal-cancel');
  const btnModalApply = document.getElementById('btn-modal-apply');
  const modalJobType = document.getElementById('modal-job-type');
  const modalJobLocation = document.getElementById('modal-job-location');
  const modalJobCode = document.getElementById('modal-job-code');
  const modalJobTitle = document.getElementById('modal-job-title');
  const modalJobSalary = document.getElementById('modal-job-salary');
  const modalJobBody = document.getElementById('modal-job-body');

  // Formulário Candidatura
  const applicationModal = document.getElementById('application-modal');
  const closeApplicationBtn = document.getElementById('close-application-btn');
  const btnCancelApplication = document.getElementById('btn-cancel-application');
  const candidateForm = document.getElementById('candidate-form');
  const applyJobTitle = document.getElementById('apply-job-title');
  const formJobId = document.getElementById('form-job-id');
  const formJobTitleHidden = document.getElementById('form-job-title-hidden');
  const btnSubmitApplication = document.getElementById('btn-submit-application');
  const formSpinner = document.getElementById('form-spinner');
  const btnSubmitText = document.getElementById('btn-submit-text');

  // Upload Box
  const uploadDropzone = document.getElementById('upload-dropzone');
  const candCvFile = document.getElementById('cand-cv-file');
  const dropzoneDefault = document.getElementById('dropzone-default');
  const dropzoneSelected = document.getElementById('dropzone-selected');
  const selectedFileName = document.getElementById('selected-file-name');
  const selectedFileSize = document.getElementById('selected-file-size');
  const btnRemoveFile = document.getElementById('btn-remove-file');

  // Login Modal
  const candidateLoginModal = document.getElementById('candidate-login-modal');
  const closeLoginBtn = document.getElementById('close-login-btn');
  const btnCandidateArea = document.getElementById('btn-candidate-area');
  const btnCandidateAreaMobile = document.getElementById('btn-candidate-area-mobile');
  const btnFooterCandidateLogin = document.getElementById('btn-footer-candidate-login');
  const btnDoLogin = document.getElementById('btn-do-login');
  const btnQuickCvAccess = document.getElementById('btn-quick-cv-access');
  const btnOpenTalentModal = document.getElementById('btn-open-talent-modal');

  // Mobile Menu
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Toast Container
  const toastContainer = document.getElementById('toast-container');

  // Year in Footer
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Estado atual dos filtros
  let currentFilter = 'todos';
  let currentSearchQuery = '';
  let currentLocation = 'todos';
  let currentDepartment = 'todas';
  let currentlySelectedJob = null;
  let selectedFile = null;

  // ========================================================
  // 3. RENDERIZAÇÃO DOS CARDS DE VAGAS
  // ========================================================
  function renderJobs() {
    // Filtragem combinada
    const filteredJobs = JOBS_DATA.filter(job => {
      // 1. Filtro por Chip
      let matchesChip = true;
      if (currentFilter === 'pcd') {
        matchesChip = job.pcd === true;
      } else if (currentFilter !== 'todos') {
        matchesChip = job.category === currentFilter;
      }

      // 2. Filtro por Texto / Palavra-chave
      let matchesSearch = true;
      if (currentSearchQuery.trim() !== '') {
        const q = currentSearchQuery.toLowerCase();
        matchesSearch = (
          job.title.toLowerCase().includes(q) ||
          job.description.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q) ||
          job.tags.some(t => t.toLowerCase().includes(q))
        );
      }

      // 3. Filtro por Localidade
      let matchesLocation = true;
      if (currentLocation !== 'todos') {
        matchesLocation = job.location.toLowerCase().includes(currentLocation.toLowerCase()) ||
          job.route.toLowerCase().includes(currentLocation.toLowerCase());
      }

      // 4. Filtro por Departamento / Área
      let matchesDept = true;
      if (currentDepartment !== 'todas') {
        matchesDept = job.department === currentDepartment;
      }

      return matchesChip && matchesSearch && matchesLocation && matchesDept;
    });

    // Atualiza contadores
    if (jobsCountBadge) {
      const count = filteredJobs.length;
      jobsCountBadge.innerHTML = `<i class="fa-solid fa-briefcase"></i> ${count} ${count === 1 ? 'vaga aberta' : 'vagas abertas'}`;
    }

    // Se nenhuma vaga encontrada
    if (filteredJobs.length === 0) {
      jobsGrid.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    // Gera o HTML dos cards
    jobsGrid.innerHTML = filteredJobs.map(job => {
      const pcdBadge = job.pcd ? `<span class="job-badge-pcd"><i class="fa-solid fa-wheelchair"></i> Vaga PcD</span>` : '';

      return `
        <article class="job-card" data-id="${job.id}">
          <div class="job-card-top">
            <div class="job-card-meta">
              <span class="job-badge-contract">${job.type}</span>
              ${pcdBadge}
            </div>

            <h3 class="job-card-title">${job.title}</h3>

            <div class="job-card-location">
              <i class="fa-solid fa-location-dot"></i>
              <span>${job.location} • ${job.route}</span>
            </div>
          </div>

          <div class="job-card-bottom">
            <button class="btn btn-outline btn-details-card" data-id="${job.id}">
              <i class="fa-solid fa-circle-info"></i> Detalhes
            </button>
            <button class="btn btn-primary btn-apply-card" data-id="${job.id}">
              <i class="fa-solid fa-paper-plane"></i> Candidatar-se
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Adiciona ouvintes de clique nos novos botões gerados
    attachCardEvents();
  }

  // ========================================================
  // 4. EVENTOS DOS CARDS (CANDIDATURA E DETALHES)
  // ========================================================
  function attachCardEvents() {
    document.querySelectorAll('.btn-apply-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const jobId = e.currentTarget.getAttribute('data-id');
        const job = JOBS_DATA.find(j => j.id === jobId);
        if (job) {
          openApplicationModal(job, 'form');
        }
      });
    });

    document.querySelectorAll('.btn-details-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const jobId = e.currentTarget.getAttribute('data-id');
        const job = JOBS_DATA.find(j => j.id === jobId);
        if (job) {
          openApplicationModal(job, 'requirements');
        }
      });
    });
  }

  // ========================================================
  // 5. ABAS DO MODAL: FORMULÁRIO vs REQUISITOS & ATRIBUIÇÕES
  // ========================================================
  function switchModalTab(tabName) {
    const tabBtnForm = document.getElementById('tab-btn-form');
    const tabBtnReq = document.getElementById('tab-btn-requirements');
    const paneForm = document.getElementById('tab-pane-form');
    const paneReq = document.getElementById('tab-pane-requirements');

    if (tabName === 'requirements') {
      if (tabBtnForm) {
        tabBtnForm.classList.remove('active');
        tabBtnForm.setAttribute('aria-selected', 'false');
      }
      if (tabBtnReq) {
        tabBtnReq.classList.add('active');
        tabBtnReq.setAttribute('aria-selected', 'true');
      }
      if (paneForm) paneForm.classList.remove('active');
      if (paneReq) paneReq.classList.add('active');
    } else {
      if (tabBtnReq) {
        tabBtnReq.classList.remove('active');
        tabBtnReq.setAttribute('aria-selected', 'false');
      }
      if (tabBtnForm) {
        tabBtnForm.classList.add('active');
        tabBtnForm.setAttribute('aria-selected', 'true');
      }
      if (paneReq) paneReq.classList.remove('active');
      if (paneForm) paneForm.classList.add('active');
    }
  }

  function renderRequirementsTab(job) {
    const container = document.getElementById('job-requirements-content');
    if (!container) return;

    const respItems = (job.responsibilities || []).map(item => `
      <li><i class="fa-solid fa-check text-gold"></i> <span>${item}</span></li>
    `).join('');

    const reqItems = (job.requirements || []).map(item => `
      <li><i class="fa-solid fa-check text-gold"></i> <span>${item}</span></li>
    `).join('');

    const benefitChips = (job.benefits || []).map(item => `
      <div class="benefit-chip"><i class="fa-solid fa-circle-check text-gold"></i> <span>${item}</span></div>
    `).join('');

    container.innerHTML = `
      <div class="job-requirements-wrapper">
        <div class="modal-badge-row" style="margin-bottom: 0.5rem;">
          <span class="badge badge-primary"><i class="fa-solid fa-briefcase"></i> ${job.type || 'CLT Efetivo'}</span>
          <span class="badge badge-light"><i class="fa-solid fa-location-dot"></i> ${job.location || 'Pouso Alegre - MG'}</span>
          ${job.modality ? `<span class="badge badge-light"><i class="fa-solid fa-clock"></i> ${job.modality}</span>` : ''}
          ${job.department ? `<span class="badge badge-light"><i class="fa-solid fa-building"></i> ${job.department}</span>` : ''}
        </div>

        <div class="job-desc-box">
          <h4><i class="fa-solid fa-align-left text-gold"></i> Descrição da Vaga</h4>
          <p class="job-desc-text">${job.description || 'Faça parte da equipe da Chiquinha Transportes.'}</p>
        </div>

        <div class="job-desc-box">
          <h4><i class="fa-solid fa-list-check text-gold"></i> Atribuições & Responsabilidades</h4>
          <ul class="job-desc-list">
            ${respItems || '<li><span>Atividades pertinentes à função.</span></li>'}
          </ul>
        </div>

        <div class="job-desc-box">
          <h4><i class="fa-solid fa-clipboard-check text-gold"></i> Requisitos & Qualificações</h4>
          <ul class="job-desc-list">
            ${reqItems || '<li><span>Requisitos conforme o cargo.</span></li>'}
          </ul>
        </div>

        ${benefitChips ? `
        <div class="job-desc-box">
          <h4><i class="fa-solid fa-gift text-gold"></i> Benefícios Oferecidos</h4>
          <div class="job-benefits-grid">
            ${benefitChips}
          </div>
        </div>
        ` : ''}

        <div class="tab-apply-cta">
          <div>
            <strong>Gostou desta oportunidade?</strong>
            <p>Preencha seus dados na aba de candidatura e anexe seu currículo.</p>
          </div>
          <button type="button" class="btn btn-primary" id="btn-switch-to-form">
            <i class="fa-solid fa-pen-to-square"></i> Preencher Formulário
          </button>
        </div>
      </div>
    `;

    const btnSwitch = document.getElementById('btn-switch-to-form');
    if (btnSwitch) {
      btnSwitch.addEventListener('click', () => {
        switchModalTab('form');
        const nameInput = document.getElementById('cand-name');
        if (nameInput) nameInput.focus();
      });
    }
  }

  function openJobDetails(jobId) {
    const job = JOBS_DATA.find(j => j.id === jobId);
    if (!job) return;
    openApplicationModal(job, 'requirements');
  }

  function closeJobDetails() {
    if (jobDetailsModal) jobDetailsModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeJobDetailsBtn) closeJobDetailsBtn.addEventListener('click', closeJobDetails);
  if (btnModalCancel) btnModalCancel.addEventListener('click', closeJobDetails);

  if (btnModalApply) {
    btnModalApply.addEventListener('click', () => {
      closeJobDetails();
      if (currentlySelectedJob) {
        openApplicationModal(currentlySelectedJob, 'form');
      }
    });
  }

  // ========================================================
  // 6. FORMULÁRIO DE CANDIDATURA ONLINE & CONTROLE DE ABAS
  // ========================================================
  const tabBtnForm = document.getElementById('tab-btn-form');
  const tabBtnRequirements = document.getElementById('tab-btn-requirements');
  if (tabBtnForm) {
    tabBtnForm.addEventListener('click', () => switchModalTab('form'));
  }
  if (tabBtnRequirements) {
    tabBtnRequirements.addEventListener('click', () => switchModalTab('requirements'));
  }

  function openApplicationModal(job, initialTab = 'form') {
    currentlySelectedJob = job;
    formJobId.value = job.id;
    formJobTitleHidden.value = job.title;
    applyJobTitle.textContent = `Candidatura para ${job.title}`;

    // Popula aba de Requisitos & Atribuições
    renderRequirementsTab(job);

    // Reset formulário
    resetApplicationForm();

    // Alterna para a aba inicial
    switchModalTab(initialTab);

    applicationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeApplicationModal() {
    applicationModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeApplicationBtn) closeApplicationBtn.addEventListener('click', closeApplicationModal);
  if (btnCancelApplication) btnCancelApplication.addEventListener('click', closeApplicationModal);

  function resetApplicationForm() {
    candidateForm.reset();
    resetDropzone();
    // Limpa mensagens de erro
    document.querySelectorAll('.field-error').forEach(el => el.classList.remove('show'));
    formSpinner.style.display = 'none';
    btnSubmitText.innerHTML = '<i class="fa-solid fa-check"></i> Enviar Minha Candidatura';
    btnSubmitApplication.disabled = false;
  }

  // Upload Dropzone Handlers
  if (uploadDropzone && candCvFile) {
    uploadDropzone.addEventListener('click', () => {
      candCvFile.click();
    });

    uploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadDropzone.classList.add('dragover');
    });

    uploadDropzone.addEventListener('dragleave', () => {
      uploadDropzone.classList.remove('dragover');
    });

    uploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadDropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
    });

    candCvFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
      }
    });
  }

  if (btnRemoveFile) {
    btnRemoveFile.addEventListener('click', (e) => {
      e.stopPropagation();
      resetDropzone();
    });
  }

  function handleFileSelection(file) {
    const validExtensions = ['pdf', 'doc', 'docx'];
    const ext = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(ext)) {
      showToast('Formato Inválido', 'Por favor, selecione um arquivo em formato PDF ou DOCX.', 'error');
      resetDropzone();
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Arquivo muito grande', 'O tamanho máximo permitido para o currículo é de 5MB.', 'error');
      resetDropzone();
      return;
    }

    selectedFile = file;
    selectedFileName.textContent = file.name;
    selectedFileSize.textContent = formatBytes(file.size);

    dropzoneDefault.style.display = 'none';
    dropzoneSelected.style.display = 'flex';
    document.getElementById('error-cand-cv').classList.remove('show');
  }

  function resetDropzone() {
    selectedFile = null;
    candCvFile.value = '';
    dropzoneDefault.style.display = 'block';
    dropzoneSelected.style.display = 'none';
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // Validação e Envio do Formulário de Candidatura
  if (candidateForm) {
    candidateForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validação Nome
      const nameInput = document.getElementById('cand-name');
      const errName = document.getElementById('error-cand-name');
      if (!nameInput.value.trim() || nameInput.value.trim().length < 4) {
        errName.classList.add('show');
        isValid = false;
      } else {
        errName.classList.remove('show');
      }

      // Validação CPF (se presente no formulário)
      const cpfInput = document.getElementById('cand-cpf');
      const errCpf = document.getElementById('error-cand-cpf');
      if (cpfInput) {
        const cleanCpf = cpfInput.value.replace(/\D/g, '');
        if (cleanCpf.length < 11) {
          if (errCpf) errCpf.classList.add('show');
          isValid = false;
        } else {
          if (errCpf) errCpf.classList.remove('show');
        }
      }

      // Validação E-mail
      const emailInput = document.getElementById('cand-email');
      const errEmail = document.getElementById('error-cand-email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        errEmail.classList.add('show');
        isValid = false;
      } else {
        errEmail.classList.remove('show');
      }

      // Validação Telefone
      const phoneInput = document.getElementById('cand-phone');
      const errPhone = document.getElementById('error-cand-phone');
      const cleanPhone = phoneInput.value.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        errPhone.classList.add('show');
        isValid = false;
      } else {
        errPhone.classList.remove('show');
      }

      // Validação Cidade
      const cityInput = document.getElementById('cand-city');
      const errCity = document.getElementById('error-cand-city');
      if (!cityInput.value.trim()) {
        errCity.classList.add('show');
        isValid = false;
      } else {
        errCity.classList.remove('show');
      }

      // Validação Currículo
      const errCv = document.getElementById('error-cand-cv');
      if (!selectedFile) {
        errCv.classList.add('show');
        isValid = false;
      } else {
        errCv.classList.remove('show');
      }

      // Validação Termos LGPD
      const privacyCheck = document.getElementById('cand-privacy');
      const errPrivacy = document.getElementById('error-cand-privacy');
      if (!privacyCheck.checked) {
        errPrivacy.classList.add('show');
        isValid = false;
      } else {
        errPrivacy.classList.remove('show');
      }

      if (!isValid) {
        switchModalTab('form');
        showToast('Campos Obrigatórios', 'Por favor, revise os campos destacados em vermelho no formulário.', 'error');
        return;
      }

      // Simulação de envio com Loading State
      btnSubmitApplication.disabled = true;
      formSpinner.style.display = 'inline-block';
      btnSubmitText.textContent = 'Enviando sua candidatura...';

      setTimeout(() => {
        closeApplicationModal();
        showToast(
          'Candidatura Enviada com Sucesso!',
          `Obrigado, ${nameInput.value.split(' ')[0]}! Seu currículo para "${formJobTitleHidden.value}" foi cadastrado no sistema da Chiquinha Transportes. Entraremos em contato via WhatsApp e e-mail!`,
          'success',
          8000
        );
      }, 1500);
    });
  }

  // ========================================================
  // 7. MÁSCARAS DE INPUT (CPF E TELEFONE)
  // ========================================================
  const cpfInputs = document.querySelectorAll('#cand-cpf, #login-cpf');
  cpfInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.substring(0, 11);
      if (v.length > 9) {
        v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else if (v.length > 6) {
        v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
      } else if (v.length > 3) {
        v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
      }
      e.target.value = v;
    });
  });

  const phoneInput = document.getElementById('cand-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.substring(0, 11);
      if (v.length > 10) {
        v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      }
      e.target.value = v;
    });
  }

  // ========================================================
  // 8. FILTROS RÁPIDOS (CHIPS) & BUSCA
  // ========================================================
  if (filterChips) {
    filterChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;

      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      currentFilter = chip.getAttribute('data-filter');
      renderJobs();
    });
  }

  // Input de busca com botão de limpar
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = currentSearchQuery.length > 0 ? 'block' : 'none';
      }
      renderJobs();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchQuery = '';
      clearSearchBtn.style.display = 'none';
      renderJobs();
      searchInput.focus();
    });
  }

  // Selects de Localidade e Departamento
  if (locationSelect) {
    locationSelect.addEventListener('change', (e) => {
      currentLocation = e.target.value;
      renderJobs();
    });
  }

  if (departmentSelect) {
    departmentSelect.addEventListener('change', (e) => {
      currentDepartment = e.target.value;
      renderJobs();
    });
  }

  if (btnSubmitSearch) {
    btnSubmitSearch.addEventListener('click', () => {
      renderJobs();
      const vagasSection = document.getElementById('vagas');
      if (vagasSection) {
        vagasSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (btnResetFilters) {
    btnResetFilters.addEventListener('click', () => {
      currentFilter = 'todos';
      currentSearchQuery = '';
      currentLocation = 'todos';
      currentDepartment = 'todas';

      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      if (locationSelect) locationSelect.value = 'todos';
      if (departmentSelect) departmentSelect.value = 'todas';

      document.querySelectorAll('.chip').forEach(c => {
        if (c.getAttribute('data-filter') === 'todos') {
          c.classList.add('active');
        } else {
          c.classList.remove('active');
        }
      });

      renderJobs();
    });
  }

  // ========================================================
  // 9. BANCO DE TALENTOS & ÁREA DO CANDIDATO
  // ========================================================
  if (btnOpenTalentModal) {
    btnOpenTalentModal.addEventListener('click', () => {
      const talentJob = JOBS_DATA.find(j => j.id === 'CQ-408') || {
        id: 'CQ-TALENT',
        title: 'Banco de Talentos Chiquinha Transportes'
      };
      openApplicationModal(talentJob);
    });
  }

  function openLoginModal() {
    candidateLoginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLoginModal() {
    candidateLoginModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnCandidateArea) btnCandidateArea.addEventListener('click', openLoginModal);
  if (btnCandidateAreaMobile) btnCandidateAreaMobile.addEventListener('click', () => {
    closeDrawer();
    openLoginModal();
  });
  if (btnFooterCandidateLogin) btnFooterCandidateLogin.addEventListener('click', openLoginModal);

  const btnFooterCandidateArea = document.getElementById('footer-candidate-area');
  if (btnFooterCandidateArea) btnFooterCandidateArea.addEventListener('click', (e) => {
    e.preventDefault();
    openLoginModal();
  });
  if (closeLoginBtn) closeLoginBtn.addEventListener('click', closeLoginModal);

  if (btnDoLogin) {
    btnDoLogin.addEventListener('click', () => {
      const cpf = document.getElementById('login-cpf').value;
      const pass = document.getElementById('login-pass').value;

      if (!cpf || !pass) {
        showToast('Atenção', 'Informe seu CPF e senha cadastrada para acessar.', 'error');
        return;
      }

      btnDoLogin.innerHTML = '<span class="spinner"></span> Acessando...';
      btnDoLogin.disabled = true;

      setTimeout(() => {
        btnDoLogin.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Acessar Painel';
        btnDoLogin.disabled = false;
        closeLoginModal();
        showToast(
          'Bem-vindo à Área do Candidato!',
          'Seu painel foi carregado. Você não possui processos pendentes de documentos no momento.',
          'success',
          6000
        );
      }, 1200);
    });
  }

  if (btnQuickCvAccess) {
    btnQuickCvAccess.addEventListener('click', () => {
      const cpf = document.getElementById('login-cpf').value;
      if (!cpf) {
        showToast('Consulta Rápida', 'Digite seu CPF no campo acima para consultar o status de sua inscrição.', 'error');
        return;
      }
      closeLoginModal();
      showToast(
        'Status da Candidatura',
        `Currículo localizado para o CPF informado! Seu perfil está em fase de triagem pela equipe de RH da Chiquinha Transportes.`,
        'success',
        7000
      );
    });
  }

  // ========================================================
  // 10. FAQ ACCORDION
  // ========================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ========================================================
  // 11. MOBILE DRAWER MENU
  // ========================================================
  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Fechar modais ao clicar no backdrop escuro
  window.addEventListener('click', (e) => {
    if (e.target === jobDetailsModal) closeJobDetails();
    if (e.target === applicationModal) closeApplicationModal();
    if (e.target === candidateLoginModal) closeLoginModal();
  });

  // Fechar modais com tecla ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeJobDetails();
      closeApplicationModal();
      closeLoginModal();
      closeDrawer();
    }
  });

  // ========================================================
  // 12. TOAST NOTIFICATION UTILITY
  // ========================================================
  function showToast(title, message, type = 'info', duration = 5000) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';

    toast.innerHTML = `
      <div class="toast-icon"><i class="${iconClass}"></i></div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Fechar notificação">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      removeToast(toast);
    });

    setTimeout(() => {
      removeToast(toast);
    }, duration);
  }

  function removeToast(toast) {
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }

  // ========================================================
  // 13. TEMA CLARO / ESCURO COM ANIMAÇÃO EXPANSIVA DE TELA
  // ========================================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const rippleOverlay = document.getElementById('theme-ripple-overlay');

  const savedTheme = localStorage.getItem('cq_theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = document.documentElement.getAttribute('data-theme') || savedTheme || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(initialTheme, false);

  function applyTheme(theme, animate = false, clickEvent = null) {
    const isDark = theme === 'dark';
    updateToggleButtons(isDark);

    if (!animate) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('cq_theme', theme);
      return;
    }

    // Calcula a origem da expansão circular a partir do clique ou botão
    let x = window.innerWidth / 2;
    let y = 60;
    if (clickEvent) {
      if (clickEvent.clientX && clickEvent.clientY) {
        x = clickEvent.clientX;
        y = clickEvent.clientY;
      } else if (clickEvent.currentTarget) {
        const rect = clickEvent.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    } else if (themeToggleBtn) {
      const rect = themeToggleBtn.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Método 1: View Transitions API (se suportado pelo navegador)
    if (document.startViewTransition) {
      try {
        const transition = document.startViewTransition(() => {
          document.documentElement.setAttribute('data-theme', theme);
          localStorage.setItem('cq_theme', theme);
        });

        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius * 1.05}px at ${x}px ${y}px)`
              ]
            },
            {
              duration: 650,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        });
        return;
      } catch (err) {
        // Fallback para overlay caso a API falhe
      }
    }

    // Método 2 (Universal): Ripple Overlay que cobre o site inteiro
    if (rippleOverlay) {
      const targetBg = isDark ? '#0b0f19' : '#f8fafc';
      rippleOverlay.style.backgroundColor = targetBg;
      rippleOverlay.style.setProperty('--ripple-x', `${x}px`);
      rippleOverlay.style.setProperty('--ripple-y', `${y}px`);
      rippleOverlay.style.setProperty('--ripple-r', `${maxRadius * 1.08}px`);

      rippleOverlay.classList.remove('ripple-active');
      void rippleOverlay.offsetWidth;
      rippleOverlay.classList.add('ripple-active');

      setTimeout(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('cq_theme', theme);
      }, 300);

      setTimeout(() => {
        rippleOverlay.style.transition = 'opacity 0.25s ease';
        rippleOverlay.style.opacity = '0';
        setTimeout(() => {
          rippleOverlay.classList.remove('ripple-active');
          rippleOverlay.style.transition = '';
          rippleOverlay.style.opacity = '';
        }, 250);
      }, 650);
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('cq_theme', theme);
    }
  }

  function updateToggleButtons(isDark) {
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'title',
        isDark ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'
      );
      themeToggleBtn.setAttribute(
        'aria-label',
        isDark ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'
      );
    }

    const mobileIcon = document.getElementById('mobile-theme-icon');
    const mobileText = document.getElementById('mobile-theme-text');
    if (mobileIcon && mobileText) {
      if (isDark) {
        mobileIcon.className = 'fa-solid fa-sun text-gold';
        mobileText.textContent = 'Modo Claro';
      } else {
        mobileIcon.className = 'fa-solid fa-moon';
        mobileText.textContent = 'Modo Escuro';
      }
    }
  }

  function handleToggleClick(e) {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true, e);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', handleToggleClick);
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', handleToggleClick);
  }

  // ========================================================
  // 14. ABERTURA DO SITE (VÍDEO DE INTRODUÇÃO EM ASSETS - 3s)
  // ========================================================
  const introOverlay = document.getElementById('site-intro-overlay');
  const introVideo = document.getElementById('intro-video');
  const introAudioBtn = document.getElementById('intro-audio-btn');
  const introAudioIcon = document.getElementById('intro-audio-icon');
  const introAudioText = document.getElementById('intro-audio-text');
  const introSkipBtn = document.getElementById('intro-skip-btn');
  const introEnterBtn = document.getElementById('intro-enter-btn');
  const introProgressFill = document.getElementById('intro-progress-fill');
  const btnReplayIntro = document.getElementById('btn-replay-intro');

  const TARGET_INTRO_SECONDS = 3;
  let introClosed = false;
  let introClosingStarted = false;
  let autoCloseTimer = null;

  function configureIntroSpeed() {
    if (!introVideo) return;
    const dur = (introVideo.duration && !isNaN(introVideo.duration) && introVideo.duration > 0)
      ? introVideo.duration
      : 10;
    const speed = dur / TARGET_INTRO_SECONDS; // Vídeo acelerado para finalizar em 3s
    introVideo.defaultPlaybackRate = speed;
    introVideo.playbackRate = speed;
  }

  function startAutoCloseTimer() {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = setTimeout(() => {
      closeIntroVideo();
    }, (TARGET_INTRO_SECONDS * 1000) + 150);
  }

  function fadeOutAudio(durationMs = 700) {
    if (!introVideo || introVideo.muted || introVideo.volume <= 0) return;
    const startVol = introVideo.volume;
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      introVideo.volume = Math.max(0, startVol * (1 - progress));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  function initIntroVideo() {
    if (!introOverlay || !introVideo) return;

    // Bloqueia rolagem do fundo enquanto a abertura estiver ativa
    document.body.style.overflow = 'hidden';

    // Configura a velocidade equilibrada para 5 segundos
    configureIntroSpeed();
    introVideo.addEventListener('loadedmetadata', configureIntroSpeed);
    introVideo.addEventListener('canplay', configureIntroSpeed);
    introVideo.addEventListener('play', configureIntroSpeed);

    // Reprodução automática acelerada (muted por padrão para compatibilidade nos navegadores)
    introVideo.muted = true;
    const playPromise = introVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        configureIntroSpeed();
        startAutoCloseTimer();
      }).catch(() => {
        console.log('Autoplay aguardando interação do usuário.');
      });
    }

    // Atualização da barra de progresso da abertura e disparo antecipado da transição suave
    introVideo.addEventListener('timeupdate', () => {
      if (introVideo.duration && introProgressFill) {
        const pct = Math.min(100, (introVideo.currentTime / introVideo.duration) * 100);
        introProgressFill.style.width = `${pct}%`;
      }

      // Inicia a transição suave antecipada nos últimos instantes do vídeo para crossfade perfeito
      if (introVideo.duration && (introVideo.duration - introVideo.currentTime <= 1.0) && !introClosingStarted) {
        closeIntroVideo();
      }
    });

    // Quando o vídeo da abertura terminar
    introVideo.addEventListener('ended', () => {
      closeIntroVideo();
    });

    // Botão de alternar áudio (Som ligado / mudo)
    if (introAudioBtn) {
      introAudioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        introVideo.muted = !introVideo.muted;
        if (introVideo.muted) {
          if (introAudioIcon) introAudioIcon.className = 'fa-solid fa-volume-xmark';
          if (introAudioText) introAudioText.textContent = 'Ativar Som';
        } else {
          introVideo.volume = 1;
          if (introAudioIcon) introAudioIcon.className = 'fa-solid fa-volume-high text-gold';
          if (introAudioText) introAudioText.textContent = 'Desativar Som';
        }
      });
    }

    // Botão para pular a abertura
    if (introSkipBtn) {
      introSkipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeIntroVideo();
      });
    }

    // Botão inferior para acessar o site
    if (introEnterBtn) {
      introEnterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeIntroVideo();
      });
    }

    // Tecla Escape para pular a abertura
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !introClosed) {
        closeIntroVideo();
      }
    });
  }

  function closeIntroVideo() {
    if (introClosed || !introOverlay) return;
    introClosed = true;
    introClosingStarted = true;
    clearTimeout(autoCloseTimer);

    // Fade-out suave do áudio
    fadeOutAudio(800);

    // Inicia a transição visual suave do overlay (fade out + blur + leve zoom ótico)
    introOverlay.classList.add('intro-hidden');

    // Desbloqueia rolagem e ativa a entrada suave/revelação dos elementos do site
    document.body.style.overflow = '';
    document.body.classList.add('site-revealed');

    // Mantém o vídeo rodando suavemente durante a dissolução de 1.15s antes de pausar
    setTimeout(() => {
      if (introVideo) {
        introVideo.pause();
      }
      introOverlay.style.display = 'none';
    }, 1150);
  }

  function replayIntroVideo() {
    if (!introOverlay || !introVideo) return;
    introClosed = false;
    introClosingStarted = false;
    document.body.classList.remove('site-revealed');
    introOverlay.style.display = 'flex';
    void introOverlay.offsetWidth; // reflow para reiniciar animação
    introOverlay.classList.remove('intro-hidden');
    document.body.style.overflow = 'hidden';
    configureIntroSpeed();
    introVideo.currentTime = 0;
    if (!introVideo.muted) {
      introVideo.volume = 1;
    }
    startAutoCloseTimer();
    introVideo.play().catch(() => { });
  }

  if (btnReplayIntro) {
    btnReplayIntro.addEventListener('click', (e) => {
      e.preventDefault();
      replayIntroVideo();
    });
  }

  initIntroVideo();

  // ========================================================
  // 15. INICIALIZAÇÃO
  // ========================================================
  renderJobs();
});
