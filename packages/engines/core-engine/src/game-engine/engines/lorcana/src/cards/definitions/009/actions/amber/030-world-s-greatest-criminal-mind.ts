import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { worldsGreatestCriminalMind as ogWorldsGreatestCriminalMind } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions/031-worlds-greatest-criminal-mind";

export const worldsGreatestCriminalMind: LorcanaActionCardDefinition = {
  ...ogWorldsGreatestCriminalMind,
  id: "qp7",
  reprints: [ogWorldsGreatestCriminalMind.id],
  number: 30,
  set: "009",
};
