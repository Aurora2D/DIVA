/* DIVA · Carta do Mapa Emocional
   Transforma as medições do ciclo (mapa + check-in + hábitos) num texto acolhedor, em forma de carta,
   e devolve também as barras para o final do relatório. É uma função pura: recebe dados, devolve dados.
   Não mexe na tela nem no app. Quem desenha (o app ou a prévia) usa o resultado.

   montarCartaRelatorio(dados) -> { tom, blocos:[{t:'h2'|'p'|'pergunta'|'cuidado'|'despedida', txt}], barras:{...} }

   dados = {
     nome: 'Érica',
     dims: { sobrecarga:0-100, ansiedade, energia, corpo, prazer, conexao, autopercepcao, regulacao, direcao },   // valores do mapa (como o app guarda)
     anterior: { ...mesmas chaves } | null,
     ci: { dias: 14, pares:[{ lbl, mlbl, dim, ci, ciPct, mapaBom, dif, txt }] },    // cruzamentos check-in x mapa (txt = frase curta de cada par)
     habitos: { total: 9, top: ['Beber água ao acordar', 'Passar batom'] }
   }
*/
(function(root){
  'use strict';
  const DIMS=[
    {key:'sobrecarga',nome:'Sobrecarga',sobeBom:false,grupo:'peso'},
    {key:'ansiedade',nome:'Ansiedade',sobeBom:false,grupo:'peso'},
    {key:'energia',nome:'Energia',sobeBom:true,grupo:'sustenta'},
    {key:'corpo',nome:'Corpo',sobeBom:true,grupo:'sustenta'},
    {key:'prazer',nome:'Prazer',sobeBom:true,grupo:'sustenta'},
    {key:'conexao',nome:'Conexão',sobeBom:true,grupo:'relaciona'},
    {key:'autopercepcao',nome:'Autopercepção',sobeBom:true,grupo:'relaciona'},
    {key:'regulacao',nome:'Regulação',sobeBom:true,grupo:'relaciona'},
    {key:'direcao',nome:'Direção',sobeBom:true,grupo:'relaciona'}
  ];
  const GRUPOS=[['peso','O que pesa'],['sustenta','O que sustenta'],['relaciona','Como você se relaciona']];
  const LEGENDA={
    sobrecarga:{alto:'Carga leve: há espaço para respirar.',meio:'Carga razoável, com momentos pesados.',baixo:'Muita coisa em cima de você. Merece ser aliviada.'},
    ansiedade:{alto:'Mente mais calma do que em alerta.',meio:'Alguma agitação, mas dá para manejar.',baixo:'Mente em alerta, pedindo pausas.'},
    energia:{alto:'Fôlego bom.',meio:'Fôlego oscilando.',baixo:'Fôlego baixo, pede recarga.'},
    corpo:{alto:'Corpo cuidado e respondendo.',meio:'Corpo no meio-termo.',baixo:'Corpo pedindo atenção.'},
    prazer:{alto:'Há graça nos seus dias.',meio:'O prazer aparece às vezes.',baixo:'Pouca graça nos dias. Vale reacender.'},
    conexao:{alto:'Você se sente acompanhada.',meio:'Conexão presente, mas irregular.',baixo:'Sensação de pouca companhia.'},
    autopercepcao:{alto:'Você se olha com carinho.',meio:'Seu olhar sobre si oscila.',baixo:'Olhar duro sobre si. Pede gentileza.'},
    regulacao:{alto:'Você volta ao seu eixo com facilidade.',meio:'Às vezes é fácil voltar ao eixo, às vezes não.',baixo:'Difícil voltar ao eixo. Pausar antes de reagir ajuda.'},
    direcao:{alto:'Você sente que está indo a algum lugar.',meio:'O rumo está parcialmente claro.',baixo:'Rumo nebuloso. Um passo pequeno ajuda.'}
  };
  const GESTO={
    sobrecarga:'tirar uma tarefa da pilha por semana, sem culpa',
    ansiedade:'três minutos de pausa antes de dormir, só respirando',
    energia:'dormir meia hora mais cedo em duas noites da semana',
    corpo:'um copo de água ao acordar e um alongamento curto',
    prazer:'dez minutos por dia de algo que você faz só por gosto',
    conexao:'uma conversa honesta com uma pessoa segura',
    autopercepcao:'uma frase gentil sobre você, dita em voz alta, uma vez por dia',
    regulacao:'três respirações antes de reagir ao que te tira do eixo',
    direcao:'escolher uma única coisa pequena para fazer esta semana, e fazer'
  };
  const HABITO_GESTO={
    sobrecarga:{nome:'Tirar uma tarefa da pilha',emoji:'🧺',unidade:'1 tarefa por semana',grupo:'outros'},
    ansiedade:{nome:'Três minutos de pausa antes de dormir',emoji:'🌙',unidade:'3 minutos',grupo:'outros'},
    energia:{nome:'Dormir meia hora mais cedo',emoji:'😴',unidade:'meia hora a mais de sono',grupo:'corpo'},
    corpo:{nome:'Um alongamento curto',emoji:'🫶',unidade:'alguns minutos',grupo:'corpo'},
    prazer:{nome:'Dez minutos só por gosto',emoji:'🎨',unidade:'10 minutos',grupo:'outros'},
    conexao:{nome:'Uma conversa honesta com alguém seguro',emoji:'💛',unidade:'1 conversa',grupo:'outros'},
    autopercepcao:{nome:'Uma frase gentil sobre mim',emoji:'🪞',unidade:'1 frase por dia',grupo:'outros'},
    regulacao:{nome:'Três respirações antes de reagir',emoji:'🌱',unidade:'3 respirações',grupo:'outros'},
    direcao:{nome:'Uma coisa pequena da semana',emoji:'🧭',unidade:'1 passo pequeno',grupo:'outros'}
  };
  const BEM={sobrecarga:'a carga mais leve',ansiedade:'a mente mais calma',energia:'o seu fôlego',corpo:'o cuidado com o corpo',prazer:'o prazer nos seus dias',conexao:'a companhia das pessoas',autopercepcao:'o seu olhar gentil sobre você',regulacao:'a facilidade de voltar ao seu eixo',direcao:'a sensação de caminho'};
  const CUIDADO={sobrecarga:'a carga em cima de você',ansiedade:'a mente em alerta',energia:'o seu fôlego',corpo:'o corpo',prazer:'o prazer nos dias',conexao:'a sensação de companhia',autopercepcao:'o seu olhar sobre si',regulacao:'voltar ao seu eixo',direcao:'a sensação de caminho'};
  const ART={sobrecarga:'a',ansiedade:'a',energia:'a',corpo:'o',prazer:'o',conexao:'a',autopercepcao:'a',regulacao:'a',direcao:'a'};
  const GATA={pesado:'sim',misto:'curiosa',leve:'pular'};
  const PERGUNTA={
    pesado:'O que, dentre tudo isso, você poderia deixar de carregar sozinha nos próximos 21 dias?',
    misto:'O que tem sustentado você, e como você pode dar um pouco mais de espaço a isso?',
    leve:'O que você quer levar deste ciclo para o próximo?'
  };
  const DESPEDIDA={
    pesado:'Você não precisa dar conta de tudo para estar no caminho. Descansar também conta. Até o próximo mapa, sem pressa.',
    misto:'O que pesa e o que sustenta cabem no mesmo retrato, e os dois merecem ser vistos. Até o próximo mapa, sem pressa.',
    leve:'Que bom ver você assim. Aproveite esse fôlego com carinho, sem cobrar que dure para sempre. Até o próximo mapa.'
  };

  const dim=k=>DIMS.find(d=>d.key===k);
  const bom=(d,k)=>{const v=d[k];if(typeof v!=='number')return null;return dim(k).sobeBom?v:100-v;};
  const nivel=b=>b===null?null:b>=65?'alto':b<40?'baixo':'meio';
  const media=l=>{const v=l.filter(x=>x!==null&&x!==undefined);return v.length?v.reduce((a,b)=>a+b,0)/v.length:null;};
  const lista=(a)=>a.length<=1?(a[0]||''):a.slice(0,-1).join(', ')+' e '+a[a.length-1];
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);

  /* ---------- os fios: cada um conta uma parte da história ---------- */
  const FIOS={
    carga:{
      dims:['sobrecarga','ansiedade','energia'],
      texto(B,L){
        const s=L.sobrecarga,a=L.ansiedade,e=L.energia;
        let t;
        if(s==='baixo'&&a==='baixo')t='Tem muita coisa em cima de você ao mesmo tempo em que a cabeça continua em alerta. Essa combinação cansa de um jeito que dormir sozinho nem sempre resolve: é a mente e o corpo cobrando por ficarem ligados demais. Isso não é fraqueza. É sinal de que você está carregando mais do que cabe, e de que o primeiro passo talvez seja tirar peso, e não colocar esforço.';
        else if(s==='baixo')t='A carga está alta, mas a cabeça segue relativamente calma. Isso mostra que você tem recursos para segurar a pressão, e também que é fácil confundir "estou dando conta" com "não está pesado". Vale perguntar o que dá para soltar antes que o corpo peça por você.';
        else if(a==='baixo')t='A sua rotina não parece tão sobrecarregada, mas a mente anda acelerada. Quando o peso não está nas tarefas, costuma estar nas antecipações: o que pode dar errado, o que ainda falta. É uma ansiedade que pede acolhimento e pausas, mais do que organização.';
        else if(s==='alto'&&a==='alto')t='A carga está leve e a mente está mais calma do que em alerta. É um espaço precioso: dá para pensar, escolher e sentir sem estar sempre apagando incêndio.';
        else t='A carga e a agitação da mente estão num ponto intermediário: há dias pesados, mas também há espaço para respirar. O que mais ajuda nessa faixa é perceber cedo quando o peso começa a subir.';
        if(e==='baixo')t+=' O seu fôlego está baixo, o que torna tudo isso mais difícil de sustentar.';
        else if(e==='alto')t+=' E o seu fôlego está bom, o que ajuda a sustentar.';
        return t;
      }
    },
    corpo:{
      dims:['corpo','energia'],
      texto(B,L,D){
        const c=L.corpo;
        let t;
        if(c==='baixo')t='O corpo está pedindo atenção, e ele costuma avisar baixinho antes de gritar. Escutar agora é bem mais barato do que escutar depois.';
        else if(c==='alto')t='O corpo está respondendo bem, e isso é um recurso que sustenta o resto: quando ele está abastecido, o que pesa na cabeça pesa um pouco menos.';
        else t='O corpo está num meio-termo, nem em alerta, nem totalmente abastecido. É a faixa em que pequenos cuidados fazem muita diferença.';
        const sono=(D.ci.pares||[]).find(p=>/sono/i.test(p.lbl)&&typeof p.ciPct==='number');
        if(sono&&sono.ciPct<45)t+=' Suas noites curtas aparecem junto com isso. Dormir um pouco mais cedo é o ajuste mais barato que existe.';
        else if(sono&&sono.ciPct>=65)t+=' As suas noites de sono boas fazem parte disso.';
        return t;
      }
    },
    olhar:{
      dims:['autopercepcao','conexao'],
      texto(B,L){
        const a=L.autopercepcao,c=L.conexao;
        if(a==='baixo'&&c==='baixo')return 'Você tem se olhado com pouca gentileza e se sentido pouco acompanhada ao mesmo tempo. Uma coisa alimenta a outra: quando a gente se vê com dureza, fica mais difícil deixar alguém chegar perto, e quando ninguém chega, a dureza parece confirmada. Uma conversa honesta com uma pessoa segura costuma mexer nas duas.';
        if(a==='baixo')return 'Você se sente acompanhada, mas ainda se olha com cobrança. Vale deixar o carinho que vem de fora entrar um pouco mais, sem discutir com ele.';
        if(c==='baixo')return 'Você se enxerga com carinho, mas sente pouca companhia. É uma solidão diferente: a de quem já está em paz consigo e ainda não encontrou, ou não chamou, quem queira chegar perto.';
        if(a==='alto'&&c==='alto')return 'Você se vê com carinho e se sente compreendida. As duas coisas se alimentam, e é nelas que você se apoia quando o resto balança.';
        return 'O seu olhar sobre si e a sensação de companhia estão num ponto intermediário: há dias de mais gentileza e dias de mais cobrança. Observar em que dias a cobrança aparece já é um jeito de começar a suavizá-la.';
      }
    },
    rumo:{
      dims:['direcao','prazer','regulacao'],
      texto(B,L){
        const d=L.direcao,p=L.prazer,r=L.regulacao;
        let t;
        if(d==='baixo'&&p==='baixo')t='A sensação de caminho e o prazer estão baixos juntos. Quando o dia vira só obrigação, o rumo some junto com a graça. Um gesto pequeno que seja só seu, sem meta e sem utilidade, costuma reacender as duas coisas.';
        else if(p==='baixo')t='Você sabe para onde está indo, mas a viagem anda sem graça. Vale deixar entrar algo que seja só prazer, sem objetivo nenhum.';
        else if(d==='baixo')t='Há prazer nos seus dias, mas pouca sensação de rumo. Dá para começar o rumo pelo que já te dá prazer: é por onde a vontade costuma abrir caminho.';
        else if(d==='alto'&&p==='alto')t='Você sabe para onde vai e está gostando da viagem. É uma combinação rara e merece ser comemorada, não só registrada.';
        else t='O rumo e o prazer estão num ponto intermediário: nem perdidos, nem plenos. Um pequeno passo na direção do que você gosta costuma empurrar os dois para cima.';
        if(r==='baixo')t+=' E está mais difícil voltar ao seu eixo quando algo te tira dele. Nessas fases, a pausa antes de reagir vale mais do que a análise.';
        else if(r==='alto')t+=' E você tem conseguido voltar ao seu eixo quando algo te tira dele.';
        return t;
      }
    }
  };

  function tomDoCiclo(B){
    const m=media(Object.values(B));
    return m>=62?'leve':m<45?'pesado':'misto';
  }

  function montarCartaRelatorio(D){
    const dims=D.dims||{};
    const B={},L={};
    DIMS.forEach(d=>{const b=bom(dims,d.key);if(b!==null){B[d.key]=b;L[d.key]=nivel(b);}});
    const tom=tomDoCiclo(B);
    const nome=D.nome?D.nome:'';
    D.ci=D.ci||{dias:0,pares:[]};
    const blocos=[];
    const P=txt=>blocos.push({t:'p',txt});

    /* 0. destaque: o essencial em uma frase */
    const ord=DIMS.filter(d=>B[d.key]!==undefined).sort((x,y)=>B[y.key]-B[x.key]);
    if(ord.length>=2){
      const melhor=ord[0],pior0=ord[ord.length-1];
      let tx;
      if(B[melhor.key]<45)tx='Foi um ciclo difícil, e o que mais pediu cuidado foi '+CUIDADO[pior0.key]+'. Mesmo assim, '+BEM[melhor.key]+' segurou você.';
      else tx='O que mais te sustentou neste ciclo foi '+BEM[melhor.key]+', e o que mais pediu cuidado foi '+CUIDADO[pior0.key]+'.';
      blocos.push({t:'destaque',txt:'Em uma frase: '+tx.charAt(0).toLowerCase()+tx.slice(1)});
    }
    /* 1. acolher */
    blocos.push({t:'h2',txt:'Como você chegou até aqui'});
    if(tom==='pesado')P('Antes de qualquer número: você chegou ao fim destes 21 dias, e isso já é uma forma de cuidado. O ciclo parece ter sido pesado, e eu quero começar por aí, sem pressa de transformar em lição.');
    else if(tom==='leve')P('Que bom chegar aqui. O retrato deste ciclo é de uma fase com mais recurso do que peso, e vale dizer isso em voz alta antes de qualquer análise.');
    else P('Chegar ao fim de mais 21 dias é um jeito de se acompanhar. O que apareceu foi um ciclo com partes que sustentam e partes que pedem colo, e as duas são verdadeiras ao mesmo tempo.');
    if(D.ci.dias>0)P('Eu cruzei três coisas: o que você respondeu no mapa, o que você viveu em '+D.ci.dias+' dias de check-in e o que você fez nos seus hábitos. Onde elas concordam, eu conto com mais segurança. Onde discordam, eu conto com curiosidade.');

    /* 2. os fios principais */
    const pontuacao=Object.entries(FIOS).map(([k,f])=>{
      const m=media(f.dims.map(x=>B[x]));return {k,f,m};
    }).filter(x=>x.m!==null);
    const positivos=pontuacao.filter(x=>x.m>=60).sort((a,b)=>b.m-a.m);
    const cuidados=pontuacao.filter(x=>x.m<50).sort((a,b)=>a.m-b.m);
    const resto=pontuacao.filter(x=>x.m>=50&&x.m<60).sort((a,b)=>Math.abs(a.m-55)-Math.abs(b.m-55));
    let ordem=[];
    if(tom==='pesado')ordem=[cuidados[0],positivos[0],cuidados[1]];
    else if(tom==='misto')ordem=[positivos[0],cuidados[0],cuidados[1]||positivos[1]||resto[0]];
    else ordem=[positivos[0],positivos[1],cuidados[0]||resto[0]];
    const vistos=new Set();ordem=ordem.filter(x=>x&&!vistos.has(x.k)&&vistos.add(x.k));
    if(ordem.length<3)[...positivos,...cuidados,...resto].forEach(x=>{if(ordem.length<3&&!vistos.has(x.k)){vistos.add(x.k);ordem.push(x);}});

    blocos.push({t:'h2',txt:'O que o seu ciclo conta'});
    const aberturaFio={
      pesado:['Vamos pelo que mais pesou.','Mesmo assim, há coisas que seguram você de pé.','E tem mais um ponto que merece carinho.'],
      misto:['Vou começar pelo que sustenta, porque ele costuma ficar invisível.','Agora, o que pede cuidado.','E mais uma coisa que vale olhar.'],
      leve:['O que mais brilha neste ciclo:','E também:','O que ainda pede um carinho, sem pressa:']
    }[tom];
    ordem.forEach((x,i)=>P(aberturaFio[i]+' '+x.f.texto(B,L,D)));

    /* 3. de onde o cansaço vem e de onde não vem: cruza as áreas do dia a dia com o que pesa no mapa */
    const pesadas=['sobrecarga','ansiedade','energia','corpo','regulacao'].filter(k=>B[k]!==undefined&&B[k]<50);
    const todos=(D.ci.pares||[]).filter(p=>typeof p.ciPct==='number'&&typeof p.mapaBom==='number');
    const usados=new Set();
    const nomeArea=p=>p.lbl.charAt(0).toLowerCase()+p.lbl.slice(1);
    const unicos=a=>{const v=new Set();return a.filter(p=>{const n=nomeArea(p);if(v.has(n))return false;v.add(n);return true;});};
    const deHeavy=todos.filter(p=>pesadas.indexOf(p.dim)>=0);
    const naoVem=unicos(deHeavy.filter(p=>p.ciPct>=55&&p.ciPct-p.mapaBom>10));
    const vem=unicos(deHeavy.filter(p=>p.ciPct<50&&!naoVem.some(n=>nomeArea(n)===nomeArea(p))));
    if(pesadas.length&&(naoVem.length||vem.length)){
      blocos.push({t:'h2',txt:'De onde o cansaço não está vindo'});
      const pesoNomes=lista(pesadas.map(k=>dim(k).nome.toLowerCase()));
      let t='Quando eu coloco o que pesa no mapa ('+pesoNomes+') lado a lado com o seu dia a dia, dá para fazer uma espécie de eliminação. ';
      if(naoVem.length)t+='Não está vindo de: '+lista(naoVem.map(nomeArea))+'. Nessas áreas você estava bem nos dias, então o peso não nasce aí. ';
      if(vem.length)t+='Ele aparece junto de: '+lista(vem.map(nomeArea))+'. É por aí que vale cuidar primeiro. ';
      else t+='E isso é um achado: o peso parece vir de algo que o check-in não mede, como o que você carrega por dentro, expectativas, relações. Vale olhar para lá com carinho. ';
      if(naoVem.length&&vem.length)t+='O resto está de pé, e não precisa de esforço extra agora.';
      P(t.trim());
      naoVem.concat(vem).forEach(p=>usados.add(p));
    }
    const div=todos.filter(p=>!usados.has(p)&&Math.abs(p.dif)>15&&p.txt).sort((a,b)=>Math.abs(b.dif)-Math.abs(a.dif)).slice(0,2);
    if(div.length){
      blocos.push({t:'h2',txt:'Onde o dia a dia e o mapa discordam'});
      P('Tem um detalhe que me chamou atenção: às vezes o que você sente no mapa e o que você viveu nos dias não conta a mesma história, e isso é informação, não erro. '+div.map(p=>p.txt).join(' '));
    }

    /* 4. o que mudou */
    if(D.anterior){
      const mud=DIMS.map(d=>{const a=bom(D.anterior,d.key),b=B[d.key];return a===null||b===undefined?null:{d,delta:Math.round(b-a)};}).filter(x=>x&&Math.abs(x.delta)>=10);
      if(mud.length){
        blocos.push({t:'h2',txt:'O que mudou desde o último ciclo'});
        const sobe=mud.filter(x=>x.delta>0).sort((a,b)=>b.delta-a.delta).slice(0,2).map(x=>x.d.nome.toLowerCase());
        const desce=mud.filter(x=>x.delta<0).sort((a,b)=>a.delta-b.delta).slice(0,2).map(x=>x.d.nome.toLowerCase());
        let t='';
        if(sobe.length)t+='Em relação ao ciclo anterior, melhorou: '+lista(sobe)+'. Vale reconhecer isso, mesmo que ainda não pareça suficiente. ';
        if(desce.length)t+='Pesou mais: '+lista(desce)+'. ';
        t+='Mudança não é nota. É informação sobre o que a sua vida pediu de você nestas três semanas.';
        P(t.trim());
      }
    }

    /* 4b. tendência ao longo de vários ciclos */
    const serie=(D.historico||[]).concat([dims]);
    if(serie.length>=3){
      const tend=[];
      DIMS.forEach(d=>{
        const v=serie.map(x=>bom(x,d.key)).filter(x=>x!==null);
        if(v.length<3)return;
        let n=0,dir=0;
        for(let i=v.length-1;i>0;i--){const dl=v[i]-v[i-1];const dr=dl>=5?1:dl<=-5?-1:0;if(dr===0)break;if(dir===0)dir=dr;if(dr!==dir)break;n++;}
        if(n>=2)tend.push({d,n,dir});
      });
      tend.sort((a,b)=>b.n-a.n);
      if(tend.length){
        blocos.push({t:'h2',txt:'O que se repete ao longo dos ciclos'});
        const txt=tend.slice(0,2).map(x=>x.dir>0
          ?'Faz '+(x.n+1)+' ciclos seguidos que '+ART[x.d.key]+' '+x.d.nome.toLowerCase()+' melhora. Isso é tendência, não acaso, e merece ser reconhecido.'
          :'É o '+(x.n+1)+'º ciclo seguido em que '+ART[x.d.key]+' '+x.d.nome.toLowerCase()+' está pior.').join(' ')+(tend.slice(0,2).some(x=>x.dir<0)?' Não é culpa sua: é um padrão, e padrão se cuida com atenção.':'');
        P(txt);
      }
    }

    /* 5. hábitos */
    const H=D.habitos||{total:0,top:[]};
    blocos.push({t:'h2',txt:'Os seus gestos de cuidado'});
    if(H.total>0)P('Neste ciclo você marcou seus hábitos '+H.total+(H.total===1?' vez':' vezes')+(H.top&&H.top.length?', com destaque para '+lista(H.top.slice(0,2).map(x=>x.toLowerCase()))+'':'')+'. Hábito pequeno é o jeito mais concreto de transformar o que o mapa mostra em cuidado de verdade. Cada marcação é uma prova de que você apareceu para si.');
    else P('Os hábitos ainda não entraram na sua rotina neste ciclo, e tudo bem. Eles não são uma obrigação: são um convite, para quando fizer sentido, a transformar o que você leu aqui em um gesto pequeno.');

    /* 6. próximos 21 dias */
    blocos.push({t:'h2',txt:'Para os próximos 21 dias'});
    const pior=DIMS.map(d=>({d,b:B[d.key]})).filter(x=>x.b!==undefined).sort((a,b)=>a.b-b.b)[0];
    if(tom==='leve'&&pior.b>=55)P('Eu não proporia mudar nada. Se quiser um gesto para o próximo ciclo, que seja proteger o que já está funcionando: '+GESTO[pior.d.key]+'. É pequeno de propósito.');
    else P('Eu não proporia mudar tudo. Se for para escolher uma coisa só, que seja esta: '+GESTO[pior.d.key]+'. É pequeno de propósito, para caber na vida real e não virar mais uma cobrança.');
    blocos.push({t:'gesto',txt:'Quero tentar esse gesto',gesto:Object.assign({dim:pior.d.key},HABITO_GESTO[pior.d.key])});
    blocos.push({t:'pergunta',txt:PERGUNTA[tom]});
    if(B.sobrecarga!==undefined&&B.sobrecarga<30&&B.ansiedade<30)
      blocos.push({t:'cuidado',txt:'Se tudo isso estiver pesado demais, vale conversar com alguém de confiança, uma amiga, alguém da família ou quem você preferir. Você não precisa carregar isso sozinha.'});
    blocos.push({t:'despedida',txt:DESPEDIDA[tom]});

    /* barras, para o final */
    const barras={
      titulo:'Seus números, para olhar com calma',
      nota:'Isto é um retrato deste ciclo, não uma nota. Barras mais cheias mostram mais cuidado e mais recurso.',
      grupos:GRUPOS.map(([g,tit])=>({titulo:tit,itens:DIMS.filter(d=>d.grupo===g&&B[d.key]!==undefined).map(d=>{
        const a=D.anterior?bom(D.anterior,d.key):null;
        const delta=a===null?null:Math.round(B[d.key]-a);
        return{rot:d.nome,bom:Math.round(B[d.key]),nivel:L[d.key],legenda:LEGENDA[d.key][L[d.key]],delta,dica:d.sobeBom?null:'quanto menor, melhor'};
      })})),
      cruzamentos:{titulo:'Seu dia a dia e o mapa',itens:(D.ci.pares||[]).map(p=>({rot:p.lbl+' × '+p.mlbl,ci:Math.round(p.ciPct),mapa:Math.round(p.mapaBom),legenda:p.txt||''}))}
    };
    /* de onde cada peso vem e de onde não vem (para o desenho no fim) */
    const TIT={sobrecarga:'Sobrecarga alta',ansiedade:'Ansiedade alta',energia:'Energia baixa',corpo:'Corpo pedindo atenção',regulacao:'Regulação difícil'};
    const nomeA=p=>p.lbl.charAt(0).toLowerCase()+p.lbl.slice(1);
    barras.eliminacao=[];
    ['sobrecarga','ansiedade','energia','corpo','regulacao'].forEach(k=>{
      if(B[k]===undefined||B[k]>=50)return;
      const ps=(D.ci.pares||[]).filter(p=>p.dim===k&&typeof p.ciPct==='number'&&typeof p.mapaBom==='number');
      const nao=[],vem=[];
      ps.forEach(p=>{const n=nomeA(p);if(p.ciPct>=55&&p.ciPct-p.mapaBom>10){if(nao.indexOf(n)<0)nao.push(n);}else if(p.ciPct<50){if(vem.indexOf(n)<0)vem.push(n);}});
      if(nao.length||vem.length)barras.eliminacao.push({titulo:TIT[k],naoVem:nao,vem:vem});
    });
    return {tom,blocos,barras,gata:GATA[tom]};
  }
  root.montarCartaRelatorio=montarCartaRelatorio;
  root.CARTA_DIMS=DIMS;
})(typeof window!=='undefined'?window:globalThis);
