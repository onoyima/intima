# INTIMA∞ Mobile Application

![INTIMA∞ Logo](../logo.png)

This is the mobile client for the **INTIMA∞** ecosystem, built using React Native and Expo. It provides a premium, portable experience for intimacy tracking, private communication, and community engagement.

## 📱 Features
- **Premium Login UI**: Seamless entry with secure storage.
- **Authenticated Dashboard**: At-a-glance view of your relationship status and health logs.
- **Real-time Synchronization**: Instant messaging and state updates with the backend.
- **Native Experience**: Smooth transitions and animations optimized for mobile devices.

---

## 🚀 Getting Started

To run the mobile app on your physical device, follow these steps:

### 1. Install Expo Go
Download the **Expo Go** app from the Apple App Store or Google Play Store.

### 2. Network Sync
Ensure your computer and your phone are connected to the **same Wi-Fi network**.

### 3. Configure API Endpoint
The mobile app needs to know where your backend server is running.
1. Find your machine's IP address (e.g., `192.168.89.46`).
2. Open `mobile/src/lib/api.ts`.
3. Update the `BASE_URL` constant.

> **Current Configuration**: The project is currently configured for IP `135.129.124.12`.

### 4. Launch the App
Open a terminal in the `mobile` directory and run:
```bash
npx expo start --clear
```

### 5. Scan & Play
- A QR code will appear in your terminal.
- **iOS**: Scan with your Camera app.
- **Android**: Scan with the Expo Go app.

---

## 📁 Technical Information
- **Framework**: [Expo SDK](https://expo.dev/)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
- **API Client**: [Axios](https://axios-http.com/)
- **UI Components**: Custom premium components with styled-system inspiration.

---

## 🛠 Troubleshooting

- **Connection Refused**: Ensure the backend server (`npm run dev` in the root) is running and accessible.
- **Network Timeout**: Check your firewall settings. Ensure ports `5000` (API) and `8081` (Expo) are not being blocked.
- **Stale Cache**: If you update the IP and it doesn't reflect, try restarting with the `--clear` flag.
