# 🚛 Chiquinha Transportes — Portal Corporativo de Carreiras

<div align="center">

> *"Seu destino, nosso compromisso."*

![Versão](https://img.shields.io/badge/Versão-2.2.0-d97706?style=for-the-badge)
![Status](https://img.shields.io/badge/Ambiente-Produção-10b981?style=for-the-badge)
![LGPD](https://img.shields.io/badge/LGPD-Conforme-3b82f6?style=for-the-badge)
![Segurança](https://img.shields.io/badge/Antifraude-Verificação%20Obrigatória-7c3aed?style=for-the-badge)
![Tema](https://img.shields.io/badge/Design-Dark%20%2F%20Light-111827?style=for-the-badge)

<p align="center">
  <strong>Plataforma corporativa de atração de talentos, recrutamento e seleção da Chiquinha Transportes.</strong><br>
  Desenvolvida com foco em alta performance visual, segurança de dados, acessibilidade universal e conformidade trabalhista e regulatória.
</p>

</div>

---

## 📑 Sumário

- [Visão Geral Executiva](#-visão-geral-executiva)
- [Pilares e Diferenciais da Plataforma](#-pilares-e-diferenciais-da-plataforma)
- [Arquitetura e Fluxo de Informações](#-arquitetura-e-fluxo-de-informações)
- [Módulos da Solução](#-módulos-da-solução)
  - [1. Portal Público de Carreiras](#1-portal-público-de-carreiras)
  - [2. Área do Candidato](#2-área-do-candidato)
  - [3. Painel de Recrutamento do RH](#3-painel-de-recrutamento-do-rh)
  - [4. Central de Governança e Compliance](#4-central-de-governança-e-compliance)
- [Segurança da Informação e Conformidade Legal](#-segurança-da-informação-e-conformidade-legal)
- [Design System e Identidade Visual](#-design-system-e-identidade-visual)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Acessibilidade e Usabilidade](#-acessibilidade-e-usabilidade)

---

## 🌟 Visão Geral Executiva

O **Portal Corporativo de Carreiras da Chiquinha Transportes** é uma solução digital criada para modernizar e humanizar o processo de seleção da empresa. A plataforma atende desde motoristas de carga pesada rodoviária (carretas, trucks e bitrens) até equipes de logística, manutenção de frota, tecnologia e setores administrativos em todas as filiais do país.

A solução substitui formulários genéricos por uma experiência fluida, transparente e segura, conectando candidatos diretamente à equipe de Recursos Humanos.

---

## 💎 Pilares e Diferenciais da Plataforma

<div align="center">

| Pilar | Descrição |
|:---:|:---|
| 🛡️ **Segurança Antifraude** | Validação obrigatória de autenticidade de e-mail e alerta oficial contra cobranças de taxas em processos seletivos. |
| ⚖️ **Conformidade Legal** | Aderência integral à **LGPD** (Lei 13.709/2018), à **CLT** (Art. 442-A) e à **Lei Antidiscriminação** (Lei 9.029/1995). |
| ⚡ **Performance e Fluidez** | Inicialização instantânea sem frameworks pesados, com vídeo institucional dinâmico e suporte a *Dark/Light Mode*. |
| 🤝 **Transparência Total** | Acompanhamento do status de cada candidatura em tempo real, com identificador único de protocolo e notas do recrutador. |

</div>

---

## 🏗️ Arquitetura e Fluxo de Informações

A plataforma utiliza uma arquitetura baseada em serviços de nuvem seguros, desacoplados e de alta disponibilidade:

```mermaid
flowchart TD
    subgraph PortalPublico["🌐 Portal Público de Carreiras"]
        Candidato["Candidato"]
        Catalogo["Catálogo & Busca de Vagas"]
        FormInscricao["Inscrição & Upload de Currículo"]
    end

    subgraph CamadaAutenticacao["🔐 Gestão de Identidade & Acesso"]
        AuthService["Firebase Authentication"]
        ValidacaoEmail{"E-mail Confirmado?"}
        ControleAcesso{"Papel do Usuário (RBAC)"}
    end

    subgraph Processamento["⚙️ Processamento Seguro"]
        ServicoEmail["Serviço de Mensageria Corporativa"]
        CaixaRH["Caixa de Triagem do RH"]
    end

    subgraph Dados["🗄️ Persistência em Tempo Real"]
        BancoDados["Cloud Firestore (Base Criptografada)"]
        RegrasSeguranca["Regras de Acesso e Isolamento"]
    end

    subgraph ModulosRestritos["🔒 Ambientes Restritos"]
        AreaCandidato["Área do Candidato"]
        PainelRH["Painel Administrativo do RH"]
    end

    Candidato --> Catalogo
    Catalogo --> FormInscricao
    FormInscricao --> AuthService
    AuthService --> ValidacaoEmail
    ValidacaoEmail -- "Sim" --> Processamento
    ValidacaoEmail -- "Não" --> Candidato
    Processamento --> ServicoEmail
    ServicoEmail --> CaixaRH
    Processamento --> BancoDados
    BancoDados --> RegrasSeguranca

    Candidato -. Login .-> AuthService
    AuthService --> ControleAcesso
    ControleAcesso -- "Candidato Verificado" --> AreaCandidato
    ControleAcesso -- "Gestor / Recrutador" --> PainelRH
    AreaCandidato <-- Histórico do Candidato --- BancoDados
    PainelRH <-- Gestão e Triagem Global --- BancoDados
```

### Como funciona cada etapa da solução:

1. **Autenticação Segura e Antifraude**:
   - **Google OAuth**: Acesso ágil e certificado diretamente pela conta Google do candidato.
   - **E-mail e Senha com Verificação Obrigatória**: Para impedir o uso de e-mails fictícios ou inscrições fraudulentas, todo cadastro por e-mail exige confirmação por link de ativação enviado à caixa de entrada antes de liberar o acesso.
   - **Roteamento Inteligente**: O sistema identifica o perfil do usuário e direciona candidatos para sua área restrita e recrutadores para o painel de gestão.

2. **Entrega Transacional de Currículos**:
   - Os arquivos de currículo enviados (PDF ou DOCX) são transmitidos via canal criptografado diretamente para a caixa postal da equipe de RH.
   - **Privacidade por Design**: Os currículos não ficam expostos em diretórios públicos na web, reduzindo a superfície de exposição de dados pessoais.

3. **Persistência e Isolamento de Dados**:
   - O histórico de inscrições e o andamento das etapas são sincronizados em tempo real no banco de dados.
   - Cada candidato tem acesso estritamente às suas próprias informações, enquanto a edição e atualização de etapas é restrita aos analistas autorizados.

---

## 📦 Módulos da Solução

### 1. Portal Público de Carreiras
- **Vídeo Institucional de Entrada**: Apresentação dinâmica da frota com controles intuitivos de reprodução, áudio e transição fluida.
- **Busca Multicritério**: Localização instantânea de oportunidades por palavra-chave, cidade, departamento e vagas afirmativas para Pessoas com Deficiência (PcD).
- **Inscrição em Duas Abas**: Formulário com preenchimento estruturado, máscaras interativas de telefone e categoria de CNH, além de aba com os requisitos detalhados e benefícios corporativos.
- **Banco de Talentos Geral**: Canal permanente para envio de currículo quando não houver vaga imediata compatível.
- **Alternador de Tema (Dark/Light)**: Interface adaptável com persistência da preferência do usuário e animações suaves de transição.

### 2. Área do Candidato
- **Painel Pessoal de Vagas**: Consulta simples de todas as oportunidades para as quais o candidato se inscreveu.
- **Protocolo de Acompanhamento**: Identificador alfanumérico para cada processo seletivo.
- **Estágios do Processo**: Notificação clara sobre cada fase: *Recebida*, *Em Triagem*, *Entrevista*, *Aprovada* ou *Encerrada*.
- **Canal de Mensagens do RH**: Exibição em destaque de orientações de comparecimento e recados personalizados deixados pelos recrutadores.

### 3. Painel de Recrutamento do RH
- **Dashboard Operacional**: Cartões analíticos que consolidam o total de inscrições, novas candidaturas, processos em andamento e aprovações.
- **Busca e Filtros Rápidos**: Localização imediata de inscritos por nome, cargo ou fase do processo.
- **Atualização em Tempo Real**: Alteração de status com salvamento imediato e envio de recados ao candidato.

### 4. Central de Governança e Compliance
- **Política de Privacidade & LGPD (`privacidade.html`)**: Transparência sobre o tratamento de dados, bases legais, prazo de descarte seguro (12 meses) e canal direto com o Encarregado de Dados (DPO).
- **Termos de Uso (`termos.html`)**: Declaração de autenticidade das informações sob as penas da lei, esclarecimento sobre ausência de vínculo automático e foro de eleição.
- **Canal de Ética & Denúncias**: Espaço dedicado para comunicação sigilosa de irregularidades, discriminação ou tentativas de golpe.
- **Termo de Uso de Imagem (`TERMO-USO-IMAGEM.md`)**: Instrumento formal pronto para resguardar a empresa quanto à utilização de imagens e vídeos de colaboradores e motoristas.

---

## 🔒 Segurança da Informação e Conformidade Legal

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COMPLIANCE & SEGURANÇA                          │
├────────────────────────────────────────────────────────────────────────┤
│  ✓ LGPD (Lei 13.709/2018): Consentimento ativo e livre de opt-in       │
│  ✓ CLT (Art. 442-A): Sem exigência de experiência acima de 6 meses     │
│  ✓ Lei 9.029/1995: Processo seletivo estritamente não discriminatório │
│  ✓ Prevenção Antifraude: E-mail obrigatório verificado na origem       │
│  ✓ Transmissão Segura: Comunicação cifrada ponta a ponta (HTTPS/TLS)   │
│  ✓ Decreto 7.962/2013: Identificação empresarial completa e CNPJ       │
└────────────────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Aviso Oficial de Segurança:** A Chiquinha Transportes não cobra nenhuma taxa, depósito financeiro, valor para uniformes, treinamentos ou exames em qualquer fase de seus processos seletivos. Todos os canais da empresa reforçam esse alerta para proteger os profissionais contra fraudes.

---

## 🎨 Design System e Identidade Visual

A interface foi concebida para transmitir solidez, dinamismo rodoviário e elegância corporativa:

### Paleta de Cores
- **Âmbar Dourado (`#D97706` / `#F59E0B`)**: Cor primária que remete à energia e tradição nas rodovias.
- **Ônix e Grafite (`#0B0F19` / `#111827`)**: Base para o modo escuro, garantindo conforto visual e sofisticação.
- **Gelo e Neve (`#F8FAFC` / `#FFFFFF`)**: Base para o modo claro, priorizando organização e clareza de leitura.
- **Esmeralda (`#10B981`)**: Sinalização de confirmações, sucessos e etapas aprovadas.

### Tipografia
- **Títulos e Destaques**: `Outfit` — moderna, geométrica e imponente.
- **Leitura e Formulários**: `Inter` — referência internacional em legibilidade em telas de qualquer resolução.

---

## 💻 Tecnologias Utilizadas

| Tecnologia | Finalidade no Projeto |
|---|---|
| **HTML5 Semântico** | Marcação estruturada, acessível (WAI-ARIA) e otimizada para SEO. |
| **CSS3 Moderno** | Variáveis customizáveis, layout responsivo via Flexbox/Grid e animações nativas. |
| **JavaScript (ES6+ Vanilla)** | Código leve e rápido sem bibliotecas pesadas de terceiros. |
| **Firebase Authentication** | Autenticação híbrida (Google OAuth e E-mail/Senha com confirmação obrigatória). |
| **Cloud Firestore** | Base de dados em tempo real com controle estrito de permissões. |
| **API Transacional de E-mail** | Entrega segura de candidaturas e anexos diretamente ao RH. |
| **Node.js Nativo** | Servidor para desenvolvimento local com suporte a streaming de vídeo. |
| **Vercel Serverless** | Hospedagem de borda com alta disponibilidade e escalabilidade automática. |

---

## 📁 Estrutura do Projeto

```text
chiquinhatransportes/
├── assets/                       # Fotografias institucionais, banners, logotipos e vídeo
├── api/                          # Funções serverless para processamento seguro de candidaturas
├── index.html                    # Portal público de carreiras e recrutamento
├── candidato.html                # Área restrita do candidato
├── admin.html                    # Painel administrativo da equipe de RH
├── verificar-email.html          # Página customizada de validação de e-mail (marca própria)
├── redefinir-senha.html          # Página customizada para definição de nova senha
├── auth-action.html              # Roteador unificado de ações do Firebase
├── privacidade.html              # Política de Privacidade & LGPD
├── termos.html                   # Termos de Uso e Canal de Ética
├── TERMO-USO-IMAGEM.md           # Minuta de autorização de imagem dos colaboradores
├── styles.css                    # Design System unificado e regras de layout
├── portal.css                    # Estilização visual dos ambientes restritos
├── app.js                        # Lógica da interface pública e catálogo de vagas
├── candidato.js                  # Lógica da Área do Candidato
├── admin.js                      # Lógica do Painel de Recrutamento
├── firebase-config.js            # Parâmetros de conexão ao Firebase
├── firebase-service.js           # Módulo de inicialização e serviços de autenticação
├── firestore.rules               # Regras de proteção e isolamento do banco de dados
├── server.js                     # Servidor HTTP local para desenvolvimento
└── README.md                     # Apresentação executiva da plataforma
```

---

## ♿ Acessibilidade e Usabilidade

- **Navegação por Teclado**: Todo o portal, formulários e modais podem ser operados via teclas `Tab`, `Enter`, `Espaço` e `Escape`.
- **Sensibilidade a Movimento**: O sistema respeita as preferências de acessibilidade (`prefers-reduced-motion`) desativando animações quando solicitado pelo sistema operacional do usuário.
- **Alto Contraste Homologado**: Combinações cromáticas testadas para garantir leitura confortável em ambientes externos com sol ou baixa luminosidade.

---

<div align="center">

**Chiquinha Transportes Rodoviários Ltda.**  
*Recursos Humanos & Tecnologia da Informação*  
Pouso Alegre - MG • Brasil

</div>
