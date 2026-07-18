# Landing Page Psicologia — Projeto de Portfólio

Landing page premium de **uma página** para serviços de psicologia clínica, com personagem e conteúdos **inteiramente fictícios**. Peça de portfólio focada em design de conversão, acessibilidade e front-end estático.

> **Aviso:** este projeto é demonstrativo. Não representa profissional real, consultório, CRP ou serviço de saúde mental. O formulário **não envia dados** a nenhum servidor.

---

## Objetivo

Demonstrar a capacidade de projetar e implementar uma landing page comercial de alto padrão: identidade visual coerente, hierarquia tipográfica, seções de persuasão (prova social, FAQ, CTA) e interações front-end polidas — em HTML, CSS e JavaScript puros, pronta para deploy estático.

## Problema resolvido

Profissionais liberais e clínicas precisam de uma página que:

- Transmita **confiança e acolhimento** em poucos segundos
- Explique o **processo de atendimento** com clareza
- Converta visitantes em leads via **CTA, WhatsApp e formulário**
- Funcione bem em **mobile**, com boa **acessibilidade** e base de **SEO**

Este repositório entrega esse modelo como **protótipo visual e técnico**, sem backend.

---

## Principais funcionalidades

| Área | O que está implementado |
|------|-------------------------|
| **UI/UX** | Design system com tokens (cor, tipo, espaço, sombra, motion) |
| **Hero** | Status de agenda, chips, stats animados, retrato com cards flutuantes |
| **Conteúdo** | Sobre, processo em 4 passos, benefícios, depoimentos (demo), FAQ |
| **Conversão** | CTAs no header, banner, sticky mobile e botão flutuante (demo) |
| **Formulário** | Validação, máscara de telefone, loading e sucesso **somente local** |
| **Navegação** | Menu mobile com focus trap, link ativo no scroll, skip link |
| **A11y** | ARIA no FAQ, foco visível, `prefers-reduced-motion`, landmarks |
| **Performance** | Preload LCP, `srcset`, fontes não bloqueantes, scroll com throttle |

---

## Tecnologias

- **HTML5** semântico
- **CSS3** (custom properties, grid/flex, media queries, animações)
- **JavaScript** vanilla (IIFE, IntersectionObserver, validação de form)
- **Google Fonts** — Cormorant Garamond + Outfit
- Sem frameworks, bundlers ou backend

---

## Como executar localmente

### Opção 1 — abrir o arquivo

Abra `index.html` no navegador (alguns recursos de fontes podem variar sem servidor HTTP).

### Opção 2 — servidor local (recomendado)

```bash
# Python
python -m http.server 8080

# Node (se tiver npx)
npx serve .
```

Acesse: [http://localhost:8080](http://localhost:8080)

### Estrutura do projeto

```
Landing Page 1/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── ana-portrait.jpg
│   ├── ana-portrait-sm.jpg
│   └── screenshots/          ← capturas para o portfólio (veja README na pasta)
├── README.md
└── (opcional) vercel.json / netlify.toml — não obrigatórios
```

---

## Deploy (Vercel, Netlify, GitHub Pages)

O site é **100% estático**: basta publicar a raiz do repositório.

| Plataforma | Configuração |
|------------|----------------|
| **Vercel** | Importar o repo → Framework Preset: *Other* → Output/root: `.` → Deploy |
| **Netlify** | *Add new site* → Publish directory: `.` (raiz) → Deploy |
| **GitHub Pages** | Settings → Pages → Branch `main` / root, ou Action de static site |

**Checklist pós-deploy**

1. Confirmar que `index.html` carrega em `/`
2. Caminhos relativos (`css/`, `js/`, `assets/`) funcionam em produção
3. Opcional: atualizar `og:image` no HTML com a **URL absoluta** pública (ex.: `https://seu-dominio.vercel.app/assets/ana-portrait.jpg`)
4. Testar formulário: deve apenas exibir “Demonstração concluída — nenhum dado foi enviado”

Não há variáveis de ambiente, build step ou API keys.

---

## Aviso de projeto fictício

- **Personagem:** “Dra. Ana Martins” é fictícia e existe só para contexto de design.
- **Contatos, local e horários** são placeholders; não há WhatsApp, e-mail ou endereço reais.
- **Depoimentos** são copy ilustrativa de layout, não relatos de pacientes.
- **Formulário:** `preventDefault` + sem `fetch`/backend; dados não saem do navegador.
- **Não substitui** atendimento psicológico, diagnóstico ou aconselhamento profissional.

Use esta peça para mostrar **processo de UI/front-end**, não como site de um profissional real.

---

## Screenshots do portfólio

Coloque capturas em `assets/screenshots/`. Instruções detalhadas:  
[`assets/screenshots/README.md`](assets/screenshots/README.md)

---

## Licença e uso

Código liberado para uso em portfólio pessoal e estudos.  
Não utilize a página para se passar por serviço clínico real sem reescrever textos, contatos e avisos legais.
