const yargs = require('yargs');
const axios = require('axios');

const geocodeKey = process.env.WEATHER_APP_KEY;
const weatherKey = process.env.DARK_SKY_APP_KEY;

const argv = yargs
    .options({
        a: {
            demand: true, 
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

let encodedAddress = encodeURIComponent(argv.address);
let geocodeUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=${geocodeKey}&location=${encodedAddress}`;

axios.get(geocodeUrl).then((response) => {
    if (response.data.info.statuscode === 400) {
        throw new Error('Unable to find that address.');
    }

    var lat = response.data.results[0].locations[0].displayLatLng.lat;
    var lng = response.data.results[0].locations[0].displayLatLng.lng;
    console.log(lat, lng);
    let weatherUrl = `https://api.darksky.net/forecast/${weatherKey}/${lat},${lng}`;

    console.log(`${response.data.results[0].locations[0].street}, ${response.data.results[0].locations[0].adminArea5}, ${response.data.results[0].locations[0].adminArea3} ${response.data.results[0].locations[0].postalCode}, ${response.data.results[0].locations[0].adminArea1}`);

    return axios.get(weatherUrl);
}).then((response) => {
    let temperature = response.data.currently.temperature;
    let apparentTemperature = response.data.currently.apparentTemperature;
    console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`);
}).catch((e) => {
    if (e.code === 'ENOTFOUND') {
        console.log('Unable to connect to API servers.');
    } else {
        console.log(e.message);
    }
});