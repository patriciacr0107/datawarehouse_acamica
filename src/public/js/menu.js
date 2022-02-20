//valida el perfil del usuario y muestra el menu correspondiente
function cargarMenu() {
    let usuario = JSON.parse(localStorage.getItem("user"));
    //let token = localStorage.getItem("key");
    mnuUsuarios = document.getElementById('mnu-usuarios');


    console.log('usuario', usuario);

    if (usuario.perfil != 'admin') {
        mnuUsuarios.style.display = 'none';
    }

}

function formatoMayusculaInicial(frase) {
    if (typeof frase != 'string') {
        throw TypeError('El argumento debe ser una cadena de caracteres (texto).');
    }

    let palabras = frase.split(' ');

    return palabras.map(p => p[0].toUpperCase() + p.slice(1)).join(' ');
}

cargarMenu();