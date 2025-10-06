import { whenThisCharChallengesAndIsBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princePhillipDragonSlayer: LorcanaCharacterCardDefinition = {
  id: "u23",
  name: "Prince Phillip",
  title: "Dragonslayer",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**HEROISM** When this character challenges and is banished, you may banish the challenged character.",
  type: "character",
  abilities: [
    whenThisCharChallengesAndIsBanished({
      name: "HEROISM",
      text: "When this character challenges and is banished, you may banish the challenged character.",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "challenge", value: "defender" }],
          },
        },
      ],
    }),
  ],
  flavour:
    "The road to true love may be barred by still many more dangers, which you alone will have to face. −Flora",
  colors: ["amber"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Philipp Kruse",
  number: 16,
  set: "TFC",
  rarity: "uncommon",
};
