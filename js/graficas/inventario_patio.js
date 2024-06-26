// JS para mostrar el gráfico radial en "Inventario en Patio"

const domInventario = document.getElementById('impoExpoChart');
const myChartInventario = echarts.init(domInventario);

fetch('https://esenttiapp-production.up.railway.app/api/estadoinventario')
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data)) {
            const chartData = data.map(item => ({
                value: item.conteo,
                name: item.modalidad
            }));

            const option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: 'Inventario en Patio',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 5
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 20,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: chartData
                    }
                ]
            };

            myChartInventario.setOption(option);
        } else {
            console.error('Error: Unexpected data format');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
