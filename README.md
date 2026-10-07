# Radar Pedagógico

Protótipo de planejamento inclusivo em português brasileiro, construído com JavaScript e Vite. Não usa IA, backend, cadastro de alunos ou serviços externos.

## Desenvolvimento

Requer Node.js 20.19+ ou 22.12+ (validado com Node 24) e npm.

```sh
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --port 5173 --strictPort
```

Em máquinas fora do ambiente cloud, omita a opção `--cache` ou escolha um diretório gravável. O servidor de desenvolvimento escuta em todas as interfaces; não é um servidor de produção.

```sh
npm test
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

O último comando usa o Chromium instalado no ambiente cloud. Em outra máquina, instale o navegador com `npx playwright install chromium` e rode `npm run test:e2e` sem a variável. O download depende do acesso aos domínios oficiais do Playwright.

Para conferir a versão compilada: `npm run preview -- --port 4173 --strictPort`. O diretório `dist/` pode ser servido por hospedagem estática. A publicação do código no GitHub não publica um site.

## Fluxo

1. Preencha turma, componente, duração, habilidade, objetivos e os três momentos da aula. Escola, professor, data, conteúdos, recursos, avaliação e referências são opcionais. Os tempos das atividades são texto livre; não há validação automática da soma.
2. Selecione barreiras observadas, necessidades de participação e recursos disponíveis. É possível seguir sem adaptações. Não é necessário registrar diagnósticos ou identificar estudantes.
3. Revise cada sugestão, edite seu texto ou desmarque sua inclusão. Monte o plano, faça edições livres e copie ou imprima. O diálogo de impressão do navegador permite salvar como PDF.

O plano preserva a habilidade informada pelo professor. O sistema não cria nem valida códigos BNCC. Todas as 14 regras estão em `src/rules.js`: cada seleção ativa uma orientação explícita, exibida com sua origem. As regras não diagnosticam estudantes, não substituem avaliação pedagógica e não alteram automaticamente os objetivos curriculares.

A montagem do plano é uma ação explícita. Alterações em seleções ou sugestões só entram no texto final ao clicar em **Atualizar plano com sugestões revisadas**. Essa ação substitui as edições livres do texto final, conforme aviso na interface. Edições de sugestões mantidas são preservadas ao voltar entre etapas.

## Rascunho e limites

Salvar, carregar e excluir rascunho são ações explícitas. Um único rascunho fica no `localStorage` deste navegador, sem envio ao servidor. Recarregar a página exige clicar em Carregar rascunho. Evite dados pessoais e sensíveis, especialmente em equipamentos compartilhados. A exclusão remove o rascunho salvo, mas mantém o plano aberto.

Esta versão oferece impressão/PDF pelo navegador, não exportação Word, geração de kits ZIP, vinculação a PI ou histórico de alunos. Essas funções do wireframe não são simuladas.

## Validação

Os testes unitários verificam a seleção das regras, preservação da habilidade curricular e exclusão de sugestões recusadas. Os testes de navegador exercitam validação dos campos, revisão e edição, cópia, persistência, impressão, navegação de retorno, fluxo sem adaptações, largura móvel e renderização segura de texto inserido pelo usuário.
