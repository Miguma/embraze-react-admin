# Embraze - Community Crisis Support Platform

A modern, real-time crisis support platform for Cebu City that connects people in need with volunteers and donors through an interactive 3D map interface.

## ✨ Features

- **3D Tilted Map View**: MapLibre GL powered map with camera tilt for immersive visualization
- **Real-time Updates**: Firebase Realtime Database for live alert tracking
- **Emergency Alerts**: Quick help requests with location pinning
- **Donation System**: Request specific items (food, water, blankets, medicine, clothing)
- **Minimalist Side Panel**: Innovative collapsible panel with smooth animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Free & Open Source**: No API keys required for the map (uses CARTO basemaps)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/embraze-react.git
cd embraze-react
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase
1. Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
2. Enable Realtime Database
3. Update database rules to allow read/write access
4. Open `src/config/firebase.js`
5. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app in action!

## 📖 Usage

### For Users in Need
1. Click on the "Help" or "Donate" icon in the side panel
2. Fill out the form with your details and location
3. Your request will appear as a marker on the map
4. Volunteers can see your request and offer assistance

### For Volunteers
1. View active alerts on the 3D map
2. Click on markers to see detailed information
3. Contact people in need directly
4. Offer help or donations

## 🛠️ Tech Stack

- **React 19** - Modern React with latest features
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **MapLibre GL** - Free, open-source map rendering
- **react-map-gl** - React wrapper for MapLibre
- **Firebase** - Real-time database and backend
- **Framer Motion** - Smooth animations
- **Font Awesome** - Beautiful icon library

## 📁 Project Structure

```
embraze-react/
├── src/
│   ├── components/
│   │   ├── Map.jsx              # 3D map with tilt view
│   │   ├── SidePanel.jsx        # Minimalist collapsible panel
│   │   ├── AlertModal.jsx       # Alert popup modal
│   │   └── tabs/
│   │       ├── HelpRequestTab.jsx
│   │       ├── DonationsTab.jsx
│   │       ├── ProfileTab.jsx
│   │       └── SettingsTab.jsx
│   ├── config/
│   │   ├── mapbox.js           # Map center coordinates
│   │   └── firebase.js         # Firebase configuration
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # App entry point
├── public/
├── package.json
└── README.md
```

## 🎨 Customization

### Change Map Location
Edit `src/config/mapbox.js` to change the default map center:

```javascript
export const CEBU_CITY_CENTER = {
  longitude: 123.8854,
  latitude: 10.3157,
  zoom: 11
};
```

### Adjust Camera Tilt
In `src/components/Map.jsx`, modify the `pitch` value (0-85 degrees):

```javascript
const [viewState, setViewState] = useState({
  // ...
  pitch: 60, // Change this value
  // ...
});
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Map tiles by [CARTO](https://carto.com/)
- Icons by [Font Awesome](https://fontawesome.com/)
- Built with [MapLibre GL](https://maplibre.org/)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ for the Cebu community
