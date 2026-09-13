import type { SimulatorValueDeltaVisualProps } from "@tcg/simulator-ui";
import { Shield, Swords } from "lucide-react";

import { FabOfficialIcon } from "./FabIconography";

type DeltaIcon = "life" | "resource" | "chi" | "power" | "defense" | "action" | "shield";

export function FabValueDeltaVisual({ step }: SimulatorValueDeltaVisualProps) {
  const presentation = deltaPresentation(step.label, step.delta);
  const direction = step.delta < 0 ? "loss" : "gain";
  const destination =
    step.toValue === undefined ? "" : `, ${presentation.destinationLabel} ${step.toValue}`;

  return (
    <span
      className="fab-life-delta"
      data-direction={direction}
      data-kind={presentation.kind}
      data-testid="fab-value-delta"
      role="status"
      aria-label={`${Math.abs(step.delta)} ${presentation.label.toLocaleLowerCase()}${destination}`}
    >
      <span className="fab-life-delta-icon" aria-hidden="true">
        <DeltaIcon icon={presentation.icon} />
      </span>
      <span className="fab-life-delta-copy">
        <strong>{step.delta > 0 ? `+${step.delta}` : step.delta}</strong>
        <span>{presentation.label}</span>
        {step.fromValue !== undefined && step.toValue !== undefined ? (
          <small>
            {step.fromValue} → {step.toValue}
          </small>
        ) : null}
      </span>
    </span>
  );
}

function DeltaIcon({ icon }: { readonly icon: DeltaIcon }) {
  switch (icon) {
    case "action":
      return <Swords size={28} strokeWidth={1.8} />;
    case "shield":
      return <Shield size={28} strokeWidth={1.8} />;
    default:
      return <FabOfficialIcon id={icon} size={32} />;
  }
}

function deltaPresentation(label: string | undefined, delta: number) {
  switch (label) {
    case "damage":
      return {
        kind: "damage",
        icon: "life",
        label: "Damage",
        destinationLabel: "life remaining",
      } as const;
    case "life":
      return {
        kind: "life",
        icon: "life",
        label: delta < 0 ? "Life lost" : "Life gained",
        destinationLabel: "life total",
      } as const;
    case "resource":
    case "resources":
      return {
        kind: "resource",
        icon: "resource",
        label: delta < 0 ? "Resources spent" : "Resources gained",
        destinationLabel: "resources",
      } as const;
    case "chi":
      return { kind: "chi", icon: "chi", label: "Chi", destinationLabel: "chi" } as const;
    case "action":
    case "actionPoints":
      return {
        kind: "action",
        icon: "action",
        label: delta < 0 ? "Action point spent" : "Action point gained",
        destinationLabel: "action points",
      } as const;
    case "prevented":
      return {
        kind: "prevented",
        icon: "shield",
        label: "Damage prevented",
        destinationLabel: "prevented",
      } as const;
    case "power":
      return { kind: "power", icon: "power", label: "Power", destinationLabel: "power" } as const;
    case "defense":
      return {
        kind: "defense",
        icon: "defense",
        label: "Defense",
        destinationLabel: "defense",
      } as const;
    default:
      return {
        kind: "counter",
        icon: "shield",
        label: label ? `${label} counter` : "Counter",
        destinationLabel: label ?? "counter",
      } as const;
  }
}
