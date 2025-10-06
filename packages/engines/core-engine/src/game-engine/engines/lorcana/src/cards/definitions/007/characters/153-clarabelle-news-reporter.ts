import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const clarabelleNewsReporter: LorcanaCharacterCardDefinition = {
  id: "ftn",
  name: "Clarabelle",
  title: "News Reporter",
  characteristics: ["storyborn", "ally"],
  text: "SUPPORTBREAKING STORY Your other characters with Support gain +1 {S}.",
  type: "character",
  abilities: [
    supportAbility,
    {
      type: "static",
      ability: "effects",
      name: "BREAKING STORY",
      text: "Your other characters with Support gain +1 {S}.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "add",
          target: {
            type: "card",
            value: "all",
            excludeSelf: true,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "ability", value: "support" },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 3,
  illustrator: "Stefano Spagnuolo",
  number: 153,
  set: "007",
  rarity: "rare",
  lore: 2,
};
