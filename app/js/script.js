
let DATA;
let INDEX = 0;
let pesoChart;
let btnNext;
let btnPrev;

$(document).ready(function () {
    btnNext =  $("#next");
    btnPrev =  $("#prev");
})

function initChart() {
    const ctx = document.getElementById("peso-chart");
    readData(ctx);
}

function readData(ctx) {
    $.getJSON("./data.json", function(json) {
        DATA = json;
        let dataJson = parseData();
        let config = setConfig(dataJson);
        drawChart(config, ctx)
    });
}

function setConfig(dataJson){
    let labels = [];
    let values = [];
    dataJson.forEach(d => {
        labels.push(d.date);
        values.push(d.value);
    });
    let data = {
        labels: labels,
        datasets: [{
            label: "Peso",
            data: values
        }]
    }

    let options = {
        legend: {
            display: false
        }
    }

    const config = {
        type: 'line',
        data: data,
        options: options
    };

    return config;
}

function drawChart(config, ctx) {
    pesoChart = new Chart(ctx, config);
}

function parseData() {
    let parsedData = [];
    let n = DATA.length;
    INDEX = n - 7;
    for (let i = INDEX; i < n; i++) {
        parsedData.push(DATA[i]);
    }
    return parsedData;
}

function slideLeft() {
    btnNext.removeClass("hidden");
    let parsedData = [];
    let n = INDEX;
    if (INDEX <= 7) {
        INDEX = 0;
        btnPrev.addClass("hidden");
    } else {
        INDEX = n - 7;
    }
    for (let i = INDEX; i < n; i++) {
        parsedData.push(DATA[i]);
    }
    updateChart(parsedData);
}

function slideRight() {
    btnPrev.removeClass("hidden");
    let parsedData = [];
    INDEX = INDEX + 7;
    let n = INDEX + 7;
    if (n >= DATA.length) {
        n = DATA.length;
        INDEX = n - 7;
        btnNext.addClass("hidden");
    }
    for (let i = INDEX; i < n; i++) {
        parsedData.push(DATA[i]);
    }
    updateChart(parsedData);
}

function updateChart(newData) {
    let labels = [];
    let values = [];
    newData.forEach(d => {
        labels.push(d.date);
        values.push(d.value);
    });
    pesoChart.config.data.labels = labels;
    pesoChart.config.data.datasets[0].data = values;
    pesoChart.update();
}