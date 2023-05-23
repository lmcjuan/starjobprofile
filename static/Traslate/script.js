let index = 2160;
// inicio en 700 por 702
let attempt = 0;
let pass=false;
let wait = 1;
let txtinlge="";
let txtespa="";
let prof="";
let total=2280;
$(function()
{
    //tiempo 
    let sec = 0;
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
const response = await fetch (`/api/traslate/english/${index}`);
const data = await response.json();
txtinlge=data.txtEng;
txtespa=data.TextUserSp;
prof=data.Tipo;
wait=data.time;
//total=data.g;
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
console.log("La conexión volvera en ..... "+wait);
}
// ##################################funcion para imprimir el cuestionario DISC ################################


async function printQuestion()
{

    $(".optionBox span").eq(0).text(txtinlge);
    $(".optionBox span").eq(1).text(txtespa);
    $(".optionBox span").eq(2).text(prof);
    $(".scoreBox span").text((index + 1)+"/"+total);
    index++;
}


