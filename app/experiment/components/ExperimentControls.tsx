"use client";

interface ExperimentControlsProps {
  angleOfIncidence: number;
  angleOfRefraction: number;
  onAngleChange: (angle: number) => void;
  showLaser: boolean;
  onToggleLaser: () => void;
  onRecordMeasurement: () => void;
}

export default function ExperimentControls({
  angleOfIncidence,
  angleOfRefraction,
  onAngleChange,
  showLaser,
  onToggleLaser,
  onRecordMeasurement,
}: ExperimentControlsProps) {
  // Suggested angles for good data collection
  const suggestedAngles = [10, 20, 30, 40, 50, 60, 70, 80];

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm mr-3">
          2
        </span>
        Controls
      </h2>

      <div className="space-y-6">
        {/* Laser Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Laser Beam</span>
          <button
            onClick={onToggleLaser}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              showLaser ? "bg-red-500" : "bg-slate-600"
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                showLaser ? "left-8" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Angle Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-slate-300">Angle of Incidence (θ₁)</label>
            <span className="text-2xl font-bold text-yellow-400">
              {angleOfIncidence}°
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="85"
            value={angleOfIncidence}
            onChange={(e) => onAngleChange(Number(e.target.value))}
            className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:bg-yellow-400
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:shadow-yellow-400/30"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>0°</span>
            <span>45°</span>
            <span>85°</span>
          </div>
        </div>

        {/* Quick Angle Buttons */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Quick Select</label>
          <div className="flex flex-wrap gap-2">
            {suggestedAngles.map((angle) => (
              <button
                key={angle}
                onClick={() => onAngleChange(angle)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  angleOfIncidence === angle
                    ? "bg-purple-500 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {angle}°
              </button>
            ))}
          </div>
        </div>

        {/* Current Readings */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-900/50 rounded-xl">
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-1">Incident Angle (θ₁)</p>
            <p className="text-2xl font-mono font-bold text-yellow-400">
              {angleOfIncidence}°
            </p>
            <p className="text-xs text-slate-500 mt-1">
              sin(θ₁) = {Math.sin((angleOfIncidence * Math.PI) / 180).toFixed(4)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-1">Refracted Angle (θ₂)</p>
            <p className="text-2xl font-mono font-bold text-green-400">
              {angleOfRefraction.toFixed(1)}°
            </p>
            <p className="text-xs text-slate-500 mt-1">
              sin(θ₂) = {Math.sin((angleOfRefraction * Math.PI) / 180).toFixed(4)}
            </p>
          </div>
        </div>

        {/* Record Button */}
        <button
          onClick={onRecordMeasurement}
          disabled={!showLaser}
          className={`w-full py-3 rounded-xl font-semibold text-lg transition-all ${
            showLaser
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          }`}
        >
          📝 Record Measurement
        </button>

        <p className="text-xs text-slate-500 text-center">
          Record at least 5 different angles for accurate results
        </p>
      </div>
    </div>
  );
}
