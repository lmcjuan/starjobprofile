var Dom= document.getElementById('Dom');
var Inf= document.getElementById('Inf');
var Est= document.getElementById('Est');
var Cump= document.getElementById('Cump');


var pila=[];
let t="";
const getOptionChart3=()=>{
    return {
        title: {
            text: 'Patrón de comportamiento'
          },
        Color:['#444','#ff0000','#00b0f0','#f6e144'],
      xAxis: {
        type: 'category',
        data: ['D', 'I', 'S', 'C']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [Dom.value,Inf.value,Est.value,Cump.value],
          type: 'line',
          smooth: true
        }
        
      ]
    };
    
  };

const initCharts = () =>
{
    const chart3= echarts.init(document.getElementById("chart-3"));
    chart3.setOption(getOptionChart3());
};
Dom.addEventListener('mousemove',function(){
    console.log(Dom.value);
    const list_hb=profile_final(Dom.value,Inf.value,Est.value,Cump.value);
    console.log(list_hb);
    $(".spop span").eq(0).text(list_hb[0]);
    $(".spop span").eq(1).text(list_hb[1]);
    $(".spop span").eq(2).text(list_hb[2]);
    $(".spop span").eq(3).text(list_hb[3]);
    initCharts();
    pila=[Dom.value,Inf.value,Est.value,Cump.value];
    console.log(pila);
    t=Profile ();
    console.log("Resultdo de concatenacion "+t);
    $("#Perfil").text(t);
    guardar();
})
Inf.addEventListener('mousemove',function(){
    console.log(Inf.value);
    list_hb=profile_final(Dom.value,Inf.value,Est.value,Cump.value);
    console.log(list_hb);
    $(".spop span").eq(0).text(list_hb[0]);
    $(".spop span").eq(1).text(list_hb[1]);
    $(".spop span").eq(2).text(list_hb[2]);
    $(".spop span").eq(3).text(list_hb[3]);
    initCharts();
    pila=[Dom.value,Inf.value,Est.value,Cump.value];
    console.log(pila);
    t=Profile ();
    console.log("Resultdo de concatenacion "+t);
    $("#Perfil").text(t);
})
Est.addEventListener('mousemove',function(){
    console.log(Est.value);
    list_hb=profile_final(Dom.value,Inf.value,Est.value,Cump.value);
    console.log(list_hb);
    $(".spop span").eq(0).text(list_hb[0]);
    $(".spop span").eq(1).text(list_hb[1]);
    $(".spop span").eq(2).text(list_hb[2]);
    $(".spop span").eq(3).text(list_hb[3]);
    initCharts();
    guardar();
    pila=[Dom.value,Inf.value,Est.value,Cump.value];
    console.log(pila);
    t=Profile ();
    console.log("Resultdo de concatenacion "+t);
    $("#Perfil").text(t);
})
Cump.addEventListener('mousemove',function(){
    list_hb=profile_final(Dom.value,Inf.value,Est.value,Cump.value);
    console.log(list_hb);
    $(".spop span").eq(0).text(list_hb[0]);
    $(".spop span").eq(1).text(list_hb[1]);
    $(".spop span").eq(2).text(list_hb[2]);
    $(".spop span").eq(3).text(list_hb[3]);
    initCharts();
    console.log(Cump.value);
    pila=[Dom.value,Inf.value,Est.value,Cump.value];
    console.log(pila);
    t=Profile ();
    guardar();
    console.log("Resultdo de concatenacion "+t);
    $("#Perfil").text(t);
})
function Profile ()
{
    
    let card=[Dom.value,Inf.value,Est.value,Cump.value];
    let r=[{val:[Dom.value,Inf.value,Est.value,Cump.value], 
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
    if((r[0].val[0] === r[0].val[1]) && (r[0].val[2]===r[0].val[3]))
    {
        return "";
    }
    if(mayor == r[0].val[0])
    {
        if(r[0].val[3] == r[0].val[0])
        {
            return "";
        }
    }
    if(menor == r[0].val[0])
    {
        if(r[0].val[3] == r[0].val[0])
        {
            return "";
        }
    }
    if(mayor==0)
    {
        return "";
    }
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
function guardar()
{
 document.getElementById('Domi').value=Dom.value;
 document.getElementById('Influ').value=Inf.value;
 document.getElementById('Estabi').value=Est.value;
 document.getElementById('Cumpli').value=Cump.value;
 document.getElementById('Perf').value=t;
    console.log("############################################## ");
    if(t==="")
    {
        document.getElementById('Guardar').disabled=true;
    }
    else
    {
        document.getElementById('Guardar').disabled=false;
    }
}
const form= document.getElementById('Puesto-Form')
form.addEventListener('click', function(){
    if(t==="")
    {console.log("Alertaaaaaaaaaa");
    $("#alerta").text("Las habilidades blandas aún no están definidas, es posible que no puedas guardar los datos");
}
else{
    $("#alerta").text(" ");

}
})
/////////////////////////////////////////////////////////////////////////



