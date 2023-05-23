let index = 116;
let attempt = 0;
let pass=false;
let wait = 1;
let txtinlge="";
let txtespa="";
let prof="";
let total=202;
pila=[];
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
    

},1000)

});
const userForm=document.querySelector('#userForm');
userForm.addEventListener('submit',async e=>{
    e.preventDefault();
    autodes();
})
function autodes()
{
    $("#iniciar").hide();
    $("#TextScreen").show();
}

async function Enviar()
{
    
    const TextUser = document.getElementById("UserTXT").value;
    const exper = document.getElementById("ExpTXT").value
    console.log("Tamaño de Text "+TextUser.length)
    if(TextUser.length>20)
    {
    console.log("Lo que hay en TextUser es : "+TextUser);
    const response = await fetch (`/api/classification/${TextUser}`);
    if(response.status==200)
    {
        console.log("Los datos se enviaron");
        //Aquí va estar la función que recibe el perfil clasificado
        const data = await response.json();
        txtespa=data.TextUser;
        console.log("Lo que llego del servidor es "+ txtespa);
        console.log("Lo que llego del servidor es "+ data.Tipo);
        console.log("Lo que llego del servidor es "+ data.prc+"%");
        buscar=""+data.idU+"";
        showResult(buscar)
            const IDU=data.idU;
            const Prob=data.prc;
            const perf= data.Tipo;
            const Name_user=userForm['Username'].value;
            const correo=userForm['email'].value;
            const puesto=userForm['Puesto'].value;
            const phone=userForm['number'].value;
            console.log(Name_user,correo,puesto);
            userForm.reset();
            const responses = await fetch('/api/Save',
            {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    IDU,
                    Prob,
                    Name_user,
                    correo,
                    perf,
                    puesto,
                    phone,
                    exper
                })
            })
            if(responses.status==200)
            {
                console.log("Los datos se han guardado con éxito en el sevidor");
                const Id=""+data.idU+"";
                const Tipo= ""+data.Tipo+"";
                const Timer= "0:0";
                const Txtimer= "0:0";
                console.log("Lo que hay en TextUser es : "+TextUser+Id+Tipo+Timer+Txtimer);
                const respuestaurl = await fetch('/api/dataset',{
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
                if(respuestaurl.status==200){
                    console.log("Dataset actualizado");
                    $("#TextScreen").hide();
                }
            }
    }
    else
    {
        console.log("No hay resultado");
    }
    }
    else
    {
        alert("Por favor escribe tu respuesta antes de enviar ó intenta escribir un poco más");

    }
    
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



const printCharts = () => 
{
    renderModelsChart();
    renderDISC();
    
}
async function showResult(num)
{

    const responsess = await fetch (`/api/DISC/${num}`);
    const DISC = await responsess.json();
    pila[0]=DISC.D
    pila[1]=DISC.I
    pila[2]=DISC.S
    pila[3]=DISC.C
    printCharts();
    $("#TextScreen").hide();
    $("#resutScreen").show();
    $("#tank").show();
    $("#prof").show();
    $(".boxres2 span").eq(0).text( pila[0]+"");
    $(".boxres2 span").eq(1).text( pila[1]+"");
    $(".boxres2 span").eq(2).text( pila[2]+"");
    $(".boxres2 span").eq(3).text( pila[3]+"");
    $(".Profile span").text(DISC.Patron);
    $(".Patron span").text(DISC.nombre);
    $(".AD span").text(DISC.TextDISC);
}
// ##################################funcion para imprimir el cuestionario DISC ################################
