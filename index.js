import { prepareBarData, buildBarFrame, showBars } from "./src/bars/bars.js";
import { showMap } from './src/map/map.js';
import { showLegend } from "./src/map/legend.js";
import { loadData } from "./src/common/loadData.js";
import { computeFrames } from './src/common/handleKeyFrames.js'
import { createSlider, updateSliderDot } from './src/slider/slider.js'

// Load data
const data = await loadData();
const keyframes = computeFrames(data);

const BARS_MODE = 'bars';
const MAP_MODE = 'map';

let mode = MAP_MODE;

let timer;
let currentFrameNumber = 0;

function displayVisualizationByMode(new_mode) {
    switch (new_mode) {
        case BARS_MODE:
            mode = new_mode;
            showBars(svg, currentFrameNumber, keyframes);
            break;

        case MAP_MODE:
            mode = new_mode;
            showMap(svg, keyframes[currentFrameNumber]);
            break;
    }
}

function showMapLegendByMode(new_mode) {
    const mapLegendEl = document.getElementById("map-legend");
    switch (new_mode) {
        case BARS_MODE:
            mapLegendEl.style.display = 'none';
            break;

        case MAP_MODE:
            mapLegendEl.style.display = 'block';
            showLegend(legendSvg);
            break;
    }
}

const body = d3.select("body");
const head = body.append("div").attr("id", "head").attr("align", "center")
head.append("h1").text("Covid-19 Country Spread")
    .attr("class", "head")
    .style("font-family", "Montserrat")
    .style("font", "bold")
    .style("font-size", `50px`);

const main_button_panel = body.append("div").attr("id", "main_button_panel").attr("align", "center")
const mapChartButton = main_button_panel
    .append("button")
    .attr("id", "map_button")
    .text("Map Chart")
    .style("font-family", "Montserrat")
    .style("margin-right", "4em")
    .on("click", function () {
        
        showMapLegendByMode(MAP_MODE);

        d3.selectAll("*").interrupt();
        svg.selectAll("*").remove();
    
        displayVisualizationByMode(MAP_MODE);
    })

const barChartButton = main_button_panel
    .append("button")
    .attr("id", "bar_button")
    .text("Bar Chart")
    .style("font-family", "Montserrat")
    .on("click", function () {
    
        showMapLegendByMode(BARS_MODE);

        d3.selectAll("*").interrupt();
        svg.selectAll("*").remove();
        buildBarFrame(svg, keyframes);

        displayVisualizationByMode(BARS_MODE);

    })

const slider_panel = body.append("div")
    .attr("id", "slider_panel")
    .attr("align", "center")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("align-items", "center")
createSlider(slider_panel, (newFrameNumber) => {
    currentFrameNumber = newFrameNumber
    displayVisualizationByMode(mode)
})

const main_panel = body.append("div").attr("id", "main_panel");
const mapLegend = main_panel.append("div")
    .attr("id", "map-legend")
    .attr("align", "left")
    .attr("style", "display:none; height:30px; width:400px; margin-bottom:50px;");

var svg = main_panel.append("svg").attr("id", "main_svg");
var legendSvg = mapLegend.append("svg");

prepareBarData(data, keyframes);
buildBarFrame(svg, keyframes);
showMap(svg, keyframes);