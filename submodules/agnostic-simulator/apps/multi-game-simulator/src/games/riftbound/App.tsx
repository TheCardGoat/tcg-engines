import type { ReactNode } from "react";

export function RiftboundSimulatorProviders({ children }: { children: ReactNode }) {
  return <div data-game="riftbound">{children}</div>;
}
