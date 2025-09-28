# Prayer Times App

An interactive web application to display prayer times based on **Continent → Country → City**, with support for different calculation methods.
The app allows users to view the five daily prayers and highlights the next upcoming prayer.

##  Features
- Select **Continent → Country → City** for accurate prayer times.
- Support for multiple **calculation methods**.
- Display of the five main prayers: **Fajr, Dhuhr, Asr, Maghrib, Isha**.
- Highlight the **next prayer** with clear details.
- Toggle between **12-hour and 24-hour formats**.
- Clear **error handling messages** in case of API/data issues.
- **Reset button** to clear all selections and restore defaults.
- Smooth user interface with **loading indicators** during data fetching.

##  Project Structure
```
project-root/
│── index.html          # Main entry point
│── style.css           # Application styles
│── Js/                 # JavaScript modules
│   ├── api.js
│   ├── config.js
│   ├── dom-utils.js
│   ├── errors.js
│   ├── events.js
│   ├── init.js
│   ├── index.js
│   ├── prayer.js
│   ├── storage.js
│   ├── time-utils.js
│   └── utils.js
```

## 🔍 How It Works
1. User selects a continent → fetches available countries.  
2. After selecting a country → fetches cities.  
3. User selects a city and calculation method.  
4. Prayer times are fetched from the API and displayed in a table.  
5. The next prayer is highlighted separately.  


##  Technologies Used
- **HTML5** – Structure of the web application
- **CSS3** – Styling and layout
- **Vanilla JavaScript (ES6 modules)** – Core logic and functionality
- **Local Storage** – Save and restore user selections
- **Aladhan API** – Fetching real prayer times data
- **DOM Manipulation Utilities** – Dynamic rendering of options, tables, and loading states


## Requirements
- Modern web browser with ES6 module support.
- Live server or any HTTP server for module imports.


##  Installation & Usage
1. **Clone the repo**
   ```bash
   git clone https://github.com/talamahmoud/Prayer-Times-Team7.git
   cd Prayer-Times-Team7
   ```

2. **Run the app**
   - Open `index.html` directly in the browser,
     **or** use a development server (e.g., Live Server in VS Code).

---
