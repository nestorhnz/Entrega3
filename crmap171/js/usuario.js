// Funciones para listar los usuarios
function listarUsuario(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/usuario?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarFila);
      $('#tbl_usuario').DataTable();
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}


function completarFila(element,index,arr) {
  arr[index] = document.querySelector("#tbl_usuario tbody").innerHTML  +=
  `<tr>
  <td>${element.id_usuario}</td>
  <td>${element.dv}</td>
  <td>${element.nombres}</td>
  <td>${element.apellidos}</td>
  <td>${element.email}</td>
  <td>${element.celular}</td>
  <td>${element.username}</td>
  <td>${element.password}</td>
  <td>${element.fecha_registro}</td>
  <td>
  <a href='actualizar.html?id=${element.id_usuario}' class='btn btn-warning btn-sm'>Actualizar</a>
  <a href='eliminar.html?id=${element.id_usuario}' class='btn btn-danger btn-sm'>Eliminar</a>
  </td>
  </tr>`
}


// Funciones para crear nuevo usuario
function agregarUsuario(){

var id_usuario = document.getElementById("txt_id_usuario").value;
var dv = document.getElementById("txt_dv").value;
var nombres = document.getElementById("txt_nombres").value;
var apellidos = document.getElementById("txt_apellidos").value;
var email = document.getElementById("txt_email").value;
var celular = document.getElementById("txt_celular").value;
var username = document.getElementById("txt_username").value;
var password = document.getElementById("txt_password").value;

  // Validacion para que los campos no esten vacios
  if (!dv || !nombres || !apellidos || !email || !celular || !username || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Validaciones para que los campos cumplan los requerimientos de la base de datos.
    if (isNaN(id_usuario)) {
      alert("El ID debe ser numerico.");
      return;
    }
    if (!dv || dv.length !== 1) {
      alert("DV debe ser un solo carácter.");
      return;
    }
    if (!nombres || nombres.length > 45) {
      alert("Nombres no debe exceder 45 caracteres.");
      return;
    }
    if (!apellidos || apellidos.length > 45) {
      alert("Apellidos no debe exceder 45 caracteres.");
      return;
    }
    if (!email || email.length > 45 || !validateEmail(email)) {
      alert("Email no válido o excede 45 caracteres.");
      return;
    }
    if (isNaN(celular)) {
      alert("Celular debe ser un número válido.");
      return;
    }
    if (!username || username.length > 45) {
      alert("Username no debe exceder 45 caracteres.");
      return;
    }
    if (!password || password.length > 200) {
      alert("Password no debe exceder 200 caracteres.");
      return;
    }

// Mostrar la alerta de éxito
mostrarAlertaExito();

// Limpiar los campos del formulario
limpiarCampos();


const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var fechaHoraActual = obtenerFechaHora();

const raw = JSON.stringify({
  "id_usuario": id_usuario,
  "dv": dv,
  "nombres": nombres,
  "apellidos": apellidos,
  "email": email,
  "celular": celular,
  "username": username,
  "password": password,
  "fecha_registro": fechaHoraActual
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://144.126.210.74:8080/api/usuario", requestOptions)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 400) {
      throw new Error("Error al crear el usuario. Datos inválidos.");
    } else {
      throw new Error("Error en el servidor. Inténtalo más tarde.");
    }
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => console.error(error));


}


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

// Validar email
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// Alerta Usuario agregado exitosamente
function mostrarAlertaExito() {
  document.getElementById('alertaExito').style.display = 'block';
}

// Limpiar
function limpiarCampos() {
  document.getElementById("txt_id_usuario").value = "";
  document.getElementById("txt_dv").value = "";
  document.getElementById("txt_nombres").value = "";
  document.getElementById("txt_apellidos").value = "";
  document.getElementById("txt_email").value = "";
  document.getElementById("txt_celular").value = "";
  document.getElementById("txt_username").value = "";
  document.getElementById("txt_password").value = "";
}


// Funciones para actualizar 
// Variable global
var g_id_usuario ="";

// Obtenemos la ID de la URL
function obtenerIdActualizar(){
  const queryString = window.location.search;
  const parametros = new URLSearchParams(queryString);
  const p_id_usuario = parametros.get('id');
  g_id_usuario = p_id_usuario;
  obtenerDatosActualizar(p_id_usuario);

}

// Usando la ID que obtuvimos hacemos fetch de los datos de ese registro
function obtenerDatosActualizar(p_id_usuario) { 
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/usuario/"+p_id_usuario, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormulario))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}


// Llenamos los campos con los datos del registro para que el usuario pueda saber que esta editando
function completarFormulario(element,index,arr) {
  var dv = element.dv
  var nombres = element.nombres;
  var apellidos = element.apellidos
  var email = element.email
  var celular = element.celular
  var username = element.username
  var password = element.password
  
  document.getElementById("txt_dv").value = dv;
  document.getElementById('txt_nombres').value = nombres;
  document.getElementById("txt_apellidos").value = apellidos;
  document.getElementById("txt_email").value = email;
  document.getElementById("txt_celular").value = celular;
  document.getElementById("txt_username").value = username;
  document.getElementById("txt_password").value = password;

}

// Obtenemos los valores de los campos editado y actualizamos el registro
function actualizarUsuario(){
  var dv = document.getElementById("txt_dv").value;
  var nombres = document.getElementById("txt_nombres").value;
  var apellidos = document.getElementById("txt_apellidos").value;
  var email = document.getElementById("txt_email").value;
  var celular = document.getElementById("txt_celular").value;
  var username = document.getElementById("txt_username").value;
  var password = document.getElementById("txt_password").value;

  // Validacion para que los campos no esten vacios
  if (!dv || !nombres || !apellidos || !email || !celular || !username || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Validaciones para que los campos cumplan los requerimientos de la base de datos.
  if (!dv || dv.length !== 1) {
    alert("DV debe ser un solo carácter.");
    return;
  }
  if (!nombres || nombres.length > 45) {
    alert("Nombres no debe exceder 45 caracteres.");
    return;
  }
  if (!apellidos || apellidos.length > 45) {
    alert("Apellidos no debe exceder 45 caracteres.");
    return;
  }
  if (!email || email.length > 45 || !validateEmail(email)) {
    alert("Email no válido o excede 45 caracteres.");
    return;
  }
  if (isNaN(celular)) {
    alert("Celular debe ser un número válido.");
    return;
  }
  if (!username || username.length > 45) {
    alert("Username no debe exceder 45 caracteres.");
    return;
  }
  if (!password || password.length > 200) {
    alert("Password no debe exceder 200 caracteres.");
    return;
  }

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var fechaHoraActual = obtenerFechaHora();

const raw = JSON.stringify({
  "dv": dv,
  "nombres": nombres,
  "apellidos": apellidos,
  "email": email,
  "celular": celular,
  "username": username,
  "password": password,
  "fecha_registro": fechaHoraActual
});

const requestOptions = {
  method: "PATCH",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://144.126.210.74:8080/api/usuario/"+ g_id_usuario, requestOptions)
.then((response) => {
  if (response.ok) {
    return response.json();
  } else if (response.status === 400) {
    throw new Error("Error al crear el usuario. Datos inválidos.");
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


// Funciones para eliminar 
// Eliminar
function obtenerIdEliminar(){
  const queryString = window.location.search;
  const parametros = new URLSearchParams(queryString);
  const p_id_usuario = parametros.get('id');
  g_id_usuario = p_id_usuario;
  obtenerDatosEliminar(p_id_usuario);

}
function obtenerDatosEliminar(p_id_usuario) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/usuario/"+p_id_usuario, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function completarEtiqueta(element,index,arr) {
  var nombre_usuario = element.nombre_usuario;
  document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar el usuario de ID: <b>"+ g_id_usuario+"</b>?";
}
function eliminarUsuario(){

  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

fetch("http://144.126.210.74:8080/api/usuario/"+ g_id_usuario, requestOptions)
.then((response) => {
  if (response.ok) {
    return response.json();
  } else if (response.status === 400) {
    throw new Error("Error al eliminar usuario. Datos inválidos.");
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