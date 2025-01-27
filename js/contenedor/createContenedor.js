let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

cargarValores(id);

function cargarValores(id){
  fetch(`https://esenttiapp-production.up.railway.app/api/uploadsolisev/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los datos de la API");
      }
      return response.json();
    })
    .then((data) => {
      if(data.length > 0) {
        const ordneSev = data[0];
        document.getElementById("id_solicitud_servicio").value = ordneSev.id_primario;
        document.getElementById("do_pedido").value = ordneSev.do_pedido;
        document.getElementById("do_sp").value = ordneSev.do_sp;
        document.getElementById("contendedor").value = ordneSev.contendedor;
        document.getElementById("id_cliente").value = ordneSev.id_cliente;
        document.getElementById("cliente").value = ordneSev.cliente;
        document.getElementById("imp_exp").value = ordneSev.imp_exp;
        document.getElementById("eta").value = ordneSev.eta;
        document.getElementById("levante").value = ordneSev.levante;
        document.getElementById("documental").value = ordneSev.documental;
        document.getElementById("fisico").value = ordneSev.fisico;
        document.getElementById("libre_hasta").value = ordneSev.libre_hasta;
        document.getElementById("bodega_hasta").value = ordneSev.bodega_hasta;
        document.getElementById("propuesta").value = ordneSev.propuesta;

        // Actualizar el contenido del dashboard_bar
        document.querySelector(".dashboard_bar").textContent = ordneSev.do_sp;

        let id_cliente = ordneSev.id_cliente;
        tableByClt(id_cliente);

      } else {
        console.log('La propiedad array no existe en la respuesta');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function tableByClt(id_cliente){
  new gridjs.Grid({
    search: true,
    language:{
      search:{
          placeholder: '🔍 Buscar...'
      }
    },
    pagination: {
        limit:5,
        enabled: false,
    },
    sort: false,
    columns: [{
      name:'id_co',
      hidden:true,
    },"SP","DO PEDIDO","Numero contenedor","Tipo transporte","Cliente",{
      name:'Acción',
      formatter:(cell,row)=>{
        return gridjs.h('button',{
          className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
          onClick: () => asignar(row.cells[0].data)
        },'Asignar');
      }
    }],
    fixedHeader: true,
    server: {
      url: `https://esenttiapp-production.up.railway.app/api/preasigcont/${id_cliente}`,
      then: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          return data.map((contenedorEx) => [
            contenedorEx.id,
            contenedorEx.do_sp,
            contenedorEx.do_pedido,
            contenedorEx.numero_co,
            contenedorEx.tipo_transporte,
            contenedorEx.cliente
          ]);
        } else {
          console.error("La respuesta del servidor no contiene datos válidos.");
          return [];
        }
      }
    },
    resizable: true,
    style: {
      table: {with:"80%"}
    }
  }).render(document.getElementById('contenedor'));
}

function asignar(id){
  let cliente  = id_cliente;

  if(cliente === 6){
    window.location.href = `/view/asignacion_esenttia/asignacion_esenttia.html?id=${id}`;
  }else{
    window.location.href = `/view/asignacion/asignacion.html?id=${id}`;
  }
}

document.getElementById('saveContenedor').addEventListener('submit',function(event){
  event.preventDefault();

  const formData = new FormData(this);
  const jsonData = JSON.stringify(Object.fromEntries(formData));

  fetch('https://esenttiapp-production.up.railway.app/api/contenedores',{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al enviar los datos del formulario');
    }
  })
  .then(data => {
    Swal.fire({
      title: "¡Buen trabajo!",
      text: "¡Has creado un contenedor",
      icon: "success",
    });
  })
  .then((response)=>{
    time();
  })
  .catch((error) => {
    console.error("Error:", error);
  });
});

function time() {
  document.getElementById('saveContenedor').reset();
  setTimeout(() => {
    window.location.href = ``;
  },  1200);
}
