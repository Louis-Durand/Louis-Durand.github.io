let memorizedCovidData;
let memorizedCountryData

// Load data
async function loadData() {
    if (memorizedCovidData !== undefined) {
        return memorizedCovidData;
    }
    // Data from notebook
    memorizedCovidData = await d3.csv(
        "../../ressources/augmented_covid_19.csv", d3.autoType);
    return memorizedCovidData
}

async function loadCountryData() {
    if (memorizedCountryData !== undefined) {
        return memorizedCountryData;
    }
    // Data from topo-json
    memorizedCountryData = await d3.json(
        "../../ressources/a-dep2021.json", d3.autoType);

    return memorizedCountryData
}

export { loadData, loadCountryData }