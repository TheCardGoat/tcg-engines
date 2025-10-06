import { worldsGreatestCriminalMind as ogWorldsGreatestCriminalMind } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions/031-worlds-greatest-criminal-mind";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const worldsGreatestCriminalMind: LorcanaActionCardDefinition = {
  ...ogWorldsGreatestCriminalMind,
  id: "qp7",
  reprints: [ogWorldsGreatestCriminalMind.id],
  number: 30,
  set: "009",
};
