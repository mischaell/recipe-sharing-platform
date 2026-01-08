"use client";

import { useState, useCallback } from "react";
import RefractionCanvas from "./components/RefractionCanvas";
import ExperimentControls from "./components/ExperimentControls";
import DataTable from "./components/DataTable";
import Instructions from "./components/Instructions";
import CalculationPanel from "./components/CalculationPanel";

export interface Measurement {
  id: number;
  angleOfIncidence: number;
  angleOfRefraction: number;
  sinIncidence: number;
  sinRefraction: number;
}

export default function RefractionExperimentPage() {
  const [angleOfIncidence, setAngleOfIncidence] = useState(30);
  const [angleOfRefraction, setAngleOfRefraction] = useState(19.5);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [showLaser, setShowLaser] = useState(true);
  const [step, setStep] = useState(1);

  // Actual refractive index of acrylic (hidden from user during experiment)
  const ACRYLIC_REFRACTIVE_INDEX = 1.49;

  // Calculate angle of refraction using Snell's Law
  const calculateRefraction = useCallback((incidentAngle: number) => {
    const n1 = 1.0; // Air
    const n2 = ACRYLIC_REFRACTIVE_INDEX; // Acrylic
    const incidentRad = (incidentAngle * Math.PI) / 180;
    const sinRefracted = (n1 * Math.sin(incidentRad)) / n2;

    // Handle total internal reflection (shouldn't happen from air to acrylic)
    if (Math.abs(sinRefracted) > 1) {
      return 90;
    }

    const refractedRad = Math.asin(sinRefracted);
    return (refractedRad * 180) / Math.PI;
  }, []);

  // Update angle and calculate refraction
  const handleAngleChange = useCallback((newAngle: number) => {
    setAngleOfIncidence(newAngle);
    const refracted = calculateRefraction(newAngle);
    setAngleOfRefraction(refracted);
  }, [calculateRefraction]);

  // Record a measurement
  const recordMeasurement = useCallback(() => {
    const sinInc = Math.sin((angleOfIncidence * Math.PI) / 180);
    const sinRef = Math.sin((angleOfRefraction * Math.PI) / 180);

    const newMeasurement: Measurement = {
      id: measurements.length + 1,
      angleOfIncidence: angleOfIncidence,
      angleOfRefraction: parseFloat(angleOfRefraction.toFixed(1)),
      sinIncidence: parseFloat(sinInc.toFixed(4)),
      sinRefraction: parseFloat(sinRef.toFixed(4)),
    };

    setMeasurements([...measurements, newMeasurement]);
  }, [angleOfIncidence, angleOfRefraction, measurements]);

  // Clear all measurements
  const clearMeasurements = useCallback(() => {
    setMeasurements([]);
  }, []);

  // Delete a single measurement
  const deleteMeasurement = useCallback((id: number) => {
    setMeasurements(measurements.filter(m => m.id !== id));
  }, [measurements]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Refractive Index of Acrylic
          </h1>
          <p className="text-purple-200 text-lg">
            Virtual Physics Experiment
          </p>
        </header>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step === s
                    ? "bg-purple-500 text-white scale-110"
                    : step > s
                    ? "bg-green-500 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Step Labels */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-4 gap-4 text-center text-sm max-w-2xl">
            <span className={step >= 1 ? "text-purple-300" : "text-slate-500"}>
              Learn
            </span>
            <span className={step >= 2 ? "text-purple-300" : "text-slate-500"}>
              Experiment
            </span>
            <span className={step >= 3 ? "text-purple-300" : "text-slate-500"}>
              Record Data
            </span>
            <span className={step >= 4 ? "text-purple-300" : "text-slate-500"}>
              Calculate
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Experiment Visualization */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm mr-3">
                  1
                </span>
                Experiment Setup
              </h2>
              <RefractionCanvas
                angleOfIncidence={angleOfIncidence}
                angleOfRefraction={angleOfRefraction}
                showLaser={showLaser}
              />
            </div>

            <ExperimentControls
              angleOfIncidence={angleOfIncidence}
              onAngleChange={handleAngleChange}
              showLaser={showLaser}
              onToggleLaser={() => setShowLaser(!showLaser)}
              onRecordMeasurement={recordMeasurement}
              angleOfRefraction={angleOfRefraction}
            />
          </div>

          {/* Right Column - Instructions, Data & Calculations */}
          <div className="space-y-6">
            {step === 1 && (
              <Instructions onContinue={() => setStep(2)} />
            )}

            {step >= 2 && (
              <DataTable
                measurements={measurements}
                onClearAll={clearMeasurements}
                onDelete={deleteMeasurement}
                onContinue={() => setStep(4)}
              />
            )}

            {step >= 4 && (
              <CalculationPanel measurements={measurements} />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Based on Snell&apos;s Law: n₁ sin(θ₁) = n₂ sin(θ₂)</p>
        </footer>
      </div>
    </div>
  );
}
