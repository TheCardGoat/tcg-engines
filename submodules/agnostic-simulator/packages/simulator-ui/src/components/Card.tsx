import type { SimulatorEntity } from "@tcg/simulator-contract";

import { CardFace } from "./CardFace";

export interface CardProps {
  entity: SimulatorEntity;
  density?: "compact" | "normal" | "large";
  selected?: boolean;
}

export function Card({ entity, density = "normal", selected = false }: CardProps) {
  const faceDensity = density === "compact" ? "compact" : density === "large" ? "large" : "normal";
  return <CardFace entity={entity} density={faceDensity} selected={selected} />;
}
