/* Trocar de pessoa: mais de uma Diva no mesmo aparelho.
   Cada pessoa fica guardada inteira neste aparelho (localStorage 'divaPessoa_<id>').
   Nada é apagado ao trocar: a pessoa que sai fica guardada e pode voltar quando quiser.
   Se a nuvem estiver ligada, sai da conta Google antes de trocar, pra uma pessoa não
   misturar os dados com a conta da outra. */
(function(){
  const CHAVE_LISTA='divaPessoas';
  const lerLista=()=>{try{const l=JSON.parse(localStorage.getItem(CHAVE_LISTA)||'[]');return Array.isArray(l)?l:[];}catch(e){return[];}};
  const gravarLista=l=>{try{localStorage.setItem(CHAVE_LISTA,JSON.stringify(l));}catch(e){}};
  const novoId=()=>'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  const nomeDe=s=>((s&&s.onboarding&&s.onboarding.nome)||'').trim()||'Sem nome';

  function garanteId(){
    if(!S.pessoaId){S.pessoaId=novoId();try{localStorage.setItem('batomRisadaV23',JSON.stringify(S));}catch(e){}}
    return S.pessoaId;
  }
  // guarda a pessoa atual na lista (com todos os dados dela)
  function guardarAtual(){
    const id=garanteId();
    try{localStorage.setItem('divaPessoa_'+id,JSON.stringify(S));}catch(e){return false;}
    const l=lerLista().filter(p=>p.id!==id);
    l.unshift({id,nome:nomeDe(S)});
    gravarLista(l);
    return true;
  }
  function nuvemLigada(){
    try{const st=window.DIVAnuvem&&window.DIVAnuvem.status();return !!st&&!/^Desconectada/.test(st);}catch(e){return false;}
  }
  async function depoisDeSairDaNuvem(fn){
    if(nuvemLigada()&&window.DIVAnuvem&&window.DIVAnuvem.sair){try{await window.DIVAnuvem.sair();}catch(e){}}
    fn();
  }
  function trocarPara(id){
    if(!guardarAtual()){avisar('Não consegui guardar os dados de agora. Faça um backup antes de trocar.');return;}
    const raw=localStorage.getItem('divaPessoa_'+id);
    if(!raw){avisar('Não achei os dados dessa pessoa neste aparelho.');return;}
    depoisDeSairDaNuvem(()=>{
      try{localStorage.setItem('batomRisadaV23',raw);}catch(e){avisar('Não consegui trocar agora.');return;}
      location.reload();
    });
  }
  function novaPessoa(){
    if(!guardarAtual()){avisar('Não consegui guardar os dados de agora. Faça um backup antes de trocar.');return;}
    depoisDeSairDaNuvem(()=>{
      const s=estadoInicial();
      s.perfilOriginal=false;
      s.pessoaId=novoId();
      try{localStorage.setItem('batomRisadaV23',JSON.stringify(s));localStorage.removeItem('divaAdiar');}catch(e){avisar('Não consegui trocar agora.');return;}
      location.reload();
    });
  }

  window.abrirTrocarPessoa=function(){
    const id=garanteId();
    const outras=lerLista().filter(p=>p.id!==id&&localStorage.getItem('divaPessoa_'+p.id));
    const aviso=nuvemLigada()?'\n\nAo trocar, o DIVA sai da sua conta Google neste aparelho. Seus dados ficam guardados.':'';
    const botoes=outras.map(p=>({rotulo:'Entrar como '+p.nome,fn:()=>trocarPara(p.id)}));
    botoes.push({rotulo:'Começar com outra pessoa',prim:!outras.length,fn:()=>confirmar('Uma pessoa nova começa do início, com o nome e os hábitos dela. Os seus dados ficam guardados neste aparelho, e você volta por aqui quando quiser.'+aviso,novaPessoa,'Começar')});
    botoes.push({rotulo:'Voltar'});
    dialogo({titulo:'Trocar de pessoa',texto:'Agora: '+nomeDe(S)+'.'+(outras.length?' Escolha quem vai usar o DIVA.':'')+aviso,botoes});
  };

  // linha nova em Configurações, no grupo "Seus dados"
  if(typeof window.renderConfig==='function'){
    window.renderConfig=(function(orig){return function(){
      orig.apply(this,arguments);
      try{
        const ref=document.getElementById('btnImportar');
        if(!ref||document.getElementById('cfgRowPessoa'))return;
        const esc_=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
        const tmp=document.createElement('div');
        tmp.innerHTML=`<button type="button" class="cfg-row" id="cfgRowPessoa"><svg class="ic"><use href="#i-pessoas"/></svg><span class="cfg-txt">Trocar de pessoa<small>Outra Diva usar este aparelho</small></span><span class="cfg-val">${esc_(nomeDe(S))}</span><span class="cfg-seta">›</span></button>`;
        const linha=tmp.firstElementChild;
        ref.parentNode.insertBefore(linha,ref.nextSibling);
        linha.onclick=()=>fecharOverlay($('configModal'),window.abrirTrocarPessoa);
      }catch(e){}
    };})(window.renderConfig);
  }
})();
