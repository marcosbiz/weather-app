const request = require('request');
const key = process.env.WEATHER_APP_KEY

var geocodeAddress = (address, callback) => {
    let encodedAddress = encodeURIComponent(address);

    request({
        url: `http://www.mapquestapi.com/geocoding/v1/address?key=${key}&location=${encodedAddress}`,
        json: true
    }, (error, response, body) => {
        if (error) {
            callback('Unable to connect to MapQuestAPI servers.');
        } else if (body.info.statuscode === 400) {
            callback('Unable to find that address.')
        } else if (body.info.statuscode === 0) {
            callback(undefined, {
                address: `${body.results[0].locations[0].street}, ${body.results[0].locations[0].adminArea5}, ${body.results[0].locations[0].adminArea3} ${body.results[0].locations[0].postalCode}, ${body.results[0].locations[0].adminArea1}`,
                latitude: body.results[0].locations[0].displayLatLng.lat,
                longitude: body.results[0].locations[0].displayLatLng.lng
            })
        }
    });
};

module.exports.geocodeAddress = geocodeAddress;