import "./style.css";
import {
  profileGroups,
  resources,
  suggestions,
  composePlan,
  composeRegular,
} from "./rules.js";
import {
  downloadWord,
  downloadKit,
  downloadFeelings,
  downloadLargeText,
} from "./exports.js";
import {
  emptyState,
  normalizeState,
  readLibrary,
  writeLibrary,
  readLegacyDraft,
} from "./storage.js";

const app = document.querySelector("#app");
let state = emptyState(),
  view = "wizard",
  notice = "",
  library = { draft: null, plans: [], students: [] },
  libraryBlocked = false;
try {
  library = readLibrary();
} catch {
  libraryBlocked = true;
  notice =
    "Não foi possível ler os planos salvos. Os dados existentes foram mantidos.";
}
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const button = (action, label, secondary = false, extra = "") =>
  `<button type="button" data-action="${action}" class="${secondary ? "secondary" : ""}" ${extra}>${label}</button>`;
const heading = (number, title, text) =>
  `<div class="block-heading"><span>${number}</span><div><h3>${title}</h3>${text ? `<p>${text}</p>` : ""}</div></div>`;
function field(
  label,
  id,
  {
    required = false,
    multi = false,
    type = "text",
    options,
    placeholder = "",
    value = state.data[id],
  } = {},
) {
  const attrs = `name="${id}" ${required ? "required" : ""}`;
  const control = options
    ? `<select ${attrs}><option value="">Selecione</option>${options.map((o) => `<option ${value === o ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`
    : multi
      ? `<textarea ${attrs} placeholder="${esc(placeholder)}">${esc(value)}</textarea>`
      : `<input ${attrs} type="${type}" ${type === "number" ? 'min="0" max="1440" step="1"' : ""} placeholder="${esc(placeholder)}" value="${esc(value)}">`;
  return `<label class="field ${multi ? "wide" : ""}"><span>${label}${required ? ' <b class="required" aria-hidden="true">*</b>' : ""}</span>${control}</label>`;
}
function render() {
  app.innerHTML = `<header><a href="/" data-action="home" class="brand"><span class="mark">◉</span><span>Radar <b>Pedagógico</b><small>PLANEJAMENTO ACESSÍVEL E INCLUSIVO</small></span></a><div class="header-actions">${button("home", "⌂ Ir para o Início", true)}${button("saved", "▤ Meus Planos Salvos", true)}</div></header><main><p id="status" role="status" aria-live="polite">${esc(notice)}</p>${view === "wizard" ? wizard() : view === "saved" ? savedView() : homeView()}<footer>Radar Pedagógico · O professor revisa e decide.<br>Regras predefinidas, sem IA. Planos e lista de classe ficam apenas neste navegador.</footer></main>`;
}
function wizard() {
  const names = ["Plano Regular", "Inclusão", "Finalizar"];
  return `<div class="page-heading"><div class="eyebrow">PLANEJAR PARA TODOS</div><h1>${state.step === 1 ? "Olá, Professor(a)! Vamos montar o seu plano de aula regular?" : state.step === 2 ? "Personalização Inclusiva da Aula" : "Seu plano de aula inclusivo está pronto."}</h1><p>${state.step === 1 ? "Organize a aula da turma. Depois, incorpore estratégias de acessibilidade e inclusão." : state.step === 2 ? "Seu plano regular está pronto. Selecione as necessidades e os recursos que serão considerados nesta aula." : "Compare o plano regular com cada adaptação, revise as sugestões e prepare sua versão final."}</p></div><nav class="progress" aria-label="Etapas do planejamento">${names.map((n, i) => `<div class="step ${i + 1 === state.step ? "active" : ""}" ${i + 1 === state.step ? 'aria-current="step"' : ""}><span>${i + 1 < state.step ? "✓" : i + 1}</span><div>${n}<small>${i + 1 < state.step ? "Concluído" : i + 1 === state.step ? "Em andamento" : "Próxima etapa"}</small></div></div>`).join("")}</nav>${state.step === 1 ? regular() : state.step === 2 ? accessibility() : finalView()}`;
}
function regular() {
  return `<section class="panel"><div class="section-head"><span>ETAPA 01 · CRIADOR DE PLANOS DE AULA</span><h2>Planejamento da Aula Regular</h2><p>Registre identificação, alinhamento curricular, objetivos, metodologia, recursos, avaliação e referências. Campos com * são obrigatórios.</p></div><form id="regular">
 <section class="block">${heading("01", "Identificação e Dados Gerais", "Preencha as informações básicas de identificação da sua aula.")}<div class="grid">${field("Unidade Escolar", "school", { placeholder: "Ex.: Escola Municipal Monteiro Lobato" })}${field("Ano Letivo", "year", { required: true, options: ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano"] })}${field("Turma", "classroom", { required: true, placeholder: "Ex.: Turma B" })}${field("Componente Curricular", "subject", { required: true, options: ["Língua Portuguesa", "Matemática", "Ciências", "História", "Geografia", "Arte", "Educação Física", "Ensino Religioso", "Interdisciplinar"] })}${field("Professor(a) Regente", "teacher")}${field("Data da Aula", "date", { type: "date" })}${field("Duração da Aula (em minutos)", "duration", { required: true, type: "number" })}</div></section>
 <section class="block">${heading("02", "Alinhamento Curricular (BNCC & Requisitos)", "Insira as diretrizes pedagógicas e os códigos de habilidades.")}<p class="info">Cole os códigos e as descrições de sua fonte oficial. O Radar não cria nem valida códigos BNCC.</p><div class="grid">${field("Campo de Atuação", "field", { placeholder: "Ex.: Campo Artístico-Literário" })}${field("Práticas de Linguagem", "practices", { placeholder: "Ex.: Leitura / Escuta" })}${field("Objeto de Conhecimento", "knowledge", { placeholder: "Ex.: Estratégia de leitura" })}${field("Habilidades da BNCC", "skill", { required: true, multi: true, placeholder: "Cole a habilidade curricular e o código confirmado, se disponível." })}${field("Correspondência / Matriz de Referência (SAEB ou Estadual)", "matrix", { multi: true })}${field("Informações sobre o Gênero e Fundamentação", "foundation", { multi: true })}${field("Dificuldades Antecipadas da Turma", "difficulties", { multi: true })}</div></section>
 <section class="block">${heading("03", "Objetivos e Conteúdo", "Defina onde você quer chegar com esta aula.")}<div class="grid">${field("Objetivo Geral da Aula", "objectives", { multi: true, required: true })}<div class="wide"><label class="list-label">Objetivos Específicos</label><div id="objectives-list">${state.data.specificObjectives.map((v, i) => `<div class="objective-row"><label class="field"><span class="sr-only">Objetivo específico ${i + 1}</span><input name="specificObjective" value="${esc(v)}" placeholder="Objetivo específico ${i + 1}"></label>${button("remove-objective", "Remover", true, `data-index="${i}" aria-label="Remover objetivo específico ${i + 1}"`)}</div>`).join("")}</div>${button("add-objective", "+ Adicionar Linha", true)}</div>${field("Conteúdo Programático", "content", { multi: true })}</div></section>
 <section class="block">${heading("04", "Desenvolvimento da Aula (Metodologia)", "Divida a sua aula em momentos cronometrados.")}<div class="moments">${[
   ["intro", "Introdução / Mobilização"],
   ["development", "Desenvolvimento / Prática Guiada"],
   ["closing", "Fixação / Fechamento"],
 ]
   .map(
     ([id, label], i) =>
       `<article class="moment"><h4>${i + 1}. ${label}</h4>${field(`Tempo da ${label} (minutos)`, id + "Time", { type: "number", required: true })}${field(`Descrição da Ação do Professor e dos Alunos — ${label}`, id, { multi: true, required: true })}</article>`,
   )
   .join(
     "",
   )}</div><p class="hint">A soma dos três momentos deve ser igual à duração da aula.</p></section>
 <section class="block">${heading("05", "Recursos, Avaliação e Referências", "Planeje os materiais e como acompanhar a aprendizagem.")}<div class="grid">${field("Recursos Didáticos / Materiais Necessários", "materials", { multi: true })}${field("Instrumentos e Critérios de Avaliação", "assessment", { multi: true })}${field("Referências Bibliográficas", "references", { multi: true })}</div></section><div class="actions">${button("save-draft", "▤ Salvar Rascunho", true)}<button type="submit">Avançar para Próxima Tela →</button></div></form></section>`;
}
function accessibility() {
  return `<section class="panel"><div class="section-head"><span>ETAPA 02 · CENTRAL DE ACESSIBILIDADE E INCLUSÃO</span><h2>Personalização Inclusiva da Aula</h2><p>É possível selecionar várias necessidades e combinar apoios. Cada seleção gera orientações que você poderá editar ou recusar.</p></div><section class="block">${heading("01", "Seleção do Público-Alvo da Educação Especial (PAEE)", "Selecione uma ou mais categorias presentes na sua turma.")}<p class="info">As categorias organizam sugestões; não representam diagnóstico nem determinam, por si só, os apoios de um estudante.</p>${profileGroups.map((g) => `<fieldset class="profile-group"><legend>${esc(g.title)}</legend><div class="profile-grid">${g.items.map((p) => `<div class="profile ${state.selected.includes(p.id) ? "chosen" : ""}"><label class="choice"><input type="checkbox" data-profile="${p.id}" ${state.selected.includes(p.id) ? "checked" : ""}><span>${esc(p.label)}</span></label>${p.support && state.selected.includes(p.id) ? `<div class="support">${p.support.map((s) => `<fieldset><legend>${esc(s.label)}</legend>${s.options.map((o) => `<label><input type="checkbox" data-support="${p.id}" data-key="${s.key}" value="${esc(o)}" ${(state.support[p.id]?.[s.key] || []).includes(o) ? "checked" : ""}>${esc(o)}</label>`).join("")}</fieldset>`).join("")}</div>` : ""}</div>`).join("")}</div></fieldset>`).join("")}</section>
 <section class="block">${heading("02", "Seleção de Recursos Assistivos e Metodológicos", "Quais recursos você terá disponíveis ou deseja considerar para a aula?")}<div class="resource-grid">${resources.map((r) => `<label class="choice"><input type="checkbox" data-resource="${r.id}" ${state.resources.includes(r.id) ? "checked" : ""}><span>${esc(r.label)}</span></label>`).join("")}</div></section>
 <section class="block">${heading("03", "Revisão e Compatibilização com o PI", "Vincule o plano a um identificador da sua lista de classe, se desejar.")}<p class="hint">Lista e histórico locais. Use um apelido ou código. Não há conexão com um PI externo.</p><div class="grid">${field("Selecione o Aluno da sua Lista de Classe", "student", { options: library.students, value: state.student })}<div class="student-add">${field("Novo identificador do aluno", "newStudent", { value: "", placeholder: "Ex.: Estudante A" })}${button("add-student", "Adicionar à lista", true)}</div>${field("Observações e Notas específicas do Professor", "notes", { multi: true, value: state.notes })}</div></section><div class="actions wrap"><div>${button("back", "← Voltar e Revisar Plano Regular", true)} ${button("home", "Ir para a Tela Inicial", true)}</div><div>${button("save-draft", "Salvar Rascunho", true)} ${button("generate", "Gerar Inclusão e Visualizar Plano Adaptado →")}</div></div></section>`;
}
function finalView() {
  if (!state.rules.some((r) => r.id === state.tab))
    state.tab = state.rules[0]?.id || "";
  const disabled = !state.final.trim() || state.dirty ? "disabled" : "";
  return `<section class="panel final-panel"><div class="section-head"><span>ETAPA 03 · VISUALIZADOR DO PLANO FINAL ADAPTADO</span><h2>Visualização e Edição do Plano Inclusivo</h2><p>O plano regular permanece disponível enquanto você revisa as orientações de cada necessidade.</p><div class="tags"><span>Ano: ${esc(state.data.year || "Não informado")}</span><span>Turma: ${esc(state.data.classroom)}</span><span>Habilidade: ${esc(state.data.skill)}</span>${state.rules.map((r) => `<span>${esc(r.label)}</span>`).join("")}</div></div><div class="comparison"><section class="regular-column"><h3>Meu Plano Regular</h3><h4>Objetivos Regulares</h4><p>${esc(state.data.objectives)}</p><ul>${state.data.specificObjectives
    .filter((v) => v.trim())
    .map((v) => `<li>${esc(v)}</li>`)
    .join("")}</ul><h4>Fluxo da Aula</h4>${[
    ["intro", "Introdução"],
    ["development", "Desenvolvimento"],
    ["closing", "Fechamento"],
  ]
    .map(
      ([id, label]) =>
        `<div class="flow"><strong>${label} · ${esc(state.data[id + "Time"])} min</strong><p>${esc(state.data[id])}</p></div>`,
    )
    .join(
      "",
    )}<details><summary>Consultar plano regular completo</summary><pre>${esc(composeRegular(state.data))}</pre></details></section><section class="adaptations"><h3>Minhas Adaptações de Inclusão</h3>${
    state.rules.length
      ? `<div class="tabs" role="tablist" aria-label="Necessidades selecionadas">${state.rules.map((r) => `<button type="button" role="tab" id="tab-${r.id}" aria-controls="panel-${r.id}" aria-selected="${r.id === state.tab}" tabindex="${r.id === state.tab ? "0" : "-1"}" data-action="tab" data-id="${r.id}">${esc(r.label)}</button>`).join("")}</div>${state.rules
          .map(
            (r) =>
              `<article id="panel-${r.id}" role="tabpanel" aria-labelledby="tab-${r.id}" ${r.id === state.tab ? "" : "hidden"}><p class="rule-origin">${esc(r.origin)}</p><label class="include"><input type="checkbox" data-accept="${r.id}" ${r.accepted ? "checked" : ""}>Incluir estas adaptações no plano final</label>${[
                ["objectives", "Objetivos Flexibilizados"],
                ["intro", "Manejo na Introdução"],
                ["development", "Manejo no Desenvolvimento"],
                ["closing", "Manejo no Fechamento"],
              ]
                .map(
                  ([k, label]) =>
                    `<label class="field">${label}<textarea data-rule="${r.id}" data-part="${k}">${esc(r[k])}</textarea></label>`,
                )
                .join("")}</article>`,
          )
          .join("")}`
      : '<p class="empty">Nenhuma necessidade selecionada. O plano regular pode ser usado com os recursos escolhidos.</p>'
  }${
    state.resources.length
      ? `<div class="selected-resources"><h4>Recursos assistivos selecionados</h4>${resources
          .filter((r) => state.resources.includes(r.id))
          .map(
            (r) => `<p><strong>${esc(r.label)}</strong><br>${esc(r.text)}</p>`,
          )
          .join("")}</div>`
      : ""
  }</section></div>
 <section class="block materials">${heading("02", "Central de Download de Materiais Adaptados", "Baixe modelos de apoio para revisar antes de usar com a turma.")}<p class="hint">Os cartões são modelos gerais. O texto ampliado usa o conteúdo que você informar abaixo; não é produzido por IA.</p>${field("Texto para Fonte Ampliada / Contraste", "materialText", { multi: true, value: state.data.materialText || state.data.content || "", placeholder: "Cole o texto da atividade a ser disponibilizado à turma." })}<div class="download-actions">${button("kit", "↓ Baixar Kit Completo de Materiais Adaptados (.ZIP)")}${button("feelings", "↓ Baixar Cartões Visuais de Sentimentos", true)}${button("large-text", "↓ Baixar Texto em Fonte Ampliada / Contraste", true)}</div></section>
 <section class="block"><div class="final-toolbar"><h3>Plano Completo</h3>${button("compose", "Atualizar Plano com Adaptações Revisadas", true)}</div><p class="hint">As alterações nas sugestões entram no plano ao atualizar. Essa ação substitui as edições livres abaixo.</p>${state.dirty ? '<p class="info">Há alterações nas sugestões. Atualize o plano antes de exportar ou salvar no histórico.</p>' : ""}<label class="field">Plano completo — edição livre<textarea id="final">${esc(state.final)}</textarea></label><div class="download-actions">${button("copy", "Copiar Plano", false, disabled)}${button("print", "Exportar PDF / Imprimir", true, disabled)}${button("word", "Exportar Word (.docx)", true, disabled)}</div></section><div class="actions wrap"><div>${button("back", "← Voltar e Alterar Adaptações", true)} ${button("edit", "Editar Texto das Adaptações Manualmente", true)}</div><div>${button("save-history", "Salvar no Histórico do Aluno/Turma", false, disabled)} ${button("save-draft", "Salvar Rascunho", true)} ${button("home", "Voltar à Tela Inicial", true)}</div></div><div class="print-plan"><pre>${esc(state.final)}</pre></div></section>`;
}
function homeView() {
  return `<section class="panel home"><div class="eyebrow">RADAR PEDAGÓGICO</div><h1>Planejar uma aula é abrir possibilidades.</h1><p>Organize o plano regular, selecione necessidades e recursos e revise seu plano inclusivo.</p><div class="home-steps"><span>01 · Plano regular</span><span>02 · Inclusão</span><span>03 · Plano adaptado</span></div><div class="download-actions">${button("new", "Criar Novo Plano")}${button("continue", "Continuar Plano Aberto", true)}${button("load-draft", "Carregar Rascunho", true)}${button("saved", "Meus Planos Salvos", true)}</div></section>`;
}
function savedView() {
  return `<section class="panel"><div class="section-head"><span>SEU ACERVO LOCAL</span><h2>Meus Planos Salvos</h2><p>Planos e histórico do aluno/turma ficam somente neste navegador. Baixe uma cópia para guardar fora dele.</p></div><div class="actions">${button("load-draft", "Carregar Rascunho", true)}${button("delete-draft", "Excluir Rascunho", true)}${button("continue", "Voltar ao Plano Aberto", true)}</div><label class="field">Buscar por turma, aluno ou título<input id="history-filter" type="search" placeholder="Buscar nos planos salvos"></label><div id="saved-list">${library.plans.length ? library.plans.map((p) => `<article class="saved-plan" data-search="${esc((p.title + " " + p.state.student).toLocaleLowerCase("pt-BR"))}"><div><h3>${esc(p.title)}</h3><p>${esc(new Date(p.date).toLocaleString("pt-BR"))}${p.state.student ? " · " + esc(p.state.student) : ""}</p></div><div>${button("open-plan", "Abrir", true, `data-id="${p.id}"`)} ${button("delete-plan", "Excluir", true, `data-id="${p.id}"`)}</div></article>`).join("") : '<p class="empty">Nenhum plano salvo no histórico ainda.</p>'}</div></section>`;
}
function sync() {
  if (view !== "wizard") return;
  if (state.step === 1) {
    const form = document.querySelector("#regular");
    const data = Object.fromEntries(new FormData(form));
    data.specificObjectives = new FormData(form).getAll("specificObjective");
    delete data.specificObjective;
    if (JSON.stringify(data) !== JSON.stringify(state.data)) state.dirty = true;
    state.data = { ...state.data, ...data };
  }
  if (state.step === 2) {
    state.selected = [
      ...document.querySelectorAll("[data-profile]:checked"),
    ].map((i) => i.dataset.profile);
    state.resources = [
      ...document.querySelectorAll("[data-resource]:checked"),
    ].map((i) => i.dataset.resource);
    for (const p of profileGroups.flatMap((g) => g.items)) {
      if (!p.support || !state.selected.includes(p.id)) continue;
      state.support[p.id] = {};
      for (const group of p.support)
        state.support[p.id][group.key] = [
          ...document.querySelectorAll(
            `[data-support="${p.id}"][data-key="${group.key}"]:checked`,
          ),
        ].map((i) => i.value);
    }
    state.student = document.querySelector("[name=student]").value;
    state.notes = document.querySelector("[name=notes]").value;
  }
  if (state.step === 3) {
    for (const r of state.rules) {
      r.accepted = document.querySelector(`[data-accept="${r.id}"]`).checked;
      for (const k of ["objectives", "intro", "development", "closing"])
        r[k] = document.querySelector(
          `[data-rule="${r.id}"][data-part="${k}"]`,
        ).value;
    }
    state.final = document.querySelector("#final").value;
    state.data.materialText = document.querySelector(
      "[name=materialText]",
    ).value;
  }
}
function message(text) {
  notice = text;
  document.querySelector("#status").textContent = text;
}
function navigate(page = "wizard", step = state.step) {
  view = page;
  state.step = step;
  notice = "";
  render();
  const h = document.querySelector("h2") || document.querySelector("h1");
  h?.setAttribute("tabindex", "-1");
  h?.focus();
  window.scrollTo(0, 0);
}
function persist(success) {
  if (libraryBlocked) {
    message(
      "O histórico existente não pôde ser lido. A gravação foi suspensa para preservar seus dados; exporte uma cópia do plano.",
    );
    return false;
  }
  try {
    writeLibrary(library);
    message(success);
    return true;
  } catch {
    message(
      "Não foi possível salvar neste navegador. Exporte uma cópia para guardar seu trabalho.",
    );
    return false;
  }
}
function generate() {
  sync();
  if (
    state.finalEdited &&
    !confirm(
      "Gerar novamente substituirá suas edições livres do plano final. Deseja continuar?",
    )
  )
    return;
  const old = new Map(state.rules.map((r) => [r.id, r]));
  state.rules = suggestions(state.selected, state.support).map((r) => {
    const previous = old.get(r.id);
    return previous ? { ...previous, origin: r.origin } : r;
  });
  state.final = composePlan(
    state.data,
    state.rules,
    state.notes,
    state.resources,
    state.student,
  );
  state.finalEdited = false;
  state.dirty = false;
  navigate("wizard", 3);
}
app.addEventListener("submit", (e) => {
  if (e.target.id !== "regular") return;
  e.preventDefault();
  const blank = [...e.target.querySelectorAll("[required]")].find(
    (input) => !input.value.trim(),
  );
  if (blank) {
    message("Preencha os campos obrigatórios antes de avançar.");
    blank.focus();
    return;
  }
  sync();
  const total = ["introTime", "developmentTime", "closingTime"].reduce(
    (sum, k) => sum + Number(state.data[k]),
    0,
  );
  if (
    Number(state.data.duration) < 1 ||
    total !== Number(state.data.duration)
  ) {
    message(
      "A duração deve ser maior que zero e igual à soma dos tempos de introdução, desenvolvimento e fechamento.",
    );
    document.querySelector("[name=duration]").focus();
    return;
  }
  navigate("wizard", 2);
});
app.addEventListener("change", (e) => {
  if (e.target.matches("[data-profile]")) {
    const id = e.target.dataset.profile;
    sync();
    render();
    document
      .querySelector(`[data-profile="${id}"]`)
      .focus({ preventScroll: true });
  }
  if (e.target.matches("[data-accept]")) {
    const id = e.target.dataset.accept;
    sync();
    state.dirty = true;
    render();
    document
      .querySelector(`[data-accept="${id}"]`)
      .focus({ preventScroll: true });
  }
});
app.addEventListener("input", (e) => {
  if (e.target.id === "final") {
    state.final = e.target.value;
    state.finalEdited = true;
    document
      .querySelectorAll(
        "[data-action=copy],[data-action=print],[data-action=word],[data-action=save-history]",
      )
      .forEach((b) => (b.disabled = state.dirty || !state.final.trim()));
  }
  if (e.target.matches("[data-rule]")) {
    state.dirty = true;
    document
      .querySelectorAll(
        "[data-action=copy],[data-action=print],[data-action=word],[data-action=save-history]",
      )
      .forEach((b) => (b.disabled = true));
    message("Sugestão editada. Atualize o plano para incorporar a alteração.");
  }
  if (e.target.id === "history-filter") {
    const term = e.target.value.toLocaleLowerCase("pt-BR");
    document
      .querySelectorAll(".saved-plan")
      .forEach((p) => (p.hidden = !p.dataset.search.includes(term)));
  }
});
app.addEventListener("keydown", (e) => {
  if (
    e.target.getAttribute("role") !== "tab" ||
    !["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
  )
    return;
  e.preventDefault();
  sync();
  const ids = state.rules.map((r) => r.id),
    i = ids.indexOf(state.tab);
  state.tab =
    e.key === "Home"
      ? ids[0]
      : e.key === "End"
        ? ids.at(-1)
        : ids[
            (i + (e.key === "ArrowRight" ? 1 : -1) + ids.length) % ids.length
          ];
  render();
  document.querySelector(`#tab-${state.tab}`).focus();
});
app.addEventListener("click", async (e) => {
  const target = e.target.closest("[data-action]");
  if (!target) return;
  e.preventDefault();
  const action = target.dataset.action;
  sync();
  switch (action) {
    case "home":
      navigate("home");
      break;
    case "saved":
      navigate("saved");
      break;
    case "continue":
      navigate();
      break;
    case "new":
      if (
        Object.values(state.data).some(
          (v) => typeof v === "string" && v.trim(),
        ) &&
        !confirm(
          "Criar um novo plano limpará o plano aberto. Salve um rascunho ou histórico antes de continuar. Deseja continuar?",
        )
      )
        return;
      state = emptyState();
      navigate("wizard", 1);
      break;
    case "add-objective":
      state.data.specificObjectives.push("");
      render();
      document
        .querySelectorAll("[name=specificObjective]")
        .item(state.data.specificObjectives.length - 1)
        .focus();
      break;
    case "remove-objective":
      state.data.specificObjectives.splice(Number(target.dataset.index), 1);
      if (!state.data.specificObjectives.length)
        state.data.specificObjectives = [""];
      render();
      break;
    case "back":
      navigate("wizard", state.step - 1);
      break;
    case "generate":
      generate();
      break;
    case "add-student": {
      const alias = document.querySelector("[name=newStudent]").value.trim();
      if (!alias) {
        message("Informe um identificador para adicionar à lista.");
        return;
      }
      if (!library.students.includes(alias)) library.students.push(alias);
      state.student = alias;
      persist("Identificador adicionado à lista local.");
      render();
      break;
    }
    case "tab":
      state.tab = target.dataset.id;
      render();
      document.querySelector(`#tab-${state.tab}`).focus();
      break;
    case "edit":
      document.querySelector(`[data-rule="${state.tab}"]`)?.focus();
      if (!state.tab) document.querySelector("#final").focus();
      break;
    case "compose":
      if (
        state.finalEdited &&
        !confirm(
          "Atualizar substituirá suas edições livres pelas informações e adaptações revisadas. Continuar?",
        )
      )
        return;
      state.final = composePlan(
        state.data,
        state.rules,
        state.notes,
        state.resources,
        state.student,
      );
      state.finalEdited = false;
      state.dirty = false;
      render();
      message("Plano atualizado com as adaptações revisadas.");
      break;
    case "save-draft":
      library.draft = structuredClone(state);
      persist("Rascunho salvo apenas neste navegador.");
      break;
    case "load-draft":
      try {
        const draft = library.draft || readLegacyDraft();
        if (!draft) {
          message("Nenhum rascunho salvo neste navegador.");
          return;
        }
        state = normalizeState(draft);
        navigate();
        message("Rascunho carregado.");
      } catch {
        message("Não foi possível carregar o rascunho.");
      }
      break;
    case "delete-draft":
      library.draft = null;
      try {
        localStorage.removeItem("radar-pedagogico-v1");
        persist("Rascunho excluído. O plano aberto foi mantido.");
      } catch {
        message("Não foi possível excluir o rascunho.");
      }
      break;
    case "save-history": {
      const title = `${state.data.subject || "Plano"} · ${state.data.year || ""} ${state.data.classroom || ""}`;
      library.plans.unshift({
        id: crypto.randomUUID(),
        title,
        date: new Date().toISOString(),
        state: structuredClone(state),
      });
      persist("Plano salvo no histórico local do aluno/turma.");
      break;
    }
    case "open-plan": {
      const plan = library.plans.find((p) => p.id === target.dataset.id);
      if (plan) {
        state = normalizeState(structuredClone(plan.state));
        navigate();
      }
      break;
    }
    case "delete-plan":
      if (confirm("Excluir este plano do histórico local?")) {
        library.plans = library.plans.filter((p) => p.id !== target.dataset.id);
        persist("Plano excluído do histórico.");
        render();
      }
      break;
    case "copy":
      try {
        await navigator.clipboard.writeText(state.final);
        message("Plano copiado.");
      } catch {
        document.querySelector("#final").select();
        message("Copie o texto selecionado com Ctrl+C ou Command+C.");
      }
      break;
    case "print":
      document.querySelector(".print-plan pre").textContent = state.final;
      window.print();
      break;
    case "word":
      try {
        await downloadWord(state.final);
        message("Plano Word exportado.");
      } catch {
        message("Não foi possível exportar o plano Word.");
      }
      break;
    case "feelings":
      downloadFeelings();
      message(
        "Cartões de sentimentos baixados. Revise o modelo antes de usar.",
      );
      break;
    case "large-text":
      if (!state.data.materialText?.trim()) {
        message("Informe o texto da atividade para gerar o material ampliado.");
        return;
      }
      downloadLargeText(state.data.materialText);
      message("Texto ampliado baixado.");
      break;
    case "kit":
      if (!state.data.materialText?.trim()) {
        message(
          "Informe o texto da atividade para incluir o material ampliado no kit.",
        );
        return;
      }
      try {
        await downloadKit(state.data.materialText);
        message("Kit de modelos de apoio baixado.");
      } catch {
        message("Não foi possível baixar o kit.");
      }
      break;
  }
});
render();
