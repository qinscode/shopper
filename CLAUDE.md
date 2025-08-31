# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Development Commands

### Basic Development

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Start web development server
- `npm run lint` - Run ESLint for code quality checks
- `npm run reset-project` - Reset project to clean state (runs scripts/reset-project.js)

### Building & Deployment

- `eas build --platform android --profile local` - Build local APK for testing
- `eas build --platform android --profile development` - Build development version
- `eas build --platform android --profile preview` - Build preview version
- `eas build --platform android --profile production` - Build production version
- `eas build --platform ios` - Build for iOS (requires Apple Developer account)

## Project Architecture

### Core Structure

This is a React Native mobile shopping list app built with Expo and file-based routing (Expo
Router). The app follows a Context + Reducer pattern for state management with AsyncStorage
persistence.

### Key Directories

- `app/` - File-based routing structure
  - `app/(app)/` - Main authenticated app screens
  - `app/(onboarding)/` - Onboarding flow screens
  - `app/index.tsx` - Splash screen entry point
- `components/ui/` - Reusable UI component library
- `context/AppContext.tsx` - Global state management with useReducer
- `types/index.ts` - TypeScript interfaces and data models
- `constants/` - Design tokens (Colors, Typography, Layout)
- `utils/` - Utility functions including haptics

### State Management Architecture

The app uses React Context + useReducer for state management:

- **AppContext.tsx**: Central state management with actions for lists, items, categories
- **AsyncStorage**: Automatic persistence of all app state
- **State Structure**: Lists contain items, with support for custom items, categories, and list
  states (hidden, archived, deleted)

### Data Models

- **ShoppingList**: Contains items, supports hidden/archived/deleted states
- **ShoppingItem**: Individual list items with completion status, URLs, images, emojis
- **CustomItem**: Reusable item templates with usage tracking
- **ItemCategory**: Categorization system for items

### UI Architecture

- **Design System**: Dark theme with teal-green primary (#20B2A6)
- **Component Library**: Consistent UI components in `components/ui/`
- **Navigation**: Expo Router with file-based routing
- **Animations**: React Native Reanimated for smooth transitions
- **Icons**: Ionicons from @expo/vector-icons

### Key Features Architecture

- **List Management**: Create, duplicate, hide, archive, delete lists
- **Item Management**: Add/remove items with attachments (URLs, images, emojis)
- **Search & Suggestions**: Predefined suggested items + custom item creation
- **Progress Tracking**: Visual progress indicators for list completion
- **Swipe Gestures**: Swipe-to-delete functionality
- **Onboarding**: 3-screen introduction flow

## Path Alias Configuration

Use `@/` for imports to reference the project root:

- `@/components/ui` for UI components
- `@/context/AppContext` for state management
- `@/types` for TypeScript definitions
- `@/constants/Colors` for design tokens

## Important Implementation Notes

### State Management Patterns

- All state mutations go through the AppContext reducer
- Use helper functions like `getVisibleLists()`, `getArchivedLists()`, `getDeletedLists()`
- Lists are soft-deleted (marked as deleted) rather than permanently removed
- Items can have optional attachments (URL, imageUri, emoji)

### Component Development

- Follow existing component patterns in `components/ui/`
- Use design tokens from `constants/` for consistent styling
- Components should handle dark theme by default
- Use proper TypeScript interfaces from `types/index.ts`

### Navigation Patterns

- Expo Router uses file-based routing
- Use `router.push()` for navigation between screens
- Screen names map to file paths in `app/` directory
- Use proper typing with route parameters

### Data Persistence

- AppContext automatically persists state changes to AsyncStorage
- Date objects are serialized/deserialized properly
- State is loaded on app initialization

### Visual Design Guidelines

- Dark theme: background #0A0A0B, surface #1A1A1C
- Primary color: teal-green #20B2A6 for CTAs and active states
- Use rounded corners and shadows consistently
- Follow spacing patterns defined in `constants/Layout.ts`

## Testing & Quality

- Run `npm run lint` before committing changes
- Test on both iOS and Android when making UI changes
- Use `eas build --profile local` for testing APK builds
- Check app behavior with empty states and full lists

## Common Development Patterns

### Adding New Screens

1. Create file in appropriate `app/` subdirectory
2. Use existing component patterns and design tokens
3. Import and use AppContext for state management
4. Follow navigation patterns with proper header setup

### Adding New Components

1. Create in `components/ui/` directory
2. Export from `components/ui/index.ts`
3. Use TypeScript interfaces
4. Follow dark theme design system
5. Add proper accessibility support

### State Management Changes

1. Add new action types to AppContext reducer
2. Update TypeScript interfaces in `types/index.ts`
3. Implement reducer logic with proper date handling
4. Add helper functions to AppContext as needed
