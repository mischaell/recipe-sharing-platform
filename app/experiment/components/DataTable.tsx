"use client";

import { Measurement } from "../page";

interface DataTableProps {
  measurements: Measurement[];
  onClearAll: () => void;
  onDelete: (id: number) => void;
  onContinue: () => void;
}

export default function DataTable({
  measurements,
  onClearAll,
  onDelete,
  onContinue,
}: DataTableProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm mr-3">
            3
          </span>
          Recorded Data
        </h2>
        {measurements.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {measurements.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-lg mb-2">No measurements yet</p>
          <p className="text-sm text-slate-500">
            Adjust the angle slider and click &quot;Record Measurement&quot; to collect data
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-700">
                  <th className="pb-3 pr-4">#</th>
                  <th className="pb-3 pr-4">θ₁ (°)</th>
                  <th className="pb-3 pr-4">θ₂ (°)</th>
                  <th className="pb-3 pr-4">sin(θ₁)</th>
                  <th className="pb-3 pr-4">sin(θ₂)</th>
                  <th className="pb-3 pr-4">Ratio</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-slate-700/50 text-slate-300"
                  >
                    <td className="py-3 pr-4 text-slate-500">{m.id}</td>
                    <td className="py-3 pr-4 font-mono text-yellow-400">
                      {m.angleOfIncidence}
                    </td>
                    <td className="py-3 pr-4 font-mono text-green-400">
                      {m.angleOfRefraction}
                    </td>
                    <td className="py-3 pr-4 font-mono">{m.sinIncidence}</td>
                    <td className="py-3 pr-4 font-mono">{m.sinRefraction}</td>
                    <td className="py-3 pr-4 font-mono text-purple-400">
                      {(m.sinIncidence / m.sinRefraction).toFixed(3)}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => onDelete(m.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-slate-900/50 rounded-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Measurements collected: {measurements.length}
              </span>
              <span
                className={`font-medium ${
                  measurements.length >= 5 ? "text-green-400" : "text-yellow-400"
                }`}
              >
                {measurements.length >= 5
                  ? "✓ Ready for calculation"
                  : `Need ${5 - measurements.length} more`}
              </span>
            </div>
          </div>

          {measurements.length >= 3 && (
            <button
              onClick={onContinue}
              className="mt-4 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500
                text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600
                transition-all shadow-lg shadow-green-500/30"
            >
              Calculate Refractive Index →
            </button>
          )}
        </>
      )}
    </div>
  );
}
