const DEFAULTDATA = 'data/default-data.json';

const fs = require('fs');

const fetchLocation = () => {
    try {
        let locationString = fs.readFileSync(DEFAULTDATA);
        return JSON.parse(locationString);
    } catch (e) {
        return undefined;
    }
};

const saveLocation = (location) => {
    fs.writeFileSync(DEFAULTDATA, JSON.stringify(location));
};

const removeLocation = () => {
    fs.unlinkSync(DEFAULTDATA);
};

module.exports = {
    saveLocation,
    removeLocation,
    fetchLocation
};