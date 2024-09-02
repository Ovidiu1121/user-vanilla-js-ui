export function createHome(alert) {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
<div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
       </div>  

    	<h1>Users</h1>

    <button class="button">Add user</button>

	<table class="table">
		<thead>
			<tr class="table-header">
				<th>Id</th>
				<th>Name</th>
				<th>Email</th>
				<th>Role</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
    `

    let button = document.querySelector(".button");
    let table = document.querySelector(".table");
    const alertPlaceholder = document.querySelector('.container-alert');
    let load = document.querySelector(".spinner-border");

    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    api("https://localhost:7161/api/v1/User/all").then(response => {
        return response.json();
    }).then(data => {
        load.classList = "";
        console.log(data);
        attachUsers(data.userList);
    }).catch(error => {
        load.classList = "";
        console.error('Error fetching data:', error);
        appendAlert(error, "danger");
    });


    button.addEventListener("click", (eve) => {
        CreateAddUserPage();
    });

    table.addEventListener("click", (eve) => {

        if (eve.target.classList.contains("updateUser")) {
            api(`https://localhost:7161/api/v1/User/id/${eve.target.textContent}`).then(res => {
                return res.json();
            }).then(data => {
                console.log(data);

                let user = {
                    name: data.name,
                    email: data.email,
                    role: data.role
                }

                CreateUpdatePage(user, eve.target.textContent);

            }).catch(error => {
                console.error('Error fetching data:', error);
            });
        }

    });

    if (alert === "deleted") {
        load.classList = "";
        appendAlert("User has been DELETED with success!", "success");
    }

    if (alert === "updated") {
        load.classList = "";
        appendAlert("User has been UPDATED with success!", "success");
    }

    if (alert === "added") {
        load.classList = "";
        appendAlert("User has been ADDED with success!", "success");
    }

}

export function CreateAddUserPage() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
      <h1>New User</h1>
    <form>
        <p class="name-container">
            <label for="name">Name</label>
            <input name="name" type="text" id="name">
            <a class="nameErr">Name required!</a>
        </p>
        <p class="email-container">
            <label for="email">Email</label>
            <input name="email" type="text" id="email">
            <a class="emailErr">Email required!</a>
        </p>
        <p class="role-container">
            <label for="role">Role</label>
            <input name="role" type="text" id="role">
            <a class="roleErr">Role required!</a>
        </p>
        <div class="createUser">
         <a href="#">Create New User</a>
        </div>
        <div class="cancel">
         <a href="#">Cancel</a>
        </div>
    </form>

    `

    let button = document.querySelector(".cancel");
    let test = document.querySelector(".createUser");

    button.addEventListener("click", (eve) => {
        createHome("");
    })

    test.addEventListener("click", (eve) => {
        createUpdateUser("create");
    })

}

export function CreateUpdatePage(user, idUser) {

    let container = document.querySelector(".container");

    container.innerHTML = `
    <h1>Update Doctor</h1>
    <form>
        <p>
            <label for="name">Name</label>
            <input name="name" type="text" id="name" value="${user.name}">
             <a class="nameErr">Name required!</a>
        </p>
        <p>
            <label for="email">Email</label>
            <input name="email" type="text" id="email" value="${user.email}">
             <a class="emailErr">Email required!</a>
        </p>
        <p>
            <label for="role">Role</label>
            <input name="role" type="text" id="role" value="${user.role}">
             <a class="roleErr">Role required!</a>
        </p>

        <div class="submitUpdate">
         <a href="#">Update User</a>
        </div>

          <div class="cancel">
         <a href="#">Cancel</a>
        </div>
        <div class="submitDelete">
         <a href="#">Delete User</a>
        </div>
    </form>
    `

    let cancelButton = document.querySelector(".cancel");
    let submitUpdateButton = document.querySelector(".submitUpdate");
    let submitDeleteButton = document.querySelector(".submitDelete");
    let nameinput = document.getElementById("name");

    nameinput.disabled = true;

    cancelButton.addEventListener("click", (eve) => {
        createHome("");
    });

    submitUpdateButton.addEventListener("click", (eve) => {
        createUpdateUser("update", idUser);
    });

    submitDeleteButton.addEventListener("click", (eve) => {

        api(`https://localhost:7161/api/v1/User/delete/${idUser}`, "DELETE")
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                createHome("deleted");
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    })


}

function createRow(user) {

    let tr = document.createElement("tr");

    tr.innerHTML = `
				<td class="updateUser">${user.id}</td>
				<td>${user.name}</td>
				<td>${user.email}</td>
				<td>${user.role}</td>
    `

    return tr;
}

function api(path, method = "GET", body = null) {

    const url = path;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        }
    }
    if (body != null) {
        options.body = JSON.stringify(body);
    }

    return fetch(url, options);
}

function attachUsers(users) {

    let lista = document.querySelector("thead");

    users.forEach(pl => {

        let tr = createRow(pl);
        lista.appendChild(tr);

    });

    return lista;

}

function createUpdateUser(request, idUser) {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let role = document.getElementById("role").value;

    let nameError = document.querySelector(".nameErr");
    let emailError = document.querySelector(".emailErr");
    let roleError = document.querySelector(".roleErr");

    let errors = [];

    if (name == '') {

        errors.push("Name");

    } else if (nameError.classList.contains("beDisplayed") && name !== '') {

        errors.pop("Name");
        nameError.classList.remove("beDisplayed");
    }

    if (email == '') {

        errors.push("Email");

    } else if (emailError.classList.contains("beDisplayed") && email !== '') {

        errors.pop("Email");
        emailError.classList.remove("beDisplayed");
    }

    if (role == '') {

        errors.push("Role");

    } else if (roleError.classList.contains("beDisplayed") && role !== '') {

        errors.pop("Role");
        roleError.classList.remove("beDisplayed");

    }

    if (errors.length == 0) {

        let user = {
            name: name,
            email: email,
            role: role
        }

        if (request === "create") {
            api("https://localhost:7161/api/v1/User/create", "POST", user)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    createHome("added");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else if (request === "update") {
            api(`https://localhost:7161/api/v1/User/update/${idUser}`, "PUT", user)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    createHome("updated");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    } else {

        errors.forEach(err => {

            if (err.includes("Name")) {

                nameError.classList.add("beDisplayed");
            }

            if (err.includes("Email")) {

                emailError.classList.add("beDisplayed");
            }

            if (err.includes("Role")) {

                roleError.classList.add("beDisplayed");
            }

        })

    }

}