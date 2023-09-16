// use d3 to read in samples.json from "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
source = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
data = d3.json(source).then(function(data){
    console.log(data);

    // dropdown menu
    // select html element
    let dropdown = document.getElementById("selDataset");
    // loop over names to create dropdown names
    data.names.forEach((id) => {
        // create html option tag
        option = document.createElement("option");
        // set value and text
        option.value = id;
        option.text = id;
        // add to dropdown menu
        dropdown.appendChild(option);
    });

    // select default
    let bellyButton = data.samples.filter(sample => sample.id === '940')[0];
    //call barChart function
    barChart(topTen(bellyButton));
});


function topTen(bellyButton) {

    // select topTen data
    sortable = bellyButton.sample_values.map((value, index) => ({
        sample_value: value,
        otu_id: bellyButton.otu_ids[index],
        otu_label: bellyButton.otu_labels[index],
    }));

    // sort the data
    sorted = sortable.sort((a, b) => b.sample_value - a.sample_value);

    // slice the top ten, reverse the sort order
    let topTen = sorted.slice(0, 10).reverse();

    return topTen;
};


// create horizontal bar chart with dropdown menu to show top 10 OTUs
//     id #bar
//     x = sample_values; y = otu_ids; hovertext of otu_labels
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