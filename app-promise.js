const yargs = require('yargs');
const axios = require('axios');

const defaultLocation = require('./default/default');

const geocodeKey = process.env.WEATHER_APP_KEY;
const weatherKey = process.env.DARK_SKY_APP_KEY;

const argvOpsAdress = {
    demand: true, 
    alias: 'a',
    describe: 'Address to fetch weather for',
    string: true
}

const argvOpsCelsius = {
        demand: false,
        alias: 'c',
        describe: 'Show temperature in celsius',
        boolean: true
}

const argv = yargs
    .command('default', 'Set a default location', {})
    .command('remove', 'Remove default location', {})
    .options({
        address: {...argvOpsAdress, demand: false},
        celsius: argvOpsCelsius
    })
    .help()
    .alias('help', 'h')
    .argv;

let command = argv._[0];

let encodedAddress = encodeURIComponent(argv.address);
let weatherUnit = (argv.celsius) ? "?units=ca" : "";

if (command === 'default') {
    if (argv.address) {
        defaultLocation.saveLocation({encodedAddress: encodedAddress, weatherUnit: weatherUnit});
        console.log('Location saved as default.');
    } else {
        console.log('No location specified.');
    }
}
else if (command === 'remove') {
    defaultLocation.removeLocation();
} else {
    if (!(argv.address)) {
        const savedLocation = defaultLocation.fetchLocation();

        if (savedLocation) {
            encodedAddress = savedLocation.encodedAddress;
            weatherUnit = savedLocation.weatherUnit;
        } else {
            console.log('No default location defined.');
            process.exit(1);
        }
    }

    let geocodeUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=${geocodeKey}&location=${encodedAddress}`;

    axios.get(geocodeUrl).then((response) => {
        if (response.data.info.statuscode === 400) {
            throw new Error('Unable to find that address.');
        }

        var lat = response.data.results[0].locations[0].displayLatLng.lat;
        var lng = response.data.results[0].locations[0].displayLatLng.lng;
        console.log(lat, lng);
        let weatherUrl = `https://api.darksky.net/forecast/${weatherKey}/${lat},${lng}${weatherUnit}`;

        console.log(`${response.data.results[0].locations[0].street}, ${response.data.results[0].locations[0].adminArea5}, ${response.data.results[0].locations[0].adminArea3} ${response.data.results[0].locations[0].postalCode}, ${response.data.results[0].locations[0].adminArea1}`);

        return axios.get(weatherUrl);
    }).then((response) => {
        let temperature = response.data.currently.temperature;
        let apparentTemperature = response.data.currently.apparentTemperature;
        let precipType = response.data.currently.precipType;
        let precipProbability = parseInt(response.data.currently.precipProbability * 100);
        console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`);
        if (precipProbability > 0) {
            console.log(`There is a change of ${precipProbability}% ${precipType}`);
        };
    }).catch((e) => {
        if (e.code === 'ENOTFOUND') {
            console.log('Unable to connect to API servers.');
        } else {
            console.log(e.message);
        };
    });
};