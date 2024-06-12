
$(document).ready(function() {
    fillUserTable();
});

async function addUser() {
    let roleToBody = creatRoleToBody('#roleAdd');

    let jsonVar = {
        name: document.getElementById("nameAdd").value,
        username: document.getElementById("usernameAdd").value,
        email: document.getElementById("emailAdd").value,
        password: document.getElementById("passwordAdd").value,
        roles: roleToBody
    };

    const response = await fetch('/api/add', {
        method: 'POST',
        body: JSON.stringify(jsonVar),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    document.getElementById('table-tab').click();
    $("#usersTable > tbody").empty();
    await fillUserTable();
}

function editUser(o) {
    document.getElementById('editUserForm').reset();
    const id = $(o).closest('tr').find('td').eq(0).text();
    const url = '/api/user/' + id;
    fetch(url).then((response) => {
        response.json().then((data) => {
            $('#idEdit').val(data.id);
            $('#nameEdit').val(data.name)
            $('#usernameEdit').val(data.username)
            $('#emailEdit').val(data.email);
            const roles = data.roles;
            roles.forEach(function(item) {
                $('#editFormControlSelect option[value=' + item.role + ']').prop('selected', true);
            })
        });
    });
}
function creatRoleToBody($formId) {
    const newRoles = $($formId).val().toString();
    let rolesArray = newRoles.split(',');
    let roleToBody = [];
    console.log(rolesArray.toString())
    for (let i = 0; i < rolesArray.length; i++) {
        let myObj = { role: rolesArray[i].toString() };
        roleToBody[i] = myObj;
    }
    return roleToBody;
}

async function updateUser() {
    let roleToBody = creatRoleToBody('#editFormControlSelect');

    const jsonVar = {
        id: document.getElementById("idEdit").value,
        name: document.getElementById("nameEdit").value,
        username: document.getElementById("usernameEdit").value,
        email: document.getElementById("emailEdit").value,
        password: document.getElementById("passwordEdit").value,
        roles: roleToBody
    };
    const response = await fetch('/api/edit', {
        method: 'POST',
        body: JSON.stringify(jsonVar),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    await printUsers();
    $("#usersTable > tbody").empty();
}

function getUser() {
    $("#userCurrentInfo > tbody").empty();
    const id = document.getElementById("userCurrentId").value;
    const url = '/api/user/' + id
    fetch(url).then((response) => {
        response.json().then((data) => {
            let roles = data.roles;
            let allRoles = '';
            let count = 0;
            let separator = ', ';
            roles.forEach(function(item) {
                if (count > 0) {
                    allRoles += separator + item.role;
                } else {
                    allRoles += item.role;
                }
                count++;
            })
            let html = `<tr>
                <td>${data.id}</td>
                <td>${data.name}</td>
                <td>${data.username}</td>
                <td>${data.email}</td>
                <td>${allRoles}</td>
            </tr>`;
            $('#userCurrentInfo').append(html);
        })
    })
}

function deleteRow(o) {
    userId = $(o).closest('tr').find('td').eq(0).text();
    document.getElementById('deleteUserForm').reset();
    const url = '/api/user/' + userId;
    fetch(url).then((response) => {
        response.json().then((data) => {
            console.log(data)
            $('#idDelete').val(data.id);
            $('#nameDelete').val(data.name);
            $('#usernameDelete').val(data.username);
            $('#emailDelete').val(data.email);
            const roles = data.roles;
            roles.forEach(function(item) {
                $('#deleteUserForm option[value=' + item.role + ']').prop('selected', true);
            })
        });
    });
}

function deleteUser() {
    const url = '/api/delete/' + userId;
    console.log('url=' + url)
    fetch(url, {
        method: 'GET',
    }).then(res => res.text()).then(res => console.log(res))
    const table = document.getElementById("usersTable");
    const selector = "tr[id='" + userId + "']";
    let row = table.querySelector(selector);
    row.parentElement.removeChild(row);
}

function cleanForm() {
    document.getElementById('newUserForm').reset();
}

async function fillUserTable() {
    const response = await fetch('/api/list').then((response) => {
        response.json().then((data) => {
            data.forEach(function(i) {
                let roles = i.roles;
                let allRoles = '';
                let count = 0;
                let separator = ', ';
                roles.forEach(function(item) {
                    if (count > 0) {
                        allRoles += separator + item.role;
                    } else {
                        allRoles += item.role;
                    }
                    count++;
                })
                let html = `<tr id= ${i.id} > 
                <td>${i.id}</td>
                <td>${i.name}</td>
                <td>${i.username}</td>
                <td>${i.email}</td>
                <td>${allRoles}</td>
                <td>
                    <button type='button' class='btn btn-outline-primary' data-toggle='modal' data-target='#editUserModal' onclick='editUser(this)'>
                        <svg width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-pencil' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                            <path fill-rule='evenodd' d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z'/>
                        </svg>
                    </button>
                </td>
                <td>
                    <button type='button' class='btn btn-outline-danger' data-toggle='modal' data-target='#deleteUserModal' onclick='deleteRow(this)'>
                        <svg width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-trash' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/>
                            <path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/>
                        </svg>
                    </button>
                </td>
            </tr>`;

                $('#usersTable').append(html);
            });
        });
    });
}
let userId;