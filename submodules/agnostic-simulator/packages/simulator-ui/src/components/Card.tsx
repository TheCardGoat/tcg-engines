import type { SimulatorEntity } from "@tcg/simulator-contract";

import { CardFace } from "./CardFace";
import { CardInteractionFrame } from "./CardInteractionFrame";
import {
  cardInteractionStateFromFlags,
  type CardInteractionState,
} from "../interactions/card-interaction";

export interface CardProps {
  entity: SimulatorEntity;
  density?: "compact" | "normal" | "large";
  selected?: boolean;
  interactionState?: CardInteractionState;
  as?: "button" | "div";
}

export function Card({
  entity,
  density = "normal",
  selected = false,
  interactionState,
  as = "button",
}: CardProps) {
  const faceDensity = density === "compact" ? "compact" : density === "large" ? "large" : "normal";
  return (
    <CardInteractionFrame state={interactionState ?? cardInteractionStateFromFlags({ selected })}>
      <CardFace entity={entity} density={faceDensity} selected={selected} as={as} />
    </CardInteractionFrame>
  );
}
