import "@mantine/core/styles.css";

import { useEffect, type ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { DefaultSimulatorEntityVisual, SimulatorEntityVisualProvider } from "@tcg/simulator-ui";
import { Router } from "./Router";

export interface OnePieceSimulatorAppProps {
  basename?: string;
}

export interface OnePieceSimulatorProvidersProps {
  children: ReactNode;
}

export function OnePieceSimulatorProviders({ children }: OnePieceSimulatorProvidersProps) {
  useEffect(() => {
    void import("./styles.css");
    document.body.classList.add("one-piece-active");

    return () => {
      document.body.classList.remove("one-piece-active");
    };
  }, []);

  return (
    <MantineProvider defaultColorScheme="light">
      <SimulatorEntityVisualProvider renderer={DefaultSimulatorEntityVisual}>
        <div className="one-piece-root">{children}</div>
      </SimulatorEntityVisualProvider>
    </MantineProvider>
  );
}

export function OnePieceSimulatorApp({ basename }: OnePieceSimulatorAppProps) {
  return (
    <OnePieceSimulatorProviders>
      <Router basename={basename} />
    </OnePieceSimulatorProviders>
  );
}

export default OnePieceSimulatorApp;
