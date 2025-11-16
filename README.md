
# AMS2 Setup Template Generator

![GitHub stars](https://img.shields.io/github/stars/your-username/ams2-setup-generator?style=social)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)

An advanced, offline-first setup sheet and AI prompt generator for the Automobilista 2 racing simulator. This tool is designed for serious sim racers and engineers to meticulously track setups, plan strategies, and leverage AI for performance analysis.

**[Link to Live Demo]** - *Replace with your GitHub Pages link after deployment*

<!-- It is highly recommended to replace this with a screenshot of your application -->

---

## Deconstructing the AI Prompt Generation Engine (`generateTemplateText`)

This section provides the most comprehensive, detailed, and technical explanation of the application's core intellectual property: the AI prompt generation engine. This function is not merely concatenating strings; it is a programmatic prompt engineering system designed to transform a general-purpose Large Language Model (LLM) into a domain-specific expert.

### Core Philosophy: Programmatic Prompt Engineering

A naive prompt like `"My car understeers in AMS2, what should I do?"` will yield generic, unreliable results from an AI. The model lacks context, reference knowledge, and constraints. The `generateTemplateText` function solves this by acting as a "prompt compiler," taking the application's state (`formData`) and compiling it into a highly optimized, multi-part instruction set that guarantees a high-quality response. This entire strategy is referred to as the **"Kernel Framework."**

### Technical Anatomy of the "Kernel Framework"

Each of the four AI prompt templates is constructed using the same four fundamental building blocks. It is the precise technical implementation of these blocks in synergy that makes the system effective.

#### 1. Part 1: Role & Task Priming (The System Instruction)

-   **Technical Implementation:** The prompt begins with a direct, imperative command defining the AI's persona and objective.
    ```
    **Task:** Act as an expert race engineer for the Automobilista 2 (AMS2) simulator...
    ```
-   **LLM Theory:** This leverages the instruction-following capabilities of modern transformer-based models like Gemini. By setting a clear `Task`, we are **priming the model**, which significantly constrains the "search space" of possible responses. It forces the model to activate the nodes in its neural network related to technical analysis and the specific domain ("Automobilista 2") rather than general conversation.

#### 2. Part 2: Grounding via In-Context Learning (The `AMS2_SETUP_PRINCIPLES` Constant)

-   **Technical Implementation:** A hardcoded constant, `AMS2_SETUP_PRINCIPLES`, containing validated tuning principles for the specific simulator, is injected directly into the prompt's context.
    ```
    2.  **AMS2 Setup Principles (Reference Knowledge):**
        \`\`\`
        - **General Balance:**
          - To fix Understeer: Stiffen Rear ARB/Springs, Soften Front ARB/Springs...
        \`\`\`
    ```
-   **LLM Theory:** This is the most critical technical step, known as **grounding**. We are providing the LLM with its required knowledge base as part of the prompt itself. This is a form of **in-context learning**. The model doesn't need to have been trained extensively on AMS2; it can learn the "rules of the game" for the duration of this single API call. The primary technical benefit is the massive reduction in the risk of **hallucination** (the AI inventing incorrect facts). The injected text acts as the single source of truth, overriding any conflicting or overly generic information from the model's foundational training data.

#### 3. Part 3: Structured Data Injection (The User's `formData`)

-   **Technical Implementation:** The user's form data is not dumped as a single block of text. It is meticulously structured using Markdown headings, key-value pairs, and code fences (```). Helper functions like `val()` ensure data consistency, and `buildDiffSettings()` handles complex conditional logic.
    ```
    4.  **Current Car Setup:**
        \`\`\`
        [TYRES]
        Compound: ${val(data.compound)}
        Pressures (bar) FL/FR/RL/RR: ${val(data.pressureFL)}/...
        [FRONT SUSPENSION]
        ARB: ${val(data.frontARB)} N/mm
        \`\`\`
    ```
-   **LLM Theory:** The structure is paramount for the model's **attention mechanism**. Clear headings and a consistent format allow the LLM to more easily parse the information and identify relationships between disparate data points. For example, it can directly correlate `Driver Feedback: Corner Entry: Entry understeer` with the specific numerical value of `[FRONT SUSPENSION]: ARB`. The use of code fences signals to the model that this is structured, machine-readable data, which improves parsing accuracy.

#### 4. Part 4: Output Scoping & Formatting (The `Constraints` & `Output` Blocks)

-   **Technical Implementation:** The final part of the prompt is a set of explicit, strict rules for the AI's response.
    ```
    **Constraints:**
    -   Focus *only* on setup changes. Do not advise on driving technique.
    -   Suggestions must be specific and directional...
    **Output:**
    -   Format the response as a numbered list in Markdown.
    -   Each list item must include a 'Suggestion' and 'Reasoning' field.
    ```
-   **LLM Theory:** This section enforces the **output schema**.
    -   **Negative Constraints** ("Do not...") are powerful for **scoping** the response and preventing the model from providing unhelpful, off-topic advice.
    -   **Positive Constraints** ("Suggestions must be specific...") force the model to generate actionable, quantitative outputs rather than vague, qualitative ones.
    -   **Format Enforcement** (demanding specific Markdown with fields) makes the output predictable, clean, and easy for the user to read. It transforms a potentially conversational, unstructured response into a reliable, data-driven report.

### Conclusion: The Synergy

The `generateTemplateText` function is a sophisticated "LLM compiler." It takes a high-level data structure (`formData`) and compiles it into a low-level, machine-optimized instruction set (the prompt). By technically implementing all four parts of the Kernel Framework, it turns a generic LLM into a specialized, expert-level AMS2 race engineer, coach, or strategist on demand.

---

## Architectural & Technical Deep Dive

This document provides a comprehensive technical breakdown of the application's architecture, design patterns, and core logic for developers and engineers.

### 1. High-Level Architectural Overview

-   **"No-Build-Step" Philosophy:** The application is architected to run directly in modern browsers without a mandatory build or bundling step (e.g., Webpack, Vite). This is achieved using:
    -   **Native ES Modules (`<script type="module">`):** All `.tsx` files are treated as ES modules, managing their own dependencies via `import`/`export` statements.
    -   **`importmap`:** The `index.html` file defines an `importmap` to resolve bare specifiers like `"react"` to full CDN URLs. This tells the browser where to find the dependencies without a `node_modules` folder.
    -   **JSX In-Browser Transpilation:** A lightweight transpiler is implicitly used (often via libraries like `es-module-shims` or native browser support under development) to handle JSX syntax on the fly. This results in an extremely simple development setup and a highly portable, static application.

-   **Component-Based Architecture (React):** The UI is built as a tree of reusable React components. The structure follows a standard pattern of "container" (smart) components that manage state and logic, and "presentational" (dumb) components that receive data via props and render UI.

-   **Offline-First via Progressive Web App (PWA):** The application is a full PWA. It leverages a Service Worker (`sw.js`) to cache all critical assets (`.html`, `.tsx`, `.css` via CDN). After the initial visit, the app can be launched and used entirely without an internet connection, making it robust for track-side use.

### 2. Core Components & Data Flow

The application follows a strict unidirectional data flow, which enhances predictability and simplifies debugging.

-   **`App.tsx` (Root Component / State Manager):**
    -   **Role:** The single source of truth. It initializes and manages the application's primary state variables using `useState` hooks: `formData` (the entire setup sheet), `presets` (the list of saved setups), `previewContent` (the generated text), and UI state like `isConverterOpen`.
    -   **Data Flow:** It passes the `formData` object down to the `SetupForm` as a prop. It also passes down event handler callbacks (e.g., `handleChange`, `handleSavePreset`) that child components use to send data back up to be processed.

-   **`SetupForm.tsx` (Main Form Container):**
    -   **Role:** A structural component that composes all the individual form sections (e.g., `GeneralSection`, `SuspensionSection`).
    -   **Data Flow:** It receives `formData` and `handleChange` from `App.tsx` and drills these props down to its children, acting as a passthrough for state and events.

-   **Form Section Components (`GeneralSection`, `SuspensionSection`, etc.):**
    -   **Role:** Presentational components responsible for a specific part of the form. They contain the business logic for their domain (e.g., the complex layout of the suspension form).
    -   **Data Flow:** They receive the relevant slice of `formData` to display in their inputs. Every `onChange` event on an input triggers the `handleChange` callback, notifying `App.tsx` to update the state.

-   **`Sidebar.tsx` (Control Panel):**
    -   **Role:** Manages all user actions, including generating previews, exporting files, and handling the preset system.
    -   **Data Flow:** It is a stateful component for its own UI (e.g., `presetName` input), but it receives its core functionality as props from `App.tsx` (e.g., `onPreview`, `onExport`, `onSavePreset`). When a user clicks "Preview," it calls the `onPreview` function, which is defined in `App.tsx`, to update the global `previewContent` state.

### 3. State Management Strategy

The application uses React's built-in hooks for state management, which is sufficient and performant for its scope, avoiding the need for external libraries like Redux or MobX.

-   **Centralized State:** The entire form's state is held in a single object (`formData`) in `App.tsx`. This makes state changes predictable and data serialization (for saving presets) straightforward.

-   **`handleChange` Callback Pattern:**
    ```typescript
    const handleChange = useCallback((e: React.ChangeEvent<...>) => {
      const { name, value, type } = e.target;
      // ... logic for checkboxes vs text inputs
      setFormData(prev => ({ ...prev, [name]: value }));
    }, []);
    ```
    This function is the primary mechanism for state updates. It is defined once in `App.tsx` and wrapped in `useCallback` to prevent unnecessary re-renders of child components that depend on it. When an input changes in a deeply nested component, this single function is called. It uses the input's `name` attribute to dynamically update the correct key in the `formData` object.

### 4. Data Persistence via `localStorage`

The preset system relies on the browser's `localStorage` API for simple, effective, client-side persistence.

-   **Serialization:** When a user saves or updates presets, the entire `presets` array (which contains `SetupData` objects) is serialized into a JSON string using `JSON.stringify`.
-   **Storage:** This string is then saved to `localStorage` under a single key (`'ams2-presets'`).
-   **Deserialization & Hydration:** On application startup, a `useEffect` hook attempts to read this key from `localStorage`. If found, it uses `JSON.parse` to deserialize the string back into a JavaScript array of `Preset` objects, which is then used to hydrate the `presets` state.
-   **Error Handling:** The loading process is wrapped in a `try...catch` block. This is a crucial defensive measure to prevent the entire app from crashing if the data in `localStorage` becomes corrupted or is manually edited into an invalid format.

### 5. Offline-First Architecture (PWA & Service Worker)

-   **`manifest.json`:** This file provides the metadata that allows the browser to recognize the site as an installable PWA, defining its name, icon, theme colors, and display mode (`standalone`).

-   **`sw.js` (Service Worker Script):**
    -   **`install` Event:** This is triggered when the service worker is first registered. It opens a specific version of the cache (`CACHE_NAME`) and pre-caches an array of critical assets (`urlsToCache`). This ensures the app shell is always available offline.
    -   **`fetch` Event:** This is the core of the offline strategy. It intercepts *every* network request made by the application.
        1.  It first checks if a matching response already exists in the cache using `caches.match(event.request)`.
        2.  If a cached response is found (a "cache hit"), it is returned immediately, avoiding the network entirely.
        3.  If not in the cache, it proceeds with the network request using `fetch()`.
        4.  If the fetch is successful, it clones the response and puts it into the cache for future requests before returning the response to the browser. This is a "cache-first, then network" strategy with dynamic caching.
    -   **`activate` Event:** This event fires after a new service worker is installed and activated. Its purpose is to perform cleanup. It gets a list of all existing cache names and deletes any that do not match the current `CACHE_NAME`. This is crucial for ensuring that users receive updated assets when a new version of the app is deployed.

### 6. Component Encapsulation (Calculators & Modals)

The `FuelCalculator`, `RaceTimeCalculator`, and `UnitConverterModal` are excellent examples of component encapsulation.

-   **Local State Management:** Each of these components manages its own complex state internally using its own `useState` hooks. For example, the `FuelCalculator` tracks all its inputs (`lapDistance`, `fuelPerLap`, etc.) locally.
-   **Decoupling:** This design decouples the calculator's logic from the main application state. The global `formData` is not updated on every keystroke within a calculator, which would be inefficient.
-   **Controlled Interaction:** The calculators only interact with the global state at specific moments.
    -   The `FuelCalculator` calls the `updateFormData` callback (passed down from `App.tsx`) *only* when the user clicks the "Calculate" button, committing its final results to the main form.
    -   The `UnitConverterModal` is entirely self-contained and does not interact with the main form's state at all, serving as a purely informational utility.

This encapsulated approach leads to a more modular, maintainable, and performant application.
