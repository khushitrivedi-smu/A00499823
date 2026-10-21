# About Me & My Town

A responsive React app introducing Khushi Trivedi and her home city, Ahmedabad, Gujarat. It includes live weather, temperature-based illustrations, and a local city guide.

## Features

- Two views: About Me and My Town, with working navigation between them.
- Live current weather for Ahmedabad, fetched from Open-Meteo.
- Celsius/Fahrenheit toggle. Weather artwork is selected using the Celsius temperature.
- Weather illustrations by temperature:
  - `10°C` or colder: `cold.png`
  - Above `10°C` and below `20°C`: `mild.png`
  - `20°C` or warmer: `sunny.png`
- Loading and error messages, with a retry button if the weather request fails.
- Sabarmati Riverfront photo, Ahmedabad highlights, and responsive styling.

## Run the App

**Requirements:** Node.js 18 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

To create and preview a production build:

```sh
npm run build
npm run preview
```

## Weather Data

The app requests current weather from the [Open-Meteo Forecast API](https://open-meteo.com/) using Ahmedabad coordinates (`23.0225, 72.5714`). No API key is required. Temperature thresholds use the Celsius value returned by the API, regardless of the selected display unit.

Weather data is provided by Open-Meteo. See its [terms and attribution requirements](https://open-meteo.com/en/terms).

## Photo Credit

The Sabarmati Riverfront photo is by [Manjil Purohit](https://commons.wikimedia.org/wiki/File:View_of_Sabarmati_Riverfront,_Ahmedabad.jpg) and is licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

## Project Structure

```text
src/
  App.jsx       Views, navigation, weather logic
  main.jsx      React entry point
  styles.css    Responsive page styling
public/
  images/
    sabarmati-riverfront.jpg
  weather/
    cold.png
    mild.png
    sunny.png
```

Edit `src/App.jsx` to change the profile text, city description, or favorite places.

## Deployment

To deploy with Vercel:

1. Push the project to a GitHub repository.
2. Import the repository in Vercel.
3. Use `npm run build` as the build command and `dist` as the output directory.
4. Deploy. No environment variables are needed.

## AI Use Disclosure

GitHub Copilot was used to help scaffold the app, implement the weather request, unit conversion, temperature-based image selection and responsive layout, and draft this README. The live weather behavior and temperature conversion were tested in the browser. The profile content was provided by Khushi.
