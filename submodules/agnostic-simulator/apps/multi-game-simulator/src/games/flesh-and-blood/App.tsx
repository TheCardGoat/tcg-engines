import { useEffect, type ReactNode } from "react";

import { FabAutomationSettingsProvider } from "./fab-automation-settings";
import { FabRoutePresentationCatalog } from "./FabPresentationCatalog";
import "./flesh-and-blood.css";
import "./flesh-and-blood-board-layout.css";

export function FleshAndBloodSimulatorProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add("fab-simulator-active");
    return () => {
      document.body.classList.remove("fab-simulator-active");
    };
  }, []);

  return (
    <div className="fab-simulator-root" data-game="flesh-and-blood">
      <FabRoutePresentationCatalog>
        <FabAutomationSettingsProvider>{children}</FabAutomationSettingsProvider>
      </FabRoutePresentationCatalog>
    </div>
  );
}
