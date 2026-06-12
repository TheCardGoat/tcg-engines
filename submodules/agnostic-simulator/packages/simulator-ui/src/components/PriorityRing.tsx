interface PriorityRingProps {
  active?: boolean;
  size?: number;
}

export function PriorityRing({ active = false, size = 48 }: PriorityRingProps) {
  const radius = size / 2 - 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = active ? 0 : circumference;

  return (
    <svg
      className={active ? "priority-ring active" : "priority-ring"}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--game-accent)"
        strokeWidth="2.5"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        opacity={active ? "0.9" : "0"}
        style={{ transition: "stroke-dashoffset 0.4s ease-out, opacity 0.3s ease" }}
      />
    </svg>
  );
}
