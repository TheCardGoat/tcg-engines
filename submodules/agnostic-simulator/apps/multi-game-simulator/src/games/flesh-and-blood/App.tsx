import { useEffect, useState, type ReactNode } from "react";

import { FabAutomationSettingsProvider } from "./fab-automation-settings";
import { FabRoutePresentationCatalog, useFabPresentationSnapshot } from "./FabPresentationCatalog";
import "./flesh-and-blood.css";
import "./flesh-and-blood-board-layout.css";

export function FleshAndBloodSimulatorProviders({ children }: { children: ReactNode }) {
  return (
    <FabRoutePresentationCatalog>
      <FabSimulatorSurface>{children}</FabSimulatorSurface>
    </FabRoutePresentationCatalog>
  );
}

function FabSimulatorSurface({ children }: { children: ReactNode }) {
  const presentation = useFabPresentationSnapshot();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
    document.body.classList.add("fab-simulator-active");
    return () => {
      document.body.classList.remove("fab-simulator-active");
    };
  }, []);

  return (
    <div
      className="fab-simulator-root"
      data-game="flesh-and-blood"
      data-fab-hydrated={hydrated ? "true" : "false"}
      data-fab-presentation-state={presentation.status}
    >
      <FabAutomationSettingsProvider>{children}</FabAutomationSettingsProvider>
    </div>
  );
}
