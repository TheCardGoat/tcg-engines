import { Volume2, VolumeX } from "lucide-react";
import { useSimulatorSettings } from "./SimulatorSettingsProvider";

export function SoundVolumeControl({
  className,
  label = "Sound volume",
}: {
  readonly className?: string;
  readonly label?: string;
}) {
  const {
    settings: { soundVolume },
    setSoundVolume,
  } = useSimulatorSettings();
  const Icon = soundVolume === 0 ? VolumeX : Volume2;

  return (
    <label
      className={className}
      style={{
        display: "grid",
        gap: 6,
        minWidth: 0,
      }}
    >
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
        <Icon size={15} aria-hidden="true" />
        <span>{label}</span>
        <span style={{ marginLeft: "auto", fontVariantNumeric: "tabular-nums" }}>
          {soundVolume}%
        </span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={soundVolume}
        aria-label={label}
        onChange={(event) => setSoundVolume(event.currentTarget.valueAsNumber)}
        style={{ width: "100%" }}
      />
    </label>
  );
}
