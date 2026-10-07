const CURRENT = "radar-pedagogico-v2";
export const emptyState = () => ({
  step: 1,
  data: { specificObjectives: [""] },
  selected: [],
  resources: [],
  support: {},
  rules: [],
  notes: "",
  student: "",
  final: "",
  finalEdited: false,
  dirty: false,
  tab: "",
});
const record = (value) =>
  value && typeof value === "object" && !Array.isArray(value);
export function normalizeState(raw) {
  if (!record(raw) || !record(raw.data)) throw new Error("Plano inválido");
  const state = emptyState();
  state.step = [1, 2, 3].includes(raw.step) ? raw.step : 1;
  for (const [key, value] of Object.entries(raw.data))
    if (typeof value === "string") state.data[key] = value;
  state.data.specificObjectives = Array.isArray(raw.data.specificObjectives)
    ? raw.data.specificObjectives.filter((x) => typeof x === "string")
    : [""];
  if (!state.data.specificObjectives.length)
    state.data.specificObjectives = [""];
  for (const key of ["selected", "resources"])
    state[key] = Array.isArray(raw[key])
      ? raw[key].filter((x) => typeof x === "string")
      : [];
  for (const key of ["notes", "student", "final", "tab"])
    state[key] = typeof raw[key] === "string" ? raw[key] : "";
  state.support = {};
  if (record(raw.support))
    for (const [id, groups] of Object.entries(raw.support))
      if (record(groups)) {
        state.support[id] = {};
        for (const [key, values] of Object.entries(groups))
          state.support[id][key] = Array.isArray(values)
            ? values.filter((v) => typeof v === "string")
            : typeof values === "string"
              ? [values]
              : [];
      }
  state.rules = Array.isArray(raw.rules)
    ? raw.rules
        .filter(
          (r) =>
            record(r) &&
            typeof r.id === "string" &&
            [
              "label",
              "origin",
              "objectives",
              "intro",
              "development",
              "closing",
            ].every((k) => typeof r[k] === "string"),
        )
        .map((r) => ({ ...r, accepted: r.accepted !== false }))
    : [];
  state.finalEdited = raw.finalEdited === true;
  state.dirty = raw.dirty === true;
  return state;
}
export function readLibrary() {
  const raw = localStorage.getItem(CURRENT);
  if (!raw) return { draft: null, plans: [], students: [] };
  const library = JSON.parse(raw);
  if (!record(library)) throw new Error("Histórico inválido");
  return {
    draft: library.draft ? normalizeState(library.draft) : null,
    plans: Array.isArray(library.plans)
      ? library.plans
          .filter(
            (p) =>
              record(p) &&
              typeof p.id === "string" &&
              typeof p.title === "string" &&
              typeof p.date === "string",
          )
          .map((p) => ({ ...p, state: normalizeState(p.state) }))
      : [],
    students: Array.isArray(library.students)
      ? library.students.filter((s) => typeof s === "string")
      : [],
  };
}
export function writeLibrary(library) {
  localStorage.setItem(CURRENT, JSON.stringify(library));
}
export function readLegacyDraft() {
  const raw = localStorage.getItem("radar-pedagogico-v1");
  if (!raw) return null;
  const old = JSON.parse(raw);
  const migrated = normalizeState(old);
  migrated.step = 1;
  migrated.selected = [];
  migrated.rules = [];
  migrated.finalEdited = Boolean(migrated.final.trim());
  return migrated;
}
