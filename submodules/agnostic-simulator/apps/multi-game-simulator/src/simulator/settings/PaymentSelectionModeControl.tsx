import { HandCoins } from "lucide-react";
import { useSimulatorSettings } from "./SimulatorSettingsProvider";
import { normalizePaymentSelectionMode, type PaymentSelectionMode } from "./simulator-settings";

const OPTIONS: ReadonlyArray<{ value: PaymentSelectionMode; label: string; description: string }> =
  [
    {
      value: "automatic",
      label: "Automatic",
      description: "Pay with the recommended resources immediately.",
    },
    {
      value: "choose",
      label: "Choose payment",
      description: "Choose exact resources whenever a game supports it.",
    },
  ];

export function PaymentSelectionModeControl({ className }: { readonly className?: string }) {
  const {
    settings: { paymentSelectionMode },
    setPaymentSelectionMode,
  } = useSimulatorSettings();

  return (
    <label className={className} style={{ display: "grid", gap: 6, minWidth: 0 }}>
      <span
        style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800 }}
      >
        <HandCoins size={15} aria-hidden="true" />
        <span>Payment</span>
      </span>
      <select
        aria-label="Payment mode"
        value={paymentSelectionMode}
        onChange={(event) =>
          setPaymentSelectionMode(normalizePaymentSelectionMode(event.currentTarget.value))
        }
        style={{ width: "100%", minHeight: 32 }}
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span style={{ fontSize: 11, lineHeight: 1.35, opacity: 0.78 }}>
        {OPTIONS.find((option) => option.value === paymentSelectionMode)?.description}
      </span>
    </label>
  );
}
