// Catálogo editorial do protótipo: seleções do professor escolhem regras.
// Não há diagnóstico, inferência sobre estudantes nem geração por IA.
export const profileGroups = [
  {
    title: "Neurodivergências e transtornos do desenvolvimento",
    items: [
      {
        id: "tea",
        label: "Transtorno do Espectro Autista (TEA)",
        support: [
          {
            key: "level",
            label: "Nível de suporte informado",
            options: ["Nível 1", "Nível 2", "Nível 3"],
          },
          {
            key: "communication",
            label: "Comunicação informada",
            options: ["Verbal", "Não verbal"],
          },
        ],
      },
      {
        id: "tdah",
        label: "Transtorno do Déficit de Atenção com Hiperatividade (TDAH)",
        support: [
          {
            key: "predominance",
            label: "Predominância informada",
            options: ["Desatento", "Hiperativo/Impulsivo", "Misto"],
          },
        ],
      },
      { id: "tod", label: "Transtorno Opositivo Desafiador (TOD)" },
    ],
  },
  {
    title: "Deficiências sensoriais",
    items: [
      { id: "cegueira", label: "Deficiência visual — cegueira" },
      {
        id: "baixaVisao",
        label: "Deficiência visual — baixa visão / visão subnormal",
      },
      { id: "surdez", label: "Deficiência auditiva — surdez" },
      {
        id: "hipoacusia",
        label: "Deficiência auditiva — hipoacusia / perda parcial",
      },
      { id: "surdocegueira", label: "Surdocegueira" },
    ],
  },
  {
    title: "Deficiências físicas e motoras",
    items: [
      {
        id: "motora",
        label: "Deficiência física / motora",
        support: [
          {
            key: "type",
            label: "Especificação informada",
            options: [
              "Pessoa que utiliza cadeira de rodas",
              "Paralisia cerebral",
              "Amputação / malformação",
              "Dificuldade de coordenação motora fina (escrita)",
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Deficiências intelectuais, psicossociais e múltiplas",
    items: [
      { id: "intelectual", label: "Deficiência intelectual (DI)" },
      {
        id: "psicossocial",
        label: "Deficiência psicossocial / transtorno mental",
      },
      { id: "multipla", label: "Deficiência múltipla" },
    ],
  },
  {
    title: "Transtornos específicos de aprendizagem",
    items: [
      { id: "dislexia", label: "Dislexia — leitura e decodificação" },
      {
        id: "disgrafia",
        label: "Disgrafia / disortografia — escrita e ortografia",
      },
      {
        id: "discalculia",
        label: "Discalculia — conceitos numéricos e matemáticos",
      },
    ],
  },
  {
    title: "Altas habilidades / superdotação",
    items: [
      {
        id: "altasHabilidades",
        label: "Altas habilidades / superdotação (AH/SD)",
        support: [
          {
            key: "domain",
            label: "Área de domínio informada",
            options: [
              "Intelectual/Acadêmica",
              "Criatividade/Artística",
              "Liderança",
              "Psicomotora",
            ],
          },
        ],
      },
    ],
  },
];

export const resources = [
  {
    id: "caa",
    label: "Comunicação Alternativa e Aumentativa (CAA)",
    text: "Utilize o sistema de comunicação que o estudante já conhece. Inclua vocabulário relacionado à aula, disponibilize formas de expressar escolhas e dúvidas e respeite o tempo de resposta. Os cartões deste protótipo são materiais de apoio; confirme a adequação dos símbolos antes do uso.",
  },
  {
    id: "digital",
    label: "Tecnologia Assistiva Digital",
    text: "Disponibilize texto digital selecionável, títulos organizados e descrição de imagens. Teste os arquivos com o leitor de tela, a ampliação ou o dispositivo de entrada utilizado pelo estudante antes da aula. O professor deve confirmar a disponibilidade dos equipamentos e aplicativos.",
  },
  {
    id: "registro",
    label: "Flexibilização de Registro/Escrita",
    text: "Combine respostas orais, digitadas, por imagens, objetos ou CAA quando pertinentes ao objetivo. Avalie o conhecimento previsto, distinguindo-o do modo de registro; quando a escrita for o próprio objetivo, preserve esse critério e ajuste os apoios e o tempo.",
  },
  {
    id: "grafico",
    label: "Adaptação de Materiais Gráficos",
    text: "Prepare uma versão com fonte ampliada, contraste e espaçamento ajustados à preferência do estudante. Evite informação transmitida somente por cor e descreva imagens relevantes. Confirme a legibilidade com o estudante; não há um tamanho de fonte adequado a todas as pessoas.",
  },
  {
    id: "apoio",
    label: "Apoio Humano",
    text: "Combine previamente as funções do profissional de apoio, do AEE, do intérprete de Libras ou do guia-intérprete, quando disponíveis e pertinentes. Dirija-se ao estudante e preserve sua autonomia. Selecionar este recurso não confirma a presença de um profissional na aula.",
  },
];

const adaptationRules = {
  tea: {
    objectives:
      "Preserve os objetivos curriculares e explicite o que será aprendido. Combine formas acessíveis de demonstrar a aprendizagem, respeitando o modo de comunicação e os interesses informados pelo estudante.",
    intro:
      "Apresente uma sequência visual ou textual da aula, antecipe mudanças e explique o começo e o término das atividades. Verifique com o estudante os apoios de comunicação e as condições sensoriais que favorecem sua participação.",
    development:
      "Organize instruções claras em etapas, modele um exemplo e disponibilize a sequência para consulta. Combine pausas e alternativas de participação quando necessárias, sem presumir preferências a partir do nível de suporte informado.",
    closing:
      "Antecipe a transição para o encerramento, retome o que foi aprendido e permita uma resposta no modo de comunicação combinado. Registre quais apoios foram úteis para o próximo planejamento.",
  },
  tdah: {
    objectives:
      "Mantenha o objetivo da aula e explicite metas curtas para cada momento. Avalie o conhecimento desenvolvido sem confundir distração, ritmo ou necessidade de movimento com ausência de aprendizagem.",
    intro:
      "Apresente a agenda e uma instrução por vez. Combine com o estudante uma forma discreta de retomar a atenção e organize os materiais necessários para começar.",
    development:
      "Divida a tarefa em blocos com pontos de checagem e feedback específico. Permita pausas de movimento combinadas, ofereça uma lista de etapas e ajuste as distrações ambientais conforme a necessidade observada.",
    closing:
      "Reserve tempo para organizar e concluir o registro. Retome as etapas realizadas, peça uma síntese breve e combine uma forma de anotar o próximo passo.",
  },
  tod: {
    objectives:
      "Preserve as expectativas de aprendizagem e estabeleça critérios claros, com escolhas de participação compatíveis com o objetivo. Revise as estratégias à luz da relação pedagógica e do contexto, sem atribuir intenções ao estudante.",
    intro:
      "Apresente combinados claros e previsíveis, escute o estudante e ofereça escolhas viáveis para iniciar. Use comunicação respeitosa e evite exposição pública ou confronto.",
    development:
      "Dê instruções objetivas e feedback em particular. Combine uma possibilidade de pausa e retomada, ofereça escolhas de ordem ou formato da atividade e valorize a participação sem punições ou disputas de poder.",
    closing:
      "Retome o aprendizado e convide o estudante a avaliar o que ajudou sua participação. Combine o próximo passo em conversa breve e respeitosa, registrando observações pedagógicas concretas.",
  },
  cegueira: {
    objectives:
      "Mantenha os objetivos e garanta acesso não visual às informações essenciais. Combine registros por áudio, texto digital acessível, Braille ou recursos táteis conforme o repertório e a preferência do estudante.",
    intro:
      "Descreva o espaço, os materiais e as imagens relevantes. Apresente verbalmente a sequência da aula e combine orientação e identificação dos objetos sem presumir o uso de Braille.",
    development:
      "Descreva ações no quadro e informações de gráficos, use materiais táteis quando pertinentes e ofereça arquivos compatíveis com a tecnologia assistiva do estudante. Antecipe a exploração dos recursos e organize a circulação com segurança.",
    closing:
      "Ofereça síntese oral ou digital acessível e aceite o registro combinado. Confira a compreensão dos conceitos em vez de exigir reprodução visual dos materiais.",
  },
  baixaVisao: {
    objectives:
      "Preserve os objetivos curriculares e ajuste o acesso visual conforme a preferência do estudante. A ampliação, o contraste e o meio de resposta devem favorecer o conteúdo avaliado.",
    intro:
      "Confirme iluminação, posição, distância de leitura e tamanho de fonte adequados. Apresente os materiais com contraste e verbalize as informações visuais essenciais.",
    development:
      "Disponibilize versão ampliada ou digital ajustável, reduza a poluição visual e descreva imagens e gráficos. Combine pausas e tempo de exploração dos materiais conforme a necessidade observada.",
    closing:
      "Use uma síntese legível ou oral e permita o registro acessível combinado. Peça ao estudante retorno sobre a legibilidade para revisar os materiais.",
  },
  surdez: {
    objectives:
      "Mantenha o objetivo e assegure acesso à língua e ao modo de comunicação utilizados pelo estudante. A surdez, por si só, não informa se a pessoa utiliza Libras, português escrito ou outra modalidade.",
    intro:
      "Confirme a forma de comunicação e combine os apoios disponíveis. Para estudante que utiliza Libras, planeje a mediação com intérprete quando disponível; mantenha rosto e mãos visíveis e apresente a agenda visualmente.",
    development:
      "Forneça instruções também em formato visual ou escrito acessível ao estudante, legende vídeos e organize turnos de fala. Quando houver interpretação, reserve tempo para acompanhar a explicação antes de iniciar a tarefa.",
    closing:
      "Disponibilize a síntese no modo de comunicação combinado e aceite respostas em Libras ou outro formato adequado. Verifique a compreensão por meio da atividade, sem depender apenas de instruções orais.",
  },
  hipoacusia: {
    objectives:
      "Preserve os objetivos e combine acesso às informações orais por formatos complementares. O uso de aparelho auditivo ou sistema FM deve ser informado pelo estudante ou pela equipe; não é presumido.",
    intro:
      "Reduza ruídos quando possível, mantenha o rosto visível e confirme a posição e os apoios de escuta preferidos. Apresente as instruções essenciais também por escrito ou visualmente.",
    development:
      "Fale de modo natural, organize um turno de fala por vez e repita ou reformule quando solicitado. Legende vídeos e, se houver sistema FM disponível, confirme seu uso com o estudante e a equipe antes da atividade.",
    closing:
      "Retome as ideias principais em texto ou recurso visual e confirme a compreensão por uma síntese do estudante. Registre os ajustes de comunicação que favoreceram a participação.",
  },
  surdocegueira: {
    objectives:
      "Preserve o propósito curricular e planeje acesso pelas formas de comunicação e exploração já utilizadas pelo estudante. Combine objetivos e apoios com o estudante, o AEE e os profissionais envolvidos, quando disponíveis.",
    intro:
      "Antecipe a rotina por objetos de referência, sinais táteis, texto ampliado ou outros recursos conhecidos pelo estudante. Combine a apresentação dos materiais e a mediação com guia-intérprete quando disponível e pertinente.",
    development:
      "Dê tempo para exploração e resposta, apresente um recurso por vez e mantenha referências estáveis no espaço. Utilize o canal de comunicação combinado, solicitando consentimento antes de apoio físico ou comunicação tátil.",
    closing:
      "Faça a síntese na forma de comunicação utilizada pelo estudante, sinalize o encerramento e registre a resposta observada. Ajuste a próxima aula conforme os apoios efetivamente úteis.",
  },
  motora: {
    objectives:
      "Mantenha os objetivos e diferencie o conhecimento curricular da exigência de movimento ou escrita manual. Combine meios acessíveis de participação sem presumir limitações cognitivas ou de comunicação.",
    intro:
      "Verifique circulação, posicionamento e alcance dos materiais com o estudante. Combine os apoios solicitados, sem movimentar a pessoa, a cadeira ou seus recursos sem consentimento.",
    development:
      "Ofereça materiais estabilizados, ferramentas adaptadas ou entrada digital quando adequados. Permita respostas orais, digitadas ou mediadas e ajuste o tempo às necessidades observadas, preservando a participação nas decisões.",
    closing:
      "Aceite o formato de registro combinado e avalie o conteúdo aprendido. Confira o conforto e a utilidade dos recursos, registrando ajustes de acesso para a próxima aula.",
  },
  intelectual: {
    objectives:
      "Preserve o tema curricular e explicite os objetivos em passos compreensíveis. Planeje apoios e critérios observáveis com base no conhecimento prévio demonstrado, sem reduzir expectativas apenas pela categoria selecionada.",
    intro:
      "Ative conhecimentos prévios com exemplos concretos relacionados ao tema. Apresente a sequência em linguagem clara e verifique a compreensão por demonstração ou outra resposta acessível.",
    development:
      "Modele um exemplo, pratique com apoio e ofereça progressivamente oportunidades de autonomia. Use recursos concretos ou visuais pertinentes, repita de formas variadas e dê feedback específico sobre cada etapa.",
    closing:
      "Retome as ideias principais com exemplos e convide o estudante a demonstrar uma aplicação. Registre avanços e apoios necessários para planejar a continuidade, mantendo critérios claros.",
  },
  psicossocial: {
    objectives:
      "Mantenha os objetivos e combine formas de participação e avaliação conforme as necessidades educacionais informadas. As sugestões são pedagógicas e não substituem acompanhamento ou orientação clínica.",
    intro:
      "Apresente uma rotina previsível e combine discretamente formas de solicitar ajuda ou pausa. Respeite a privacidade do estudante e evite exigir exposição pessoal.",
    development:
      "Dê instruções claras, mantenha uma comunicação respeitosa e ofereça opções de participação com menor exposição quando necessárias. Combine pausa e retomada e articule os apoios escolares existentes conforme orientações acordadas.",
    closing:
      "Faça uma síntese em formato confortável para o estudante e combine o próximo passo. Registre observações sobre participação e aprendizagem sem interpretações clínicas ou rótulos de comportamento.",
  },
  multipla: {
    objectives:
      "Preserve o objetivo curricular e compatibilize os apoios efetivamente necessários com o estudante e a equipe. Não some adaptações automaticamente; considere como recursos de comunicação, percepção e movimento interagem.",
    intro:
      "Confirme o canal de comunicação, a forma de exploração dos materiais e os apoios disponíveis. Apresente a rotina em formato acessível e combine o posicionamento e a orientação no espaço.",
    development:
      "Apresente os recursos em etapas e confira se uma adaptação cria barreira em outra área. Dê tempo para exploração e resposta, utilize os recursos conhecidos e combine a atuação dos profissionais de apoio quando disponíveis.",
    closing:
      "Retome o aprendizado pelo modo de comunicação combinado e registre a participação e os apoios úteis. Revise com a equipe a combinação de recursos antes da próxima aula.",
  },
  dislexia: {
    objectives:
      "Preserve o objetivo curricular e diferencie compreensão do conteúdo de decodificação quando esta não for o objetivo. Quando a leitura for o foco, mantenha critérios explícitos e ofereça os apoios pedagógicos pertinentes.",
    intro:
      "Apresente palavras-chave e explique o vocabulário necessário. Leia as instruções junto com o estudante quando pertinente e não exija leitura em voz alta sem combinação prévia.",
    development:
      "Divida textos em trechos com boa organização visual, ofereça leitura compartilhada ou áudio quando apropriados e destaque as etapas da tarefa. Dê tempo flexível e verifique a compreensão sem depender exclusivamente da velocidade de leitura.",
    closing:
      "Permita síntese oral, por esquema ou por escrita apoiada conforme o objetivo. Separe, nos critérios de avaliação, a compreensão do conteúdo dos aspectos de leitura que estejam sendo ensinados.",
  },
  disgrafia: {
    objectives:
      "Mantenha os objetivos e separe aprendizagem do conteúdo, traçado da letra e ortografia nos critérios. Se escrita ou ortografia forem o foco, planeje apoio específico sem excluir a prática pertinente.",
    intro:
      "Apresente a tarefa e combine o meio de registro mais adequado. Disponibilize modelo organizado e explique os critérios de conteúdo e escrita em linguagem clara.",
    development:
      "Ofereça tempo, pauta ou ferramenta de escrita adequada e opções de digitação quando disponíveis. Reduza cópias extensas sem relação com o objetivo e organize a revisão ortográfica em etapas, com exemplos e feedback.",
    closing:
      "Permita revisar o registro com os apoios combinados ou apresentar oralmente o conteúdo quando pertinente. Avalie separadamente os critérios de aprendizagem, legibilidade e ortografia definidos para a aula.",
  },
  discalculia: {
    objectives:
      "Preserve o conceito matemático previsto e explicite o raciocínio esperado. Diferencie compreensão, representação e automatização de cálculos nos critérios, com base no desempenho observado.",
    intro:
      "Ative conhecimentos prévios com situações concretas, quantidades e representações acessíveis. Explique o vocabulário matemático e modele uma situação ligada ao conteúdo da aula.",
    development:
      "Use materiais manipuláveis, reta numérica ou esquemas quando pertinentes. Apresente uma etapa de cálculo por vez, peça explicação do raciocínio e ofereça tempo e prática guiada; use calculadora apenas quando compatível com o objetivo.",
    closing:
      "Retome o conceito por outra representação e peça ao estudante que explique ou demonstre uma estratégia. Avalie o raciocínio previsto, distinguindo-o da rapidez de cálculo quando esta não for o foco.",
  },
  altasHabilidades: {
    objectives:
      "Mantenha o núcleo curricular e proponha aprofundamento na área de interesse informada. Combine um desafio com maior investigação ou complexidade, evitando apenas ampliar a quantidade de tarefas.",
    intro:
      "Investigue o conhecimento prévio e apresente uma questão aberta relacionada ao tema. Combine o desafio com o estudante, sem presumir desempenho elevado em todas as áreas.",
    development:
      "Ofereça pesquisa, comparação de estratégias ou criação de um produto ligado ao objetivo. Ajuste o desafio à área informada e ao interesse demonstrado, com opções de trabalho individual ou colaborativo e acompanhamento docente.",
    closing:
      "Convide o estudante a compartilhar o processo, justificar escolhas ou avaliar novas perguntas. Reconheça o aprofundamento com critérios claros, sem lhe atribuir a função permanente de ensinar os colegas.",
  },
};

const profileList = profileGroups.flatMap((group) => group.items);

function supportDescription(profile, support) {
  const provided = support?.[profile.id];
  if (!provided || typeof provided !== "object") return "";
  return (profile.support || [])
    .flatMap((field) => {
      const values = Array.isArray(provided[field.key])
        ? provided[field.key]
        : [provided[field.key]];
      // Somente opções conhecidas chegam ao texto. Não inferimos suporte do perfil.
      const selected = field.options.filter((option) =>
        values.includes(option),
      );
      return selected.length ? [`${field.label}: ${selected.join(", ")}`] : [];
    })
    .join("; ");
}

export function suggestions(selected = [], support = {}) {
  const ids = new Set(Array.isArray(selected) ? selected : []);
  return profileList
    .filter((profile) => ids.has(profile.id))
    .map((profile) => {
      const details = supportDescription(profile, support);
      return {
        id: profile.id,
        label: profile.label,
        origin: `Regra predefinida para a categoria selecionada pelo professor: ${profile.label}.${details ? ` ${details}.` : ""} Revise a pertinência de cada orientação para este contexto; a seleção não constitui diagnóstico.`,
        accepted: true,
        ...adaptationRules[profile.id],
      };
    });
}

function text(value) {
  if (typeof value !== "string" && typeof value !== "number") return "";
  return String(value).trim();
}

function field(label, value) {
  return `${label}\n${text(value) || "Não informado."}`;
}

function moment(label, minutes, description) {
  const time = text(minutes);
  return `${label} — ${time ? `${time} min` : "tempo não informado"}\n${text(description) || "Não informado."}`;
}

export function composeRegular(data = {}) {
  const specificObjectives = (
    Array.isArray(data.specificObjectives) ? data.specificObjectives : []
  )
    .map(text)
    .filter(Boolean)
    .map((value, index) => `${index + 1}. ${value}`)
    .join("\n");
  return [
    "PLANO DE AULA REGULAR — RADAR PEDAGÓGICO",
    "IDENTIFICAÇÃO E DADOS GERAIS",
    field("Unidade Escolar", data.school),
    field("Ano Letivo", data.year),
    field("Turma", data.classroom),
    field("Componente Curricular", data.subject),
    field("Professor(a) Regente", data.teacher),
    field("Data da Aula", data.date),
    field("Duração da Aula (minutos)", data.duration),
    "ALINHAMENTO CURRICULAR (BNCC E REQUISITOS)",
    field("Campo de Atuação", data.field),
    field("Práticas de Linguagem", data.practices),
    field("Objeto de Conhecimento", data.knowledge),
    field("Habilidades da BNCC informadas pelo professor", data.skill),
    field(
      "Correspondência / Matriz de Referência (SAEB ou Estadual)",
      data.matrix,
    ),
    field("Informações sobre o Gênero e Fundamentação", data.foundation),
    field("Dificuldades Antecipadas da Turma", data.difficulties),
    "OBJETIVOS E CONTEÚDO",
    field("Objetivo Geral da Aula", data.objectives),
    field("Objetivos Específicos", specificObjectives),
    field("Conteúdo Programático", data.content),
    "DESENVOLVIMENTO DA AULA (METODOLOGIA)",
    moment("Introdução / Mobilização", data.introTime, data.intro),
    moment(
      "Desenvolvimento / Prática Guiada",
      data.developmentTime,
      data.development,
    ),
    moment("Fixação / Fechamento", data.closingTime, data.closing),
    "RECURSOS, AVALIAÇÃO E REFERÊNCIAS",
    field("Recursos Didáticos / Materiais Necessários", data.materials),
    field("Instrumentos e Critérios de Avaliação", data.assessment),
    field("Referências Bibliográficas", data.references),
  ].join("\n\n");
}

export function composePlan(
  data = {},
  rules = [],
  notes = "",
  resourceIds = [],
  student = "",
) {
  const accepted = (Array.isArray(rules) ? rules : []).filter(
    (rule) => rule.accepted === true,
  );
  const selectedResources = new Set(
    Array.isArray(resourceIds) ? resourceIds : [],
  );
  const resourceText = resources
    .filter((resource) => selectedResources.has(resource.id))
    .map((resource) => `${resource.label}\n${resource.text}`)
    .join("\n\n");
  const adaptationText = accepted
    .map((rule) =>
      [
        text(rule.label),
        field("Origem da sugestão", rule.origin),
        field("Objetivos Flexibilizados", rule.objectives),
        field("Manejo na Introdução", rule.intro),
        field("Manejo no Desenvolvimento", rule.development),
        field("Manejo no Fechamento", rule.closing),
      ].join("\n\n"),
    )
    .join("\n\n");
  return [
    "PLANO DE AULA ADAPTADO — RADAR PEDAGÓGICO",
    composeRegular(data),
    "ADAPTAÇÕES REVISADAS PELO PROFESSOR",
    adaptationText || "Nenhuma adaptação de perfil incluída.",
    "RECURSOS ASSISTIVOS E METODOLÓGICOS SELECIONADOS",
    resourceText || "Nenhum recurso selecionado.",
    ...(text(student)
      ? [
          field("Identificação local do estudante (apelido)", student),
          "Identificação informada pelo professor. Este protótipo não possui vínculo automático com um PI ou cadastro institucional.",
        ]
      : []),
    ...(text(notes) ? [field("Observações e Notas do Professor", notes)] : []),
    "Sugestões baseadas em regras predefinidas, editáveis e revisáveis pelo professor. Não há integração com inteligência artificial. As habilidades curriculares são transcritas do conteúdo informado; o protótipo não cria nem valida códigos BNCC. Confirme a adequação pedagógica e a disponibilidade dos recursos antes da aula.",
  ].join("\n\n");
}
