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


// Last ID
let lastLocalId = localStorage.getItem("lastLocalId") || 100;

postform.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("posttitle").value.trim();
    const body = document.getElementById("postbody").value.trim();

    if (!title || !body) {
        message.innerText = "Please fill in both title and body.";
        return;
    }

    // add ID
    lastLocalId++;
    localStorage.setItem("lastLocalId", lastLocalId);

    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ title, body }),
    })
    .then(res => res.json())
    .then(data => {
        const newPost = {
            id: lastLocalId, // ID
            title: data.title,
            body: data.body,
            isLocal: true
        };
        localPosts.push(newPost);
        localStorage.setItem("localPosts", JSON.stringify(localPosts));
        message.innerText = `Post added! ID: ${newPost.id}`;
        postform.reset();
    })
    .catch(err => {
        message.innerText = `Error (POST): ${err.message}`;
    });
});

//PUT FORM
putform.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("putId").value.trim();
    const title = document.getElementById("puttitle").value.trim();
    const body = document.getElementById("putbody").value.trim();

    let index = localPosts.findIndex(p => p.id == id && p.isLocal === true);
    if (index === -1) {
        message.innerText = "You can only edit posts you created.";
        return;
    }

    localPosts[index].title = title;
    localPosts[index].body = body;
    localStorage.setItem("localPosts", JSON.stringify(localPosts));

    message.innerText = `Post updated! ID: ${id}`;
    putform.reset();
});
