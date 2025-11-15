
import React, { useState } from 'react';

// Conversion formulas
const CONVERSIONS = {
  psiToBar: (psi: number) => psi / 14.5038,
  barToPsi: (bar: number) => bar * 14.5038,
  nmmToLbfin: (nmm: number) => nmm * 5.71015,
  lbfinToNmm: (lbfin: number) => lbfin / 5.71015,
  cToF: (c: number) => (c * 9/5) + 32,
  fToC: (f: number) => (f - 32) * 5/9,
  kgToLbs: (kg: number) => kg * 2.20462,
  lbsToKg: (lbs: number) => lbs / 2.20462,
  nmToLbft: (nm: number) => nm * 0.737562,
  lbftToNm: (lbft: number) => lbft / 0.737562,
};

interface ConverterInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ConverterInput: React.FC<ConverterInputProps> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm text-slate-300 mb-1">{label}</label>
    <input 
      type="number" 
      value={value} 
      onChange={onChange}
      className="w-full p-2 bg-white/10 border border-slate-600 rounded-md text-white text-base focus:outline-none focus:border-blue-500"
    />
  </div>
);


interface UnitConverterModalProps {
  onClose: () => void;
}

export const UnitConverterModal: React.FC<UnitConverterModalProps> = ({ onClose }) => {
  const [pressure, setPressure] = useState({ psi: '', bar: '' });
  const [springRate, setSpringRate] = useState({ lbfin: '', nmm: '' });
  const [temperature, setTemperature] = useState({ f: '', c: '' });
  const [weight, setWeight] = useState({ lbs: '', kg: '' });
  const [torque, setTorque] = useState({ lbft: '', nm: '' });

  const handleConversion = (
    valueStr: string, 
    fromUnit: 'psi' | 'bar' | 'lbfin' | 'nmm' | 'f' | 'c' | 'lbs' | 'kg' | 'lbft' | 'nm',
    type: 'pressure' | 'spring' | 'temp' | 'weight' | 'torque'
  ) => {
    if (valueStr === '') {
        setPressure({ psi: '', bar: '' });
        setSpringRate({ lbfin: '', nmm: '' });
        setTemperature({ f: '', c: '' });
        setWeight({ lbs: '', kg: '' });
        setTorque({ lbft: '', nm: '' });
        return;
    }
    const value = parseFloat(valueStr);
    if (isNaN(value)) return;
    

    switch(type) {
      case 'pressure':
        if(fromUnit === 'psi') setPressure({ psi: valueStr, bar: CONVERSIONS.psiToBar(value).toFixed(3) });
        if(fromUnit === 'bar') setPressure({ bar: valueStr, psi: CONVERSIONS.barToPsi(value).toFixed(2) });
        break;
      case 'spring':
        if(fromUnit === 'lbfin') setSpringRate({ lbfin: valueStr, nmm: CONVERSIONS.lbfinToNmm(value).toFixed(2) });
        if(fromUnit === 'nmm') setSpringRate({ nmm: valueStr, lbfin: CONVERSIONS.nmmToLbfin(value).toFixed(2) });
        break;
      case 'temp':
        if(fromUnit === 'f') setTemperature({ f: valueStr, c: CONVERSIONS.fToC(value).toFixed(1) });
        if(fromUnit === 'c') setTemperature({ c: valueStr, f: CONVERSIONS.cToF(value).toFixed(1) });
        break;
      case 'weight':
        if(fromUnit === 'lbs') setWeight({ lbs: valueStr, kg: CONVERSIONS.lbsToKg(value).toFixed(2) });
        if(fromUnit === 'kg') setWeight({ kg: valueStr, lbs: CONVERSIONS.kgToLbs(value).toFixed(2) });
        break;
      case 'torque':
        if(fromUnit === 'lbft') setTorque({ lbft: valueStr, nm: CONVERSIONS.lbftToNm(value).toFixed(2) });
        if(fromUnit === 'nm') setTorque({ nm: valueStr, lbft: CONVERSIONS.nmToLbft(value).toFixed(2) });
        break;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-blue-500 rounded-lg p-6 w-full max-w-lg shadow-2xl relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-3xl transition-colors"
        >
          &times;
        </button>
        <h2 className="text-blue-500 text-xl font-bold mb-6">Unit Conversion Helper</h2>
        
        <div className="space-y-6">
          {/* Pressure */}
          <div>
            <h3 className="text-lg text-slate-200 mb-2 border-b border-slate-700 pb-1">Pressure</h3>
            <div className="grid grid-cols-2 gap-4 items-center">
              <ConverterInput label="PSI" value={pressure.psi} onChange={e => handleConversion(e.target.value, 'psi', 'pressure')} />
              <ConverterInput label="BAR" value={pressure.bar} onChange={e => handleConversion(e.target.value, 'bar', 'pressure')} />
            </div>
          </div>

          {/* Spring Rate */}
          <div>
            <h3 className="text-lg text-slate-200 mb-2 border-b border-slate-700 pb-1">Spring Rate</h3>
            <div className="grid grid-cols-2 gap-4 items-center">
              <ConverterInput label="LBF/IN" value={springRate.lbfin} onChange={e => handleConversion(e.target.value, 'lbfin', 'spring')} />
              <ConverterInput label="N/MM" value={springRate.nmm} onChange={e => handleConversion(e.target.value, 'nmm', 'spring')} />
            </div>
          </div>

          {/* Temperature */}
          <div>
            <h3 className="text-lg text-slate-200 mb-2 border-b border-slate-700 pb-1">Temperature</h3>
            <div className="grid grid-cols-2 gap-4 items-center">
              <ConverterInput label="°F" value={temperature.f} onChange={e => handleConversion(e.target.value, 'f', 'temp')} />
              <ConverterInput label="°C" value={temperature.c} onChange={e => handleConversion(e.target.value, 'c', 'temp')} />
            </div>
          </div>

           {/* Weight */}
           <div>
            <h3 className="text-lg text-slate-200 mb-2 border-b border-slate-700 pb-1">Weight</h3>
            <div className="grid grid-cols-2 gap-4 items-center">
              <ConverterInput label="LBS" value={weight.lbs} onChange={e => handleConversion(e.target.value, 'lbs', 'weight')} />
              <ConverterInput label="KG" value={weight.kg} onChange={e => handleConversion(e.target.value, 'kg', 'weight')} />
            </div>
          </div>

           {/* Torque */}
           <div>
            <h3 className="text-lg text-slate-200 mb-2 border-b border-slate-700 pb-1">Torque</h3>
            <div className="grid grid-cols-2 gap-4 items-center">
              <ConverterInput label="LB-FT" value={torque.lbft} onChange={e => handleConversion(e.target.value, 'lbft', 'torque')} />
              <ConverterInput label="NM" value={torque.nm} onChange={e => handleConversion(e.target.value, 'nm', 'torque')} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
