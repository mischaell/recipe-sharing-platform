"use client";

interface InstructionsProps {
  onContinue: () => void;
}

export default function Instructions({ onContinue }: InstructionsProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm mr-3">
          📖
        </span>
        Introduction to Refraction
      </h2>

      <div className="space-y-6 text-slate-300">
        {/* Theory Section */}
        <section>
          <h3 className="text-lg font-medium text-white mb-2">What is Refraction?</h3>
          <p className="text-sm leading-relaxed">
            Refraction is the bending of light as it passes from one medium to another
            (like from air into acrylic). This happens because light travels at different
            speeds in different materials.
          </p>
        </section>

        {/* Snell's Law */}
        <section className="bg-slate-900/50 rounded-xl p-4">
          <h3 className="text-lg font-medium text-white mb-3">Snell&apos;s Law</h3>
          <div className="text-center mb-4">
            <div className="inline-block bg-slate-800 px-6 py-4 rounded-xl">
              <span className="text-2xl font-mono">
                <span className="text-blue-400">n₁</span> sin(
                <span className="text-yellow-400">θ₁</span>) =
                <span className="text-purple-400"> n₂</span> sin(
                <span className="text-green-400">θ₂</span>)
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-400 font-medium">n₁</span>
              <span className="text-slate-400"> = refractive index of air (≈1.00)</span>
            </div>
            <div>
              <span className="text-purple-400 font-medium">n₂</span>
              <span className="text-slate-400"> = refractive index of acrylic (?)</span>
            </div>
            <div>
              <span className="text-yellow-400 font-medium">θ₁</span>
              <span className="text-slate-400"> = angle of incidence</span>
            </div>
            <div>
              <span className="text-green-400 font-medium">θ₂</span>
              <span className="text-slate-400"> = angle of refraction</span>
            </div>
          </div>
        </section>

        {/* Calculation Method */}
        <section>
          <h3 className="text-lg font-medium text-white mb-2">How to Calculate n₂</h3>
          <p className="text-sm leading-relaxed mb-3">
            By rearranging Snell&apos;s Law, we can find the refractive index:
          </p>
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-purple-900/50 to-pink-900/50 px-6 py-3 rounded-xl border border-purple-500/30">
              <span className="text-xl font-mono">
                <span className="text-purple-400">n₂</span> =
                <span className="text-yellow-400"> sin(θ₁)</span> /
                <span className="text-green-400"> sin(θ₂)</span>
              </span>
            </div>
          </div>
        </section>

        {/* Experiment Steps */}
        <section>
          <h3 className="text-lg font-medium text-white mb-3">Experiment Steps</h3>
          <ol className="space-y-3 text-sm">
            <li className="flex items-start">
              <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">
                1
              </span>
              <span>
                Turn on the laser and adjust the angle of incidence using the slider
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">
                2
              </span>
              <span>
                Observe how the light bends as it enters the acrylic block
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">
                3
              </span>
              <span>
                Record measurements at different angles (at least 5 readings)
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">
                4
              </span>
              <span>
                Calculate the average refractive index from your data
              </span>
            </li>
          </ol>
        </section>

        {/* Fun Fact */}
        <section className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-4 border border-amber-500/30">
          <h4 className="font-medium text-amber-300 mb-1">💡 Did you know?</h4>
          <p className="text-sm text-amber-100/80">
            Acrylic (also known as Plexiglass or PMMA) has a refractive index of approximately
            1.49. It&apos;s used in optical fibers, lenses, and even aquariums because of its
            excellent light transmission properties!
          </p>
        </section>
      </div>

      <button
        onClick={onContinue}
        className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500
          text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600
          transition-all shadow-lg shadow-blue-500/30"
      >
        Start Experiment →
      </button>
    </div>
  );
}
