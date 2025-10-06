import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tiggerOneOfAKind: LorcanaCharacterCardDefinition = {
  id: "gaw",
  name: "Tigger",
  title: "One of a Kind",
  characteristics: ["dreamborn", "tigger"],
  text: "**ENERGETIC** Whenever you play an action, this character gets +2 {S} this turn.",
  type: "character",
  abilities: [
    wheneverPlays({
      name: "Enegetic",
      text: "Whenever you play an action, this character gets +2 {S} this turn.",
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "action" },
          { filter: "characteristics", value: ["action"] },
          { filter: "owner", value: "self" },
        ],
      },
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "self" }],
          },
        },
      ],
    }),
  ],
  flavour: "Bouncing in to save the day!",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "P. Gaylord / L. Giammichele",
  number: 127,
  set: "ROF",
  rarity: "common",
};
