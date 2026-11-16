/* ============ HÁBITOS QUE A PESSOA JÁ FAZ ============
   Ao adicionar um hábito novo, o app pergunta: "Você já faz isso?".
   Se já faz, o hábito aparece pra marcar e é comemorado igual aos outros (confete, frase e a Biju
   com a comemoração da pessoa), entra na listinha do fim do dia, mas não passa pela trilha de
   3, 7 e 21 dias e não segura a chegada de um hábito novo.
   Dá pra trocar depois no menu do hábito. Nada do que já foi marcado é apagado.
   Carregue depois de hoje.js e habitos.js. */

/* ---- ao marcar: comemora sempre, mas sem a festa dos marcos ---- */
let _jaFacoMarcando=null;
window.tierParaTotal=(function(orig){return function(total){
  if(_jaFacoMarcando)return null;
  return orig(total);
};})(window.tierParaTotal);
window.toggleHabito=(function(orig){return function(id){
  const hb=S.habitos.find(x=>x.id===id);
  _jaFacoMarcando=hb&&hb.jaFaco?hb:null;
  try{return orig.apply(this,arguments);}finally{_jaFacoMarcando=null;}
};})(window.toggleHabito);

/* ---- trocar entre "já faço" e "quero criar" ---- */
function jaFacoDefinir(hb,sim){
  if(!hb)return;
  if(sim){
    hb.jaFaco=true;
    if(S.habitoTravaId===hb.id){S.habitoTravaId=null;S.proximoHabitoEm=null;}
  }else delete hb.jaFaco;
  salva();renderHoje();renderHabitos();
}

/* ---- a pergunta, logo depois de adicionar ---- */
function jaFacoPerguntar(hb){
  if(!hb)return;
  $('hmEmoji').textContent=hb.emoji||'⭐';
  $('hmNome').textContent='Você já faz isso?';
  $('hmInfo').textContent='“'+hb.nome+'”. Se já faz, ele entra pra você marcar e comemorar, sem a trilha de 3, 7 e 21 dias.';
  const c=$('hmBotoes');c.innerHTML='';
  const add=(rot,cls,fn)=>{const b=document.createElement('button');b.className='modal-btn '+cls;b.textContent=rot;b.onclick=()=>fecharOverlay($('habMenuModal'),fn);c.appendChild(b);};
  add('Já faço','prim',()=>{jaFacoDefinir(hb,true);mostrarToast('Anotado: esse você já faz 💛');});
  add('Quero começar','sec',()=>{});
  abrirOverlayTopo($('habMenuModal'));
}
window.adicionarHabitoFila=(function(orig){return function(item){
  const antes=S.habitos.length;
  const r=orig.apply(this,arguments);
  const hb=S.habitos.length>antes?S.habitos[S.habitos.length-1]:null;
  if(hb&&Object.keys(hb.feitos||{}).length<3)setTimeout(()=>jaFacoPerguntar(hb),700);
  return r;
};})(window.adicionarHabitoFila);

/* ---- no menu do hábito, dá pra mudar de ideia ---- */
window.abrirHabMenu=(function(orig){return function(hb){
  const r=orig.apply(this,arguments);
  const c=$('hmBotoes');if(!c||!hb)return r;
  const b=document.createElement('button');b.className='modal-btn sec';
  b.textContent=hb.jaFaco?'🌱 Quero os marcos de 3, 7 e 21 dias':'💛 Esse eu já faço';
  b.onclick=()=>fecharOverlay($('habMenuModal'),()=>{
    jaFacoDefinir(hb,!hb.jaFaco);
    mostrarToast(hb.jaFaco?'Anotado: esse você já faz 💛':'Esse volta a ter os marcos 🌱');
  });
  const fechar=c.lastElementChild;c.insertBefore(b,fechar);
  return r;
};})(window.abrirHabMenu);

/* ---- em Gerenciar hábitos: no lugar da barra até 21, a marquinha "já faço" ---- */
window.renderHabitos=(function(orig){return function(){
  const r=orig.apply(this,arguments);
  try{
    (S.habitos||[]).filter(h=>h.jaFaco).forEach(hb=>{
      const bt=document.querySelector('#progressoBox [data-editar="'+CSS.escape(hb.id)+'"]');
      const card=bt&&bt.closest('.hab');if(!card)return;
      const barra=card.querySelector('.barra');if(barra)barra.style.display='none';
      const pr=card.querySelector('[data-premiar]');if(pr)pr.style.display='none';
      const nome=card.querySelector('.nome');
      if(nome&&!nome.querySelector('.tag-jafaco'))nome.insertAdjacentHTML('beforeend',' <span class="tag tag-jafaco">já faço</span>');
    });
  }catch(e){}
  return r;
};})(window.renderHabitos);
