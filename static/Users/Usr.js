
const description = document.querySelector('.description');
 Example = document.querySelector('.Example');
description.onclick=function(){
 //   search.classList.toggle('activate')
 Example.classList.toggle('activate')
 console.log("Instrucciones");
 $(".questionBox").show();
}
function cerrar()
{
    $(".questionBox").hide();
}




