const fetchbtn = document.getElementById("fetchbtn");
const xhrbtn = document.getElementById("xhrbtn");
const postform = document.getElementById("postform");
const putform = document.getElementById("putform");
const deleteform = document.getElementById("deleteform");

const showallbtn = document.getElementById("showAllBtn");
const output = document.getElementById("output");
const message = document.getElementById("message");

// LocalStorage-dan oxu
let localPosts = JSON.parse(localStorage.getItem("localPosts")) || [];

// Show all posts
showallbtn.addEventListener("click", () => {
    fetch("https://jsonplaceholder.typicode.com/posts")
        .then(res => res.json())
        .then(apiPosts => {
            const allPosts = mergePosts(apiPosts, localPosts);
            output.innerHTML = "";
            allPosts.forEach(post => {
                const div = document.createElement("div");
                div.classList.add("post");
                div.innerHTML = `
                    <small>ID: ${post.id} ${post.isLocal ? "(local)" : ""}</small>
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                `;
                output.appendChild(div);
            });
            message.innerText = "";
        })
        .catch(err => {
            message.innerText = `ERROR (Show All): ${err.message}`;
        });
});

function mergePosts(apiPosts, localPosts) {
    const updatedMap = new Map();
    localPosts.forEach(lp => updatedMap.set(lp.id, lp));
    const finalPosts = apiPosts.map(ap => updatedMap.has(ap.id) ? updatedMap.get(ap.id) : ap);
    localPosts.forEach(lp => {
        if (lp.id > 100) finalPosts.push(lp);
    });
    return finalPosts;
}

// ---- fetch() 
fetchbtn.addEventListener("click", () => {
    fetch("https://jsonplaceholder.typicode.com/posts/1")
        .then(res => res.json())
        .then(data => {
            output.innerText = `Title: ${data.title}\nContent: ${data.body}`;
            message.innerText = "";
        })
        .catch(err => {
            message.innerText = `ERROR (fetch): ${err.message}`;
        });
});

// ---- XHR 
xhrbtn.addEventListener("click", () => {
    const XHR = new XMLHttpRequest();
    XHR.open("GET", "https://jsonplaceholder.typicode.com/posts/2");
    XHR.onload = function() {
        if (XHR.status === 200) {
            const data = JSON.parse(XHR.responseText);
            output.innerText = `Title: ${data.title}\nContent: ${data.body}`;
            message.innerText = "";
        } else {
            message.innerText = `ERROR (XHR): ${XHR.status}`;
        }
    };
    XHR.onerror = () => {
        message.innerText = "Network error (XHR).";
    };
    XHR.send();
});

