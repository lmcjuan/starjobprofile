let index =0;
let inicio = 0;
//Dataset=3
//index = 13
let txtespa="";
let prof="";
let id="";
let total=500;
let pr="";
let idf="";
let idtext="";
let list=["D/I","D/S","D/C","I/D","I/S","I/C","S/D","S/I","S/C","C/D","C/I","C/S"];
let attempt = 0;
let pass=false;
let wait = 1;
let txtinlge="";
let total2=0;
let sec = 0;
let i=0;
$(function()
{
    //tiempo 
    sec = 0;
    let min = 0;
    let incrementoID = setTimeout(function incremento(){
    sec++;
    incrementoID = setTimeout(incremento,1000);
    if(sec == 2)
    {
        min++;
        sec = 0;
    }
    
    if(wait == sec)
    {
        pass = true;
        
    }
    else
    {
        pass = false;
    }
    if (pass == true)
{
    console.log("iniciando conexión");
    if(inicio==total)
    {
    console.log("La conexion se rechazó porque se alcanzó el límite de datos");
    $("#questionScreen").hide();
    $("#resutScreen").show();
    }
    else{
        txtEn();
    }
    
}
},1000)

});
async function txtEn()
{
console.log("Pidiendo datos del servidor..... "+index);
let r="Conectando....";
const response = await fetch (`/api/BuscarE/${index}`);
const data = await response.json();


if (response.status!=200)
{
    r="Error de conexión";
    $(".timerBox span").text(r);
    
}
else 
{
    
    r="En línea";
    printQuestion(data);
    $(".timerBox span").text(r);
}
 return data
}
// ##################################funcion para imprimir el cuestionario DISC ################################

async function printQuestion(data)
{
    
    txtespa=data[inicio].TextUser;
    idtext=data[inicio].IdText;
    total2=data.length;
    const response = await fetch (`/SVM/EtiquetadorBetaA/${idtext}`);
    const exep = await response.json();
    pr=exep.Tipo;
    idf=exep.ID;
    wait=exep.time;
    TextCopy();
    if (response.status==200)
    {
    re="En línea";
    sec = 0;
        console.log("Se va eliminar el dato del CSV");
        const r = await fetch (`/Exeptions/delete/Text/${idtext}`);
    
    $(".timerBox span").text(re);}
    else
    {
        re="Error";
        $(".timerBox span").text(re);
    }
    idtext=data[inicio].IdText;
    total2=data.length;
    prof=exep.Tipos;;
    idf=data[inicio].ID;
    TextCopy();
    $(".optionBox span").eq(0).text(prof[1]);
    $(".optionBox span").eq(1).text(idtext);
    $(".scoreBox span").text((inicio)+"/"+total+"/"+total2);
    inicio++;
    console.log("La conexión volvera en ..... "+wait);
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
    console.log("Valores que serán sustituidos: idf= "+idf+" pr= "+pr+" por "+pi+ " y "+list[pi]);
    console.log("i="+i);
    console.log("pi="+pi);



    
    idf=pi;
    pr=list[pi];
    console.log("Valores fueron sustituidos: ID= "+idf+" Perfil= "+pr);
}
function showNex()
{
    inicio++;
    txtEn();
}
async function Enviar()
{

    const TextUser = document.getElementById("UserTXT").value;
    const r = await fetch (`/api/delete/Text/${idtext}`);
    const Id=""+idf+"";
    const Tipo= ""+pr+"";
    const Timer= "0:0";
    const Txtimer= "0:0";
        txtEn();
  
    
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