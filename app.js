const fetch = require('node-fetch');
const fs = require('fs');
const moment = require('moment');
const notifier = require('node-notifier');
const path = require('path');
const process = require('process');
const weather = require('weather-js');

const weatherOptions = {
    search: process.argv.length && process.argv.length > 2 ? process.argv[2] : 'Bratislava',
    degreeType: process.argv.length && process.argv.length > 3 ? process.argv[3] : 'C',
    lang: process.argv.length && process.argv.length > 4 ? process.argv[2] : 'sk'
};

function displayWeatherInformation({ result, today, tomorrow, contentImage }) {
    notifier.notify({
        title: `${result[0].current.temperature}°${result[0].location.degreetype} - ${result[0].current.observationpoint}`,
        subtitle: `${today.formattedDate}: ${today.skytextday}, ${today.low}°${result[0].location.degreetype}-${today.high}°${result[0].location.degreetype}${today.precip ? `, ${today.precip}%` : ''}`,
        message: `${tomorrow.formattedDate}: ${tomorrow.skytextday}, ${tomorrow.low}°${result[0].location.degreetype}-${tomorrow.high}°${result[0].location.degreetype}${tomorrow.precip ? `, ${tomorrow.precip}%` : ''}`,
        contentImage,
        open: `http://www.msn.com/en-us/weather/weathersearch?q=${result[0].location.name}&form=PRWKWB&mkt=en-us&httpsmsn=1&refig=0ac1ee17f2fd48fc875e1a54b1e8637c&savedegree=true&weadegreetype=C`
    }, (error, response) => {
        if (error) {
            console.error('Got a notification center error:', error, response);
        }
    });
}

function displayError(message) {
    notifier.notify({
        title: `${weatherOptions.search}`,
        message,
        open: `http://www.msn.com/en-us/weather/weathersearch?q=${weatherOptions.search}&form=PRWKWB&mkt=en-us&httpsmsn=1&refig=0ac1ee17f2fd48fc875e1a54b1e8637c&savedegree=true&weadegreetype=C`
    }, (error, response) => {
        if (error) {
            console.error('Got a notification center error', error, response);
        }
    });
}

function getWeatherImage({ stream, id }) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, 'cache', `${id}.gif`);

        fs.stat(filePath, err => {
            if (err) {
                let writeStream = fs.createWriteStream(filePath);

                stream.on('end', () => {
                    resolve({ contentImage: filePath });
                });
                stream.on('error', err => {
                    reject(err);
                });

                stream.pipe(writeStream);
            } else {
                resolve({ contentImage: filePath });
            }
        });
    });
}

weather.find(weatherOptions, (err, result) => {
    if (err) {
        displayError(`Failed to fetch weather information: ${err}`);
        return;
    }

    if(!result.length) {
        displayError(`No weather information for ${weatherOptions.search}`);
        return;
    }

    let today = result[0].forecast.find(f => f.date == moment().format('YYYY-MM-DD'));
    today.formattedDate = moment(today.date).locale(weatherOptions.lang).format('dddd');
    let tomorrow = result[0].forecast.find(f => f.date == moment().add(1, 'days').format('YYYY-MM-DD'));
    tomorrow.formattedDate = moment(tomorrow.date).locale(weatherOptions.lang).format('dddd');

    fetch(`${result[0].location.imagerelativeurl}${today.skycodeday}.gif`)
        .then(res => getWeatherImage({ stream: res.body, id: today.skycodeday }))
        .then(res => displayWeatherInformation({ result, today, tomorrow, contentImage: res.contentImage }))
        .catch(err => {
            console.log(err);
            displayWeatherInformation({ result, today, tomorrow });
        });
});
