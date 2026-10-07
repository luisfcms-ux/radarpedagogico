import { test } from "node:test";
import assert from "node:assert/strict";
import {
  profileGroups,
  resources,
  suggestions,
  composeRegular,
  composePlan,
} from "../src/rules.js";

test("wireframe catalog contains 16 unique profiles and the five assistive resources", () => {
  const ids = profileGroups.flatMap((group) =>
    group.items.map((item) => item.id),
  );
  assert.equal(ids.length, 16);
  assert.equal(new Set(ids).size, 16);
  assert.deepEqual(
    resources.map((item) => item.id),
    ["caa", "digital", "registro", "grafico", "apoio"],
  );
  const rules = suggestions(ids);
  assert.equal(rules.length, 16);
  for (const rule of rules) {
    assert.ok(rule.label, `${rule.id} must include label`);
    for (const key of [
      "origin",
      "objectives",
      "intro",
      "development",
      "closing",
    ]) {
      assert.ok(rule[key]?.length > 20, `${rule.id} must include ${key}`);
    }
    assert.equal(rule.accepted, true);
  }
  assert.equal(new Set(rules.map((rule) => rule.development)).size, 16);
});

test("selection deduplicates profiles, ignores unknown IDs and preserves a predictable catalog order", () => {
  assert.deepEqual(
    suggestions(["dislexia", "tea", "tea", "unknown"]).map((rule) => rule.id),
    ["tea", "dislexia"],
  );
  assert.deepEqual(suggestions([]), []);
  assert.deepEqual(suggestions(undefined), []);
});

test("origin shows only supplied support details and never infers a support level", () => {
  const rule = suggestions(["tea"], {
    tea: { level: ["Nível 2"], communication: "Não verbal" },
  })[0];
  assert.ok(rule.origin.includes("Nível de suporte informado: Nível 2"));
  assert.ok(rule.origin.includes("Comunicação informada: Não verbal"));
  assert.ok(rule.origin.includes("não constitui diagnóstico"));
  const defaultRule = suggestions(["tea"])[0];
  assert.ok(!defaultRule.origin.includes("Nível 1"));
  assert.equal(
    defaultRule.development,
    rule.development,
    "support level alone cannot infer individual barriers",
  );
  assert.ok(
    !suggestions(["tea"], {
      tea: { level: "Nível inventado" },
    })[0].origin.includes("inventado"),
  );
});

test("all support selectors produce traceable origin details", () => {
  for (const profile of profileGroups.flatMap((group) => group.items)) {
    for (const support of profile.support || []) {
      const origin = suggestions([profile.id], {
        [profile.id]: { [support.key]: support.options },
      })[0].origin;
      for (const option of support.options) assert.ok(origin.includes(option));
    }
  }
});

test("each generation returns an independent editable review copy", () => {
  const first = suggestions(["tdah"]);
  first[0].accepted = false;
  first[0].intro = "Orientação alterada pelo professor.";
  const next = suggestions(["tdah"]);
  assert.equal(next[0].accepted, true);
  assert.notEqual(first[0].intro, next[0].intro);
});

test("regular export preserves every wireframe field, all specific objectives and each stage duration", () => {
  const keys = [
    "school",
    "year",
    "classroom",
    "subject",
    "teacher",
    "date",
    "duration",
    "field",
    "practices",
    "knowledge",
    "skill",
    "matrix",
    "foundation",
    "difficulties",
    "objectives",
    "content",
    "intro",
    "development",
    "closing",
    "materials",
    "assessment",
    "references",
  ];
  const data = Object.fromEntries(
    keys.map((key) => [key, `Conteúdo exclusivo de ${key}`]),
  );
  Object.assign(data, {
    specificObjectives: [
      "Primeiro objetivo específico",
      "",
      "Segundo objetivo específico",
    ],
    introTime: 10,
    developmentTime: 25,
    closingTime: 15,
  });
  const plan = composeRegular(data);
  for (const key of keys)
    assert.ok(plan.includes(data[key]), `missing field: ${key}`);
  assert.ok(
    plan.includes(
      "1. Primeiro objetivo específico\n2. Segundo objetivo específico",
    ),
  );
  assert.ok(plan.includes("Introdução / Mobilização — 10 min"));
  assert.ok(plan.includes("Desenvolvimento / Prática Guiada — 25 min"));
  assert.ok(plan.includes("Fixação / Fechamento — 15 min"));
});

test("complete export preserves teacher edits and excludes rejected adaptations", () => {
  const rules = suggestions(["tea", "dislexia"]);
  rules[0].accepted = false;
  rules[0].development = "ESTRATÉGIA RECUSADA";
  rules[1].objectives = "Objetivo revisado pelo professor";
  rules[1].development = "Texto manual de manejo";
  const plan = composePlan(
    {
      skill: "Habilidade colada pelo professor",
      objectives: "Compreender o texto",
    },
    rules,
    "Observação particular",
    ["registro"],
    "Estudante A",
  );
  assert.ok(plan.includes("Habilidade colada pelo professor"));
  assert.ok(plan.includes("Objetivo revisado pelo professor"));
  assert.ok(plan.includes("Texto manual de manejo"));
  assert.ok(!plan.includes("ESTRATÉGIA RECUSADA"));
  assert.ok(!plan.includes(rules[0].origin));
  assert.ok(
    plan.includes(
      resources.find((resource) => resource.id === "registro").text,
    ),
  );
  assert.ok(
    !plan.includes(resources.find((resource) => resource.id === "caa").text),
  );
  assert.ok(plan.includes("Observação particular"));
  assert.ok(plan.includes("Estudante A"));
  assert.ok(plan.includes("não possui vínculo automático com um PI"));
  assert.ok(!plan.includes("EF15"));
});

test("empty inputs keep placeholders without inventing a skill, diagnosis or student", () => {
  const plan = composePlan();
  assert.ok(
    plan.includes(
      "Habilidades da BNCC informadas pelo professor\nNão informado.",
    ),
  );
  assert.ok(plan.includes("Nenhuma adaptação de perfil incluída."));
  assert.ok(plan.includes("Nenhum recurso selecionado."));
  assert.ok(!plan.includes("Identificação local do estudante (apelido)"));
  assert.ok(!plan.includes("EF15"));
  assert.ok(plan.includes("Não há integração com inteligência artificial."));
});

test("resources can be selected without a profile and are included once", () => {
  const plan = composePlan({}, [], "", ["digital", "digital", "unknown"]);
  assert.equal(
    plan.split(resources.find((resource) => resource.id === "digital").text)
      .length - 1,
    1,
  );
  assert.ok(plan.includes("Nenhuma adaptação de perfil incluída."));
});
