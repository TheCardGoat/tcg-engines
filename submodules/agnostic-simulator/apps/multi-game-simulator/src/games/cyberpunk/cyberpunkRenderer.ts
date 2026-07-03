import type { ComponentType } from "react";
import type { SimulatorRendererPackage, SimulatorRendererProps } from "@tcg/simulator-contract";

import { CyberpunkBoard } from "./components/CyberpunkBoard";
import { CyberpunkInteractionPanel } from "./components/CyberpunkInteractionPanel";

export type CyberpunkRendererComponent = ComponentType<SimulatorRendererProps>;

export const cyberpunkRendererPackage: SimulatorRendererPackage<CyberpunkRendererComponent> = {
  BoardRenderer: CyberpunkBoard,
  InteractionRenderer: CyberpunkInteractionPanel,
};
