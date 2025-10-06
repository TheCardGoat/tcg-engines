import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const auroraHoldingCourt: LorcanitoCharacterCardDefinition = {
  id: "ahc",
  name: "Aurora",
  title: "Holding Court",
  characteristics: ["storyborn", "hero", "princess"],
  text: "ROYAL WELCOME Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.",
  type: "character",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  strength: 1,
  willpower: 2,
  illustrator: "",
  number: 6,
  set: "009",
  rarity: "common",
  lore: 1,
  abilities: [
    wheneverQuests({
      name: "ROYAL WELCOME",
      text: "Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.",
      effects: [
        {
          type: "replacement",
          replacement: "cost",
          duration: "next",
          amount: 1,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "type", value: "character" },
              {
                filter: "characteristics",
                value: ["princess", "queen"],
                conjunction: "or",
              },
            ],
          },
        },
      ],
    }),
  ],
};
