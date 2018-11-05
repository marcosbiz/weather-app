const request = require('request');
const yargs = require('yargs');
const key = process.env.WEATHER_APP_KEY

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

request({
    url: `http://www.mapquestapi.com/geocoding/v1/address?key=${key}&location=${encodedAddress}`,
    json: true
}, (error, response, body) => {
    if (error) {
        console.log('Unable to connect to MapQuestAPI servers.');
    } else if (body.info.statuscode === 400) {
        console.log('Unable to find that address.')
        console.log(`Message: ${body.info.messages[0]}`);
    } else if (body.info.statuscode === 0) {
        console.log(`Adress: ${body.results[0].locations[0].street}, ${body.results[0].locations[0].adminArea5}, ${body.results[0].locations[0].adminArea3} ${body.results[0].locations[0].postalCode}, ${body.results[0].locations[0].adminArea1}`);
        console.log(`Latitude: ${body.results[0].locations[0].displayLatLng.lat}`);
        console.log(`Longitude: ${body.results[0].locations[0].displayLatLng.lng}`);
    }
});