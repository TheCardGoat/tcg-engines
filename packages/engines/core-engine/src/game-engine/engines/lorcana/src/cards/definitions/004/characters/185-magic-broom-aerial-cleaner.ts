import {
  duringYourTurnGains,
  evasiveAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicBroomAerialCleaner: LorcanaCharacterCardDefinition = {
  id: "t2t",
  missingTestCase: true,
  name: "Magic Broom",
  title: "Aerial Cleaner",
  characteristics: ["dreamborn", "broom"],
  text: "**WINGED FOR A DAY** During your turn, this character gains **Evasive.** _(They can challenge characters with Evasive.)_",
  type: "character",
  abilities: [
    duringYourTurnGains(
      "WINGED FOR A DAY",
      "During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_",
      evasiveAbility,
    ),
  ],
  flavour:
    "It spends its days keeping the treasured glimmers in the Hall of Lorcana sparkling clean.",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Alibeth Zermeno",
  number: 185,
  set: "URR",
  rarity: "common",
};
