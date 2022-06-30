let memoizedCovidData;
let memoizedCountryData

// Load data
async function loadData() {
    if (memoizedCovidData !== undefined) {
        return memoizedCovidData;
    }
    // Data from notebook
    memoizedCovidData = await d3.csv(
        "../../ressources/augmented_covid_19.csv", d3.autoType);
    return memoizedCovidData
}

async function loadCountryData() {
    if (memoizedCountryData !== undefined) {
        return memoizedCountryData;
    }
    // Data from topo-json
    memoizedCountryData = await d3.json(
        "../../ressources/countries-50m.json", d3.autoType);

    return memoizedCountryData
}

export { loadData, loadCountryData }