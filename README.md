# WeatherMap
A practice project of implement basic weather map website  

-----
### Backend:
.NET core api  
### Frontend:
vue.js  

-----
## Additional packages added
### Vue Frontend:
- Tailwindcss:For css styling
- Pinia:For data storage and sync
- Leaflet:For map display

-----
## Project setup and compile on development
For backend part:  
1. Create a visual studio 2022 .net core web api project in WeatherMap folder.
2. When need to compile and test via cmd, enter the following commands:  
```sh
cd WeatherMap/WeatherMap_Backend/WeatherMap_Backend
```  
```sh
dotnet run
```  
  
For frontend part:  
1. Create a new vue default project by the following commands and steps:  
```sh
cd WeatherMap
```  
```sh
npm create vite@latest WeatherMap_Frontend
```  
Select framework as vue, choose variant as Offical Vue Starter.  
Select Router and ESLint.  
```sh
npm install
```  

3. When need to compile and test via cmd, enter the following commands:  
```sh
cd WeatherMap/WeatherMap_Frontend
```  
```sh
npm run dev
```  

-----
## Features
1. Backend architecture:
  - Utilizes in-memory caching to store weather map layer data for 1 hour.
  - Reduces API call frequency and improves performance.

2. Weather layer data:
  - Retrieves weather map layers from OpenWeatherMap's free API:
    - Cloud coverage
    - Rainfall
    - Snowfall
    - Precipitation
    - Temperature
    - Pressure
  - Fetches earthquake data from USGS open API for the current day.

3. Map display features:
  - Uses CartoCDN as the base map for smooth and visually appealing rendering.
  - Interactive weather map display using tile-based overlays.
  - Shows current mouse location's latitude and longitude.
  - Displays a color scale bar for the selected data layer, showing value ranges for better reference.
