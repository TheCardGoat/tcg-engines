import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hansNobleScoundrel: LorcanaCharacterCardDefinition = {
  id: "zqc",
  reprints: ["e93"],
  missingTestCase: true,
  name: "Hans",
  title: "Noble Scoundrel",
  characteristics: ["storyborn", "villain", "prince"],
  text: "**ROYAL SCHEMES** When you play this characer, if a Princess or Queen character is in play, gain 1 lore.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Royal Schemes",
      text: "When you play this character, if a Princess or Queen character is in play, gain 1 lore.",
      resolutionConditions: [
        {
          type: "filter",
          comparison: { operator: "gte", value: 1 },
          filters: [
            ...chosenCharacter.filters,
            {
              filter: "characteristics",
              conjunction: "or",
              value: ["princess", "queen"],
            },
          ],
        },
      ],
      effects: [youGainLore(1)],
    },
  ],
  flavour:
    "Hans was confident he could bring Anna to Ursula — all he needed was something of Kristoff's to lure her in.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  illustrator: "Dustin Panzino / Leonardo Giammichele",
  number: 146,
  set: "URR",
  rarity: "common",
};
