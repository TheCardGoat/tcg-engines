import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./tokens.css";

import { useEffect, type ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { CardInspectProvider } from "./components/GameBoard/CardInspectContext";
import { CardPreviewProvider } from "./components/GameBoard/CardPreviewContext";
import { DragDropProvider } from "./components/GameBoard";
import { injectDicierFonts } from "./components/GameBoard/dieAssets";
import { AuthSessionBootstrap } from "./auth/AuthSessionBootstrap";
import { Router } from "./Router";
import { theme } from "./theme";
import { UserConfigProvider } from "./engine";

export interface CyberpunkSimulatorAppProps {
  basename?: string;
}

export interface CyberpunkSimulatorProvidersProps {
  children: ReactNode;
}

export function CyberpunkSimulatorProviders({ children }: CyberpunkSimulatorProvidersProps) {
  useEffect(() => injectDicierFonts(), []);
  return (
    <UserConfigProvider>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <Notifications position="top-right" />
        <AuthSessionBootstrap />
        <CardPreviewProvider>
          <CardInspectProvider>
            <DragDropProvider>{children}</DragDropProvider>
          </CardInspectProvider>
        </CardPreviewProvider>
      </MantineProvider>
    </UserConfigProvider>
  );
}

export function CyberpunkSimulatorApp({ basename }: CyberpunkSimulatorAppProps) {
  return (
    <CyberpunkSimulatorProviders>
      <Router basename={basename} />
    </CyberpunkSimulatorProviders>
  );
}

export default CyberpunkSimulatorApp;
