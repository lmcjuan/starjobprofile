function ShowSteps()
{
    $("#steps").show();
    $("#star").hide();
    $("#buttons").show();
}
function Back()
{
    $("#steps").hide();
    $("#buttons").hide();
    $("#star").show();
}
function dropdownMenu()
{
    var x = document.getElementById("dropdownClick");
    if (x.className === "topnav")
    {
        x.className += " responsive";
    }
    else
    {
        x.className = "topnav";
    }
}

const icon = document.querySelector('.icon');
const search = document.querySelector('.search');
icon.onclick=function(){
    search.classList.toggle('activate')
}



