import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import JSZip from "jszip";

const lesson = {
  school: "Escola Municipal do Bairro",
  classroom: "Turma B",
  teacher: "Professora Ana",
  date: "2026-10-07",
  duration: "50",
  field: "Campo artístico-literário",
  practices: "Leitura e escuta compartilhada",
  knowledge: "Estratégia de leitura de narrativas",
  skill:
    "Localizar informações explícitas — habilidade transcrita da matriz escolar.",
  matrix: "Descritor da matriz estadual fornecida pela escola.",
  foundation: "Conto popular. Leitura compartilhada e conversa entre leitores.",
  difficulties: "Vocabulário novo e sequência dos acontecimentos.",
  objectives: "Identificar personagens e explicar suas ações no conto.",
  content: "Personagens, ações e sequência narrativa.",
  introTime: "10",
  intro: "Apresentar o livro e conversar sobre o título.",
  developmentTime: "30",
  development: "Ler o conto em conjunto e organizar os acontecimentos.",
  closingTime: "10",
  closing: "Retomar os personagens com uma síntese da turma.",
  materials: "Livro, quadro, cartões e caderno.",
  assessment: "Observar identificação de personagens e explicação das ações.",
  references: "Acervo de contos da biblioteca da escola.",
};

async function fillLesson(page, overrides = {}) {
  await page.getByLabel("Ano Letivo").selectOption("3º Ano");
  await page
    .getByLabel("Componente Curricular")
    .selectOption("Língua Portuguesa");
  for (const [name, value] of Object.entries({ ...lesson, ...overrides })) {
    await page.locator(`[name="${name}"]`).fill(value);
  }
  await page
    .getByLabel("Objetivo específico 1", { exact: true })
    .fill("Reconhecer os personagens principais.");
  await page
    .getByRole("button", { name: "+ Adicionar Linha", exact: true })
    .click();
  await page
    .getByLabel("Objetivo específico 2", { exact: true })
    .fill("Ordenar três acontecimentos do conto.");
  await page
    .getByRole("button", { name: "+ Adicionar Linha", exact: true })
    .click();
  await page
    .getByLabel("Objetivo específico 3", { exact: true })
    .fill("Objetivo provisório a remover.");
  await page
    .getByRole("button", { name: "Remover objetivo específico 3", exact: true })
    .click();
  await expect(page.locator('[name="specificObjective"]')).toHaveCount(2);
}

async function next(page) {
  await page
    .getByRole("button", { name: "Avançar para Próxima Tela →", exact: true })
    .click();
}
async function generate(page) {
  await page
    .getByRole("button", {
      name: "Gerar Inclusão e Visualizar Plano Adaptado →",
      exact: true,
    })
    .click();
}
async function downloadFrom(page, name) {
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name, exact: true }).click();
  const result = await pending;
  expect(await result.failure()).toBeNull();
  return {
    filename: result.suggestedFilename(),
    bytes: await readFile(await result.path()),
  };
}
async function noHorizontalOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}

// This exercises the teacher's complete plan rather than implementation-only state.
test("full wireframe: validate, compare three profiles, review, export and reopen local history", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await next(page);
  await expect(
    page.getByRole("heading", {
      name: "Planejamento da Aula Regular",
      exact: true,
    }),
  ).toBeVisible();
  await fillLesson(page, { closingTime: "11" });
  await next(page);
  await expect(page.getByRole("status")).toContainText(
    "igual à soma dos tempos",
  );
  await expect(
    page.getByRole("heading", {
      name: "Planejamento da Aula Regular",
      exact: true,
    }),
  ).toBeVisible();
  await page.locator('[name="closingTime"]').fill("10");
  await next(page);
  await expect(
    page
      .getByRole("heading", {
        name: "Personalização Inclusiva da Aula",
        exact: true,
      })
      .last(),
  ).toBeVisible();

  await page
    .getByLabel("Transtorno do Espectro Autista (TEA)", { exact: true })
    .check();
  await page.getByLabel("Nível 2", { exact: true }).check();
  await page.getByLabel("Não verbal", { exact: true }).check();
  await page
    .getByLabel("Dislexia — leitura e decodificação", { exact: true })
    .check();
  await page
    .getByLabel("Deficiência visual — baixa visão / visão subnormal", {
      exact: true,
    })
    .check();
  await page
    .getByLabel("Flexibilização de Registro/Escrita", { exact: true })
    .check();
  await page
    .getByLabel("Adaptação de Materiais Gráficos", { exact: true })
    .check();
  await page
    .getByLabel("Novo identificador do aluno", { exact: true })
    .fill("Estudante A");
  await page
    .getByRole("button", { name: "Adicionar à lista", exact: true })
    .click();
  await expect(
    page.getByRole("combobox", {
      name: "Selecione o Aluno da sua Lista de Classe",
      exact: true,
    }),
  ).toHaveValue("Estudante A");
  await page
    .getByRole("textbox", {
      name: "Observações e Notas específicas do Professor",
      exact: true,
    })
    .fill("Confirmar preferências e os recursos disponíveis com a turma.");
  await generate(page);
  await expect(page.getByRole("tab")).toHaveCount(3);
  await expect(
    page.getByRole("heading", { name: "Meu Plano Regular", exact: true }),
  ).toBeVisible();
  const tea = page.getByRole("tab", {
    name: "Transtorno do Espectro Autista (TEA)",
    exact: true,
  });
  const lowVision = page.getByRole("tab", {
    name: "Deficiência visual — baixa visão / visão subnormal",
    exact: true,
  });
  const dyslexia = page.getByRole("tab", {
    name: "Dislexia — leitura e decodificação",
    exact: true,
  });
  await expect(tea).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#panel-tea .rule-origin")).toContainText(
    "Nível de suporte informado: Nível 2",
  );
  await expect(page.locator("#panel-tea .rule-origin")).toContainText(
    "Comunicação informada: Não verbal",
  );

  const reviewedInstruction =
    "Usar a sequência visual combinada com a turma e permitir resposta por CAA.";
  await page
    .locator("#panel-tea")
    .getByRole("textbox", { name: "Manejo na Introdução", exact: true })
    .fill(reviewedInstruction);
  await expect(
    page.getByRole("button", { name: "Copiar Plano", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Exportar Word (.docx)", exact: true }),
  ).toBeDisabled();
  await lowVision.click();
  const excludedSuggestion = await page
    .locator("#panel-baixaVisao")
    .getByRole("textbox", { name: "Objetivos Flexibilizados", exact: true })
    .inputValue();
  await page
    .locator("#panel-baixaVisao")
    .getByLabel("Incluir estas adaptações no plano final", { exact: true })
    .uncheck();
  await tea.click();
  await expect(
    page
      .locator("#panel-tea")
      .getByRole("textbox", { name: "Manejo na Introdução", exact: true }),
  ).toHaveValue(reviewedInstruction);
  await tea.press("ArrowRight");
  await expect(lowVision).toBeFocused();
  await expect(lowVision).toHaveAttribute("aria-selected", "true");
  await lowVision.press("End");
  await expect(dyslexia).toBeFocused();
  await dyslexia.press("Home");
  await expect(tea).toBeFocused();
  await page
    .getByRole("button", {
      name: "Atualizar Plano com Adaptações Revisadas",
      exact: true,
    })
    .click();
  const final = page.getByRole("textbox", {
    name: "Plano completo — edição livre",
    exact: true,
  });
  await expect(final).toContainText(reviewedInstruction);
  await expect(final).not.toContainText(excludedSuggestion);
  for (const value of Object.values(lesson))
    await expect(final).toContainText(value);
  await expect(final).toContainText("Reconhecer os personagens principais.");
  await expect(final).toContainText("Ordenar três acontecimentos do conto.");
  await expect(final).not.toContainText("Objetivo provisório");
  await expect(final).toContainText("Estudante A");
  await expect(final).toContainText("Flexibilização de Registro/Escrita");
  await expect(final).toContainText("Adaptação de Materiais Gráficos");
  await expect(final).toContainText(
    "Confirmar preferências e os recursos disponíveis com a turma.",
  );
  await page
    .getByText("Consultar plano regular completo", { exact: true })
    .click();
  await expect(page.locator(".regular-column pre")).toContainText(
    lesson.matrix,
  );
  await expect(page.locator(".regular-column pre")).toContainText(
    lesson.references,
  );
  await expect(page.locator(".regular-column pre")).not.toContainText(
    reviewedInstruction,
  );

  const editedPlan =
    (await final.inputValue()) + "\nEdição livre final da professora.";
  await final.fill(editedPlan);
  await page.getByRole("button", { name: "Copiar Plano", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Plano copiado.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    editedPlan,
  );
  await page.evaluate(() => {
    window.print = () => {
      window.__printed = true;
    };
  });
  await page
    .getByRole("button", { name: "Exportar PDF / Imprimir", exact: true })
    .click();
  expect(await page.evaluate(() => window.__printed)).toBe(true);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".print-plan")).toBeVisible();
  await expect(page.locator(".print-plan pre")).toHaveText(editedPlan);
  await page.emulateMedia({ media: "screen" });

  const word = await downloadFrom(page, "Exportar Word (.docx)");
  expect(word.filename).toBe("radar-pedagogico.docx");
  expect(word.bytes.subarray(0, 2).toString()).toBe("PK");
  const office = await JSZip.loadAsync(word.bytes);
  expect(Object.keys(office.files)).toContain("[Content_Types].xml");
  const document = await office.file("word/document.xml").async("string");
  expect(document).toContain(lesson.matrix);
  expect(document).toContain(lesson.references);
  expect(document).toContain("Edição livre final da professora.");
  expect(document).not.toContain(excludedSuggestion);
  const sourceText =
    "O conto da turma: café, árvore e amizade.\nTexto original para ampliar.";
  await page
    .getByRole("textbox", {
      name: "Texto para Fonte Ampliada / Contraste",
      exact: true,
    })
    .fill(sourceText);
  const feelings = await downloadFrom(
    page,
    "↓ Baixar Cartões Visuais de Sentimentos",
  );
  expect(feelings.filename).toBe("cartoes-sentimentos.html");
  expect(feelings.bytes.toString()).toContain("Como estou me sentindo?");
  expect(feelings.bytes.toString()).toContain("Alegria");
  const enlarged = await downloadFrom(
    page,
    "↓ Baixar Texto em Fonte Ampliada / Contraste",
  );
  expect(enlarged.filename).toBe("texto-ampliado.html");
  expect(enlarged.bytes.toString()).toContain(sourceText);
  expect(enlarged.bytes.toString()).toContain("font-size:24px");
  const kit = await downloadFrom(
    page,
    "↓ Baixar Kit Completo de Materiais Adaptados (.ZIP)",
  );
  expect(kit.filename).toBe("materiais-adaptados.zip");
  const materials = await JSZip.loadAsync(kit.bytes);
  expect(Object.keys(materials.files).sort()).toEqual(
    ["LEIA-ME.txt", "sentiments.html", "texto-ampliado.html"].sort(),
  );
  expect(await materials.file("texto-ampliado.html").async("string")).toContain(
    sourceText,
  );

  await page
    .getByRole("button", {
      name: "Salvar no Histórico do Aluno/Turma",
      exact: true,
    })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Plano salvo no histórico",
  );
  await page
    .getByRole("button", { name: "Salvar Rascunho", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Rascunho salvo");
  await page
    .getByRole("button", { name: "Voltar à Tela Inicial", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Meus Planos Salvos", exact: true })
    .click();
  await expect(page.locator(".saved-plan")).toHaveCount(1);
  await page
    .getByLabel("Buscar por turma, aluno ou título", { exact: true })
    .fill("inexistente");
  await expect(page.locator(".saved-plan")).toBeHidden();
  await page
    .getByLabel("Buscar por turma, aluno ou título", { exact: true })
    .fill("estudante a");
  await expect(page.locator(".saved-plan")).toBeVisible();
  await page.getByRole("button", { name: "Abrir", exact: true }).click();
  await expect(final).toHaveValue(editedPlan);
  await page.reload();
  await page
    .getByRole("button", { name: "⌂ Ir para o Início", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Carregar Rascunho", exact: true })
    .click();
  await expect(final).toHaveValue(editedPlan);
  await expect(
    page.getByRole("textbox", {
      name: "Texto para Fonte Ampliada / Contraste",
      exact: true,
    }),
  ).toHaveValue(sourceText);
  await tea.click();
  await expect(
    page
      .locator("#panel-tea")
      .getByRole("textbox", { name: "Manejo na Introdução", exact: true }),
  ).toHaveValue(reviewedInstruction);
  await lowVision.click();
  await expect(
    page
      .locator("#panel-baixaVisao")
      .getByLabel("Incluir estas adaptações no plano final", { exact: true }),
  ).not.toBeChecked();
  await page.locator('header [data-action="saved"]').click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Excluir", exact: true }).click();
  await expect(page.locator(".saved-plan")).toHaveCount(0);
  await expect(
    page.getByText("Nenhum plano salvo no histórico ainda.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Excluir Rascunho", exact: true })
    .click();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("radar-pedagogico-v2")).draft,
    ),
  ).toBeNull();
  expect(errors).toEqual([]);
});

test("mobile layout supports every screen and a regular plan without selected needs", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await fillLesson(page);
  await noHorizontalOverflow(page);
  await next(page);
  await noHorizontalOverflow(page);
  await generate(page);
  await expect(
    page.getByText("Nenhuma necessidade selecionada.", { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole("tab")).toHaveCount(0);
  await expect(
    page.getByRole("textbox", {
      name: "Plano completo — edição livre",
      exact: true,
    }),
  ).toContainText("Nenhuma adaptação de perfil incluída.");
  await noHorizontalOverflow(page);
  await page
    .getByRole("button", { name: "← Voltar e Alterar Adaptações", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "← Voltar e Revisar Plano Regular",
      exact: true,
    })
    .click();
  await expect(page.getByLabel("Ano Letivo")).toHaveValue("3º Ano");
  await expect(page.getByLabel("Componente Curricular")).toHaveValue(
    "Língua Portuguesa",
  );
  await expect(page.locator('[name="matrix"]')).toHaveValue(lesson.matrix);
  await expect(
    page.getByLabel("Objetivo específico 2", { exact: true }),
  ).toHaveValue("Ordenar três acontecimentos do conto.");
});

test("teacher-entered markup stays text in comparison, local history and downloadable materials", async ({
  page,
}) => {
  await page.goto("/");
  const markup =
    '<img src=x onerror="window.__injected=true"> <script>window.__injected=true</script> & texto';
  await fillLesson(page, { objectives: markup });
  await next(page);
  await page
    .getByLabel("Novo identificador do aluno", { exact: true })
    .fill(markup);
  await page
    .getByRole("button", { name: "Adicionar à lista", exact: true })
    .click();
  await generate(page);
  await expect(page.locator(".regular-column")).toContainText(markup);
  expect(await page.evaluate(() => window.__injected)).toBeUndefined();
  await page
    .getByRole("textbox", {
      name: "Plano completo — edição livre",
      exact: true,
    })
    .fill(markup);
  await page
    .getByRole("textbox", {
      name: "Texto para Fonte Ampliada / Contraste",
      exact: true,
    })
    .fill(markup);
  const enlarged = await downloadFrom(
    page,
    "↓ Baixar Texto em Fonte Ampliada / Contraste",
  );
  const html = enlarged.bytes.toString();
  expect(html).toContain("&lt;script&gt;window.__injected=true&lt;/script&gt;");
  expect(html).not.toContain("<script>window.__injected=true</script>");
  await page
    .getByRole("button", {
      name: "Salvar no Histórico do Aluno/Turma",
      exact: true,
    })
    .click();
  await page.locator('header [data-action="saved"]').click();
  await expect(page.locator(".saved-plan")).toContainText(markup);
  expect(await page.evaluate(() => window.__injected)).toBeUndefined();
  await page.getByRole("button", { name: "Abrir", exact: true }).click();
  await expect(
    page.getByRole("textbox", {
      name: "Plano completo — edição livre",
      exact: true,
    }),
  ).toHaveValue(markup);
});

test("legacy draft recovery preserves teacher text and restarts review without remapping old categories", async ({
  page,
}) => {
  const originalFinal =
    "Plano anterior revisado pelo professor.\nTexto livre que precisa ser preservado.";
  const legacy = {
    step: 3,
    data: {
      ...lesson,
      year: "3º Ano",
      subject: "Língua Portuguesa",
      specificObjectives: ["Objetivo antigo preservado."],
    },
    selected: ["leitura", "previsibilidade"],
    rules: [
      {
        id: "leitura",
        label: "Leitura",
        text: "Texto da regra antiga.",
        accepted: true,
      },
    ],
    notes: "Observação antiga do professor.",
    final: originalFinal,
  };
  await page.addInitScript(
    (draft) =>
      localStorage.setItem("radar-pedagogico-v1", JSON.stringify(draft)),
    legacy,
  );
  await page.goto("/");
  await page
    .getByRole("button", { name: "⌂ Ir para o Início", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Carregar Rascunho", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Planejamento da Aula Regular",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator('[name="skill"]')).toHaveValue(lesson.skill);
  await expect(page.locator('[name="matrix"]')).toHaveValue(lesson.matrix);
  await expect(
    page.getByLabel("Objetivo específico 1", { exact: true }),
  ).toHaveValue("Objetivo antigo preservado.");
  await page
    .getByRole("button", { name: "▤ Salvar Rascunho", exact: true })
    .click();
  const recovered = await page.evaluate(
    () => JSON.parse(localStorage.getItem("radar-pedagogico-v2")).draft,
  );
  expect(recovered.step).toBe(1);
  expect(recovered.final).toBe(originalFinal);
  expect(recovered.notes).toBe(legacy.notes);
  expect(recovered.selected).toEqual([]);
  expect(recovered.rules).toEqual([]);
  await next(page);
  await expect(page.locator("[data-profile]:checked")).toHaveCount(0);
  await expect(
    page.getByRole("textbox", {
      name: "Observações e Notas específicas do Professor",
      exact: true,
    }),
  ).toHaveValue(legacy.notes);
});

test("unreadable existing library is retained when a teacher attempts to save", async ({
  page,
}) => {
  const damaged = "{biblioteca local ainda não legível";
  await page.addInitScript(
    (value) => localStorage.setItem("radar-pedagogico-v2", value),
    damaged,
  );
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText(
    "Os dados existentes foram mantidos.",
  );
  await page.locator('[name="school"]').fill("Escola com novo rascunho");
  await page
    .getByRole("button", { name: "▤ Salvar Rascunho", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "gravação foi suspensa para preservar seus dados",
  );
  expect(
    await page.evaluate(() => localStorage.getItem("radar-pedagogico-v2")),
  ).toBe(damaged);
  await expect(page.locator('[name="school"]')).toHaveValue(
    "Escola com novo rascunho",
  );
});
