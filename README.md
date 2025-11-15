
# AMS2 Setup Template Generator

![GitHub stars](https://img.shields.io/github/stars/your-username/ams2-setup-generator?style=social)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)

An advanced, offline-first setup sheet and AI prompt generator for the Automobilista 2 racing simulator. This tool is designed for serious sim racers and engineers to meticulously track setups, plan strategies, and leverage AI for performance analysis.

**[Link to Live Demo]** - *Replace with your GitHub Pages link after deployment*

<!-- It is highly recommended to replace this with a screenshot of your application -->

---

## Core Philosophy: Your Offline-First, AI-Ready Engineering Hub

This application is built on a simple but powerful premise: to be the ultimate digital engineering notebook for AMS2. It is **not an AI app**; it does not connect to any AI model directly. Instead, it is an expert-level **tool for using AI effectively**.

It solves the biggest challenge in getting useful advice from AI: providing high-quality, structured, and context-rich data. The app does the hard work of prompt engineering *for you*, taking your detailed inputs and formatting them into the perfect query for models like Google's Gemini or OpenAI's ChatGPT.

Key principles:
-   **100% Offline:** After the first visit, the app is fully functional without an internet connection, making it perfect for use during a race.
-   **Privacy First:** All data is processed and stored locally in your browser. Nothing is ever sent to a server. No accounts, no tracking, no API keys needed.
-   **Data-Driven:** The more detail you provide, the more insightful the generated analysis and prompts will be.

## In-Depth Feature Breakdown

### 1. The Comprehensive Setup Sheet
Go far beyond the in-game setup screen. This form is a meticulous data sheet covering every tunable parameter, logically grouped into sections:
-   **General Session:** Car, track, weather, LiveTrack state, and session objectives.
-   **Tyres & Brakes:** Granular pressure settings, compounds, brake pressure, bias, and ducting.
-   **Chassis & Aerodynamics:** Downforce, weight bias, and rake.
-   **Suspension:** A deep dive into front and rear geometry, including camber, caster, toe, ride height, spring rates, dampers (bump/rebound), anti-roll bars, and 3rd springs.
-   **Differential:** Supports four distinct differential types (Clutch LSD, Geared, Viscous, Spool) with their unique parameters for both front and rear axles.
-   **Driver Feedback:** Dedicated inputs to translate the driver's feeling about corner entry, mid-corner, and exit handling into data the AI can analyze.

### 2. Integrated Calculation & Strategy Tools

**Fuel Calculator:**
A powerful utility to automate your race strategy.
-   **Inputs:** Race length (laps or time), fuel consumption per lap, average lap time, and the car's fuel tank capacity.
-   **Outputs:** It instantly calculates the total fuel required, the *minimum number of pit stops* needed, an optimal stint length, and the amount to refuel at each stop.
-   **Integration:** With one click, it can **auto-populate** the main Pit Strategy form with its calculated results, saving you time and effort.

**Race Time Calculator:**
A unique tool for endurance racers to solve the "Time Progression" puzzle.
-   **Purpose:** Helps you synchronize the in-game race duration (e.g., 24 hours) with your desired *real-world* race time (e.g., 2 hours).
-   **How it Works:** It's a three-way calculator. Provide any two of the following, and it will calculate the third:
    1.  In-Game Race Duration
    2.  Target Real-World Race Time
    3.  AMS2 Time Progression Multiplier (e.g., 20x)

**Unit Converter:**
A floating modal, accessible at all times, to quickly convert between common imperial and metric units used in motorsport (PSI ↔ Bar, °C ↔ °F, kg ↔ lbs, N/mm ↔ lbf/in, etc.).

### 3. AI Prompt Generation: The "Kernel Framework"
This is the app's signature feature. It uses a "Kernel Framework" to transform your data into expert-level prompts that elicit the best possible responses from a Large Language Model.

-   **Race Engineer:**
    -   **Analyzes:** Your detailed car setup and your specific driver feedback on handling (e.g., "entry understeer," "snaps on exit").
    -   **Generates:** A prompt asking an AI to act as a race engineer, identify the root cause of the handling issue, and provide 2-3 specific, actionable tuning suggestions (e.g., "Increase rear anti-roll bar by 2 clicks from 80 N/mm").

-   **Driver Coach:**
    -   **Analyzes:** The gap between your target and average lap times, your control method (wheel/gamepad), and your handling feedback.
    -   **Generates:** A prompt asking an AI to act as a driver coach and give advice purely on *driving technique* to improve consistency and pace, directly addressing the issues you've reported.

-   **Race Strategist:**
    -   **Analyzes:** All race parameters—track, car class, race length, weather, fuel consumption, and planned stops.
    -   **Generates:** A prompt for an AI to create a full qualifying and race strategy, including tyre compound choices per stint, fuel loads, and contingency plans.

-   **Baseline Setup Generator:**
    -   **Analyzes:** The car, track, and your stated objective (e.g., "stable race setup").
    -   **Generates:** A prompt asking the AI to create a complete, safe, and competitive starting setup from scratch, with a rationale for its key decisions.

### 4. Seamless Workflow & Data Management
-   **Preset System:** Save and load an unlimited number of setups as presets. They are stored locally in your browser's storage and are intelligently grouped by the car's **class** in the load menu for easy organization.
-   **Export Options:** You can preview the generated text directly in the app, copy it to your clipboard with a single click, or export the entire data sheet as a `.txt` file for easy sharing and archiving.

## A Typical User Workflow
1.  **Fill the Form:** Open the app and input the details of your current session and car setup. Be as thorough as possible.
2.  **Add Driver Feedback:** After a few laps, fill in the "Driver Feedback" section to describe how the car feels on the track.
3.  **Choose a Persona:** In the sidebar, select the "AI Prompt: Race Engineer" template type.
4.  **Generate & Copy:** Click "Preview Setup," then "Copy to Clipboard."
5.  **Get AI Advice:** Paste the copied prompt into your preferred AI chat interface (like Gemini). The AI will provide specific tuning advice based on the rich context you've provided.
6.  **Tune & Test:** Apply the suggested changes in-game and validate the results.
7.  **Save Your Work:** Once you're happy with the setup, give it a name in the "Presets" section and click "Save Preset" to store it for future use.

## Tech Stack

-   **React** (with Hooks)
-   **TypeScript**
-   **Tailwind CSS** for styling
-   **Progressive Web App (PWA)** with a Service Worker for offline capabilities.
-   **No Build Step:** The application is written using modern ES modules and an `importmap`, allowing it to run directly in the browser without any complex build configuration.

## Deployment

This application is a static site and can be deployed for free on services like **GitHub Pages**, Vercel, or Netlify.

## Contributing & Feedback

This project is open to contributions and suggestions. If you find a bug, have a feature request, or want to contribute to the code, please feel free to open an issue or submit a pull request.
