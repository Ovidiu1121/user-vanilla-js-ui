export function createHome() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
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

    api("https://localhost:7161/api/v1/User/all").then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        attachUsers(data.userList);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });


    let button = document.querySelector(".button");

    button.addEventListener("click", (eve) => {
        CreateAddUserPage();
    });

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
        createHome();
    })

    test.addEventListener("click", (eve) => {
        createUser();
    })

}

function createRow(user) {

    let tr = document.createElement("tr");

    tr.innerHTML = `
				<td>${user.id}</td>
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

function createUser() {

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

        api("https://localhost:7161/api/v1/User/create", "POST", user)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                createHome();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
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