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

    // set default, which populates plots
    d3.select('#selDataset').property('value', '940').dispatch('change');

    // change plots dynamically when dropdown menu changes
    d3.select("#selDataset").on("change", function() {
        optionChanged(this.value);
    });
});


// // update all plots as new data is selected
function optionChanged(id) {

    // select data
    let bellyButton = jsonData.samples.find(sample => sample.id === id);
    let meta = jsonData.metadata.find(sample => sample.id === parseInt(id));
    
    // update plots
    barChart(bellyButton);
    bubbleChart(bellyButton);
    metaData(meta);
    washGauge(meta);
};


// create horizontal bar chart with dropdown menu to show top 10 OTUs
function barChart(bellyButton){

    // slice off top Ten, reverse order for plotly
    // note that sample_values are already sorted in descending order
    let topTen = bellyButton.sample_values.slice(0, 10).reverse();
    let labels = bellyButton.otu_labels.slice(0, 10).reverse();

    // create trace
    let trace = {
        x: topTen,
        //.slice().reverse() to create a copy of the array and reverse it
        y: labels.map((label, index) => `OTU ${bellyButton.otu_ids[index]}`).slice().reverse(),
        text: labels,
        type: 'bar',
        orientation: 'h',
    };

    // create layout
    let layout = {
        title: 'Top Ten OTUs',
    };

    // plot chart
    Plotly.newPlot("bar", [trace], layout);

};


// create bubble chart that displays all sample values
function bubbleChart(bellyButton){

    // create trace
    let trace = {
        x: bellyButton.otu_ids,
        y: bellyButton.sample_values,
        text: bellyButton.otu_labels,
        mode: 'markers',
        marker: {
            size: bellyButton.sample_values,
            color: bellyButton.otu_ids,
            colorscale: 'Viridis',
        },
    };

    // set layout
    let layout = {
        title: 'All OTU\'s'
    };

    //plot chart
    Plotly.newPlot("bubble", [trace], layout);

};


// display metadata (demographic data) - each key: value pair
function metaData(person) {

    // clear existing content
    d3.select('#sample-metadata').html("");

    // populate the table   
    Object.keys(person).forEach((key) => {
        value = person[key];
        d3.select('#sample-metadata').append('p').text(`${key}: ${value}`);
    });
};


// optional: create belly button washing frequency gauge
function washGauge(thing) {
    
    // set colors and bins for steps
    let colors = ["#ff0000", "#ff4000", "#ff8000", "#ffbf00", "#ffff00", "#bfff00", "#80ff00", "#40ff00", "#00ff00"];
    let bins = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"];

    // define steps
    let steps = bins.map((bin, i) => ({
        range: [i, i + 1],
        color: colors[i],
        text: bin,
    }));

    // define trace
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
