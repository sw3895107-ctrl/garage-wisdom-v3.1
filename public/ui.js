const rpmChart = new Chart(
document.getElementById("rpmChart"),
{
type:"line",
data:{
labels:["1","2","3","4","5"],
datasets:[{
label:"RPM",
data:[800,1200,2000,3000,2500]
}]
}
});


const tempChart = new Chart(
document.getElementById("tempChart"),
{
type:"line",
data:{
labels:["1","2","3","4","5"],
datasets:[{
label:"Temp",
data:[180,185,190,200,195]
}]
}
});


const voltChart = new Chart(
document.getElementById("voltChart"),
{
type:"line",
data:{
labels:["1","2","3","4","5"],
datasets:[{
label:"Voltage",
data:[12.3,13.1,14.0,13.8,13.9]
}]
}
});


async function ask(){

const question=document.getElementById("question").value;

document.getElementById("response").innerHTML=
"Analyzing problem...";

const res = await fetch("/ask",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({question})

});

const data = await res.json();

document.getElementById("response").innerHTML=data.answer;

}
