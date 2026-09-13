import { useEffect, type ReactNode } from "react";

export interface NarutoSimulatorProvidersProps {
  children: ReactNode;
}

/**
 * App-level providers for the naruto surface (route registry wraps every
 * naruto page in this). Loads surface styles, marks the body so the page
 * chrome matches the board. Native layout state stays in the Naruto surface;
 * the shared viewport shell owns responsive browser chrome.
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
    <div className="naruto-root" data-game="naruto">
      {children}
    </div>
  );
}

export default NarutoSimulatorProviders;
