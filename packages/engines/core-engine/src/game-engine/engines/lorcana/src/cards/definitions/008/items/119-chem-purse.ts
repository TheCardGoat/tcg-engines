import { wheneverYouPlayACharacter } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const chemPurse: LorcanaItemCardDefinition = {
  id: "xcs",
  name: "Chem Purse",
  characteristics: ["item"],
  text: "HERE'S THE BEST PART Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.",
  type: "item",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Jared Nickel",
  number: 119,
  set: "008",
  rarity: "common",
  abilities: [
    wheneverYouPlayACharacter({
      name: "HERE'S THE BEST PART",
      text: "Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.",
      hasShifted: true,
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 4,
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "trigger" }],
          },
        },
      ],
    }),
  ],
};
