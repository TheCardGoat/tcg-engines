import { targetCharacterGains } from "~/game-engine/engines/lorcana/src/abilities";
import { entersPlayExerted } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const figaroTuxedoCat: LorcanaCharacterCardDefinition = {
  id: "u7y",
  name: "Figaro",
  title: "Tuxedo Cat",
  characteristics: ["storyborn", "ally"],
  text: "PLAYFULNESS Opposing items enter play exerted.",
  type: "character",
  abilities: [
    targetCharacterGains({
      name: "PLAYFULNESS",
      text: "Opposing items enter play exerted.",
      gainedAbility: entersPlayExerted({
        name: "PLAYFULNESS",
      }),
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "type", value: "item" },
          { filter: "owner", value: "opponent" },
          { filter: "zone", value: "play" },
        ],
      },
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 3,
  willpower: 3,
  illustrator: "Saulo Nate",
  number: 133,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
