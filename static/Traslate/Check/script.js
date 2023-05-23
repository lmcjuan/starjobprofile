let index = 210;
//Dataset=3
//index = 13
let txtespa="";
let prof="";
let total=1;
let pr="";
let idf="";

let list=["D/I","D/S","D/C","I/D","I/S","I/C","S/D","S/I","S/C","C/D","C/I","C/S","DC/IS","IS/DC"];

let i=0;
async function txtEn()
{
console.log("Pidiendo datos del servidor..... "+index);
let r="Conectando....";
const response = await fetch (`/api/Etiquetador/${index}`);
const data = await response.json();

txtespa=data.TextUserSp;
prof=data.Tipos[0]+" "+data.Coincidencias[0];
prof1=data.Tipos[1]+" "+data.Coincidencias[1];
prof2=data.Tipos[2]+" "+data.Coincidencias[2];
prof3=data.Tipos[3]+" "+data.Coincidencias[3];
prof4=data.Tipos[4]+" "+data.Coincidencias[4];

total=data.g;
pr=data.Tipos;
idf=data.IDS;
if (response.status==200)
{
    r="En línea";
    printQuestion();
    $(".timerBox span").text(r);
    
}
else
{
    r="Error de conexión";
    $(".timerBox span").text(r);
}
 return data
}
// ##################################funcion para imprimir el cuestionario DISC ################################


function printQuestion()
{
    
    $(".optionBox span").eq(0).text(txtespa);
    $(".optionBox span").eq(1).text(prof);
    $(".optionBox span").eq(2).text(prof1);
    $(".optionBox span").eq(3).text(prof2);
    $(".optionBox span").eq(4).text(prof3);
    $(".optionBox span").eq(5).text(prof4);
    $(".scoreBox span").text((index)+"/"+total);
    Printpro();
}
function TextCopy()
{
    console.log("Texto copiado!");
    document.getElementById('UserTXT').value=txtespa;
}
function checkAnswer(option)
{
    i = $(option).data("opt");
    console.log(i)
}

function Printpro()
{
    $(".opcuest span").eq(0).text(list[0]);
    $(".opcuest span").eq(1).text(list[1]);
    $(".opcuest span").eq(2).text(list[2]);
    $(".opcuest span").eq(3).text(list[3]);
    $(".opcuest span").eq(4).text(list[4]);
    $(".opcuest span").eq(5).text(list[5]);
    $(".opcuest span").eq(6).text(list[6]);
    $(".opcuest span").eq(7).text(list[7]);
    $(".opcuest span").eq(8).text(list[8]);
    $(".opcuest span").eq(9).text(list[9]);
    $(".opcuest span").eq(10).text(list[10]);
    $(".opcuest span").eq(11).text(list[11]);
    $(".opcuest span").eq(12).text(list[12]);
    $(".opcuest span").eq(13).text(list[13]);
}
function checkPer(option)
{
    pi = $(option).data("opt");
    console.log("Valores que serán sustituidos: idf= "+idf[i]+" pr= "+pr[i]+" por "+pi+ " y "+list[pi]);
    console.log("i="+i);
    console.log("pi="+pi);



    
    idf[i]=pi;
    pr[i]=list[pi];
    console.log("Valores fueron sustituidos: ID= "+idf[i]+" Perfil= "+pr[i]);
}
function showNex()
{
    index++;
    txtEn();
}
async function Enviar()
{

    const TextUser = document.getElementById("UserTXT").value;
    const Id=""+idf[i]+"";
    const Tipo= ""+pr[i]+"";
    const Timer= "0:0";
    const Txtimer= "0:0";
    console.log("Lo que hay en TextUser es : "+TextUser+Id+Tipo+Timer+Txtimer);
    const response = await fetch('/api/dataset',
    {
        method: 'POST',
        headers:{
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Id,
            Tipo,
            TextUser,
            Timer,
            Txtimer
        })

    })
    if(response==200)
    {
        console.log("Los datos se enviaron");
    }
    
    
}