document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/estadisticas')
        .then(response => response.json())
        .then(data => {

            Highcharts.chart('grafico-lineas', {
                chart: { type: 'line' },
                title: { text: 'Cantidad de Avistamientos Registrados por Día' },
                xAxis: {
                    categories: data.lineas.map(item => item[0]),
                    title: { text: 'Días' }
                },
                yAxis: {
                    title: { text: 'Cantidad de Avistamientos' },
                    allowDecimals: false
                },
                series: [{
                    name: 'Avistamientos',
                    data: data.lineas.map(item => item[1])
                }]
            });

            Highcharts.chart('grafico-torta', {
                chart: { type: 'pie' },
                title: { text: 'Total de Avistamientos por Tipo de Ave' },
                series: [{
                    name: 'Avistamientos',
                    colorByPoint: true,
                    data: data.torta
                }]
            });

            Highcharts.chart('grafico-barras', {
                chart: { type: 'column' },
                title: { text: 'Total de Voluntarios Registrados por Comuna' },
                xAxis: {
                    categories: data.barras.comunas,
                    title: { text: 'Comunas' }
                },
                yAxis: {
                    title: { text: 'Total de Voluntarios' },
                    allowDecimals: false
                },
                series: [{
                    name: 'Voluntarios',
                    data: data.barras.totales
                }]
            });

        });
});