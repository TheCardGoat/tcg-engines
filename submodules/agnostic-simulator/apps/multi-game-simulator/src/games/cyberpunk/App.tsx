import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./tokens.css";

import { useEffect, type ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { CardPreviewProvider } from "./components/CardPreview/CardPreviewContext";
import { injectDicierFonts } from "./components/DieAssets/dieAssets";
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
        <CardPreviewProvider>{children}</CardPreviewProvider>
      </MantineProvider>
    </UserConfigProvider>
  );
}

export function CyberpunkSimulatorApp({ basename }: CyberpunkSimulatorAppProps) {
  return (
    <CyberpunkSimulatorProviders>
      <div data-game="cyberpunk" className="min-h-svh">
        <Router basename={basename} />
      </div>
    </CyberpunkSimulatorProviders>
  );
}

export default CyberpunkSimulatorApp;
