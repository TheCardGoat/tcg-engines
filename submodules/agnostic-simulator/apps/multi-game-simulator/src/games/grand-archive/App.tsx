import { useEffect, type ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { DefaultSimulatorEntityVisual, SimulatorEntityVisualProvider } from "@tcg/simulator-ui";
import "./grand-archive.css";
import { GrandArchiveCardPreviewProvider } from "./GrandArchiveCardPreview";

export function GrandArchiveSimulatorProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add("ga-simulator-active");
    return () => document.body.classList.remove("ga-simulator-active");
  }, []);

  return (
    <MantineProvider defaultColorScheme="dark">
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <GrandArchiveCardPreviewProvider>
          <div className="ga-simulator-root" data-game="grand-archive">
            {children}
          </div>
        </GrandArchiveCardPreviewProvider>
      </SimulatorEntityVisualProvider>
    </MantineProvider>
  );
}
