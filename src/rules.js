export const groups = [
  {title:'Barreiras à aprendizagem', items:[
    ['leitura','Leitura e compreensão de textos','Ofereça leitura compartilhada, explique o vocabulário e apresente instruções curtas em etapas.'],
    ['atencao','Atenção e organização','Divida as atividades em blocos curtos, apresente uma sequência visual e combine pausas com a turma.'],
    ['visual','Acesso à informação visual','Descreva imagens e gráficos oralmente; disponibilize materiais com contraste e ampliação conforme a preferência do estudante.'],
    ['auditiva','Acesso à informação oral','Forneça instruções também por escrito e mantenha o rosto visível. Combine com o estudante os apoios de comunicação necessários.'],
    ['motora','Escrita e manipulação de materiais','Ofereça alternativas à escrita manual e organize materiais e circulação para permitir participação acessível.']
  ]},
  {title:'Necessidades de participação', items:[
    ['comunicacao','Apoio à comunicação','Permita respostas por fala, gesto, imagens ou comunicação alternativa, respeitando o tempo de resposta.'],
    ['previsibilidade','Previsibilidade e conforto sensorial','Antecipe mudanças, apresente a rotina e combine uma opção de pausa em ambiente tranquilo.'],
    ['ritmo','Mais tempo e prática guiada','Ofereça tempo flexível, modele um exemplo e verifique a compreensão antes da prática independente.'],
    ['desafio','Aprofundamento e novos desafios','Ofereça um desafio de aprofundamento ligado ao mesmo objetivo, sem acrescentar tarefas repetitivas.']
  ]},
  {title:'Recursos disponíveis', items:[
    ['caa','Comunicação alternativa (CAA)','Disponibilize o recurso de comunicação já utilizado pelo estudante e inclua vocabulário relacionado à aula.'],
    ['digital','Tecnologia assistiva digital','Prepare materiais digitais acessíveis e teste a compatibilidade com a tecnologia assistiva usada pelo estudante.'],
    ['registro','Alternativas de registro','Aceite registro oral, digitado ou por imagens, avaliando o aprendizado previsto em vez do formato da resposta.'],
    ['grafico','Materiais ampliados e com contraste','Prepare uma versão com fonte ampliada, contraste adequado e organização visual simples; confirme sua legibilidade com o estudante.'],
    ['apoio','Apoio humano','Combine previamente o papel do profissional de apoio, preservando a autonomia e a participação do estudante.']
  ]}
];
export function suggestions(selected) {
  return groups.flatMap(g => g.items.filter(([id]) => selected.includes(id)).map(([id,label,text]) => ({id,label,text,accepted:true})));
}
export function composePlan(data, rules, notes) {
  const fields = [['Escola','school'],['Professor(a)','teacher'],['Data','date'],['Ano / turma','classroom'],['Componente curricular','subject'],['Duração (minutos)','duration'],['Habilidade curricular informada pelo professor','skill'],['Objetivos de aprendizagem','objectives'],['Conteúdos','content'],['Introdução / mobilização','intro'],['Desenvolvimento / prática guiada','development'],['Fechamento','closing'],['Recursos didáticos','materials'],['Avaliação','assessment'],['Referências','references']];
  return 'PLANO DE AULA ADAPTADO — RADAR PEDAGÓGICO\n\n' + fields.filter(([,key]) => data[key]?.trim()).map(([label,key]) => `${label}\n${data[key]}`).join('\n\n') + '\n\nADAPTAÇÕES REVISADAS\n' + (rules.filter(r=>r.accepted).map(r=>`${r.label}\n${r.text}`).join('\n\n') || 'Nenhuma adaptação selecionada.') + (notes.trim() ? '\n\nOBSERVAÇÕES DO PROFESSOR\n'+notes : '') + '\n\nPreserve os objetivos curriculares e ajuste os meios de participação e avaliação conforme o contexto. Sugestões baseadas em regras predefinidas, revisadas pelo professor.';
}
