LoadData();

//GET: domain:port//posts
//GET: domain:port/posts/id
async function LoadData() {
    let data = await fetch('http://localhost:3000/posts');
    let posts = await data.json();
    for (const post of posts) {
        // Bỏ qua các bản ghi đã xoá mềm
        if (post.isDelete === true) continue;
        let body = document.getElementById("body");
        body.innerHTML += convertDataToHTML(post);
    }
}

async function LoadDataA() {
    let data = await fetch('http://localhost:3000/posts');
    let posts = await data.json();
    for (const post of posts) {
        // Bỏ qua các bản ghi đã xoá mềm
        if (post.isDelete === true) continue;
        let body = document.getElementById("body");
        body.innerHTML += convertDataToHTML(post);
    }
}

function convertDataToHTML(post) {
    let result = "<tr>";
    result += "<td>" + post.id + "</td>";
    result += "<td>" + post.title + "</td>";
    result += "<td>" + post.views + "</td>";
    result += "<td><input type='submit' value='Delete' onclick='Delete("+post.id+")'></input></td>";
    result += "</tr>";
    return result;
}

// POST/PUT: nếu có id và tồn tại -> PUT; ngược lại -> POST (không gửi id để tự tăng)
async function SaveData(){
    let id = (document.getElementById("id").value || "").trim();
    let title = document.getElementById("title").value;
    let view = document.getElementById("view").value;

    try {
        if (id) {
            // Thử lấy theo id để quyết định PUT hay POST
            let check = await fetch("http://localhost:3000/posts/" + id);
            if (check.ok) {
                // Update (không đụng tới isDelete)
                let dataObj = { title: title, views: view };
                let putRes = await fetch('http://localhost:3000/posts/' + id, {
                    method: 'PUT',
                    body: JSON.stringify(dataObj),
                    headers: { "Content-Type": "application/json" }
                });
                console.log(putRes);
            } else {
                // Tạo mới: KHÔNG gửi id -> json-server tự tăng id
                let dataObj = { title: title, views: view };
                let postRes = await fetch('http://localhost:3000/posts', {
                    method: 'POST',
                    body: JSON.stringify(dataObj),
                    headers: { "Content-Type": "application/json" }
                });
                console.log(postRes);
            }
        } else {
            // Không nhập id -> tạo mới tự tăng id
            let dataObj = { title: title, views: view };
            let postRes = await fetch('http://localhost:3000/posts', {
                method: 'POST',
                body: JSON.stringify(dataObj),
                headers: { "Content-Type": "application/json" }
            });
            console.log(postRes);
        }
    } catch (err) {
        console.error(err);
    }
}

// Xoá mềm: PATCH isDelete:true (không dùng DELETE)
async function Delete(id){
    try {
        await fetch('http://localhost:3000/posts/' + id, {
            method: 'PATCH',
            body: JSON.stringify({ isDelete: true }),
            headers: { "Content-Type": "application/json" }
        });
        console.log("Soft delete (isDelete:true) thành công");
    } catch (err) {
        console.error(err);
    }
}
