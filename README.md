# 🚚 Chiquinha Transportes — Portal Oficial de Carreiras & Vagas

> **"Seu destino, nosso compromisso."**  
> Portal corporativo de atração de talentos, recrutamento e seleção da **Chiquinha Transportes**, desenvolvido com foco em alta performance, experiência do usuário (UX/UI premium inspirada em plataformas como Sólides e Gupy) e acessibilidade.

---

## 📋 Sumário
1. [Visão Geral](#-visão-geral)
2. [Design System & Identidade Visual](#-design-system--identidade-visual)
3. [Funcionalidades do Portal](#-funcionalidades-do-portal)
   - [Vídeo de Abertura Cinematográfico (Intro Site)](#1-vídeo-de-abertura-cinematográfico-intro-site)
   - [Tema Claro e Escuro Dinâmico (Dark/Light Mode)](#2-tema-claro-e-escuro-dinâmico-darklight-mode)
   - [Hero Principal com Banner Inteligente por Tema](#3-hero-principal-com-banner-inteligente-por-tema)
   - [Mecanismo de Busca e Filtros Solides-Style](#4-mecanismo-de-busca-e-filtros-solides-style)
   - [Catálogo Dinâmico de Oportunidades](#5-catálogo-dinâmico-de-oportunidades)
   - [Modal de Candidatura Online & Requisitos em 2 Abas](#6-modal-de-candidatura-online--requisitos-em-2-abas)
   - [Dropzone de Upload de Currículo (Drag & Drop)](#7-dropzone-de-upload-de-currículo-drag--drop)
   - [Validação Robusta e Conformidade com LGPD](#8-validação-robusta-e-conformidade-com-lgpd)
   - [Área do Candidato & Consulta Rápida por CPF](#9-área-do-candidato--consulta-rápida-por-cpf)
   - [Banco de Talentos Institucional](#10-banco-de-talentos-institucional)
   - [Seção Institucional "Quem Somos" & Métricas de Frota](#11-seção-institucional-quem-somos--métricas-de-frota)
   - [Central de Dúvidas (FAQ Accordion Interativo)](#12-central-de-dúvidas-faq-accordion-interativo)
   - [Sistema de Feedback em Tempo Real (Toast Notifications)](#13-sistema-de-feedback-em-tempo-real-toast-notifications)
   - [Navegação Mobile Fluida (Drawer Menu)](#14-navegação-mobile-fluida-drawer-menu)
4. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
5. [Estrutura de Arquivos do Projeto](#-estrutura-de-arquivos-do-projeto)
6. [Como Executar o Projeto Localmente](#-como-executar-o-projeto-localmente)
7. [Atalhos e Acessibilidade](#-atalhos-e-acessibilidade)

---

## 🌟 Visão Geral

O **Portal de Carreiras da Chiquinha Transportes** é uma aplicação web completa desenvolvida para conectar motoristas de caminhão, profissionais de logística, mecânicos e equipes administrativas às oportunidades de emprego da transportadora em suas filiais e rotas pelo Brasil.

O portal foi concebido com os mais altos padrões visuais do mercado:
- Layout fluido, elegante e moderno;
- Componentes com microinterações e transições suaves (`cubic-bezier`);
- Sistema de alternância de tema (Claro/Escuro) sem recarregamento de página;
- Carregamento assíncrono com feedback visual em tempo real.

---

## 🎨 Design System & Identidade Visual

- **Paleta de Cores Institucional**:
  - **Âmbar Dourado** (`#D97706` / `#F59E0B` / `#FBBF24`): Transmite tradição, valor, energia das estradas e movimento.
  - **Ônix Grafite & Slate** (`#0B0F19` / `#111827` / `#1E293B`): Sofisticação e solidez corporativa no modo escuro.
  - **Neve e Papel Suave** (`#F8FAFC` / `#FFFFFF` / `#F1F5F9`): Contraste límpido no modo claro.
- **Tipografia**:
  - **Display / Títulos**: `Outfit` (Google Fonts) — moderna, geométrica e imponente.
  - **Texto Principal**: `Inter` (Google Fonts) — alta legibilidade e clareza.
- **Ícones**: Font Awesome 6.5.1 Pro-grade.

---

## 🚀 Funcionalidades do Portal

### 1. Vídeo de Abertura Cinematográfico (Intro Site)
- **Experiência de boas-vindas**: Reproduz automaticamente um vídeo institucional da frota (`assets/introsite.mp4`) acelerado com precisão para **3 segundos**.
- **Barra de progresso sincronizada**: Acompanha o andamento do clipe em tempo real com gradiente dourado pulsante.
- **Controles interativos**:
  - **Ativar/Desativar Som**: Inicia em *mute* (compatibilidade universal de navegadores) com botão dinâmico para ouvir o áudio.
  - **Pular Abertura**: Encerra a abertura instantaneamente ao clicar ou pressionar a tecla `ESC`.
  - **Botão "Acessar o Site"**: Alternativa de navegação direta na barra inferior.
- **Transição de saída suave (Zero corte seco)**:
  - Disparo antecipado nos últimos instantes para evitar congelamento de quadro ou telas pretas.
  - Efeito óptico de **desfoque progressivo** (`filter: blur(10px)`), **zoom cinematográfico** (`scale(1.06)`) e **fade-out de áudio contínuo** (`fadeOutAudio` via `requestAnimationFrame`).
  - **Revelação escalonada do site** (`staggered reveal`): O Header, Hero, Banner e Card de Busca deslizam suavemente em cascata para seus devidos lugares assim que o vídeo se dissolve.
- **Rever Vídeo**: Botão dedicado no Hero que permite reabrir o vídeo institucional a qualquer momento.

---

### 2. Tema Claro e Escuro Dinâmico (Dark/Light Mode)
- **Alternador de tema no Header**: Botão com animações personalizadas de rotação entre sol (`fa-sun`) e lua (`fa-moon`).
- **Animação expansiva de tela**: Suporte nativo à **View Transitions API** e fallback com efeito circular expansivo (*Ripple Overlay*) cobrindo toda a tela a partir da posição exata do clique.
- **Persistência automática**: Salva a escolha do usuário no `localStorage` sob a chave `cq_theme`.
- **Prevenção de FOUC**: Script inline no `<head>` verifica o tema salvo ou o `prefers-color-scheme` do sistema operacional antes da primeira renderização, evitando piscadas de tela.

---

### 3. Hero Principal com Banner Inteligente por Tema
- **Banner dinâmico adaptativo**:
  - **Modo Claro**: Carrega automaticamente o [`assets/banner_light.png`](assets/banner_light.png) (cena diurna iluminada com caminhões pretos sob céu dourado).
  - **Modo Escuro**: Carrega automaticamente o [`assets/banner_black.png`](assets/banner_black.png) (cena crepuscular/noturna com iluminação dourada dos faróis e fachada).
- **Pré-carregamento (`<link rel="preload">`)**: Imagens pré-carregadas no `<head>` para garantir transição imediata sem recarregar ou piscar.
- **Gradiente de sobreposição cinematográfico**: Garante legibilidade impecável dos textos brancos e destaca os caminhões na lateral direita.
- **Selo pulsante**: Indicador ativo *"Portal de Carreiras Oficial • Chiquinha Transportes"*.

---

### 4. Mecanismo de Busca e Filtros Solides-Style
Card flutuante no Hero inspirado nos portais corporativos da Sólides:
- **Busca por palavra-chave**: Campo com busca em tempo real que filtra por título do cargo, descrição, localidade e tags associadas.
- **Botão de limpar busca**: Botão `X` automático para limpar o campo rapidamente.
- **Filtro por Filial / Localidade**:
  - Pouso Alegre - MG (Matriz)
  - Betim - MG (Filial BH)
  - Campinas - SP
  - São Paulo - SP
  - Rio de Janeiro - RJ
  - Curitiba - PR
- **Filtro por Departamento**:
  - Motoristas & Operacional
  - Logística & Armazenagem
  - Manutenção de Frota
  - Administrativo & RH
  - Segurança Patrimonial & Facilities
- **Botão "Buscar Vagas"**: Executa a busca combinada e rola suavemente até a listagem de vagas.

---

### 5. Catálogo Dinâmico de Oportunidades
- **Chips de Filtro Rápido**:
  - *Todos* (exibe todas as vagas)
  - *Motoristas*
  - *Logística*
  - *Manutenção*
  - *Administrativo*
  - *Vagas PcD* (Pessoas com Deficiência)
- **Contador Dinâmico de Vagas**: Badge em tempo real indicando a quantidade de oportunidades abertas encontradas.
- **Cards de Vagas Ricos em Informações**:
  - Tag de tipo de contrato (CLT Efetivo, Temporário, etc.);
  - Selo exclusivo para **Vagas PcD** com ícone de acessibilidade;
  - Título do cargo;
  - Localização e Rota (ex: *Matriz*, *Rotas Interestaduais*);
  - Botão **"Detalhes"**: Abre a aba de atribuições e requisitos da vaga;
  - Botão **"Candidatar-se"**: Abre diretamente o formulário de inscrição para o cargo.
- **Empty State Inteligente**: Mensagem personalizada quando nenhum resultado coincide com os filtros, incluindo botão de ação rápida para resetar os critérios.

---

### 6. Modal de Candidatura Online & Requisitos em 2 Abas
Modal moderno em tela cheia com navegação por abas integradas:
- **Aba 1: Formulário de Candidatura**:
  - Informações pessoais (Nome Completo, E-mail, WhatsApp com máscara de dígitos);
  - Localização (Cidade e Estado UF);
  - Categoria da CNH (Não aplicável, B, C, D, E);
  - Dropzone de currículo;
  - Campo opcional de observações/mensagem;
  - Checkbox de consentimento com a Lei Geral de Proteção de Dados (LGPD).
- **Aba 2: Requisitos & Atribuições**:
  - Descrição detalhada da posição;
  - Lista de responsabilidades diárias;
  - Requisitos obrigatórios e qualificações desejáveis;
  - Pacote de benefícios (Vale Transporte, Vale Alimentação, Plano de Saúde, Seguro de Vida, etc.);
  - Card de chamada para ação direta com botão de alternância para o formulário.

---

### 7. Dropzone de Upload de Currículo (Drag & Drop)
- **Arrastar e soltar (Drag and Drop)** com feedback visual ao passar o arquivo por cima;
- **Clique para upload**: Integração com o seletor nativo de arquivos do sistema operacional;
- **Formatos aceitos**: Validação estrita para extensões `.pdf`, `.doc` e `.docx`;
- **Limite de tamanho**: Trava de segurança para arquivos de até 5 MB;
- **Feedback visual do arquivo**: Exibe ícone do documento, nome original, tamanho formatado (KB/MB) e botão com ícone de lixeira para remover e anexar outro arquivo.

---

### 8. Validação Robusta e Conformidade com LGPD
- Validação em tempo real e no submit de campos obrigatórios:
  - Nome completo (mínimo de 4 caracteres);
  - E-mail com formato válido regex;
  - Telefone com quantidade correta de dígitos;
  - Cidade preenchida;
  - Currículo anexado obrigatoriamente;
  - Aceite dos Termos de Privacidade e Proteção de Dados (LGPD);
- Destaque em vermelho nos campos inválidos com mensagens de orientação claras;
- Estado de carregamento (*Loading State*) com spinner animado e desativação de cliques duplos durante o envio.

---

### 9. Área do Candidato & Consulta Rápida por CPF
- **Modal de Acesso do Candidato**:
  - Campo de CPF com formatação automática (`000.000.000-00`);
  - Campo de senha segura;
  - Botão de login com simulação de autenticação e spinner de carregamento;
- **Consulta Rápida de Inscrição**:
  - Permite que motoristas e candidatos verifiquem o status do processo seletivo digitando apenas o CPF cadastrado, sem necessidade de senha completa.

---

### 10. Banco de Talentos Institucional
- Seção em banner escuro de alto contraste estilo Sólides;
- Botão *"Cadastrar no Banco de Talentos"*: Abre o formulário geral de candidatura com código especial, permitindo que talentos enviem seus currículos mesmo quando não houver vaga específica aberta no momento.

---

### 11. Seção Institucional "Quem Somos" & Métricas de Frota
- História, missão, visão e compromisso da Chiquinha Transportes ("Mais de 25 anos nas rodovias");
- Imagem institucional da infraestrutura;
- **Grid de Métricas Corporativas**:
  - **+1.200** Colaboradores diretos;
  - **+850** Caminhões modernos na frota própria;
  - **+45** Filiais e pontos de apoio no Brasil;
  - **99.4%** de Pontualidade nas entregas rodoviárias.

---

### 12. Central de Dúvidas (FAQ Accordion Interativo)
Seção de sanfona expansível com perguntas e respostas essenciais:
1. *Como funciona o processo seletivo da Chiquinha Transportes?*
2. *Quais são os principais benefícios oferecidos?*
3. *A empresa possui vagas afirmativas para PcD?*
4. *Qual é o prazo médio de retorno após a candidatura?*
5. *Não encontrei uma vaga na minha cidade. Como posso me candidatar?*

---

### 13. Sistema de Feedback em Tempo Real (Toast Notifications)
Notificações flutuantes no canto superior direito:
- Notificações de **Sucesso** (verde esmeralda com ícone de verificação);
- Notificações de **Atenção/Erro** (vermelho com ícone de alerta);
- Notificações de **Informação** (azul/dourado);
- Temporizador automático para auto-fechamento e botão manual de fechar `X`.

---

### 14. Navegação Mobile Fluida (Drawer Menu)
- Menu gaveta lateral com overlay escurecido e desfoque de fundo (`backdrop-filter: blur(4px)`);
- Links diretos com ícones para todas as seções;
- Alternador de modo escuro adaptado para a experiência mobile;
- Botões de chamada para Área do Candidato e Busca de Vagas.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia | Descrição |
|---|---|---|
| **Estrutura** | HTML5 Semântico | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<dialog>`, `<footer>` |
| **Estilização** | CSS3 Moderno | Custom Properties (Variáveis CSS), CSS Grid, Flexbox, Keyframe Animations, Glassmorphism |
| **Comportamento** | JavaScript (ES6+ Vanilla) | Manipulação do DOM, eventos assíncronos, timers de precisão, validações regex e máscaras |
| **Tipografia** | Google Fonts | Famílias *Inter* e *Outfit* |
| **Iconografia** | Font Awesome 6.5.1 | Biblioteca completa de ícones vetoriais via CDN |
| **Mídia** | HTML5 Video & Áudio | Suporte a streaming de vídeo MP4 nativo |
| **Servidor Local** | Node.js (HTTP nativo) | Servidor estático sem dependências externas com suporte a `HTTP 206 Partial Content` (Range Requests) |

---

## 📁 Estrutura de Arquivos do Projeto

```text
cqhtrs-main1/
├── assets/
│   ├── banner.jpg           # Imagem institucional de apoio da frota
│   ├── banner_black.png     # Banner principal do Hero — Modo Escuro
│   ├── banner_light.png     # Banner principal do Hero — Modo Claro
│   ├── introsite.mp4        # Vídeo oficial de abertura institucional (3s)
│   └── logo.png             # Logotipo oficial da Chiquinha Transportes
├── index.html               # Estrutura HTML completa e semântica do portal
├── styles.css               # Folha de estilos completa, Design System e animações
├── app.js                  # Lógica de negócio, banco de vagas e interatividade
├── server.js                # Servidor HTTP Node.js para execução local
└── README.md                # Documentação técnica e funcional do projeto
```

---

## 💻 Como Executar o Projeto Localmente

### Opção 1: Usando o Servidor Node.js Embutido (Recomendado)
O projeto conta com um servidor HTTP próprio (`server.js`) configurado com suporte a cabeçalhos de *Range Request*, ideal para reproduzir o vídeo de abertura com máxima fluidez:

1. Certifique-se de ter o **Node.js** instalado em seu computador.
2. Abra o terminal na pasta do projeto:
   ```bash
   node server.js
   ```
3. Acesse a aplicação no seu navegador:
   ```text
   http://localhost:3000
   ```

### Opção 2: Extensão Live Server (VS Code)
1. No VS Code, instale a extensão **Live Server**.
2. Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.

---

## ♿ Atalhos e Acessibilidade

- **Tecla `Escape` (ESC)**: Fecha instantaneamente a abertura de vídeo, modais ativos de candidatura ou menu gaveta mobile.
- **Preferência de Movimento Reduzido (`prefers-reduced-motion: reduce`)**: O CSS detecta automaticamente caso o usuário possua sensibilidade a animações no sistema operacional e desativa transições pesadas.
- **Contraste de Cores**: Relação de contraste testada para garantir leitura confortável tanto sob luz intensa (Modo Claro) quanto em baixa luminosidade (Modo Escuro).

---

## Firebase: Área do Candidato e Painel Admin

O projeto inclui autenticação Google, acompanhamento de candidaturas em `candidato.html` e gerenciamento administrativo em `admin.html`.

1. Crie um projeto no Firebase e ative **Authentication > Google** e **Firestore Database**.
2. Copie as credenciais do aplicativo Web para `firebase-config.js`.
3. Publique `firestore.rules` no Firestore. O currículo é enviado ao Resend pelo servidor e não usa Firebase Storage.
4. O e-mail `umoliveiradev@gmail.com` já está autorizado como administrador nas regras. Para outros administradores, crie manualmente no Firestore o documento `admins/{UID_DO_ADMIN}`.
5. Adicione o domínio de produção em **Authentication > Settings > Authorized domains**.

Cada candidatura é gravada na coleção `applications` e o currículo é anexado ao e-mail do RH. O candidato só acessa os próprios registros; o administrador só acessa registros quando estiver autorizado.

### Resend no servidor

Configure estas variáveis de ambiente no servidor Node:

```bash
RESEND_API_KEY=re_xxxxxxxxx
RESEND_TO_EMAIL=umoliveiradev@gmail.com
RESEND_FROM_EMAIL=onboarding@resend.dev
```

Em produção, use um remetente de um domínio verificado no Resend. Nunca coloque `RESEND_API_KEY` no JavaScript do navegador.

---

<p align="center">
  <strong>Chiquinha Transportes</strong> • Portal de Vagas e Carreiras<br>
  Desenvolvido com excelência e dedicação.
</p>
