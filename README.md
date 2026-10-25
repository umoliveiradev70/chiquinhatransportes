# Chiquinha Transportes — Portal Corporativo de Carreiras e Recrutamento

> **"Seu destino, nosso compromisso."**  
> Plataforma corporativa de atração de talentos, recrutamento e seleção da Chiquinha Transportes, desenvolvida com padrões avançados de experiência do usuário (UX/UI de alto padrão), integração serverless com Firebase e entrega transacional de currículos via Resend API.

---

## Sumário

1. [Visão Geral e Propósito](#visão-geral-e-propósito)
2. [Arquitetura da Solução e Integrações](#arquitetura-da-solução-e-integrações)
   - [Diagrama de Fluxo e Integração de Dados](#diagrama-de-fluxo-e-integração-de-dados)
   - [Autenticação e Gestão de Identidade (Firebase Authentication)](#autenticação-e-gestão-de-identidade-firebase-authentication)
   - [Armazenamento e Sincronização em Tempo Real (Cloud Firestore)](#armazenamento-e-sincronização-em-tempo-real-cloud-firestore)
   - [Notificações e Envio Transacional de Currículos (Resend API)](#notificações-e-envio-transacional-de-currículos-resend-api)
   - [Camada de Backend Híbrida (Node.js e Vercel Serverless Functions)](#camada-de-backend-híbrida-nodejs-e-vercel-serverless-functions)
3. [Módulos do Sistema](#módulos-do-sistema)
   - [Portal Público de Vagas](#portal-público-de-vagas)
   - [Área do Candidato](#área-do-candidato)
   - [Painel Administrativo do RH](#painel-administrativo-do-rh)
4. [Segurança, Governança e Conformidade com a LGPD](#segurança-governança-e-conformidade-com-a-lgpd)
5. [Design System e Identidade Visual](#design-system-e-identidade-visual)
6. [Tecnologias Utilizadas](#tecnologias-utilizadas)
7. [Estrutura de Arquivos do Projeto](#estrutura-de-arquivos-do-projeto)
8. [Configuração do Ambiente e Credenciais](#configuração-do-ambiente-e-credenciais)
9. [Instruções de Execução Local](#instruções-de-execução-local)
10. [Guia de Implantação em Produção](#guia-de-implantação-em-produção)
11. [Recursos de Acessibilidade e Teclas de Atalho](#recursos-de-acessibilidade-e-teclas-de-atalho)

---

## Visão Geral e Propósito

O **Portal Corporativo de Carreiras da Chiquinha Transportes** é uma solução web projetada para centralizar o processo seletivo da companhia. A plataforma atende motoristas rodoviários de carga pesada, operadores logísticos, mecânicos de frota e equipes corporativas e administrativas, cobrindo a matriz e as filiais estratégicas distribuídas pelo território nacional.

A solução é composta por três camadas integradas:
- **Portal Público de Carreiras**: Apresentação institucional da frota, catálogo dinâmico de oportunidades abertas, busca multicritério, canal de Banco de Talentos e formulário de inscrição em duas abas com drag-and-drop de currículos.
- **Área do Candidato**: Ambiente restrito com autenticação via Google OAuth para consulta do histórico de candidaturas, identificação por protocolo e acompanhamento de feedbacks do processo seletivo.
- **Painel Administrativo do RH**: Módulo restrito a recrutadores autorizados com métricas da operação em tempo real, pesquisa de currículos, filtragem por fase e atualização de status com envio de notas ao candidato.

---

## Arquitetura da Solução e Integrações

### Diagrama de Fluxo e Integração de Dados

```mermaid
flowchart TD
    subgraph PublicPortal["Portal Público (index.html)"]
        User["Candidato"]
        JobSearch["Busca e Filtros de Vagas"]
        ApplyModal["Formulário de Candidatura + Upload de CV"]
    end

    subgraph AuthLayer["Autenticação & Controle de Acesso"]
        GoogleAuth["Firebase Auth (Google OAuth)"]
        RoleCheck{"Validação de Papel (RBAC)"}
    end

    subgraph BackendLayer["Camada Backend & Processamento"]
        Endpoint["POST /api/send-application (Node.js / Vercel Serverless)"]
        Resend["Resend API (Envio de E-mail Transacional com Anexo)"]
        RHEmail["Caixa de Entrada do RH (umoliveiradev@gmail.com)"]
    end

    subgraph DataLayer["Persistência & Regras de Negócio"]
        Firestore["Cloud Firestore (Coleção: applications)"]
        Rules["Security Rules (Controle por userId e admins)"]
    end

    subgraph PrivatePortals["Módulos Privados"]
        CandidateArea["Área do Candidato (candidato.html)"]
        AdminArea["Painel Administrativo do RH (admin.html)"]
    end

    User --> JobSearch
    JobSearch --> ApplyModal
    ApplyModal --> GoogleAuth
    GoogleAuth --> Endpoint
    Endpoint --> Resend
    Resend --> RHEmail
    Endpoint --> Firestore
    Firestore --> Rules

    User -. Consulta Candidaturas .-> GoogleAuth
    GoogleAuth --> RoleCheck
    RoleCheck -- "Candidato Autenticado" --> CandidateArea
    RoleCheck -- "Administrador Autorizado" --> AdminArea
    CandidateArea <-- Leitura de Inscrições do userId --- Firestore
    AdminArea <-- Gestão e Atualização de Status --- Firestore
```

### Autenticação e Gestão de Identidade (Firebase Authentication)

A plataforma utiliza o provedor Google OAuth do **Firebase Authentication** para autenticação unificada sem fricção:
- Elimina a necessidade de criação de senhas manuais, reduzindo a taxa de abandono durante a candidatura.
- Coleta automática de dados confiáveis de identificação (nome completo, e-mail verificado e foto de perfil).
- Roteamento inteligente pós-autenticação:
  - Usuários convencionais são encaminhados para a **Área do Candidato** (`candidato.html`).
  - O e-mail administrativo principal (`umoliveiradev@gmail.com`) ou perfis registrados na coleção de administradores são redirecionados automaticamente para o **Painel Administrativo** (`admin.html`).

### Armazenamento e Sincronização em Tempo Real (Cloud Firestore)

As informações cadastrais e o ciclo de vida dos processos seletivos são persistidos na base de dados NoSQL **Cloud Firestore**:
- **Coleção `applications`**: Armazena os dados da inscrição (identificação do cargo, filial, dados pessoais e profissionais do candidato, CNH, notas, data de submissão e carimbo de data/hora do servidor).
- **Controle de Status do Processo**: Cada documento possui os estados padronizados:
  - `recebida`: Candidatura recém-enviada aguardando primeira análise.
  - `triagem`: Análise curricular em andamento pelo setor de seleção.
  - `entrevista`: Convocação para testes teóricos, práticos ou entrevista individual.
  - `aprovada`: Candidato selecionado para a etapa de admissão/exames.
  - `recusada`: Processo seletivo concluído ou encerrado para a vaga em questão.
- **Notas Administrativas (`adminNote`)**: Canal de retorno direto entre o recrutador e o candidato, visível de forma transparente no painel pessoal do candidato.

### Notificações e Envio Transacional de Currículos (Resend API)

A transmissão de currículos e fichas cadastrais é executada via integração direta com a **Resend API**:
- **Privacidade e Redução de Superfície de Ataque**: O currículo enviado pelo candidato não é armazenado em buckets públicos de armazenamento em nuvem. O documento é processado em memória como anexo codificado e enviado diretamente à equipe de Recursos Humanos.
- **Validação de Conteúdo e Formato**: Suporte restrito a formatos profissionais padrão (`application/pdf`, `application/msword` e `application/vnd.openxmlformats-officedocument.wordprocessingml.document`).
- **Resiliência Transacional**: Em caso de oscilação na entrega de e-mail, o sistema emite respostas HTTP semânticas (400 para inconsistências de validação, 500/502 para indisponibilidade da API externa) e preserva o feedback amigável na interface via notificações flutuantes.

### Camada de Backend Híbrida (Node.js e Vercel Serverless Functions)

A arquitetura foi projetada para operar de modo intercambiável em dois ambientes:
1. **Servidor Local Node.js (`server.js`)**:
   - Implementado com a biblioteca nativa `http`, sem dependência de frameworks externos pesados.
   - Suporte a cabeçalhos `HTTP 206 Partial Content` (Range Requests) para streaming fluido de mídia em alta resolução (vídeo de abertura institucional).
   - Manipulador da rota `POST /api/send-application` com limite de requisição de 8 MB.
2. **Serverless na Vercel (`api/send-application.js`)**:
   - Função Node.js otimizada para execução sob demanda em borda (edge/serverless).
   - Tratamento de CORS, sanitização de caracteres HTML para prevenir injeções maliciosas e payload configurado para conformidade com os limites de execução do plano serverless (máximo de 3 MB recomendado para o anexo).

---

## Módulos do Sistema

### Portal Público de Vagas

O portal principal (`index.html` e `app.js`) reúne os seguintes recursos:

#### 1. Vídeo Institucional de Abertura (Intro Site)
- Execução automática e temporizada do vídeo institucional acelerado com precisão para 3 segundos de duração.
- Barra de progresso linear com gradiente dinâmico.
- Controles audiovisuais: botão de alternância de áudio (início em mudo para garantir conformidade com políticas de autoplay dos navegadores), botão "Pular Abertura", botão de acesso direto e suporte ao fechamento imediato via tecla `Escape`.
- Transição visual contínua sem cortes abruptos: dissolução progressiva (`filter: blur`, leve `scale` óptico) acompanhada de atenuação logarítmica de áudio (`fadeOutAudio` via `requestAnimationFrame`) e revelação sequencial dos componentes da página (`staggered reveal`).
- Mecanismo para rever o vídeo a qualquer momento via botão dedicado na seção Hero.

#### 2. Mecanismo de Busca e Filtros Avançados
- **Pesquisa Textual**: Busca por palavras-chave com indexação dinâmica em tempo real (título do cargo, requisitos, atribuições, tags e cidades).
- **Filtro Geográfico por Unidade / Filial**:
  - Pouso Alegre - MG (Matriz Operacional)
  - Betim - MG (Filial Grande BH)
  - Campinas - SP
  - São Paulo - SP
  - Rio de Janeiro - RJ
  - Curitiba - PR
- **Filtro Setorial / Departamental**:
  - Motoristas & Operacional
  - Logística & Armazenagem
  - Manutenção de Frota
  - Administrativo & RH
  - Segurança Patrimonial & Facilities
- **Chips de Seleção Rápida**: Categorias dedicadas para navegação ágil, incluindo filtro afirmativo para oportunidades reservadas a Pessoas com Deficiência (PcD).
- **Indicador Dinâmico**: Badge numérico que reflete imediatamente a quantidade de vagas que satisfazem os critérios combinados.

#### 3. Modal de Candidatura em Múltiplas Abas
- **Aba de Formulário**: Coleta de dados pessoais estruturados, número de telefone celular/WhatsApp com máscara interativa, cidade/UF, categoria da Carteira Nacional de Habilitação (CNH categorias B, C, D, E ou Não Aplicável), observações gerais e termo obrigatório de consentimento da LGPD.
- **Aba de Requisitos e Benefícios**: Especificação dos desafios da função, qualificações obrigatórias, diferenciais desejáveis e grade completa de benefícios corporativos.
- **Mecanismo de Upload Drag-and-Drop**: Zona de transferência interativa com suporte para arrastar e soltar arquivos ou seleção via navegador, validação de tamanho (máximo de 5 MB) e pré-visualização detalhada com metadados e botão de substituição.

#### 4. Banco de Talentos Geral
- Acesso rápido para envio de currículo quando o perfil do profissional não coincidir com as vagas imediatas em aberto, indexando o cadastro sob o identificador institucional `CQ-TALENT`.

#### 5. Seção Institucional e Central de Dúvidas
- Apresentação da trajetória de mais de 25 anos da Chiquinha Transportes, princípios corporativos e painel com métricas de frota (+1.200 colaboradores, +850 veículos pesados, +45 filiais e índice de 99,4% de pontualidade rodoviária).
- Central de Perguntas Frequentes (FAQ) interativa no padrão sanfona (accordion) com esclarecimentos sobre prazos médios de retorno, benefícios e vagas afirmativas.

#### 6. Alternador de Tema Escuro e Claro (Dark/Light Mode)
- Suporte à `View Transitions API` nativa com mecanismo circular expansivo a partir do ponto exato de interação do usuário.
- Persistência das preferências no `localStorage` sob o parâmetro `cq_theme`.
- Execução de script no cabeçalho antes do carregamento do DOM para mitigar efeitos indesejados de oscilação visual (FOUC).

---

### Área do Candidato

A interface do candidato (`candidato.html` e `candidato.js`) oferece acompanhamento transparente e direto das inscrições realizadas:

- **Autenticação Unificada**: Inicialização por meio de login com o Google, eliminando a criação de cadastros adicionais.
- **Painel de Inscrições Pessoais**: Consulta automática das candidaturas associadas exclusivamente ao `userId` do candidato autenticado.
- **Identificação por Protocolo**: Cada processo recebe um identificador de protocolo único derivado da chave primária do documento no Firestore.
- **Status Atualizado em Tempo Real**: Notificação visual da fase de recrutamento (Recebida, Em triagem, Entrevista, Aprovada ou Encerrada).
- **Comunicação do RH**: Exibição em destaque de observações, orientações de comparecimento e mensagens personalizadas cadastradas pelos recrutadores.
- **Confirmação de Documentação**: Garantia de registro de entrega do currículo à equipe de Recursos Humanos.

---

### Painel Administrativo do RH

O módulo administrativo (`admin.html` e `admin.js`) fornece as ferramentas para a equipe de atração e seleção gerenciar as demandas corporativas:

- **Controle de Acesso Baseado em Funções (RBAC)**: Bloqueio estrito de acesso para usuários não autorizados no Firebase Authentication e na base de dados.
- **Painel de Indicadores Operacionais**: Métricas consolidadas em cartões de desempenho:
  - Total geral de candidaturas cadastradas.
  - Novas inscrições pendentes de triagem.
  - Processos em andamento ativo (triagem e entrevistas agendadas).
  - Candidaturas aprovadas para contratação.
- **Filtros e Mecanismo de Busca Interno**: Localização de candidatos por nome completo, e-mail de contato, cargo concorrido ou status do processo.
- **Atualização Direta de Status**: Seletor integrado em cada card para alterar o estágio do candidato com persistência imediata no Cloud Firestore.
- **Mensageria ao Candidato**: Campo de texto para inserção de anotações e retornos que são refletidos diretamente na Área do Candidato.

---

## Segurança, Governança e Conformidade com a LGPD

A arquitetura foi implementada em estrita conformidade com os princípios da Lei Geral de Proteção de Dados (Lei nº 13.709/2018):

1. **Consentimento Explícito**:
   - O formulário de candidatura possui cláusula obrigatória de consentimento para tratamento dos dados exclusivamente para fins de processos seletivos da Chiquinha Transportes.
2. **Minimização de Dados e Não Exposição de Arquivos**:
   - Documentos de currículo não permanecem expostos em diretórios estáticos ou buckets públicos de armazenamento em nuvem. A tramitação ocorre diretamente em canal criptografado via API de e-mail transacional para os analistas responsáveis.
3. **Regras de Segurança Granulares do Cloud Firestore (`firestore.rules`)**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return signedIn()
        && (request.auth.token.email == 'umoliveiradev@gmail.com'
          || exists(/databases/$(database)/documents/admins/$(request.auth.uid)));
    }

    match /applications/{applicationId} {
      allow create: if signedIn() && request.resource.data.userId == request.auth.uid;
      allow read: if signedIn()
        && (resource.data.userId == request.auth.uid || isAdmin());
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    match /admins/{adminId} {
      allow read: if signedIn() && request.auth.uid == adminId;
      allow write: if false;
    }
  }
}
```

- **Isolamento de Leitura**: O candidato autenticado possui permissão de leitura exclusivamente sobre registros vinculados ao seu próprio identificador (`request.auth.uid`).
- **Restrição de Modificação e Exclusão**: Apenas administradores autenticados com permissão explícita podem alterar status, inserir notas ou excluir candidaturas.
- **Proteção do Cadastro de Administradores**: A coleção `admins` possui escrita bloqueada no cliente (`allow write: if false`), sendo administrada via Console administrativo ou scripts com privilégios de serviço.

---

## Design System e Identidade Visual

O ecossistema visual foi estruturado com CSS Custom Properties (Variáveis CSS), priorizando contraste, legibilidade e elegância institucional:

### Paleta Cromática Institucional

| Aplicação | Código Hexadecimal | Descrição e Finalidade |
|---|---|---|
| **Âmbar Ouro (Primária)** | `#D97706` / `#F59E0B` | Identidade visual corporativa, energia rodoviária e destaque em botões de ação principal. |
| **Âmbar Dourado Claro** | `#FBBF24` / `#FEF3C7` | Variações para estados de foco, hover e superfícies suaves de destaque. |
| **Ônix e Grafite (Fundo Escuro)** | `#0B0F19` / `#111827` | Fundos do modo escuro, conferindo estética sóbria e alto contraste. |
| **Slate Suave (Superfícies Dark)** | `#1E293B` / `#334155` | Cards, modais flutuantes e bordas estruturadas no modo escuro. |
| **Gelo e Neve (Fundo Claro)** | `#F8FAFC` / `#FFFFFF` | Fundos do modo claro, assegurando claridade e organização visual. |
| **Esmeralda (Sucesso)** | `#10B981` / `#D1FAE5` | Confirmação de envio e badges de status aprovado. |
| **Carmesim (Atenção/Erro)** | `#EF4444` / `#FEE2E2` | Indicadores de campos obrigatórios não preenchidos e falhas de envio. |
| **Safira (Informativo)** | `#3B82F6` / `#DBEAFE` | Indicadores de processos recebidos e avisos operacionais. |

### Tipografia

- **Família Display (Títulos e Números)**: `Outfit` (Google Fonts) — moderna, geométrica e com presença corporativa marcante.
- **Família de Leitura (Corpo de Texto e Controles)**: `Inter` (Google Fonts) — referência em legibilidade em telas de alta e baixa densidade de pixels.

---

## Tecnologias Utilizadas

| Camada | Tecnologia | Detalhes e Justificativa |
|---|---|---|
| **Marcação** | HTML5 Semântico | Uso de elementos semânticos (`header`, `nav`, `main`, `section`, `article`, `dialog`, `footer`) com atributos de acessibilidade (WAI-ARIA). |
| **Estilização** | CSS3 Moderno | Grid bidimensional, Flexbox, animações por keyframes, efeitos de vidro fosco (`backdrop-filter`) e variáveis CSS dinâmicas. |
| **Lógica de Interface** | JavaScript (ES6+ Vanilla) | Código nativo sem dependência de bibliotecas pesadas de terceiros, garantindo máxima velocidade de carregamento e portabilidade. |
| **Autenticação** | Firebase Authentication | Fluxo seguro de autenticação com provedor Google OAuth via popup. |
| **Persistência** | Cloud Firestore | Banco de dados NoSQL com sincronização de coleções e controle estrito de permissões. |
| **Envio Transacional** | Resend API | API corporativa de entrega de e-mails em formato HTML com suporte a anexos em Base64. |
| **Ambiente de Execução Local** | Node.js Nativo | Servidor HTTP embutido com tratamento de range de bytes para vídeo e roteamento de API local. |
| **Execução em Produção** | Vercel Serverless | Endpoint serverless Node.js dedicado ao processamento seguro de candidaturas. |
| **Iconografia** | Font Awesome 6.5.1 | Biblioteca de ícones vetoriais em formato SVG/Webfont carregada via CDN. |

---

## Estrutura de Arquivos do Projeto

```text
cqhtrs-main1/
├── assets/
│   ├── banner.jpg                 # Fotografia institucional da frota rodoviária
│   ├── banner_black.png           # Banner principal do Hero para o Tema Escuro
│   ├── banner_light.png           # Banner principal do Hero para o Tema Claro
│   ├── introsite.mp4              # Vídeo oficial de abertura institucional (3s)
│   └── logo.png                   # Logomarca oficial da Chiquinha Transportes
├── api/
│   └── send-application.js        # Serverless Function da Vercel para envio via Resend
├── index.html                     # Estrutura principal do portal público de carreiras
├── styles.css                     # Folha de estilos unificada, Design System e animações
├── app.js                        # Lógica da interface do portal, catálogo de vagas e eventos
├── candidato.html                 # Página restrita da Área do Candidato
├── candidato.js                   # Lógica de autenticação e renderização de status do candidato
├── admin.html                     # Página restrita do Painel Administrativo do RH
├── admin.js                       # Lógica do painel de recrutadores, estatísticas e filtros
├── portal.css                     # Estilos complementares compartilhados pelos painéis
├── firebase-config.js             # Credenciais públicas de inicialização do Firebase Client SDK
├── firebase-service.js            # Módulo de inicialização do Auth e Firestore
├── firestore.rules                # Regras de segurança e controle de acesso do Cloud Firestore
├── server.js                      # Servidor HTTP Node.js nativo para desenvolvimento local
└── README.md                      # Documentação técnica e operacional do ecossistema
```

---

## Configuração do Ambiente e Credenciais

### 1. Configuração do Firebase Client (`firebase-config.js`)

Assegure que os parâmetros do seu projeto no Firebase Console estejam presentes no arquivo `firebase-config.js`:

```javascript
window.CQ_FIREBASE_CONFIG = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.firebasestorage.app",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
  measurementId: "SEU_MEASUREMENT_ID"
};
```

### 2. Variáveis de Ambiente para a Resend API

Tanto no ambiente de desenvolvimento local quanto no ambiente de produção na Vercel, defina as seguintes chaves de ambiente:

```bash
# Chave de API gerada no painel da Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# E-mail de destino da equipe de Recursos Humanos para recebimento dos currículos
RESEND_TO_EMAIL=umoliveiradev@gmail.com

# Endereço remetente verificado na Resend
RESEND_FROM_EMAIL=onboarding@resend.dev
```

> **Atenção sobre Segurança:** Nunca insira a chave `RESEND_API_KEY` diretamente nos arquivos JavaScript executados no navegador do cliente. Esta credencial deve permanecer restrita à execução no servidor Node.js ou na Serverless Function. Em produção, configure um domínio corporativo verificado (exemplo: `carreiras@chiquinhatransportes.com.br`) na plataforma Resend para evitar filtros de spam.

---

## Instruções de Execução Local

### Execução com o Servidor Node.js Nativo (Recomendado)

O projeto inclui um servidor HTTP nativo (`server.js`) configurado com tratamento de cabeçalhos parciais (`Range Requests`), necessário para o funcionamento otimizado do vídeo de abertura e para o processamento de candidaturas locais via Resend.

1. Confirme a instalação do **Node.js** (versão 18.x ou superior recomendada).
2. Abra o terminal na pasta raiz do projeto e configure as variáveis de ambiente necessárias:
   - **PowerShell (Windows)**:
     ```powershell
     $env:RESEND_API_KEY="sua_chave_resend"
     $env:RESEND_TO_EMAIL="umoliveiradev@gmail.com"
     $env:RESEND_FROM_EMAIL="onboarding@resend.dev"
     node server.js
     ```
   - **Bash / Linux / macOS**:
     ```bash
     export RESEND_API_KEY="sua_chave_resend"
     export RESEND_TO_EMAIL="umoliveiradev@gmail.com"
     export RESEND_FROM_EMAIL="onboarding@resend.dev"
     node server.js
     ```
3. Acesse a aplicação em seu navegador:
   ```text
   http://localhost:3000
   ```

### Execução com a Extensão Live Server (VS Code)

Para testes estáticos rápidos da camada de layout:
1. No Visual Studio Code, abra a pasta do projeto.
2. Com o arquivo `index.html` selecionado, clique com o botão direito e escolha **"Open with Live Server"**.
3. *Nota*: Para testar o envio de candidaturas e envio de e-mails, o servidor Node.js ou a implantação na Vercel deve estar ativo para responder pela rota `/api/send-application`.

---

## Guia de Implantação em Produção

### 1. Configuração do Firebase Console
1. Acesse o [Firebase Console](https://console.firebase.google.com/) e crie ou selecione o projeto correspondente.
2. Em **Authentication > Sign-in method**, ative o provedor **Google**.
3. Em **Authentication > Settings > Authorized domains**, cadastre o domínio da sua aplicação (exemplo: `seu-projeto.vercel.app`).
4. Em **Firestore Database**, crie a base de dados no modo de produção e aplique o conteúdo de `firestore.rules`.
5. Para autorizar novos administradores além do e-mail padrão configurado (`umoliveiradev@gmail.com`), adicione manualmente um documento na coleção `admins` utilizando o `UID` do usuário como identificador do documento.

### 2. Implantação na Plataforma Vercel
1. Conecte o repositório do projeto à sua conta na Vercel.
2. Na seção **Settings > Environment Variables**, cadastre as três variáveis:
   - `RESEND_API_KEY`
   - `RESEND_TO_EMAIL`
   - `RESEND_FROM_EMAIL`
3. Execute a implantação. A Vercel identificará automaticamente o arquivo `api/send-application.js` como uma Serverless Function e roteará as requisições `POST /api/send-application` com segurança.

---

## Recursos de Acessibilidade e Teclas de Atalho

- **Tecla `Escape` (ESC)**: Encerra instantaneamente o vídeo de introdução, modais ativos (candidatura, detalhes de vaga e login) ou o menu gaveta lateral em dispositivos móveis.
- **Preferência de Redução de Movimento (`prefers-reduced-motion`)**: O CSS detecta as configurações de sensibilidade a movimento do sistema operacional e desativa transições de tela e animações de alto consumo de processamento gráfico.
- **Relação de Contraste Homologada**: As combinações de cores entre tipografia e planos de fundo foram testadas para atender aos critérios de contraste exigidos pela norma WCAG AA, assegurando conforto visual em ambientes iluminados ou com baixa luz.
- **Navegação por Teclado e Foco Visível**: Todos os botões, links e campos de formulário contam com anéis de foco evidentes e ordem lógica de tabulação.

---

Chiquinha Transportes • Divisão de Recursos Humanos e Tecnologia da Informação  
Documentação atualizada para a versão de produção.
