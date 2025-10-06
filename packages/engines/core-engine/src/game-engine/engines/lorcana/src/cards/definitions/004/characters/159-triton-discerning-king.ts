import {
  mayBanish,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tritonDiscerningKing: LorcanitoCharacterCardDefinition = {
  id: "w33",
  missingTestCase: true,
  name: "Triton",
  title: "Discerning King",
  characteristics: ["storyborn", "king"],
  text: "**CONSIGN TO THE DEPTHS** {E}, Banish one of your items − Gain 3 lore.",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "Consign To The Depths",
      text: "{E}, Banish one of your items − Gain 3 lore.",
      costs: [{ type: "exert" }],
      effects: [
        mayBanish({
          type: "card",
          value: 1,
          filters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "item" },
            { filter: "zone", value: "play" },
          ],
        }),
        youGainLore(3),
      ],
    },
  ],
  flavour: "If this is the only way, so be it.",
  colors: ["sapphire"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Diogo Saito",
  number: 159,
  set: "URR",
  rarity: "rare",
};
