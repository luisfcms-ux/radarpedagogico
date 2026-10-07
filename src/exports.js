import JSZip from "jszip";

const WORD_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const HTML_TYPE = "text/html;charset=utf-8";
const ZIP_TYPE = "application/zip";

function escapeMarkup(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character],
  );
}

// XML 1.0 excludes control characters and isolated UTF-16 surrogate code units.
function xmlText(value) {
  return escapeMarkup(
    String(value ?? "").replace(
      /[^\u0009\u000a\u000d\u0020-\ud7ff\ue000-\ufffd\u{10000}-\u{10ffff}]/gu,
      "",
    ),
  );
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  // Give the browser time to start reading the object URL before releasing it.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function documentHtml(title, body, extraStyle = "") {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeMarkup(title)} — Radar Pedagógico</title>
<style>
*{box-sizing:border-box}body{margin:0 auto;padding:32px;max-width:1000px;background:#fff;color:#111;font-family:Arial,sans-serif;line-height:1.5}h1{font-size:28px;line-height:1.25}.nota{font-size:16px;color:#222} @media print{body{padding:0;max-width:none}h1{break-after:avoid}a{color:inherit}} ${extraStyle}
</style>
</head>
<body>${body}</body>
</html>`;
}

function feelingsHtml() {
  const feelings = [
    ["😊", "Alegria"],
    ["😢", "Tristeza"],
    ["😠", "Raiva"],
    ["😨", "Medo"],
    ["😌", "Calma"],
    ["😴", "Cansaço"],
  ];
  const cards = feelings
    .map(
      ([emoji, label]) =>
        `<article class="cartao"><span class="emoji" aria-hidden="true">${emoji}</span><h2>${label}</h2></article>`,
    )
    .join("\n");
  return documentHtml(
    "Cartões de sentimentos",
    `<h1>Como estou me sentindo?</h1>
<p class="nota">Modelo genérico para revisar com a turma. É possível apontar, falar ou escolher um cartão. As expressões são ilustrativas; cada pessoa pode sentir e expressar emoções de outras formas.</p>
<div class="cartoes">${cards}</div>
<p class="nota">Radar Pedagógico · Material de apoio para impressão. Ajuste as opções e a forma de uso às necessidades dos estudantes.</p>`,
    ".cartoes{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:28px 0}.cartao{border:2px solid #111;border-radius:12px;text-align:center;padding:24px 8px;break-inside:avoid}.emoji{font-size:72px;line-height:1.3}.cartao h2{font-size:24px;margin:12px 0 0}@media(max-width:600px){.cartoes{grid-template-columns:repeat(2,1fr)}}",
  );
}

function largeTextHtml(text) {
  return documentHtml(
    "Texto ampliado",
    `<h1>Texto ampliado</h1>
<p class="nota">Texto fornecido e revisado pelo professor. A apresentação usa fonte ampliada e alto contraste; confira se o formato atende à turma.</p>
<pre class="texto">${escapeMarkup(text)}</pre>`,
    ".texto{font-family:Arial,sans-serif;font-size:24px;line-height:1.65;white-space:pre-wrap;overflow-wrap:anywhere;margin:28px 0}@media print{.texto{font-size:24px}}",
  );
}

/** Produces a real Office Open XML document, without changing teacher text. */
export async function buildWord(text) {
  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`,
  );
  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
  );
  zip.file(
    "word/_rels/document.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
  );
  zip.file(
    "word/styles.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:pPr><w:spacing w:after="120"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="24"/></w:rPr></w:style></w:styles>`,
  );
  const paragraphs = String(text ?? "")
    .split(/\r\n|\r|\n/)
    .map(
      (line) =>
        `<w:p><w:r><w:t xml:space="preserve">${xmlText(line)}</w:t></w:r></w:p>`,
    )
    .join("");
  zip.file(
    "word/document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`,
  );
  const data = await zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
  });
  return new Blob([data], { type: WORD_TYPE });
}

export async function downloadWord(text) {
  download(await buildWord(text), "radar-pedagogico.docx");
}

/** Bundles printable, generic templates with the exact supplied teacher text. */
export async function buildKit(text) {
  const zip = new JSZip();
  zip.file("sentiments.html", feelingsHtml());
  zip.file("texto-ampliado.html", largeTextHtml(text));
  zip.file(
    "LEIA-ME.txt",
    `Radar Pedagógico — Materiais de apoio\n\nEste kit contém modelos genéricos, sem geração por inteligência artificial. Revise cada material antes de usar com a turma. As propostas não representam diagnóstico nem garantem atendimento de uma necessidade individual.\n\nArquivos:\n- sentiments.html: cartões ilustrativos de sentimentos. Abra no navegador e imprima; ajuste a seleção e a linguagem conforme a turma.\n- texto-ampliado.html: o texto fornecido pelo professor, apresentado em fonte de 24 px e alto contraste. Abra no navegador e imprima ou salve como PDF. O conteúdo não foi resumido, simplificado ou reescrito automaticamente.\n\nOs arquivos funcionam sem internet e não enviam dados para serviços externos. Confira o conteúdo, a legibilidade e a adequação antes de compartilhar.\n`,
  );
  const data = await zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
  });
  return new Blob([data], { type: ZIP_TYPE });
}

export async function downloadKit(text) {
  download(await buildKit(text), "materiais-adaptados.zip");
}

export function downloadFeelings() {
  download(
    new Blob([feelingsHtml()], { type: HTML_TYPE }),
    "cartoes-sentimentos.html",
  );
}

export function downloadLargeText(text) {
  download(
    new Blob([largeTextHtml(text)], { type: HTML_TYPE }),
    "texto-ampliado.html",
  );
}
