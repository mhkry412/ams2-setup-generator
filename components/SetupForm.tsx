

import React, { useState, useMemo } from 'react';
import type { SetupData } from '../types';

// --- Reusable UI Components ---

// Fix: Make children optional to prevent crashes if the component is somehow rendered without them.
const InfoIcon = ({ children }: { children?: React.ReactNode }) => (
  <div className="relative inline-block ml-2 group align-middle">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
    <div className="absolute bottom-full left-1/2 z-20 w-64 p-3 mb-2 -translate-x-1/2 bg-slate-800 border border-slate-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-xs text-slate-200">
      {children}
      <svg className="absolute left-1/2 -translate-x-1/2 top-full" width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 8L0 0H16L8 8Z" fill="#334155"/>
      </svg>
    </div>
  </div>
);

interface SectionProps {
  id?: string;
  title: string;
  children: React.ReactNode;
}
const Section: React.FC<SectionProps> = ({ id, title, children }) => (
  <section id={id} className="bg-slate-900/80 rounded-lg p-5 mb-5 border border-slate-700">
    <h2 className="text-blue-500 border-b-2 border-blue-500 pb-2 mb-6 text-xl font-semibold">{title}</h2>
    {children}
  </section>
);

// Fix: Make label optional to allow FormInput to be used without its own rendered label, resolving invalid nested label HTML.
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  info?: React.ReactNode;
}
const FormInput: React.FC<FormInputProps> = ({ label, name, info, ...props }) => (
  <div className="form-group mb-3">
    {/* Fix: Conditionally render the label only if the prop is provided. */}
    {label && (
      <label htmlFor={name} className="block mb-1.5 text-sm text-slate-300 flex items-center">
        {label}
        {info && <InfoIcon>{info}</InfoIcon>}
      </label>
    )}
    <input name={name} id={name} {...props} className="w-full p-3 bg-white/10 border border-slate-600 rounded-md text-white text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors" />
  </div>
);

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
  info?: React.ReactNode;
}
const FormSelect: React.FC<FormSelectProps> = ({ label, name, children, info, ...props }) => (
  <div className="form-group mb-3 relative z-20 focus-within:z-40">
    <label htmlFor={name} className="block mb-1.5 text-sm text-slate-300 flex items-center">
      {label}
      {info && <InfoIcon>{info}</InfoIcon>}
    </label>
    <select name={name} id={name} {...props} className="w-full pl-3 pr-10 py-3 bg-white/10 border border-slate-600 rounded-md text-slate-300 text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors appearance-none bg-no-repeat bg-right-3" style={{backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`}}>
      {children}
    </select>
  </div>
);

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}
const FormTextarea: React.FC<FormTextareaProps> = ({ label, name, ...props }) => (
    <div className="form-group mt-4">
        <label htmlFor={name} className="block mb-1.5 text-sm text-slate-300">{label}</label>
        <textarea name={name} id={name} {...props} className="w-full p-3 bg-white/10 border border-slate-600 rounded-md text-white text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors" />
    </div>
);

interface TimeInputGroupProps {
    label: string;
    namePrefix: string;
    values: { min: string; sec: string; ms: string };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TimeInputGroup: React.FC<TimeInputGroupProps> = ({ label, namePrefix, values, onChange }) => (
    <div className="form-group mb-3">
        <label className="block mb-1.5 text-sm text-slate-300">{label}</label>
        <div className="flex items-center gap-2">
            <input name={`${namePrefix}Min`} value={values.min} onChange={onChange} placeholder="Min" className="w-full p-3 bg-white/10 border border-slate-600 rounded-md text-white text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors text-center" />
            <span className="text-slate-400">:</span>
            <input name={`${namePrefix}Sec`} value={values.sec} onChange={onChange} placeholder="Sec" className="w-full p-3 bg-white/10 border border-slate-600 rounded-md text-white text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors text-center" />
            <span className="text-slate-400">.</span>
            <input name={`${namePrefix}Ms`} value={values.ms} onChange={onChange} placeholder="Ms" className="w-full p-3 bg-white/10 border border-slate-600 rounded-md text-white text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors text-center" />
        </div>
    </div>
);

interface UnitToggleProps {
  units: { key: string, label: string }[];
  activeUnit: string;
  onToggle: (unit: string) => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ units, activeUnit, onToggle }) => (
  <div className="flex gap-2 mb-4">
    {units.map(unit => (
      <button
        key={unit.key}
        type="button"
        onClick={() => onToggle(unit.key)}
        className={`px-4 py-2 rounded-md text-sm transition-colors ${activeUnit === unit.key ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
      >
        {unit.label}
      </button>
    ))}
  </div>
);


// --- Form Section Components ---

interface FormSectionProps {
  data: SetupData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  updateFormData?: (updates: Partial<SetupData>) => void;
}

const GeneralSection: React.FC<FormSectionProps> = ({ data, handleChange }) => {
    const [powerUnit, setPowerUnit] = useState('kw');
    const [bmepUnit, setBmepUnit] = useState('bar');
    
    return (
    <Section id="general-specs" title="GENERAL VEHICLE SPECIFICATIONS">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4">
            <FormInput label="Car" name="car" value={data.car} onChange={handleChange} />
            <FormInput label="Class" name="class" value={data.class} onChange={handleChange} />
            <FormInput label="Track" name="track" value={data.track} onChange={handleChange} />
            <FormSelect label="Session Type" name="sessionType" value={data.sessionType} onChange={handleChange}>
                <option className="text-black" value="">Select</option>
                <option className="text-black">Qualifying</option><option className="text-black">Race</option><option className="text-black">Endurance</option><option className="text-black">Practice</option>
            </FormSelect>
            <FormInput label="Race Length (laps or time)" name="raceLength" value={data.raceLength} onChange={handleChange} placeholder="e.g., 30 laps or 45min" />
            <FormInput label="Objective / Focus" name="objective" value={data.objective} onChange={handleChange} placeholder="e.g. Stability / Tyre life" />
            <FormSelect label="Weather Condition" name="weatherCondition" value={data.weatherCondition} onChange={handleChange}>
                <option className="text-black" value="">Select</option>
                <option className="text-black">Clear</option><option className="text-black">Cloud (Light)</option><option className="text-black">Cloud (Medium)</option><option className="text-black">Cloud (Heavy)</option>
                <option className="text-black">Rain</option><option className="text-black">Fog</option><option className="text-black">Hazy</option><option className="text-black">Random</option>
                <option className="text-black" value="Real weather (OpenWeather)">Real weather (OpenWeather Database)</option>
            </FormSelect>
            <FormSelect label="LiveTrack Condition" name="liveTrackCondition" value={data.liveTrackCondition} onChange={handleChange}>
                <option className="text-black">Default</option><option className="text-black">Wet</option><option className="text-black">Damp</option><option className="text-black">Green</option>
                <option className="text-black">Light Rubber</option><option className="text-black">Medium Rubber</option><option className="text-black">Heavy Rubber</option>
            </FormSelect>
            <FormInput label="Track Temp (°C)" name="trackTemp" value={data.trackTemp} onChange={handleChange} />
            <FormInput label="Air Temp (°C)" name="airTemp" value={data.airTemp} onChange={handleChange} />
            <FormSelect label="Time Progression" name="timeProgression" value={data.timeProgression} onChange={handleChange}>
                <option className="text-black" value="">Select</option>
                {[ 'Real-time', '2x', '5x', '10x', '15x', '20x', '25x', '30x', '40x', '50x', '60x', 'Off'].map(v => <option className="text-black" key={v}>{v}</option>)}
            </FormSelect>
            <FormSelect label="Start Time" name="startTime" value={data.startTime} onChange={handleChange}>
                 <option className="text-black" value="">Select</option>
                {Array.from({length: 24}, (_, i) => `${i.toString().padStart(2,'0')}:00`).map(t => <option className="text-black" key={t}>{t}</option>)}
            </FormSelect>
            <FormInput label="Date" name="date" type="date" value={data.date} onChange={handleChange} />
            <FormSelect label="Type of Control Used" name="controlType" value={data.controlType} onChange={handleChange}>
                <option className="text-black" value="">Select</option><option className="text-black">Wheel</option><option className="text-black">Gamepad</option><option className="text-black">Other</option>
            </FormSelect>
            <TimeInputGroup label="Target Lap Time" namePrefix="targetLapTime" values={{min: data.targetLapTimeMin, sec: data.targetLapTimeSec, ms: data.targetLapTimeMs}} onChange={handleChange} />
            <TimeInputGroup label="Average Lap Time (during test)" namePrefix="averageLapTime" values={{min: data.averageLapTimeMin, sec: data.averageLapTimeSec, ms: data.averageLapTimeMs}} onChange={handleChange} />
        </div>
        <h3 className="text-blue-500 mt-6 mb-4 text-lg font-semibold">Vehicle Specifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4">
             <div>
                <UnitToggle units={[{key: 'kw', label: 'kW'}, {key: 'hp', label: 'HP'}]} activeUnit={powerUnit} onToggle={setPowerUnit} />
                {powerUnit === 'kw' ? 
                    <FormInput label="Power (kW)" name="power" value={data.power} onChange={handleChange} /> : 
                    <FormInput label="Power (HP)" name="powerHP" value={data.powerHP} onChange={handleChange} />}
            </div>
            <FormInput label="Torque (Nm)" name="torque" value={data.torque} onChange={handleChange} />
            <FormInput label="Weight (kg)" name="weight" value={data.weight} onChange={handleChange} />
            <FormInput label="Weight Distribution (F/R %)" name="weightDistribution" value={data.weightDistribution} onChange={handleChange} />
            <div>
                 {powerUnit === 'kw' ? 
                    <FormInput label="Power-to-Weight (kW/kg)" name="powerToWeight" value={data.powerToWeight} onChange={handleChange} /> : 
                    <FormInput label="Power-to-Weight (HP/kg)" name="powerToWeightHP" value={data.powerToWeightHP} onChange={handleChange} />}
            </div>
            <FormInput label="Wheelbase (mm)" name="wheelbase" value={data.wheelbase} onChange={handleChange} />
            <FormInput label="Displacement (cc or L)" name="displacement" value={data.displacement} onChange={handleChange} />
            <FormSelect label="Driveline" name="driveline" value={data.driveline} onChange={handleChange}><option className="text-black" value=""></option><option className="text-black">FWD</option><option className="text-black">RWD</option><option className="text-black">AWD</option></FormSelect>
            <FormSelect label="Differential" name="differential" value={data.differential} onChange={handleChange}><option className="text-black" value=""></option><option className="text-black">Open</option><option className="text-black">LSD</option><option className="text-black">Spool</option><option className="text-black">Viscous</option><option className="text-black">Electronic</option></FormSelect>
            <FormInput label="Engine Type" name="engineType" value={data.engineType} onChange={handleChange} />
            <FormSelect label="Engine Layout" name="engineLayout" value={data.engineLayout} onChange={handleChange}><option className="text-black" value=""></option><option className="text-black">I4</option><option className="text-black">V6</option><option className="text-black">V8</option><option className="text-black">Flat</option><option className="text-black">Inline</option><option className="text-black">Other</option></FormSelect>
            <FormSelect label="Aspiration" name="aspiration" value={data.aspiration} onChange={handleChange}><option className="text-black" value=""></option><option className="text-black">NA</option><option className="text-black">Turbo</option><option className="text-black">Supercharged</option></FormSelect>
            <div>
                <UnitToggle units={[{key: 'bar', label: 'bar'}, {key: 'kpa', label: 'kPa'}]} activeUnit={bmepUnit} onToggle={setBmepUnit} />
                {bmepUnit === 'bar' ?
                    <FormInput label="BMEP (bar)" name="bmep" value={data.bmep} onChange={handleChange} /> :
                    <FormInput label="BMEP (kPa)" name="bmepKpa" value={data.bmepKpa} onChange={handleChange} />
                }
            </div>
        </div>
    </Section>
    )
};

const TyresSection: React.FC<FormSectionProps> = ({ data, handleChange }) => (
    <Section id="tyres" title="TYRES">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormInput label="Compound" name="compound" value={data.compound} onChange={handleChange} />
            <FormInput label="Target Temp Range (°C)" name="targetTemp" value={data.targetTemp} onChange={handleChange} />
        </div>
        <div>
            <label className="block mb-1.5 text-sm text-slate-300 flex items-center">
                Pressures (bar)
                <InfoIcon>Adjust to get middle tyre temp between inner and outer temps. Low middle temp → increase pressure. High middle temp → decrease pressure.</InfoIcon>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <FormInput label="FL" name="pressureFL" value={data.pressureFL} onChange={handleChange} />
                <FormInput label="FR" name="pressureFR" value={data.pressureFR} onChange={handleChange} />
                <FormInput label="RL" name="pressureRL" value={data.pressureRL} onChange={handleChange} />
                <FormInput label="RR" name="pressureRR" value={data.pressureRR} onChange={handleChange} />
            </div>
        </div>
        <FormTextarea label="Tyre Notes" name="tyreNotes" value={data.tyreNotes} onChange={handleChange} rows={3} />
    </Section>
);

const BrakesSection: React.FC<FormSectionProps> = ({ data, handleChange }) => (
    <Section title="BRAKES">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4">
            <FormInput label="Brake Pressure (%)" name="brakePressure" value={data.brakePressure} onChange={handleChange} />
            <FormInput label="Brake Bias (F/R %)" name="brakeBias" value={data.brakeBias} onChange={handleChange} info="Fronts should lock before rears. Try >60% for front-engine cars, <60% for mid/rear-engine cars." />
            <FormInput label="Brake Duct Front (%)" name="brakeDuctFront" value={data.brakeDuctFront} onChange={handleChange} />
            <FormInput label="Brake Duct Rear (%)" name="brakeDuctRear" value={data.brakeDuctRear} onChange={handleChange} />
        </div>
        <FormTextarea label="Cooling Notes" name="coolingNotes" value={data.coolingNotes} onChange={handleChange} rows={3} />
    </Section>
);

const ChassisSection: React.FC<FormSectionProps> = ({ data, handleChange }) => (
    <Section title="CHASSIS">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4">
            <FormInput label="Front Downforce" name="frontDownforce" value={data.frontDownforce} onChange={handleChange} />
            <FormInput label="Rear Downforce" name="rearDownforce" value={data.rearDownforce} onChange={handleChange} />
            <FormInput label="Longitudinal Weight Bias (%F)" name="longitudinalBias" value={data.longitudinalBias} onChange={handleChange} />
            <FormInput label="Lateral Weight Bias (%)" name="lateralBias" value={data.lateralBias} onChange={handleChange} />
            <FormInput label="Weight Jacker" name="weightJacker" value={data.weightJacker} onChange={handleChange} />
            <FormInput label="Ride Height Difference (Rake)" name="rideHeightDiff" value={data.rideHeightDiff} onChange={handleChange} info="High rake (rear higher than front) creates more oversteer. Low rake creates more understeer."/>
        </div>
        <FormTextarea label="Notes" name="chassisNotes" value={data.chassisNotes} onChange={handleChange} rows={3} />
    </Section>
);

const SuspensionSection: React.FC<FormSectionProps> = ({ data, handleChange }) => (
  <div id="suspension">
    <Section title="FRONT SUSPENSION">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/40 p-4 rounded-lg">
          <h3 className="text-blue-500 mb-4 text-lg">Right/Left</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormInput label="Caster (°)" name="frontCaster" value={data.frontCaster} onChange={handleChange} info="Higher caster provides more stability but can cause understeer in high-speed corners. Tune to driver preference."/>
            <div>
                <label className="block mb-1.5 text-sm text-slate-300 flex items-center">
                    Camber (°)
                    <InfoIcon>Target front inside tyre temp ~7°C hotter than outside. Target rear inside temp 3-5°C hotter. Use pressure to balance middle temp.</InfoIcon>
                </label>
                <div className="grid grid-cols-2 gap-4">
                    {/* Fix: Remove label prop to avoid invalid nested labels and remove confusing comment. */}
                    <FormInput name="camberFL" value={data.camberFL} onChange={handleChange} placeholder="FL"/>
                    {/* Fix: Remove label prop to avoid invalid nested labels and remove confusing comment. */}
                    <FormInput name="camberFR" value={data.camberFR} onChange={handleChange} placeholder="FR"/>
                </div>
            </div>
            <FormInput label="Ride Height (mm)" name="frontRideHeight" value={data.frontRideHeight} onChange={handleChange}/>
            <FormInput label="Spring Rate (N/mm)" name="frontSpringRate" value={data.frontSpringRate} onChange={handleChange}/>
            <FormInput label="Bump Stop Range (mm)" name="frontBumpStopRange" value={data.frontBumpStopRange} onChange={handleChange}/>
            <FormInput label="Slow Bump (N/m/s)" name="frontSlowBump" value={data.frontSlowBump} onChange={handleChange}/>
            <FormInput label="Slow Rebound (N/m/s)" name="frontSlowRebound" value={data.frontSlowRebound} onChange={handleChange}/>
            <FormInput label="Fast Bump (N/m/s)" name="frontFastBump" value={data.frontFastBump} onChange={handleChange}/>
            <FormInput label="Fast Rebound (N/m/s)" name="frontFastRebound" value={data.frontFastRebound} onChange={handleChange}/>
          </div>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-lg">
          <h3 className="text-blue-500 mb-4 text-lg">Center</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormInput label="Steering Lock (°)" name="steeringLock" value={data.steeringLock} onChange={handleChange}/>
            <FormInput label="Toe Center (°)" name="frontToeCenter" value={data.frontToeCenter} onChange={handleChange} info="AMS2 guide recommends Front <= -1.0° and Rear <= 0.8°. More toe increases heat and wear."/>
            <FormInput label="Anti-Roll Bar (N/mm)" name="frontARB" value={data.frontARB} onChange={handleChange} info="Stiffer front ARB = more understeer. Stiffer rear ARB = more oversteer. Adjust to balance car through corners."/>
            <FormInput label="3rd Spring (N/mm)" name="front3rdSpring" value={data.front3rdSpring} onChange={handleChange} info="Also called heave spring. Engages under high downforce/compression to maintain ride height. Stiffer spring prevents bottoming out but can make the car harsh over bumps."/>
            <FormInput label="Bump Stop (mm)" name="frontCenterBumpStop" value={data.frontCenterBumpStop} onChange={handleChange}/>
            <FormInput label="Slow Bump (N/m/s)" name="frontCenterSlowBump" value={data.frontCenterSlowBump} onChange={handleChange}/>
            <FormInput label="Slow Rebound (N/m/s)" name="frontCenterSlowRebound" value={data.frontCenterSlowRebound} onChange={handleChange}/>
            <FormInput label="Fast Bump (N/m/s)" name="frontCenterFastBump" value={data.frontCenterFastBump} onChange={handleChange}/>
            <FormInput label="Fast Rebound (N/m/s)" name="frontCenterFastRebound" value={data.frontCenterFastRebound} onChange={handleChange}/>
          </div>
        </div>
      </div>
      <FormTextarea label="Front Suspension Notes" name="frontSuspensionNotes" value={data.frontSuspensionNotes} onChange={handleChange} rows={3}/>
    </Section>
    <Section title="REAR SUSPENSION">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-slate-800/40 p-4 rounded-lg">
          <h3 className="text-blue-500 mb-4 text-lg">Right/Left</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <div>
                <label className="block mb-1.5 text-sm text-slate-300 flex items-center">
                    Camber (°)
                    <InfoIcon>Target rear inside temp 3-5°C hotter than outside. Use pressure to balance middle temp.</InfoIcon>
                </label>
                <div className="grid grid-cols-2 gap-4">
                    {/* Fix: Remove label prop to avoid invalid nested labels. */}
                    <FormInput name="camberRL" value={data.camberRL} onChange={handleChange} placeholder="RL"/>
                    {/* Fix: Remove label prop to avoid invalid nested labels. */}
                    <FormInput name="camberRR" value={data.camberRR} onChange={handleChange} placeholder="RR"/>
                </div>
            </div>
            <FormInput label="Ride Height (mm)" name="rearRideHeight" value={data.rearRideHeight} onChange={handleChange}/>
            <FormInput label="Spring Rate (N/mm)" name="rearSpringRate" value={data.rearSpringRate} onChange={handleChange}/>
            <FormInput label="Slow Bump (N/m/s)" name="rearSlowBump" value={data.rearSlowBump} onChange={handleChange}/>
            <FormInput label="Slow Rebound (N/m/s)" name="rearSlowRebound" value={data.rearSlowRebound} onChange={handleChange}/>
            <FormInput label="Fast Bump (N/m/s)" name="rearFastBump" value={data.rearFastBump} onChange={handleChange}/>
            <FormInput label="Fast Rebound (N/m/s)" name="rearFastRebound" value={data.rearFastRebound} onChange={handleChange}/>
          </div>
        </div>
         <div className="bg-slate-800/40 p-4 rounded-lg">
          <h3 className="text-blue-500 mb-4 text-lg">Center</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormInput label="Toe Center (°)" name="rearToeCenter" value={data.rearToeCenter} onChange={handleChange} info="AMS2 guide recommends Rear <= 0.8°. More toe increases heat and wear."/>
            <FormInput label="Anti-Roll Bar (N/mm)" name="rearARB" value={data.rearARB} onChange={handleChange} info="Stiffer rear ARB = more oversteer. Soften to reduce oversteer."/>
            <FormInput label="3rd Spring (N/mm)" name="rear3rdSpring" value={data.rear3rdSpring} onChange={handleChange}/>
            <FormInput label="Bump Stop (mm)" name="rearCenterBumpStop" value={data.rearCenterBumpStop} onChange={handleChange}/>
            <FormInput label="Slow Bump (N/m/s)" name="rearCenterSlowBump" value={data.rearCenterSlowBump} onChange={handleChange}/>
            <FormInput label="Slow Rebound (N/m/s)" name="rearCenterSlowRebound" value={data.rearCenterSlowRebound} onChange={handleChange}/>
            <FormInput label="Fast Bump (N/m/s)" name="rearCenterFastBump" value={data.rearCenterFastBump} onChange={handleChange}/>
            <FormInput label="Fast Rebound (N/m/s)" name="rearCenterFastRebound" value={data.rearCenterFastRebound} onChange={handleChange}/>
          </div>
        </div>
      </div>
      <FormTextarea label="Rear Suspension Notes" name="rearSuspensionNotes" value={data.rearSuspensionNotes} onChange={handleChange} rows={3}/>
    </Section>
  </div>
);

const GearsSection: React.FC<FormSectionProps> = ({ data, handleChange }) => (
    <Section title="GEAR RATIOS">
        <div className="max-w-xs">
            <FormInput label="Final Drive Ratio" name="finalDriveRatio" value={data.finalDriveRatio} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mt-4">
            {Array.from({length: 8}, (_, i) => i + 1).map(g => (
                <FormInput key={g} label={`Gear ${g}`} name={`gear${g}`} value={data[`gear${g}` as keyof SetupData] as string} onChange={handleChange} />
            ))}
        </div>
    </Section>
);

const DifferentialSection: React.FC<FormSectionProps> = ({ data, handleChange }) => {
    const diffTypes = ["", "Spool", "Geared LSD", "Clutch LSD", "Viscous LSD", "Ratcheting", "–"];

    const renderDiffSettings = (prefix: 'front' | 'rear') => {
        const type = data[`${prefix}DiffType`];
        switch (type) {
            case 'Spool': return <FormSelect label="Spool" name={`${prefix}Spool`} value={data[`${prefix}Spool`]} onChange={handleChange}><option className="text-black">On</option><option className="text-black">Off</option></FormSelect>;
            case 'Geared LSD': return <>
                <FormInput label="Bias Ratio (Power)" name={`${prefix}PowerBias`} value={data[`${prefix}PowerBias`]} onChange={handleChange} />
                <FormInput label="Bias Ratio (Coast)" name={`${prefix}CoastBias`} value={data[`${prefix}CoastBias`]} onChange={handleChange} />
            </>;
            case 'Clutch LSD': return <>
                <FormInput label="Preload" name={`${prefix}Preload`} value={data[`${prefix}Preload`]} onChange={handleChange} info="Amount of static lock. Higher preload increases stability but also understeer, especially off-throttle." />
                <FormInput label="Clutches" name={`${prefix}Clutches`} value={data[`${prefix}Clutches`]} onChange={handleChange} />
                <FormInput label="Power Ramp" name={`${prefix}PowerRamp`} value={data[`${prefix}PowerRamp`]} onChange={handleChange} info="Locking on-power. Lower angle = more lock = more oversteer on exit. Higher angle = less lock = more understeer on exit." />
                <FormInput label="Coast Ramp" name={`${prefix}CoastRamp`} value={data[`${prefix}CoastRamp`]} onChange={handleChange} info="Locking off-power. Lower angle = more lock = more oversteer on entry. Higher angle = less lock = more understeer on entry." />
            </>;
            case 'Viscous LSD': return <FormInput label="Viscous Lock" name={`${prefix}ViscousLock`} value={data[`${prefix}ViscousLock`]} onChange={handleChange} />;
            default: return <p className="text-sm text-slate-400 italic mt-2">Select a differential type to see settings.</p>;
        }
    };
    
    return (
        <Section title="DIFFERENTIAL">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-blue-500 mb-4 text-lg">FRONT DIFFERENTIAL</h3>
                    <FormSelect label="Type" name="frontDiffType" value={data.frontDiffType} onChange={handleChange}>
                        {diffTypes.map(t => <option className="text-black" key={`f-${t}`} value={t}>{t || 'Select'}</option>)}
                    </FormSelect>
                    <div className="bg-slate-800/40 p-4 rounded-lg mt-4 min-h-[100px]">{renderDiffSettings('front')}</div>
                    <FormTextarea label="Notes" name="frontDiffNotes" value={data.frontDiffNotes} onChange={handleChange} rows={2} />
                </div>
                 <div>
                    <h3 className="text-blue-500 mb-4 text-lg">REAR DIFFERENTIAL</h3>
                    <FormSelect label="Type" name="rearDiffType" value={data.rearDiffType} onChange={handleChange}>
                        {diffTypes.map(t => <option className="text-black" key={`r-${t}`} value={t}>{t || 'Select'}</option>)}
                    </FormSelect>
                    <div className="bg-slate-800/40 p-4 rounded-lg mt-4 min-h-[100px]">{renderDiffSettings('rear')}</div>
                    <FormTextarea label="Notes" name="rearDiffNotes" value={data.rearDiffNotes} onChange={handleChange} rows={2} />
                </div>
            </div>
        </Section>
    )
};

const EngineSection: React.FC<FormSectionProps> = ({ data, handleChange }) => (
    <Section title="ENGINE / ELECTRONICS">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4">
            <FormInput label="Fuel Map" name="fuelMap" value={data.fuelMap} onChange={handleChange} />
            <FormInput label="Engine Braking" name="engineBraking" value={data.engineBraking} onChange={handleChange} info="WARNING: Due to a bug in AMS2, values above 5 can cause engine failure in some cars. Use with caution."/>
            <FormInput label="Traction Control Level" name="tractionControl" value={data.tractionControl} onChange={handleChange} />
            <FormInput label="ABS Level" name="absLevel" value={data.absLevel} onChange={handleChange} />
            <FormInput label="Boost Pressure (%)" name="boostPressure" value={data.boostPressure} onChange={handleChange} />
            <FormInput label="Radiator Opening (%)" name="engineRadiator" value={data.engineRadiator} onChange={handleChange} />
        </div>
        <FormTextarea label="Notes" name="engineNotes" value={data.engineNotes} onChange={handleChange} rows={3} />
    </Section>
);

const PitStrategySection: React.FC<FormSectionProps> = ({ data, handleChange, updateFormData }) => {
    // A fully self-contained race time calculator component
    const RaceTimeCalculator = () => {
        const [inputs, setInputs] = useState({
            raceLengthType: 'time',
            raceLaps: '',
            raceHours: '',
            raceMins: '',
            avgMin: '', avgSec: '', avgMs: '',
            targetRealHours: '',
            targetRealMins: '',
            timeProgression: ''
        });
        const [result, setResult] = useState<React.ReactNode | null>(null);

        const timeProgressionOptions = useMemo(() => ['', 'Real-time', '2x', '5x', '10x', '15x', '20x', '25x', '30x', '40x', '50x', '60x', 'Off'], []);
        
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setInputs(prev => ({...prev, [name]: value}));
        };

        const getMultiplier = (progression: string) => {
            if (progression === 'Real-time') return 1;
            if (progression === 'Off') return 0;
            return parseFloat(progression) || 0;
        };

        const calculate = () => {
            const avgLapTimeMins = (parseFloat(inputs.avgMin) || 0) + (parseFloat(inputs.avgSec) || 0) / 60 + (parseFloat(inputs.avgMs) || 0) / 60000;
        
            let gameRaceTimeMins: number | undefined;
            if (inputs.raceLengthType === 'laps') {
                const laps = parseInt(inputs.raceLaps, 10);
                if (laps > 0 && avgLapTimeMins > 0) {
                    gameRaceTimeMins = laps * avgLapTimeMins;
                }
            } else {
                const hours = parseInt(inputs.raceHours, 10) || 0;
                const mins = parseInt(inputs.raceMins, 10) || 0;
                if (hours > 0 || mins > 0) {
                    gameRaceTimeMins = hours * 60 + mins;
                }
            }
        
            let targetRealTimeMins: number | undefined;
            const targetHours = parseInt(inputs.targetRealHours, 10) || 0;
            const targetMins = parseInt(inputs.targetRealMins, 10) || 0;
            if (targetHours > 0 || targetMins > 0) {
                targetRealTimeMins = targetHours * 60 + targetMins;
            }
            
            const hasTimeProgression = inputs.timeProgression !== '';
        
            const providedValues = [gameRaceTimeMins !== undefined, targetRealTimeMins !== undefined, hasTimeProgression].filter(Boolean).length;
        
            if (providedValues < 2) {
                setResult(<p className="text-red-400">Please provide at least 2 of the 3 values: Race Time/Laps, Target Real Time, or Time Progression.</p>);
                return;
            }
        
            let newResult = '';
        
            // Scenario 1: Calc Progression
            if (gameRaceTimeMins !== undefined && targetRealTimeMins !== undefined && !hasTimeProgression) {
                if (targetRealTimeMins === 0) {
                     newResult = "Cannot calculate progression with zero real time.";
                } else {
                    const calculatedProgression = gameRaceTimeMins / targetRealTimeMins;
                    let closestMultiplier = 'Real-time';
                    let minDifference = Math.abs(calculatedProgression - 1);
        
                    timeProgressionOptions.forEach(opt => {
                        if (opt === '' || opt === 'Off') return;
                        const mult = getMultiplier(opt);
                        const diff = Math.abs(calculatedProgression - mult);
                        if(diff < minDifference) {
                            minDifference = diff;
                            closestMultiplier = opt;
                        }
                    });
                    newResult = `Calculated Progression: ${calculatedProgression.toFixed(2)}x. Recommended setting: ${closestMultiplier}.`;
                    setInputs(prev => ({...prev, timeProgression: closestMultiplier}));
                }
            }
            // Scenario 2: Calc Target Time
            else if (gameRaceTimeMins !== undefined && hasTimeProgression && targetRealTimeMins === undefined) {
                const multiplier = getMultiplier(inputs.timeProgression);
                if (multiplier > 0) {
                    const calculatedTargetTimeMins = gameRaceTimeMins / multiplier;
                    const hours = Math.floor(calculatedTargetTimeMins / 60);
                    const mins = Math.round(calculatedTargetTimeMins % 60);
                    newResult = `Calculated Target Real Time: ${hours}h ${mins}m.`;
                    setInputs(prev => ({...prev, targetRealHours: hours.toString(), targetRealMins: mins.toString()}));
                } else {
                    newResult = "Cannot calculate target time with 'Off' or invalid progression.";
                }
            }
            // Scenario 3: Calc Game Race Time or Laps
            else if (targetRealTimeMins !== undefined && hasTimeProgression && gameRaceTimeMins === undefined) {
                const multiplier = getMultiplier(inputs.timeProgression);
                const calculatedGameTimeMins = targetRealTimeMins * multiplier;
        
                if (inputs.raceLengthType === 'laps') {
                    if (avgLapTimeMins > 0) {
                        const calculatedLaps = Math.floor(calculatedGameTimeMins / avgLapTimeMins);
                        newResult = `Calculated Target Laps: ${calculatedLaps}.`;
                        setInputs(prev => ({ ...prev, raceLaps: calculatedLaps.toString() }));
                    } else {
                        newResult = "Average Lap Time must be provided to calculate target laps.";
                    }
                } else { // time-based
                    const hours = Math.floor(calculatedGameTimeMins / 60);
                    const mins = Math.round(calculatedGameTimeMins % 60);
                    newResult = `Calculated Game Race Time: ${hours}h ${mins}m.`;
                    setInputs(prev => ({ ...prev, raceHours: hours.toString(), raceMins: mins.toString() }));
                }
            }
            else {
                newResult = "Invalid combination. Please provide exactly two values to calculate the third, or clear one field.";
            }
        
            setResult(<p>{newResult}</p>);
        };
        
        return (
            <div className="bg-blue-900/30 p-4 rounded-lg mb-6">
                <h3 className="text-blue-400 mb-4 text-lg">Race Time Calculator</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4">
                    <FormSelect label="Race Length Type" name="raceLengthType" value={inputs.raceLengthType} onChange={handleInputChange}>
                        <option className="text-black" value="time">Time</option>
                        <option className="text-black" value="laps">Laps</option>
                    </FormSelect>

                    {inputs.raceLengthType === 'laps' ? 
                        <>
                            <FormInput label="Race Laps" name="raceLaps" type="number" value={inputs.raceLaps} onChange={handleInputChange} />
                            <TimeInputGroup label="Average Lap Time" namePrefix="avg" values={{min: inputs.avgMin, sec: inputs.avgSec, ms: inputs.avgMs}} onChange={e => {
                                const { name, value } = e.target;
                                setInputs(prev => ({...prev, [name]: value}));
                            }} />
                        </> : 
                        <div>
                             <label className="block mb-1.5 text-sm text-slate-300">Game Race Time</label>
                             <div className="flex items-center gap-2">
                                <input name="raceHours" type="number" min="0" max="24" value={inputs.raceHours} onChange={handleInputChange} placeholder="Hrs" className="w-full p-3 bg-white/10 border border-slate-600 rounded-md text-white text-base focus:outline-none focus:border-blue-500"/>
                                <input name="raceMins" type="number" min="0" max="55" step="5" value={inputs.raceMins} onChange={handleInputChange} placeholder="Mins" className="w-full p-3 bg-white/10 border border-slate-600 rounded-md text-white text-base focus:outline-none focus:border-blue-500"/>
                             </div>
                        </div>
                    }
                    
                    <div>
                         <label className="block mb-1.5 text-sm text-slate-300">Target Real Time</label>
                         <div className="flex items-center gap-2">
                            <input name="targetRealHours" type="number" min="0" value={inputs.targetRealHours} onChange={handleInputChange} placeholder="Hrs" className="w-full p-3 bg-white/10 border border-slate-600 rounded-md text-white text-base focus:outline-none focus:border-blue-500"/>
                            <input name="targetRealMins" type="number" min="0" value={inputs.targetRealMins} onChange={handleInputChange} placeholder="Mins" className="w-full p-3 bg-white/10 border border-slate-600 rounded-md text-white text-base focus:outline-none focus:border-blue-500"/>
                         </div>
                    </div>

                    <FormSelect label="Time Progression" name="timeProgression" value={inputs.timeProgression} onChange={handleInputChange}>
                        {timeProgressionOptions.map(opt => <option className="text-black" key={opt} value={opt}>{opt || 'Select to calculate'}</option>)}
                    </FormSelect>
                </div>
                 <button onClick={calculate} type="button" className="mt-4 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">Calculate Missing Value</button>
                 {result && <div className="mt-4 p-3 bg-black/30 rounded-md text-sm">{result}</div>}
            </div>
        )
    };
    
    // A fully self-contained calculator component
    const FuelCalculator = () => {
        const [inputs, setInputs] = useState({
            raceType: 'lap',
            lapDistance: '5.0',
            fuelPerLap: '2.5',
            avgMin: '', avgSec: '', avgMs: '',
            raceLaps: '30',
            raceHours: '', raceMins: '',
            tankCapacity: '100',
            pitStopTime: '25'
        });
        const [results, setResults] = useState<React.ReactNode | null>(null);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setInputs(prev => ({ ...prev, [name]: value }));
        };

        const calculate = () => {
            const lapDist = parseFloat(inputs.lapDistance) || 0;
            const fuelLap = parseFloat(inputs.fuelPerLap) || 0;
            const avgTime = (parseFloat(inputs.avgMin) || 0) * 60 + (parseFloat(inputs.avgSec) || 0) + (parseFloat(inputs.avgMs) || 0) / 1000;
            const tank = parseFloat(inputs.tankCapacity) || 0;
            const pitTime = parseFloat(inputs.pitStopTime) || 0;

            if (fuelLap === 0 || avgTime === 0 || tank === 0) {
                setResults(<p className="text-red-400">Please provide valid Fuel/Lap, Avg. Lap Time, and Tank Capacity.</p>);
                return;
            }

            let totalLaps, totalFuel, raceDurationSecs;
            if (inputs.raceType === 'lap') {
                totalLaps = parseInt(inputs.raceLaps) || 0;
                totalFuel = totalLaps * fuelLap;
                raceDurationSecs = totalLaps * avgTime;
            } else {
                const raceMins = (parseInt(inputs.raceHours) || 0) * 60 + (parseInt(inputs.raceMins) || 0);
                raceDurationSecs = raceMins * 60;
                totalLaps = Math.ceil(raceDurationSecs / avgTime);
                totalFuel = totalLaps * fuelLap;
            }

            const minStops = Math.max(0, Math.ceil(totalFuel / tank) - 1);
            const stints = minStops + 1;
            const fuelPerStint = totalFuel / stints;
            const lapsPerStint = Math.floor(fuelPerStint / fuelLap);

            const totalRaceTimeWithPits = raceDurationSecs + minStops * pitTime;

            setResults(
                <div className="space-y-1">
                    <p><strong>Total Laps:</strong> {totalLaps}</p>
                    <p><strong>Total Fuel Needed:</strong> {totalFuel.toFixed(1)} L</p>
                    <p><strong>Min. Pit Stops:</strong> {minStops}</p>
                    <p><strong>Total Race Time (w/ stops):</strong> {new Date(totalRaceTimeWithPits * 1000).toISOString().substr(11, 8)}</p>
                    {minStops > 0 && <p><strong>Laps per Stint:</strong> ~{lapsPerStint}</p>}
                </div>
            );
            
            if(updateFormData) {
                updateFormData({
                    startFuel: fuelPerStint.toFixed(1),
                    fuelConsumption: fuelLap.toFixed(1),
                    pitStops: minStops.toString(),
                    refuelAmount: minStops > 0 ? fuelPerStint.toFixed(1) : '0',
                });
            }
        };

        return (
            <div className="bg-blue-900/30 p-4 rounded-lg mt-6">
                <h3 className="text-blue-400 mb-4 text-lg">Fuel Calculator</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4">
                    <FormInput label="Lap Distance (km)" name="lapDistance" value={inputs.lapDistance} onChange={handleInputChange} />
                    <FormInput label="Fuel Consumption (L/lap)" name="fuelPerLap" value={inputs.fuelPerLap} onChange={handleInputChange} />
                     <TimeInputGroup label="Average Lap Time" namePrefix="avg" values={{ min: inputs.avgMin, sec: inputs.avgSec, ms: inputs.avgMs }} onChange={(e) => {
                        const { name, value } = e.target;
                        const key = name.replace('avg', ''); // Gives Min, Sec, or Ms
                        setInputs(prev => ({ ...prev, [`avg${key}`]: value }));
                    }} />
                    
                    <FormSelect label="Race Type" name="raceType" value={inputs.raceType} onChange={handleInputChange}>
                        <option className="text-black" value="lap">Lap-based</option>
                        <option className="text-black" value="time">Time-based</option>
                    </FormSelect>

                    {inputs.raceType === 'lap' ? 
                        <FormInput label="Race Laps" name="raceLaps" value={inputs.raceLaps} onChange={handleInputChange} /> :
                        <div className="flex gap-2"><FormInput label="Hours" name="raceHours" value={inputs.raceHours} onChange={handleInputChange} /><FormInput label="Mins" name="raceMins" value={inputs.raceMins} onChange={handleInputChange} /></div>
                    }

                    <FormInput label="Tank Capacity (L)" name="tankCapacity" value={inputs.tankCapacity} onChange={handleInputChange} />
                    <FormInput label="Avg Pit Stop Time (s)" name="pitStopTime" value={inputs.pitStopTime} onChange={handleInputChange} />
                </div>
                <button onClick={calculate} type="button" className="mt-4 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">Calculate Fuel &amp; Strategy</button>
                {results && <div className="mt-4 p-3 bg-black/30 rounded-md text-sm">{results}</div>}
            </div>
        );
    };

    const repairCheckboxes = useMemo(() => [
        {name: 'flSuspension', label: 'FL Suspension'}, {name: 'frSuspension', label: 'FR Suspension'},
        {name: 'rlSuspension', label: 'RL Suspension'}, {name: 'rrSuspension', label: 'RR Suspension'},
        {name: 'flBrake', label: 'FL Brake'}, {name: 'frBrake', label: 'FR Brake'},
        {name: 'rlBrake', label: 'RL Brake'}, {name: 'rrBrake', label: 'RR Brake'},
        {name: 'engineRepair', label: 'Engine'}, {name: 'transmissionRepair', label: 'Transmission'},
        {name: 'frontAero', label: 'Front Aero'}, {name: 'rearAero', label: 'Rear Aero'},
    ], []);

    return(
        <Section title="FUEL & PIT STRATEGY">
            <RaceTimeCalculator />
            <FuelCalculator />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 mt-6">
                <FormInput label="Start Fuel (L)" name="startFuel" value={data.startFuel} onChange={handleChange} />
                <FormInput label="Fuel Consumption (L/lap)" name="fuelConsumption" value={data.fuelConsumption} onChange={handleChange} />
                <FormInput label="Pit Stops Planned" name="pitStops" value={data.pitStops} onChange={handleChange} />
                <FormInput label="Pit Window (laps)" name="pitWindow" value={data.pitWindow} onChange={handleChange} />
                <FormInput label="Refuel Amount per Stop (L)" name="refuelAmount" value={data.refuelAmount} onChange={handleChange} />
                <FormInput label="Tyre Change Per Stop" name="tyreChange" value={data.tyreChange} onChange={handleChange} placeholder="e.g., Yes, Soft" />
                <FormSelect label="Driver Change" name="driverChange" value={data.driverChange} onChange={handleChange}><option className="text-black" value=""></option><option className="text-black">Yes</option><option className="text-black">No</option></FormSelect>
            </div>
             <div className="mt-6">
                <label className="block mb-2 text-sm text-slate-300">Repair Damage</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                    {repairCheckboxes.map(cb => (
                        <label key={cb.name} className="flex items-center gap-2 text-slate-200">
                            <input type="checkbox" name={cb.name} checked={data[cb.name as keyof SetupData] as boolean} onChange={handleChange} className="w-4 h-4 bg-slate-600 border-slate-500 text-blue-500 focus:ring-blue-500" />
                            {cb.label}
                        </label>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 mt-6">
                 <FormInput label="Tire Pressure Adjustments" name="tirePressureAdjustments" value={data.tirePressureAdjustments} onChange={handleChange} placeholder="e.g., -0.1/-0.1/0.0/0.0" />
                 <FormInput label="Engine Map Change" name="engineMapChange" value={data.engineMapChange} onChange={handleChange} />
                 <FormInput label="Brake Bias Change" name="brakeBiasChange" value={data.brakeBiasChange} onChange={handleChange} placeholder="e.g., +1% F" />
            </div>
            <FormTextarea label="Notes" name="pitStrategyNotes" value={data.pitStrategyNotes} onChange={handleChange} rows={3} />
            
             <h4 className="text-blue-400 mt-6 mb-2 text-lg">Pit Stop Details</h4>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-blue-900/30">
                        <tr>
                            {['Stop #', 'Lap In', 'Fuel Added (L)', 'Tyre Compound', 'Tyre Press FL/FR/RL/RR', 'Brake Bias', 'Notes'].map(h => <th key={h} className="p-2">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {[1, 2].map(stopNum => (
                            <tr key={stopNum}>
                                <td className="p-2">{stopNum}</td>
                                <td><input name={`stop${stopNum}Lap`} value={data[`stop${stopNum}Lap` as keyof SetupData] as string} onChange={handleChange} className="w-full p-1 bg-transparent border-none focus:outline-none focus:bg-slate-700 rounded"/></td>
                                <td><input name={`stop${stopNum}Fuel`} value={data[`stop${stopNum}Fuel` as keyof SetupData] as string} onChange={handleChange} className="w-full p-1 bg-transparent border-none focus:outline-none focus:bg-slate-700 rounded"/></td>
                                <td><input name={`stop${stopNum}Compound`} value={data[`stop${stopNum}Compound` as keyof SetupData] as string} onChange={handleChange} className="w-full p-1 bg-transparent border-none focus:outline-none focus:bg-slate-700 rounded"/></td>
                                <td><input name={`stop${stopNum}Pressures`} value={data[`stop${stopNum}Pressures` as keyof SetupData] as string} onChange={handleChange} className="w-full p-1 bg-transparent border-none focus:outline-none focus:bg-slate-700 rounded"/></td>
                                <td><input name={`stop${stopNum}BrakeBias`} value={data[`stop${stopNum}BrakeBias` as keyof SetupData] as string} onChange={handleChange} className="w-full p-1 bg-transparent border-none focus:outline-none focus:bg-slate-700 rounded"/></td>
                                <td><input name={`stop${stopNum}Notes`} value={data[`stop${stopNum}Notes` as keyof SetupData] as string} onChange={handleChange} className="w-full p-1 bg-transparent border-none focus:outline-none focus:bg-slate-700 rounded"/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    )
};

const DriverFeedbackSection: React.FC<FormSectionProps> = ({ data, handleChange }) => (
    <Section title="DRIVER FEEDBACK & HANDLING ANALYSIS">
        <p className="text-slate-400 italic -mt-2 mb-4">Provide feedback on the car's handling to generate a more effective AI tuning prompt.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4">
            <FormSelect label="Handling Balance" name="handlingBalance" value={data.handlingBalance} onChange={handleChange}>
                <option className="text-black" value="">Select</option>
                <option className="text-black">Predominantly Understeer</option>
                <option className="text-black">Predominantly Oversteer</option>
                <option className="text-black">Neutral / Balanced</option>
                <option className="text-black">Inconsistent / Snappy</option>
            </FormSelect>
             <FormSelect label="Corner Entry" name="cornerEntry" value={data.cornerEntry} onChange={handleChange}>
                <option className="text-black" value="">Select</option>
                <option className="text-black">Stable, good turn-in</option>
                <option className="text-black">Entry understeer, pushes wide</option>
                <option className="text-black">Entry oversteer, rear is loose</option>
                <option className="text-black">Unstable under braking</option>
            </FormSelect>
             <FormSelect label="Mid-Corner" name="cornerMid" value={data.cornerMid} onChange={handleChange}>
                <option className="text-black" value="">Select</option>
                <option className="text-black">Stable, holds line</option>
                <option className="text-black">Mid-corner understeer, won't rotate</option>
                <option className="text-black">Mid-corner oversteer, rear rotates too much</option>
            </FormSelect>
             <FormSelect label="Corner Exit" name="cornerExit" value={data.cornerExit} onChange={handleChange}>
                <option className="text-black" value="">Select</option>
                <option className="text-black">Good traction, can apply power early</option>
                <option className="text-black">Poor traction, wheelspin on exit</option>
                <option className="text-black">Exit understeer, runs wide on power</option>
                <option className="text-black">Exit oversteer, snaps on power</option>
            </FormSelect>
            <FormSelect label="Straight Line / High Speed" name="straightLine" value={data.straightLine} onChange={handleChange}>
                 <option className="text-black" value="">Select</option>
                 <option className="text-black">Stable</option>
                 <option className="text-black">Unstable / Wanders</option>
                 <option className="text-black">Sensitive to bumps</option>
            </FormSelect>
        </div>
        <FormTextarea label="Other Driver Notes / Observations" name="driverNotes" value={data.driverNotes} onChange={handleChange} rows={3} placeholder="Describe any other handling characteristics, e.g., 'Car is lazy on direction changes' or 'Loses grip after 5 laps'." />
    </Section>
);

const TuningChangesSection: React.FC<FormSectionProps> = ({ data, handleChange }) => (
    <Section title="TOP 6 TUNING CHANGES">
        <p className="text-slate-400 italic -mt-2 mb-4">For each: describe change, purpose, and validation.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({length: 6}, (_, i) => i + 1).map(num => (
                <FormTextarea key={num} label={`${num}.`} name={`tuningChange${num}`} value={data[`tuningChange${num}` as keyof SetupData] as string} onChange={handleChange} rows={3} placeholder={`Change: ...\nPurpose: ...\nValidation: ...`} />
            ))}
        </div>
    </Section>
);

const TestPlanSection: React.FC<FormSectionProps> = ({ data, handleChange }) => (
    <Section title="ON-TRACK TEST PLAN">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({length: 6}, (_, i) => i + 1).map(num => (
                <FormTextarea key={num} label={`Iteration ${num}:`} name={`iteration${num}`} value={data[`iteration${num}` as keyof SetupData] as string} onChange={handleChange} rows={2} />
            ))}
        </div>
        <FormTextarea label="Observation Summary" name="observationSummary" value={data.observationSummary} onChange={handleChange} rows={3} />
    </Section>
);

// --- Main Form Component ---

// Fix: Correctly define SetupFormProps to align with component usage.
interface SetupFormProps {
  formData: SetupData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  updateFormData: (updates: Partial<SetupData>) => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ formData, handleChange, updateFormData }) => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <GeneralSection data={formData} handleChange={handleChange} />
      <TyresSection data={formData} handleChange={handleChange} />
      <BrakesSection data={formData} handleChange={handleChange} />
      <ChassisSection data={formData} handleChange={handleChange} />
      <SuspensionSection data={formData} handleChange={handleChange} />
      <GearsSection data={formData} handleChange={handleChange} />
      <DifferentialSection data={formData} handleChange={handleChange} />
      <EngineSection data={formData} handleChange={handleChange} />
      <PitStrategySection data={formData} handleChange={handleChange} updateFormData={updateFormData} />
      <DriverFeedbackSection data={formData} handleChange={handleChange} />
      <TuningChangesSection data={formData} handleChange={handleChange} />
      <TestPlanSection data={formData} handleChange={handleChange} />
    </form>
  );
};