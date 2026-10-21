/* DIVA · gráfico "guarda-chuva": cada dimensão do mapa é um gomo que se preenche do centro para fora.
   svgGuardaChuva(itens) -> string SVG. itens = [{rot, bom (0-100), ant (0-100 ou null), grupo:'peso'|'sustenta'|'relaciona'}] */
function svgGuardaChuva(itens){
  const COR={peso:'#c98a5a',sustenta:'#6ea87a',relaciona:'#8F80D1'};
  const n=itens.length;if(!n)return '';
  const cx=200,cy=190,R=110,r0=18,gap=0.045;
  const ang=i=>-Math.PI/2+i*2*Math.PI/n;
  const P=(a,r)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
  const f=x=>x.toFixed(1);
  const rv=v=>r0+(R-r0)*Math.max(0,Math.min(100,v))/100;
  const gomo=(i,ra,rb)=>{const a0=ang(i)-Math.PI/n+gap,a1=ang(i)+Math.PI/n-gap;
    const [x0,y0]=P(a0,rb),[x1,y1]=P(a1,rb),[x2,y2]=P(a1,ra),[x3,y3]=P(a0,ra);
    return `M${f(x0)},${f(y0)} A${rb},${rb} 0 0 1 ${f(x1)},${f(y1)} L${f(x2)},${f(y2)} A${ra},${ra} 0 0 0 ${f(x3)},${f(y3)}Z`;};
  let g='';
  itens.forEach((d,i)=>{g+=`<path d="${gomo(i,r0,R)}" fill="rgba(128,120,140,.08)" stroke="rgba(128,120,140,.38)" stroke-width="1"/>`;});
  [25,50,75].forEach(l=>{g+=`<circle cx="${cx}" cy="${cy}" r="${f(rv(l))}" fill="none" stroke="rgba(128,120,140,.35)" stroke-dasharray="2 4"/>`;});
  itens.forEach((d,i)=>{
    const c=COR[d.grupo]||'#8F80D1',r=rv(d.bom);
    g+=`<path d="${gomo(i,r0,r)}" fill="${c}" fill-opacity=".8" stroke="${c}" stroke-width="1.5"/>`;
    if(typeof d.ant==='number'){
      const ra=rv(d.ant),a0=ang(i)-Math.PI/n+gap+.03,a1=ang(i)+Math.PI/n-gap-.03;
      const [x0,y0]=P(a0,ra),[x1,y1]=P(a1,ra);
      g+=`<path d="M${f(x0)},${f(y0)} A${f(ra)},${f(ra)} 0 0 1 ${f(x1)},${f(y1)}" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3" opacity=".65"/>`;
    }
    const [lx,ly]=P(ang(i),R+20),an=lx<cx-6?'end':lx>cx+6?'start':'middle';
    g+=`<text x="${f(lx)}" y="${f(ly+4)}" text-anchor="${an}" font-size="11" fill="currentColor">${String(d.rot).replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text>`;
  });
  return `<svg viewBox="-20 0 440 390" role="img" aria-label="Retrato das nove dimensões do ciclo" style="display:block;width:100%;height:auto;color:inherit;font-family:inherit">${g}</svg>`;
}
