import "@mantine/core/styles.css";

import { useEffect, type ReactNode } from "react";
import { MantineProvider } from "@mantine/core";

export interface NarutoSimulatorProvidersProps {
  children: ReactNode;
}

/**
 * App-level providers for the naruto surface (route registry wraps every
 * naruto page in this). Loads surface styles, marks the body so the page
 * chrome matches the board, and scopes Mantine for useMediaQuery.
 */
export function NarutoSimulatorProviders({ children }: NarutoSimulatorProvidersProps) {
  useEffect(() => {
    void import("./styles.css");
    document.body.classList.add("naruto-active");

    return () => {
      document.body.classList.remove("naruto-active");
    };
  }, []);

  return (
    <MantineProvider defaultColorScheme="dark">
      <div className="naruto-root" data-game="naruto">
        {children}
      </div>
    </MantineProvider>
  );
}

export default NarutoSimulatorProviders;
