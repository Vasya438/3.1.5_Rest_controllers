$(async function () {
    await getAuthUser();
    await getAllUsers();
    await newUser();
    await removeUser();
    await updateUser();

})

function getDomain() {
    return "http://localhost:8080";
}

async function get(url = "") {
    const response = await fetch(getDomain() + url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
    });
    return response.json();
}

async function getAuthUser() {
    await get("/api/users/user")
        .then(data => {
            console.log(data);
            document.querySelector('#userTName').textContent = data.username;
            document.querySelector('#userRole').textContent = data.roles.map(ob => ob.role).join(' ');

            var userDataInfo = document.getElementById('userDataInfo');
            if (userDataInfo == null) {
                return;
            }
            while (userDataInfo.firstChild) {
                userDataInfo.removeChild(userDataInfo.firstChild);
            }

            var tr = document.createElement('tr');
            userDataInfo.append(tr);

            var id = document.createElement('td');
            tr.appendChild(id);
            id.textContent = data.id;

            var name = document.createElement('td');
            tr.appendChild(name);
            name.textContent = data.name;

            var username = document.createElement('td');
            tr.appendChild(username);
            username.textContent = data.username;

            var email = document.createElement('td');
            tr.appendChild(email);
            email.textContent = data.email;

            var roles = document.createElement('td');
            tr.appendChild(roles);
            roles.textContent = data.roles.map(ob => ob.role).join(' ');
        })
        .catch(error => console.log(error))
}

async function getAllUsers() {
    await get("/admin/all")
        .then(data => {
            console.log(data);

            var adminDataInfo = document.getElementById('adminDataInfo');
            if (adminDataInfo == null) {
                return;
            }
            while (adminDataInfo.firstChild) {
                adminDataInfo.removeChild(adminDataInfo.firstChild);
            }
            data.forEach((elem) => {
                var tr = document.createElement('tr');
                adminDataInfo.append(tr);

                var id = document.createElement('td');
                tr.appendChild(id);
                id.textContent = elem.id;

                 var name = document.createElement('td');
                 tr.appendChild(name);
                 name.textContent = elem.name;

                var username = document.createElement('td');
                tr.appendChild(username);
                username.textContent = elem.username;

                var email = document.createElement('td');
                tr.appendChild(email);
                email.textContent = elem.email;

                var roles = document.createElement('td');
                tr.appendChild(roles);
                roles.textContent = elem.roles.map(ob => ob.role).join(' ');

                var edit = document.createElement('td');
                tr.appendChild(edit);
                edit.innerHTML = '<button type="button" class="btn btn-info" data-bs-toggle="modal" data-id="' + elem.id + '" data-bs-target="#edit">Edit</button>'

                var del = document.createElement('td');
                tr.appendChild(del);
                del.innerHTML = '<button type="button" class="btn btn-danger" data-bs-toggle="modal" data-id="' + elem.id + '" data-bs-target="#delete">Delete</button>'
                del.onclick = function () {
                    console.log("showDeleteModal(elem.id);-" + id)
                    showDeleteModal(elem.id);
                };

            });
        })
        .catch(error => console.log(error))
}


async function newUser() {
    fetch("/admin/roles")
        .then(response => response.json())
        .then(roles => {
            roles.forEach(role => {
                let el = document.createElement("option")
                el.value = role.id
                el.text = role.role

                $('#rolesNew')[0].appendChild(el)
            })
        }).catch(error => console.log(error))


    const createForm = document.forms["createForm"]
    const createButton = document.querySelector('#createUserButton')
    createButton.addEventListener('click', (event) => {
        document.getElementById('home-tab').click();
    })

    createForm.addEventListener('submit', addNewUser)

    async function addNewUser(e) {
        e.preventDefault();
        let newUserRoles = [];
        for (let i = 0; i < createForm.role.options.length; i++) {
            if (createForm.role.options[i].selected) newUserRoles.push({
                id: createForm.role.options[i].value,
                roles: createForm.role.options[i].text
            })
        }

        fetch("/admin", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: createForm.name.value,
                username: createForm.username.value,
                password: createForm.password.value,
                email: createForm.email.value,
                roles: newUserRoles
            })
        }).then(() => {
            createForm.reset();

            $(async function () {
                await getAllUsers()
            })
        })
    }
}


$('#delete').on('show.bs.modal', ev => {
    let button = $(ev.relatedTarget);
    let id = button.data('id');
    console.log("showDeleteModal(elem.id);-" + id)
    showDeleteModal(id);
})

async function getUser(id) {
    let response = await fetch("/admin/" + id);
    return await response.json();
}

async function showDeleteModal(id) {
    let user = await getUser(id)
    const form = document.forms["deleteForm"];
    form.idDeleteUser.value = user.id;
    form.nameDeleteUser.value = user.name;
    form.usernameDeleteUser.value = user.username;
    form.emailDeleteUser.value = user.email;
    $('#rolesDeleteUser').empty();
    user.roles.forEach(role => {
        let el = document.createElement("option");
        el.text = role.role;
        el.value = role.id;
        $('#rolesDeleteUser')[0].appendChild(el);
    });

}

$('#deleteUserButton').click(() => {
    console.log("$('#deleteUserButton').click")
    removeUser()
})

async function removeUser() {
    const deleteForm = document.forms["deleteForm"]
    const id = deleteForm.idDeleteUser.value
    deleteForm.addEventListener("submit", ev => {
        ev.preventDefault()
        fetch("/admin/" + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            getAllUsers()
            $('#topCloseButtonDelete').click()
        }).catch(error => console.log(error))
    })
}


//Edit

$('#edit').on('show.bs.modal', (ev) => {
    let button = $(ev.relatedTarget)
    let id = button.data('id')
    console.log("$('#edit').on('show.bs.modal', (ev) => {---" + id)
    showEditModal(id)
})


async function showEditModal(id) {
    let user = await getUser(id)
    const form = document.forms["editForm"]
    form.idEditUser.value = user.id
    form.nameEditUser.value = user.name
    form.usernameEditUser.value = user.username
    form.passwordEditUser.value = user.password
    form.emailEditUser.value = user.email
    $('#rolesEditUser').empty()
    fetch("/admin/roles")
        .then(response => response.json())
        .then(roles => {
            roles.forEach(role => {
                let el = document.createElement("option")
                el.value = role.id
                el.text = role.role
                $('#rolesEditUser')[0].appendChild(el)
            })
        })
}

async function updateUser() {
    const editForm = document.forms["editForm"]
    editForm.addEventListener("submit", async (ev) => {
        const id = editForm.idEditUser.value
        ev.preventDefault()
        let editUserRoles = []
        for (let i = 0; i < editForm.rolesEditUser.options.length; i++) {
            if (editForm.rolesEditUser.options[i].selected) editUserRoles.push({
                id: editForm.rolesEditUser.options[i].value,
                role: editForm.rolesEditUser.options[i].text
            })
        }

        fetch("/admin", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                name: editForm.nameEditUser.value,
                username: editForm.usernameEditUser.value,
                password: editForm.passwordEditUser.value,
                email: editForm.emailEditUser.value,
                roles: editUserRoles
            }),
        })
            .then(() => {
                getAllUsers()
                $('#editFormCloseButton').click()
            })

    })
}

// Delete
