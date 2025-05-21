# Project Structure
-----
## Backend
```
WeatherMap_Backend/
├── Controllers/
│   └── WeatherController.cs
│
├── Program.cs
└── appsettings.json
```
## Frontend
```
WeatherMap_Frontend/
├── src/
│   ├── assets/
│   │   ├── icons
│   │   ├── languages
│   │   └── tailwind.css
│   │
│   ├── components/
│   │   ├── legend/
│   │   │   ├── DisplayLegend.vue
│   │   │   ├── LegendBar.vue
│   │   │   ├── PrecipitationLegend.vue
│   │   │   ├── PressureLegend.vue
│   │   │   ├── RainLegend.vue
│   │   │   ├── SnowLegend.vue
│   │   │   ├── TemperatureLegend.vue
│   │   │   └── WindLegend.vue
│   │   │
│   │   ├── BaseMapSwitcher.vue
│   │   ├── LanguageSwitcher.vue
│   │   ├── LayerSwitcher.vue
│   │   ├── MouseCoordinates.vue
│   │   └── TerminatorSwitcher.vue
│   │
│   ├── router/
│   │   └── index.js
│   │
│   ├── stores/
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── baseMap.js
│   │   ├── earthquakeData.js
│   │   ├── nightBoundary.js
│   │   └── weatherLayer.js
│   │
│   ├── views/
│   │   └── MapView.vue
│   │
│   ├── App.vue
│   └── main.js
│
├── package.json
└── tailwind.config.js
```