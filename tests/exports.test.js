import { test } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import { buildWord, buildKit } from "../src/exports.js";

test("Word download contains a valid OOXML package and preserves teacher paragraphs", async () => {
  const text =
    'Plano do professor\r\n\r\n  Ação & reflexão <revisada> "turma"\nEmoji 😊';
  const blob = await buildWord(text);
  assert.equal(
    blob.type,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  );
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  for (const name of [
    "[Content_Types].xml",
    "_rels/.rels",
    "word/document.xml",
    "word/styles.xml",
    "word/_rels/document.xml.rels",
  ]) {
    assert.ok(zip.file(name), `${name} is required in the Word package`);
  }
  const document = await zip.file("word/document.xml").async("string");
  assert.match(
    document,
    /<w:document xmlns:w="http:\/\/schemas\.openxmlformats\.org\/wordprocessingml\/2006\/main">/,
  );
  assert.equal((document.match(/<w:p>/g) ?? []).length, 4);
  assert.ok(document.includes('<w:t xml:space="preserve"></w:t>'));
  assert.ok(
    document.includes(
      "  Ação &amp; reflexão &lt;revisada&gt; &quot;turma&quot;",
    ),
  );
  assert.ok(document.includes("Emoji 😊"));
  const relationships = await zip.file("_rels/.rels").async("string");
  assert.ok(relationships.includes('Target="word/document.xml"'));
  const types = await zip.file("[Content_Types].xml").async("string");
  assert.ok(
    types.includes(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml",
    ),
  );
});

test("Word escapes XML input and removes characters forbidden in XML 1.0", async () => {
  const zip = await JSZip.loadAsync(
    await (await buildWord("<w:p>\u0000\u0001\ud800 & 'fim'")).arrayBuffer(),
  );
  const document = await zip.file("word/document.xml").async("string");
  assert.ok(document.includes("&lt;w:p&gt; &amp; &apos;fim&apos;"));
  assert.ok(!document.includes("\u0000"));
  assert.ok(!document.includes("\u0001"));
  assert.ok(!document.includes("\ud800"));
});

test("materials ZIP provides printable standalone templates and escapes teacher HTML", async () => {
  const text =
    "Texto do professor: água & chão\n</pre><script>alert(\"x\")</script>\n'A'";
  const blob = await buildKit(text);
  assert.equal(blob.type, "application/zip");
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  assert.deepEqual(Object.keys(zip.files).sort(), [
    "LEIA-ME.txt",
    "sentiments.html",
    "texto-ampliado.html",
  ]);
  const large = await zip.file("texto-ampliado.html").async("string");
  assert.ok(large.includes('lang="pt-BR"'));
  assert.ok(large.includes('<meta charset="utf-8">'));
  assert.ok(large.includes("font-size:24px"));
  assert.ok(large.includes("@media print"));
  assert.ok(
    large.includes(
      "Texto do professor: água &amp; chão\n&lt;/pre&gt;&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;\n&apos;A&apos;",
    ),
  );
  assert.ok(!large.includes("<script>"));
  assert.ok(!large.includes("<link"));
  const feelings = await zip.file("sentiments.html").async("string");
  assert.equal((feelings.match(/class="cartao"/g) ?? []).length, 6);
  for (const label of [
    "Alegria",
    "Tristeza",
    "Raiva",
    "Medo",
    "Calma",
    "Cansaço",
  ])
    assert.ok(feelings.includes(label));
  assert.ok(feelings.includes("Modelo genérico"));
  assert.ok(feelings.includes("break-inside:avoid"));
  const instructions = await zip.file("LEIA-ME.txt").async("string");
  assert.ok(instructions.includes("Revise cada material"));
  assert.ok(instructions.includes("sem geração por inteligência artificial"));
  assert.ok(
    instructions.includes(
      "não foi resumido, simplificado ou reescrito automaticamente",
    ),
  );
});

test("empty exports remain usable documents", async () => {
  const word = await JSZip.loadAsync(await (await buildWord()).arrayBuffer());
  assert.ok(
    (await word.file("word/document.xml").async("string")).includes(
      '<w:t xml:space="preserve"></w:t>',
    ),
  );
  const kit = await JSZip.loadAsync(await (await buildKit()).arrayBuffer());
  assert.ok(
    (await kit.file("texto-ampliado.html").async("string")).includes(
      '<pre class="texto"></pre>',
    ),
  );
});
