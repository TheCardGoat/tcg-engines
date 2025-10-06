import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mrsPottsHeadHousekeeper: LorcanaCharacterCardDefinition = {
  id: "wue",
  name: "Mrs. Potts",
  title: "Head Housekeeper",
  characteristics: ["storyborn", "ally"],
  text: "CLEAN UP {E}, Banish one of your items – Draw a card.",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "CLEAN UP",
      text: "{E}, Banish one of your items – Draw a card.",
      costs: [{ type: "exert" }],
      resolveEffectsIndividually: true,
      dependentEffects: true,
      effects: [
        drawACard,
        {
          type: "banish",
          amount: 1,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "item" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 2,
  willpower: 4,
  illustrator: "Julie Vu",
  number: 161,
  set: "008",
  rarity: "common",
  lore: 1,
};
