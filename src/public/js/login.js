///////////////////variables globales

///////////////////Referencias a HTML
const btnIngreso = document.getElementById('btn-ingreso');


///////////////////Funciones

//inicializar aplicacion
function inicializar() {
    document.getElementById('usuario').value = 'admin@datawarehouse.com';
    document.getElementById('password').value = 'ABC123456';
}

//inicio de sesion
async function iniciarSesion(usuario, password) {
    let data = {};
    let user = {};
    let token;
    let estado = 'error';
    data.email = usuario;
    data.password = password;

    console.log(data);
    const request = await fetch('http://localhost:3000/api/users/sign-in', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            //,'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZnVsbG5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicGhvbmUiOjM0NTY3ODksImFkZHJlc3MiOiJjYWxsZSAxMjMiLCJyb2xlIjoiYWRtaW4ifSwiaWF0IjoxNjQzNDE3NTYyLCJleHAiOjE2NDM1MDM5NjJ9.a8BXoa32XK6UTbnZ7y19cXj4QtfW51R7Hg8PFCK8ais';
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(response => {
            if (response.status == 'error' || response.status == 'fail') {
                throw new Error(response.message);
            }
            user.email = response.user.email;
            user.perfil = response.user.role;
            token = response.token;
            estado = response.status;
            console.log('response', response);
            console.log('user', user);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('key', token);
            //almacenar datos en localstorage
            //redirigir a contactos
            window.location.href = "contactos.html";
        })
        .catch(error => {

            console.error('Error:', error);
            alert('Error iniciando sesion: ' + error.message);
        });


    /*console.log('user', user);
    if (!user) {
        console.log('ingreso');
        return;
    }*/
}

///////////////////eventos
btnIngreso.addEventListener('click', e => {
    const usuario = document.getElementById('usuario');
    const password = document.getElementById('password');

    console.log('usuario', usuario.value);
    if (usuario.value == '' || password.value == '') {
        alert('Usuario o contraseña incorrecto');
        return 0;
    }

    //validar correo
    //registro

    iniciarSesion(usuario.value, password.value);

})

//inicializar();