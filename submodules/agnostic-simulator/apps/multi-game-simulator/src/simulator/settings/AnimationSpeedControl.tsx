import { Gauge } from "lucide-react";
import { useSimulatorSettings } from "./SimulatorSettingsProvider";
import { normalizeAnimationSpeed, type AnimationSpeed } from "./simulator-settings";

const ANIMATION_SPEED_OPTIONS: ReadonlyArray<{ value: AnimationSpeed; label: string }> = [
  { value: "off", label: "Off" },
  { value: "fast", label: "Fast" },
  { value: "normal", label: "Normal" },
  { value: "slow", label: "Slow" },
];

export function AnimationSpeedControl({
  className,
  label = "Animation speed",
}: {
  readonly className?: string;
  readonly label?: string;
}) {
  const {
    settings: { animationSpeed },
    setAnimationSpeed,
  } = useSimulatorSettings();

  return (
    <label className={className} style={{ display: "grid", gap: 6, minWidth: 0 }}>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 0,
        }}
      >
        <Gauge size={15} aria-hidden="true" />
        <span>{label}</span>
      </span>
      <select
        id="player-animation-speed-select"
        aria-label={label}
        value={animationSpeed}
        onChange={(event) => setAnimationSpeed(normalizeAnimationSpeed(event.currentTarget.value))}
        style={{ width: "100%", minHeight: 32 }}
      >
        {ANIMATION_SPEED_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span style={{ fontSize: 11, lineHeight: 1.35, opacity: 0.78 }}>
        Adjust how fast board animations play.
      </span>
    </label>
  );
}
