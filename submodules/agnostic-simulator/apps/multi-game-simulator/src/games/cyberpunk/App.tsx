import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./tokens.css";

import { useEffect, useState, type ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { CardPreviewProvider } from "./components/CardPreview/CardPreviewContext";
import { injectDicierFonts } from "./components/DieAssets/dieAssets";
import { CardInspectProvider } from "./components/GameBoard/CardInspectContext";
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

function ClientNotifications() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <Notifications position="top-right" /> : null;
}

export function CyberpunkSimulatorProviders({ children }: CyberpunkSimulatorProvidersProps) {
  useEffect(() => injectDicierFonts(), []);
  return (
    <UserConfigProvider>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <ClientNotifications />
        <AuthSessionBootstrap />
        <CardInspectProvider>
          <CardPreviewProvider>{children}</CardPreviewProvider>
        </CardInspectProvider>
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
