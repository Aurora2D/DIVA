/* ============ TROCA DE EMOJIS POR ÍCONES PRÓPRIOS (em toda a tela) ============ */
const EMOJI_ICONE_TUDO=Object.assign({},EMOJI_ICONE,{
  '🌟':'atracao','🌸':'flor','💗':'coracao','🤍':'coracao','🫀':'coracao','🫶':'pessoas','👥':'pessoas',
  '🎁':'celebrar','🎀':'celebrar','🎊':'comemora','🙌':'comemora','👑':'coroa','🎲':'dado',
  '📋':'lista','✏️':'lapis','🗺️':'mapa','📅':'calendario','🕒':'relogio','⏳':'relogio','⏱️':'relogio','🎡':'relogio',
  '🪞':'espelho','🌿':'folha','🍃':'folha','🪴':'broto','🌅':'hoje','💭':'relato','💌':'carta',
  '📊':'grafico','🗑️':'lixeira','📂':'pasta','📦':'pasta','🖨️':'impressora','🔄':'ciclo','🔀':'ciclo',
  '👀':'olho','🙈':'olho','🔍':'olho','🔭':'olho','🧠':'lotus','🎨':'paleta','🧭':'bussola','🌊':'onda',
  '🌀':'vento','🔋':'bateria','💼':'maleta','🪺':'ninho','🪵':'graveto','📤':'enviar','📥':'baixar','💾':'baixar',
  '⏸️':'pausa','⚙️':'config','🛠️':'config','🎙️':'micro','🎧':'nota','🎚️':'escala','☕':'xicara','🍵':'xicara',
  '▶':'play','📵':'celular','💃':'pegadas','🛁':'agua','🔔':'sino','🍽️':'prato','🎶':'nota'
});
const RE_EMOJI=/(?:\p{Extended_Pictographic}️?(?:‍\p{Extended_Pictographic}️?)*)/gu;
const NAO_E_EMOJI=new Set(['✓','✕','↑','↓','→','↩','↗','©','®','™']);
function emojiParaIcone(e){const k=e.replace(/️/g,'');return EMOJI_ICONE_TUDO[e]||EMOJI_ICONE_TUDO[k]||EMOJI_ICONE_TUDO[k+'️']||null;}
function trocarEmojisNo(no){
  const t=no.nodeValue;if(!t)return;
  RE_EMOJI.lastIndex=0;if(!RE_EMOJI.test(t))return;
  const pai=no.parentNode;if(!pai)return;
  const tag=pai.nodeName;
  if(tag==='SCRIPT'||tag==='STYLE'||tag==='TEXTAREA'||tag==='TITLE')return;
  if(pai.closest&&pai.closest('[contenteditable="true"]'))return;
  if(tag==='OPTION'){                       // <option> não aceita ícone: só tira o emoji
    const limpo=t.replace(RE_EMOJI,m=>NAO_E_EMOJI.has(m)||!emojiParaIcone(m)?m:'').replace(/^\s+/,'');
    if(limpo!==t)no.nodeValue=limpo;return;
  }
  RE_EMOJI.lastIndex=0;
  const frag=document.createDocumentFragment();let ult=0,mudou=false,m;
  while((m=RE_EMOJI.exec(t))){
    const n=NAO_E_EMOJI.has(m[0])?null:emojiParaIcone(m[0]);
    if(!n)continue;                          // emoji sem equivalente (ex.: escolhido pela pessoa) fica como está
    mudou=true;
    if(m.index>ult)frag.appendChild(document.createTextNode(t.slice(ult,m.index)));
    const sp=document.createElementNS('http://www.w3.org/2000/svg','svg');sp.setAttribute('class','ic emo');sp.setAttribute('aria-hidden','true');
    const u=document.createElementNS('http://www.w3.org/2000/svg','use');u.setAttribute('href','#i-'+n);sp.appendChild(u);
    frag.appendChild(sp);ult=m.index+m[0].length;
    if(t[ult]===' '&&ult===m.index+m[0].length){/* mantém o espaço depois do ícone */}
  }
  if(!mudou)return;
  if(ult<t.length)frag.appendChild(document.createTextNode(t.slice(ult)));
  pai.replaceChild(frag,no);
}
function trocarEmojisEm(raiz){
  if(!raiz)return;
  if(raiz.nodeType===3){trocarEmojisNo(raiz);return;}
  if(raiz.nodeType!==1)return;
  if(raiz.nodeName==='SCRIPT'||raiz.nodeName==='STYLE')return;
  const w=document.createTreeWalker(raiz,NodeFilter.SHOW_TEXT);const lista=[];let n;
  while((n=w.nextNode()))lista.push(n);
  lista.forEach(trocarEmojisNo);
  /* placeholders e títulos */
  raiz.querySelectorAll&&raiz.querySelectorAll('[placeholder],[title]').forEach(el=>{
    ['placeholder','title'].forEach(a=>{const v=el.getAttribute(a);if(v&&RE_EMOJI.test(v)){RE_EMOJI.lastIndex=0;el.setAttribute(a,v.replace(RE_EMOJI,x=>emojiParaIcone(x)?'':x).trim());}RE_EMOJI.lastIndex=0;});
  });
}
(function(){
  const sem=s=>typeof s==='string'?s.replace(RE_EMOJI,x=>emojiParaIcone(x)?'':x).replace(/\n /g,'\n').trim():s;
  const p0=window.prompt.bind(window);window.prompt=(msg,def)=>p0(sem(msg),def);
  const c0=window.confirm.bind(window);window.confirm=msg=>c0(sem(msg));
  trocarEmojisEm(document.body);
  new MutationObserver(ms=>{ms.forEach(m=>{
    if(m.type==='characterData')trocarEmojisNo(m.target);
    else m.addedNodes.forEach(trocarEmojisEm);
  });}).observe(document.body,{childList:true,subtree:true,characterData:true});
})();

