export interface SetupData {
  car: string;
  class: string;
  track: string;
  sessionType: string;
  raceLength: string;
  objective: string;
  weatherCondition: string;
  liveTrackCondition: string;
  trackTemp: string;
  airTemp: string;
  timeProgression: string;
  startTime: string;
  date: string;
  controlType: string;
  targetLapTimeMin: string;
  targetLapTimeSec: string;
  targetLapTimeMs: string;
  averageLapTimeMin: string;
  averageLapTimeSec: string;
  averageLapTimeMs: string;
  power: string;
  powerHP: string;
  torque: string;
  weight: string;
  weightDistribution: string;
  powerToWeight: string;
  powerToWeightHP: string;
  wheelbase: string;
  displacement: string;
  driveline: string;
  differential: string;
  engineType: string;
  engineLayout: string;
  aspiration: string;
  bmep: string;
  bmepKpa: string;
  compound: string;
  pressureFL: string;
  pressureFR: string;
  pressureRL: string;
  pressureRR: string;
  targetTemp: string;
  tyreNotes: string;
  brakePressure: string;
  brakeBias: string;
  brakeDuctFront: string;
  brakeDuctRear: string;
  coolingNotes: string;
  frontDownforce: string;
  rearDownforce: string;
  longitudinalBias: string;
  lateralBias: string;
  weightJacker: string;
  rideHeightDiff: string;
  chassisNotes: string;
  frontCaster: string;
  camberFL: string;
  camberFR: string;
  frontRideHeight: string;
  frontSpringRate: string;
  frontBumpStopRange: string;
  frontSlowBump: string;
  frontSlowRebound: string;
  frontFastBump: string;
  frontFastRebound: string;
  steeringLock: string;
  frontToeCenter: string;
  frontARB: string;
  front3rdSpring: string;
  frontCenterBumpStop: string;
  frontCenterSlowBump: string;
  frontCenterSlowRebound: string;
  frontCenterFastBump: string;
  frontCenterFastRebound: string;
  frontSuspensionNotes: string;
  camberRL: string;
  camberRR: string;
  rearRideHeight: string;
  rearSpringRate: string;
  rearSlowBump: string;
  rearSlowRebound: string;
  rearFastBump: string;
  rearFastRebound: string;
  rearToeCenter: string;
  rearARB: string;
  rear3rdSpring: string;
  rearCenterBumpStop: string;
  rearCenterSlowBump: string;
  rearCenterSlowRebound: string;
  rearCenterFastBump: string;
  rearCenterFastRebound: string;
  rearSuspensionNotes: string;
  finalDriveRatio: string;
  gear1: string;
  gear2: string;
  gear3: string;
  gear4: string;
  gear5: string;
  gear6: string;
  gear7: string;
  gear8: string;
  frontDiffType: string;
  frontSpool?: string;
  frontGearedLSD?: string;
  frontPowerBias?: string;
  frontCoastBias?: string;
  frontClutchLSD?: string;
  frontPreload?: string;
  frontClutches?: string;
  frontPowerRamp?: string;
  frontCoastRamp?: string;
  frontViscousLSD?: string;
  frontViscousLock?: string;
  frontDiffNotes: string;
  rearDiffType: string;
  rearSpool?: string;
  rearGearedLSD?: string;
  rearPowerBias?: string;
  rearCoastBias?: string;
  rearClutchLSD?: string;
  rearPreload?: string;
  rearClutches?: string;
  rearPowerRamp?: string;
  rearCoastRamp?: string;
  rearViscousLSD?: string;
  rearViscousLock?: string;
  rearDiffNotes: string;
  fuelMap: string;
  engineBraking: string;
  tractionControl: string;
  absLevel: string;
  boostPressure: string;
  engineRadiator: string;
  engineNotes: string;
  startFuel: string;
  fuelConsumption: string;
  pitStops: string;
  pitWindow: string;
  refuelAmount: string;
  tyreChange: string;
  driverChange: string;
  flSuspension: boolean;
  frSuspension: boolean;
  rlSuspension: boolean;
  rrSuspension: boolean;
  flBrake: boolean;
  frBrake: boolean;
  rlBrake: boolean;
  rrBrake: boolean;
  engineRepair: boolean;
  transmissionRepair: boolean;
  frontAero: boolean;
  rearAero: boolean;
  tirePressureAdjustments: string;
  engineMapChange: string;
  brakeBiasChange: string;
  pitStrategyNotes: string;
  stop1Lap: string;
  stop1Fuel: string;
  stop1Compound: string;
  stop1Pressures: string;
  stop1BrakeBias: string;
  stop1Notes: string;
  stop2Lap: string;
  stop2Fuel: string;
  stop2Compound: string;
  stop2Pressures: string;
  stop2BrakeBias: string;
  stop2Notes: string;
  tuningChange1: string;
  tuningChange2: string;
  tuningChange3: string;
  tuningChange4: string;
  tuningChange5: string;
  tuningChange6: string;
  iteration1: string;
  iteration2: string;
  iteration3: string;
  iteration4: string;
  iteration5: string;
  iteration6: string;
  observationSummary: string;
  // AI prompt fields
  handlingBalance: string;
  cornerEntry: string;
  cornerMid: string;
  cornerExit: string;
  straightLine: string;
  driverNotes: string;
}

export const initialSetupData: SetupData = {
  car: '', class: '', track: '', sessionType: '', raceLength: '', objective: '',
  weatherCondition: '', liveTrackCondition: '', trackTemp: '', airTemp: '',
  timeProgression: '', startTime: '', date: '', controlType: '',
  targetLapTimeMin: '', targetLapTimeSec: '', targetLapTimeMs: '',
  averageLapTimeMin: '', averageLapTimeSec: '', averageLapTimeMs: '',
  power: '', powerHP: '', torque: '', weight: '', weightDistribution: '',
  powerToWeight: '', powerToWeightHP: '', wheelbase: '', displacement: '',
  driveline: '', differential: '', engineType: '', engineLayout: '', aspiration: '',
  bmep: '', bmepKpa: '', compound: '', pressureFL: '', pressureFR: '',
  pressureRL: '', pressureRR: '', targetTemp: '', tyreNotes: '', brakePressure: '',
  brakeBias: '', brakeDuctFront: '', brakeDuctRear: '', coolingNotes: '',
  frontDownforce: '', rearDownforce: '', longitudinalBias: '', lateralBias: '',
  weightJacker: '', rideHeightDiff: '', chassisNotes: '', frontCaster: '',
  camberFL: '', camberFR: '', frontRideHeight: '', frontSpringRate: '',
  frontBumpStopRange: '', frontSlowBump: '', frontSlowRebound: '',
  frontFastBump: '', frontFastRebound: '', steeringLock: '', frontToeCenter: '',
  frontARB: '', front3rdSpring: '', frontCenterBumpStop: '',
  frontCenterSlowBump: '', frontCenterSlowRebound: '', frontCenterFastBump: '',
  frontCenterFastRebound: '', frontSuspensionNotes: '', camberRL: '', camberRR: '',
  rearRideHeight: '', rearSpringRate: '', rearSlowBump: '', rearSlowRebound: '',
  rearFastBump: '', rearFastRebound: '', rearToeCenter: '', rearARB: '',
  rear3rdSpring: '', rearCenterBumpStop: '', rearCenterSlowBump: '',
  rearCenterSlowRebound: '', rearCenterFastBump: '', rearCenterFastRebound: '',
  rearSuspensionNotes: '', finalDriveRatio: '', gear1: '', gear2: '', gear3: '',
  gear4: '', gear5: '', gear6: '', gear7: '', gear8: '', frontDiffType: '',
  frontDiffNotes: '', rearDiffType: '', rearDiffNotes: '', fuelMap: '',
  engineBraking: '', tractionControl: '', absLevel: '', boostPressure: '',
  engineRadiator: '', engineNotes: '', startFuel: '', fuelConsumption: '',
  pitStops: '1', pitWindow: '', refuelAmount: '', tyreChange: '', driverChange: '',
  flSuspension: false, frSuspension: false, rlSuspension: false, rrSuspension: false,
  flBrake: false, frBrake: false, rlBrake: false, rrBrake: false,
  engineRepair: false, transmissionRepair: false, frontAero: false, rearAero: false,
  tirePressureAdjustments: '', engineMapChange: '', brakeBiasChange: '',
  pitStrategyNotes: '', stop1Lap: '', stop1Fuel: '', stop1Compound: '',
  stop1Pressures: '', stop1BrakeBias: '', stop1Notes: '', stop2Lap: '',
  stop2Fuel: '', stop2Compound: '', stop2Pressures: '', stop2BrakeBias: '',
  stop2Notes: '', tuningChange1: '', tuningChange2: '', tuningChange3: '',
  tuningChange4: '', tuningChange5: '', tuningChange6: '', iteration1: '',
  iteration2: '', iteration3: '', iteration4: '', iteration5: '', iteration6: '',
  observationSummary: '',
  handlingBalance: '', cornerEntry: '', cornerMid: '', cornerExit: '',
  straightLine: '', driverNotes: '',
};

export interface Preset {
    name: string;
    class: string;
    data: SetupData;
}
