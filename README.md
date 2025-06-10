# Pinzy Search App

A modern React Native application for searching and discovering places using Google Places API.

## Features

- 🔍 Real-time place search with Google Places API
- 🗺️ Interactive map display with markers
- 📍 Location-based search
- 📱 Responsive and modern UI
- 🌙 Dark/Light theme support
- 📋 Search history management
- 🔄 Offline support for search history
- 🎯 Accurate place details and information

## Technical Stack

- React Native
- TypeScript
- Google Maps & Places API
- React Navigation
- React Native Paper
- AsyncStorage for local storage
- Axios for API calls

## Prerequisites

- Node.js >= 16
- React Native development environment setup
- Google Maps API key
- Google Places API key

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pinzy-search-app.git
cd pinzy-search-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
BASE_URL=https://maps.googleapis.com/maps/api/place
APP_NAME=Pinzy Search
APP_ENV=development
```

4. iOS Setup:

```bash
cd ios
pod install
cd ..
npm run ios
```

5. Android Setup:

```bash
npm run android
```

## Project Structure

```
src/
├── assets/         # Images, fonts, and other static assets
├── components/     # Reusable UI components
├── context/        # React Context providers
├── navigation/     # Navigation configuration
├── screens/        # Screen components
├── services/       # API and other services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions and constants
```

## Architecture

The application follows Clean Architecture principles with a clear separation of concerns:

- **Presentation Layer**: Screens and Components
- **Domain Layer**: Services and Business Logic
- **Data Layer**: API calls and Local Storage

## Best Practices Implemented

- TypeScript for type safety
- Environment variables for configuration
- Proper error handling
- Loading states and error states
- Responsive design
- Performance optimization
- Code modularity
- Clean code principles

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Maps Platform
- React Native community
- React Navigation
- React Native Paper

## Support

If you encounter any issues or have questions, please open an issue in the repository.

## Roadmap

- [ ] Add user authentication
- [ ] Implement place reviews and ratings
- [ ] Add offline support
- [ ] Implement place sharing
- [ ] Add more detailed place information
- [ ] Implement place categories and filters
