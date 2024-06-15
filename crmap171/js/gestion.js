//Variables globales
var g_id_gestion ="";

// Funciones para listar las gestiones
function agregarGestion(){

var id_usuario = document.getElementById("sel_id_usuario").value;
var id_cliente = document.getElementById("sel_id_cliente").value;
var id_tipo_gestion = document.getElementById("sel_id_tipo_gestion").value;
var id_resultado = document.getElementById("sel_id_resultado").value;
var comentarios = document.getElementById("txt_comentarios").value;

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var fechaHoraActual = obtenerFechaHora();

const raw = JSON.stringify({
  "id_usuario": id_usuario,
  "id_cliente": id_cliente,
  "id_tipo_gestion": id_tipo_gestion,
  "id_resultado": id_resultado,
  "comentarios": comentarios,
  "fecha_registro": fechaHoraActual
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://144.126.210.74:8080/api/gestion", requestOptions)
  .then((response) => {
    if(response.status == 200){
      location.href="listar.html";
    }
    if(response.status == 400) {
      alert("Error al crear gestión");
    }
  })
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}
function listarGestion() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    "query": "select ges.id_gestion as id_gestion,cli.id_cliente, ges.comentarios as comentarios,CONCAT(cli.nombres, ' ',cli.apellidos) as cliente,CONCAT(usu.nombres,' ' ,usu.apellidos) as usuario,tge.nombre_tipo_gestion as nombre_tipo_gestion,res.nombre_resultado as nombre_resultado,ges.fecha_registro as fecha_registro from gestion ges,usuario usu,cliente cli,tipo_gestion tge,resultado res where ges.id_usuario = usu.id_usuario and ges.id_cliente = cli.id_cliente and ges.id_tipo_gestion = tge.id_tipo_gestion and ges.id_resultado = res.id_resultado "
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  fetch("http://144.126.210.74:8080/dynamic", requestOptions)
    .then(response => response.json())
    .then((json) => {
      if (Array.isArray(json)) {
        json.forEach(completarFila);
        $('#tbl_gestion').DataTable();
      } else {
        console.error('Expected an array but got:', json);
      }
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}
function completarFila(element, index, arr) {
  arr[index] = document.querySelector("#tbl_gestion tbody").innerHTML +=
    `<tr>
      <td>${element.id_gestion}</td>
      <td>${element.usuario}</td>
      <td>${element.cliente}</td>
      <td>${element.nombre_tipo_gestion}</td>
      <td>${element.nombre_resultado}</td>
      <td>${element.comentarios}</td>
      <td>${element.fecha_registro}</td>
      <td>
        <a href='actualizar.html?id=${element.id_gestion}' class='btn btn-warning btn-sm'>Actualizar</a>
        <a href='eliminar.html?id=${element.id_gestion}' class='btn btn-danger btn-sm'>Eliminar</a>
      </td>
    </tr>`;
}


// Funciones para actualizar 
// Variable global
var g_id_gestion ="";

// Obtenemos la ID de la URL
function obtenerIdActualizar(){
  const queryString = window.location.search;
  const parametros = new URLSearchParams(queryString);
  const p_id_gestion = parametros.get('id');
  g_id_gestion = p_id_gestion;
  obtenerDatosActualizar(p_id_gestion);

}

//Obtenemos la ID desde de la URL
function obtenerDatosActualizar(p_id_gestion) { 
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/gestion/" + p_id_gestion, requestOptions)
    .then((response) => response.json())
    .then((json) => {
      if (Array.isArray(json)) {
        json.forEach(completarFormulario);
      } else {
        completarFormulario(json);
      }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Usando la ID que obtuvimos hacemos fetch de los datos de ese registro
function completarFormulario(element) {
  var comentarios = element.comentarios;
  document.getElementById('txt_comentarios').value = comentarios;
}

// Obtenemos los valores de los campos editado y actualizamos el registro
function actualizarGestion(){
  var comentarios = document.getElementById("txt_comentarios").value;

  // Validacion para que los campos no esten vacios
  if (!comentarios) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Validaciones para que los campos cumplan los requerimientos de la base de datos.
  if (!comentarios || comentarios.length > 200) {
    alert("comentarios no debe exceder 45 caracteres.");
    return;
  }

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var fechaHoraActual = obtenerFechaHora();

const raw = JSON.stringify({
  "comentarios": comentarios,
});

const requestOptions = {
  method: "PATCH",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://144.126.210.74:8080/api/gestion/"+ g_id_gestion, requestOptions)
.then((response) => {
  if (response.ok) {
    return response.json();
  } else if (response.status === 400) {
    throw new Error("Error al actualizar la gestion. Datos inválidos.");
  } else {
    throw new Error("Error en el servidor. Inténtalo más tarde.");
  }
})
.then((result) => {
  console.log(result);
})
.catch((error) => console.error(error));

// Mostrar la alerta de éxito
mostrarAlertaExito();

}


//Funciones para crear una nueva gestion
function cargarSelectResultado() {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  fetch("http://144.126.210.74:8080/api/resultado?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      if (Array.isArray(json)) {
        json.forEach(completarOpcionesResultado);
      } else {
        console.error('Expected an array but got:', json);
      }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function completarOpcionesResultado(element, index, arr) {
  arr[index] = document.querySelector("#sel_id_resultado").innerHTML +=
    `<option value='${element.id_resultado}'>${element.nombre_resultado}</option>`;
}

function cargarListasDesplegables(){
  cargarSelectResultado();
  cargarSelectCliente();
  cargarSelectUsuario();
  cargarSelectTipoGestion();
  obtenerFechaHora();
}
function cargarSelectTipoGestion(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/tipo_gestion?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarOpcionesTipoGestion);

    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
function completarOpcionesTipoGestion(element,index,arr) {
  arr[index] = document.querySelector("#sel_id_tipo_gestion").innerHTML  +=
  `<option value='${element.id_tipo_gestion}'>${element.nombre_tipo_gestion}</option>`
}
function cargarSelectUsuario(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/usuario?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarOpcionesUsuario);

    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
function completarOpcionesUsuario(element,index,arr) {
  arr[index] = document.querySelector("#sel_id_usuario").innerHTML  +=
  `<option value='${element.id_usuario}'>${element.apellidos} ${element.nombres}</option>`
}
function cargarSelectCliente(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/cliente?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarOpcionesCliente);

    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
function completarOpcionesCliente(element,index,arr) {
  arr[index] = document.querySelector("#sel_id_cliente").innerHTML  +=
  `<option value='${element.id_cliente}'>${element.apellidos} ${element.nombres}</option>`
}


// Funciones para eliminar 
// Eliminar
function obtenerIdEliminar(){
  const queryString = window.location.search;
  const parametros = new URLSearchParams(queryString);
  const p_id_gestion = parametros.get('id');
  g_id_gestion = p_id_gestion;
  obtenerDatosEliminar(p_id_gestion);

}
function obtenerDatosEliminar(p_id_gestion) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/usuario/"+p_id_gestion, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function completarEtiqueta(element,index,arr) {
  var nombre_gestion = element.nombre_gestion;
  document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar el usuario de ID: <b>"+ nombre_gestion+"</b>?";
}
function eliminarGestion(){

  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

fetch("http://144.126.210.74:8080/api/usuario/"+ g_id_gestion, requestOptions)
.then((response) => {
  if (response.ok) {
    return response.json();
  } else if (response.status === 400) {
    throw new Error("Error al eliminar la gestion. Datos inválidos.");
  } else {
    throw new Error("Error en el servidor. Inténtalo más tarde.");
  }
})
.then((result) => {
  console.log(result);
})
.catch((error) => console.error(error));

// Mostrar la alerta de éxito
mostrarAlertaExito();

var lbl_eliminar = document.getElementById('lbl_eliminar');
lbl_eliminar.style.display = 'none';

}


// Funciones varias
function obtenerFechaHora(){
  var fechaActual = new Date();
  var fechaFormateada = fechaActual.toLocaleString('es-ES',{
    hour12:false,
    year:'numeric',
    month:'2-digit',
    day:'2-digit',
    hour:'2-digit',
    minute:'2-digit',
    second:'2-digit'
  }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');
return fechaFormateada;
  

}

// Alerta exitosa
function mostrarAlertaExito() {
  document.getElementById('alertaExito').style.display = 'block';
}
