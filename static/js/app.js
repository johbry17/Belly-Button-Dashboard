// use d3 to read in samples.json from "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
source = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
d3.json(source).then(function(data){

    // populate dropdown menu
    data.names.forEach((name) => {
        d3.select("#selDataset").append("option").text(name);
    });

    // select default
    let bellyButton = data.samples.filter(sample => sample.id === '940')[0];
    //call barChart function
    barChart(topTen(bellyButton));
    bubbleChart(bellyButton);
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
    console.log(thing);

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
    // id #sample-metadata


// // update all plots in real times as new data is selected
// function optionChanged(thing) {
//     thing = String(thing);
//     let bellyButton = data.samples.find(sample => sample.id === thing);
//     barChart(bellyButton);
// };

// feel free to get creative with dashboard formatting


// deploy to gitHub Pages


// optional: create belly button washing frequency gauge
// id #gauge
// put in separate bonus.js file


// samples is a {dict of three keys, 
// names [a list], 
// metadata [a list of {dicts}, 
// and samples [another list of {dicts}]]}