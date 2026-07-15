interface TargetingSpotlightProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  width: number;
  height: number;
  spotlightRadius?: number;
}

export function TargetingSpotlight({
  sourceX,
  sourceY,
  targetX,
  targetY,
  width,
  height,
  spotlightRadius = 180,
}: TargetingSpotlightProps) {
  return (
    <svg
      className="targeting-spotlight pointer-events-none absolute inset-0 z-20"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient
          id="spotlight-source"
          cx={sourceX}
          cy={sourceY}
          r={spotlightRadius}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="70%" stopColor="black" stopOpacity="0.3" />
          <stop offset="100%" stopColor="black" stopOpacity="0.65" />
        </radialGradient>
        <radialGradient
          id="spotlight-target"
          cx={targetX}
          cy={targetY}
          r={spotlightRadius * 0.8}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="60%" stopColor="black" stopOpacity="0.25" />
          <stop offset="100%" stopColor="black" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill="url(#spotlight-source)" />
      <rect x="0" y="0" width={width} height={height} fill="url(#spotlight-target)" />
    </svg>
  );
}
