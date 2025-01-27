new gridjs.Grid({
    search: false,
    language:{
        search:{
            placeholder: '🔍 Buscar...'
        }
    },
    pagination: {
        limit:10,
        enabled: true,
    },
    resizable: true,
    sort: false,
    columns: ["SP","Cliente","Concepto",{
        name:"Valor",
        formatter:(_,row)=> `$ ${(row.cells[3].data).toLocaleString()}`
    }],
    server: {
        url: 'https://esenttiapp-production.up.railway.app/api/showpreliquidar',
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((preliq) => [
                    preliq.do_sp,
                    preliq.cliente,
                    preliq.concepto,
                    preliq.valor,

                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('liquidar'));

document.getElementById('saveLiquidacion').addEventListener('submit',function(event){
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    //console.log(jsonData)

    fetch('https://esenttiapp-production.up.railway.app/api/preLiquidar',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:jsonData
    })
    .then(response=>{
        if(!response.ok){
            throw new Error('Error al enviar los datos del formulario');
        }
    })
    .then(data => {
        Swal.fire({
          title: "¡Buen trabajo!",
          text: "Pre liquidación creada",
          icon: "success",
        });
    })
    .then((response)=>{
     time();
    })
    .catch((error) => {
        console.error('Error:', error);
      });
})

function time() {
    document.getElementById('saveLiquidacion').reset();
    setTimeout(() => {
        window.location.href = `/view/liquidar/pre_liquidar.html`; 
    },  1200);
  }