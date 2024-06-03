let users=[];
let getting=10;
let D=0;
let I=0;
let S=0;
let C=0;
Temp=[];
let porcentaje=0;
window.addEventListener('DOMContentLoaded', async() =>{
    const responses = await fetch ('/api/Dashboard/');
    console.log("Ventana");
    const data = await responses.json();
    if(responses.status==200)
    {
        console.log("Success");
        console.log(data.length);
        if( data.length<=getting)
            {
                console.log("Es menor no hay next")
                
            }
            console.log("Next")
            getting=getting+10;
    }
    users=data;
    Temp=data;
    rederUser(users);

});
function rederUser(users)
{
    const userList= document.querySelector('#userList')
   userList.innerHTML =''
   for(let m=users.length-1;m>=0;m--){
    const userItem= document.createElement('li')
    userItem.classList='list-users'
    userItem.innerHTML =`
    <header>
       <p>${users[m].idpersona}</p>
       <br>
       <h3>${users[m].nombre}</h3>
    </header>
    <div>
    <h4>Puesto solicitado</h4>
    <br>
    <p>${users[m].puesto}</p>
    </div>
    <div>
    <h4>Perfil DISC</h4>
    <br>
    <p>${users[m].perfil} = ${users[m].porcentaje} %</p>
    </div>
    <div>
         <button class="borrar" onclick="borrar(this,this)" data-opt="${users[m].idpersona}"data-objt="${users}">Borrar <img src="/static/icons/trash-2 (1).svg"></button>
         <button class="datalles"onclick="detalles(this,this,this,this,this,this,this,this,this,this)" data-ppr="${users[m].perfil}"data-idn="${users[m].idpersona}"data-obj="${users[m].nombre}"data-obg="${users[m].email}"data-obh="${users[m].puesto}"data-obb="${users[m].porcentaje}"data-obc="${users[m].idperfil}"data-pho="${users[m].phone}"data-exp="${users[m].Exper}">Resultados <img src="/static/icons/eye.svg"></button>
    </div>
    ` 
    userList.append(userItem)
   }

}
index=1;
clicks=0;
function borrar(option)
{
    
    if (clicks>=1)
    {
        let optionClicked = $(option).data("opt");
        console.log(optionClicked)
        clicks=0;
        Delet(optionClicked);
    }
    else
    {
        clicks=clicks+1;
        alert("El candidato será eliminado permanentemente")
        console.log(clicks);
    }
    
}

async function Delet(iddel,obj)
{
console.log("Pidiendo datos del servidor..... "+iddel);
const response = await fetch (`/api/delete/user/${iddel}`);

if (response.status==200)
{
    console.log("Se ha eliminado el dato")
    $(`#${iddel}`).hide();
    users=users.filter(obj=>obj.idpersona!=iddel)
    rederUser(users);
}
else
{
    r="Error de conexión";

}



}

async function detalles(patron,idn,nombre,puesto,email,prc,perfil,phone,Expe)
{
    
    let idd= $(idn).data("idn");
    let pat=$(patron).data("ppr");
    let name = $(nombre).data("obj");
    $("#name").text(name);
    let emi = $(email).data("obg");
    let pu = $(puesto).data("obh");
    $("#puesto").text(pu);
    $("#email").text("Correo: "+emi);
    let prce = $(prc).data("obb");
    porcentaje=prce;
    console.log("Porcentaje");
    console.log(porcentaje);
    let p = $(perfil).data("obc");
    let pho= $(phone).data("pho");
    let Expi=$(Expe).data("exp");
    console.log(pho);
    console.log(Expi);
    $("#phonNum").text("Cel. "+pho);
    $("#Exp").text(Expi);
    $("#candidatos").hide();
    $("#prf").show();
    $("#ntx").show();
    const responsess = await fetch (`/api/DISC/${p}`);
    const DISC = await responsess.json();
        
        //const data = await responsess.json();
        if (responsess.status==200)
        {
            console.log("Datos DISC")
            console.log(DISC)
            D=DISC.D
            I=DISC.I
            S=DISC.S
            C=DISC.C
            initCharts();
            ophabilidades(D,I,S,C);
        }
      const r = await fetch (`/api/UserTxt/${idd}`);
      const user = await r.json();
      if (r.status==200)
        {
            console.log("Texto ingresado por el usuario")
            console.log(user)
            $("#UserTxt").text(user.txt_user);
            $("#Perfil").text(pat);
            $("#Nperf").text(DISC.nombre);
            $("#PerfilDescrip").text(DISC.TextDISC);
            $("#Altoen").text(DISC.Alto);
            
        }
        
    ///////////////Solicitar perfil y caracteristicas de DISC

}

function Back()
{
    
    $("#candidatos").show();
    $("#prf").hide();
    $("#ntx").hide();
            

}
const busqueda= document.getElementById('busqueda')
 busqueda.addEventListener( 'keypress',function()
{
   console.log("Se activo la búsqueda "+busqueda.value);
   buscar(busqueda.value);
   if(busqueda.value.length==1)
   {
    console.log("Se volverá a cargar la lista completa")
    rederUser(Temp);
   }
});

async function buscar(obj)
{

    console.log("Solicitando....."+obj);
        const respon = await fetch('/api/Buscar',
        {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                obj
            })
        })
        console.log("Buscador activado");
        const dato = await respon.json();
        if(respon.status==200)
        {
            if(dato.length==0)
            {
                $("#alerta").text("No hay datos disponibles por ahora intenta con otro resultado");
            }
            else
            {
                users=dato;
                $("#alerta").text("   ");
                rederUser(users);
            }
            console.log(dato);
            
           
        }
        //users=dato;
        //rederUser(users);
        
    
}


//window.addEventListener('load',()=>{initCharts();});
//window.addEventListener('resize', myChart.resize);


///////////////////////////////////Habilidades//////////////////////////////////////

function ophabilidades(D,I,S,C)
{
    let dp=D*0.7;
    let ip=I*0.7;
    let sp=S*0.7;
    let cp=C*0.7;
    const list_hb=profile_final(dp,ip,sp,cp);
    console.log(list_hb);
    $(".spop span").eq(0).text(list_hb[0]);
    $(".spop span").eq(1).text(list_hb[1]);
    $(".spop span").eq(2).text(list_hb[2]);
    $(".spop span").eq(3).text(list_hb[3]);
}
