let index =0;
// index 1602;
let attempt = 0;
let pass=false;
let wait = 1;
let txtinlge="";
let pr="";
let idf="";
let total=1000;
let total2=0;
let sec = 0;
$(function()
{
    //tiempo 
    sec = 0;
    let min = 0;
    let incrementoID = setTimeout(function incremento(){
    sec++;
    incrementoID = setTimeout(incremento,1000);
    if(sec == 60)
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
    if(index==total)
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
const response = await fetch (`/SVM/EtiquetadorBetaA/${index}`);
const data = await response.json();
txtespa=data.TextUserSp;
prof=data.Tipos;
total2=data.g;
pr=data.Tipos;
idf=data.IDS;
wait=data.time;
//total=data.g;
if (response.status==200)
{
    r="En línea";
    sec = 0;
    printQuestion();
    $(".timerBox span").text(r);
    
    
}
else
{
    r="Error de conexión";
    $(".timerBox span").text(r);
}
console.log("La conexión volvera en ..... "+wait);
}
// ##################################funcion para imprimir el cuestionario DISC ################################


function printQuestion()
{
    $(".optionBox span").eq(0).text(txtespa);
    $(".optionBox span").eq(1).text(prof[0]);
    $(".optionBox span").eq(2).text(prof[1]);
    $(".scoreBox span").text((index)+"/"+total+"/"+total2);
    index++;
}


