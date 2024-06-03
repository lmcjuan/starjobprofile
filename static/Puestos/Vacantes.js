let emp=[];
let getting=10;
let users=[];
let porcentaje=0;
let Temp=[];
let Descomp=[];

window.addEventListener('DOMContentLoaded', async() =>{
    const responses = await fetch ('/api/Puestos/');
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
    emp=data;
    Temp=data;
    rederUserV(emp);

});
function rederUserV(emp)
{
    const VacanList= document.querySelector('#Vacan-List')
    VacanList.innerHTML =''
   for(let m=emp.length-1;m>=0;m--){
    const userItem= document.createElement('li')
    userItem.classList='list-emp'
    userItem.innerHTML =`
    <header>
       <h3>${emp[m].Puesto}</h3>
    </header>
    <div>
    <h4>Experiencia</h4>
    <br>
    <p>${emp[m].Exp}</p>
    </div>
    <div>
    <h4>Perfil</h4>
    <br>
    <p>${emp[m].P}</p>
    </div>
    <div>
         <button class="borrar" onclick="borrarV(this,this)" data-opt="${emp[m].idV}"data-objt="${emp}">Borrar <img src="/static/icons/trash-2 (1).svg"></button>
         <button class="datalles"onclick="detallesV(this,this,this,this,this,this,this,this,this)"data-pst="${emp[m].Puesto}"data-exp="${emp[m].Exp}"data-p="${emp[m].P}"data-d="${emp[m].D}"data-i="${emp[m].I}"data-s="${emp[m].S}"data-c="${emp[m].C}"data-esc="${emp[m].Esc}"data-descpues="${emp[m].DescPues}">Detalles <img src="/static/icons/eye.svg"></button>
    </div>
    ` 
    VacanList.append(userItem)
   }

}
index=1;
clicks=0;
function borrarV(option)
{
    
    if (clicks>=1)
    {
        let optionClicked = $(option).data("opt");
        console.log(optionClicked)
        clicks=0;
        DeletV(optionClicked);
    }
    else
    {
        clicks=clicks+1;
        alert("La vacante será eliminada permanentemente")
        console.log(clicks);
    }
    
}

async function DeletV(iddel,obj)
{
console.log("Pidiendo datos del servidor..... "+iddel);
const response = await fetch (`/api/delete/vacante/${iddel}`);

if (response.status==200)
{
    console.log("Se ha eliminado el dato")
    $(`#${iddel}`).hide();
    emp=emp.filter(obj=>obj.idV!=iddel)
    rederUserV(emp);
}
else
{
    r="Error de conexión";

}



}

async function detallesV(vacan,Perf,Expe,Do,In,St,Cu,Esc,DescPues)
{
    let Pro= $(Perf).data("p")
    let Puest= $(vacan).data("pst");
    $("#vacante").text(Puest);
    let Exper=$(Expe).data("exp");
    $("#Experiencia").text(Exper);
    let Dm = $(Do).data("d");
    let If= $(In).data("i");
    let Sbd = $(St).data("s");
    let Cmt = $(Cu).data("c");
    let nivel_estu = $(Esc).data("esc");
    $("#Perfil").text(Pro);
    $("#Escolaridad").text(nivel_estu);
    let Descricion = $(DescPues).data("descpues");
    
    let detalist=Descricion.split('\n');
    CreateList(detalist);
    $("#candidatos").hide();
    $("#prf").show();
    $("#ntx").show();
    console.log("El resultado de l es = "+Pro);
    const list_hb=profile_final(Dm,If,Sbd,Cmt);
    $(".spop span").eq(0).text(list_hb[0]);
    $(".spop span").eq(1).text(list_hb[1]);
    $(".spop span").eq(2).text(list_hb[2]);
    $(".spop span").eq(3).text(list_hb[3]);
        console.log("Solicitando....."+Pro);
        obj=""+Pro+""
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
        if(respon.status==404)
        {
            console.log("Eror 404")
            $("#alerta").text("No hay datos disponibles por ahora");
           
        }
        users=dato;
        rederUser(users);
    
  
        
    ///////////////Solicitar perfil y caracteristicas de DISC

}

function Back()
{
    
    $("#candidatos").show();
    $("#prf").hide();
    $("#ntx").hide();
    $("#prfi").hide();
            

}
async function detalles(patron,idn,nombre,puesto,email,prc,perfil,phone,Expe)
{
    
    let idd= $(idn).data("idn");
    let pat=$(patron).data("ppr");
    let name = $(nombre).data("obj");
    $("#name").text(name);
    $(".GraphDISC span").text(pat);
    let emi = $(email).data("obg");
    let pu = $(puesto).data("obh");
    $("#puesto").text(pu);
    $("#email").text(emi);
    let prce = $(prc).data("obb");
    porcentaje=prce;
    console.log("Porcentaje")
    console.log(porcentaje);
    let p = $(perfil).data("obc");
    let pho= $(phone).data("pho");
    let Expi=$(Expe).data("exp");
    console.log(pho);
    console.log(Expi);
    $("#phonNum").text("Cel. "+pho);
    $("#Exp").text(Expi);
    $("#prfi").show();
    $("#Resultado").hide();
    $("#Cerrar").show();
    const responsess = await fetch (`/api/DISC/${p}`);
    const DISC = await responsess.json();
        
        //const data = await responsess.json();
        if (responsess.status==200)
        {
            console.log("Datos DISC")
            console.log(DISC)
            D=(DISC.D*prce)/100;
            I=(DISC.I*prce)/100;
            S=(DISC.S*prce)/100;
            C=(DISC.C*prce)/100;
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

function ophabilidades(D,I,S,C)
{
    let dp=D*0.7;
    let ip=I*0.7;
    let sp=S*0.7;
    let cp=C*0.7;
    const list_hb=profile_final(dp,ip,sp,cp);
    console.log(list_hb);
    $("#Dom").text(list_hb[0]);
    $("#Inf").text(list_hb[1]);
    $("#Est").text(list_hb[2]);
    $("#Cum").text(list_hb[3]);
}



//window.addEventListener('load',()=>{initCharts();});
//window.addEventListener('resize', myChart.resize);


///////////////////////////////////Habilidades//////////////////////////////////////


    


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
    <h4>Correo</h4>
    <br>
    <p>${users[m].email}</p>
    </div>
    <div>
    <h4>Perfil DISC</h4>
    <br>
    <p>${users[m].perfil} = ${users[m].porcentaje} %</p>
    </div>
    <div>
        <button id="Cerrar"class="borrar" onclick="cerrar()" style="display: none;">Cerrar</button>
         <button id="Resultado"class="datalles"onclick="detalles(this,this,this,this,this,this,this,this,this)" data-ppr="${users[m].perfil}"data-idn="${users[m].idpersona}"data-obj="${users[m].nombre}"data-obg="${users[m].email}"data-obh="${users[m].puesto}"data-obb="${users[m].porcentaje}"data-obc="${users[m].idperfil}"data-pho="${users[m].phone}"data-exp="${users[m].Exper}">Resultados</button>
    </div>
    ` 
    userList.append(userItem)
   }

}
function cerrar()
{
    $("#prfi").hide();
    $("#Resultado").show();
    $("#Cerrar").hide();
}

const busqueda= document.getElementById('busqueda')
 busqueda.addEventListener( 'keypress',function()
{
   console.log("Se activo la búsqueda "+busqueda.value);
   buscar(busqueda.value);
   if(busqueda.value.length==1)
   {
    console.log("Se volverá a cargar la lista completa")
    rederUserV(Temp);
   }
});

async function buscar(obj)
{

    console.log("Solicitando....."+obj);
        const respon = await fetch('/api/SearchV',
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
                emp=dato;
                $("#alerta").text("   ");
                rederUserV(emp);
            }
            console.log(dato);
            
           
        }
        //users=dato;
        //rederUser(users);
        
    
}

function CreateList(DetallesList)
{
    console.log("Se va crear la lista de detalles de vacante con:");
    console.log(DetallesList);
    num=10;
    if(DetallesList.length<10)
    {
        num=DetallesList.length;
    }
    const DetList= document.querySelector('#DetaList')
    DetList.innerHTML =''
   for(let m=0;m<num;m++){
    const DtItem= document.createElement('li')
    DtItem.classList='list-detall'
    DtItem.innerHTML =`
       <p> ${DetallesList[m]} </p>
    ` 
    DetList.append(DtItem)
   }

}