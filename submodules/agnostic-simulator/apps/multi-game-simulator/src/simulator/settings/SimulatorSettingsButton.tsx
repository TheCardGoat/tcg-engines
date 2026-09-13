import { useState } from "react";
import { Settings } from "lucide-react";
import { SimulatorSettingsDialog } from "../participant-actions/SimulatorParticipantActions";

// SETTINGS PARITY: keep in sync with the platform web app's PlayerSettingsDialog.svelte.
// Naruto/Riftbound do not consume the shared card-interaction preference.
export function SimulatorSettingsButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" aria-label="Settings" onClick={() => setOpen(true)}>
        <Settings size={16} aria-hidden="true" /> Settings
      </button>
      {open ? (
        <SimulatorSettingsDialog
          gameConfiguration={{
            onSelect: () => undefined,
            settings: <p>There are no additional game preferences for this game.</p>,
          }}
          accountSettingsHref="/dashboard/settings"
          showCardInteraction={false}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
