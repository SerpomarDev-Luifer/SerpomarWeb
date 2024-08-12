new gridjs.Grid({
    search: true,
    language: {
        search: {
            placeholder: '🔍 Buscar...'
        }
    },
    pagination: {
        limit: 10,
        enabled: true,
    },
    resizable: true,
    sort: false,
    columns: ["#", "Nombre", "Identificacicón", "Telefono", {
        name: 'Acciones',
        columns: [{
                name: 'Documentos',
                hidden: false,
                formatter: (cell, row) => {
                    return gridjs.html(
                        `<button id="btn-${row.cells[0].data}" class="upload-btn no-file" onclick="uploadId(${row.cells[0].data})">Adjuntos</button>`
                    );
                }
            },
            {
                name: 'Actualizar',
                formatter: (cell, row) => {
                    return gridjs.h('a', {
                        href: '/view/conductores/edit.html',
                        onclick: (e) => {
                            e.preventDefault();
                            editConductor(row.cells[0].data);
                        }
                    }, [

                        gridjs.h('img', {
                            src: '/img/editar-texto.png',
                            alt: 'Actualizar',
                            style: 'width: 20px; height: 20px;'
                        })
                    ]);
                },
            }, {
                name: 'Eliminar',
                formatter: (cell, row) => {
                    return gridjs.h('a', {
                        href: '/view/conductores/create.html',
                        onclick: (e) => {
                            e.preventDefault(); // Evita que el enlace se recargue la página
                            deleteCondcutor(row.cells[0].data);
                        }
                    }, [
                        // Imagen dentro del enlace
                        gridjs.h('img', {
                            src: '/img/basura.png',
                            alt: 'eliminar',
                            style: 'width: 20px; height: 20px;'
                        })
                    ]);
                },
            },
        ],

    }],
    server: {
        url: "https://esenttiapp-production.up.railway.app/api/uploadconductor",
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((conductor) => [
                    conductor.id,
                    conductor.nombre,
                    conductor.identificacion,
                    conductor.telefono,
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('conductores'));


document.getElementById('createConductor').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    const jsonData = JSON.stringify(Object.fromEntries(formData));

    fetch('https://esenttiapp-production.up.railway.app/api/conductores', {
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
                text: "Has Creado un conductor.",
                icon: "success",
            });
        })
        .then((response) => {
            time();
        })
});

function time() {
    document.getElementById('createConductor').reset();
    setTimeout(() => {
        window.location.href = `/view/conductores/create.html`;
    }, 1200);
}


function editConductor(id) {

    window.location.href = `/view/conductores/edit.html?id=${id}`
}


function deleteCondcutor(id) {
    DeleteData(id)
}

function uploadId(id) {
    // Open the modal or handle file upload
    $('#fileUploadModal').show();
    $('#id_asignacion').val(id);

    // Initialize Dropzone for the form
    const myDropzone = new Dropzone("#SaveFile", {
        url: "/upload", // Replace with your upload URL
        init: function() {
            this.on("success", function(file, response) {
                // Change button state after successful file upload
                const button = document.getElementById(`btn-${id}`);
                if (button) {
                    button.classList.remove('no-file');
                    button.classList.add('file-uploaded');
                }

                // Hide the modal after upload
                $('#fileUploadModal').hide();
            });
        }
    });
}

// Handle modal close
$('.close').on('click', function() {
    $('#fileUploadModal').hide();
});