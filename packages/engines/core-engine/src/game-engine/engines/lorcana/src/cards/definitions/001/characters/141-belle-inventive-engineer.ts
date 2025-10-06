import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";

import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
export const belleInventive: LorcanaCharacterCardDefinition = {
  id: "vuf",
  reprints: ["siv"],
  name: "Belle",
  title: "Inventive Engineer",
  characteristics: ["hero", "dreamborn", "inventor", "princess"],
  text: "**TINKER** Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Tinker",
      text: "Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
      effects: [
        {
          type: "replacement",
          replacement: "cost",
          duration: "next",
          amount: 1,
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "type", value: "item" }],
          },
        },
      ],
    }),
  ],
  flavour:
    "A little ingenuity and a lot of heart will take you far in this world.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Gabriel Romero / Pix Smith",
  number: 141,
  set: "TFC",
  rarity: "uncommon",
};
