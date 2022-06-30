import { prepareBarData, buildBarFrame, showBars } from "./src/bars/bars.js";
import { showMap } from './src/map/map.js';
import { showLegend } from "./src/map/legend.js";
import { loadData } from "./src/common/loadData.js";
import { computeFrames } from './src/common/handleKeyFrames.js'
import { createSlider, updateSliderDot } from './src/slider/slider.js'

// Load data
const data = await loadData();
const keyframes = computeFrames(data);
const base_year = 1941

let currentFrameNumber = 0;

const body = d3.select("body");
const head = body.append("div").attr("id", "head").attr("align", "center")
head.append("h1").text("French elections and immigration map")
    .attr("class", "head")
    .style("font-family", "Montserrat")
    .style("font", "bold")
    .style("font-size", `50px`);

const barChartButton = main_button_panel
    .append("button")
    .attr("id", "bar_button")
    .text("Display immigration")
    .style("font-family", "Montserrat")
    .on("click", function () {
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
const svg_map = mapLegend.append("svg")
    .attr("width", 800)
    .attr("height", 400)
    .append("g");

svg_map.append("g")
    .attr("transform", "translate(555,30)")
    .append(() => Legend(
        d3.scaleSequential([0.00032, 0.00332], d3.interpolateReds), {
        width: 260,
        ticks: 5,
        title: "Murder percentage of total crimes in the state",
        tickFormat: "%"
    }));

draw_map(base_year);
function draw_map(year) {
    const link_master = "https://raw.githubusercontent.com/Emidiant/crime-in-usa-visualisation/main/coordinates_extraction/state_coordinates/csv/polygon.csv"
    d3.csv(link_master, function (data) {
        const state_name = data.state;
        const state_points = JSON.parse(data.new_coordinates);
        const red_fill = d3.interpolateReds(data[year]);
        if (state_name !== "Alaska" && state_name !== "Hawaii") {
            if (data.type !== "multipolygon") {
                svg_map
                    .append("polyline")
                    .attr("class", state_name)
                    .style("fill", red_fill)
                    .text(state_name)
                    .attr("points", state_points);
            } else {
                for (let i = 0; i < state_points.length; i += 1) {
                    svg_map
                        .append("polyline")
                        .attr("class", state_name)
                        .text(data.state)
                        .style("fill", red_fill)
                        .attr("points", state_points[i]);
                }
            }
        } else {
            if (state_name === "Alaska") {
                for (let i = 0; i < state_points.length; i += 1) {
                    svg_map
                        .append("polyline")
                        .text(state_name)
                        .attr("class", state_name)
                        .style("fill", red_fill)
                        .attr("points", state_points[i])
                        .attr("transform", "translate(-90,-1075)");
                }
            } else {
                for (let i = 0; i < state_points.length; i += 1) {
                    svg_map
                        .append("polyline")
                        .attr("class", state_name)
                        .text(state_name)
                        .style("fill", red_fill)
                        .attr("points", state_points[i])
                        .attr("transform", "translate(680, 250)");
              }
            }
        }
        svg_map.selectAll("polyline")
            .attr("stroke", "grey")
            .attr("opacity", default_opacity)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("click", state_click)
            .on("mouseleave", mouseleave);
});

// перемещение карты после отрисовки
svg_map.attr("transform", "translate(-20,-25)")
}