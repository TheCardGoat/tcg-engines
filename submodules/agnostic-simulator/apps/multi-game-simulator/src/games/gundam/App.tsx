import { useEffect, type ReactNode } from "react";
import { Router } from "./Router";

export interface GundamSimulatorAppProps {
  basename?: string;
}

export interface GundamSimulatorProvidersProps {
  children: ReactNode;
}

export function GundamSimulatorProviders({ children }: GundamSimulatorProvidersProps) {
  useEffect(() => {
    void import("./src/index.css");
    document.body.classList.add("gundam-simulator-active");

    return () => {
      document.body.classList.remove("gundam-simulator-active");
    };
  }, []);

  return <div className="gundam-simulator-root">{children}</div>;
}

export function GundamSimulatorApp({ basename }: GundamSimulatorAppProps) {
  return (
    <GundamSimulatorProviders>
      <Router basename={basename} />
    </GundamSimulatorProviders>
  );
}

export default GundamSimulatorApp;
