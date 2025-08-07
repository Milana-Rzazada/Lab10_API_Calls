const fetchbtn = document.getElementById("fetchbtn");
const xhrbtn = document.getElementById("xhrbtn");
const postform = document.getElementById("postform");
const putform =document.getElementById("putform");
const output = document.getElementById("output");
const message = document.getElementById("message");

//fetch()

fetchbtn.addEventListener("click", () => {
    fetch("https://jsonplaceholder.typicode.com/posts/1")
    .then(response => {
        if(!response.ok) throw new Error("The server response failed.");
        return response.json();
    })
    .then(data => {
        output.innerText = `Title: ${data.title}\nContent: ${data.body}`;
        message.innerText = "";
    })
    .catch(error => {
        message.innerText = `ERROR (fetch): ${error.message}`;
    });
});

//XHR

xhrbtn.addEventListener("click", ()=>{
    const XHR = new XMLHttpRequest();
    XHR.open("GET", "https://jsonplaceholder.typicode.com/posts/2");

    XHR.onload = function(){
        if(XHR.status ===200){
            const data = JSON.parse(XHR.responseText);
            output.innerText = `Title: ${data.title}\nContent: ${data.body}`;
            message.innerText = "";

        }else{
            message.innerText = `ERROR (XHR): ${xhrbtn.status}`;
        }
    };
    XHR.onerror = function(){
        message.innerText = "Network error (XHR).";
    };
    XHR.send();
});