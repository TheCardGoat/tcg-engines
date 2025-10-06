import { brunoMadrigalUndetectedUncle as ogBrunoMadrigalUndetectedUncle } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/039-bruno-madrigal-undetected-uncle";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const brunoMadrigalUndetectedUncle: LorcanaCharacterCardDefinition = {
  ...ogBrunoMadrigalUndetectedUncle,
  id: "tiq",
  reprints: [ogBrunoMadrigalUndetectedUncle.id],
  number: 0,
  set: "009",
};
