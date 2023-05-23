const profile_final=(D,I,S,C)=>{
const list=[]
console.log("Los valores por 0.6: D= "+D+" I="+I+" S="+S+" C"+C)
dint=parseInt(D);
iint=parseInt(I);
sint=parseInt(S);
cint=parseInt(C);
dflot=parseInt(((D-dint)*10)*0.6);
iflot=parseInt(((I-iint)*10)*0.6);
sflot=parseInt(((S-sint)*10)*0.6);
cflot=parseInt(((C-cint)*10)*0.6);
let Dom = Dominancia;
let Inf= Influencia;
let Est= Estabilidad;
let Cump=Cumplimiento;

console.log("Habilidades blandas :");
console.log("D "+Dom[dint].habi[dflot]);
list.push(Dom[dint].habi[dflot]);
console.log("I "+Inf[iint].habi[iflot]);
list.push(Inf[iint].habi[iflot]);
console.log("S "+Est[sint].habi[sflot]);
list.push(Est[sint].habi[sflot]);
console.log("C "+Cump[cint].habi[cflot]);
list.push(Cump[cint].habi[cflot]);
return list;
};