/* ============ CELEBRAR / LIVRO DE PROVAS ============ */
function renderCelebrar(){
  renderPremios();
  renderQuandoDer();renderFormNovoPremio();
  renderPremiosGuardados();
  renderCelebracaoCard();
  atualizarBotaoConquistas();
}
function atualizarBotaoConquistas(){
  const n=(S.conquistas.itens||[]).length;
  const btn=$('btnVerConquistas');
  if(btn)btn.textContent=n?`📖 Abrir Livro de Conquistas (${n})`:'📖 Abrir Livro de Conquistas';
}
function renderConquistasPopUp(){
  const itens=S.conquistas.itens||[];
  const arq=S.conquistas.arquivadas||[];
  let html='';
  if(!itens.length){
    html='<div class="mut" style="font-size:13px;text-align:center;padding:14px">Nada por aqui ainda.</div>';
  } else {
    AREAS_CONQUISTAS.forEach(a=>{
      const doGrupo=itens.filter(c=>c.area===a.id);
      if(!doGrupo.length)return;
      html+=`<div class="conq-area-titulo">${a.emoji} ${a.nome}</div>`;
      doGrupo.forEach(c=>{
        html+=`<div class="conq-item">${esc(c.txt)}${c.quando?`<span class="quando">· ${esc(c.quando)}</span>`:''}</div>`;
      });
    });
  }
  $('conquistasLista').innerHTML=html;
  if(arq.length){
    $('conquistasArquivadas').innerHTML=`<details class="generic" style="margin-top:14px"><summary style="font-size:12px">📦 Arquivadas (${arq.length})</summary><div class="conteudo">${arq.map(c=>`<div class="conq-item" style="opacity:.75">${esc(c.txt)}</div>`).join('')}</div></details>`;
  } else {
    $('conquistasArquivadas').innerHTML='';
  }
}
$('btnVerConquistas').onclick=()=>{
  renderConquistasPopUp();
  const o=$('conquistasModal');o.hidden=false;requestAnimationFrame(()=>o.classList.add('ativo'));document.body.style.overflow='hidden';
};
$('conquistasFechar').onclick=()=>{
  const o=$('conquistasModal');o.classList.remove('ativo');
  setTimeout(()=>{o.hidden=true;document.body.style.overflow='';},320);
};

$('btnAddCqModal')&&($('btnAddCqModal').onclick=()=>{
  const v=($('cqInputModal')||{}).value;if(!v||!v.trim()){mostrarToast('Escreva a prova primeiro');return;}
  const area=($('cqAreaModal')||{}).value||'casa';
  const quando=(($('cqQuandoModal')||{}).value||'').trim()||'agora';
  S.conquistas.itens.unshift({txt:v.trim(),quando,area,criadoEm:hoje()});
  if($('cqInputModal'))$('cqInputModal').value='';
  if($('cqQuandoModal'))$('cqQuandoModal').value='';
  salva();renderCelebrar();renderConquistasPopUp();
  confete(['📖','✨','💛']);som('guardado');mostrarToast('Guardado no livro ✓');
});

$('btnAddCq').onclick=()=>{
  const v=$('cqInput').value.trim();if(!v)return;
  const area=$('cqArea').value||'casa';
  const quando=$('cqQuando').value.trim()||'agora';
  S.conquistas.itens.unshift({txt:v,quando,area,criadoEm:hoje()});
  $('cqInput').value='';$('cqQuando').value='';
  salva();renderCelebrar();som('guardado');mostrarToast('Anotado no Livro de Conquistas ✓');
};
$('cqInput').onkeydown=e=>{if(e.key==='Enter')$('btnAddCq').click();};
$('btnAddPremio').onclick=()=>{const nome=$('pNome').value.trim();if(!nome){mostrarToast('Escreva o nome do prêmio');return;}const f=lerCamposPremio($('pCampos'));
  if(f.custo==='planejar'){S.quandoDer.push({id:'q'+Date.now().toString(36),nome,criadoEm:hoje(),feitoEm:null});mostrarToast('Guardado em Quando der ✓');}
  else{S.premios.push(premioNovo({nome,...f,estilo:estiloDoPremio(nome)}));mostrarToast('Prêmio adicionado ✓');}
  $('pNome').value='';salva();renderPremios();renderQuandoDer();renderFormNovoPremio();};
$('btnCardapio').onclick=()=>{if(S.estiloAutocuidado&&S.estiloAutocuidado.feito)abrirCardapio();else dialogo({titulo:'Antes, o seu estilo',texto:'O cardápio é montado a partir do seu estilo de autocuidado. São uns 5 minutos de teste, uma vez só.',botoes:[{rotulo:'Montar sem o teste',fn:abrirCardapio},{rotulo:'Fazer o teste',prim:true,fn:()=>estiloIniciar()}]});};
$('btnVerPremios').onclick=()=>{const l=$('listaPremios');const a=!l.hidden;l.hidden=a;$('btnVerPremios').textContent=a?'📋 Ver meus prêmios disponíveis':'🙈 Esconder meus prêmios';};

function cfgDataBr(d){return d?new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{day:'numeric',month:'short'}):'';}
function cfgTemNotas(){return (S.leiAtracao.desejos||[]).some(d=>(d.notas||[]).length);}
function renderConfig(){
  const box=$('cfgCorpo');if(!box)return;
  const I=n=>`<svg class="ic"><use href="#i-${n}"/></svg>`;
  const row=(id,ic,txt,val,extra)=>`<button type="button" class="cfg-row" id="${id}">${I(ic)}<span class="cfg-txt">${txt}</span>${val?`<span class="cfg-val">${esc(val)}</span>`:''}${extra||'<span class="cfg-seta">›</span>'}</button>`;
  const sw=(id,on)=>`<label class="cfg-sw" onclick="event.stopPropagation()"><input type="checkbox" id="${id}" ${on?'checked':''}><span></span></label>`;
  const c=celebraAtual();
  const e=S.estiloAutocuidado;const ep=e&&e.feito?Object.values(ESTILO_CATS).find(x=>x.id===e.principal):null;
  const nl=(S.lembretes||[]).length;
  const hs=[...(S.resumo.historico||[]),...(S.resumoMensal.historico||[])].map(r=>r.mostradoEm).filter(Boolean).sort();
  let h='';
  h+=`<div class="cfg-grupo-tit">Você</div><div class="cfg-grupo">`
    +row('cfgRowNome','coracao','Nome',primeiroNome()||'—')
    +row('cfgRowCuida','pessoas','Quem você cuida',cuida()?nomeCuidado()+(S.cuidado.relacao?' ('+S.cuidado.relacao+')':''):'só de mim')
    +row('cfgRowCelebra','comemora','Minha comemoração',c?c.texto:'inventar')
    +row('cfgRowEstilo','espelho','Estilo de autocuidado',ep?ep.nome:'fazer o teste')
    +`</div>`;
  h+=`<div class="cfg-grupo-tit">Lembretes</div><div class="cfg-grupo">`
    +row('cfgRowLemb','relato','Lembretes emocionais',nl?nl+(nl===1?' ativo':' ativos'):'nenhum')
    +row('cfgRowSaude','folha','Cuidados fora do app',(()=>{const n=cuidadosPendentes().length;return n?n+(n===1?' pendente':' pendentes'):'nada pendente';})())
    +`</div>`;
  h+=`<div class="cfg-grupo-tit">Experiência</div><div class="cfg-grupo">`
    +row('cfgRowConhecer','atracao','Conhecer a Diva<small>A gatinha mostra o que tem no app</small>','')
    +row('cfgRowAbas','mapa','Mostrar todas as abas<small>Por padrão elas abrem aos poucos</small>','',sw('cfgAbas',S.tabsLiberadas!=='progressivo'))
    +row('cfgRowMusica','nota','Sugestões de música<small>Pra quem canta ou toca</small>','',sw('cfgMusica',musicaAtiva()))
    +row('cfgRowSons','sino','Sons<small>Ao marcar hábitos e comemorar</small>','',`<span class="cfg-mini" id="btnOuvirSons">Ouvir</span>`+sw('cfgSons',somLigado()))
    +`</div>`;
  h+=`<div class="cfg-grupo-tit">Seu histórico</div><div class="cfg-grupo">`
    +row('cfgRowResumos','grafico','Resumos semanais e mensais',hs.length?'último em '+cfgDataBr(hs[hs.length-1]):'ainda não tem')
    +`</div>`;
  h+=`<div class="cfg-grupo-tit">Seus dados</div><div class="cfg-grupo">`
    +row('cfgRowNuvem','ciclo','Guardar na nuvem<small>Entrar com o Google e usar em mais de um aparelho</small>',window.DIVAnuvem?window.DIVAnuvem.status():'carregando…')
    +row('btnExportar','enviar','Fazer backup<small>Salva tudo num arquivo no celular</small>','')
    +row('btnImportar','baixar','Restaurar backup<small>Substitui os dados atuais</small>','')
    +(cfgTemNotas()?row('btnExportarNotas','lapis','Baixar notas antigas (.txt)',''):'')
    +`</div>`;
  box.innerHTML=h;
  $('cfgRowNome').onclick=()=>{$('cfgNome').value=primeiroNome();abrirOverlayTopo($('nomeModal'));setTimeout(()=>$('cfgNome').focus(),250);};
  $('cfgRowCelebra').onclick=()=>abrirCelebraConvite();
  $('cfgRowCuida').onclick=abrirQuemCuida;
  $('cfgRowEstilo').onclick=()=>{
    if(!(S.estiloAutocuidado&&S.estiloAutocuidado.feito)){estiloIniciar();return;}
    dialogo({titulo:'Estilo de autocuidado',texto:'Principal: '+(ep?ep.nome:'')+(e.data?'\nFeito em '+cfgDataBr(e.data):''),
      botoes:[{rotulo:'Refazer o teste',fn:()=>estiloIniciar(true)},{rotulo:'Ver resultado',prim:true,fn:estiloMostrarResultado}]});
  };
  $('cfgRowLemb').onclick=()=>{renderLembretes();abrirOverlayTopo($('lembretesModal'));};
  $('cfgRowSaude').onclick=abrirCuidados;
  $('cfgRowAbas').onclick=()=>$('cfgAbas').click();
  $('cfgRowConhecer').onclick=()=>fecharOverlay($('configModal'),()=>boasVindasDiva());
  $('cfgRowMusica').onclick=()=>$('cfgMusica').click();
  $('cfgMusica').onchange=()=>{S.musica=$('cfgMusica').checked;salva();renderHabitos();ciRemontar();try{perfilNovoAreaArte();}catch(e){}};
  $('cfgAbas').onchange=()=>{S.tabsLiberadas=$('cfgAbas').checked?'todas':'progressivo';salva();abasAtualizar(false);};
  $('cfgRowSons').onclick=()=>$('cfgSons').click();
  $('cfgSons').onchange=()=>{S.sons={ligado:$('cfgSons').checked};salva();if(S.sons.ligado)som('plim');};
  $('btnOuvirSons').onclick=ev=>{ev.stopPropagation();const era=somLigado();if(!era)S.sons={ligado:true};som('plim');setTimeout(()=>som('guardado'),900);setTimeout(()=>som('caixinha'),1700);setTimeout(()=>{som('brilho');if(!era)S.sons={ligado:false};},2900);};
  $('cfgRowResumos').onclick=()=>fecharOverlay($('configModal'),abrirHistoricoResumos);
  $('cfgRowNuvem').onclick=()=>{if(window.DIVAnuvem)window.DIVAnuvem.abrir();else mostrarToast('Ainda carregando, tente em instantes');};
  $('btnExportar').onclick=()=>exportarBackup();
  $('btnImportar').onclick=()=>$('fileBackup').click();
  if($('btnExportarNotas'))$('btnExportarNotas').onclick=exportarNotasAntigas;
}
$('btnConfig').onclick=()=>{renderConfig();abrirOverlay($('configModal'));};
$('configFechar').onclick=()=>fecharOverlay($('configModal'));
/* o estado da sincronização muda sozinho (app/nuvem.js): atualiza a linha se as Configurações estiverem abertas */
window.addEventListener('diva-nuvem',()=>{try{if(!$('configModal').hidden)renderConfig();}catch(e){}});
$('nomeCancelar').onclick=()=>fecharOverlay($('nomeModal'));
$('nomeSalvar').onclick=()=>{const n=$('cfgNome').value.trim();if(!n){mostrarToast('Escreva seu nome');return;}S.onboarding.nome=n;salva();fecharOverlay($('nomeModal'));renderConfig();renderHoje();mostrarToast('Nome atualizado ✓');};
$('cfgNome').onkeydown=ev=>{if(ev.key==='Enter')$('nomeSalvar').click();};
$('lembretesFechar').onclick=()=>fecharOverlay($('lembretesModal'),renderConfig);
$('cuidFechar').onclick=()=>fecharOverlay($('cuidadosModal'),renderConfig);
$('cuidSaude').onchange=()=>{S.lembreteSaudeDesligado=!$('cuidSaude').checked;salva();};
$('cuidAdd').onclick=()=>{const t=$('cuidNovo').value.trim();if(!t){mostrarToast('Escreva o cuidado');return;}S.cuidados.push({id:'c'+Date.now().toString(36),texto:t,feitoEm:null});$('cuidNovo').value='';salva();renderCuidados();};
$('cuidNovo').onkeydown=ev=>{if(ev.key==='Enter')$('cuidAdd').click();};
function exportarNotasAntigas(){
  const todas=[];
  (S.leiAtracao.desejos||[]).forEach(d=>{(d.notas||[]).forEach(n=>todas.push({...n,desejoTexto:d.texto}));});
  if(!todas.length){avisar('Você ainda não guardou nenhuma nota na aba Atração.');return;}
  todas.sort((a,b)=>(a.data||'').localeCompare(b.data||''));
  let txt='Minhas notas de atenção — DIVA\n';
  txt+='='.repeat(46)+'\n\n';
  let mesAtual='';
  todas.forEach(n=>{
    const mes=(n.data||'').slice(0,7);
    if(mes!==mesAtual){const [a,m]=mes.split('-');txt+='\n── '+new Date(+a,+m-1,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'}).toUpperCase()+' ──\n\n';mesAtual=mes;}
    const data=new Date(n.data+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'});
    txt+=data+' — '+n.desejoTexto+'\n';
    txt+='  '+n.texto+'\n\n';
  });
  const nome='diva-notas-'+hoje()+'.txt';
  const blob=new Blob([txt],{type:'text/plain'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=nome;document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url),1500);
  mostrarToast('Notas baixadas ✓');
}
function renderLembretes(){$('lemLista').innerHTML=S.lembretes.map((l,i)=>`<div class="lista-item"><div class="txt">${esc(l.frase)} <span class="mut">· ${esc(l.hora)}</span></div><button class="btn fant" data-lem="${i}">×</button></div>`).join('');document.querySelectorAll('#lemLista [data-lem]').forEach(b=>{b.onclick=()=>{S.lembretes.splice(+b.dataset.lem,1);salva();renderLembretes();renderHoje();};});}
$('btnAddLemb').onclick=()=>{const f=$('lemFrase').value.trim(),h=$('lemHora').value;if(!f||!h)return avisar('Preencha frase e hora.');S.lembretes.push({id:'l'+Date.now(),frase:f,hora:h});$('lemFrase').value='';$('lemHora').value='';salva();renderLembretes();renderHoje();};
async function exportarBackup(){
  let data=JSON.stringify(S,null,2);const nome='diva-backup-'+hoje()+'.json';
  /* com login ativo, o backup sai embaralhado com a mesma chave do cofre da nuvem */
  if(window.DIVAcripto&&window.DIVAcripto.ativo()){try{data=await window.DIVAcripto.cifrarBackup(data);}catch(e){avisar('Não consegui proteger o backup.');return;}}
  const blob=new Blob([data],{type:'application/json'});const file=new File([blob],nome,{type:'application/json'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'Backup DIVA'});return;}catch(err){if(err&&err.name==='AbortError')return;}}
  try{const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=nome;document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(url),1500);}
  catch(e){avisar('Não consegui baixar aqui.');}
}
$('fileBackup').onchange=e=>{const file=e.target.files[0];if(!file)return;e.target.value='';const r=new FileReader();r.onload=async ev=>{try{let d=JSON.parse(ev.target.result);
  /* backup protegido: o novo abre com o cofre destravado; o antigo pede a frase-senha */
  if(d&&d.cifrado){if(!window.DIVAcripto){avisar('Não consegui carregar a parte de segurança. Tente de novo.');return;}
    if(!window.DIVAcripto.precisaFrase(d)){if(!window.DIVAcripto.ativo()){avisar('Este backup é protegido. Entre na sua conta Google em Configurações → Guardar na nuvem e tente de novo.');return;}try{d=JSON.parse(await window.DIVAcripto.abrirBackup(d));}catch(err2){avisar('Este backup é de outra conta ou de outro cofre.');return;}}
    else{const f=prompt('Este backup é protegido. Digite sua frase-senha:');if(!f)return;try{d=JSON.parse(await window.DIVAcripto.abrirBackup(d,f));}catch(err2){avisar('Frase-senha incorreta.');return;}}}
  if(!d||typeof d!=='object'||Array.isArray(d)||!Array.isArray(d.habitos))throw new Error('Backup inválido');
  confirmar('Substituir seus dados atuais pelo backup?',()=>{S=garanteNovosCampos(d);salva();avisar('Backup restaurado 💛',()=>location.reload());},'Substituir');}catch(err){avisar('Arquivo inválido.');}};r.readAsText(file);};
function trocaAba(t){
  document.querySelectorAll('section[id^="tab-"]').forEach(s=>s.hidden=(s.id!=='tab-'+t));
  
document.querySelectorAll('[data-atr-sec]').forEach(b=>{
  b.onclick=()=>abrirSecaoAtracao(b.dataset.atrSec);
});
$('atracaoSecaoFechar')&&($('atracaoSecaoFechar').onclick=fecharSecaoAtracao);

document.querySelectorAll('.tabs-bar button').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));
  if(t==='hoje')renderHoje();
  if(t==='diario'){atualizaStatusCheckin();renderCheckinResumos();atualizaRelatorio();renderDiario();}
  if(t==='mapa')renderCiclo();
  if(t==='celebrar')renderCelebrar();
  if(t==='atracao'){renderAtracaoTudo();}
  window.scrollTo({top:0,behavior:'instant'});
  if(typeof abasAtualizar==='function')abasAtualizar(t==='hoje');
}
/* toque na barra: entra em qualquer tela; a que ainda não abriu aparece esmaecida (ver abas.js) */
document.querySelectorAll('.tabs-bar button').forEach(b=>{b.onclick=()=>trocaAba(b.dataset.tab);});
$('btnGerenciar').onclick=()=>{
  renderHabitos();
  abrirOverlay($('gerenciarModal'));
};
$('gerenciarFechar')&&($('gerenciarFechar').onclick=()=>fecharOverlay($('gerenciarModal')));

let festaAnim=null;
function iniciarFogos(canvas){
  /* Versão leve: canvas em resolução reduzida (nunca acima de 1x), sem shadowBlur,
     poucas partículas, ~30 fps com passo de tempo, pausa com a aba oculta. */
  const ctx=canvas.getContext('2d',{alpha:false});
  const reduz=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let w,h;
  function setup(){
    w=window.innerWidth;h=window.innerHeight;
    const k=Math.min(1,900/Math.max(w,h));
    canvas.width=Math.round(w*k);canvas.height=Math.round(h*k);
    ctx.setTransform(k,0,0,k,0,0);
    ctx.globalCompositeOperation='source-over';ctx.fillStyle='#14082b';ctx.fillRect(0,0,w,h);
  }
  setup();window.addEventListener('resize',setup);
  const estrelas=[];for(let i=0;i<45;i++){estrelas.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.4+.6,a:.3+Math.random()*.7,f:.02+Math.random()*.05});}
  const particulas=[];const MAX=reduz?90:220;
  function explodir(x,y){
    if(particulas.length>MAX)return;
    const n=(reduz?22:34)+Math.floor(Math.random()*(reduz?10:22));const hue=Math.random()*360;
    const cores=[`hsl(${hue|0},92%,66%)`,`hsl(${(hue+28)%360},92%,74%)`];
    for(let i=0;i<n;i++){const ang=Math.random()*Math.PI*2;const vel=Math.random()*4.5+1.2;
      particulas.push({x,y,vx:Math.cos(ang)*vel,vy:Math.sin(ang)*vel,vida:1,decai:0.010+Math.random()*0.018,cor:cores[i&1],tam:2.2+Math.random()*2.4});}
  }
  let t=0,ultima=-99,animId=0,parado=false,antes=0;
  function loop(ts){
    if(parado)return;
    animId=requestAnimationFrame(loop);
    if(document.hidden)return;
    if(!antes)antes=ts;
    const ms=ts-antes;if(ms<30)return;            /* ~30 fps */
    antes=ts;const dt=Math.min(3,ms/16.667);t+=dt;
    ctx.globalCompositeOperation='source-over';
    ctx.fillStyle='rgba(10,5,25,'+Math.min(.5,.16*dt)+')';ctx.fillRect(0,0,w,h);
    ctx.globalCompositeOperation='lighter';
    ctx.fillStyle='#fff';
    for(let i=0;i<estrelas.length;i++){const e=estrelas[i];ctx.globalAlpha=e.a*(0.4+0.6*Math.abs(Math.sin(t*e.f+e.x*0.01)));ctx.fillRect(e.x,e.y,e.r*1.6,e.r*1.6);}
    if(t-ultima>=22||Math.random()<0.012*dt){explodir(w*(0.12+Math.random()*0.76),h*(0.10+Math.random()*0.42));ultima=t;}
    const arr=1-0.015*dt,grav=0.035*dt;
    for(let i=particulas.length-1;i>=0;i--){
      const p=particulas[i];
      p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=grav;p.vx*=arr;p.vy*=arr;p.vida-=p.decai*dt;
      if(p.vida<=0||p.y>h+30){particulas[i]=particulas[particulas.length-1];particulas.pop();continue;}
      const tm=p.tam*Math.max(0.35,p.vida);
      ctx.globalAlpha=p.vida;ctx.fillStyle=p.cor;ctx.fillRect(p.x-tm/2,p.y-tm/2,tm,tm);
    }
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  }
  explodir(w*0.35,h*0.28);explodir(w*0.68,h*0.22);
  animId=requestAnimationFrame(loop);
  return{parar(){parado=true;if(animId)cancelAnimationFrame(animId);window.removeEventListener('resize',setup);}};
}
let festaBonusAtual=null,festaCtxInfo=null;
function mostrarCtxFesta(){
  $('festaCtx').style.display='';$('festaBonusBox').style.display='none';$('festaBtnRow').style.display='none';
}
function fecharFesta(){
  const o=$('festa');
  if(festaAnim){festaAnim.parar();festaAnim=null;}
  o.classList.remove('ativo');
  setTimeout(()=>{o.hidden=true;if(!document.querySelector('.modal-overlay.ativo,.rel-overlay.ativo,.premio-modal.ativo,.onb-overlay.ativo'))document.body.style.overflow='';},450);
  finalizarMarco();
}
function abrirFesta(hb){
  som('brilho');
  const o=$('festa');const canvas=$('festaCanvas');
  $('festaHabito').textContent=(hb.emoji||'⭐')+' '+hb.nome;
  festaBonusAtual=null;festaCtxInfo=null;
  mostrarCtxFesta();
  botoesSituacao($('festaCtxBtns'),'festa-btn sec','festa-btn sec',k=>{{
      $('festaCtx').style.display='none';
      procurarPremio('G',k,p=>{
        festaBonusAtual=p;festaCtxInfo={tier:'G',ctx:k};
        atualizarBonusFesta();
        $('festaBonusBox').style.display='';$('festaBtnRow').style.display='';
        confete(['🎁','✨','💫']);
      },mostrarCtxFesta);
    }
  });
  o.hidden=false;requestAnimationFrame(()=>o.classList.add('ativo'));document.body.style.overflow='hidden';
  const fe=o.querySelector('.festa-emoji');   /* 21 dias: a gatinha comemora no lugar do 🎉 */
  if(fe&&window.customElements&&customElements.get('gatinha-fantoche')){
    fe.classList.add('com-gata');
    fe.innerHTML='<gatinha-fantoche pose="comemoracao" src-base="mascote/assets/pecas/" aria-hidden="true" style="width:130px;display:block;margin:0 auto"></gatinha-fantoche>';
    const g=fe.querySelector('gatinha-fantoche');const f=()=>{try{g.play('comemorar');}catch(e){}};
    g.addEventListener('ready',()=>setTimeout(f,500),{once:true});
  }
  if(festaAnim)festaAnim.parar();festaAnim=iniciarFogos(canvas);confete(['🎉','✨','💛','💜','🎊']);
  $('festaBtn').onclick=()=>{premioAprender(festaBonusAtual,true);fecharFesta();};
  $('festaGuardar').onclick=()=>{if(festaBonusAtual){premioAprender(festaBonusAtual,true);abrirGuardar(festaBonusAtual,festaCtxInfo,fecharFesta);}};
  $('festaResortear').onclick=()=>{
    if(!festaCtxInfo)return;
    premioAprender(festaBonusAtual,false);
    const p=sortearPremioCtx('G',festaCtxInfo.ctx,festaBonusAtual&&festaBonusAtual.id);
    if(!p){mostrarToast('Não tem outro desse tamanho pra agora');return;}
    festaBonusAtual=p;atualizarBonusFesta();confete(['🎁','✨','💫']);
  };
}
function atualizarBonusFesta(){const b=festaBonusAtual;if(b){$('festaBonusNome').textContent=b.nome;$('festaBonusTag').textContent=premioRotuloCabe(migrarPremio(b))+' · '+tamNome(b.tamanho)+(b.gratis?' · grátis':'');}}

