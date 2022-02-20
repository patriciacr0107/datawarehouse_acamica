///////////////////variables globales
let token = localStorage.getItem('key');
let idCompaniaEdicion = '';
let desdePagina = 1;
let paginaActual = 1;
let totalPaginas = 0;
let companiasTotal = [];
let ordenamiento = 'name';

///////////////////Referencias a HTML
tblCompanias = document.getElementById('tbl-companias');
btnGuardarCompania = document.getElementById('btn-guardar-compania');
selectPais = document.getElementById('pais');
btnBuscar = document.getElementById('btn-buscar');
filasPg = document.getElementById('filas-pg');
txtBuscar = document.getElementById('txt-buscar');
cantidadPagina = document.getElementById('cantidad-pagina');
contenedorPaginacion = document.getElementById('contenedor-paginacion');
//////////////////funciones

async function buscarUbicacion(idCiudad) {
  let ubicacion = {};

  let ciudad = await fetch(`http://localhost:3000/api/cities/${idCiudad}`, {
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

      return response.doc;
    })
    .catch((error) => {
      console.error('Error obteniendo ciudad:', error);
    });

  let pais = await fetch(
    `http://localhost:3000/api/countries/${ciudad.country}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((response) => {
      if (response.status == 'error' || response.status == 'fail') {
        throw new Error(response.message);
      }
      return response.doc;
    })
    .catch((error) => {
      console.error('Error obteniendo ciudad:', error);
    });

  ubicacion = {
    ciudadId: idCiudad,
    ciudadNombre: ciudad.name,
    paisId: pais._id,
    paisNombre: pais.name,
  };

  return ubicacion;
}

//Muestra los datos de las compañias
async function mostrarCompania(compania) {
  let fila = document.createElement('tr');
  fila.setAttribute('class', 'reg-compania');
  fila.setAttribute('id', `reg-${compania._id}`);

  let cmpNombre = document.createElement('td');
  cmpNombre.innerHTML = formatoMayusculaInicial(compania.name);
  //compania.name.charAt(0).toUpperCase() + compania.name.slice(1);
  fila.appendChild(cmpNombre);

  console.log('ciudad', compania.city.name);
  //let ubicacion = await buscarUbicacion(compania.city);

  let cmpUbicacion = document.createElement('td');
  cmpUbicacion.innerHTML = `${formatoMayusculaInicial(
    compania.city.name
  )} (${formatoMayusculaInicial(compania.city.country.name)})`;
  fila.appendChild(cmpUbicacion);

  let cmpEmail = document.createElement('td');
  cmpEmail.innerHTML = compania.email;
  fila.appendChild(cmpEmail);

  let cmpTel = document.createElement('td');
  cmpTel.innerHTML = `${compania.phone}`;
  fila.appendChild(cmpTel);

  let cmpDireccion = document.createElement('td');
  cmpDireccion.innerHTML = compania.address;
  fila.appendChild(cmpDireccion);

  let cmpOpciones = document.createElement('td');
  cmpOpciones.innerHTML = `<a href="#contenedor-edicion" onclick="buscarCompania('${compania._id}')">
    <span class="material-icons-outlined material-icons icono-accion">
    edit
    </span></a> <span class="material-icons-outlined material-icons icono-accion" onclick="eliminarCompania('${compania._id}','${compania.name}')">
    delete
    </span>`;
  fila.appendChild(cmpOpciones);

  tblCompanias.appendChild(fila);
}

//Cargar los datos de compañias al ingresar
async function cargarCompanias(limite, tipoOrden, campoOrden, desde) {
  let companias = [];

  if (tipoOrden == 'DESC') {
    tipoOrden = '-';
  } else {
    tipoOrden = '';
  }

  await fetch(
    `http://localhost:3000/api/companies/?page=${desde}&limit=${limite}&sort=${tipoOrden}${campoOrden}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((response) => {
      //console.log(response.doc);
      if (response.status == 'error' || response.status == 'fail') {
        throw new Error(response.message);
      }
      companias = response.doc;
      limpiarTblCompanias();
      companias.forEach((compania) => {
        mostrarCompania(compania);
      });
    })
    .catch((error) => {
      console.error('Error cargando compañias:', error);
    });

  totalPaginas = await calcularTotalPagina();
  contenedorPaginacion.style.display = 'flex';
  cantidadPagina.innerHTML = `Pag ${desdePagina} de ${totalPaginas} (Total compañías ${companiasTotal.length})`;
}

//borra la informacion de la tabla en pantalla
function limpiarTblCompanias() {
  regCompania = document.getElementsByClassName('reg-compania');

  for (i = regCompania.length - 1; i >= 0; i--) {
    tblCompanias.removeChild(regCompania[i]);
  }
}

//limpia los datos del select
function reiniciarSelect(select) {
  cmpSelect = document.getElementById(select);

  for (let i = cmpSelect.options.length; i >= 0; i--) {
    cmpSelect.remove(i);
  }
}

//Carga el select de las ciudades
async function cargarCiudades(paisId) {
  await fetch(`http://localhost:3000/api/cities/?sort=name&country=${paisId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      //console.log(response.doc);
      if (response.status == 'error' || response.status == 'fail') {
        throw new Error(response.message);
      }
      reiniciarSelect('ciudad');
      cmpSelect = document.getElementById('ciudad');
      response.doc.forEach((ciudad) => {
        var option = document.createElement('option');
        option.text = formatoMayusculaInicial(ciudad.name);
        //ciudad.name.charAt(0).toUpperCase() + ciudad.name.slice(1);
        option.value = ciudad._id;
        cmpSelect.add(option);
      });
      if (response.doc.length > 0) {
        cmpSelect.disabled = false;
      } else {
        cmpSelect.disabled = true;
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

//Carga el select de los paises
async function cargaPaises() {
  let paises = await fetch(`http://localhost:3000/api/countries/?sort=name`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      //console.log(response.doc);
      if (response.status == 'error' || response.status == 'fail') {
        throw new Error(response.message);
      }
      reiniciarSelect('pais');
      cmpSelect = document.getElementById('pais');
      response.doc.forEach((pais) => {
        var option = document.createElement('option');
        option.text = formatoMayusculaInicial(pais.name);
        //option.text = pais.name.charAt(0).toUpperCase() + pais.name.slice(1);
        option.value = pais._id;
        cmpSelect.add(option);
      });
      cmpSelect.disabled = false;
      return cmpSelect.value;
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  await cargarCiudades(paises);
}

//reinicia campos de formulario para adicionar compañia
function mostrarFormAgregar() {
  document.getElementById('titulo-modal').innerHTML = 'Adicionar Compañia';
  document.getElementById('nombre').value = '';
  document.getElementById('direccion').value = '';
  document.getElementById('email').value = '';
  document.getElementById('telefono').value = '';
  btnGuardarCompania.value = 'Guardar Compañía';
  idCompaniaEdicion = null;
  document.getElementById('pais').disabled = true;
  document.getElementById('ciudad').disabled = true;
  cargaPaises();
}

//valida que se ingresen todos los datos obligatorios de la compañia
function validarCompania(compania) {
  let camposValidos = false;

  if (compania.name == '') {
    alert('Nombre incorrecto');
  } else if (compania.email == '') {
    alert('Email incorrecto');
  } else if (compania.phone == '') {
    alert('Telefono incorrecto');
  } else if (compania.address == '') {
    alert('Dirección incorrecta');
  } else if (compania.city == '') {
    alert('Ciudad incorrecta');
  } else {
    camposValidos = true;
  }

  return camposValidos;
}

//guarda una nueva compañia
async function guardarCompania(compania) {
  console.log('compania', compania);

  await fetch('http://localhost:3000/api/companies/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(compania),
  })
    .then((response) => response.json())
    .then((response) => {
      //console.log('sin error: ', response);
      if (response.status == 'error' || response.status == 'fail') {
        throw new Error(response.message);
      }
      console.log('Compañía guardada correctamente');
      alert('Compañía guardada correctamente');
      limpiarTblCompanias();
      cargarCompanias(filasPg.value, 'ASC', ordenamiento, desdePagina);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error guardando compañía: ' + error.message);
    });
}

//borra un registro de la tabla
function borrarCompaniaTbl(id) {
  compania = document.getElementById(`reg-${id}`);

  tblCompanias.removeChild(compania);
}

//borra una compañia de la base de datos
async function eliminarCompania(id, nombre) {
  if (
    confirm(
      `Desea elminar del sistema la compañía ${formatoMayusculaInicial(
        nombre
      )}?`
    )
  ) {
    if (await validarContactos(id)) {
      await fetch(`http://localhost:3000/api/companies/${id}`, {
        method: 'DELETE',
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
          borrarCompaniaTbl(id);
          console.log('Compañía borrada correctamente');
        })
        .catch((error) => {
          alert('Error eliminando compañía: ' + error.message);
          console.error('Error eliminando compañía:', error);
        });
    } else {
      alert('No se puede eliminar la compañía pues tiene contactos asociados');
    }
  }
}

//guarda los cambios realizados a una compañia
async function guardarCambiosCompania(compania) {
  console.log('compania', compania);
  await fetch(`http://localhost:3000/api/companies/${idCompaniaEdicion}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(compania),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status == 'error' || response.status == 'fail') {
        throw new Error(response.message);
      }
      console.log('Compañía guardada correctamente');
      alert('Compañía guardada correctamente');
      limpiarTblCompanias();
      cargarCompanias(filasPg.value, 'ASC', ordenamiento, desdePagina);
      /*opacity: 0;
    pointer-events: none;*/
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error guardando cambios: ' + error.message);
    });
}

//Buscar las compañias que coincidan con el texto
async function buscarCompanias(txtBuscar) {
  let companias = [];

  await fetch(
    `http://localhost:3000/api/companies/?name=${txtBuscar}&limit=10&sort=names`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((response) => {
      if (response.status == 'error' || response.status == 'fail') {
        throw new Error(response.message);
      }
      companias = response.doc;
      limpiarTblCompanias();
      companias.forEach((compania) => {
        mostrarCompania(compania);
      });
    })
    .catch((error) => {
      console.error('Error buscando compañias:', error);
    });
  cantidadPagina.innerHTML = ``;
  contenedorPaginacion.style.display = 'none';
}

function crearCampoTitulo(campo) {
  let tituloCampo = document.createElement('th');
  let divCampo = document.createElement('div');
  divCampo.setAttribute('class', 'titulo orden-desc');
  divCampo.setAttribute('id', `btn-ord-${campo}`);
  divCampo.innerHTML = `<span>${formatoMayusculaInicial(campo)}</span>
    <span  class="material-icons-outlined material-icons icono-ordenar">
        import_export
    </span>`;

  //console.log(divCampo.classList);

  tituloCampo.appendChild(divCampo);
  return tituloCampo;
}

function agregarEventoClick(campo, campoNombre) {
  const elemento = document.getElementById(`btn-ord-${campo}`);

  elemento.addEventListener('click', (e) => {
    console.log(`ordenar por ${campo}`);
    console.log(elemento.classList);
    ordenamiento = campoNombre;
    if (elemento.classList.contains('orden-desc')) {
      console.log('ingresa a ordenar descendientemente');
      limpiarTblCompanias();
      cargarCompanias(filasPg.value, 'DESC', ordenamiento, desdePagina);
    } else {
      console.log('ingresa a ordenar ascendentemente');
      limpiarTblCompanias();

      cargarCompanias(filasPg.value, 'ASC', ordenamiento, desdePagina);
    }

    elemento.classList.toggle('orden-desc');
  });
}

function crearEncabezado() {
  let fila = document.createElement('tr');

  fila.appendChild(crearCampoTitulo('nombre'));
  fila.appendChild(crearCampoTitulo('ubicacion'));
  fila.appendChild(crearCampoTitulo('email'));
  fila.appendChild(crearCampoTitulo('telefono'));
  fila.appendChild(crearCampoTitulo('direccion'));

  fila.innerHTML += `<th>
    <div class="titulo">Acciones</div>
</th>`;

  tblCompanias.appendChild(fila);

  agregarEventoClick('nombre', 'name');
  agregarEventoClick('ubicacion', 'city');
  agregarEventoClick('email', 'email');
  agregarEventoClick('telefono', 'phone');
  agregarEventoClick('direccion', 'address');
}

async function buscarCompania(id) {
  console.log('id ', id);

  let ubicacion = await fetch(`http://localhost:3000/api/companies/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      //console.log(response);
      if (response.status == 'error' || response.status == 'fail') {
        throw new Error(response.message);
      }
      document.getElementById('nombre').value = formatoMayusculaInicial(
        response.doc.name
      );
      document.getElementById('direccion').value = formatoMayusculaInicial(
        response.doc.address
      );
      document.getElementById('email').value = response.doc.email;
      document.getElementById('telefono').value = response.doc.phone;

      document.getElementById('titulo-modal').innerHTML = 'Editar Compania';
      idCompaniaEdicion = response.doc._id;
      btnGuardarCompania.value = 'Guardar cambios';

      return {
        ciudad: response.doc.city._id,
        pais: response.doc.city.country._id,
      };
    })
    .catch((error) => {
      console.error('Error buscando compania:', error);
    });

  await cargaPaises();
  console.log('ciudad', ubicacion.ciudad);
  document.getElementById('pais').value = ubicacion.pais;
  await cargarCiudades(ubicacion.pais);
  document.getElementById('ciudad').value = ubicacion.ciudad;
}

async function validarContactos(idCompania) {
  respuesta = await fetch(
    `http://localhost:3000/api/contacts/?company=${idCompania}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((response) => {
      if (response.status == 'error' || response.status == 'fail') {
        throw new Error(response.message);
      }
      console.log('Contactos asociadas a compañía ', response.doc);
      return response.doc.length > 0 ? false : true;
    })
    .catch((error) => {
      console.error('Error validando contactos de compañía:', error);
      //alert('Error cargando paises');
    });

  return respuesta;
}

// Obtiene las compañias sin filtrar
async function cargarTotalCompanias() {
  //   let usuarios = [];

  let companias = await fetch(`http://localhost:3000/api/companies/`, {
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
      return response.doc;
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  return companias;
}

async function calcularTotalPagina() {
  companiasTotal = await cargarTotalCompanias();

  if (companiasTotal.length < filasPg.value) {
    totalPaginas = 1;
  } else {
    totalPaginas =
      Math.trunc(companiasTotal.length / filasPg.value) +
      (companiasTotal.length % filasPg.value > 0 ? 1 : 0);
  }

  return totalPaginas;
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

  cargarCompanias(filasPg.value, 'ASC', ordenamiento, desdePagina);
}

async function buscarCompaniasFiltro(valor) {
  let companias = [];

  await fetch(`http://localhost:3000/api/companies/filter/?name=${valor}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      //console.log(response.doc);
      if (response.status == 'error' || response.status == 'fail') {
        throw new Error(response.message);
      }
      companias = response.doc;
      limpiarTblCompanias();
      companias.forEach((compania) => {
        mostrarCompania(compania);
      });
    })
    .catch((error) => {
      console.error('Error cargando compañias:', error);
    });

  //   totalPaginas = await calcularTotalPagina();

  cantidadPagina.innerHTML = ``;
  contenedorPaginacion.style.display = 'none';
}

/////////////////////eventos

selectPais.addEventListener('change', (e) => {
  cargarCiudades(selectPais.value);
});

btnGuardarCompania.addEventListener('click', (e) => {
  let compania = {};

  compania.name = document.getElementById('nombre').value;
  compania.address = document.getElementById('direccion').value;
  compania.email = document.getElementById('email').value;
  compania.phone = document.getElementById('telefono').value;
  compania.city = document.getElementById('ciudad').value;

  if (btnGuardarCompania.value == 'Guardar Compañía') {
    if (validarCompania(compania)) {
      guardarCompania(compania).catch((e) => {
        console.log('error al guardar: ', e);
      });
    }
  } else {
    if (validarCompania(compania)) {
      guardarCambiosCompania(compania);
    }
  }
});

btnBuscar.addEventListener('click', (e) => {
  txtBuscarValor = document.getElementById('txt-buscar').value;

  if (txtBuscarValor == '') {
    alert('Por favor ingrese el nombre a buscar');
  } else {
    buscarCompaniasFiltro(txtBuscarValor);
  }
});

txtBuscar.addEventListener('keyup', (e) => {
  var keycode = e.keyCode || e.which;
  if (keycode == 13) {
    if (txtBuscar.value == '') {
      alert('Por favor ingrese el nombre a buscar');
      desdePagina = 1;
      cargarCompanias(filasPg.value, 'ASC', ordenamiento, desdePagina);
    } else {
      buscarCompaniasFiltro(txtBuscar.value);
    }
  }
});

filasPg.addEventListener('change', (e) => {
  limpiarTblCompanias();
  desdePagina = 1;
  cargarCompanias(filasPg.value, 'ASC', ordenamiento, desdePagina);
});

crearEncabezado();
cargarCompanias(filasPg.value, 'ASC', ordenamiento, desdePagina);
