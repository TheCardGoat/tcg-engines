import { herculesTrueHero as ogHerculesTrueHero } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/181-hercules-true-hero";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const herculesTrueHero: LorcanaCharacterCardDefinition = {
  ...ogHerculesTrueHero,
  id: "s5k",
  reprints: [ogHerculesTrueHero.id],
  number: 191,
  set: "009",
};
