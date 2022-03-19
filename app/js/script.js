
let DATA;
let LEFT_INDEX = 0;
let RIGHT_INDEX = 0;
let pesoChart;
let btnNext;
let btnPrev;
let xDown = null;
let yDown = null;

$(document).ready(function () {
    btnNext =  $("#next");
    btnPrev =  $("#prev");
    $('.chart-container').on("touchstart", function(evt) {
        const firstTouch = evt.touches[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY; 
    });
    $('.chart-container').on("touchmove", function(evt) {
        if (!xDown || !yDown) {
            return;
        }
        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
                                                                            
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                console.log("right swipe!");
                if (RIGHT_INDEX < DATA.length) {
                    slideRight();
                }
            } else {
                console.log("left swipe")
                if (LEFT_INDEX > 0) {
                    slideLeft();
                }
                
            }                       
        }
        /* reset values */
        xDown = null;
        yDown = null; 
        });
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
        },
        scales: {
            y: {
                max: 65,
                min: 53,
                ticks: {
                    stepSize: 0.5
                }
            }
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