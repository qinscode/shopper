# Shopper - Shopping List App

A lightweight React Native mobile app built with Expo for creating and managing shopping lists.

## Features

### ✅ Core Features (Implemented)

- **Onboarding Flow**: 3-screen introduction with app overview
- **Shopping List Management**: Create, view, and manage multiple lists
- **Item Management**: Add, complete, and delete shopping list items
- **Item Attachments**: Add URLs and images to items
- **Progress Tracking**: Visual progress indicators showing completed/total items
- **Search & Suggestions**: Suggested items and custom item entry
- **Swipe to Delete**: Intuitive swipe gestures for item deletion
- **Dark Theme**: Modern dark UI with teal-green primary color
- **Persistent Storage**: Data saved locally with AsyncStorage

### 🎨 Design Features

- **Dark Theme**: Near-black background with high-contrast text
- **Primary Color**: Teal-green (#20B2A6) for CTAs and accents
- **Modern UI**: Rounded corners, shadows, and smooth animations
- **Responsive Layout**: Works on different screen sizes
- **Empty States**: Helpful illustrations and guidance

### 📱 User Journey

1. **Splash Screen** → **Onboarding** → **Lists Overview**
2. **Create New List** → **Add Items** → **Manage Items**
3. **Attach URLs/Images** → **Mark Complete** → **Share Lists**

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context + useReducer
- **Storage**: AsyncStorage for persistence
- **UI Components**: Custom component library
- **Icons**: Ionicons
- **Gestures**: React Native Gesture Handler
- **Image Handling**: Expo Image Picker
- **Additional**: React Native SVG, PagerView

## Project Structure

```
app/
├── (app)/                    # Main app screens
├── (onboarding)/            # Onboarding flow
├── index.tsx                # Splash screen
└── _layout.tsx              # Root layout

components/ui/               # Reusable UI components
├── Button.tsx
├── Input.tsx
├── Header.tsx
├── ProgressChip.tsx
├── ListItem.tsx
├── Checkbox.tsx
└── EmptyState.tsx

constants/                   # Design tokens
├── Colors.ts
├── Typography.ts
└── Layout.ts

context/
└── AppContext.tsx          # Global state management

types/
└── index.ts               # TypeScript interfaces
```

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm start
   ```

3. **Run on device**:
   - Scan QR code with Expo Go app (iOS/Android)
   - Or use simulators: `npm run ios` / `npm run android`

## Design Specification

The app follows a detailed design specification located in `docs/design_spec.md` which includes:

- Complete visual language and color system
- Typography and spacing guidelines
- Component specifications
- User flow documentation
- Copy and content guidelines

## Development Status

✅ **Completed Tasks**:

- Project foundation and dependencies setup
- Base components and theme system
- Splash screen and onboarding flow
- Core shopping list management features
- Item adding and management functionality
- Item attachment features (URL and image)
- Lists overview and operations
- Swipe-to-delete with gesture handling

🚧 **In Progress**:

- UI polish and interaction improvements
- Performance optimizations

## Architecture Decisions

- **File-based Routing**: Using Expo Router for intuitive navigation structure
- **Context + Reducer**: Lightweight state management suitable for app scope
- **Component Library**: Custom UI components for consistent design system
- **AsyncStorage**: Simple local persistence without external dependencies
- **TypeScript**: Full type safety throughout the application

## Future Enhancements

- Search functionality for lists and items
- List sharing capabilities
- Barcode scanning for items
- Quantity tracking
- Multiple themes support
- Collaboration features

---

Built with ❤️ using React Native and Expo
