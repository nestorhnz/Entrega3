// Funciones para listar
function listarResultado(){
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch("http://144.126.210.74:8080/api/resultado?_size=200", requestOptions)
      .then((response) => response.json())
      .then((json) => {
        json.forEach(completarFila);
        $('#tbl_resultado').DataTable();
      })
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }


  function completarFila(element,index,arr) {
    arr[index] = document.querySelector("#tbl_resultado tbody").innerHTML  +=
    `<tr>
    <td>${element.id_resultado}</td>
    <td>${element.nombre_resultado}</td>
    <td>${element.fecha_registro}</td>
    <td>
    <a href='actualizar.html?id=${element.id_resultado}' class='btn btn-warning btn-sm'>Actualizar</a>
    <a href='eliminar.html?id=${element.id_resultado}' class='btn btn-danger btn-sm'>Eliminar</a>
    </td>
    </tr>`
  }

  // Funciones para crear nuevo resultado
function agregarResultado(){

  var id_resultado = document.getElementById("txt_id_resultado").value;
  var nombres = document.getElementById("txt_nombre").value;
  
    // Validacion para que los campos no esten vacios
    if (!id_resultado || !nombres) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    // Validaciones para que los campos cumplan los requerimientos de la base de datos.
      if (isNaN(id_resultado)) {
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
    "id_resultado": id_resultado,
    "nombre_resultado": nombres,
    "fecha_registro": fechaHoraActual
  });
  
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/resultado", requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 400) {
        throw new Error("Error al crear el resultado. Datos inválidos.");
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
  

  // Alerta resultado agregado exitosamente
  function mostrarAlertaExito() {
    document.getElementById('alertaExito').style.display = 'block';
  }
  
  // Limpiar
  function limpiarCampos() {
    document.getElementById("txt_id_resultado").value = "";
    document.getElementById("txt_nombre").value = "";
  }
  

// Funciones para actualizar 
// Variable global
var g_id_resultado ="";

// Obtenemos la ID de la URL
function obtenerIdActualizar(){
  const queryString = window.location.search;
  const parametros = new URLSearchParams(queryString);
  const p_id_resultado = parametros.get('id');
  g_id_resultado = p_id_resultado;
  obtenerDatosActualizar(p_id_resultado);

}

// Usando la ID que obtuvimos hacemos fetch de los datos de ese registro
function obtenerDatosActualizar(p_id_resultado) { 
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/resultado/"+p_id_resultado, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormulario))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}


// Llenamos los campos con los datos del registro para que el resultado pueda saber que esta editando
function completarFormulario(element,index,arr) {
  var nombres = element.nombres;
  
  document.getElementById('txt_nombres').value = nombres;

}

// Obtenemos los valores de los campos editado y actualizamos el registro
function actualizarResultado(){
  var nombres = document.getElementById("txt_nombres").value;

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
  "nombre_resultado": nombres,
});

const requestOptions = {
  method: "PATCH",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://144.126.210.74:8080/api/resultado/"+ g_id_resultado, requestOptions)
.then((response) => {
  if (response.ok) {
    return response.json();
  } else if (response.status === 400) {
    throw new Error("Error al crear el resultado. Datos inválidos.");
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
  const p_id_resultado = parametros.get('id');
  g_p_id_resultado = p_id_resultado;
  obtenerDatosEliminar(p_id_resultado);

}
function obtenerDatosEliminar(p_id_resultado) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/resultado/"+p_id_resultado, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function completarEtiqueta(element,index,arr) {
  var nombre_resultado = element.nombre_resultado;
  document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar el resultado de ID: <b>"+ g_p_id_resultado+"</b>?";
}
function eliminarResultado(){

  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

fetch("http://144.126.210.74:8080/api/resultado/"+ g_p_id_resultado, requestOptions)
.then((response) => {
  if (response.ok) {
    return response.json();
  } else if (response.status === 400) {
    throw new Error("Error al eliminar resultado. Datos inválidos.");
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