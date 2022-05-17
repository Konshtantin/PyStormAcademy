(function() {
    const lessonsChartBox = document.getElementById('lessons-chart')
    const tasksChartBox = document.getElementById('tasks-chart')
    // setup block

    const lessonsChartData = [Number(lessonsChartBox.dataset.lcp), Number(lessonsChartBox.dataset.lc)]

    const tasksChartData = [Number(tasksChartBox.dataset.tcp), Number(tasksChartBox.dataset.tc)]

    // LESSONS CHART ---------------------------------------------------------------
    const lessonData = {
        datasets: [{
            data: [lessonsChartData[0], lessonsChartData[1] - lessonsChartData[0]],
            backgroundColor: [
                '#397ff7',
                '#555',
            ],
            borderWidth: 0,
            cutout: '70%',
            hoverOffset: 0,
            hoverBorderWidth: 0
        }]
    }
    // counter plugin block
    const lessonCounter = {
        id: 'lessonCounter',
        beforeDraw( chart, args, options ) {
            const { ctx, chartArea: {top, right, bottom, left, width, height} } = chart
            ctx.save()
            // write the text
            // ctx.fillStyle = '#fff'
            // ctx.fillRect(width/2, top, 1, bottom)
            // ctx.fillRect(left, height/2 + top, right, 1)
            ctx.font = '500 1.3rem Ubuntu'
            ctx.textAlign = 'center'
            ctx.fillStyle = '#fff'
            ctx.fillText(`${Math.round(lessonsChartData[0]/lessonsChartData[1]*100)}%`, width / 2, (height / 2) + 1.3*16/5)
            ctx.font = '400 .8rem Ubuntu'
            ctx.fillStyle = '#999'
            ctx.fillText(`${lessonsChartData[0]}/${lessonsChartData[1]}`, width / 2, (height / 2) + 1.3*18)
        }
    }

    // config block
    const lessonConfig = {
        type: 'doughnut',
        data: lessonData,
        options: {
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                },
            }
        },
        plugins: [lessonCounter]
    }
    // render init block

    const lessonChart = new Chart(
        lessonsChartBox, 
        lessonConfig
    );
    // LESSONS CHART ---------------------------------------------------------------

    // TASKS CHART -----------------------------------------------------------------
    const tasksData = {
        datasets: [{
            data: [tasksChartData[0], tasksChartData[1] - tasksChartData[0]],
            backgroundColor: [
                'rgb(241, 53, 53)',
                '#555',
            ],
            borderWidth: 0,
            cutout: '70%',
            hoverOffset: 0,
            hoverBorderWidth: 0
        }]
    }

    const taskCounter = {
        id: 'taskCounter',
        beforeDraw( chart, args, options ) {
            const { ctx, chartArea: {top, right, bottom, left, width, height} } = chart
            ctx.save()
            // write the text
            // ctx.fillStyle = '#fff'
            // ctx.fillRect(width/2, top, 1, bottom)
            // ctx.fillRect(left, height/2 + top, right, 1)
            ctx.font = '500 1.2rem Ubuntu'
            ctx.textAlign = 'center'
            ctx.fillStyle = '#fff'
            ctx.fillText(`${Math.round(tasksChartData[0]/tasksChartData[1]*100)}%`, width / 2, (height / 2) + 1.2*16/5)

            ctx.font = '400 .8rem Ubuntu'
            ctx.fillStyle = '#999'
            ctx.fillText(`${tasksChartData[0]}/${tasksChartData[1]}`, width / 2, (height / 2) + 1.2*18)
        }
    }

    const taskConfig = {
        type: 'doughnut',
        data: tasksData,
        options: {
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                },
            }
        },
        plugins: [taskCounter]
    }

    const taskChart = new Chart(
        tasksChartBox, 
        taskConfig
    );
    // TASKS CHART -----------------------------------------------------------------
})()