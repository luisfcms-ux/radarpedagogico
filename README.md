# Radar Pedagógico

Aplicativo de planejamento inclusivo em português brasileiro, com as três telas do [wireframe fornecido](docs/wireframe.md). JavaScript, Vite e JSZip; sem servidor de aplicação, IA, chaves de API ou banco de dados.

## Executar

Requer Node.js 20.19+ ou 22.12+ (validado com Node 24) e npm.

```sh
npm ci
npm run dev
```

Abra o endereço informado pelo Vite no navegador. No ambiente cloud, use um cache gravável: `npm ci --cache /workspace/.npm-cache --no-audit --no-fund`. Para fixar a porta, use `npm run dev -- --port 5173 --strictPort`.

```sh
npm test
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

Os testes de navegador usam o Chromium disponível na imagem cloud. Em outra máquina, execute `npx playwright install chromium` e `npm run test:e2e` sem a variável. O download depende de acesso aos domínios oficiais do Playwright.

Para conferir a versão compilada: `npm run preview -- --port 4173 --strictPort`. A hospedagem estática deve executar `npm run build` e publicar `dist/`. Vercel e Netlify reconhecem Vite. Não é necessário configurar banco de dados nem variáveis. O push para o GitHub não publica um site automaticamente, mas uma hospedagem já conectada à branch `main` pode fazer novo deploy a cada push.

## As três telas

### 1. Criador de planos de aula

- Identificação: escola, ano de 1º a 5º, turma, componente curricular, docente, data e duração.
- Alinhamento: campo de atuação, práticas de linguagem, objeto de conhecimento, habilidades da BNCC, matriz SAEB/estadual, gênero e fundamentação, dificuldades antecipadas.
- Objetivos: geral, lista dinâmica de específicos e conteúdo programático.
- Metodologia: tempo numérico e ação do professor/alunos em introdução, desenvolvimento e fechamento. A soma dos momentos é validada contra a duração.
- Recursos, instrumentos/critérios de avaliação e referências.

A habilidade curricular é transcrita do que o professor informa. Não há criação ou validação de códigos BNCC.

### 2. Central de acessibilidade e inclusão

As 16 categorias do wireframe estão organizadas em seis grupos, com suporte/comunicação do TEA, predominância do TDAH, especificações motoras e áreas de altas habilidades. Os cinco recursos assistivos podem ser combinados. As categorias organizam orientações; não diagnosticam estudantes nem inferem apoios a partir de um rótulo. Os níveis e detalhes fornecidos aparecem na origem da regra, sem definir automaticamente a estratégia.

A lista de classe aceita identificadores locais (preferencialmente apelidos ou códigos). O professor pode selecionar um identificador e registrar observações de compatibilização com o PI. Não há conexão com PI, cadastro ou histórico de uma instituição externa.

### 3. Visualizador do plano final

Duas colunas permitem consultar objetivos e fluxo do plano regular enquanto o professor navega nas abas de cada necessidade. A coluna regular permanece fixa durante a comparação em telas maiores. Cada aba possui objetivos flexibilizados e manejo em introdução, desenvolvimento e fechamento, além da origem explícita da regra. As sugestões são editáveis e podem ser recusadas. As regras estão em `src/rules.js`.

O plano completo admite edição livre. Alterações nas sugestões precisam ser incorporadas com **Atualizar Plano com Adaptações Revisadas** antes da exportação ou salvamento no histórico. A atualização substitui a edição livre do texto final; o aplicativo pede confirmação se houver edições manuais.

Ações disponíveis:

- Copiar o plano completo.
- Exportar PDF pelo diálogo de impressão do navegador ou baixar Word `.docx` real (Office Open XML).
- Baixar cartões de sentimentos como HTML imprimível e texto informado pelo professor com fonte de 24 px e alto contraste.
- Baixar ZIP com os dois modelos de apoio e instruções. São modelos gerais para revisão docente, sem geração por IA ou promessa de adaptação individual automática.
- Salvar rascunho e múltiplos planos no histórico local, pesquisar, reabrir e excluir.

## Persistência e cuidados

Planos, lista de classe e histórico ficam no `localStorage`, apenas no navegador e na origem em que o aplicativo foi aberto. Nada é enviado a serviços externos. Os dados não sincronizam entre aparelhos, podem ser apagados ao limpar os dados do navegador e não são um arquivo institucional. Prefira identificadores sem dados pessoais; baixe os documentos que precisa guardar. Não há salvamento automático: clique em Salvar Rascunho ou Salvar no Histórico. A navegação para o início mantém o plano aberto; criar um novo plano pede confirmação antes de descartar o conteúdo.

Rascunhos da primeira versão continuam disponíveis para importação. Os campos antigos são preservados, e o formulário abre na primeira etapa para complementar os novos campos. As antigas sugestões não são convertidas silenciosamente para categorias diferentes. A antiga cópia permanece armazenada até a exclusão explícita do rascunho.

## Validação

Testes unitários verificam o catálogo completo, a origem das regras, campos curriculares, exclusão de sugestões, conteúdo real de DOCX/ZIP e escape de texto nos materiais. Testes de navegador validam as três telas, tempos da aula, abas, edições, exportações, histórico, rascunho e layout móvel.
