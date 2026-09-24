# FitLog — Workout Library

## Project Name

FitLog — Workout Library

## Description

FitLog is a responsive workout library and daily workout planning web application.

Users can browse workouts from a REST API, view detailed workout information, add exercises to today's plan, save workouts for later, and manage selected workouts from the My Plan page.

The project follows a dark, gym-focused interface with a lime accent color and responsive layouts for desktop, tablet, and mobile devices.

## Technologies

- Next.js
- React
- TypeScript
- Tailwind CSS
- Next.js App Router
- REST API
- Browser LocalStorage
- Git & GitHub

## Features

### 1. Workout Library

- Fetches workout data from the FitLog REST API.
- Displays workout images, muscle groups, equipment, duration, calories, and ratings.
- Responsive workout card grid for desktop, tablet, and mobile.
- Each workout card links to its detailed workout page.

### 2. Workout Details

- Uses a dynamic route for each workout.
- Displays workout description, equipment, difficulty, sets, reps, duration, calories, and rating.
- Shows four workout instruction steps.
- Allows users to add a workout to today's plan.
- Allows users to save a workout for later.
- Prevents adding more workouts when today's plan reaches five items.

### 3. Today's Plan

- Users can add workouts to today's plan.
- Today's plan has a maximum limit of five workouts.
- Displays total exercises, minutes, and calories.
- Users can mark workouts as done.
- Users can remove workouts from today's plan.
- Plan changes are reflected in the navbar counter.

### 4. Saved Workouts

- Users can save workouts for later.
- Saved workouts are available from the My Plan page.
- Users can remove saved workouts.
- Saved count updates automatically in the navbar.

### 5. Live Navbar Counters

- Displays the current number of workouts in today's plan.
- Displays the current number of saved workouts.
- Plan and Saved counters update when data changes.
- Both counters link to the My Plan page.

### 6. Sorting

The My Plan page supports sorting workouts by:

- Duration
- Calories
- Rating

### 7. Responsive Design

- Responsive layout for desktop, tablet, and mobile devices.
- Responsive workout card grid.
- Responsive workout details page.
- Responsive My Plan cards and action buttons.
- Prevents horizontal overflow on smaller screens.

### 8. Persistent Browser Storage

- Today's Plan data is stored in browser LocalStorage.
- Saved workout data is stored in browser LocalStorage.
- Selected workouts remain available after refreshing the page.

### 9. Custom 404 Page

- Includes a custom FitLog 404 page.
- Shows a workout-not-found message.
- Provides a button to return to the workout library.

### 10. User Feedback

- Toast notifications appear after important actions.
- Users receive feedback when adding workouts.
- Users receive feedback when saving workouts.
- Users receive feedback when removing workouts.
- Users receive feedback when marking workouts as done.

## API Documentation

### All Workouts

https://api.abcz.workers.dev/api/fitlog

Returns the complete list of available workouts.

### Single Workout

https://api.abcz.workers.dev/api/fitlog/:id

Returns details for a specific workout by ID.

## Getting Started

Follow the steps below to run the project locally.
