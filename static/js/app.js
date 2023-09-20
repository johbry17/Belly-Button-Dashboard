let jsonData;

// use d3 to read in samples.json from "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
source = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
d3.json(source).then(function(data){

    // store data for use outside of d3
    jsonData = data;

    // populate dropdown menu
    data.names.forEach((name) => {
        d3.select("#selDataset").append("option").text(name);
    });

    // select default
    let bellyButton = data.samples.filter(sample => sample.id === '940')[0];
    let meta = data.metadata.filter(sample => sample.id === 940)[0];

    //call chart functions
    barChart(topTen(bellyButton));
    bubbleChart(bellyButton);
    metaData(meta);
    washGauge(meta);

    d3.select("#selDataset").on("change", function() {
        optionChanged(this.value);
    });
});


function topTen(bellyButton) {

    // select topTen data
    // note: data is already sorted by sample_values
    data = bellyButton.sample_values.map((value, index) => ({
        sample_value: value,
        otu_id: bellyButton.otu_ids[index],
        otu_label: bellyButton.otu_labels[index],
    }));

    // slice the top ten, reverse the sort order for plotly
    let topTen = data.slice(0, 10).reverse();

    return topTen;
};


// create horizontal bar chart with dropdown menu to show top 10 OTUs
function barChart(topTen){

    let trace = {
        x: topTen.map(sample => sample.sample_value),
        y: topTen.map(sample => `OTU ${sample.otu_id}`),
        text: topTen.map(sample => sample.otu_label),
        type: 'bar',
        orientation: 'h',
    };

    let layout = {
        title: 'Top Ten OTUs',
    };

    Plotly.newPlot("bar", [trace], layout);

};


// create bubble chart that displays each sample
    // id #bubble
    // x = otu_ids; y = sample_values; marker size = sample_values; color = otu_ids; text = otu_labels
function bubbleChart(thing){

    let trace = {
        x: thing.otu_ids,
        y: thing.sample_values,
        text: thing.otu_labels,
        mode: 'markers',
        marker: {
            size: thing.sample_values,
            color: thing.otu_ids,
            colorscale: 'Viridis',
        },
    };

    let layout = {
        title: 'All OTU\'s'
    };

    Plotly.newPlot("bubble", [trace], layout);

};

// display metadata (demographic data) - each key: value pair
function metaData(thing) {

    // clear existing content
    d3.select('#sample-metadata').html("");

    Object.entries(thing).forEach(([key, value]) => {
        d3.select('#sample-metadata').append('p').text(`${key}: ${value}`);
    });
};



// // update all plots in real times as new data is selected
// add a d3.selectAll().on("click", optionChanged(thing)) above
function optionChanged(thing) {
    let bellyButton = jsonData.samples.find(sample => sample.id === thing);
    let meta = jsonData.metadata.find(sample => sample.id === parseInt(thing));
    console.log(bellyButton);
    barChart(topTen(bellyButton));
    bubbleChart(bellyButton);
    metaData(meta);
    washGauge(meta);
};

// feel free to get creative with dashboard formatting


// deploy to gitHub Pages


// optional: create belly button washing frequency gauge
function washGauge(thing) {
    console.log(thing);
    let colors = ["#ff0000", "#ff4000", "#ff8000", "#ffbf00", "#ffff00", "#bfff00", "#80ff00", "#40ff00", "#00ff00", "#00ff40"];
    let bins = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10"];

    // define steps
    let steps = bins.map((bin, i) => ({
        range: [i, i + 1],
        color: colors[i],
        text: bin,
    }));
    console.log(steps);

    let trace = {
        value: thing.wfreq,
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: { range: [null, 9] },
            steps: steps,
            textinfo: "text+value",
            // bar: { color: "black" },
        },
    };

    let layout = {
        title: "Washing Frequency",
    };

    Plotly.newPlot("gauge", [trace], layout);
};
