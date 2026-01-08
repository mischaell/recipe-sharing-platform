"use client";

import { useRef, useEffect } from "react";

interface RefractionCanvasProps {
  angleOfIncidence: number;
  angleOfRefraction: number;
  showLaser: boolean;
}

export default function RefractionCanvas({
  angleOfIncidence,
  angleOfRefraction,
  showLaser,
}: RefractionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, "#1e293b");
    bgGradient.addColorStop(0.5, "#1e293b");
    bgGradient.addColorStop(0.5, "#0f172a");
    bgGradient.addColorStop(1, "#0f172a");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw air region label
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px sans-serif";
    ctx.fillText("Air (n = 1.00)", 20, 30);

    // Draw acrylic block
    const acrylicGradient = ctx.createLinearGradient(0, centerY, 0, height);
    acrylicGradient.addColorStop(0, "rgba(139, 92, 246, 0.3)");
    acrylicGradient.addColorStop(1, "rgba(139, 92, 246, 0.1)");
    ctx.fillStyle = acrylicGradient;
    ctx.fillRect(0, centerY, width, height / 2);

    // Acrylic border
    ctx.strokeStyle = "rgba(139, 92, 246, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw acrylic label
    ctx.fillStyle = "#c4b5fd";
    ctx.fillText("Acrylic (n = ?)", 20, centerY + 30);

    // Draw normal line (dashed)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX, 40);
    ctx.lineTo(centerX, height - 40);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw normal label
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "12px sans-serif";
    ctx.fillText("Normal", centerX + 5, 55);

    // Draw protractor arc at interface
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;

    // Upper arc (for incident angle)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, -Math.PI, 0);
    ctx.stroke();

    // Lower arc (for refracted angle)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, Math.PI);
    ctx.stroke();

    // Draw angle markers
    for (let angle = 0; angle <= 90; angle += 15) {
      const rad = (angle * Math.PI) / 180;

      // Upper markers
      const upperX = centerX - Math.sin(rad) * 55;
      const upperY = centerY - Math.cos(rad) * 55;
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "10px sans-serif";
      ctx.fillText(`${angle}°`, upperX - 10, upperY);

      // Lower markers
      const lowerX = centerX + Math.sin(rad) * 55;
      const lowerY = centerY + Math.cos(rad) * 55;
      ctx.fillText(`${angle}°`, lowerX - 10, lowerY + 10);
    }

    if (showLaser) {
      // Calculate light ray positions
      const incidentRad = (angleOfIncidence * Math.PI) / 180;
      const refractedRad = (angleOfRefraction * Math.PI) / 180;

      // Incident ray (from top-left to center)
      const rayLength = 180;
      const incidentStartX = centerX - Math.sin(incidentRad) * rayLength;
      const incidentStartY = centerY - Math.cos(incidentRad) * rayLength;

      // Refracted ray (from center to bottom)
      const refractedEndX = centerX + Math.sin(refractedRad) * rayLength;
      const refractedEndY = centerY + Math.cos(refractedRad) * rayLength;

      // Draw laser glow effect
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 15;

      // Draw incident ray
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(incidentStartX, incidentStartY);
      ctx.lineTo(centerX, centerY);
      ctx.stroke();

      // Draw arrow on incident ray
      const arrowSize = 10;
      const arrowAngle = Math.PI / 6;
      const incidentArrowX = centerX - Math.sin(incidentRad) * 50;
      const incidentArrowY = centerY - Math.cos(incidentRad) * 50;

      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(
        incidentArrowX - arrowSize * Math.sin(incidentRad - arrowAngle),
        incidentArrowY - arrowSize * Math.cos(incidentRad - arrowAngle)
      );
      ctx.lineTo(incidentArrowX, incidentArrowY);
      ctx.lineTo(
        incidentArrowX - arrowSize * Math.sin(incidentRad + arrowAngle),
        incidentArrowY - arrowSize * Math.cos(incidentRad + arrowAngle)
      );
      ctx.closePath();
      ctx.fill();

      // Draw refracted ray
      ctx.strokeStyle = "#f97316";
      ctx.shadowColor = "#f97316";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(refractedEndX, refractedEndY);
      ctx.stroke();

      // Draw arrow on refracted ray
      const refractedArrowX = centerX + Math.sin(refractedRad) * 80;
      const refractedArrowY = centerY + Math.cos(refractedRad) * 80;

      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.moveTo(
        refractedArrowX + arrowSize * Math.sin(refractedRad - arrowAngle),
        refractedArrowY + arrowSize * Math.cos(refractedRad - arrowAngle)
      );
      ctx.lineTo(refractedArrowX, refractedArrowY);
      ctx.lineTo(
        refractedArrowX + arrowSize * Math.sin(refractedRad + arrowAngle),
        refractedArrowY + arrowSize * Math.cos(refractedRad + arrowAngle)
      );
      ctx.closePath();
      ctx.fill();

      // Reset shadow
      ctx.shadowBlur = 0;

      // Draw angle arcs
      ctx.lineWidth = 2;

      // Incident angle arc
      ctx.strokeStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, -Math.PI / 2 - incidentRad, -Math.PI / 2);
      ctx.stroke();

      // Refracted angle arc
      ctx.strokeStyle = "#34d399";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, Math.PI / 2, Math.PI / 2 + refractedRad);
      ctx.stroke();

      // Draw angle labels
      ctx.font = "bold 14px sans-serif";

      // Incident angle label
      ctx.fillStyle = "#fbbf24";
      const incLabelX = centerX - Math.sin(incidentRad / 2) * 70;
      const incLabelY = centerY - Math.cos(incidentRad / 2) * 70;
      ctx.fillText(`θ₁ = ${angleOfIncidence}°`, incLabelX - 25, incLabelY);

      // Refracted angle label
      ctx.fillStyle = "#34d399";
      const refLabelX = centerX + Math.sin(refractedRad / 2) * 70;
      const refLabelY = centerY + Math.cos(refractedRad / 2) * 70;
      ctx.fillText(`θ₂ = ${angleOfRefraction.toFixed(1)}°`, refLabelX - 25, refLabelY + 10);

      // Draw laser source icon
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(incidentStartX, incidentStartY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fecaca";
      ctx.font = "12px sans-serif";
      ctx.fillText("LASER", incidentStartX - 20, incidentStartY - 15);
    }

    // Draw interface point
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [angleOfIncidence, angleOfRefraction, showLaser]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        className="w-full rounded-lg border border-slate-600"
      />
      <div className="absolute bottom-4 right-4 bg-slate-900/80 px-3 py-2 rounded-lg text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span>Incident Ray</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
          <span>Refracted Ray</span>
        </div>
      </div>
    </div>
  );
}
