"use client";

import { useState, useMemo } from "react";
import { Measurement } from "../page";

interface CalculationPanelProps {
  measurements: Measurement[];
}

export default function CalculationPanel({ measurements }: CalculationPanelProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const ACTUAL_VALUE = 1.49;

  // Calculate statistics from measurements
  const stats = useMemo(() => {
    if (measurements.length === 0) {
      return { average: 0, values: [], percentError: 0, standardDev: 0 };
    }

    // Calculate n = sin(θ₁) / sin(θ₂) for each measurement
    const values = measurements.map(m => m.sinIncidence / m.sinRefraction);

    // Average
    const average = values.reduce((sum, v) => sum + v, 0) / values.length;

    // Standard deviation
    const squaredDiffs = values.map(v => Math.pow(v - average, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
    const standardDev = Math.sqrt(avgSquaredDiff);

    // Percent error
    const percentError = Math.abs((average - ACTUAL_VALUE) / ACTUAL_VALUE) * 100;

    return { average, values, percentError, standardDev };
  }, [measurements]);

  // Determine accuracy rating
  const getAccuracyRating = (error: number) => {
    if (error < 1) return { text: "Excellent!", color: "text-green-400", emoji: "🌟" };
    if (error < 3) return { text: "Very Good", color: "text-blue-400", emoji: "👍" };
    if (error < 5) return { text: "Good", color: "text-yellow-400", emoji: "👌" };
    if (error < 10) return { text: "Fair", color: "text-orange-400", emoji: "📊" };
    return { text: "Needs More Data", color: "text-red-400", emoji: "🔬" };
  };

  const rating = getAccuracyRating(stats.percentError);

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm mr-3">
          4
        </span>
        Calculation & Results
      </h2>

      {measurements.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>Record some measurements first to see calculations.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Formula Reminder */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Using Snell&apos;s Law:</h3>
            <p className="text-center font-mono text-lg">
              <span className="text-purple-400">n</span> =
              <span className="text-yellow-400"> sin(θ₁)</span> /
              <span className="text-green-400"> sin(θ₂)</span>
            </p>
          </div>

          {/* Individual Calculations */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-400">
              Calculated values for each measurement:
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.values.map((v, i) => (
                <div
                  key={i}
                  className="px-3 py-2 bg-slate-700 rounded-lg font-mono text-sm"
                >
                  <span className="text-slate-400">#{i + 1}:</span>{" "}
                  <span className="text-purple-400">{v.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Average Calculation */}
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30">
            <h3 className="text-sm font-medium text-slate-300 mb-2">
              Average Refractive Index:
            </h3>
            <div className="text-center">
              <span className="text-4xl font-bold text-white">
                {stats.average.toFixed(3)}
              </span>
              <span className="text-slate-400 text-lg ml-2">± {stats.standardDev.toFixed(3)}</span>
            </div>
          </div>

          {/* Statistical Analysis */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-400 mb-1">Standard Deviation</p>
              <p className="text-xl font-mono text-cyan-400">
                ± {stats.standardDev.toFixed(4)}
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-400 mb-1">Number of Trials</p>
              <p className="text-xl font-mono text-cyan-400">
                {measurements.length}
              </p>
            </div>
          </div>

          {/* Reveal Answer Section */}
          <div className="border-t border-slate-700 pt-4">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white
                rounded-xl font-medium transition-colors"
            >
              {showAnswer ? "Hide" : "Reveal"} Accepted Value
            </button>

            {showAnswer && (
              <div className="mt-4 space-y-4">
                <div className="bg-green-900/30 rounded-xl p-4 border border-green-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Accepted value for acrylic:</span>
                    <span className="text-2xl font-bold text-green-400">
                      {ACTUAL_VALUE}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-300">Percent Error:</span>
                    <span className={`text-xl font-bold ${rating.color}`}>
                      {stats.percentError.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-center text-lg">
                    <span className="mr-2">{rating.emoji}</span>
                    <span className={rating.color}>{rating.text}</span>
                  </div>
                </div>

                {/* Feedback */}
                <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30">
                  <h4 className="font-medium text-blue-300 mb-2">📝 Analysis</h4>
                  <p className="text-sm text-blue-100/80">
                    {stats.percentError < 5 ? (
                      <>
                        Excellent work! Your experimental result of{" "}
                        <strong>{stats.average.toFixed(3)}</strong> is very close to the
                        accepted value. This demonstrates good experimental technique and
                        careful measurement.
                      </>
                    ) : stats.percentError < 10 ? (
                      <>
                        Good effort! Your result of <strong>{stats.average.toFixed(3)}</strong>{" "}
                        shows you understand the concept. Try taking more measurements at
                        different angles to improve accuracy.
                      </>
                    ) : (
                      <>
                        Your result of <strong>{stats.average.toFixed(3)}</strong> has some
                        error. This could be due to measurement uncertainty. Try recording
                        more data points at various angles, especially between 30° and 60°.
                      </>
                    )}
                  </p>
                </div>

                {/* Percent Error Formula */}
                <div className="text-center text-sm text-slate-500">
                  <p>Percent Error = |experimental - accepted| / accepted × 100%</p>
                  <p className="font-mono mt-1">
                    = |{stats.average.toFixed(3)} - {ACTUAL_VALUE}| / {ACTUAL_VALUE} × 100%
                    = {stats.percentError.toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
