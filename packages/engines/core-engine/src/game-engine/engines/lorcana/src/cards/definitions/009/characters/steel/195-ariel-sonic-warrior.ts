import { arielSonicWarrior as ogArielSonicWarrior } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/175-ariel-sonic-warrior";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arielSonicWarrior: LorcanaCharacterCardDefinition = {
  ...ogArielSonicWarrior,
  id: "hbk",
  reprints: [ogArielSonicWarrior.id],
  number: 195,
  set: "009",
};
