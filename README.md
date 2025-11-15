
# AMS2 Setup Template Generator

![GitHub stars](https://img.shields.io/github/stars/your-username/ams2-setup-generator?style=social)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)

An advanced, offline-first setup sheet and AI prompt generator for the Automobilista 2 racing simulator. This tool is designed for serious sim racers and engineers to meticulously track setups, plan strategies, and leverage AI for performance analysis.

**[Link to Live Demo]** - *Replace with your GitHub Pages link after deployment*

 
<!-- It is highly recommended to replace this with a screenshot of your application -->

---

## Core Features

-   **Comprehensive Setup Sheet:** Go beyond the basics with detailed inputs for every aspect of the car, including suspension, differentials, brakes, chassis, and engine electronics.
-   **Advanced Pit Strategy Planner:** Plan multi-stop endurance races with settings for fuel, tyre changes, damage repair, and in-car adjustments. Includes integrated fuel and race time calculators.
-   **Unique AI Prompt Generation:** Generate highly-specific, context-aware prompts using the "Kernel Framework" to get actionable advice from AI models like ChatGPT or Gemini. Four AI personas are available:
    -   **Race Engineer:** Analyzes driver feedback and setup data to provide tuning suggestions.
    -   **Driver Coach:** Focuses on technique to improve lap times and consistency.
    -   **Race Strategist:** Develops optimal qualifying and race strategies based on session parameters.
    -   **Baseline Setup Generator:** Creates a safe and competitive starting setup for any car/track combo.
-   **Offline-First PWA:** Works entirely in your browser with **no internet connection required** after the first visit. Install it as a Progressive Web App (PWA) on your desktop or mobile device for a native-app experience.
-   **No API Keys Needed:** The app generates text prompts for you to use with your preferred AI service. It does not make any API calls, ensuring it's free and private.
-   **Preset Management:** Save, load, categorize, and delete your setups locally in your browser. Never lose a great setup again.
-   **Built-in Unit Converter:** A handy modal to quickly convert common racing units (PSI ↔ Bar, °C ↔ °F, kg ↔ lbs, etc.).
-   **Export & Share:** Preview your generated template, copy it to the clipboard, or export it as a `.txt` file for easy sharing and archiving.

## How It Works

1.  **Fill the Form:** Input as much detail as you can into the setup sheet. The more data you provide, the better the output.
2.  **Select a Template:**
    -   `All-in-One`: Generates the full data sheet plus all AI prompts.
    -   `AI Prompt`: Choose a specific persona (Engineer, Coach, etc.) for a focused query.
3.  **Generate & Use:**
    -   Click **Preview** to see the generated text in the sidebar.
    -   Click **Copy to Clipboard** and paste the AI prompt into your preferred AI model.
    -   Click **Export to .txt** to save a file locally.
4.  **Save Your Work:** Use the **Presets** section to save your current form data for later use.

## Tech Stack

-   **React** (with Hooks)
-   **TypeScript**
-   **Tailwind CSS** for styling
-   **Progressive Web App (PWA)** with a Service Worker for offline capabilities.
-   **No Build Step:** The application is written using modern ES modules and an `importmap`, allowing it to run directly in the browser without any complex build configuration.

## Deployment

This application is a static site and can be deployed for free on services like **GitHub Pages**, Vercel, or Netlify.

For a detailed guide on deploying to GitHub Pages, please see [DEPLOYING.md](DEPLOYING.md). *(You can create this file and paste the deployment instructions I provided earlier into it).*

## Contributing & Feedback

This project is open to contributions and suggestions. If you find a bug, have a feature request, or want to contribute to the code, please feel free to open an issue or submit a pull request.
