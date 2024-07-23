new gridjs.Grid({
    search: true,
    language:{
        search:{
            placeholder: '🔍 Buscar...'
        }
    },
    pagination: {
        limit:50,
        enabled: true,
    },
    resizable: true,
    sort: false,
    columns: [
        {
            name:"#",
            hidden:true,
        },{
            name:'SP',
            attributes: (cell,row)=>{
            if(cell){
                return{
                  'data-cell-content': cell,
                  'style': 'color: #6495ED;  font-weight: bold;',
                }
            }
        }
    }, "DO pedido","Pedido","Contendores","Tipo Transporte","Cliente",{
        name:'Acciones',
        hidden:true,
        columns:[{
            name:'Recibir',
            hidden:false,
            formatter:(cell,row)=>{
                return gridjs.h('a', {
                    href: '',
                    onclick: (e) => {
                        e.preventDefault();
                        actualizarEstado(row.cells[0].data);
                    }
                }, [
                    gridjs.h('img', {
                        src: '/img/editar-texto.png',
                        alt: 'Actualizar',
                        style: 'width: 20px; height: 20px;' 
                    })
                ]);
            }
        },
        {
            name:'Eliminar',
            hidden:true,
            formatter:(cell,row)=>{
                return gridjs.h('a', {
                    href: '/view/rutas/create.html',
                    onclick: (e) => {
                        e.preventDefault();
                        deleteRuta(row.cells[0].data);
                    }
                }, [
                    gridjs.h('img', {
                        src: '/img/basura.png',
                        alt: 'eliminar',
                        style: 'width: 20px; height: 20px;' 
                    })
                ]);
            }
        },
    ],
    }],
    // sort: true,
    server: {
        url: "http://esenttiapp.test/api/showsolicitudservpro",
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((soliserv) => [
                    soliserv.id_primario,
                    soliserv.do_sp,
                    soliserv.do_pedido,
                    soliserv.pedido,
                    soliserv.contenedor,
                    soliserv.impexp,
                    soliserv.cliente,

                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('ordenService'));


function actualizarEstado(id){
    actualizarEstado(id)
}