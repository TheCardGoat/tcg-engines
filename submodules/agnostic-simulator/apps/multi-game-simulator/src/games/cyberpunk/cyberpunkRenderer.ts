import type { ComponentType } from "react";
import type { SimulatorRendererPackage, SimulatorRendererProps } from "@tcg/simulator-contract";

import { CyberpunkVersionedBoard } from "./components/BoardV2/version";
import { CyberpunkInteractionPanel } from "./components/CyberpunkInteractionPanel";

export type CyberpunkRendererComponent = ComponentType<SimulatorRendererProps>;

export const cyberpunkRendererPackage: SimulatorRendererPackage<CyberpunkRendererComponent> = {
  BoardRenderer: CyberpunkVersionedBoard,
  InteractionRenderer: CyberpunkInteractionPanel,
};
