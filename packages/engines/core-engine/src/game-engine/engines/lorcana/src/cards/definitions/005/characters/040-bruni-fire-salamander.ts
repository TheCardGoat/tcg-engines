import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { whenThisCharacterBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bruniFireSalamander: LorcanaCharacterCardDefinition = {
  id: "dbe",
  missingTestCase: true,
  name: "Bruni",
  title: "Fire Salamander",
  characteristics: ["storyborn", "ally"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_ **PARTING GIFT** When this character is banished, you may draw a card.",
  type: "character",
  abilities: [
    evasiveAbility,
    whenThisCharacterBanished({
      name: "Parting Gift",
      text: "When this character is banished, you may draw a card.",
      optional: true,
      effects: [drawACard],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 2,
  illustrator: "Kendall Hale",
  number: 40,
  set: "SSK",
  rarity: "uncommon",
};
