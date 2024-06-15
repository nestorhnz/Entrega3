// Funciones para actualizar 
// Variable global
var g_id_tipo_gestion ="";

// Obtenemos la ID de la URL
function obtenerIdActualizar(){
  const queryString = window.location.search;
  const parametros = new URLSearchParams(queryString);
  const p_id_tipo_gestion = parametros.get('id');
  g_id_tipo_gestion = p_id_tipo_gestion;
  obtenerDatosActualizar(p_id_tipo_gestion);

}

// Usando la ID que obtuvimos hacemos fetch de los datos de ese registro
function obtenerDatosActualizar(p_id_tipo_gestion) { 
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/tipo_gestion/"+p_id_tipo_gestion, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormulario))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}


// Llenamos los campos con los datos del registro para que el usuario pueda saber que esta editando
function completarFormulario(element,index,arr) {
  var nombres = element.nombres;
  document.getElementById('txt_nombre_tipo_gestion').value = nombres;

}

// Obtenemos los valores de los campos editado y actualizamos el registro
function actualizarTipoGestion(){
  var nombres = document.getElementById("txt_nombre_tipo_gestion").value;

  // Validacion para que los campos no esten vacios
  if (!nombres) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Validaciones para que los campos cumplan los requerimientos de la base de datos.
  if (!nombres || nombres.length > 45) {
    alert("Nombres no debe exceder 45 caracteres.");
    return;
  }

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var fechaHoraActual = obtenerFechaHora();

const raw = JSON.stringify({
  "nombre_tipo_gestion": nombres,
  "fecha_registro": fechaHoraActual
});

const requestOptions = {
  method: "PATCH",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://144.126.210.74:8080/api/tipo_gestion/"+ g_id_tipo_gestion, requestOptions)
.then((response) => {
  if (response.ok) {
    return response.json();
  } else if (response.status === 400) {
    throw new Error("Error al actualizar tipo de gestion. Datos inválidos.");
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

// Listar
function listarTipoGestion(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/tipo_gestion?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarFila);
      $('#tbl_tipo_gestion').DataTable();
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
function completarFila(element,index,arr) {
  arr[index] = document.querySelector("#tbl_tipo_gestion tbody").innerHTML  +=
  `<tr>
  <td>${element.id_tipo_gestion}</td>
  <td>${element.nombre_tipo_gestion}</td>
  <td>${element.fecha_registro}</td>
  <td>
  <a href='actualizar.html?id=${element.id_tipo_gestion}' class='btn btn-warning btn-sm'>Actualizar</a>
  <a href='eliminar.html?id=${element.id_tipo_gestion}' class='btn btn-danger btn-sm'>Eliminar</a>
  </td>
  </tr>`
}


// Eliminar
function obtenerIdEliminar(){
  const queryString = window.location.search;
  const parametros = new URLSearchParams(queryString);
  const p_id_tipo_gestion = parametros.get('id');
  g_id_tipo_gestion = p_id_tipo_gestion;
  obtenerDatosEliminar(p_id_tipo_gestion);

}
function obtenerDatosEliminar(p_id_tipo_gestion) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/tipo_gestion/"+p_id_tipo_gestion, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function completarEtiqueta(element,index,arr) {
  var nombre_tipo_gestion = element.nombre_tipo_gestion;
  document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar este tipo de gestión? <b>"+ nombre_tipo_gestion +"</b>";
}
function eliminarTipoGestion(){

  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

fetch("http://144.126.210.74:8080/api/tipo_gestion/"+ g_id_tipo_gestion, requestOptions)
.then((response) => {
  if (response.ok) {
    return response.json();
  } else if (response.status === 400) {
    throw new Error("Error al eliminar el gestion. Datos inválidos.");
  } else {
    throw new Error("Error en el servidor. Inténtalo más tarde.");
  }
})
.then((result) => {
  console.log(result);
})
.catch((error) => console.error(error));


}


// Funciones para crear nuevo tipo de gestion
function agregarTipoGestion(){

  var id_tipo_gestion = document.getElementById("txt_id_tipo_gestion").value;
  var nombres = document.getElementById("txt_nombre_tipo_gestion").value;

  
    // Validacion para que los campos no esten vacios
    if (!nombres || !id_tipo_gestion) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    // Validaciones para que los campos cumplan los requerimientos de la base de datos.
      if (isNaN(id_tipo_gestion)) {
        alert("El ID debe ser numerico.");
        return;
      }
      if (!nombres || nombres.length > 45) {
        alert("Nombres no debe exceder 45 caracteres.");
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
    "id_tipo_gestion": id_tipo_gestion,
    "nombre_tipo_gestion": nombres,
    "fecha_registro": fechaHoraActual
  });
  
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/tipo_gestion", requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 400) {
        throw new Error("Error al crear el gestion. Datos inválidos.");
      } else {
        throw new Error("Error en el servidor. Inténtalo más tarde.");
      }
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => console.error(error));
  
  
  }
  
  
//Funciones varias
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
  // Alerta Tipo de gestion agregado exitosamente
  function mostrarAlertaExito() {
    document.getElementById('alertaExito').style.display = 'block';
  }
  // Limpiar
  function limpiarCampos() {
    document.getElementById("txt_id_tipo_gestion").value = "";
    document.getElementById("txt_nombre_tipo_gestion").value = "";
  }
  