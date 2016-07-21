# weather-notification

This is a simple weather notification tool.

Once started, it fetches the weather information (current and forecast from MSN Weather) and displays that as a notification. Clicking the notification will open the Weather details page.

## After cloning

Don't forget to fetch the modules:

`npm install`

## Usage

`node app [Location] [Degree Types] [Language]`

If parameters are not specified, default values are used:
* _Location_ is a search string, defaults to _Bratislava_
* _Degree Types_ specifies degree types, can be on of _C_ (Celsius) and _F_ (Fahrenheit), defaults to _C_
* _Language_ specifies the language for textual information, defaults to _sk_  

## Notifications

Notifications are supported on all operating systems supported by `node-notifier` module. Check the [node-notifier details here](https://github.com/mikaelbr/node-notifier).

![Screenshot](https://raw.githubusercontent.com/mifko/weather-notification/master/example/notification-example.png)

## Wather information

Weather information is fetched from MSN weather using the `weather-js` module. Check the [weather-js details here](https://github.com/fatihcode/weather).

The notification displays:
* _Title_: Current temperature and location
* _Subtitle_: Today's forecast (Sky text, min and max temperatures and precipitation)
* _Message_: Tomorrow's forecast (Sky text, min and max temperatures and precipitation)
* _Icon_: Today's forecast sky icon

Icon is cached in the `cache` subfolder so that future weather checks do not re-download it when not needed.

## Scheduling

Scheduling is not part of the tool as there are so many options. 

If you run *nix system, you can use cron.

First, edit the crontab with nano editor:

`EDITOR=nano crontab -e`

In the editor set up the scheduling plan, e.g. to run at every hour, you can specify:

`0 * * * * /path/to/node /path/to/weather-notification/app.js`

Not sure about cron syntax? Checkout the awesome http://crontab.guru/

To exit the editor simply press the `Ctrl+X` and confirm you want to save the file.