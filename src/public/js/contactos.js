///////////////////variables globales
let token = localStorage.getItem("key");
let idContactoEdicion = null;
let canales = [];
let idCanal = 0;
let selContactos = [];
let desdePagina = 1;
let paginaActual = 1;
let totalPaginas = 0;
let contactosTotal = [];
let ordenamiento = 'name';

///////////////////Referencias a HTML
const tblContactos = document.getElementById('tbl-contactos');
const btnGuardarContacto = document.getElementById('btn-guardar-contacto');
const regionSelect = document.getElementById('region');
const paisAdd = document.getElementById('pais-add');
const usuarioInput = document.getElementById('usuario');
const btnCanal = document.getElementById('btn-canal');
const filasPg = document.getElementById('filas-pg');
const totalSel = document.getElementById('total-sel');
const btnBuscar = document.getElementById('btn-buscar');
const btnMostrarFiltros = document.getElementById('btn-mostrar-filtros');
const btnExportar = document.getElementById('btn-exportar');
const btnEliminar = document.getElementById('btn-eliminar');
const cantidadPagina = document.getElementById('cantidad-pagina');
const contenedorPaginacion = document.getElementById('contenedor-paginacion');

///////////////////Funciones

function crearCampoTitulo(campo, titulo) {
    let tituloCampo = document.createElement("th");
    let divCampo = document.createElement("div");
    divCampo.setAttribute("class", 'titulo orden-desc');
    divCampo.setAttribute("id", `btn-ord-${campo}`);
    divCampo.innerHTML = `<span>${formatoMayusculaInicial(titulo)}</span>
    <span  class="material-icons-outlined material-icons icono-ordenar">
        import_export
    </span>`;

    //console.log(divCampo.classList);

    tituloCampo.appendChild(divCampo);
    return tituloCampo;
}

function agregarEventoClick(campo, campoNombre) {
    const elemento = document.getElementById(`btn-ord-${campo}`);
    elemento.addEventListener('click', e => {
        console.log(`ordenar por ${campo}`);
        //console.log(elemento.classList);
        ordenamiento = campoNombre;
        if (elemento.classList.contains("orden-desc")) {
            console.log('ingresa a ordenar descendientemente');
            limpiarTblContactos();
            cargarContactos(ordenamiento, 'DESC', filasPg.value, desdePagina, '');

        } else {
            console.log('ingresa a ordenar ascendentemente');
            limpiarTblContactos();
            cargarContactos(ordenamiento, 'ASC', filasPg.value, desdePagina, '');
        }

        elemento.classList.toggle('orden-desc');
    });
}

function crearEncabezado() {
    let fila = document.createElement("tr");

    fila.appendChild(document.createElement("th"));
    fila.appendChild(crearCampoTitulo('contacto', 'contacto'));
    fila.appendChild(crearCampoTitulo('ciudad', 'ciudad'));
    fila.appendChild(crearCampoTitulo('compania', 'compañia'));
    fila.appendChild(crearCampoTitulo('cargo', 'cargo'));
    fila.appendChild(crearCampoTitulo('interes', 'interes'));

    fila.innerHTML += `<th>
    <div class="titulo">Acciones</div>
</th>`;

    tblContactos.appendChild(fila);

    agregarEventoClick('contacto', 'names');
    agregarEventoClick('ciudad', 'city');
    agregarEventoClick('compania', 'company');
    agregarEventoClick('cargo', 'position');
    agregarEventoClick('interes', 'interest');
}


//borra la informacion mostrada de contactos
function limpiarTblContactos() {
    regContacto = document.getElementsByClassName('reg-contacto');

    for (i = regContacto.length - 1; i >= 0; i--) {
        tblContactos.removeChild(regContacto[i]);
    }

}

function ocultarOpciones() {

    if (selContactos.length > 1) {
        btnExportar.style.display = 'inline';
        btnEliminar.style.display = 'inline';
    } else {
        btnExportar.style.display = 'none';
        btnEliminar.style.display = 'none';
    }
}

function editarSeleccion(idContacto, cmpCheck) {
    // console.log('seleccion antes', selContactos);

    if (cmpCheck.checked) {
        console.log('adicionar');
        selContactos.push(idContacto);
    } else {
        console.log('borrar');
        let i = selContactos.indexOf(idContacto);

        if (i !== -1) {
            selContactos.splice(i, 1);
        }
    }

    if (selContactos.length > 0) {
        totalSel.innerHTML = `(Seleccionados ${selContactos.length})`;

    } else {
        totalSel.innerHTML = '';
    }
    ocultarOpciones();


    //console.log('seleccion despues', selContactos);
}

//mostrar datos de contacto
function mostrarContactos(contacto) {

    let fila = document.createElement("tr");
    fila.setAttribute("class", 'reg-contacto');
    fila.setAttribute("id", `reg-${contacto._id}`);

    let cmpSeleccion = document.createElement("td");
    cmpSeleccion.innerHTML = `<input type="checkbox" id="sel-${contacto._id}" onchange="editarSeleccion('${contacto._id}', this)">`;
    fila.appendChild(cmpSeleccion);

    let cmpNombre = document.createElement("td");
    cmpNombre.innerHTML = `${formatoMayusculaInicial(contacto.names)} ${formatoMayusculaInicial(contacto.surnames)}`;
    fila.appendChild(cmpNombre);

    let cmpUbicacion = document.createElement("td");
    cmpUbicacion.innerHTML = contacto?.city?.name ? `${formatoMayusculaInicial(contacto.city.name)} (${formatoMayusculaInicial(contacto.city.country.name)})` : '';
    fila.appendChild(cmpUbicacion);

    let cmpCompania = document.createElement("td");
    cmpCompania.innerHTML = formatoMayusculaInicial(contacto.company.name);
    fila.appendChild(cmpCompania);

    let cmpCargo = document.createElement("td");
    cmpCargo.innerHTML = formatoMayusculaInicial(contacto.position);
    fila.appendChild(cmpCargo);


    let cmpInterest = document.createElement("td");
    cmpInterest.innerHTML = contacto?.interest ? `${contacto.interest}% <meter id="int" max="100" value="${contacto.interest}" low="25" high="75" optimum="100"> ${contacto.interest}
    </meter>` : '';
    fila.appendChild(cmpInterest);

    let cmpOpciones = document.createElement("td");
    cmpOpciones.innerHTML = `<a href="#contenedor-edicion" onclick="buscarContacto('${contacto._id}')">
    <span class="material-icons-outlined material-icons icono-accion">
    edit
    </span></a> <span class="material-icons-outlined material-icons icono-accion" onclick="eliminarContacto('${contacto._id}','${contacto.names} ${contacto.surnames}')">
    delete
    </span>`;
    fila.appendChild(cmpOpciones);

    tblContactos.appendChild(fila);
}

//Busca la informacion de un contacto
async function buscarContacto(id) {
    console.log('id ', id);

    let selects = await fetch(`http://localhost:3000/api/contacts/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            console.log(response);
            if (response.status == 'error' || response.status == 'fail') {
                throw new Error(response.message);
            }
            document.getElementById('titulo-modal').innerHTML = 'Editar Contacto';
            document.getElementById('nombre-add').value = formatoMayusculaInicial(response.doc.names);
            document.getElementById('apellidos-add').value = formatoMayusculaInicial(response.doc.surnames);;
            document.getElementById('email-add').value = formatoMayusculaInicial(response.doc.email);;
            document.getElementById('cargo-add').value = formatoMayusculaInicial(response.doc.position);;
            document.getElementById('direccion-add').value = response.doc?.address ? response.doc.address : '';
            document.getElementById('interes-add').value = response.doc?.interest ? response.doc.interest : '';
            document.getElementById('usuario').value = '';
            document.getElementById('datos-canal-tbl').innerHTML = `<tr>
    <th>
        Canal
    </th>
    <th>
        Cuenta
    </th>
    <th>
        Preferencia
    </th>
    <th>
    </th>
</tr>`;
            canales = response.doc?.chanels ? response.doc.chanels : [];

            idCanal = 0;

            for (let i of canales) {
                if (idCanal < i.id) {
                    idCanal = i.id;
                }
                mostrarCanal({
                    canal: i.canal,
                    cuentaUsuario: i.cuentaUsuario,
                    preferencia: i.preferencia
                });
            }


            document.getElementById('btn-canal').style.display = 'none';
            btnGuardarContacto.value = 'Guardar Cambios';
            idContactoEdicion = response.doc._id;


            document.getElementById('compania-add').disabled = true;
            document.getElementById('region').disabled = true;
            document.getElementById('pais-add').disabled = true;
            document.getElementById('ciudad-add').disabled = true;



            let datosDependientes = {};
            if (response.doc?.city) {
                datosDependientes.ciudad = response.doc.city._id;
                datosDependientes.pais = response.doc.city.country._id;
                datosDependientes.region = response.doc.city.country.region._id;
            } else {
                datosDependientes.ciudad = '';
                datosDependientes.pais = '';
                datosDependientes.region = '';
            }
            datosDependientes.compania = response.doc.company._id;

            return datosDependientes;


        })
        .catch(error => {

            console.error('Error buscando contacto:', error);

        });

    if (selects.region != '') {
        await cargarRegiones();
        console.log('region', selects.region);
        document.getElementById('region').value = selects.region;
        await cargarPaises(selects.region);
        console.log('pais', selects.pais);
        document.getElementById('pais-add').value = selects.pais;
        await cargarCiudades(selects.pais);
        console.log('ciudad', selects.ciudad);
        document.getElementById('ciudad-add').value = selects.ciudad;
    } else {
        cargarRegiones();
    }

    await cargarCompanias('compania-add');
    console.log('companias', selects.compania);
    document.getElementById('compania-add').value = selects.compania;

}

// Obtiene los contactos sin filtrar
async function cargarTotalContactos() {
    //   let usuarios = [];

    let usuarios = await fetch(`http://localhost:3000/api/contacts/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((response) => {
            if (response.status == 'error' || response.status == 'fail') {
                throw new Error(response.message);
            }
            return response.doc
        })
        .catch((error) => {
            console.error('Error calculando total:', error);
        });

    return usuarios;
}

async function calcularTotalPagina() {
    contactosTotal = await cargarTotalContactos();

    if (contactosTotal.length < filasPg.value) {
        totalPaginas = 1;
    } else {
        totalPaginas =
            Math.trunc(contactosTotal.length / filasPg.value) +
            (contactosTotal.length % filasPg.value > 0 ? 1 : 0);
    }

    return totalPaginas;
}

//obtiene todos los usuarios de la base de datos
async function cargarContactos(cmpOrden, tipoOrden, limite, desde, filtro) {
    let contactos = [];
    let url;

    if (tipoOrden == 'DESC') {
        tipoOrden = '-';
    } else {
        tipoOrden = '';
    }


    url = filtro != '' ? `http://localhost:3000/api/contacts/?${filtro}&limit=${limite}&sort=${tipoOrden}${cmpOrden}` :
        `http://localhost:3000/api/contacts/?page=${desde}&limit=${limite}&sort=${tipoOrden}${cmpOrden}`;


    await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            if (response.status == 'error' || response.status == 'fail') {
                throw new Error(response.message);
            }
            contactos = response.doc;
            limpiarTblContactos();
            contactos.forEach(contacto => {
                mostrarContactos(contacto);
            });

        })
        .catch(error => {

            console.error('Error obteniendo contactos:', error);

        });
    if (filtro == '') {

        totalPaginas = await calcularTotalPagina();
        contenedorPaginacion.style.display = 'flex';
        cantidadPagina.innerHTML = `Pag ${desdePagina} de ${totalPaginas} (Total contactos ${contactosTotal.length})`;
    } else {
        contenedorPaginacion.style.display = 'none';
        cantidadPagina.innerHTML = '';
    }

}

//limpia los datos del select
function reiniciarSelect(select) {
    cmpSelect = document.getElementById(select);

    for (let i = cmpSelect.options.length; i >= 0; i--) {
        cmpSelect.remove(i);
    }
}

async function cargarCompanias(selectCmp) {

    await fetch(`http://localhost:3000/api/companies/?sort=name`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            if (response.status == 'error' || response.status == 'fail') {
                throw new Error(response.message);
            }
            //reiniciarSelect('compania-add');
            reiniciarSelect(selectCmp);
            cmpSelect = document.getElementById(selectCmp);
            if (selectCmp == 'compania-busq') {
                var option = document.createElement("option");
                option.text = formatoMayusculaInicial('Todas');
                option.value = 'Todas'
                cmpSelect.add(option);
            } else {
                if (response.doc.length > 0) {
                    cmpSelect.disabled = false;
                } else {
                    cmpSelect.disabled = true;
                }
            }
            response.doc.forEach(compania => {
                var option = document.createElement("option");
                option.text = formatoMayusculaInicial(compania.name);
                option.value = compania._id
                cmpSelect.add(option);
            });

        })
        .catch(error => {

            console.error('Error consultando compañías:', error);

        });

}

//Carga el select de las ciudades
async function cargarCiudades(paisId) {
    await fetch(`http://localhost:3000/api/cities/?sort=name&country=${paisId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            if (response.status == 'error' || response.status == 'fail') {
                throw new Error(response.message);
            }
            reiniciarSelect('ciudad-add');
            cmpSelect = document.getElementById('ciudad-add');
            response.doc.forEach(ciudad => {
                var option = document.createElement("option");
                option.text = formatoMayusculaInicial(ciudad.name);
                option.value = ciudad._id
                cmpSelect.add(option);
            });
            if (response.doc.length > 0) {
                cmpSelect.disabled = false;
            } else {
                cmpSelect.disabled = true;
            }
        })
        .catch(error => {

            console.error('Error:', error);

        });
}

//Carga el select de los paises
async function cargarPaises(region) {
    let paises = await fetch(`http://localhost:3000/api/countries/?sort=name&region=${region}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            //console.log(response.doc);
            if (response.status == 'error' || response.status == 'fail') {
                throw new Error(response.message);
            }
            reiniciarSelect('pais-add');
            cmpSelect = document.getElementById('pais-add');
            response.doc.forEach(pais => {
                var option = document.createElement("option");
                option.text = formatoMayusculaInicial(pais.name);
                option.value = pais._id
                cmpSelect.add(option);
            });
            if (response.doc.length > 0) {
                cmpSelect.disabled = false;
                return cmpSelect.value;
            } else {
                cmpSelect.disabled = true;
                return '';
            }

        })
        .catch(error => {

            console.error('Error:', error);

        });

    if (paises != '') {
        await cargarCiudades(paises);
    } else {
        reiniciarSelect('ciudad-add');
    }

}



//Carga el select de los paises
async function cargarRegiones() {
    let regiones = await fetch(`http://localhost:3000/api/regions/?sort=name`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            //console.log(response.doc);
            if (response.status == 'error' || response.status == 'fail') {
                throw new Error(response.message);
            }
            reiniciarSelect('region');
            cmpSelect = document.getElementById('region');
            response.doc.forEach(region => {
                var option = document.createElement("option");
                option.text = formatoMayusculaInicial(region.name);
                option.value = region._id
                cmpSelect.add(option);
            });
            if (response.doc.length > 0) {
                cmpSelect.disabled = false;
                return cmpSelect.value;
            } else {
                cmpSelect.disabled = true;
                return '';
            }

        })
        .catch(error => {

            console.error('Error:', error);

        });

    if (regiones != '') {
        await cargarPaises(regiones);
    } else {
        reiniciarSelect('pais-add');
    }
}

//reinicia campos de formulario para adicionar compañia
function mostrarFormAgregar() {
    document.getElementById('titulo-modal').innerHTML = 'Adicionar Contacto';
    document.getElementById('nombre-add').value = '';
    document.getElementById('apellidos-add').value = '';
    document.getElementById('email-add').value = '';
    document.getElementById('cargo-add').value = '';
    document.getElementById('direccion-add').value = '';
    document.getElementById('interes-add').value = '';
    document.getElementById('usuario').value = '';
    document.getElementById('datos-canal-tbl').innerHTML = `<tr>
    <th>
        Canal
    </th>
    <th>
        Cuenta
    </th>
    <th>
        Preferencia
    </th>
    <th>
    </th>
</tr>`;
    canales = [];
    idCanal = 0;
    document.getElementById('btn-canal').style.display = 'none';
    btnGuardarContacto.value = 'Guardar Contacto';
    idContactoEdicion = null;
    document.getElementById('compania-add').disabled = true;
    document.getElementById('region').disabled = true;
    document.getElementById('pais-add').disabled = true;
    document.getElementById('ciudad-add').disabled = true;
    cargarCompanias('compania-add');
    cargarRegiones();
}

function borrarCanal(idCanal) {
    console.log('idCanal ', idCanal);
    const datosCanalTbl = document.getElementById('datos-canal-tbl');

    filaCanal = document.getElementById(`canal-${idCanal}`);

    console.log(filaCanal);
    datosCanalTbl.removeChild(filaCanal);

    canales.forEach(function (canal, index, object) {
        if (canal.id == idCanal) {
            object.splice(index, 1);
            alert('borra');
        }
    });

    console.log('canales ', canales);
    //console.log(btnBorrar.closest('tr'));
}

function mostrarCanal(canal) {

    let canalTbl = document.getElementById('datos-canal-tbl');
    let fila = document.createElement("tr");
    //fila.setAttribute("class", 'reg-contacto');
    fila.setAttribute("id", `canal-${canal.id}`);
    console.log('canal ', canal);
    let cmpNombreCanal = document.createElement("td");
    cmpNombreCanal.innerHTML = formatoMayusculaInicial(canal.canal);
    fila.appendChild(cmpNombreCanal);

    let cmpCuentaUsuario = document.createElement("td");
    cmpCuentaUsuario.innerHTML = canal.cuentaUsuario
    fila.appendChild(cmpCuentaUsuario);

    let cmpPreferencia = document.createElement("td");
    cmpPreferencia.innerHTML = canal.preferencia;
    fila.appendChild(cmpPreferencia);

    let cmpBorrarCanal = document.createElement("td");
    cmpBorrarCanal.innerHTML = `<span class="material-icons-outlined material-icons icono-accion" onclick="borrarCanal(${canal.id})">
    delete
    </span>`;
    fila.appendChild(cmpBorrarCanal);

    canalTbl.appendChild(fila);
}

function validarContacto(contacto) {
    let camposValidos = false;

    if (contacto.names == '') {
        alert('Nombre incorrecto');
    } else if (contacto.surnames == '') {
        alert('Apellidos incorrectos');
    } else if (contacto.email == '') {
        alert('email incorrecto');
    } else if (contacto.position == '') {
        alert('Cargo incorrecto');
    } else if (contacto.company == '') {
        alert('Compañía incorrecta');
    } else {
        camposValidos = true;
    }

    return camposValidos;
}

function guardarContacto(contacto) {

    //console.log('contacto: ', contacto);
    fetch('http://localhost:3000/api/contacts/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contacto)
    }).then(response => response.json())
        .then(response => {
            if (response.status == 'error' || response.status == 'fail') {
                throw new Error(response.message);
            }
            console.log('Contacto guardado correctamente');
            alert('Contacto guardado correctamente');
            limpiarTblContactos();
            cargarContactos(ordenamiento, 'ASC', filasPg.value, desdePagina, '');

        })
        .catch(error => {

            console.error('Error:', error);
            alert('Error guardando contacto: ' + error.message);
        });
}

function guardarCambiosContacto(contacto) {
    //console.log('contacto: ', contacto);
    fetch(`http://localhost:3000/api/contacts/${idContactoEdicion}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contacto)
    }).then(response => response.json())
        .then(response => {
            if (response.status == 'error' || response.status == 'fail') {
                throw new Error(response.message);
            }
            console.log('Cambios guardados correctamente');
            alert('Cambios guardados correctamente');
            limpiarTblContactos();
            cargarContactos(ordenamiento, 'ASC', filasPg.value, desdePagina, '');

        })
        .catch(error => {

            console.error('Error:', error);
            alert('Error guardando cambios: ' + error.message);
        });
}

function borrarContactoTbl(id) {
    contacto = document.getElementById(`reg-${id}`);

    tblContactos.removeChild(contacto);
}

async function eliminarContacto(id, nombre) {
    if (confirm(`Desea elminar del sistema al contacto ${formatoMayusculaInicial(nombre)}?`)) {

        console.log('se elimina contacto');

        await fetch(`http://localhost:3000/api/contacts/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.status == 'error' || response.status == 'fail') {
                    throw new Error(response.message);
                }
                borrarContactoTbl(id);

                let i = selContactos.indexOf(id);

                if (i !== -1) {
                    selContactos.splice(i, 1);
                }


                if (selContactos.length > 0) {
                    totalSel.innerHTML = `(Seleccionados ${selContactos.length})`
                } else {
                    totalSel.innerHTML = '';
                }
                ocultarOpciones();
            })
            .catch(error => {
                alert('Error eliminando contacto: ' + error.message);
                console.error('Error eliminando contacto:', error);

            });
    }
}

async function eliminarContactos() {

    for (let contacto of selContactos) {

        fetch(`http://localhost:3000/api/contacts/${contacto}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.status == 'error' || response.status == 'fail') {
                    throw new Error(response.message);
                }
                borrarContactoTbl(contacto);

                let i = selContactos.indexOf(contacto);

                if (i !== -1) {
                    selContactos.splice(i, 1);
                }


                if (selContactos.length > 0) {
                    totalSel.innerHTML = `(Seleccionados ${selContactos.length})`
                } else {
                    totalSel.innerHTML = '';
                }
                ocultarOpciones();
            })
            .catch(error => {
                alert('Error eliminando contactos: ' + error.message);
                console.error('Error eliminando contacto:', error);

            });
    }
}

//Carga el select de las ciudades para la busqueda
async function cargarCiudadesFiltro() {
    await fetch(`http://localhost:3000/api/cities/?sort=country`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            if (response.status == 'error' || response.status == 'fail') {
                throw new Error(response.message);
            }
            reiniciarSelect('pais-busq');
            cmpSelect = document.getElementById('pais-busq');
            var option = document.createElement("option");
            option.text = formatoMayusculaInicial('todos');
            option.value = 'Todos'
            cmpSelect.add(option);
            response.doc.forEach(ciudad => {
                var option = document.createElement("option");
                option.text = `${formatoMayusculaInicial(ciudad.country.name)} / ${formatoMayusculaInicial(ciudad.name)}`;
                option.value = ciudad._id
                cmpSelect.add(option);
            });
        })
        .catch(error => {

            console.error('Error obteniendo ciudades:', error);

        });
}

async function obtenerDatosExportar() {

    let contactosExp = '';

    contactosExp = `<tr>
        <th>Nombre</th>
        <th>Ubicacion</th>
        <th>Compañia</th>
        <th>Cargo</th>
        <th>Email</th>
        <th>Direccion</th>
    </tr>`;

    for (let contacto of selContactos) {

        let contactoTr = await fetch(`http://localhost:3000/api/contacts/${contacto}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
            .then(response => {
                if (response.status == 'error' || response.status == 'fail') {
                    throw new Error(response.message);
                }

                let contactoFila = '<tr>';

                //console.log('ciudades ', response.doc);
                if (response.doc.length == 0) {
                    contactoFila = '';
                } else {
                    let ciudad = response.doc?.city ? `${formatoMayusculaInicial(response.doc.city.country.name)} / ${formatoMayusculaInicial(response.doc.city.name)}` : '';
                    contactoFila += `<td>${formatoMayusculaInicial(response.doc.names)}</td>
                    <td>${ciudad}</td>
                    <td>${formatoMayusculaInicial(response.doc.company.name)}</td>
                    <td>${formatoMayusculaInicial(response.doc.position)}</td>
                    <td>${response.doc.email}</td>
                    <td>${response.doc.address}</td></tr>`
                }

                return contactoFila;
            })
            .catch(error => {

                console.error('Error:', error);
                //alert('Error cargando paises');
            });

        contactosExp += contactoTr;
    }

    return contactosExp;
}

//Exportar datos de los contactos seleccionados
async function exportarContactos() {
    let datosExport = await obtenerDatosExportar();

    let linkDescarga;
    let tipoDatos = 'application/vnd.ms-excel';
    let tablaDatos = document.createElement("table");
    tablaDatos.innerHTML = datosExport;
    let tablaHTML = tablaDatos.outerHTML.replace(/ /g, '%20');

    // Nombre del archivo
    nombreArchivo = 'contactosSeleccionados.xls';

    // Crear el link de descarga
    linkDescarga = document.createElement("a");

    document.body.appendChild(linkDescarga);

    if (navigator.msSaveOrOpenBlob) {
        let blob = new Blob(['\ufeff', tablaHTML], {
            type: tipoDatos
        });
        navigator.msSaveOrOpenBlob(blob, nombreArchivo);
    } else {
        // Crear el link al archivo
        linkDescarga.href = 'data:' + tipoDatos + ', ' + tablaHTML;

        // Setear el nombre de archivo
        linkDescarga.download = nombreArchivo;

        //Ejecutar la función
        linkDescarga.click();
    }
}

async function cambiarPagina(valor) {
    totalPaginas = await calcularTotalPagina();

    console.log('totalPaginas+', totalPaginas, 'filasPg.value', filasPg.value);

    desdePagina += valor;
    paginaActual += valor;

    if (desdePagina <= 0) {
        desdePagina = 1;
    } else if (desdePagina > totalPaginas) {
        desdePagina -= valor;
    }

    console.log('desdePagina', desdePagina);


    cargarContactos(ordenamiento, 'ASC', filasPg.value, desdePagina, '');
}

///////////////////eventos

regionSelect.addEventListener('change', e => {
    cargarPaises(regionSelect.value);
});

paisAdd.addEventListener('change', e => {
    cargarCiudades(paisAdd.value);
});

usuarioInput.addEventListener('keyup', e => {
    if (usuarioInput.value.length > 0) {
        btnCanal.style.display = 'block';
    } else {
        btnCanal.style.display = 'none';
    }

})

btnCanal.addEventListener('click', e => {
    idCanal++;
    canal = {
        id: idCanal,
        canal: document.getElementById('canal-add').value,
        cuentaUsuario: document.getElementById('usuario').value,
        preferencia: document.getElementById('preferencia').value
    };

    canales.push(canal);

    mostrarCanal(canal);
    document.getElementById('usuario').value = '';
    btnCanal.style.display = 'none';
})

btnGuardarContacto.addEventListener('click', e => {
    let contacto = {};

    contacto.names = document.getElementById('nombre-add').value;
    contacto.surnames = document.getElementById('apellidos-add').value;
    contacto.email = document.getElementById('email-add').value;
    contacto.position = document.getElementById('cargo-add').value;
    contacto.address = document.getElementById('direccion-add').value;
    contacto.interest = document.getElementById('interes-add').value;
    contacto.company = document.getElementById('compania-add').value;

    if (document.getElementById('ciudad-add').value != '') {
        contacto.city = document.getElementById('ciudad-add').value;
    }

    contacto.chanels = canales;

    if (btnGuardarContacto.value == 'Guardar Contacto') {
        if (validarContacto(contacto)) {
            guardarContacto(contacto);
        }
    } else {
        if (validarContacto(contacto)) {
            guardarCambiosContacto(contacto);
        }
    }
});

filasPg.addEventListener('change', e => {
    limpiarTblContactos();
    desdePagina = 1;
    cargarContactos(ordenamiento, 'ASC', filasPg.value, desdePagina, '');
});

btnBuscar.addEventListener('click', e => {
    let filtros = '';
    const nombreBusq = document.getElementById('nombre-busq').value;
    const cargoBusq = document.getElementById('cargo-busq').value;
    const ciudadBusq = document.getElementById('pais-busq').value;
    const companiaBusq = document.getElementById('compania-busq').value;
    const interesBusq = document.getElementById('interes-busq').value;
    const filtrosBusqueda = document.getElementById('filtros-busqueda');

    if (nombreBusq != '') {

        filtros = `names=${nombreBusq}`;
    }

    if (cargoBusq != '') {

        filtros += filtros == '' ? `position=${cargoBusq}` : `&position=${cargoBusq}`;
    }

    if (ciudadBusq != 'Todos') {

        filtros += filtros == '' ? `city=${ciudadBusq}` : `&city=${ciudadBusq}`;

    }

    if (companiaBusq != 'Todas') {
        filtros += filtros == '' ? `company=${companiaBusq}` : `&company=${companiaBusq}`;
    }

    if (interesBusq != 'Todos') {

        filtros += filtros == '' ? `interest=${interesBusq}` : `&interest=${interesBusq}`;

    }
    //console.log('filtros', filtros);
    //cargarContactos(filtros, 'ASC', filasPg.value);
    desdePagina = 1;
    cargarContactos(ordenamiento, 'ASC', filasPg.value, desdePagina, filtros);

    filtrosBusqueda.style.display = 'none';
    contenedorPaginacion.style.display = 'none';
    cantidadPagina.innerHTML = '';
});

btnMostrarFiltros.addEventListener('click', e => {
    const filtrosBusqueda = document.getElementById('filtros-busqueda');

    if (filtrosBusqueda.style.display == 'grid') {
        filtrosBusqueda.style.display = 'none';
    } else {
        filtrosBusqueda.style.display = 'grid';
    }

    cargarCiudadesFiltro();
    cargarCompanias('compania-busq');
});

btnExportar.addEventListener('click', e => {
    if (selContactos.length == 0) {
        alert('Por favor seleccione los contactos a exportar');
        return null;
    }

    exportarContactos();
})

btnEliminar.addEventListener('click', e => {

    if (selContactos.length < 2) {
        alert('Por favor seleccione los contactos a eliminar');
        return null;
    }

    if (confirm(`Realmente desea eliminar ${selContactos.length} contactos?`)) {
        eliminarContactos();
    }


})


crearEncabezado();
cargarContactos(ordenamiento, 'ASC', filasPg.value, desdePagina, '');
ocultarOpciones();