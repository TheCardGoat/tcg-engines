import "@mantine/core/styles.css";

import { useEffect, type ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { DefaultSimulatorEntityVisual, SimulatorEntityVisualProvider } from "@tcg/simulator-ui";

export interface AlphaClashSimulatorProvidersProps {
  children: ReactNode;
}

export function AlphaClashSimulatorProviders({ children }: AlphaClashSimulatorProvidersProps) {
  useEffect(() => {
    document.body.classList.add("alpha-clash-active");
    return () => {
      document.body.classList.remove("alpha-clash-active");
    };
  }, []);

  return (
    <MantineProvider defaultColorScheme="light">
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <div className="alpha-clash-root">{children}</div>
      </SimulatorEntityVisualProvider>
    </MantineProvider>
  );
}

export default AlphaClashSimulatorProviders;
