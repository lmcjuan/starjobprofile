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
})


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
            const Last_name=userForm['Lastname'].value;
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
                    Last_name,
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
    $("#iniciar").hide();
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


const slidePage=document.querySelector("#userForm");
const firtNextBtn=document.querySelector(".nextBtn");
const prevBtnSec=document.querySelector(".prev-1");
const nextBtnSec=document.querySelector(".next-1");
const nextBtnThird=document.querySelector(".next-2");
const prevBtnThird=document.querySelector(".prev-2");
const prevBtnFourth=document.querySelector(".prev-3");
const submitBtn=document.querySelector(".submit");
const progressText=document.querySelectorAll(".step p");
const progressCheck=document.querySelectorAll(".step .check");
const bullet=document.querySelectorAll(".step .bullet");

let max=4;
let current=1;



slidePage.addEventListener('mousemove',function(){
    const Name_user=userForm['Username'].value;
    if(Name_user.length>=3)
    {
        const Last_name=userForm['Lastname'].value;
        if(Last_name.length>=3)
        {
            $("#btn-n-1").show();  
        }
    }
    const correo=userForm['email'].value;
    if(correo.length>=4)
    {
        const phone=userForm['number'].value;
        if(phone.length>=4)
        {
            $("#btn-n-2").show();  
        }
    }
    const puesto=userForm['Puesto'].value;
    if(puesto.length>=4)
    {
        const exper = document.getElementById("ExpTXT").value
        if(exper.length>=4)
        {
            $("#btn-n-3").show();  
        }
    }
})
firtNextBtn.addEventListener("click",function(){
    
    $("#slidepage-1").show();
    $("#slidepage").hide();
    bullet[current -1].classList.add("activate");
    progressText[current -1].classList.add("activate");
    progressCheck[current -1].classList.add("activate");
    current+=1;
});

nextBtnSec.addEventListener("click",function(){
    
    $("#slidepage-2").show();
    $("#slidepage-1").hide();
    bullet[current -1].classList.add("activate");
    progressText[current -1].classList.add("activate");
    progressCheck[current -1].classList.add("activate");
    current+=1;
});

nextBtnThird.addEventListener("click",function(){
    $("#slidepage-3").show();
    $("#slidepage-2").hide();
    bullet[current -1].classList.add("activate");
    progressText[current -1].classList.add("activate");
    progressCheck[current -1].classList.add("activate");
    current+=1;
});


prevBtnSec.addEventListener("click",function(){
    $("#slidepage").show();
    $("#slidepage-1").hide();
    bullet[current -2].classList.remove("activate");
    progressText[current -2].classList.remove("activate");
    progressCheck[current -2].classList.remove("activate");
    current-=1;
});

prevBtnThird.addEventListener("click",function(){
    $("#slidepage-1").show();
    $("#slidepage-2").hide();
    bullet[current -2].classList.remove("activate");
    progressText[current -2].classList.remove("activate");
    progressCheck[current -2].classList.remove("activate");
    current-=1;
});

prevBtnFourth.addEventListener("click",function(){
    $("#slidepage-2").show();
    $("#slidepage-3").hide();
    bullet[current -2].classList.remove("activate");
    progressText[current -2].classList.remove("activate");
    progressCheck[current -2].classList.remove("activate");
    current-=1;
});

submitBtn.addEventListener("click",function(){
    bullet[current -1].classList.add("activate");
    progressText[current -1].classList.add("activate");
    progressCheck[current -1].classList.add("activate");
    current+=1;
});
function formatPhoneNumber(value)
{
    if(!value) return value;
    const phoneNumber=value.replace(/[^\d]/g,'');
    const phoneNumberLength = phoneNumber.length;
    if(phoneNumberLength < 4) return phoneNumber;
    if(phoneNumberLength<7)
    {
        return `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(
        3,
        6,
        )}-${phoneNumber.slice(6,9)}`
}
function phoneNumberFormater()
{
    const inputField = document.getElementById('number');
    const formattedInputValue = formatPhoneNumber(inputField.value);
    inputField.value = formattedInputValue;
}