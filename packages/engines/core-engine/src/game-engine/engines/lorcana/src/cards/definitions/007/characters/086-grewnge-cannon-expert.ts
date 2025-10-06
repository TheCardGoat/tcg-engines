import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const grewngeCannonExpert: LorcanaCharacterCardDefinition = {
  id: "ewo",
  name: "Grewnge",
  title: "Cannon Expert",
  characteristics: ["storyborn", "ally", "pirate"],
  text: "RAPID FIRE Whenever this character quests, you pay 1 {I} less for the next action you play this turn.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "RAPID FIRE",
      text: "Whenever this character quests, you pay 1 {I} less for the next action you play this turn.",
      effects: [
        {
          type: "replacement",
          replacement: "cost",
          duration: "next",
          amount: 1,
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "type", value: "action" }],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Siriapong Silaya / Mario Manzanares",
  number: 86,
  set: "007",
  rarity: "common",
  lore: 1,
};
