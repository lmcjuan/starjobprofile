let index = 0;
let attempt = 0;
var pila=[];
var rs=[];
let F="";
let t="";
let time=[];
let questions = test.sort(function()
{
  return 0.5 - Math.random();
});

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
        sec=0;
    }
    if(index == 24)
    {
        time.push(""+min + ":" + sec+"")
        console.log(time)
        min=0;
        sec=0;
        index++;
    }
    if(index == 26)
    {
        time.push(""+min + ":" + sec+"")
        console.log(time)
        min=0;
        sec=0;
        index++;
        Enviar();
    }
    $(".timerBox span").text( min + " : " + sec);
},1000)
    printQuestion(index);
});
// ##################################funcion para imprimir el cuestionario DISC ################################

let question= test;
function printQuestion(i)
{
    
    $(".spop span").eq(0).text(questions[i].option[0]);
    $(".spop span").eq(1).text(questions[i].option[1]);
    $(".spop span").eq(2).text(questions[i].option[2]);
    $(".spop span").eq(3).text(questions[i].option[3]);
    $(".scoreBox span").text((index + 1)+ "/24");

    $(".description span").eq(0).text(questions[i].desp[0]);
    $(".description span").eq(1).text(questions[i].desp[1]);
    $(".description span").eq(2).text(questions[i].desp[2]);
    $(".description span").eq(3).text(questions[i].desp[3]);
}
// ############################ Funcion para checar las respuestas DISC #############################
mas = false;
let comp=5;
function checkAnswer(option)
{
    attempt++;
    
    console.log(attempt);
    if(attempt == 2)
    {
        console.log(attempt);
        $("#ntx").show();
        if((index+1) == 24){
        $("#Res").show();
        $("#ntx").hide();
        }
        $("#bck").show();
    }
    let optionClicked = $(option).data("opt");
    if (optionClicked == comp){
        attempt--;
        $("#ntx").hide();
        alert('No puedes seleccionar la misma opción');
    }
    else
        {
    if(mas == false)
    {   
        $(option).addClass("mas");
        mas=true;
        comp=optionClicked;
        let op= questions[index].Mas[optionClicked];
        console.log(op);
        rs.push(op);
    
    }
    else
    {
        $(option).addClass("menos");
        $(".spop span").attr("onclick", "");
        let mn= questions[index].Menos[optionClicked];
        rs.push(mn);
        console.log(mn);
        console.log(questions[index].question);
        comp=5;
        
    }
        }
    
   console.log(rs);
}

// ######################### Funcion para el botón ¨siguiente seccion¨ ###############################

function showNex()
{
    if(attempt==2){
    if(index >= questions.length - 1)
    {
        showResult();
        return;
    }
    index++;
    attempt=0;
    mas=false;
    $(".spop span").removeClass();
    $(".spop span").attr("onclick","checkAnswer(this)");
    printQuestion(index);
    }
    else
    {
        alert("Para poder avanzar a la siguiente sección es necesario seleccionar las dos palabras con las que se identifique ");
    }
}
// ######################### Funcion para limpiar las respuestas del cuestionario ###############################
function showBack()
{
    for(let h=0;h<attempt;h++)
    {
        let sacado=rs.pop();
        console.log("Sacado de la evalucacion : "+ sacado);
    }
    comp=5;
    attempt=0;
    $("#ntx").hide();
    $("#bck").hide();
    $("#Res").hide();
    mas=false;
    $(".spop span").removeClass();
    $(".spop span").attr("onclick","checkAnswer(this)");
    printQuestion(index);
    console.log("La lista quedo asi : "+ rs);

}
// ######################### Funcion para ver resultados ###############################

function showResult()
{
    printCharts();
    $("#TextScreen").hide();
    $("#resutScreen").show();
    $("#tank").show();
    $("#prof").show();
    $(".boxres2 span").eq(0).text( pila[0]+"");
    $(".boxres2 span").eq(1).text( pila[1]+"");
    $(".boxres2 span").eq(2).text( pila[2]+"");
    $(".boxres2 span").eq(3).text( pila[3]+"");
    $(".Profile span").text(Perfiles[F].Tipo);
    $(".Patron span").text(Perfiles[F].Patron);
    $(".AD span").text(Perfiles[F].Ac);
}
// ######################### Funcion para imprimir gráficas ###############################
const printCharts = () => 
{
    renderModelsChart();
    renderDISC();
    
}

const renderModelsChart = () =>
{
    
    const data= {labels:['D','I','S','C'],
    datasets:[{
        label:'Comportamiento diario',
        data:pila,
        borderColor:['#444','#ff0000','#00b0f0','#f6e144'],
        backgroundColor:['#92d050','#ff0000','#00b0f0','#f6e144'],
        tension: 0.4,
    
    }]}
    new Chart('modelsChart',{type:'line', data});
    
}

const renderDISC = () =>
{
    const data= {labels:['D','I','S','C'],
    datasets:[{
        data:pila,
        borderColor:['#92d050','#ff0000','#00b0f0','#f6e144'],
        backgroundColor:['#92d050','#ff0000','#00b0f0','#f6e144'],
        fill: false,

    }]}
    new Chart('modelsDISC',{type:'doughnut', data});
    
}
// ######################### Operaciones ###############################
let D=0;
let Y=0;
let S=0;
let C=0;
function diferencia()
{
    var contador=0;

         //Suma
   for (let i=0;i<rs.length;i++)
       {
        let cm=rs[i];
        if(cm == "D")
        {
            D++;
        }
        if(cm == "I")
        {
            Y++;
        }
        if(cm == "S")
        {
            S++;
        }
        if(cm == "C")
        {
            C++;
        }
           
           
           
           //Resta
        if(cm == "-D")
        {
            D--;
        }
        if(cm == "-I")
        {
            Y--;
        }
        if(cm == "-S")
        {
            S--;
        }
        if(cm == "-C")
        {
            C--;
        }
           contador++;
       }
    pila.push(D,Y,S,C);
    console.log("Los resultados finales son :"+" D: "+D+" I: "+Y+" S: "+S+" C: "+C);
    console.log(contador);
}

// Función para interpretar valores del Cuestionario
function Profile ()
{
    
    let card=[D,Y,S,C];
    let r=[{val:[D,Y,S,C], 
    per:["D","I","S","C"],},];
    //funcion que acomoda numeros
    function masmenos(array)
    {
        return array.sort((a,b)=> b-a);
    }
    let c= masmenos(card);
    console.log("Los valores de c se acomodaron"+ c);
    let menor=c[3];
    let mayor=c[0];
    console.log("Mayor "+mayor);
    console.log("Menor "+menor);
    /// Acomodar el patron ejemplo D/C
    let arriba=[];
    let abajo=[];
    for(let j=0;j<4;j++)
    {
        
        if (mayor==r[0].val[j])
        {
            console.log("Rarriba["+j+"]="+r[0].val[j]);
            console.log("Rarriba["+j+"]="+r[0].per[j]);
            arriba=r[0].per[j];
        }
        if(menor==r[0].val[j])
        {
            console.log("Rabajo["+j+"]="+r[0].per[j]);
            abajo=r[0].per[j];  
        }
        console.log("J="+j);
    }
    console.log(arriba+"/"+abajo);
    return arriba+"/"+abajo;
}
function printprofile(l)
{
    for(let v=0;v<12;v++)
    {
        if(l==Perfiles[v].Tipo)
        {
            return v;
        }
    }
    return 12;

}

//// Función beta para ejemplo de texto ya gudardado
async function Txt()
{
    index++;
    diferencia();
    t=Profile ();
    console.log("Resultdo de concatenacion "+t);
    F=printprofile(t);
    console.log("Resultdo de buscador "+ F);
    const P = ""+F+"";
 
    console.log("Pidiendo datos del servidor.....")
    const response = await fetch (`/datatxt/${P}`);
    const data = await response.json();
    console.log("Lo que llego del servidor es "+ data.TextUser);
    $("#questionScreen").hide();
    $("#TextScreen").show();
    $(".description span").text(data.TextUser);
}
function activar()
{
    index++;
    console.log(index)
    //// Obtener datos del API   
}



async function Enviar()
{
    
    const TextUser = document.getElementById("UserTXT").value;
    console.log("Tamaño de Text "+TextUser.length)
    if(TextUser.length>20)
    {
   
    const Id= ""+F+"";
    const Tipo= ""+t+"";
    const Timer= ""+time[0]+"";
    const Txtimer= ""+time[1]+"";
    console.log("Lo que hay en TextUser es : "+TextUser);
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
    console.log("Los datos se enviaron");
    console.log(response);
    showResult()
    }
    else
    {
        index=25;
        time.pop();
        console.log(time);
        console.log(index);
        alert("Por favor escribe tu respuesta antes de enviar ó intenta escribir un poco más");

    }
}


