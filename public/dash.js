document.getElementById("engineGauge").innerText = "OK";
document.getElementById("codeGauge").innerText = "READY";


async function askAI(){

const question =
document.getElementById("question").value;

document.getElementById("response").innerHTML =
"Thinking like a mechanic...";

const res = await fetch("/ask",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({question})

});

const data = await res.json();

document.getElementById("response").innerHTML =
data.answer;

}



async function lookupCode(){

const code =
document.getElementById("codeInput").value;

document.getElementById("response").innerHTML =
"Checking that code...";

const res = await fetch("/ask",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
question:`Explain OBD code ${code} and how to fix it`
})

});

const data = await res.json();

document.getElementById("response").innerHTML =
data.answer;

}
