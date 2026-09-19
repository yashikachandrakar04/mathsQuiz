# 📱 Math Quiz App

A feature-rich **React Native CLI** math quiz application with 5 quiz types, 3 difficulty levels, statistics tracking, dark mode, sound effects, and haptic feedback.

![React Native](https://img.shields.io/badge/React%20Native-0.73.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey)

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Sound Files Setup](#-sound-files-setup)
- [Permissions](#-permissions)
- [Running the App](#-running-the-app)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Quiz Types
- ➕ **Addition**
- ➖ **Subtraction**
- ✖️ **Multiplication**
- ➗ **Division**
- 🧮 **BODMAS** (Order of Operations)

### ⚙️ Customization
- **3 Difficulty Levels** — Easy, Medium, Hard (dynamic number ranges)
- **Question Count** — Choose 5, 10, 15, or 20 questions
- **30-Second Timer** per question with visual warning (last 10 seconds)

### 🎨 User Experience
- **Dark & Light Mode** — Persistent theme toggle
- **Sound Effects** — Correct, wrong, and click sounds
- **Haptic Feedback** — Vibration on answer selection
- **Visual Feedback** — Green/red highlighting for correct/wrong answers
- **Progress Bar** — Live quiz progress indicator
- **Streak Tracker** — 🔥 Daily streak counter for consistent practice

### 📊 Results & Analytics
- **Letter Grades** — A+ through F with performance message
- **Answer Review** — Review all wrong answers after quiz
- **Overall Statistics** — Total quizzes, correct answers, accuracy
- **Per-Category Breakdown** — Performance by quiz type
- **Quiz History** — Last 20 quizzes stored locally

### 💾 Data Persistence
- All stats saved via **AsyncStorage**
- Theme preference remembered across sessions
- No backend or login required

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React Native 0.73** | Cross-platform mobile framework |
| **React Navigation 6** | Screen navigation |
| **AsyncStorage** | Local data persistence |
| **react-native-sound** | Audio effects |
| **react-native-haptic-feedback** | Vibration feedback |
| **Context API** | Theme management |

---

## 🚀 Installation

### Prerequisites

- **Node.js** >= 18
- **npm** or **yarn**
- **React Native CLI**
- **Xcode** (for iOS) — macOS only
- **Android Studio** (for Android)

### Step 1 — Create the Project

```bash
npx react-native@0.73.0 init MathsQuiz --version 0.73.0
cd MathsQuiz
```

### Step 2 — Install Dependencies

```bash
npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context react-native-gesture-handler @react-native-async-storage/async-storage react-native-sound react-native-haptic-feedback
```

### Step 3 — iOS Pods

```bash
cd ios && pod install && cd ..
```

### Step 4 — Add Source Files

Copy all files from the [Project Structure](#-project-structure) below into your project.

### Step 5 — Android Permissions

Add to `android/app/src/main/AndroidManifest.xml` inside `<manifest>` tag:

```xml
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.INTERNET" />
```

### Step 6 — iOS Info.plist

Add to `ios/MathQuizApp/Info.plist` inside `<dict>`:

```xml
<key>UIViewControllerBasedStatusBarAppearance</key>
<false/>
```

---

## 📁 Project Structure

```
MathQuizApp/
├── App.js
├── index.js
├── package.json
├── README.md
├── DESCRIPTION.md
└── src/
    ├── utils/
    │   ├── questionGenerator.js   # Quiz generation logic
    │   ├── theme.js               # Light/dark theme context
    │   ├── soundEffects.js        # Sound player
    │   └── haptics.js             # Vibration feedback
    ├── components/
    │   ├── QuizOption.js          # Answer option button
    │   ├── StatCard.js            # Statistics card
    │   ├── StreakTracker.js       # Daily streak widget
    │   └── AnswerReview.js        # Wrong answers modal
    └── screens/
        ├── HomeScreen.js          # Quiz configuration
        ├── QuizScreen.js          # Active quiz
        ├── ResultScreen.js        # Score & grade
        └── StatsScreen.js         # Analytics
```

---

## 🧠 How It Works

### Question Generation

Questions are dynamically generated based on quiz type and difficulty:

```
Difficulty Ranges:
  Easy   → numbers 1–10
  Medium → numbers 1–50
  Hard   → numbers 1–100
```

**BODMAS questions** rotate between 4 patterns:
1. `a + b × c`
2. `a × b − c`
3. `(a + b) × c`
4. `a + b × c − d`

**Multiple choice** — 4 options per question, 1 correct + 3 plausible wrong answers.

### Scoring

```
Percentage = (Correct Answers / Total Questions) × 100

Grade:
  A+ → 90–100%  🏆 Outstanding
  A  → 80–89%   ⭐ Excellent
  B  → 70–79%   👍 Good job
  C  → 60–69%   📈 Keep practicing
  D  → 50–59%   ⚠️  Can do better
  F  → below 50% 📚 Need more practice
```

### Data Storage Schema

```javascript
{
  totalQuizzes: Number,
  totalQuestions: Number,
  totalCorrect: Number,
  byType: {
    [type]: { quizzes, questions, correct }
  },
  history: [
    { type, difficulty, score, total, percentage, date }
  ]
}
```

---

## 🎵 Sound Files Setup

The app plays sounds for correct/wrong answers and button clicks.

### Android

Place files in:
```
android/app/src/main/assets/correct.mp3
android/app/src/main/assets/wrong.mp3
android/app/src/main/assets/click.mp3
```

### iOS

1. Open `ios/MathQuizApp.xcworkspace` in Xcode
2. Right-click the `MathQuizApp` folder → **Add Files to "MathQuizApp"**
3. Select the 3 mp3 files
4. Ensure **"Copy items if needed"** and **MathQuizApp target** are checked

### Free Sound Sources

- [Freesound](https://freesound.org)
- [Mixkit](https://mixkit.co/free-sound-effects/)
- [Pixabay](https://pixabay.com/sound-effects/)

> ⚠️ **Note:** App works fine without sound files — it simply logs a warning.

---

## 🔐 Permissions

| Platform | Permission | Reason |
|----------|-----------|--------|
| Android | `VIBRATE` | Haptic feedback on answers |
| Android | `INTERNET` | Required by Metro bundler in dev |
| iOS | None | Haptics work natively |

---

## ▶️ Running the App

### Start Metro Bundler

```bash
npx react-native start
```

### Run on Android

```bash
npx react-native run-android
```

### Run on iOS

```bash
npx react-native run-ios
```

### Run on Specific Device

```bash
# List devices
adb devices                    # Android
xcrun simctl list devices      # iOS simulator

# Run on specific
npx react-native run-android --deviceId=<id>
npx react-native run-ios --simulator="iPhone 15 Pro"
```

### Production Build

```bash
# Android APK
cd android && ./gradlew assembleRelease

# iOS Archive
# Open Xcode → Product → Archive
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Unable to resolve module"** | `npx react-native start --reset-cache` |
| **iOS build fails** | `cd ios && pod deintegrate && pod install && cd ..` |
| **Android build fails** | `cd android && ./gradlew clean && cd .. && npx react-native run-android` |
| **Sound not playing** | Verify mp3 files exist & filenames are lowercase |
| **Haptics not working (iOS)** | Only works on real device, not simulator |
| **Metro bundler stuck** | Kill process on port 8081: `lsof -ti:8081 \| xargs kill -9` |
| **"Duplicate module" error** | `rm -rf node_modules && npm install` |
| **Gradle daemon error** | `cd android && ./gradlew --stop && ./gradlew clean` |

---

## 🗺 Roadmap

### ✅ Completed
- [x] 5 quiz types (Add, Sub, Mul, Div, BODMAS)
- [x] 3 difficulty levels
- [x] Timer per question
- [x] Statistics tracking
- [x] Dark mode
- [x] Sound & haptics
- [x] Daily streak
- [x] Answer review

### 🚧 In Progress
- [ ] Leaderboards (Firebase)
- [ ] Multiplayer mode
- [ ] Custom question creation
- [ ] Multiple languages (i18n)
- [ ] Achievement badges

### 💡 Future Ideas
- [ ] Timed challenge mode
- [ ] Progressive difficulty
- [ ] Export stats as PDF/CSV
- [ ] Cloud sync
- [ ] Parent/teacher dashboard

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Coding Standards
- Use **functional components** with hooks
- Follow **ESLint** rules (React Native default)
- Write **JSDoc comments** for utilities
- Keep components under 300 lines

---

## 📄 License

This project is licensed under the **MIT License**.

---


<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

Made with ❤️ using React Native

</div>