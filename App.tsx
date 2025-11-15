

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { SetupForm } from './components/SetupForm';
import { UnitConverterModal } from './components/UnitConverterModal';
import { SetupData, initialSetupData, Preset } from './types';

// --- Template Generation Logic ---

const generateTemplateText = (data: SetupData, templateType: string): string => {
  const val = (value: string | undefined | null): string => value?.trim() || 'N/A';

  const AMS2_SETUP_PRINCIPLES = `
- **General Balance:**
  - To fix Understeer: Stiffen Rear ARB/Springs, Soften Front ARB/Springs, Increase Rake (raise rear ride height), Lower Coast Ramp Angle.
  - To fix Oversteer: Stiffen Front ARB/Springs, Soften Rear ARB/Springs, Decrease Rake (lower rear ride height), Lower Power Ramp Angle.
- **Tyres:**
  - Camber Temp Targets: Front inside temp should be ~7°C hotter than outside. Rear inside temp should be 3-5°C hotter than outside.
  - Pressure Tuning: The middle tyre temperature should be between the inner and outer temps. If middle temp is too low, increase pressure. If too high, decrease pressure.
  - Toe Angle: Recommended values are Front <= -1.0° and Rear <= 0.8°. More toe (positive or negative) increases tyre heat and wear.
- **Brakes:**
  - Brake Bias: Front tyres should always lock up before the rears. General starting points: Front-engine cars > 60% Front, Mid/Rear-engine cars < 60% Front.
- **Differential (Clutch LSD):**
  - Coast Ramp: Lower angle = more lock = more oversteer on corner entry. Higher angle = less lock = more understeer on entry.
  - Power Ramp: Lower angle = more lock = more oversteer on corner exit. Higher angle = less lock = more understeer on exit.
  - Preload: Higher values increase natural locking, reducing maneuverability but increasing stability. Find a balance.
- **Engine/Transmission:**
  - Engine Braking: **CRITICAL:** Due to a known bug in AMS2, setting this value above 5 can cause engine failure.
`.trim();

  const buildDiffSettings = (d: SetupData, prefix: 'front' | 'rear'): string => {
    const type = d[`${prefix}DiffType`];
    let settings = `Type: ${val(type)}\n`;
    switch (type) {
      case 'Spool':
        settings += `Spool: ${val(d[`${prefix}Spool`])}`;
        break;
      case 'Geared LSD':
        settings += `- Bias Ratio, Power: ${val(d[`${prefix}PowerBias`])}\n`;
        settings += `- Bias Ratio, Coast: ${val(d[`${prefix}CoastBias`])}`;
        break;
      case 'Clutch LSD':
        settings += `- Preload: ${val(d[`${prefix}Preload`])}\n`;
        settings += `- Clutches: ${val(d[`${prefix}Clutches`])}\n`;
        settings += `- Power Ramp: ${val(d[`${prefix}PowerRamp`])}\n`;
        settings += `- Coast Ramp: ${val(d[`${prefix}CoastRamp`])}`;
        break;
      case 'Viscous LSD':
        settings += `- Viscous Lock: ${val(d[`${prefix}ViscousLock`])}`;
        break;
      default:
        settings += 'No specific settings available.';
    }
    settings += `\nNotes: ${val(d[`${prefix}DiffNotes`])}`;
    return settings;
  };
  
  const damageRepair = [
    `${data.flSuspension ? '[X]' : '[ ]'} FL Suspension`,
    `${data.frSuspension ? '[X]' : '[ ]'} FR Suspension`,
    `${data.rlSuspension ? '[X]' : '[ ]'} RL Suspension`,
    `${data.rrSuspension ? '[X]' : '[ ]'} RR Suspension`,
    `${data.flBrake ? '[X]' : '[ ]'} FL Brake`,
    `${data.frBrake ? '[X]' : '[ ]'} FR Brake`,
    `${data.rlBrake ? '[X]' : '[ ]'} RL Brake`,
    `${data.rrBrake ? '[X]' : '[ ]'} RR Brake`,
    `${data.engineRepair ? '[X]' : '[ ]'} Engine`,
    `${data.transmissionRepair ? '[X]' : '[ ]'} Transmission`,
    `${data.frontAero ? '[X]' : '[ ]'} Front Aero`,
    `${data.rearAero ? '[X]' : '[ ]'} Rear Aero`,
  ].map(item => `- ${item}`).join('\n');

  const pitStopTable = `
| Stop # | Lap In | Fuel Added (L) | Tyre Compound | Tyre Press FL/FR/RL/RR | Brake Bias | Notes |
| :----- | :----- | :------------- | :------------ | :--------------------- | :--------- | :---- |
| 1      | ${data.stop1Lap || ''} | ${data.stop1Fuel || ''} | ${data.stop1Compound || ''} | ${data.stop1Pressures || ''} | ${data.stop1BrakeBias || ''} | ${data.stop1Notes || ''} |
| 2      | ${data.stop2Lap || ''} | ${data.stop2Fuel || ''} | ${data.stop2Compound || ''} | ${data.stop2Pressures || ''} | ${data.stop2BrakeBias || ''} | ${data.stop2Notes || ''} |`;

  const frontDiffSettings = buildDiffSettings(data, 'front');
  const rearDiffSettings = buildDiffSettings(data, 'rear');

  const targetLapTime = data.targetLapTimeMin || data.targetLapTimeSec || data.targetLapTimeMs 
    ? `${data.targetLapTimeMin}:${data.targetLapTimeSec}.${data.targetLapTimeMs}`
    : '';
  const avgLapTime = data.averageLapTimeMin || data.averageLapTimeSec || data.averageLapTimeMs
    ? `${data.averageLapTimeMin}:${data.averageLapTimeSec}.${data.averageLapTimeMs}`
    : '';

  const fullDataSheet = `
====================================================================
AUTOMOBILISTA 2 — ADVANCED ENGINEERING SETUP & PIT STRATEGY TEMPLATE
====================================================================

INSTRUCTIONS:
--------------------------------------------------------------------
- Leave a field BLANK → system will provide the best recommended value.
- Input a dash "–" → setting is not available for this car.
- Use SI units only (kW, Nm, kg, °C, bar, N/mm, N/m/s).
- Record one configuration per session for comparison.
--------------------------------------------------------------------

[GENERAL VEHICLE SPECIFICATIONS]
--------------------------------------------------------------------
Car: ${data.car}
Class: ${data.class}
Track: ${data.track}
Session Type: ${data.sessionType}
Race Length (laps or time): ${data.raceLength}
Objective / Focus: ${data.objective}
Weather Condition: ${data.weatherCondition}
LiveTrack Condition: ${data.liveTrackCondition}
Track Temp (°C): ${data.trackTemp}
Air Temp (°C): ${data.airTemp}
Time Progression: ${data.timeProgression}
Start Time: ${data.startTime}
Date: ${data.date}
Type of Control Used: ${data.controlType}
Target Lap Time: ${targetLapTime}
Average Lap Time (during test): ${avgLapTime}

Power (kW): ${data.power}${data.powerHP ? ` (${data.powerHP} HP)` : ''}
Torque (Nm): ${data.torque}
Weight (kg): ${data.weight}
Weight Distribution (F/R %): ${data.weightDistribution}
Power-to-Weight (kW/kg): ${data.powerToWeight}${data.powerToWeightHP ? ` (${data.powerToWeightHP} HP/kg)` : ''}
Wheelbase (mm): ${data.wheelbase}
Displacement (cc or L): ${data.displacement}
Driveline: ${data.driveline}
Differential: ${data.differential}
Engine Type: ${data.engineType}
Engine Layout: ${data.engineLayout}
Aspiration: ${data.aspiration}
BMEP (bar): ${data.bmep}${data.bmepKpa ? ` (${data.bmepKpa} kPa)` : ''}

--------------------------------------------------------------------
[TYRES]
--------------------------------------------------------------------
Compound: ${data.compound}
Pressures (bar): FL: ${data.pressureFL} FR: ${data.pressureFR} RL: ${data.pressureRL} RR: ${data.pressureRR}
Target Temp Range (°C): ${data.targetTemp}
Notes: ${data.tyreNotes}

--------------------------------------------------------------------
[BRAKES]
--------------------------------------------------------------------
Brake Pressure (%): ${data.brakePressure}
Brake Bias (F/R %): ${data.brakeBias}
Brake Duct Front (%): ${data.brakeDuctFront}
Brake Duct Rear (%): ${data.brakeDuctRear}
Notes: ${data.coolingNotes}

--------------------------------------------------------------------
[CHASSIS]
--------------------------------------------------------------------
Front Downforce: ${data.frontDownforce}
Rear Downforce: ${data.rearDownforce}
Longitudinal Weight Bias (%F): ${data.longitudinalBias}
Lateral Weight Bias (%): ${data.lateralBias}
Weight Jacker: ${data.weightJacker}
Ride Height Difference (Rake): ${data.rideHeightDiff}
Notes: ${data.chassisNotes}

--------------------------------------------------------------------
[FRONT SUSPENSION]
--------------------------------------------------------------------
Right/Left:
Caster (°): ${data.frontCaster}
Camber (°): FL: ${data.camberFL} FR: ${data.camberFR}
Ride Height (mm): ${data.frontRideHeight}
Spring Rate (N/mm): ${data.frontSpringRate}
Bump Stop Range (mm): ${data.frontBumpStopRange}
Slow Bump (N/m/s): ${data.frontSlowBump}
Slow Rebound (N/m/s): ${data.frontSlowRebound}
Fast Bump (N/m/s): ${data.frontFastBump}
Fast Rebound (N/m/s): ${data.frontFastRebound}
Center:
Steering Lock (°): ${data.steeringLock}
Toe Center (°): ${data.frontToeCenter}
Anti-Roll Bar (N/mm): ${data.frontARB}
3rd Spring (N/mm): ${data.front3rdSpring}
Bump Stop (mm): ${data.frontCenterBumpStop}
Slow Bump (N/m/s): ${data.frontCenterSlowBump}
Slow Rebound (N/m/s): ${data.frontCenterSlowRebound}
Fast Bump (N/m/s): ${data.frontCenterFastBump}
Fast Rebound (N/m/s): ${data.frontCenterFastRebound}
Notes: ${data.frontSuspensionNotes}

--------------------------------------------------------------------
[REAR SUSPENSION]
--------------------------------------------------------------------
Right/Left:
Camber (°): RL: ${data.camberRL} RR: ${data.camberRR}
Ride Height (mm): ${data.rearRideHeight}
Spring Rate (N/mm): ${data.rearSpringRate}
Slow Bump (N/m/s): ${data.rearSlowBump}
Slow Rebound (N/m/s): ${data.rearSlowRebound}
Fast Bump (N/m/s): ${data.rearFastBump}
Fast Rebound (N/m/s): ${data.rearFastRebound}
Center:
Toe Center (°): ${data.rearToeCenter}
Anti-Roll Bar (N/mm): ${data.rearARB}
3rd Spring (N/mm): ${data.rear3rdSpring}
Bump Stop (mm): ${data.rearCenterBumpStop}
Slow Bump (N/m/s): ${data.rearCenterSlowBump}
Slow Rebound (N/m/s): ${data.rearCenterSlowRebound}
Fast Bump (N/m/s): ${data.rearCenterFastBump}
Fast Rebound (N/m/s): ${data.rearCenterFastRebound}
Notes: ${data.rearSuspensionNotes}

--------------------------------------------------------------------
[GEAR RATIOS]
--------------------------------------------------------------------
Final Drive Ratio: ${data.finalDriveRatio}
Gears: 1: ${data.gear1}, 2: ${data.gear2}, 3: ${data.gear3}, 4: ${data.gear4}, 5: ${data.gear5}, 6: ${data.gear6}, 7: ${data.gear7}, 8: ${data.gear8}

--------------------------------------------------------------------
[FRONT DIFFERENTIAL]
--------------------------------------------------------------------
${frontDiffSettings}

--------------------------------------------------------------------
[REAR DIFFERENTIAL]
--------------------------------------------------------------------
${rearDiffSettings}

--------------------------------------------------------------------
[ENGINE / ELECTRONICS]
--------------------------------------------------------------------
Fuel Map: ${data.fuelMap}
Engine Braking: ${data.engineBraking}
Traction Control Level: ${data.tractionControl}
ABS Level: ${data.absLevel}
Boost Pressure (%): ${data.boostPressure}
Radiator Opening (%): ${data.engineRadiator}
Notes: ${data.engineNotes}

--------------------------------------------------------------------
[FUEL & PIT STRATEGY]
--------------------------------------------------------------------
Start Fuel (L): ${data.startFuel}
Fuel Consumption (L/lap): ${data.fuelConsumption}
Pit Stops Planned: ${data.pitStops}
Pit Window (laps): ${data.pitWindow}
Refuel Amount per Stop (L): ${data.refuelAmount}
Tyre Change Per Stop (Yes/No, compound): ${data.tyreChange}
Driver Change (Yes/No): ${data.driverChange}

Repair Damage:
${damageRepair}

Tire Pressure Adjustments (FL/FR/RL/RR): ${data.tirePressureAdjustments}
Engine Map Change: ${data.engineMapChange}
Brake Bias Change: ${data.brakeBiasChange}
Notes: ${data.pitStrategyNotes}
${pitStopTable}

--------------------------------------------------------------------
[DRIVER FEEDBACK]
--------------------------------------------------------------------
- Overall Balance: ${val(data.handlingBalance)}
- Corner Entry: ${val(data.cornerEntry)}
- Mid-Corner: ${val(data.cornerMid)}
- Corner Exit: ${val(data.cornerExit)}
- High-Speed: ${val(data.straightLine)}
- Notes: ${val(data.driverNotes)}

--------------------------------------------------------------------
[TOP 6 TUNING CHANGES] (Change, Purpose, Validation)
--------------------------------------------------------------------
1. ${data.tuningChange1}
2. ${data.tuningChange2}
3. ${data.tuningChange3}
4. ${data.tuningChange4}
5. ${data.tuningChange5}
6. ${data.tuningChange6}

--------------------------------------------------------------------
[ON-TRACK TEST PLAN]
--------------------------------------------------------------------
Iteration 1: ${data.iteration1}
Iteration 2: ${data.iteration2}
Iteration 3: ${data.iteration3}
Iteration 4: ${data.iteration4}
Iteration 5: ${data.iteration5}
Iteration 6: ${data.iteration6}
Observation Summary: ${data.observationSummary}

====================================================================
END OF DATA SHEET
====================================================================
  `.trim();

  const setupDetails = `
====================================================================
VEHICLE SETUP DETAILS
====================================================================

[GENERAL]
Car: ${val(data.car)} @ ${val(data.track)}
Target Lap Time: ${val(targetLapTime)}
Average Lap Time: ${val(avgLapTime)}

[TYRES]
Compound: ${val(data.compound)}
Pressures (bar) FL/FR/RL/RR: ${val(data.pressureFL)}/${val(data.pressureFR)}/${val(data.pressureRL)}/${val(data.pressureRR)}

[BRAKES]
Brake Pressure: ${val(data.brakePressure)}%
Brake Bias: ${val(data.brakeBias)}% F

[CHASSIS & AERO]
Front Downforce: ${val(data.frontDownforce)}
Rear Downforce: ${val(data.rearDownforce)}
Ride Height Diff (Rake): ${val(data.rideHeightDiff)}

[FRONT SUSPENSION]
Camber FL/FR: ${val(data.camberFL)}° / ${val(data.camberFR)}°
Ride Height: ${val(data.frontRideHeight)} mm
Spring Rate: ${val(data.frontSpringRate)} N/mm
Toe: ${val(data.frontToeCenter)}°
ARB: ${val(data.frontARB)} N/mm

[REAR SUSPENSION]
Camber RL/RR: ${val(data.camberRL)}° / ${val(data.camberRR)}°
Ride Height: ${val(data.rearRideHeight)} mm
Spring Rate: ${val(data.rearSpringRate)} N/mm
Toe: ${val(data.rearToeCenter)}°
ARB: ${val(data.rearARB)} N/mm

[FRONT DIFFERENTIAL]
${frontDiffSettings}

[REAR DIFFERENTIAL]
${rearDiffSettings}
  `.trim();

  const setupTuningPrompt = `
====================================================================
AI PROMPT: RACE ENGINEER (KERNEL FRAMEWORK)
====================================================================

**Task:** Act as an expert race engineer for the Automobilista 2 (AMS2) simulator. Analyze the provided driver feedback, car setup data, and session context to identify the root cause of handling issues. Provide 2-3 specific, actionable tuning suggestions to resolve these issues, grounding your reasoning in the provided AMS2-specific setup principles.

**Input:**
--------------------------------------------------------------------
1.  **Session Context:**
    -   Track: ${val(data.track)}
    -   Primary Objective: ${val(data.objective)}
    -   Conditions: ${val(data.weatherCondition)}, Air: ${val(data.airTemp)}°C, Track: ${val(data.trackTemp)}°C

2.  **AMS2 Setup Principles (Reference Knowledge):**
    \`\`\`
    ${AMS2_SETUP_PRINCIPLES}
    \`\`\`

3.  **Driver Feedback:**
    -   Overall Balance: ${val(data.handlingBalance)}
    -   Corner Entry: ${val(data.cornerEntry)}
    -   Mid-Corner: ${val(data.cornerMid)}
    -   Corner Exit: ${val(data.cornerExit)}
    -   High-Speed Stability: ${val(data.straightLine)}
    -   Qualitative Notes: ${val(data.driverNotes)}

4.  **Current Car Setup:**
    \`\`\`
    ${setupDetails}
    \`\`\`
--------------------------------------------------------------------

**Constraints:**
--------------------------------------------------------------------
-   Your analysis must consider all inputs: the driver's feeling, the car's current settings, AND the session context (e.g., a cold track will affect grip).
-   Directly reference the AMS2 Setup Principles in your reasoning where relevant (e.g., "To correct the entry understeer, as per AMS2 principles, we should...").
-   Do not suggest changes to parameters not listed in the Current Car Setup (e.g., dampers, 3rd springs if not provided).
-   Focus *only* on setup changes. Do not advise on driving technique.
-   Provide a concise (1-2 sentence) engineering explanation for each suggestion.
-   Suggestions must be specific and directional (e.g., "Increase Rear ARB by 2 clicks from ${val(data.rearARB)} N/mm" not "Adjust the ARB").
--------------------------------------------------------------------

**Output:**
--------------------------------------------------------------------
-   Format the response as a numbered list in Markdown.
-   Each list item must include a 'Suggestion' and 'Reasoning' field.

*Example Output:*
1.  **Suggestion:** Increase Rear Anti-Roll Bar (ARB) stiffness from its current value of ${val(data.rearARB)} N/mm.
    **Reasoning:** Given the reported mid-corner understeer on a warm track, stiffening the rear axle during roll will help the car rotate more effectively without making it too snappy, as per AMS2 tuning principles.
--------------------------------------------------------------------
`.trim();

  const driverCoachingPrompt = `
====================================================================
AI PROMPT: DRIVER COACH (KERNEL FRAMEWORK)
====================================================================

**Task:** Act as an expert driver coach for Automobilista 2. Analyze the provided session data and driver feedback to identify opportunities for improving lap times and, crucially, consistency. Provide 3 specific, actionable pieces of advice on driving technique to help the driver achieve their target lap time.

**Input:**
--------------------------------------------------------------------
1.  **Performance Data:**
    -   Car & Track: ${val(data.car)} at ${val(data.track)}
    -   Session Type: ${val(data.sessionType)}
    -   Control Type Used: ${val(data.controlType)}
    -   Target Lap Time: ${val(targetLapTime)}
    -   Average Lap Time: ${val(avgLapTime)}
    -   **Analysis:** A significant gap between target and average lap times indicates an opportunity to improve consistency.

2.  **Driver's Qualitative Handling Feedback:**
    -   Overall Balance: ${val(data.handlingBalance)}
    -   Corner Entry: ${val(data.cornerEntry)}
    -   Mid-Corner: ${val(data.cornerMid)}
    -   Corner Exit: ${val(data.cornerExit)}
    -   High-Speed Stability: ${val(data.straightLine)}
    -   Driver Notes: ${val(data.driverNotes)}

3.  **Relevant Setup Context:**
    -   Aero Balance (F/R): ${val(data.frontDownforce)} / ${val(data.rearDownforce)}
    -   Brake Bias: ${val(data.brakeBias)}% Front
    -   Tyre Compound: ${val(data.compound)}
--------------------------------------------------------------------

**Constraints:**
--------------------------------------------------------------------
-   Focus exclusively on driving technique (e.g., braking points, trail-braking, throttle application, line choice, vision).
-   **DO NOT** suggest car setup changes. That is the role of the Race Engineer.
-   Directly link your advice to the driver's specific feedback (e.g., "To mitigate the 'exit oversteer' you reported, focus on...").
-   Tailor advice to the control type if possible (e.g., smooth stick inputs for gamepads, FFB cues for wheels).
-   Provide a concise (1-2 sentence) rationale explaining why the advice will lead to improvement.
-   Maintain a constructive and encouraging tone.
--------------------------------------------------------------------

**Output:**
--------------------------------------------------------------------
-   Format the response as a numbered list in Markdown.
-   Each list item must include a 'Focus Area', 'Actionable Advice', and 'Expected Outcome'.

*Example Output:*
1.  **Focus Area:** Improving Consistency and Throttle Control at Corner Exit.
    **Actionable Advice:** The gap between your average and target lap times, combined with your feedback of 'exit oversteer', suggests inconsistency in throttle application. Practice being more progressive with the throttle. Instead of an abrupt input, smoothly squeeze it as you unwind the steering wheel.
    **Expected Outcome:** This will maximize traction, reduce power-on oversteer, and lead to both faster and more repeatable corner exits.
--------------------------------------------------------------------
`.trim();

  const raceStrategyPrompt = `
====================================================================
AI PROMPT: RACE STRATEGIST (KERNEL FRAMEWORK)
====================================================================

**Task:** Act as a world-class race strategist for Automobilista 2. Develop a comprehensive and optimal qualifying and race strategy based on the provided session parameters, car data, and track conditions. Your strategy should aim for the fastest overall race time, aligning with the stated objective and using performance data for accurate calculations.

**Input:**
--------------------------------------------------------------------
1.  **Race Parameters:**
    -   Track: ${val(data.track)}
    -   Car/Class: ${val(data.car)} / ${val(data.class)}
    -   Race Length: ${val(data.raceLength)}
    -   Race Objective: ${val(data.objective)}
    -   Pace (Avg Lap): ${val(avgLapTime)}
    -   Planned Pit Stops: ${val(data.pitStops)}
    -   Pit Window: ${val(data.pitWindow)} laps

2.  **Environmental Conditions:**
    -   Weather Forecast: ${val(data.weatherCondition)}
    -   Time Progression: ${val(data.timeProgression)} (This impacts track/air temp and track evolution)
    -   Session Start Time & Date: ${val(data.startTime)} on ${val(data.date)}
    -   Initial Track State: ${val(data.liveTrackCondition)}
    -   Temperatures (Start): Air ${val(data.airTemp)}°C / Track ${val(data.trackTemp)}°C

3.  **Car Performance Data:**
    -   Fuel Consumption: ${val(data.fuelConsumption)} L/lap
    -   Known Tyre Compounds Available: Soft, Medium, Hard, Wet, Intermediate.
--------------------------------------------------------------------

**Constraints:**
--------------------------------------------------------------------
-   Provide separate, distinct strategies for Qualifying and the Race.
-   The race strategy must incorporate the exact number of planned pit stops. Your lap calculations should use the provided Average Lap Time.
-   Your recommendations must account for track evolution (LiveTrack rubbering-in) and potential temperature changes due to time progression.
-   Factor in typical tyre degradation models for the car's class (e.g., high-downforce prototypes are easier on tyres than heavy GT3s).
-   Provide a primary strategy ("Plan A") that aligns with the Race Objective, and a flexible alternative ("Plan B").
-   Be specific with lap numbers for pit stops, required fuel amounts, and tyre compound choices for each stint.
-   Do not give driving advice or setup suggestions. Focus purely on strategy.
--------------------------------------------------------------------

**Output:**
--------------------------------------------------------------------
-   Provide the response in Markdown with two main sections: \`QUALIFYING STRATEGY\` and \`RACE STRATEGY\`.
-   Use sub-headings for clarity as shown in the example.

*Example Output:*
### QUALIFYING STRATEGY
-   **Tyre Choice:** Soft compound for maximum one-lap grip.
-   **Fuel Load:** Fuel for 3 laps only (e.g., ${ (parseFloat(data.fuelConsumption || '0') * 3).toFixed(1) } L). This minimizes weight.
-   **Run Plan:** Aim for a single run late in the session when the track is most rubbered-in. Execute an Out-lap (build tyre temp/pressure), Push-lap, and In-lap.

### RACE STRATEGY
-   **Plan A (Objective: ${val(data.objective) || 'Balanced Race'}):**
    -   **Starting Tyres:** Medium compound for a good balance of pace and durability.
    -   **Starting Fuel:** ${val(data.startFuel)} L (enough for Stint 1).
    -   **Stint 1:** Laps 1-${val(data.stop1Lap) || 'X'}. Focus on clean driving and hitting your marks.
    -   **Pit Stop 1 (Lap ${val(data.stop1Lap) || 'X'}):** Refuel with ${val(data.refuelAmount)} L, switch to another set of Medium tyres.
    -   **Stint 2:** ...
-   **Plan B (Aggressive Undercut):**
    -   Start on Soft tyres to gain track position early. Pit 2-3 laps before Plan A's window to get into clean air. This will require careful tyre management in the final stint to avoid a late-race pace drop-off.
--------------------------------------------------------------------
`.trim();

  const baselineSetupPrompt = `
====================================================================
AI PROMPT: BASELINE SETUP GENERATOR (KERNEL FRAMEWORK)
====================================================================

**Task:** Act as an expert race engineer for the Automobilista 2 (AMS2) simulator. Your goal is to create a well-balanced, competitive baseline setup for the specified car and track combination. The setup should be a safe starting point for a driver who has not yet completed any test laps.

**Input:**
--------------------------------------------------------------------
1.  **AMS2 Setup Principles (Reference Knowledge):**
    \`\`\`
    ${AMS2_SETUP_PRINCIPLES}
    \`\`\`

2.  **Session & Vehicle Data:**
    -   Car: ${val(data.car)}
    -   Class: ${val(data.class)}
    -   Track: ${val(data.track)}
    -   Primary Objective: ${val(data.objective)} (e.g., "Stable and predictable for a race" or "Aggressive for a qualifying lap")
    -   Weather Forecast: ${val(data.weatherCondition)}
    -   Expected Track Temp: ${val(data.trackTemp)}°C

3.  **Known Car Characteristics (if provided):**
    -   Driveline: ${val(data.driveline)}
    -   Engine Layout: ${val(data.engineLayout)}
--------------------------------------------------------------------

**Constraints:**
--------------------------------------------------------------------
-   Your response MUST be a complete setup sheet.
-   Provide a specific numerical value for each setting. Do not use ranges unless absolutely necessary.
-   Provide a concise (1-2 sentence) rationale for your key decisions (Aero, Springs, ARBs, Differential).
-   The setup should prioritize balance and predictability over raw, edgy performance.
-   Your reasoning must be grounded in the provided AMS2 Setup Principles.
--------------------------------------------------------------------

**Output Format:**
--------------------------------------------------------------------
Provide the response in Markdown format. Use the following structure:

### BASELINE SETUP: ${val(data.car)} @ ${val(data.track)}

#### RATIONALE
- **Aero Balance:** [Explain why you chose the front/rear downforce levels based on the track type.]
- **Suspension Philosophy:** [Explain your choice for spring and ARB stiffness.]
- **Differential:** [Explain the differential settings for corner entry/exit balance.]

---

#### SETUP VALUES

**[TYRES]**
- Compound: [Suggest a starting compound, e.g., Medium]
- Pressures (bar) FL/FR/RL/RR: .../.../.../...

**[BRAKES]**
- Brake Pressure: ...%
- Brake Bias: ...% F

**[CHASSIS & AERO]**
- Front Downforce: ...
- Rear Downforce: ...
- Ride Height Diff (Rake): ... mm

**[FRONT SUSPENSION]**
- Camber FL/FR: ...° / ...°
- Ride Height: ... mm
- Spring Rate: ... N/mm
- Toe: ...°
- ARB: ... N/mm

**[REAR SUSPENSION]**
- Camber RL/RR: ...° / ...°
- Ride Height: ... mm
- Spring Rate: ... N/mm
- Toe: ...°
- ARB: ... N/mm

**[DIFFERENTIAL]** (Provide settings relevant to the car's type if known)
- ...
--------------------------------------------------------------------
`.trim();

  switch (templateType) {
    case 'engineer':
      return setupTuningPrompt;
    case 'coach':
      return driverCoachingPrompt;
    case 'strategist':
      return raceStrategyPrompt;
    case 'baseline':
      return baselineSetupPrompt;
    case 'all':
    default:
      return `${fullDataSheet}\n\n\n${setupTuningPrompt}\n\n\n${driverCoachingPrompt}\n\n\n${raceStrategyPrompt}`;
  }
};


// --- PWA Install Hook ---
const usePWAInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            if (window.innerWidth <= 768) {
              setShowInstallPrompt(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        
        const timer = setTimeout(() => {
            setShowInstallPrompt(false);
        }, 10000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            clearTimeout(timer);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            setDeferredPrompt(null);
            setShowInstallPrompt(false);
        }
    };

    const closeInstallPrompt = () => {
        setShowInstallPrompt(false);
    };

    return { showInstallPrompt, handleInstallClick, closeInstallPrompt };
};


// --- UI Components ---

const Header: React.FC = () => (
  <header className="text-center mb-8 p-5 bg-black/30 rounded-lg border border-blue-500">
    <h1 className="text-blue-500 mb-2 text-3xl md:text-4xl font-bold">AMS2 Setup Template Generator</h1>
    <p className="text-slate-400 text-lg">Advanced Engineering Setup & Pit Strategy Template</p>
  </header>
);

interface SidebarProps {
  onPreview: () => void;
  onExport: () => void;
  onClear: () => void;
  onCopy: () => void;
  previewContent: string;
  presets: Preset[];
  onSavePreset: (name: string) => void;
  onLoadPreset: (name: string) => void;
  onDeletePreset: (name: string) => void;
  templateType: string;
  onTemplateTypeChange: (type: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onPreview, onExport, onClear, onCopy, previewContent,
  presets, onSavePreset, onLoadPreset, onDeletePreset,
  templateType, onTemplateTypeChange
}) => {
  const [copyText, setCopyText] = useState('Copy to Clipboard');
  const [presetName, setPresetName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');

  const handleCopy = () => {
    onCopy();
    setCopyText('Copied!');
    setTimeout(() => setCopyText('Copy to Clipboard'), 2000);
  };

  const handleSave = () => {
      onSavePreset(presetName);
  };

  const handleDelete = () => {
      if (selectedPreset) {
          onDeletePreset(selectedPreset);
          setSelectedPreset('');
          setPresetName('');
      }
  };

  const groupedPresets = useMemo(() => {
    return presets.reduce((acc: Record<string, Preset[]>, preset) => {
      const carClass = preset.class || 'Uncategorized';
      if (!acc[carClass]) {
        acc[carClass] = [];
      }
      acc[carClass].push(preset);
      return acc;
    }, {});
  }, [presets]);
  
  return (
    <aside className="lg:sticky lg:top-5 h-fit">
      <div className="bg-slate-800/50 p-4 rounded-lg mb-5 border-l-4 border-blue-500">
        <h3 className="text-blue-500 mb-2 text-lg font-semibold">Instructions</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
          <li>Leave field BLANK for system recommended values</li>
          <li>Use "–" for unavailable settings</li>
          <li>SI units only (kW, Nm, kg, °C, bar, N/mm, N/m/s)</li>
          <li>Record one configuration per session</li>
          <li>For tuning changes: describe change, purpose, and validation</li>
          <li>Test plan should document each setup iteration</li>
        </ul>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg mb-5 border-l-4 border-teal-500">
        <h3 className="text-teal-500 mb-3 text-lg font-semibold">Template Output</h3>
        <select 
            value={templateType}
            onChange={(e) => onTemplateTypeChange(e.target.value)}
            className="w-full pl-2 pr-10 py-2 bg-white/10 border border-slate-600 rounded-md text-slate-300 text-base focus:outline-none focus:border-teal-500 appearance-none bg-no-repeat bg-right-3"
            style={{backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`}}
        >
            <option className="text-black" value="all">All-in-One Template</option>
            <option className="text-black" value="engineer">AI Prompt: Race Engineer</option>
            <option className="text-black" value="coach">AI Prompt: Driver Coach</option>
            <option className="text-black" value="strategist">AI Prompt: Race Strategist</option>
            <option className="text-black" value="baseline">AI Prompt: Baseline Setup</option>
        </select>
        {['engineer', 'coach', 'strategist', 'baseline'].includes(templateType) && (
            <p className="text-xs text-slate-400 mt-2 italic animate-fade-in">
                Note: AI Prompts are generated for you to copy and use with your preferred AI model.
            </p>
        )}
      </div>


      <div className="bg-slate-800/50 p-4 rounded-lg mb-5 border-l-4 border-purple-500">
        <h3 className="text-purple-500 mb-3 text-lg font-semibold">Presets</h3>
        <div className="flex flex-col gap-3">
          <select 
            value={selectedPreset} 
            onChange={(e) => {
              const name = e.target.value;
              setSelectedPreset(name);
              if (name) {
                onLoadPreset(name);
                setPresetName(name);
              } else {
                setPresetName('');
              }
            }}
            className="w-full pl-2 pr-10 py-2 bg-white/10 border border-slate-600 rounded-md text-slate-300 text-base focus:outline-none focus:border-purple-500 appearance-none bg-no-repeat bg-right-3" style={{backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`}}
          >
            <option value="" className="text-black">Load Preset...</option>
            {Object.entries(groupedPresets).sort(([a], [b]) => a.localeCompare(b)).map(([carClass, classPresets]) => (
                <optgroup label={carClass} key={carClass}>
                    {classPresets.sort((a,b) => a.name.localeCompare(b.name)).map(p => <option className="text-black" key={p.name} value={p.name}>{p.name}</option>)}
                </optgroup>
            ))}
          </select>
          <input 
            type="text"
            placeholder="Enter preset name..."
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="w-full p-2 bg-white/10 border border-slate-600 rounded-md text-white text-base focus:outline-none focus:border-purple-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={handleSave} className="w-full px-4 py-2 border-none rounded-md text-sm cursor-pointer transition-all text-center text-white bg-purple-600 hover:bg-purple-700 active:translate-y-0.5">
                Save Preset
            </button>
            <button 
              onClick={handleDelete} 
              disabled={!selectedPreset}
              className="w-full px-4 py-2 border-none rounded-md text-sm cursor-pointer transition-all text-center text-white bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed active:translate-y-0.5">
                Delete Preset
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button onClick={onPreview} className="w-full px-5 py-3.5 border-none rounded-md text-base cursor-pointer transition-all duration-300 ease-in-out text-center text-white bg-blue-600 hover:bg-blue-700 active:translate-y-0.5">
          Preview Setup
        </button>
        <button onClick={onExport} className="w-full px-5 py-3.5 border-none rounded-md text-base cursor-pointer transition-all duration-300 ease-in-out text-center text-white bg-green-600 hover:bg-green-700 active:translate-y-0.5">
          Export to .txt
        </button>
        <button onClick={onClear} className="w-full px-5 py-3.5 border-none rounded-md text-base cursor-pointer transition-all duration-300 ease-in-out text-center text-white bg-slate-500 hover:bg-slate-600 active:translate-y-0.5">
          Clear Form
        </button>
      </div>

      {previewContent && (
        <div className="bg-slate-900/80 rounded-lg p-5 mt-5 border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-blue-500 border-b-2 border-blue-500 pb-2 text-xl">PREVIEW</h2>
            <button onClick={handleCopy} className={`px-4 py-2 rounded-md text-sm text-white transition-colors duration-300 ${copyText === 'Copied!' ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'}`}>
              {copyText}
            </button>
          </div>
          <pre className="whitespace-pre-wrap font-mono bg-[#1a1a1a] p-5 rounded-md max-h-[500px] overflow-y-auto text-xs leading-relaxed text-slate-200">
            {previewContent}
          </pre>
        </div>
      )}
    </aside>
  );
};

const MobileNav: React.FC = () => {
    const scrollToSection = (selector: string) => {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm p-2 z-50 border-t border-slate-700">
            <div className="flex justify-around">
                <button onClick={() => scrollToSection('#general-specs')} className="flex flex-col items-center text-slate-300 hover:text-blue-500 transition-colors text-xs p-2">
                    <span className="text-xl mb-1">📋</span>
                    <span>General</span>
                </button>
                 <button onClick={() => scrollToSection('#tyres')} className="flex flex-col items-center text-slate-300 hover:text-blue-500 transition-colors text-xs p-2">
                    <span className="text-xl mb-1">🛞</span>
                    <span>Tyres</span>
                </button>
                 <button onClick={() => scrollToSection('#suspension')} className="flex flex-col items-center text-slate-300 hover:text-blue-500 transition-colors text-xs p-2">
                    <span className="text-xl mb-1">⚙️</span>
                    <span>Suspension</span>
                </button>
                 <button onClick={() => scrollToSection('#controls')} className="flex flex-col items-center text-slate-300 hover:text-blue-500 transition-colors text-xs p-2">
                    <span className="text-xl mb-1">🎮</span>
                    <span>Controls</span>
                </button>
            </div>
        </nav>
    );
};

interface InstallPromptProps {
    onInstall: () => void;
    onClose: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ onInstall, onClose }) => (
    <div className="fixed bottom-20 left-4 right-4 bg-slate-900/95 backdrop-blur-md p-4 rounded-lg border border-blue-500 z-50 shadow-lg animate-fade-in-up">
        <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
                <strong className="text-white">Install AMS2 Setup Generator</strong>
                <p className="text-slate-300 text-sm">Add to your home screen for quick access</p>
            </div>
            <button onClick={onInstall} className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 text-sm">Install</button>
            <button onClick={onClose} className="ml-2 text-slate-400 text-2xl">&times;</button>
        </div>
    </div>
);


// --- Main App Component ---

export default function App() {
  const [formData, setFormData] = useState<SetupData>(initialSetupData);
  const [previewContent, setPreviewContent] = useState('');
  const { showInstallPrompt, handleInstallClick, closeInstallPrompt } = usePWAInstall();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [templateType, setTemplateType] = useState('all');
  const [isConverterOpen, setIsConverterOpen] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  }, []);

  useEffect(() => {
    try {
        const savedPresets = localStorage.getItem('ams2-presets');
        if (savedPresets) {
            const parsedPresets = JSON.parse(savedPresets);
            // Fix: Validate that the parsed data from localStorage is an array and that its elements are valid Presets.
            if (Array.isArray(parsedPresets)) {
                const validPresets = parsedPresets.filter((p: any): p is Preset => 
                    p && typeof p === 'object' && 
                    typeof p.name === 'string' && 
                    typeof p.class === 'string' && 
                    typeof p.data === 'object' && p.data !== null
                );
                setPresets(validPresets);
            }
        }
    } catch (error) {
        console.error("Failed to load presets from localStorage", error);
        localStorage.removeItem('ams2-presets');
    }
  }, []);

  const savePresetsToStorage = (updatedPresets: Preset[]) => {
    try {
        localStorage.setItem('ams2-presets', JSON.stringify(updatedPresets));
    } catch (error) {
        console.error("Failed to save presets to localStorage", error);
    }
  };

  const handleSavePreset = useCallback((name: string) => {
    if (!name.trim()) {
        alert("Please enter a name for the preset.");
        return;
    }
    const newPreset: Preset = {
        name,
        class: formData.class || 'Uncategorized',
        data: { ...formData },
    };

    const existingIndex = presets.findIndex(p => p.name === name);
    if (existingIndex > -1) {
        if (!window.confirm(`A preset named "${name}" already exists. Overwrite it?`)) {
            return;
        }
        const updatedPresets = [...presets];
        updatedPresets[existingIndex] = newPreset;
        setPresets(updatedPresets);
        savePresetsToStorage(updatedPresets);
        alert(`Preset "${name}" updated.`);
    } else {
        const updatedPresets = [...presets, newPreset];
        setPresets(updatedPresets);
        savePresetsToStorage(updatedPresets);
        alert(`Preset "${name}" saved.`);
    }
  }, [formData, presets]);

  const handleLoadPreset = useCallback((name: string) => {
      const preset = presets.find(p => p.name === name);
      if (preset) {
          setFormData(preset.data);
          alert(`Preset "${name}" loaded.`);
      }
  }, [presets]);

  const handleDeletePreset = useCallback((name: string) => {
      if (!name) return;
      if (window.confirm(`Are you sure you want to delete the preset "${name}"? This action cannot be undone.`)) {
          const updatedPresets = presets.filter(p => p.name !== name);
          setPresets(updatedPresets);
          savePresetsToStorage(updatedPresets);
          alert(`Preset "${name}" deleted.`);
      }
  }, [presets]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    if(isCheckbox) {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);
  
  const updateFormData = useCallback((updates: Partial<SetupData>) => {
    setFormData(prev => ({...prev, ...updates}));
  }, []);

  const handlePreview = useCallback(() => {
    const text = generateTemplateText(formData, templateType);
    setPreviewContent(text);
  }, [formData, templateType]);

  const handleExport = useCallback(() => {
    const text = generateTemplateText(formData, templateType);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const filename = `AMS2_Setup_${formData.car || 'Car'}_${formData.track || 'Track'}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [formData, templateType]);

  const handleClear = useCallback(() => {
    if(window.confirm("Are you sure you want to clear the entire form? This will not delete your saved presets.")) {
        setFormData(initialSetupData);
        setPreviewContent('');
    }
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(previewContent);
  }, [previewContent]);

  return (
    <div className="min-h-screen text-[#e6e6e6] font-sans p-2 sm:p-5">
      <div className="container max-w-7xl mx-auto">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-5">
          <main>
            <SetupForm formData={formData} handleChange={handleChange} updateFormData={updateFormData} />
          </main>
          <div id="controls">
            <Sidebar 
                onPreview={handlePreview}
                onExport={handleExport}
                onClear={handleClear}
                onCopy={handleCopy}
                previewContent={previewContent}
                presets={presets}
                onSavePreset={handleSavePreset}
                onLoadPreset={handleLoadPreset}
                onDeletePreset={handleDeletePreset}
                templateType={templateType}
                onTemplateTypeChange={setTemplateType}
            />
          </div>
        </div>
        <MobileNav />
        {showInstallPrompt && <InstallPrompt onInstall={handleInstallClick} onClose={closeInstallPrompt} />}

        <button
          onClick={() => setIsConverterOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-100"
          aria-label="Open unit converter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        {isConverterOpen && <UnitConverterModal onClose={() => setIsConverterOpen(false)} />}
        
        <footer className="text-center text-slate-500 py-8 lg:pb-4 text-sm">
            Created from template. All rights reserved.
        </footer>
      </div>
    </div>
  );
}