import { prepareBarData, buildBarFrame, showBars } from "./src/bars/bars.js";
import { showMap } from './src/map/map.js';
import { showLegend } from "./src/map/legend.js";
import { loadData } from "./src/common/loadData.js";
import { computeFrames } from './src/common/handleKeyFrames.js'
import { createSlider, updateSliderDot } from './src/slider/slider.js'

// Load data
const data = await loadData();
const keyframes = computeFrames(data);
const default_year = 1941;
const default_opacity = 0.8;
const mouse_over_opacity = 1;
let region_name = "National";

let currentFrameNumber = 0;

const body = d3.select("body");
const head = body.append("div").attr("id", "head").attr("align", "center")
head.append("h1").text("Covid-19 Country Spread")
    .attr("class", "head")
    .style("font-family", "Montserrat")
    .style("font", "bold")
    .style("font-size", `50px`);

const div_map_slider = d3.select("#content")
    .append("div")
    .attr("class", "div_map_slider")
    .style("width", "800px")
    .style("height", "490px")
    .style("display", "block")
    .style("margin", "auto")
    .style("border", "2px solid #aaaac2")
    .style("border-radius", "15px");

const svg_map = d3
    .select(".div_map_slider")
    .append("svg")
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

const tooltip = d3
    .select(".div_map_slider")
    .append("div")
    .style("display", "block")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "rgba(255, 255, 255, 0.7)")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");
const color_link = "https://raw.githubusercontent.com/Emidiant/crime-in-usa-visualisation/main/coordinates_extraction/state_coordinates/csv/color.csv";

const slider = d3
    .sliderHorizontal()
    .min(1941)
    .max(2022)
    .value(default_year)
    .step(1)
    .ticks(16)
    .width(750)
    .displayFormat(d3.format(".0f"))
    .tickFormat(d3.format(".0f"))
    .on('onchange', (year) => {
        d3.csv(color_link, function (d) {
            const red_fill = d3.interpolateReds(d[year]);
            svg_map
                .selectAll('.' + d.region)
                .style("fill", red_fill)
        });
    });

const slider_svg = d3
    .select(".div_map_slider")
    .append("svg")
    .attr("class", "#mySlider")
    .attr("width", 800)
    .attr("height", 80)
    .append("g")
    .attr("transform", "translate(30,30)")
    .call(slider);


const mouseover = function (d) {
    tooltip.style("visibility", "visible");

    d3.select(this)
        .style("stroke", "black")
        .style("opacity", mouse_over_opacity);
};

const mouseleave = function (d) {
    tooltip.style("visibility", "hidden");

    d3.select(this)
        .style("stroke", "grey")
        .style("opacity", default_opacity);
};

const mousemove = function (d) {
    const region_name = d.target.firstChild.nodeValue;

    tooltip
        .style("top", d.pageY + "px")
        .style("left", d.pageX + "px")
        .html(region_name);
};

const state_click = function (d) {
    region_name = d.target.firstChild.nodeValue;
    state_div.text(region_name);
    crime_chart.selectAll("g").remove();
    crime_chart.selectAll("path").remove();
    crime = d3.select(".chart1").select("select").property("value");
    draw_crime_graph(crime, region_name);
    murder_chart.selectAll("g").remove();
    murder_chart.selectAll("path").remove();
    murder_chart.select("image").remove();
    murder_chart.select("text").remove();
    murder_weapon = d3.select(".chart2").select("select").property("value");
    draw_murder_graph(murder_weapon, region_name);
};

draw_map(default_year);

function draw_map(year) {
    const link_master = "ressources/regions-et-collectivites-doutre-mer-millesime-france.csv"
    d3.csv(link_master, function (data) {
        const region_name = data.Nom;
        const state_points = JSON.parse(data.GeoPoint);
        const red_fill = d3.interpolateReds(data[year]);
        if (data.GeoShape !== "Multipolygon") {
            svg_map
                .append("polyline")
                .attr("class", region_name)
                .style("fill", red_fill)
                .text(region_name)
                .attr("points", state_points);
        } else {
            for (let i = 0; i < state_points.length; i += 1) {
                svg_map
                    .append("polyline")
                    .attr("class", region_name)
                    .text(data.state)
                    .style("fill", red_fill)
                    .attr("points", state_points[i]);
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
    svg_map.attr("transform", "translate(-20,-25)")
}