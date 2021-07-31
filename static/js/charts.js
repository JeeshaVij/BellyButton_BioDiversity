function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });  
  var firstSample = sampleNames[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);
})}



function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

init();
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
  var samples = data.samples;
  var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
  var result = resultArray[0];
  var otu_ids = result.otu_ids;
  var otu_labels = result.otu_labels;
  var sample_values = result.sample_values;
  var metadata = data.metadata;
  var resultArray_metadata = metadata.filter(sampleObj => sampleObj.id == sample);
  var result_metadata = resultArray_metadata[0];
  var wfreq = result_metadata.wfreq;
  
  // BellyButton_bar_chart
  var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
  
  var trace1 = {
    x: sample_values.slice(0,10).reverse(),
    y: yticks,
    text: otu_labels.slice(0,10).reverse(),
    name: "Greek",
    type: "bar",
    orientation: "h"
};
var barData = [trace1];
var barLayout = {
    title: "Top Ten OTUs for Individual " +sample,
    margin: {l: 100, r: 100, t: 100, b: 100},
    font: { color: "#49a81d", family: "Arial, Helvetica, sans-serif" }
};
Plotly.newPlot("bar", barData, barLayout);

// BellyButton_bubble_chart
var trace1 = {
  x: otu_ids,
  y: sample_values,
  text: otu_labels,
  mode: 'markers',
  marker: {
  size: sample_values,
  color: otu_ids,
  colorscale: 'Bluered',
  }
};
var bubbleData = [trace1];
var bubbleLayout = {
  title: 'Bacteria Cultures per Sample',
  showlegend: false,
  hovermode: 'closest',
  xaxis: {title:"OTU (Operational Taxonomic Unit) ID " +sample},
  font: { color: "#49a81d", family: "Arial, Helvetica, sans-serif" },
  margin: {t:30}
};
Plotly.newPlot('bubble', bubbleData, bubbleLayout); 


// BellyButton_gauge

var gaugeData = [
{
  domain: { x: [0, 1], y: [0, 1] },
  marker: {size: 28, color:'850000'},
  value: wfreq,
  title: 'Belly Button Washing Frequency<br> Scrubs per Week',
  titlefont: {family: '"Arial, Helvetica, sans-serif'},
  type: "indicator",
  mode: "gauge+number",
  bgcolor: "lavender",
  gauge: { axis: {range: [0, 10]},
           steps: [
            { range: [0, 1], color: "#fff4ed" },
            { range: [1, 2], color: "#ffddc6" },
            { range: [2, 3], color: "#ffc59f" },
            { range: [3, 4], color: "#ffae78" },
            { range: [4, 5], color: "#ff9650" },
            { range: [5, 6], color: "#ff7e29" },
            { range: [6, 7], color: "#ff6702" },
            { range: [7, 8], color: "#ed5f00" },
            { range: [8, 9], color: "#c64800" },
            { range: [9, 10],color: "#c54800" }
          ], tickwidth: 1, tickcolor: "darkblue" },
          threshold: {
            line: { color: "black", width: 4 },
            thickness: 0.75,
            value: 490
          }
  
}
];

var gaugeLayout = {
 margin: { t: 100, r: 100, l: 100, b: 100 },
 line: {
 color: '600000'
 },
 font: { color: "#49a81d", family: "Arial, Helvetica, sans-serif" }
};


Plotly.newPlot("gauge", gaugeData, gaugeLayout);

});
}