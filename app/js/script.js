
let DATA;
let LEFT_INDEX = 0;
let RIGHT_INDEX = 0;
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
            label: "Peso (kg)",
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
    LEFT_INDEX = n - 7;
    RIGHT_INDEX = n;
    for (let i = LEFT_INDEX; i < n; i++) {
        parsedData.push(DATA[i]);
    }
    return parsedData;
}

function slideLeft() {
    btnNext.removeClass("hidden");
    let parsedData = [];
    RIGHT_INDEX = LEFT_INDEX;
    LEFT_INDEX -= 7;
    if (LEFT_INDEX <= 0) {
        LEFT_INDEX = 0;
        btnPrev.addClass("hidden");
    } 
    for (let i = LEFT_INDEX; i < RIGHT_INDEX; i++) {
        parsedData.push(DATA[i]);
    }
    updateChart(parsedData);
}

function slideRight() {
    btnPrev.removeClass("hidden");
    let parsedData = [];
    LEFT_INDEX = RIGHT_INDEX;
    RIGHT_INDEX += 7;
    if (RIGHT_INDEX >= DATA.length) {
        RIGHT_INDEX = DATA.length;
        btnNext.addClass("hidden");
    }
    for (let i = LEFT_INDEX; i < RIGHT_INDEX; i++) {
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