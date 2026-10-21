/* tudo o que liga o app na hora em que ele abre: roda por último, depois de todas as outras partes */
/* INIT */
try{if(!S.migradoNomesInfinitivo){migrarNomesInfinitivo(S);salva();}}catch(e){console.warn('migração de nomes',e);}
if(!S.perfilOriginal){
  FRASES_HABITO.batom=["Passei batom. Evidências de vida encontradas.","Lábios coloridos, dia com a minha cara.","Batom passado, autoestima avisada.","Hoje eu tenho batom e opinião.","Um gesto pequeno, um sorriso no espelho."];
}
iniciarPraticas();
montaCheckin();
renderHoje();
frase();
if(!S.onboarding.feito){setTimeout(iniciarOnboarding,300);}
else {setTimeout(avisosIniciais,900);setTimeout(estiloConvidarSePreciso,2000);}
